import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notifyNewMessage } from "@/services/notificationService";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { chatId, jobId, jobTitle, clientId, freelancerId } = body;

        if (!chatId || !jobTitle) {
            return NextResponse.json({ error: "chatId and jobTitle are required" }, { status: 400 });
        }

        const db = (await clientPromise).db(DB_NAME);
        const chats = db.collection(COLLECTIONS.CHATS);

        // Fetch the chat
        let chatObjId: ObjectId;
        try {
            chatObjId = new ObjectId(chatId);
        } catch {
            return NextResponse.json({ error: "Invalid chatId" }, { status: 400 });
        }

        const chat = await chats.findOne({ _id: chatObjId });
        if (!chat) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        // Check if a system_intro message already exists — prevent duplicate sends
        const existingMessages: any[] = chat.messages || [];
        const alreadySent = existingMessages.some(
            (m: any) => m.messageType === "system_intro"
        );

        if (alreadySent) {
            return NextResponse.json({ sent: false, reason: "already_sent" });
        }


        const introText = `👋 Hello! I've reviewed your proposal for the job "${jobTitle}" and I'd like to discuss it further with you. I'm interested in your skills and approach. Looking forward to a great collaboration!`;

        const newMessage = {
            _id: new ObjectId(),
            senderId: clientId || "system",
            content: introText,
            text: introText,
            messageType: "system_intro",
            timestamp: new Date(),
            readBy: [],
        };


        await chats.updateOne(
            { _id: chatObjId },
            {
                $push: { messages: newMessage } as any,
                $set: { lastMessageAt: new Date(), updatedAt: new Date() },
            }
        );

        // Notify the freelancer — same pattern as regular messages route
        if (clientId && freelancerId) {
            try {
                const sender = await db.collection(COLLECTIONS.USERS).findOne(
                    { _id: new ObjectId(clientId) },
                    { projection: { name: 1 } }
                ) as any;
                const senderName = sender?.name || "Client";
                await notifyNewMessage({
                    recipientId: freelancerId,
                    senderId: clientId,
                    senderName,
                    chatId,
                });
            } catch (notifErr) {
                console.warn("⚠️ Auto-message notification failed (non-blocking):", notifErr);
            }
        }


        return NextResponse.json({
            sent: true,
            message: {
                ...newMessage,
                _id: newMessage._id.toString(),
                timestamp: newMessage.timestamp.toISOString(),
            },
        });
    } catch (err: any) {
        console.error("❌ auto-message POST error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
