import { NextResponse } from "next/server";
import {
  submitProposal,
  getProposalsForJob,
  getFreelancerProposals
} from "@/app/controllers/proposal.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";


/* POST - Submit a proposal (Freelancer bids on job) */
export async function POST(req) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();

    const {
      jobId,
      proposalText,
      bidAmount,
      depositRequired,
      currency,
      estimatedDuration,
      attachments,
      resumeID
    } = body;

    // Validation
    if (!jobId || !proposalText || !bidAmount) {
      return NextResponse.json(
        {
          success: false,
          message: "Job ID, proposal text, and bid amount are required"
        },
        { status: 400 }
      );
    }

    if (proposalText.length < 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Proposal must be at least 50 characters long"
        },
        { status: 400 }
      );
    }

    if (bidAmount < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Bid amount must be greater than 0"
        },
        { status: 400 }
      );
    }



    // Submit proposal
    const proposal = await submitProposal({
      jobId,
      freelancerId: auth.userId,
      proposalText,
      bidAmount: Number(bidAmount),
      depositRequired: Number(depositRequired || 0),
      currency: currency || "INR",
      // coverLetter,
      estimatedDuration,
      attachments: attachments || [],
      resumeID: resumeID || ""

    });

    return NextResponse.json(
      {
        success: true,
        message: "Proposal submitted successfully",
        proposal
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Proposal POST error:", error);

    // Handle specific errors
    if (error.message.includes("already submitted")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 409 }
      );
    }

    if (error.message.includes("not found") || error.message.includes("no longer accepting")) {
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
        message: "Failed to submit proposal",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/* GET - Get proposals */
export async function GET(req) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const myProposals = searchParams.get("myProposals");
    const freelancerId = searchParams.get("freelancerId");



    // Filters
    const filters = {
      status: searchParams.get("status"),
      minBid: searchParams.get("minBid"),
      maxBid: searchParams.get("maxBid"),
      sortBy: searchParams.get("sortBy"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit")
    };

    // Get freelancer's own proposals
    if (myProposals === "true") {
      const result = await getFreelancerProposals(auth.userId, filters);

      return NextResponse.json(
        {
          success: true,
          ...result
        },
        { status: 200 }
      );
    }

    // Get proposals for a specific job (Client view)
    if (jobId) {
      const result = await getProposalsForJob(jobId, auth.userId, filters, freelancerId);

      return NextResponse.json(
        {
          success: true,
          ...result
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Please provide either jobId or set myProposals=true"
      },
      { status: 400 }
    );

  } catch (error) {
    console.error("Proposals GET error:", error);

    if (error.message.includes("not found") || error.message.includes("permission")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch proposals",
        error: error.message
      },
      { status: 500 }
    );
  }
}