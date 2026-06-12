import { NextResponse } from "next/server";
import {
  upsertFreelancerProfile,
  getFreelancerProfile,
  deleteFreelancerProfile,
  getAllFreelancerProfiles
} from "@/app/controllers/freelancer-profile.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import { getOrSetCache, invalidateCache, redis } from "@/lib/redis";

/**
 * POST - Create or Update Freelancer Profile
 * Route: /api/freelancer/profile
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();

    const profile = await upsertFreelancerProfile(auth.userId, body);

    // Invalidate the cache for this specific profile and the list of profiles
    await invalidateCache([`api:freelancer:profile:${auth.userId}`]);
    if (redis) {
      const keys = await redis.keys('api:freelancer:profiles:all:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        profile
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Freelancer Profile POST error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Get Freelancer Profile or All Profiles
 * Route: /api/freelancer/profile
 * Query: userId (optional), page, limit, filters
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    // Get single profile
    if (userId) {
      const profile = await getOrSetCache(
        `api:freelancer:profile:${userId}`,
        async () => {
          return await getFreelancerProfile(userId);
        },
        600 // Cache for 10 minutes
      );

      if (!profile) {
        return NextResponse.json(
          {
            success: false,
            message: "Profile not found"
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          profile
        },
        { status: 200 }
      );
    }

    // Get all profiles with filters
    const filters = {
      skills: searchParams.get("skills")?.split(","),
      title: searchParams.get("title")?.split(","),
      minRate: searchParams.get("minRate"),
      maxRate: searchParams.get("maxRate"),
      location: searchParams.get("location"),
      search: searchParams.get("search")
    };

    const cacheKey = `api:freelancer:profiles:all:${page}:${limit}:${JSON.stringify(filters)}`;

    const result = await getOrSetCache(
      cacheKey,
      async () => {
        return await getAllFreelancerProfiles(page, limit, filters);
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
    console.error("Freelancer Profile GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch profiles",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete Freelancer Profile
 * Route: /api/freelancer/profile
 */
export async function DELETE(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const deleted = await deleteFreelancerProfile(auth.userId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile not found"
        },
        { status: 404 }
      );
    }

    // Invalidate caches
    await invalidateCache([`api:freelancer:profile:${auth.userId}`]);
    if (redis) {
      const keys = await redis.keys('api:freelancer:profiles:all:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile deleted successfully"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Freelancer Profile DELETE error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete profile",
        error: error.message
      },
      { status: 500 }
    );
  }
}