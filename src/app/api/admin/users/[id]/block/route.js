import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST /api/admin/users/[id]/block
// Body: { action: "block" | "unblock" }
export async function POST(req, { params }) {
  try {
    const { id: userId } = await params;
    const { action } = await req.json();

    if (!["block", "unblock"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(COLLECTIONS.USERS).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          isBlocked: action === "block",
          isActive: action !== "block",
          blockedAt: action === "block" ? new Date() : null,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `User ${action}ed successfully`,
      isBlocked: action === "block",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update user", error: error.message },
      { status: 500 }
    );
  }
}