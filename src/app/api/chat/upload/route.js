
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = [
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "application/zip",
];

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req) {
    try {
        // Auth check
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file");
        const chatId = formData.get("chatId") || "general";
        console.log("file", file);
        console.log("chatId", chatId);
        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: `File type not allowed: ${file.type}. Allowed: images, PDF, Word, Excel, TXT, ZIP` },
                { status: 400 }
            );
        }

        // Validate size
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "File too large. Max size is 10MB." },
                { status: 400 }
            );
        }

        // Save to public/uploads/chat/{chatId}/
        const uploadDir = path.join(process.cwd(), "public", "uploads", "chat", chatId);
        await mkdir(uploadDir, { recursive: true });

        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const uniqueName = `${timestamp}_${randomStr}_${safeName}`;
        const filePath = path.join(uploadDir, uniqueName);

        const bytes = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));

        const fileUrl = `/uploads/chat/${chatId}/${uniqueName}`;

        // Store file metadata in DB under chat_files collection
        try {
            const db = (await clientPromise).db(DB_NAME);
            await db.collection("chat_files").insertOne({
                chatId: ObjectId.isValid(chatId) ? new ObjectId(chatId) : chatId,
                senderId: new ObjectId(session.user.id),
                fileName: file.name,
                uniqueName,
                fileUrl,
                fileType: file.type,
                fileSize: file.size,
                uploadedAt: new Date(),
            });
        } catch (dbErr) {
            // Non-blocking — file already saved, DB logging failed
            console.warn("⚠️ chat_files DB insert failed:", dbErr.message);
        }

        return NextResponse.json({
            success: true,
            fileUrl,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
        });
    } catch (error) {
        console.error("Chat upload error:", error);
        return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
    }
}