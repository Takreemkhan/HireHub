import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * GET /api/client/membership/status
 * Returns current plan, connectsTotal, connectsUsed, connectsRemaining for the logged-in client.
 * If no subscription exists, returns the default Free plan (10 connects).
 */
export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userId = new ObjectId(auth.userId);

    const sub = await db
      .collection(COLLECTIONS.CLIENT_SUBSCRIPTIONS)
      .findOne({ userId });

    if (!sub) {
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
    console.error("Client membership status error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch membership status" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/client/membership/status (activate free plan)
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
    expiresAt.setFullYear(expiresAt.getFullYear() + 10);

    await db.collection(COLLECTIONS.CLIENT_SUBSCRIPTIONS).updateOne(
      { userId },
      {
        $setOnInsert: {
          userId,
          plan: "free",
          planLabel: "Free",
          bitsTotal: 10,
          bitsUsed: 0,
          subscriptionId: `free_client_${auth.userId}`,
          paymentId: null,
          status: "active",
          startedAt: now,
          expiresAt,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Free plan activated",
      subscription: {
        plan: "free",
        planLabel: "Free",
        bitsTotal: 10,
        bitsUsed: 0,
        bitsRemaining: 10,
        subscriptionId: `free_client_${auth.userId}`,
      },
    });
  } catch (error) {
    console.error("Client activate free plan error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to activate free plan" },
      { status: 500 }
    );
  }
}