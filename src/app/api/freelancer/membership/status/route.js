import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * GET /api/freelancer/membership/status
 * Returns current plan, bitsTotal, bitsUsed, bitsRemaining for the logged-in freelancer.
 * If no subscription exists, returns the default Free plan (15 bits).
 */
export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userId = new ObjectId(auth.userId);

    const sub = await db
      .collection("freelancer_bids")
      .findOne({ userId });

    if (!sub) {
      // Default free plan
      return NextResponse.json({
        success: true,
        subscription: {
          plan: "free",
          planLabel: "Free",
          bitsTotal: 10,
          bitsUsed: 0,
          bitsRemaining: 10,
          subscriptionId: null,
        },
      });
    }

    const bitsRemaining = Math.max(0, sub.bitsTotal - (sub.bitsUsed || 0));

    return NextResponse.json({
      success: true,
      subscription: {
        plan: sub.plan,
        planLabel: sub.planLabel,
        bitsTotal: sub.bitsTotal,
        bitsUsed: sub.bitsUsed || 0,
        bitsRemaining,
        subscriptionId: sub.subscriptionId,
        expiresAt: sub.expiresAt,
      },
    });
  } catch (error) {
    console.error("Membership status error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch membership status" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/freelancer/membership/status (activate free plan)
 * Body: {} — no body needed
 * Creates a free subscription entry if none exists.
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userId = new ObjectId(auth.userId);
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 10); // Free plan never really expires

    await db.collection("freelancer_bids").updateOne(
      { userId },
      {
        $set: {
          userId,
          plan: "free",
          planLabel: "Free",
          bitsTotal: 15,
          bitsUsed: 0,
          subscriptionId: `free_${auth.userId}`,
          paymentId: null,
          status: "active",
          startedAt: now,
          expiresAt,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Free plan activated",
      subscription: {
        plan: "free",
        planLabel: "Free",
        bitsTotal: 15,
        bitsUsed: 0,
        bitsRemaining: 15,
        subscriptionId: `free_${auth.userId}`,
      },
    });
  } catch (error) {
    console.error("Activate free plan error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to activate free plan" },
      { status: 500 }
    );
  }
}
