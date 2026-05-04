import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * Fixed bid packs (must match create-order route)
 */
const BID_PACKS = {
  pack10: { bids: 10, amountINR: 199, label: "10 Bids" },
  pack20: { bids: 20, amountINR: 349, label: "20 Bids" },
  pack50: { bids: 50, amountINR: 799, label: "50 Bids" },
};

/**
 * POST /api/freelancer/membership/verify
 *
 * New API:    { razorpay_order_id, razorpay_payment_id, razorpay_signature, packKey }
 * Legacy API: { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan: 'custom', bidsCount }
 *
 * Verifies Razorpay signature, then increments (top-up) the user's bids balance.
 * No subscription, no plan reset — pure top-up.
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    console.log("freelancer bids verify");

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, packKey, plan, bidsCount } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "All payment fields are required" },
        { status: 400 }
      );
    }

    // ── Verify Razorpay signature ──────────────────────────────────────────
    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed – invalid signature" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userId = new ObjectId(auth.userId);
    const now = new Date();

    // ── Determine how many bids to add ────────────────────────────────────
    let bidsToAdd = 0;
    let packLabel = "";

    if (packKey && BID_PACKS[packKey]) {
      // New pack-based flow
      bidsToAdd = BID_PACKS[packKey].bids;
      packLabel = BID_PACKS[packKey].label;
    } else if (plan === "custom" && bidsCount) {
      // Legacy custom flow
      bidsToAdd = parseInt(bidsCount);
      packLabel = `${bidsToAdd} Bids`;
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid pack or bidsCount" },
        { status: 400 }
      );
    }

    if (isNaN(bidsToAdd) || bidsToAdd < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid bids count" },
        { status: 400 }
      );
    }

    // ── Top-up: $inc bidsTotal (existing bids preserved) ──────────────────
    await db.collection("freelancer_bids").updateOne(
      { userId },
      {
        $inc: { bidsTotal: bidsToAdd },
        $set: {
          updatedAt: now,
          lastPaymentId: razorpay_payment_id,
          lastOrderId: razorpay_order_id,
        },
        $setOnInsert: {
          userId,
          bidsUsed: 0,
          createdAt: now,
        },
      },
      { upsert: true }
    );

    // ── Record in bid_purchases for invoice history ────────────────────────
    await db.collection("bid_purchases").insertOne({
      userId,
      packKey: packKey ?? "custom",
      packLabel,
      bidsAdded: bidsToAdd,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      purchasedAt: now,
    });

    // ── Return updated balance ─────────────────────────────────────────────
    const updated = await db.collection("freelancer_bids").findOne({ userId });
    const bidsTotal = updated.bidsTotal ?? 0;
    const bidsUsed = updated.bidsUsed ?? 0;
    const bidsRemaining = Math.max(0, bidsTotal - bidsUsed);

    return NextResponse.json(
      {
        success: true,
        message: `${packLabel} added successfully!`,
        bidsAdded: bidsToAdd,
        bidsTotal,
        bidsUsed,
        bidsRemaining,
        // Legacy compat
        subscription: {
          planLabel: "Bids",
          bitsTotal: bidsTotal,
          bitsUsed: bidsUsed,
          bitsRemaining: bidsRemaining,
          bidsAdded: bidsToAdd,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Bids verify error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify payment", error: error.message },
      { status: 500 }
    );
  }
}