import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * POST /api/freelancer/membership/use-bit
 * Body: { jobId }
 * Deducts 1 bit from the freelancer's subscription when they submit a proposal.
 * Returns updated bits info.
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

    // Get current subscription (or default free)
    let sub = await db.collection("freelancer_bids").findOne({ userId });

    if (!sub) {
      // Auto-create free plan entry
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setFullYear(expiresAt.getFullYear() + 10);
      const insertResult = await db.collection("freelancer_bids").insertOne({
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
        createdAt: now,
        updatedAt: now,
      });
      sub = await db
        .collection("freelancer_bids")
        .findOne({ _id: insertResult.insertedId });
    }

    const bitsUsed = sub.bitsUsed || 0;
    const bitsRemaining = sub.bitsTotal - bitsUsed;

    if (bitsRemaining <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: `You have no bits remaining on your ${sub.planLabel} plan. Please upgrade to continue bidding.`,
          code: "NO_BITS_REMAINING",
          bitsRemaining: 0,
          plan: sub.plan,
        },
        { status: 403 }
      );
    }

    // Deduct 1 bit
    const updated = await db
      .collection("freelancer_bids")
      .findOneAndUpdate(
        { userId },
        {
          $inc: { bitsUsed: 1 },
          $set: { updatedAt: new Date() },
        },
        { returnDocument: "after" }
      );

    const newBitsUsed = updated.bitsUsed;
    const newBitsRemaining = updated.bitsTotal - newBitsUsed;

    // Also record this bid in bids collection
    await db.collection("bids").insertOne({
      freelancerId: userId,
      jobId: jobId,
      bitsSpent: 1,
      plan: sub.plan,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Bit used successfully",
      bitsTotal: updated.bitsTotal,
      bitsUsed: newBitsUsed,
      bitsRemaining: newBitsRemaining,
      plan: updated.plan,
      planLabel: updated.planLabel,
    });
  } catch (error) {
    console.error("Use-bit error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to use bit", error: error.message },
      { status: 500 }
    );
  }
}
