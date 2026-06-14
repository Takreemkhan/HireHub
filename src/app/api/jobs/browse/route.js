import { NextResponse } from "next/server";
import {
  getAllJobsForFreelancer,
  getFeaturedJobs,
  getJobCategories,
} from "@/app/controllers/job.controller";
import { getOrSetCache } from "@/lib/redis";

/* GET - Browse all jobs (Freelancer side) */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // ── Categories (cached 10 min — rarely changes) ──────────────────────────
    if (searchParams.get("categories") === "true") {
      const categories = await getOrSetCache(
        "api:jobs:categories",
        () => getJobCategories(),
        600 // 10 minutes
      );
      const response = NextResponse.json({ success: true, categories }, { status: 200 });
      response.headers.set("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
      return response;
    }

    // ── Featured jobs (cached 60s — active within 24h window) ────────────────
    if (searchParams.get("featured") === "true") {
      const limit = Number(searchParams.get("limit")) || 10;
      const jobs = await getOrSetCache(
        `api:jobs:featured:${limit}`,
        () => getFeaturedJobs(limit),
        60 // 60 seconds
      );
      const response = NextResponse.json({ success: true, jobs, total: jobs.length }, { status: 200 });
      response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
      return response;
    }

    // ── All jobs with filters (cached 60s per unique filter combination) ─────
    const filters = {
      category: searchParams.get("category"),
      subCategory: searchParams.get("subCategory"),
      minBudget: searchParams.get("minBudget"),
      maxBudget: searchParams.get("maxBudget"),
      projectDuration: searchParams.get("projectDuration"),
      search: searchParams.get("search"),
      sortBy: searchParams.get("sortBy") || "recent",
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
    };

    // Build a stable cache key from the filter params
    const cacheKey = `api:jobs:browse:${searchParams.toString()}`;

    const result = await getOrSetCache(
      cacheKey,
      () => getAllJobsForFreelancer(filters),
      60 // 60 seconds — short enough to reflect new posts quickly
    );

    const response = NextResponse.json({ success: true, ...result }, { status: 200 });
    // Allow CDNs to cache public job listings for 60s
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    return response;

  } catch (error) {
    console.error("Jobs Browse GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch jobs", error: error.message },
      { status: 500 }
    );
  }
}
