import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import { createNotification } from "@/services/notificationService";

/**
 * POST /api/milestones/[id]/reject
 * Client rejects the milestone proposal with a reason.
 * Sets all milestones back to "proposed" so freelancer can re-propose.
 */
export async function POST(req, { params }) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { id } = await params;
        const body = await req.json();
        const { reason, chatId } = body;

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const milestoneId = new ObjectId(id);

        const milestone = await db.collection("milestones").findOne({ _id: milestoneId });
        if (!milestone) return NextResponse.json({ success: false, message: "Milestone not found" }, { status: 404 });

        if (milestone.clientId.toString() !== auth.userId) {
            return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
        }

        const now = new Date();

        // Mark all milestones for this job as rejected (erase them)
        await db.collection("milestones").deleteMany(
            { jobId: milestone.jobId, status: "proposed" }
        );

        const job = await db.collection("jobs").findOne({ _id: milestone.jobId });
        await db.collection("jobs").updateOne(
            { _id: milestone.jobId },
            { $set: { milestonesProposed: false, updatedAt: now } }
        );

        // Insert System Message into Chat
        if (chatId) {
            const systemMessage = {
                _id: new ObjectId(),
                senderId: auth.userId,
                receiverId: milestone.freelancerId,
                content: `🚨 Client rejected the milestone proposal. Reason: ${reason || "No reason provided"}.`,
                messageType: "system",
                timestamp: now,
                readBy: [auth.userId],
            };
            await db.collection("chats").updateOne(
                { _id: new ObjectId(chatId) },
                { $push: { messages: systemMessage } }
            );
        }

        // Send push notification to Freelancer
        if (job) {
            await createNotification({
                recipientId: milestone.freelancerId,
                senderId: auth.userId,
                type: "proposal_update",
                title: "Proposal Rejected",
                body: `Client rejected the milestones. Reason: ${reason || "No reason given"}. Please re-propose.`,
                meta: { jobId: milestone.jobId.toString(), jobTitle: job.title },
                link: `/freelancer/messages?chatId=${chatId}&jobId=${milestone.jobId.toString()}`
            }).catch(err => console.log('Notification error:', err));
        }

        return NextResponse.json({ success: true, message: "Milestone proposal rejected. Freelancer will be notified." });
    } catch (error) {
        console.error("Reject milestone error:", error);
        return NextResponse.json({ success: false, message: "Failed to reject milestones" }, { status: 500 });
    }
}
