import { NextResponse } from "next/server";
import { getClientCurrentJobs, assignFreelancerToJob } from "@/app/controllers/client-jobs.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* GET - Get client's current jobs (open + in-progress)*/
export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 100;

    const result = await getClientCurrentJobs(auth.userId, page, limit);

    return NextResponse.json(
      {
        success: true,
        ...result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Client Current Jobs GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch current jobs",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/* POST - Assign freelancer to job*/
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();
    const { jobId, freelancerId, proposalId } = body;

    if (!jobId || !freelancerId) {
      return NextResponse.json(
        {
          success: false,
          message: "jobId and freelancerId are required"
        },
        { status: 400 }
      );
    }

    const job = await assignFreelancerToJob(jobId, auth.userId, freelancerId, proposalId);

    return NextResponse.json(
      {
        success: true,
        message: "Freelancer assigned successfully",
        job
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Assign Freelancer error:", error);

    if (error.message.includes("not found") || error.message.includes("already assigned")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to assign freelancer",
        error: error.message
      },
      { status: 500 }
    );
  }
}