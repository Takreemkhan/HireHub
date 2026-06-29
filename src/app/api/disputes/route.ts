import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

export async function POST(req: Request) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const body = await req.json();
        const {
            chatId,
            jobId,
            milestoneId,
            clientId,
            freelancerId,
            raisedBy,
            disputeType,
            title,
            description,
            resolution,
            partialAmount,
            additionalNotes,
            mediaFiles,
            escrowAmount
        } = body;

        // Basic validation
        if (!chatId || !jobId || !clientId || !freelancerId || !raisedBy || !disputeType || !title || !description || !resolution) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const disputeData = {
            chatId: new ObjectId(chatId),
            jobId: new ObjectId(jobId),
            milestoneId: milestoneId ? new ObjectId(milestoneId) : null,
            clientId: new ObjectId(clientId),
            freelancerId: new ObjectId(freelancerId),
            raisedBy,
            disputeType,
            title,
            description,
            resolution,
            partialAmount: partialAmount ? Number(partialAmount) : null,
            additionalNotes: additionalNotes || "",
            mediaFiles: mediaFiles || [],
            escrowAmount: escrowAmount ? Number(escrowAmount) : null,
            status: "open",
            disputeWorkflowStatus: "raised",
            freelancerResponse: null,
            clientStatement: null,
            resolutionSummary: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection("disputes").insertOne(disputeData);
        const disputeId = result.insertedId.toString();

        // Update chat status to "disputed" to freeze communication
        await db.collection("chats").updateOne(
            { _id: new ObjectId(chatId) },
            { $set: { status: "disputed", updatedAt: new Date() } }
        );

        // Fetch job title for notification
        let jobTitle = "your contract";
        try {
            const jobDoc = await db.collection("jobs").findOne({ _id: new ObjectId(jobId) });
            if (jobDoc) jobTitle = jobDoc.title || jobTitle;
        } catch (_) {}

        // Fetch disputing user info
        let raiserName = raisedBy;
        try {
            const raiserId = raisedBy === "client" ? new ObjectId(clientId) : new ObjectId(freelancerId);
            const raiserDoc = await db.collection("users").findOne({ _id: raiserId });
            if (raiserDoc) raiserName = raiserDoc.name || `${raiserDoc.firstName || ""} ${raiserDoc.lastName || ""}`.trim() || raisedBy;
        } catch (_) {}

        // Determine recipient (the other party)
        const recipientId = raisedBy === "client" ? new ObjectId(freelancerId) : new ObjectId(clientId);
        const recipientRole = raisedBy === "client" ? "freelancer" : "client";

        // Build notification message (DO NOT include resolution demands)
        const disputeTypeLabels: Record<string, string> = {
            quality_issue: "Quality Issue",
            deadline_missed: "Deadline Missed",
            incomplete_work: "Incomplete Work",
            communication_breakdown: "Communication Breakdown",
            payment_dispute: "Payment Dispute",
            scope_creep: "Scope Changed",
            other: "Other",
        };

        const disputeTypeLabel = disputeTypeLabels[disputeType] || disputeType;

        const notificationMessage = `A dispute has been raised on your contract "${jobTitle}". Category: ${disputeTypeLabel}. Issue: "${description.slice(0, 200)}${description.length > 200 ? "..." : ""}". Contract communication has been temporarily frozen. Please submit your response and supporting evidence.`;

        // Insert in-app notification for the other party
        try {
            await db.collection("notifications").insertOne({
                recipientId,
                senderId: raisedBy === "client" ? new ObjectId(clientId) : new ObjectId(freelancerId),
                type: "dispute_raised",
                title: "⚠️ Dispute Raised on Your Contract",
                message: notificationMessage,
                isRead: false,
                meta: {
                    disputeId: result.insertedId,
                    chatId: new ObjectId(chatId),
                    jobId: new ObjectId(jobId),
                    disputeType,
                    jobTitle,
                    respondUrl: `/dispute/respond?disputeId=${disputeId}&role=${recipientRole}`,
                },
                createdAt: new Date(),
            });
        } catch (notifErr) {
            console.error("Failed to create dispute notification:", notifErr);
        }

        // Insert system message in chat about dispute freeze
        try {
            const systemMsg = {
                _id: new ObjectId(),
                senderId: null,
                senderRole: "system",
                content: `⚠️ A dispute has been raised on this contract. Communication is temporarily frozen while our team reviews the case. Both parties will be notified when the dispute is resolved.`,
                messageType: "system_intro",
                createdAt: new Date(),
                timestamp: new Date(),
                isSystemMessage: true,
                disputeId: result.insertedId,
            };

            await db.collection("chats").updateOne(
                { _id: new ObjectId(chatId) },
                { $push: { messages: systemMsg } }
            );

            await db.collection("messages").insertOne({
                chatId: new ObjectId(chatId),
                ...systemMsg
            });
        } catch (msgErr) {
            console.error("Failed to insert system message:", msgErr);
        }

        return NextResponse.json({
            success: true,
            message: "Dispute created and chat frozen",
            disputeId
        });
    } catch (error) {
        console.error("Create dispute error:", error);
        return NextResponse.json({ success: false, message: "Failed to file dispute" }, { status: 500 });
    }
}
