import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST /api/admin/disputes/[id]/resolve — publish a resolution
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid dispute ID" }, { status: 400 });
    }

    const body = await req.json();
    const {
      resolutionTitle,
      resolutionCategory,
      finalDecision,
      adminNotes,
      internalNotes,
      refundClientAmount,
      releaseFreelancerAmount,
      platformAdjustment,
      reopenChat,
      sendSystemMessage,
      notifyClient,
      notifyFreelancer,
      resolvedBy,
    } = body;

    if (!resolutionTitle || !finalDecision) {
      return NextResponse.json({ success: false, message: "Resolution title and final decision are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const dispute = await db.collection("disputes").findOne({ _id: new ObjectId(id) });
    if (!dispute) {
      return NextResponse.json({ success: false, message: "Dispute not found" }, { status: 404 });
    }

    const resolvedAt = new Date();

    const resolutionSummary = {
      resolutionTitle,
      resolutionCategory: resolutionCategory || "other",
      finalDecision,
      adminNotes: adminNotes || "",
      internalNotes: internalNotes || "",
      financial: {
        refundClientAmount: refundClientAmount ? Number(refundClientAmount) : 0,
        releaseFreelancerAmount: releaseFreelancerAmount ? Number(releaseFreelancerAmount) : 0,
        platformAdjustment: platformAdjustment ? Number(platformAdjustment) : 0,
      },
      settings: {
        reopenChat: reopenChat !== false,
        sendSystemMessage: sendSystemMessage !== false,
        notifyClient: notifyClient !== false,
        notifyFreelancer: notifyFreelancer !== false,
      },
      resolvedBy: resolvedBy || "Admin",
      resolvedAt,
    };

    // Update the dispute
    await db.collection("disputes").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "resolved",
          disputeWorkflowStatus: "resolved",
          resolutionSummary,
          resolvedAt,
          updatedAt: new Date(),
        },
      }
    );

    // Reopen chat if enabled
    if (reopenChat !== false && dispute.chatId) {
      await db.collection("chats").updateOne(
        { _id: dispute.chatId },
        { $set: { status: "active", updatedAt: new Date() } }
      );
    }

    // Insert system message in chat if enabled
    if (sendSystemMessage !== false && dispute.chatId) {
      const caseId = `DISPUTE-${id.slice(-6).toUpperCase()}`;
      try {
        const systemMsg = {
          _id: new ObjectId(),
          senderId: null,
          senderRole: "system",
          content: `✅ Dispute #${caseId} has been resolved by the administration team. Communication has been restored. Please review the official resolution report for complete details.`,
          messageType: "system_intro",
          createdAt: resolvedAt,
          timestamp: resolvedAt,
          isSystemMessage: true,
          disputeId: new ObjectId(id),
          resolutionTitle,
          finalDecision,
        };

        await db.collection("chats").updateOne(
          { _id: new ObjectId(dispute.chatId) },
          { $push: { messages: systemMsg } }
        );

        await db.collection("messages").insertOne({
          chatId: new ObjectId(dispute.chatId),
          ...systemMsg
        });
      } catch (msgErr) {
        console.error("Failed to insert resolution system message:", msgErr);
      }
    }

    // Send notifications to parties
    const notificationsToInsert = [];
    const caseId = `DISPUTE-${id.slice(-6).toUpperCase()}`;
    const notifBase = {
      type: "dispute_resolved",
      title: `✅ Dispute #${caseId} Resolved`,
      message: `Your dispute "${dispute.title}" has been resolved. ${finalDecision.slice(0, 150)}${finalDecision.length > 150 ? "..." : ""}`,
      isRead: false,
      meta: {
        disputeId: new ObjectId(id),
        chatId: dispute.chatId,
        jobId: dispute.jobId,
      },
      createdAt: resolvedAt,
    };

    if (notifyClient !== false && dispute.clientId) {
      notificationsToInsert.push({ 
        ...notifBase, 
        recipientId: dispute.clientId, 
        senderId: null,
        link: `/dispute/respond?disputeId=${id}&role=client`
      });
    }
    if (notifyFreelancer !== false && dispute.freelancerId) {
      notificationsToInsert.push({ 
        ...notifBase, 
        recipientId: dispute.freelancerId, 
        senderId: null,
        link: `/dispute/respond?disputeId=${id}&role=freelancer`
      });
    }

    if (notificationsToInsert.length > 0) {
      try {
        await db.collection("notifications").insertMany(notificationsToInsert);
      } catch (notifErr) {
        console.error("Failed to send resolution notifications:", notifErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Resolution published successfully",
      disputeId: id,
    });
  } catch (error) {
    console.error("POST /api/admin/disputes/[id]/resolve error:", error);
    return NextResponse.json({ success: false, message: "Failed to publish resolution" }, { status: 500 });
  }
}
