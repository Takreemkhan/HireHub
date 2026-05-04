import { NextResponse } from "next/server";
import {
  generatePublicShareLink,
  shareJobViaMessage,
  getJobShares
} from "@/app/controllers/job-sharing.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* POST - Share job (public link or direct message with chat)
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();
    const { jobId, shareType, freelancerId, message } = body;

    if (!jobId || !shareType) {
      return NextResponse.json(
        {
          success: false,
          message: "jobId and shareType are required"
        },
        { status: 400 }
      );
    }

    if (!["public_link", "direct_message"].includes(shareType)) {
      return NextResponse.json(
        {
          success: false,
          message: "shareType must be 'public_link' or 'direct_message'"
        },
        { status: 400 }
      );
    }

    // Public link sharing
    if (shareType === "public_link") {
      const shareData = await generatePublicShareLink(jobId, auth.userId);

      return NextResponse.json(
        {
          success: true,
          message: "Public share link generated successfully",
          ...shareData
        },
        { status: 201 }
      );
    }

    // Direct message sharing (with chat integration)
    if (shareType === "direct_message") {
      if (!freelancerId) {
        return NextResponse.json(
          {
            success: false,
            message: "freelancerId is required for direct message"
          },
          { status: 400 }
        );
      }

      const shareData = await shareJobViaMessage(
        jobId, 
        auth.userId, 
        freelancerId, 
        message
      );

      return NextResponse.json(
        {
          success: true,
          message: "Job shared successfully and added to chat",
          ...shareData
        },
        { status: 201 }
      );
    }

  } catch (error) {
    console.error("Job Share error:", error);

    if (error.message.includes("not found") || error.message.includes("permission")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 404 }
      );
    }

    if (error.message.includes("draft")) {
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
        message: "Failed to share job",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/* GET - Get all shares for a job*/
export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        {
          success: false,
          message: "jobId is required"
        },
        { status: 400 }
      );
    }

    const result = await getJobShares(jobId, auth.userId);

    return NextResponse.json(
      {
        success: true,
        ...result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Get Job Shares error:", error);

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
        message: "Failed to fetch shares",
        error: error.message
      },
      { status: 500 }
    );
  }
}