import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST /api/admin/users/[id]/verify
export async function POST(req, { params }) {
  try {
    const { id: userId } = await params;
    const { action, documentId, reason } = await req.json();

    if (!["approved", "rejected"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }
    if (!documentId) {
      return NextResponse.json(
        { success: false, message: "documentId required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const now = new Date();

    const setFields = {
      verificationStatus: action,
      updatedAt: now,
    };

    if (action === "approved") {
      setFields.approvedAt = now;
      setFields.rejectionReason = null;
      setFields.rejectedAt = null;
    } else {
      setFields.rejectedAt = now;
      setFields.rejectionReason = reason || "Document rejected by admin";
      setFields.approvedAt = null;
    }

    await db.collection(COLLECTIONS.FILES).updateOne(
      { _id: new ObjectId(documentId), userId: new ObjectId(userId) },
      {
        $set: setFields,
        $push: {
          verificationHistory: {
            status: action,
            comment: reason || (action === "approved" ? "Approved by admin" : "Rejected by admin"),
            updatedAt: now,
          },
        },
      }
    );

    await db.collection(COLLECTIONS.USERS).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          documentVerified: action === "approved",
          documentVerifiedAt: action === "approved" ? now : null,
          updatedAt: now,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Document ${action} successfully`,
      data: { userId, documentId, action, reason: setFields.rejectionReason, updatedAt: now },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Verification failed", error: error.message },
      { status: 500 }
    );
  }
}