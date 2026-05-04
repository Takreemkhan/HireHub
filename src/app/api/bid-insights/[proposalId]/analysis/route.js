import { NextResponse } from "next/server";
import { getCompetitiveAnalysis } from "@/app/controllers/bid-insights.controller";
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from "@/lib/auth.middleware";

/* GET - Get competitive analysis for a specific proposal */
export async function GET(req, { params }) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { proposalId } = params;

    // Get competitive analysis
    const analysis = await getCompetitiveAnalysis(proposalId, auth.userId);

    return NextResponse.json(
      {
        success: true,
        analysis
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Competitive Analysis GET error:", error);

    if (error.message.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 404 }
      );
    }

    if (error.message.includes("permission")) {
      return forbiddenResponse(error.message);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch competitive analysis",
        error: error.message
      },
      { status: 500 }
    );
  }
}