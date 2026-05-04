import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * GET /api/freelancer/membership/status
 * Returns bidsTotal, bidsUsed, bidsRemaining for the logged-in freelancer.
 * Bids are a simple consumable — no plan / subscription.
 * New users automatically get 10 free starter bids.
 */
export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userId = new ObjectId(auth.userId);

    const doc = await db.collection("freelancer_bids").findOne({ userId });

    if (!doc) {
      // First time: return default 10 starter bids (no DB write yet)
      return NextResponse.json({
        success: true,
        bidsTotal: 10,
        bidsUsed: 0,
        bidsRemaining: 10,
        // Legacy compat fields kept so old callers don't crash
        subscription: {
          planLabel: "Starter",
          bitsTotal: 10,
          bitsUsed: 0,
          bitsRemaining: 10,
        },
      });
    }

    const bidsTotal = doc.bidsTotal ?? doc.bitsTotal ?? 10;
    const bidsUsed = doc.bidsUsed ?? doc.bitsUsed ?? 0;
    const bidsRemaining = Math.max(0, bidsTotal - bidsUsed);

    return NextResponse.json({
      success: true,
      bidsTotal,
      bidsUsed,
      bidsRemaining,
      // Legacy compat
      subscription: {
        planLabel: "Bids",
        bitsTotal: bidsTotal,
        bitsUsed: bidsUsed,
        bitsRemaining: bidsRemaining,
      },
    });
  } catch (error) {
    console.error("Bids status error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bids status" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/freelancer/membership/status
 * Initialises the bids document for a new user (10 free starter bids).
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userId = new ObjectId(auth.userId);
    const now = new Date();

    await db.collection("freelancer_bids").updateOne(
      { userId },
      {
        $setOnInsert: {
          userId,
          bidsTotal: 10,
          bidsUsed: 0,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Starter bids initialised",
      bidsTotal: 10,
      bidsUsed: 0,
      bidsRemaining: 10,
      subscription: {
        planLabel: "Starter",
        bitsTotal: 10,
        bitsUsed: 0,
        bitsRemaining: 10,
        subscriptionId: `starter_${auth.userId}`,
      },
    });
  } catch (error) {
    console.error("Init bids error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to initialise bids" },
      { status: 500 }
    );
  }
}
