import { NextResponse } from "next/server";
import {
  getAllJobsForFreelancer,
  getFeaturedJobs,
  getJobCategories,
  getJobById
} from "@/app/controllers/job.controller";
//import { verifyAuth } from "@/lib/auth.middleware";

/* GET - Browse all jobs (Freelancer side) */
export async function GET(req) {
  try {
    // Authentication optional for browsing
   // const auth = await verifyAuth(req);

    const { searchParams } = new URL(req.url);

   
    if (searchParams.get("categories") === "true") {
      const categories = await getJobCategories();
      return NextResponse.json(
        {
          success: true,
          categories
        },
        { status: 200 }
      );
    }

    // Get featured jobs (last 24 hours)
    if (searchParams.get("featured") === "true") {
      const limit = Number(searchParams.get("limit")) || 10;
      const jobs = await getFeaturedJobs(limit);
      
      return NextResponse.json(
        {
          success: true,
          jobs,
          total: jobs.length
        },
        { status: 200 }
      );
    }

    // Get all jobs with filters
    const filters = {
      category: searchParams.get("category"),
      subCategory: searchParams.get("subCategory"),
      minBudget: searchParams.get("minBudget"),
      maxBudget: searchParams.get("maxBudget"),
      projectDuration: searchParams.get("projectDuration"),
      search: searchParams.get("search"),
      sortBy: searchParams.get("sortBy") || "recent", 
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20
    };

    const result = await getAllJobsForFreelancer(filters);

    return NextResponse.json(
      {
        success: true,
        ...result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Jobs Browse GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch jobs",
        error: error.message
      },
      { status: 500 }
    );
  }
}




