import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * POST /api/wallet/create-order
 * Body: { amount: number }   ← amount in INR (min ₹100)
 * Creates a Razorpay order for wallet top-up
 */
export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { amount } = await req.json();

        if (!amount || typeof amount !== "number" || amount < 1) {
            return NextResponse.json(
                { success: false, message: "Amount must be at least ₹1" },
                { status: 400 }
            );
        }

        const amountInPaise = Math.round(amount * 100);

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `wt_${Date.now()}`,
            notes: {
                userId: auth.userId,
                type: "wallet_topup",
                amountINR: amount,
            },
        });

        return NextResponse.json(
            {
                success: true,
                orderId: order.id,
                amount: amountInPaise,
                currency: "INR",
                keyId: process.env.RAZORPAY_KEY_ID,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Wallet create-order error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create order", error: error.message },
            { status: 500 }
        );
    }
}