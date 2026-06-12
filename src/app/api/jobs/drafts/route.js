import { NextResponse } from "next/server";
import {
  saveDraftJob,
  getClientDrafts,
} from "@/app/controllers/draft-job.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import { getOrSetCache, invalidateCache, redis } from "@/lib/redis";

/**
 * POST - Save job as draft
 * Route: /api/jobs/drafts
 */
export async function POST(req) {
  try {
    // Verify token
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();

    const {
      category,
      subCategory,
      title,
      description,
      budget,
      jobVisibility,
      freelancerSource,
      projectDuration,
      businessPageId
    } = body;

    // For draft, only title is required minimum
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required to save draft"
        },
        { status: 400 }
      );
    }

    // Token se userId
    const clientId = auth.userId;

    // Save as draft
    const draft = await saveDraftJob({
      clientId,
      category: category || null,
      subCategory: subCategory || null,
      title: title.trim(),
      description: description || null,
      budget: budget ? Number(budget) : null,
      freelancerSource: freelancerSource || null,
      projectDuration: projectDuration || null,
      jobVisibility: jobVisibility || "public",
      businessPageId: businessPageId ? businessPageId : null,
      isDraft: true,
      status: "draft",
      proposalCount: 0
    });

    // Invalidate client drafts cache
    if (redis) {
      const keys = await redis.keys(`api:client:drafts:${auth.userId}:*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Draft saved successfully",
        draft
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Draft POST error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save draft",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Get all drafts for logged-in client
 * Route: /api/jobs/drafts
 */
export async function GET(req) {
  try {
    // Verify token
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId") || null;

    const cacheKey = `api:client:drafts:${auth.userId}:${businessId || 'none'}`;

    const result = await getOrSetCache(
      cacheKey,
      async () => {
        const drafts = await getClientDrafts(auth.userId, businessId);
        return { drafts };
      },
      300 // 5 minutes
    );

    return NextResponse.json(
      {
        success: true,
        ...result,
        total: result.drafts.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Drafts GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch drafts",
        error: error.message
      },
      { status: 500 }
    );
  }
}