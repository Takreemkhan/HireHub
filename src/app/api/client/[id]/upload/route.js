import { NextResponse } from "next/server";
import { uploadFiles } from "@/app/controllers/file.controller";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files");

    // ✅ documentType form data se lo
    const documentType = formData.get("documentType") || "other";

    // console.log("=== UPLOAD DEBUG ===");
    // console.log("userId:", id);
    // console.log("documentType received:", documentType);
    // console.log("files count:", files.length);
    // console.log("===================");

    const result = await uploadFiles(id, files, documentType);

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload files" },
      { status: 500 }
    );
  }
}