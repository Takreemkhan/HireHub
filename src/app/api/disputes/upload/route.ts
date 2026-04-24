import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_SIZE = 100 * 1024 * 1024; // 100 MB for evidence (videos)

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const jobId = formData.get("jobId") || "general";

        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File too large. Max size is 100MB." }, { status: 400 });
        }

        // Save to public/uploads/disputes/{jobId}/
        const uploadDir = path.join(process.cwd(), "public", "uploads", "disputes", jobId as string);
        await mkdir(uploadDir, { recursive: true });

        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const uniqueName = `${timestamp}_${randomStr}_${safeName}`;
        const filePath = path.join(uploadDir, uniqueName);

        const bytes = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));

        const fileUrl = `/uploads/disputes/${jobId}/${uniqueName}`;

        return NextResponse.json({
            success: true,
            fileUrl,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
        });
    } catch (error: any) {
        console.error("Dispute upload error:", error);
        return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
    }
}
