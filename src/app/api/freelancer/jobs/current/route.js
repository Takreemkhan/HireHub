import { NextResponse } from "next/server";
import { 
  getFreelancerCurrentJobs, 
  submitJobForCompletion 
} from "@/app/controllers/freelancer-jobs.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* GET - Get freelancer's current jobs (in-progress) */
export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const result = await getFreelancerCurrentJobs(auth.userId, page, limit);

    return NextResponse.json(
      {
        success: true,
        ...result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Freelancer Current Jobs GET error:", error);
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

/* POST - Submit job for completion */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();
    const { jobId, notes, deliverables } = body;

    if (!jobId) {
      return NextResponse.json(
        {
          success: false,
          message: "jobId is required"
        },
        { status: 400 }
      );
    }

    const job = await submitJobForCompletion(
      jobId,
      auth.userId,
      { notes, deliverables }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Job submitted for review successfully",
        job
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Submit Job error:", error);

    if (error.message.includes("not found") || error.message.includes("permission")) {
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
        message: "Failed to submit job",
        error: error.message
      },
      { status: 500 }
    );
  }
}