import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

// POST /api/disputes/[id]/respond — submit responses / evidence
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid dispute ID" }, { status: 400 });
    }

    const body = await req.json();
    const { description, additionalNotes, mediaFiles } = body;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const dispute = await db.collection("disputes").findOne({ _id: new ObjectId(id) });
    if (!dispute) {
      return NextResponse.json({ success: false, message: "Dispute not found" }, { status: 404 });
    }

    const userId = auth.userId;
    const clientId = dispute.clientId?.toString();
    const freelancerId = dispute.freelancerId?.toString();

    if (userId !== clientId && userId !== freelancerId) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const isRaiser =
      (dispute.raisedBy === "client" && userId === clientId) ||
      (dispute.raisedBy === "freelancer" && userId === freelancerId);

    // Conditional validation: Defendant must provide min 5 chars. Creator can submit files and/or comments.
    if (!isRaiser) {
      if (!description || description.trim().length < 5) {
        return NextResponse.json({ success: false, message: "Response description is required (min 5 chars)" }, { status: 400 });
      }
    } else {
      if ((!description || description.trim().length === 0) && (!mediaFiles || mediaFiles.length === 0)) {
        return NextResponse.json({ success: false, message: "Please provide either additional notes or supporting files" }, { status: 400 });
      }
    }

    if (isRaiser) {
      const additionalData = {
        description: (description || "").trim(),
        additionalNotes: (additionalNotes || "").trim(),
        mediaFiles: mediaFiles || [],
        submittedAt: new Date(),
      };

      await db.collection("disputes").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            creatorAdditionalEvidence: additionalData,
            updatedAt: new Date(),
          },
        }
      );

      if (dispute.chatId) {
        try {
          const systemMsg = {
            _id: new ObjectId(),
            senderId: null,
            senderRole: "system",
            content: `📎 Dispute creator has submitted additional evidence/comments.`,
            messageType: "system_intro",
            createdAt: new Date(),
            timestamp: new Date(),
            isSystemMessage: true,
            disputeId: new ObjectId(id),
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
          console.error("Failed to insert system message:", msgErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Additional evidence submitted successfully.",
      });
    }

    const responseData = {
      description: description.trim(),
      additionalNotes: additionalNotes || "",
      mediaFiles: mediaFiles || [],
      submittedAt: new Date(),
      submittedBy: userId,
    };

    // Determine which field to set based on who is responding
    const responderRole = userId === freelancerId ? "freelancer" : "client";
    const fieldName = responderRole === "freelancer" ? "freelancerResponse" : "clientStatement";

    await db.collection("disputes").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          [fieldName]: responseData,
          disputeWorkflowStatus: "admin_reviewing",
          updatedAt: new Date(),
        },
      }
    );

    // Update the chat with a system message that the response has been submitted
    if (dispute.chatId) {
      try {
        const systemMsg = {
          _id: new ObjectId(),
          senderId: null,
          senderRole: "system",
          content: `✅ ${responderRole === "freelancer" ? "Freelancer" : "Client"} has submitted their response to the dispute. The case is now under admin review.`,
          messageType: "system_intro",
          createdAt: new Date(),
          timestamp: new Date(),
          isSystemMessage: true,
          disputeId: new ObjectId(id),
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
        console.error("Failed to insert system message:", msgErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Response submitted successfully. Admin will review both submissions.",
    });
  } catch (error) {
    console.error("POST /api/disputes/[id]/respond error:", error);
    return NextResponse.json({ success: false, message: "Failed to submit response" }, { status: 500 });
  }
}
