import { NextResponse } from "next/server";
import { getClientCompletedJobs, markJobAsCompleted } from "@/app/controllers/client-jobs.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* GET - Get client's completed jobs
 */
export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const result = await getClientCompletedJobs(auth.userId, page, limit);

    return NextResponse.json(
      {
        success: true,
        ...result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Client Completed Jobs GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch completed jobs",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/* POST - Mark job as completed with review */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();
    const { jobId, finalAmount, notes, clientReview } = body;

    if (!jobId) {
      return NextResponse.json(
        {
          success: false,
          message: "jobId is required"
        },
        { status: 400 }
      );
    }

    // Validate review if provided
    if (clientReview) {
      if (!clientReview.rating || clientReview.rating < 1 || clientReview.rating > 5) {
        return NextResponse.json(
          {
            success: false,
            message: "Rating must be between 1 and 5"
          },
          { status: 400 }
        );
      }
    }

    const completedJob = await markJobAsCompleted(
      jobId,
      auth.userId,
      { finalAmount, notes, clientReview }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Job marked as completed successfully",
        job: completedJob
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Mark Job Completed error:", error);

    if (error.message.includes("not found") || error.message.includes("cannot be marked")) {
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
        message: "Failed to mark job as completed",
        error: error.message
      },
      { status: 500 }
    );
  }
}