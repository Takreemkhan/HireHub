import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

// GET /api/disputes/[id] — fetch a single dispute by ID (for client/freelancer view)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid dispute ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const dispute = await db.collection("disputes").findOne({ _id: new ObjectId(id) });
    if (!dispute) {
      return NextResponse.json({ success: false, message: "Dispute not found" }, { status: 404 });
    }

    // Verify the requesting user is a party to this dispute
    const userId = auth.userId;
    const clientId = dispute.clientId?.toString();
    const freelancerId = dispute.freelancerId?.toString();

    if (userId !== clientId && userId !== freelancerId) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    // Fetch job title
    let jobTitle = "Unknown Job";
    if (dispute.jobId) {
      const job = await db.collection("jobs").findOne({ _id: dispute.jobId });
      if (job) jobTitle = job.title || jobTitle;
    }

    // Fetch party names
    const userIds = [dispute.clientId, dispute.freelancerId].filter(Boolean);
    const users = await db.collection("users").find({ _id: { $in: userIds } }).toArray();
    const userMap: Record<string, any> = {};
    for (const u of users) {
      userMap[u._id.toString()] = {
        name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown",
        email: u.email,
      };
    }

    // The non-raiser should NOT see the resolution demands — only issue details
    const isRaiser =
      (dispute.raisedBy === "client" && userId === clientId) ||
      (dispute.raisedBy === "freelancer" && userId === freelancerId);

    const resolutionData = {
      id: dispute._id.toString(),
      chatId: dispute.chatId?.toString() || null,
      jobId: dispute.jobId?.toString() || null,
      jobTitle,
      clientId: clientId || null,
      clientName: userMap[clientId]?.name || "Unknown Client",
      freelancerId: freelancerId || null,
      freelancerName: userMap[freelancerId]?.name || "Unknown Freelancer",
      raisedBy: dispute.raisedBy,
      disputeType: dispute.disputeType,
      title: dispute.title,
      description: dispute.description,
      // Only raiser sees their requested resolution; other party sees null
      resolution: isRaiser ? dispute.resolution : null,
      partialAmount: isRaiser ? dispute.partialAmount : null,
      additionalNotes: dispute.additionalNotes || "",
      mediaFiles: dispute.mediaFiles || [],
      status: dispute.status || "open",
      disputeWorkflowStatus: dispute.disputeWorkflowStatus || "raised",
      freelancerResponse: dispute.freelancerResponse || null,
      clientStatement: dispute.clientStatement || null,
      escrowAmount: dispute.escrowAmount || null,
      createdAt: dispute.createdAt,
      updatedAt: dispute.updatedAt,
      resolvedAt: dispute.resolvedAt || null,
      resolutionSummary: dispute.resolutionSummary || null,
    };

    return NextResponse.json({ success: true, data: resolutionData });
  } catch (error) {
    console.error("GET /api/disputes/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch dispute" }, { status: 500 });
  }
}

// PATCH /api/disputes/[id] — update dispute workflow status
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid dispute ID" }, { status: 400 });
    }

    const body = await req.json();
    const { disputeWorkflowStatus } = body;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection("disputes").updateOne(
      { _id: new ObjectId(id) },
      { $set: { disputeWorkflowStatus, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("PATCH /api/disputes/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update dispute" }, { status: 500 });
  }
}
