import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/disputes/my — fetch disputes for the logged-in user, optionally filtered by chatId
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    // Get token from cookie or header
    const { verifyAuth } = await import("@/lib/auth.middleware");
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = auth.userId;
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const query: Record<string, any> = {
      $or: [
        { clientId: new ObjectId(userId) },
        { freelancerId: new ObjectId(userId) },
      ],
    };

    if (chatId && ObjectId.isValid(chatId)) {
      query.chatId = new ObjectId(chatId);
    }

    const disputes = await db
      .collection("disputes")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const data = disputes.map((d) => ({
      id: d._id.toString(),
      chatId: d.chatId?.toString() || null,
      jobId: d.jobId?.toString() || null,
      title: d.title,
      disputeType: d.disputeType,
      raisedBy: d.raisedBy,
      status: d.status || "open",
      disputeWorkflowStatus: d.disputeWorkflowStatus || "raised",
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      resolvedAt: d.resolvedAt || null,
      hasFreelancerResponse: !!d.freelancerResponse,
      hasClientStatement: !!d.clientStatement,
      resolutionSummary: d.resolutionSummary || null,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/disputes/my error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch disputes" }, { status: 500 });
  }
}
