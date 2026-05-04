import { NextResponse } from "next/server";
import {
  saveDraftProposal,
  getFreelancerDraftProposals
} from "@/app/controllers/draft-proposal.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* GET - Get all draft proposals for freelancer */
export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const result = await getFreelancerDraftProposals(auth.userId, page, limit);

    return NextResponse.json(
      {
        success: true,
        ...result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Draft Proposals GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch draft proposals",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/* POST - Save draft proposal */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        {
          success: false,
          message: "jobId is required"
        },
        { status: 400 }
      );
    }

    const draft = await saveDraftProposal(auth.userId, body);

    return NextResponse.json(
      {
        success: true,
        message: "Draft proposal saved successfully",
        draft
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Save Draft Proposal error:", error);

    if (error.message.includes("not found")) {
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
        message: "Failed to save draft proposal",
        error: error.message
      },
      { status: 500 }
    );
  }
}