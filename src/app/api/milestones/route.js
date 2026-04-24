import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import { createNotification } from "@/services/notificationService";

/**
 * GET /api/milestones?jobId=xxx
 * Returns all milestones for a job (both roles)
 *
 * POST /api/milestones/propose
 * Freelancer proposes milestones for a job
 */

export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get("jobId");
        if (!jobId) return NextResponse.json({ success: false, message: "jobId required" }, { status: 400 });

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const milestones = await db
            .collection("milestones")
            .find({ jobId: new ObjectId(jobId) })
            .sort({ orderIndex: 1 })
            .toArray();

        // Attach latest milestone_request to each milestone
        const enriched = await Promise.all(
            milestones.map(async (m) => {
                const latestRequest = await db
                    .collection("milestone_requests")
                    .findOne({ milestoneId: m._id }, { sort: { submittedAt: -1 } });
                return {
                    ...m,
                    _id: m._id.toString(),
                    jobId: m.jobId.toString(),
                    clientId: m.clientId?.toString(),
                    freelancerId: m.freelancerId?.toString(),
                    latestRequest: latestRequest
                        ? {
                            ...latestRequest,
                            _id: latestRequest._id.toString(),
                            milestoneId: latestRequest.milestoneId.toString(),
                        }
                        : null,
                };
            })
        );

        return NextResponse.json({ success: true, milestones: enriched });
    } catch (error) {
        console.error("Get milestones error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch milestones" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const body = await req.json();
        const { jobId, milestones, chatId, proposedBy = "freelancer" } = body;

        if (!jobId || !Array.isArray(milestones) || milestones.length === 0) {
            return NextResponse.json({ success: false, message: "jobId and milestones array are required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const jobObjectId = new ObjectId(jobId);

        // Fetch job to validate
        const job = await db.collection("jobs").findOne({ _id: jobObjectId });
        if (!job) return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });

        // Validate user role
        const isFreelancer = job.freelancerId?.toString() === auth.userId;
        const isClient = job.clientId?.toString() === auth.userId;

        if (!isFreelancer && !isClient) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Validate total = budget
        const total = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
        if (Math.round(total) !== Math.round(job.budget)) {
            return NextResponse.json({
                success: false,
                message: `Total milestone amounts (${total}) must equal job budget (${job.budget})`,
            }, { status: 400 });
        }

        // Delete any existing proposed milestones (re-propose or modify)
        await db.collection("milestones").deleteMany({ jobId: jobObjectId, status: "proposed" });

        const now = new Date();
        const docs = milestones.map((m, i) => ({
            jobId: jobObjectId,
            clientId: job.clientId,
            freelancerId: job.freelancerId,
            title: m.title?.trim(),
            description: m.description?.trim() || "",
            amount: Number(m.amount),
            currency: job.currency || "USD",
            deadline: m.deadline ? new Date(m.deadline) : null,
            orderIndex: i + 1,
            proposedBy: proposedBy, // "freelancer" or "client"
            status: "proposed",
            createdAt: now,
            updatedAt: now,
        }));

        await db.collection("milestones").insertMany(docs);

        // Update job status
        await db.collection("jobs").updateOne(
            { _id: jobObjectId },
            { $set: { milestonesProposed: true, updatedAt: now } }
        );

        // Notify the OTHER party
        const recipientId = proposedBy === "client" ? job.freelancerId : job.clientId;
        const senderRoleName = proposedBy === "client" ? "Client" : "Freelancer";
        const isModification = proposedBy === "client";
        const title = isModification ? "Proposal Modified" : "Milestone Proposal";
        const bodyText = isModification
            ? `Client suggested changes to the milestones.`
            : `Freelancer proposed a milestone outline.`;

        // Insert System Message into Chat
        if (chatId) {
            const systemMessage = {
                _id: new ObjectId(),
                senderId: auth.userId,
                receiverId: recipientId,
                content: isModification
                    ? `📝 Client suggested changes to the milestone proposal.`
                    : `💡 Freelancer proposed a new milestone plan (${docs.length} milestones).`,
                messageType: "system",
                timestamp: now,
                readBy: [auth.userId],
            };
            await db.collection("chats").updateOne(
                { _id: new ObjectId(chatId) },
                { $push: { messages: systemMessage } }
            );
        }

        await createNotification({
            recipientId: recipientId,
            senderId: auth.userId,
            type: "proposal_update",
            title: title,
            body: bodyText,
            meta: { jobId: jobObjectId.toString(), jobTitle: job.title },
            link: `/${proposedBy === "client" ? "freelancer" : "client"}/messages?chatId=${chatId}&jobId=${jobObjectId.toString()}`
        }).catch(err => console.log('Notification error:', err));

        return NextResponse.json({ success: true, message: "Milestone proposal submitted to client", count: docs.length });
    } catch (error) {
        console.error("Propose milestones error:", error);
        return NextResponse.json({ success: false, message: "Failed to submit milestone proposal" }, { status: 500 });
    }
}
