import { NextResponse } from "next/server";
import { getAvailableJobsForFreelancer } from "@/app/controllers/freelancer-jobs.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* GET - Get available jobs for freelancer to apply */
export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    const filters = {
      category: searchParams.get("category"),
      minBudget: searchParams.get("minBudget"),
      maxBudget: searchParams.get("maxBudget"),
      search: searchParams.get("search")
    };

    const result = await getAvailableJobsForFreelancer(auth.userId, page, limit, filters);

    return NextResponse.json(
      {
        success: true,
        ...result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Available Jobs GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch available jobs",
        error: error.message
      },
      { status: 500 }
    );
  }
}