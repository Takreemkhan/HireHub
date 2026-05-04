import { NextResponse } from "next/server";
import {
  getProposalById,
  shortlistProposal,
  removeFromShortlist,
  acceptProposal,
  rejectProposal,
  withdrawProposal
} from "@/app/controllers/proposal.controller";
import {
  verifyAuth,
  unauthorizedResponse,
  forbiddenResponse
} from "@/lib/auth.middleware";

/**
 * GET - Get single proposal details
 * Route: /api/proposals/[proposalId]
 */
export async function GET(req, { params }) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { proposalId } = params;

    const proposal = await getProposalById(proposalId, auth.userId);

    return NextResponse.json(
      {
        success: true,
        proposal
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Proposal GET error:", error);

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
        message: "Failed to fetch proposal",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Perform actions on proposal
 * Actions: shortlist, remove_shortlist, accept, reject, withdraw
 * Route: /api/proposals/[proposalId]
 */
export async function PATCH(req, { params }) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { proposalId } = params;
    const body = await req.json();
    const { action, responseNote } = body;

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          message: "Action is required"
        },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "shortlist":
        result = await shortlistProposal(proposalId, auth.userId);
        break;

      case "remove_shortlist":
        result = await removeFromShortlist(proposalId, auth.userId);
        break;

      case "accept":
        result = await acceptProposal(proposalId, auth.userId, responseNote);
        break;

      case "reject":
        result = await rejectProposal(proposalId, auth.userId, responseNote);
        break;

      case "withdraw":
        result = await withdrawProposal(proposalId, auth.userId);
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid action. Use: shortlist, remove_shortlist, accept, reject, or withdraw"
          },
          { status: 400 }
        );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Proposal ${action} successful`,
        proposal: result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Proposal PATCH error:", error);

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

    if (error.message.includes("already")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to perform action",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete/Cancel proposal (soft delete)
 * Route: /api/proposals/[proposalId]
 */
export async function DELETE(req, { params }) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { proposalId } = params;

    // Use withdraw functionality for delete
    const result = await withdrawProposal(proposalId, auth.userId);

    return NextResponse.json(
      {
        success: true,
        message: "Proposal withdrawn successfully",
        proposal: result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Proposal DELETE error:", error);

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
        message: "Failed to withdraw proposal",
        error: error.message
      },
      { status: 500 }
    );
  }
}
