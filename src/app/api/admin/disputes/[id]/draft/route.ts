import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST /api/admin/disputes/[id]/draft — save a resolution draft
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid dispute ID" }, { status: 400 });
    }

    const body = await req.json();

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("disputes").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          resolutionDraft: body,
          disputeWorkflowStatus: "resolution_drafted",
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true, message: "Draft saved successfully" });
  } catch (error) {
    console.error("POST /api/admin/disputes/[id]/draft error:", error);
    return NextResponse.json({ success: false, message: "Failed to save draft" }, { status: 500 });
  }
}
