import { NextResponse } from "next/server";
import { getClientCurrentJobs, assignFreelancerToJob } from "@/app/controllers/client-jobs.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import { getOrSetCache, invalidateCache, redis } from "@/lib/redis";

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
    const businessId = searchParams.get("businessId") || null;

    const cacheKey = `api:client:jobs:current:${auth.userId}:${page}:${limit}:${businessId || 'none'}`;

    const result = await getOrSetCache(
      cacheKey,
      async () => {
        return await getClientCurrentJobs(auth.userId, page, limit, businessId);
      },
      300 // Cache for 5 minutes
    );

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

    // Invalidate client's current jobs cache
    if (redis) {
      const keys = await redis.keys(`api:client:jobs:current:${auth.userId}:*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }
    // Also invalidate the general job details and list caches
    await invalidateCache([`api:jobs:${jobId}`, 'api:jobs:all']);

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