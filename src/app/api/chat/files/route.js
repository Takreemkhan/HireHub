

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get("chatId");

        if (!chatId) {
            return NextResponse.json({ error: "chatId required" }, { status: 400 });
        }

        const db = (await clientPromise).db(DB_NAME);

        // ── 1. Fetch from chat_files collection (new system) ──────────────────────
        const chatIdQuery = ObjectId.isValid(chatId) ? new ObjectId(chatId) : chatId;

        const dbFiles = await db
            .collection("chat_files")
            .find({ chatId: chatIdQuery })
            .sort({ uploadedAt: -1 })
            .limit(100)
            .toArray();

        // ── 2. Also extract file messages from chat messages (legacy) ─────────────
        let messageFiles = [];
        try {
            if (ObjectId.isValid(chatId)) {
                const chat = await db
                    .collection(COLLECTIONS.CHATS)
                    .findOne({ _id: new ObjectId(chatId) }, { projection: { messages: 1 } });

                if (chat?.messages) {
                    messageFiles = chat.messages
                        .filter((m) => m.messageType === "file" || m.messageType === "image")
                        .filter((m) => m.fileUrl)
                        .map((m) => ({
                            _id: m._id,
                            fileName: m.fileName || m.content || "File",
                            fileUrl: m.fileUrl,
                            fileType: m.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                                ? "image/jpeg"
                                : "application/octet-stream",
                            fileSize: m.fileSize || 0,
                            senderId: m.senderId,
                            uploadedAt: m.timestamp || new Date(),
                            source: "message",
                        }));
                }
            }
        } catch (e) {
            console.warn("Legacy message scan failed:", e.message);
        }

        // ── 3. Merge, deduplicate by fileUrl, sort newest first ───────────────────
        const seen = new Set();
        const allFiles = [
            ...dbFiles.map((f) => ({ ...f, source: "upload" })),
            ...messageFiles,
        ]
            .filter((f) => {
                if (seen.has(f.fileUrl)) return false;
                seen.add(f.fileUrl);
                return true;
            })
            .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

        return NextResponse.json({ success: true, files: allFiles });
    } catch (error) {
        console.error("GET chat/files error:", error);
        return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
    }
}