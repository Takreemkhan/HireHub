import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * POST /api/freelancer/membership/use-bit
 * Body: { jobId }
 * Deducts 1 bid from the freelancer's balance when they submit a proposal.
 * No plan checks — bids are a simple consumable.
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "jobId is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userId = new ObjectId(auth.userId);
    const now = new Date();

    // Get or auto-create bids document with 10 starter bids
    let doc = await db.collection("freelancer_bids").findOne({ userId });

    if (!doc) {
      await db.collection("freelancer_bids").insertOne({
        userId,
        bidsTotal: 10,
        bidsUsed: 0,
        createdAt: now,
        updatedAt: now,
      });
      doc = await db.collection("freelancer_bids").findOne({ userId });
    }

    const bidsTotal = doc.bidsTotal ?? doc.bitsTotal ?? 10;
    const bidsUsed = doc.bidsUsed ?? doc.bitsUsed ?? 0;
    const bidsRemaining = Math.max(0, bidsTotal - bidsUsed);

    if (bidsRemaining <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "You have no Bids remaining. Buy more Bids to keep applying.",
          code: "NO_BITS_REMAINING",
          bidsRemaining: 0,
          bidsTotal,
          bidsUsed,
        },
        { status: 403 }
      );
    }

    // Deduct 1 bid
    const updated = await db
      .collection("freelancer_bids")
      .findOneAndUpdate(
        { userId },
        {
          $inc: { bidsUsed: 1 },
          $set: { updatedAt: now },
        },
        { returnDocument: "after" }
      );

    const newBidsUsed = updated.bidsUsed ?? updated.bitsUsed ?? 0;
    const newBidsTotal = updated.bidsTotal ?? updated.bitsTotal ?? 10;
    const newBidsRemaining = Math.max(0, newBidsTotal - newBidsUsed);

    // Record bid usage
    await db.collection("bids").insertOne({
      freelancerId: userId,
      jobId,
      bidsSpent: 1,
      createdAt: now,
    });

    return NextResponse.json({
      success: true,
      message: "Bid used successfully",
      bidsTotal: newBidsTotal,
      bidsUsed: newBidsUsed,
      bidsRemaining: newBidsRemaining,
      // Legacy compat
      bitsTotal: newBidsTotal,
      bitsUsed: newBidsUsed,
      bitsRemaining: newBidsRemaining,
      planLabel: "Bids",
    });
  } catch (error) {
    console.error("Use-bid error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to use bid", error: error.message },
      { status: 500 }
    );
  }
}
