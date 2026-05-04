import { NextResponse } from "next/server";
import { getFilesByUserId, deleteFile } from "@/app/controllers/file.controller";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    // Validate user ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Call controller
    const result = await getFilesByUserId(id);
    
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("GET files error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to fetch files" 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    // Validate IDs
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    if (!fileId || !ObjectId.isValid(fileId)) {
      return NextResponse.json(
        { success: false, message: "Invalid file ID" },
        { status: 400 }
      );
    }

    // Call controller
    const result = await deleteFile(fileId, id);
    
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("DELETE file error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to delete file" 
      },
      { status: 500 }
    );
  }
}