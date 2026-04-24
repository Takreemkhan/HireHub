import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * POST /api/jobs/[id]/review
 * Submit a star rating + review for the other party in a job.
 * ClientId reviews freelancer, freelancerId reviews client.
 */
export async function POST(req, { params }) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const body = await req.json();
        const { rating, review } = body;

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ success: false, message: "Rating must be between 1 and 5" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const jobId = new ObjectId(params.id);
        const userId = new ObjectId(auth.userId);

        const job = await db.collection("jobs").findOne({ _id: jobId });
        if (!job) return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });

        const isClient = job.clientId.toString() === auth.userId;
        const isFreelancer = job.freelancerId?.toString() === auth.userId;

        if (!isClient && !isFreelancer) {
            return NextResponse.json({ success: false, message: "Not authorized to review this job" }, { status: 403 });
        }

        const now = new Date();
        const reviewData = {
            rating: Number(rating),
            comment: review?.trim() || "",
            reviewedAt: now,
        };

        const updateField = isClient ? "clientReview" : "freelancerReview";

        await db.collection("jobs").updateOne(
            { _id: jobId },
            { $set: { [updateField]: reviewData, updatedAt: now } }
        );

        return NextResponse.json({ success: true, message: "Review submitted. Thank you!" });
    } catch (error) {
        console.error("Submit review error:", error);
        return NextResponse.json({ success: false, message: "Failed to submit review" }, { status: 500 });
    }
}
