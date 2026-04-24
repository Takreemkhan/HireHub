import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import { createNotification } from "@/services/notificationService";

/**
 * POST /api/milestones/[id]/request-release
 * Freelancer submits work and requests payment release.
 * Body: { description: string, attachments: [{url, name, type}] }
 */
export async function POST(req, { params }) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { id } = await params;
        const body = await req.json();
        const { description, attachments = [], chatId } = body;

        if (!description?.trim()) {
            return NextResponse.json({ success: false, message: "Work description is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const milestoneId = new ObjectId(id);

        const milestone = await db.collection("milestones").findOne({ _id: milestoneId });
        if (!milestone) return NextResponse.json({ success: false, message: "Milestone not found" }, { status: 404 });

        if (milestone.freelancerId.toString() !== auth.userId) {
            return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
        }

        if (!["active", "revision"].includes(milestone.status)) {
            return NextResponse.json({ success: false, message: "Milestone is not in active or revision state" }, { status: 400 });
        }

        const now = new Date();

        // Create a new milestone_request
        await db.collection("milestone_requests").insertOne({
            milestoneId,
            jobId: milestone.jobId,
            freelancerId: new ObjectId(auth.userId),
            clientId: milestone.clientId,
            description: description.trim(),
            attachments,
            status: "pending",
            submittedAt: now,
            reviewedAt: null,
            rejectionReason: null,
        });

        // Fetch job for the notification title
        const job = await db.collection("jobs").findOne({ _id: milestone.jobId });

        // Update milestone status to submitted
        await db.collection("milestones").updateOne(
            { _id: milestoneId },
            { $set: { status: "submitted", updatedAt: now } }
        );

        // Send push notification to Client
        if (job) {
            await createNotification({
                recipientId: milestone.clientId,
                senderId: auth.userId,
                type: "proposal_update",
                title: "Work Submitted",
                body: `Freelancer submitted work for milestone: "${milestone.title}". Please review.`,
                meta: { jobId: milestone.jobId.toString(), jobTitle: job.title },
                link: `/client/messages?chatId=${chatId}&jobId=${milestone.jobId.toString()}`
            }).catch(err => console.log('Notification error:', err));
        }

        return NextResponse.json({ success: true, message: "Release request submitted to client" });
    } catch (error) {
        console.error("Request release error:", error);
        return NextResponse.json({ success: false, message: "Failed to submit release request" }, { status: 500 });
    }
}
