import { NextResponse } from "next/server";
import { 
  getFreelancerCompletedJobs,
  addFreelancerReviewForClient
} from "@/app/controllers/freelancer-jobs.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* GET - Get freelancer's completed jobs */
export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const result = await getFreelancerCompletedJobs(auth.userId, page, limit);

    return NextResponse.json(
      {
        success: true,
        ...result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Freelancer Completed Jobs GET error:", error);
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

/* POST - Add review for client */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();
    const { jobId, rating, comment } = body;

    if (!jobId || !rating) {
      return NextResponse.json(
        {
          success: false,
          message: "jobId and rating are required"
        },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be between 1 and 5"
        },
        { status: 400 }
      );
    }

    const job = await addFreelancerReviewForClient(
      jobId,
      auth.userId,
      { rating, comment }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully",
        job
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Add Review error:", error);

    if (error.message.includes("not found") || 
        error.message.includes("permission") ||
        error.message.includes("already reviewed")) {
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
        message: "Failed to submit review",
        error: error.message
      },
      { status: 500 }
    );
  }
}