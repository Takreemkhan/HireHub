import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, message: "Invalid dispute ID" }, { status: 400 });
      }

      const d = await db.collection(COLLECTIONS.DISPUTES || "disputes").findOne({ _id: new ObjectId(id) });
      if (!d) {
        return NextResponse.json({ success: false, message: "Dispute not found" }, { status: 404 });
      }

      const cId = d.clientId?.toString();
      const fId = d.freelancerId?.toString();
      const jId = d.jobId?.toString();

      const userIds = [d.clientId, d.freelancerId].filter(Boolean).map(uid => new ObjectId(uid));
      const users = await db.collection(COLLECTIONS.USERS).find({ _id: { $in: userIds } }).toArray();

      const userMap = {};
      for (const u of users) {
        userMap[u._id.toString()] = {
          name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown",
          email: u.email,
        };
      }

      let jobTitle = "Unknown Job";
      if (d.jobId) {
        const job = await db.collection(COLLECTIONS.JOBS).findOne({ _id: d.jobId });
        if (job) jobTitle = job.title || "Untitled Job";
      }

      const disputeDetail = {
        id: d._id.toString(),
        chatId: d.chatId?.toString() || null,
        jobId: jId || null,
        jobTitle,
        clientId: cId || null,
        clientName: userMap[cId]?.name || "Unknown Client",
        clientEmail: userMap[cId]?.email || "",
        freelancerId: fId || null,
        freelancerName: userMap[fId]?.name || "Unknown Freelancer",
        freelancerEmail: userMap[fId]?.email || "",
        raisedBy: d.raisedBy,
        disputeType: d.disputeType,
        title: d.title,
        description: d.description,
        resolution: d.resolution,
        partialAmount: d.partialAmount,
        additionalNotes: d.additionalNotes || "",
        mediaFiles: d.mediaFiles || [],
        escrowAmount: d.escrowAmount || null,
        status: d.status || "open",
        disputeWorkflowStatus: d.disputeWorkflowStatus || "raised",
        freelancerResponse: d.freelancerResponse || null,
        clientStatement: d.clientStatement || null,
        creatorAdditionalEvidence: d.creatorAdditionalEvidence || null,
        resolutionSummary: d.resolutionSummary || null,
        resolutionDraft: d.resolutionDraft || null,
        resolvedAt: d.resolvedAt || null,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      };

      return NextResponse.json({ success: true, data: disputeDetail });
    }

    // Otherwise, fetch all disputes but only keep lightweight listing fields
    const disputes = await db
      .collection(COLLECTIONS.DISPUTES || "disputes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    if (!disputes.length) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Collect unique IDs for clients, freelancers, and jobs
    const clientIds = [...new Set(disputes.map((d) => d.clientId?.toString()).filter(Boolean))].map((id) => new ObjectId(id));
    const freelancerIds = [...new Set(disputes.map((d) => d.freelancerId?.toString()).filter(Boolean))].map((id) => new ObjectId(id));
    const jobIds = [...new Set(disputes.map((d) => d.jobId?.toString()).filter(Boolean))].map((id) => new ObjectId(id));

    // Fetch users (both clients and freelancers)
    const users = await db
      .collection(COLLECTIONS.USERS)
      .find({ _id: { $in: [...clientIds, ...freelancerIds] } })
      .toArray();

    // Map user id to user object
    const userMap = {};
    for (const u of users) {
      userMap[u._id.toString()] = {
        name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown",
      };
    }

    // Fetch jobs
    const jobs = await db
      .collection(COLLECTIONS.JOBS)
      .find({ _id: { $in: jobIds } })
      .toArray();

    // Map job id to job title
    const jobMap = {};
    for (const j of jobs) {
      jobMap[j._id.toString()] = j.title || "Untitled Job";
    }

    // Combine data
    const data = disputes.map((d) => {
      const cId = d.clientId?.toString();
      const fId = d.freelancerId?.toString();
      const jId = d.jobId?.toString();

      return {
        id: d._id.toString(),
        jobTitle: jobMap[jId] || "Unknown Job",
        clientName: userMap[cId]?.name || "Unknown Client",
        freelancerName: userMap[fId]?.name || "Unknown Freelancer",
        raisedBy: d.raisedBy,
        title: d.title,
        status: d.status || "open",
        disputeWorkflowStatus: d.disputeWorkflowStatus || "raised",
        createdAt: d.createdAt,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Fetch disputes error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch disputes", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/disputes — update dispute workflow status
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { disputeId, disputeWorkflowStatus, status } = body;

    if (!disputeId || !ObjectId.isValid(disputeId)) {
      return NextResponse.json({ success: false, message: "Invalid dispute ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updateFields = { updatedAt: new Date() };
    if (disputeWorkflowStatus) updateFields.disputeWorkflowStatus = disputeWorkflowStatus;
    if (status) updateFields.status = status;

    await db.collection("disputes").updateOne(
      { _id: new ObjectId(disputeId) },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true, message: "Dispute updated" });
  } catch (error) {
    console.error("PATCH admin disputes error:", error);
    return NextResponse.json({ success: false, message: "Failed to update dispute" }, { status: 500 });
  }
}
