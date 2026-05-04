import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import { createNotification } from "@/services/notificationService";

/**
 * POST /api/milestones/[id]/request-revision
 * Client sends the milestone back for revision with a reason.
 */
export async function POST(req, { params }) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { id } = await params;
        const body = await req.json();
        const { reason, chatId } = body;

        if (!reason?.trim()) {
            return NextResponse.json({ success: false, message: "Revision reason is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const milestoneId = new ObjectId(id);

        const milestone = await db.collection("milestones").findOne({ _id: milestoneId });
        if (!milestone) return NextResponse.json({ success: false, message: "Milestone not found" }, { status: 404 });

        if (milestone.clientId.toString() !== auth.userId) {
            return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
        }

        if (milestone.status !== "submitted") {
            return NextResponse.json({ success: false, message: "Milestone is not in submitted state" }, { status: 400 });
        }

        const now = new Date();

        // Mark milestone as revision
        await db.collection("milestones").updateOne(
            { _id: milestoneId },
            { $set: { status: "revision", revisionReason: reason.trim(), updatedAt: now } }
        );

        // Fetch job for notification title
        const job = await db.collection("jobs").findOne({ _id: milestone.jobId });

        // Update the pending milestone_request as rejected
        await db.collection("milestone_requests").updateOne(
            { milestoneId, status: "pending" },
            { $set: { status: "rejected", rejectionReason: reason.trim(), reviewedAt: now } }
        );

        // Send push notification to Freelancer
        if (job) {
            await createNotification({
                recipientId: milestone.freelancerId,
                senderId: auth.userId,
                type: "proposal_update",
                title: "Revision Requested",
                body: `Client requested a revision for milestone: "${milestone.title}".`,
                meta: { jobId: milestone.jobId.toString(), jobTitle: job.title },
                link: `/freelancer/messages?chatId=${chatId}&jobId=${milestone.jobId.toString()}`
            }).catch(err => console.log('Notification error:', err));
        }

        return NextResponse.json({ success: true, message: "Revision requested. Freelancer will be notified." });
    } catch (error) {
        console.error("Request revision error:", error);
        return NextResponse.json({ success: false, message: "Failed to request revision" }, { status: 500 });
    }
}
