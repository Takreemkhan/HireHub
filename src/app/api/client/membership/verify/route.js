import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

const PLAN_CONFIG = {
  plus: { bitsTotal: 30, label: "Plus" },
  premium: { bitsTotal: 50, label: "Premium" },
  free: { bitsTotal: 15, label: "Free" },
};

/**
 * POST /api/client/membership/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan }
 * Verifies Razorpay payment and saves/updates client subscription in DB.
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
      return NextResponse.json(
        { success: false, message: "All payment fields are required" },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
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

    const planKey = plan.toLowerCase();
    const config = PLAN_CONFIG[planKey];
    if (!config) {
      return NextResponse.json(
        { success: false, message: "Invalid plan" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userId = new ObjectId(auth.userId);

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    console.log("client membership verify");
    await db.collection(COLLECTIONS.CLIENT_SUBSCRIPTIONS).findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          plan: planKey,
          planLabel: config.label,
          bitsTotal: config.bitsTotal,
          bitsUsed: 0,
          subscriptionId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          status: "active",
          startedAt: now,
          expiresAt,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json(
      {
        success: true,
        message: `Successfully upgraded to ${config.label} plan!`,
        subscription: {
          plan: planKey,
          planLabel: config.label,
          bitsTotal: config.bitsTotal,
          bitsUsed: 0,
          bitsRemaining: config.bitsTotal,
          subscriptionId: razorpay_order_id,
          expiresAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Client membership verify error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify payment", error: error.message },
      { status: 500 }
    );
  }
}