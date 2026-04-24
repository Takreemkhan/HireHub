import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

const DEFAULT_PLAN_CONFIG = {
  plus: { bitsTotal: 30, label: "Plus" },
  premium: { bitsTotal: 50, label: "Premium" },
  free: { bitsTotal: 15, label: "Free" },
};

/**
 * Fetches plan config from MongoDB. Falls back to DEFAULT_PLAN_CONFIG.
 */
async function getPlanConfig(db) {
  try {
    const plans = await db
      .collection(COLLECTIONS.FREELANCER_PLAN)
      .find({}, { projection: { _id: 0 } })
      .toArray();

    if (!plans || plans.length === 0) return DEFAULT_PLAN_CONFIG;

    const map = plans.reduce((acc, plan) => {
      acc[plan.planKey] = {
        bitsTotal: plan.bitsTotal,
        label: plan.label,
      };
      return acc;
    }, {});

    // Ensure free plan is always present
    if (!map.free) map.free = DEFAULT_PLAN_CONFIG.free;
    return map;
  } catch (error) {
    console.warn("Could not fetch plan config from DB, using default:", error.message);
    return DEFAULT_PLAN_CONFIG;
  }
}

/**
 * POST /api/freelancer/membership/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan }
 * Verifies Razorpay payment and saves/updates subscription in DB
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);
    console.log("freelancer membership verify")
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
      return NextResponse.json(
        { success: false, message: "All payment fields are required" },
        { status: 400 }
      );
    }

    // Verify signature
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

    const planKey = plan.toLowerCase();
    const PLAN_CONFIG = await getPlanConfig(db);
    const config = PLAN_CONFIG[planKey];
    if (!config) {
      return NextResponse.json(
        { success: false, message: "Invalid plan" },
        { status: 400 }
      );
    }

    const userId = new ObjectId(auth.userId);

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1-month subscription

    // Upsert subscription
    const result = await db.collection("freelancer_bids").findOneAndUpdate(
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
    console.error("Membership verify error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify payment", error: error.message },
      { status: 500 }
    );
  }
}
