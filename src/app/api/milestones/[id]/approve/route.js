import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import { createNotification } from "@/services/notificationService";

/**
 * POST /api/milestones/[id]/approve
 * Client approves the full milestone proposal.
 * - Sets first milestone to "active", rest to "locked"
 * - Updates job status to "in-progress"
 */
export async function POST(req, { params }) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { id } = await params;
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const milestoneId = new ObjectId(id);

        let chatId = null;
        try {
            const body = await req.json();
            chatId = body.chatId;
        } catch (e) { }

        // Find any milestone from this job to get the full set
        const milestone = await db.collection("milestones").findOne({ _id: milestoneId });
        if (!milestone) return NextResponse.json({ success: false, message: "Milestone not found" }, { status: 404 });

        const isClientUser = milestone.clientId?.toString() === auth.userId;
        const isFreelancerUser = milestone.freelancerId?.toString() === auth.userId;

        if (!isClientUser && !isFreelancerUser) {
            return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
        }

        // Freelancer can only approve if it was proposed by the client
        if (isFreelancerUser && milestone.proposedBy !== 'client') {
            return NextResponse.json({ success: false, message: "Only the client can approve a freelancer proposal" }, { status: 403 });
        }

        const jobId = milestone.jobId;
        const now = new Date();

        // Get all milestones for this job sorted by order
        const allMilestones = await db
            .collection("milestones")
            .find({ jobId })
            .sort({ orderIndex: 1 })
            .toArray();

        if (allMilestones.length === 0) {
            return NextResponse.json({ success: false, message: "No milestones found" }, { status: 400 });
        }

        // Bulk update: first = active, rest = locked
        const bulkOps = allMilestones.map((m, i) => ({
            updateOne: {
                filter: { _id: m._id },
                update: { $set: { status: i === 0 ? "active" : "locked", updatedAt: now } },
            },
        }));

        await db.collection("milestones").bulkWrite(bulkOps);

        // Fetch job for notification title
        const job = await db.collection("jobs").findOne({ _id: jobId });

        // Update job status to in-progress
        await db.collection("jobs").updateOne(
            { _id: jobId },
            { $set: { status: "in-progress", milestonesApproved: true, updatedAt: now } }
        );

        // Send push notification to the OTHER party
        if (job) {
            const recipientId = isFreelancerUser ? milestone.clientId : milestone.freelancerId;
            const notifTitle = isFreelancerUser ? "Freelancer Accepted Changes" : "Milestones Approved";
            const notifBody = isFreelancerUser
                ? `Freelancer accepted your suggested milestone changes. Work can begin!`
                : `Client approved the milestones. Work can begin!`;

            await createNotification({
                recipientId,
                senderId: auth.userId,
                type: "proposal_update",
                title: notifTitle,
                body: notifBody,
                meta: { jobId: jobId.toString(), jobTitle: job.title },
                link: isFreelancerUser
                    ? `/client/messages?chatId=${chatId}&jobId=${jobId.toString()}`
                    : `/freelancer/messages?chatId=${chatId}&jobId=${jobId.toString()}`
            }).catch(err => console.log('Notification error:', err));
        }

        return NextResponse.json({ success: true, message: isFreelancerUser ? "Changes accepted! Work can begin!" : "Milestones approved. Work can begin!" });
    } catch (error) {
        console.error("Approve milestones error:", error);
        return NextResponse.json({ success: false, message: "Failed to approve milestones" }, { status: 500 });
    }
}
