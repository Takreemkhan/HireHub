import { NextResponse } from "next/server";
import {
  getBidInsights,
  getBidInsightsSummary,
  getCompetitiveAnalysis
} from "@/app/controllers/bid-insights.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* GET - Get Bid Insights for logged-in freelancer */
export async function GET(req) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(req.url);
    const summaryOnly = searchParams.get("summary") === "true";
    const status = searchParams.get("status");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    // requesting summary
    if (summaryOnly) {
      const summary = await getBidInsightsSummary(auth.userId);

      return NextResponse.json(
        {
          success: true,
          ...summary
        },
        { status: 200 }
      );
    }

    // Get full bid insights
    const filters = {
      status,
      page: page || 1,
      limit: limit || 10
    };

    const result = await getBidInsights(auth.userId, filters);

    return NextResponse.json(
      {
        success: true,
        ...result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Bid Insights GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch bid insights",
        error: error.message
      },
      { status: 500 }
    );
  }
}