import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * GET /api/jobs/[id]/escrow-status
 * Returns escrow breakdown: deposited, released, remaining
 */
export async function GET(req, { params }) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { id } = await params;
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const job = await db.collection("jobs").findOne({ _id: new ObjectId(id) });

        if (!job) return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });

        // Dynamically calculate from milestones to prevent stale state from older tests
        const milestones = await db.collection("milestones").find({ jobId: job._id }).toArray();

        const trueReleased = milestones
            .filter(m => m.status === "released")
            .reduce((sum, m) => sum + (m.amount || 0), 0);

        // Fetch payment record
        const paymentRecord = await db.collection("payments").findOne({ jobId: job._id });

        const trueTotal = milestones.length > 0
            ? milestones.reduce((sum, m) => sum + (m.amount || 0), 0)
            : (job.budget || paymentRecord?.escrowAmount || 0);

        const deposited = trueTotal;
        const released = trueReleased;
        const remaining = deposited - released;

        return NextResponse.json({
            success: true,
            escrow: {
                deposited,
                released,
                remaining,
                status: paymentRecord?.escrowStatus ?? "none",
            },
        });
    } catch (error) {
        console.error("Escrow status error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch escrow status" }, { status: 500 });
    }
}
