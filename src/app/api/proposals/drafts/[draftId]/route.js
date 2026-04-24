import { NextResponse } from "next/server";
import {
  getDraftProposalById,
  updateDraftProposal,
  deleteDraftProposal,
  publishDraftProposal
} from "@/app/controllers/draft-proposal.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* GET - Get single draft proposal */
export async function GET(req, context) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const params = await context.params;
    const draftId = params.draftId;

    const draft = await getDraftProposalById(draftId, auth.userId);

    return NextResponse.json(
      {
        success: true,
        draft
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Draft Proposal GET error:", error);

    if (error.message.includes("not found") || error.message.includes("permission")) {
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
        message: "Failed to fetch draft proposal",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/* PUT - Update draft proposal */
export async function PUT(req, context) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const params = await context.params;
    const draftId = params.draftId;

    const body = await req.json();

    const draft = await updateDraftProposal(draftId, auth.userId, body);

    return NextResponse.json(
      {
        success: true,
        message: "Draft proposal updated successfully",
        draft
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Update Draft Proposal error:", error);

    if (error.message.includes("not found") || error.message.includes("permission")) {
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
        message: "Failed to update draft proposal",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/* DELETE - Delete draft proposal  */
export async function DELETE(req, context) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const params = await context.params;
    const draftId = params.draftId;

    const deleted = await deleteDraftProposal(draftId, auth.userId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Draft proposal not found"
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Draft proposal deleted successfully"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Delete Draft Proposal error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete draft proposal",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/* PATCH - Publish draft proposal (convert to real proposal)  */
export async function PATCH(req, context) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const params = await context.params;
    const draftId = params.draftId;

    const body = await req.json();

    if (body.action !== "publish") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action. Use 'publish' to submit proposal."
        },
        { status: 400 }
      );
    }

    const proposal = await publishDraftProposal(draftId, auth.userId);

    return NextResponse.json(
      {
        success: true,
        message: "Proposal published successfully",
        proposal
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Publish Draft Proposal error:", error);

    if (error.message.includes("not found") || 
        error.message.includes("permission") ||
        error.message.includes("Missing required") ||
        error.message.includes("already submitted") ||
        error.message.includes("no longer accepting")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to publish proposal",
        error: error.message
      },
      { status: 500 }
    );
  }
}