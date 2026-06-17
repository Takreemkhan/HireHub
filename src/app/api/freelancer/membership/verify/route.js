import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import { invalidateCache } from "@/lib/redis";

// Static BID_PACKS removed - dynamically managed

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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bidsCount } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bidsCount) {
      return NextResponse.json(
        { success: false, message: "All payment verification fields and bidsCount are required" },
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

    const bidsToAdd = parseInt(bidsCount);
    if (isNaN(bidsToAdd) || bidsToAdd < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid bids count" },
        { status: 400 }
      );
    }

    // Fetch dynamic rates to record accurate USD invoice value
    const plusPlan = await db.collection(COLLECTIONS.FREELANCER_PLAN).findOne({ planKey: "plus" });
    const monthlyAmount = plusPlan?.pricing?.monthly?.amountUSD || 25;
    const monthlyBids = plusPlan?.pricing?.monthly?.bids || 30;

    const costPerBidUSD = monthlyAmount / monthlyBids;
    const amountUSD = Number((costPerBidUSD * bidsToAdd).toFixed(2));

    const packLabel = `${bidsToAdd} Bids`;

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
      packKey: "custom",
      packLabel,
      bidsAdded: bidsToAdd,
      amountUSD,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      purchasedAt: now,
    });

    // ── Return updated balance ─────────────────────────────────────────────
    const updated = await db.collection("freelancer_bids").findOne({ userId });
    const bidsTotal = updated.bidsTotal ?? 0;
    const bidsUsed = updated.bidsUsed ?? 0;
    const bidsRemaining = Math.max(0, bidsTotal - bidsUsed);

    // Invalidate freelancer membership status cache
    await invalidateCache(`api:freelancer:membership:status:${auth.userId}`);

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