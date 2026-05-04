import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * POST /api/jobs/[id]/escrow-deposit
 * Client deposits the full job budget into escrow when assigning a freelancer.
 * Deducts from client wallet → records transaction → marks job escrow as held.
 */
export async function POST(req, { params }) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { id } = await params;
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const jobId = new ObjectId(id);
        const clientUserId = new ObjectId(auth.userId);

        // Fetch the job
        const job = await db.collection("jobs").findOne({ _id: jobId });
        if (!job) return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });

        if (job.clientId.toString() !== auth.userId) {
            return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
        }

        if (job.escrowStatus === "held" || job.escrowStatus === "partial") {
            return NextResponse.json({ success: false, message: "Escrow already deposited" }, { status: 400 });
        }

        const amount = job.budget;
        if (!amount || amount <= 0) {
            return NextResponse.json({ success: false, message: "Invalid job budget" }, { status: 400 });
        }

        // Check wallet balance
        const wallet = await db.collection("wallets").findOne({ userId: clientUserId });
        const currentBalance = wallet?.balance ?? 0;

        if (currentBalance < amount) {
            return NextResponse.json({
                success: false,
                message: `Insufficient wallet balance. Required: ₹${amount}, Available: ₹${currentBalance}`,
            }, { status: 400 });
        }

        const now = new Date();

        // Deduct from client wallet
        await db.collection("wallets").updateOne(
            { userId: clientUserId },
            {
                $inc: { balance: -amount },
                $set: { updatedAt: now },
            },
            { upsert: true }
        );

        // Record wallet transaction
        await db.collection("wallet_transactions").insertOne({
            userId: clientUserId,
            type: "debit",
            category: "escrow_deposit",
            amount,
            description: `Escrow deposited for: ${job.title}`,
            jobId,
            status: "completed",
            createdAt: now,
        });

        // Update job with escrow info
        await db.collection("jobs").updateOne(
            { _id: jobId },
            {
                $set: {
                    escrowAmount: amount,
                    escrowReleased: 0,
                    escrowStatus: "held",
                    updatedAt: now,
                },
            }
        );

        return NextResponse.json({
            success: true,
            message: "Escrow deposited successfully",
            escrowAmount: amount,
            newBalance: currentBalance - amount,
        });
    } catch (error) {
        console.error("Escrow deposit error:", error);
        return NextResponse.json({ success: false, message: "Failed to deposit escrow" }, { status: 500 });
    }
}
