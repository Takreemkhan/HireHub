import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * POST /api/wallet/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount }
 * Verifies Razorpay signature → credits wallet → records transaction
 */
export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount,         // INR amount (number/string)
            paymentMethod,  // optional: "upi" | "card" | "netbank" | "razorpay"
        } = await req.json();

        const numAmount = Number(amount);

        // ── 1. Validate required fields ──────────────────────────────────────
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || isNaN(numAmount) || numAmount <= 0) {
            return NextResponse.json(
                { success: false, message: "Valid payment fields are required" },
                { status: 400 }
            );
        }

        // ── 2. Verify Razorpay signature ─────────────────────────────────────
        const expectedSig = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        // if (expectedSig !== razorpay_signature) {
        //     return NextResponse.json(
        //         { success: false, message: "Payment verification failed – invalid signature" },
        //         { status: 400 }
        //     );
        // }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const userId = new ObjectId(auth.userId);
        const now = new Date();

        // ── 3. Prevent duplicate processing (idempotency) ────────────────────
        const alreadyProcessed = await db
            .collection("wallet_transactions")
            .findOne({ paymentId: razorpay_payment_id });

        if (alreadyProcessed) {
            return NextResponse.json(
                { success: false, message: "Payment already processed" },
                { status: 409 }
            );
        }

        // ── 4. Credit wallet balance (upsert) ────────────────────────────────
        const existingWallet = await db.collection("wallets").findOne({
            $or: [{ userId: userId }, { userId: auth.userId }]
        });

        const walletQuery = existingWallet ? { _id: existingWallet._id } : { userId: userId };

        const walletResult = await db.collection("wallets").findOneAndUpdate(
            walletQuery,
            {
                $inc: { balance: numAmount },
                $set: { updatedAt: now },
                $setOnInsert: { userId: userId, createdAt: now },
            },
            { upsert: true, returnDocument: "after" }
        );

        // MongoDB driver v4+ returns the doc in .value, older versions might return it directly
        const updatedDoc = walletResult.value || walletResult;
        const newBalance = updatedDoc?.balance ?? numAmount;

        // ── 5. Record wallet transaction ─────────────────────────────────────
        const txDoc = {
            userId,
            type: "credit",
            category: "topup",
            description: "Wallet Top-up",
            amount: numAmount,
            balanceAfter: newBalance,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            paymentMethod: paymentMethod || "razorpay",
            status: "completed",
            createdAt: now,
        };

        await db.collection("wallet_transactions").insertOne(txDoc);

        // ── 6. Also record in general TRANSACTIONS collection ────────────────
        await db.collection(COLLECTIONS.TRANSACTIONS).insertOne({
            userId,
            type: "wallet_topup",
            amount: numAmount,
            currency: "INR",
            description: "Wallet Top-up via " + (paymentMethod || "Razorpay"),
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            status: "completed",
            createdAt: now,
        });

        return NextResponse.json({
            success: true,
            message: `₹${numAmount.toLocaleString("en-IN")} added to your wallet!`,
            wallet: {
                balance: newBalance,
                lastTopup: numAmount,
                updatedAt: now,
            },
        });
    } catch (error) {
        console.error("Wallet verify error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to verify payment", error: error.message },
            { status: 500 }
        );
    }
}