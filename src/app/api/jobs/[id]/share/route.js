
import { NextResponse } from "next/server";
import {
  generatePublicShareLink,
  shareJobViaMessage,
  getJobShares
} from "@/app/controllers/job-sharing.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* POST - Share job */
export async function POST(req, context) {
  try {
    // Verify token
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

   
    const params = await context.params;
    const jobId = params.id;

   
    console.log("JobId from URL:", jobId);
    console.log("ClientId from token:", auth.userId);

    const body = await req.json();
    const { shareType, freelancerId, message } = body;

    console.log("ShareType:", shareType);
    console.log("FreelancerId:", freelancerId);
   

    // Validate shareType
    if (!shareType || !["public_link", "direct_message"].includes(shareType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid shareType. Must be 'public_link' or 'direct_message'"
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

    // Direct message sharing
    if (shareType === "direct_message") {
      if (!freelancerId) {
        return NextResponse.json(
          {
            success: false,
            message: "freelancerId is required for direct message sharing"
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
          message: "Job shared with freelancer successfully",
          ...shareData
        },
        { status: 201 }
      );
    }

  } catch (error) {
    console.error("Job Share POST error:", error);

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

/* GET - Get all shares for a job */
export async function GET(req, context) {
  try {
    // Verify token
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

 
    const params = await context.params;
    const jobId = params.id;

    console.log("Share GET - JobId:", jobId);
    console.log("Share GET - ClientId:", auth.userId);

    const result = await getJobShares(jobId, auth.userId);

    return NextResponse.json(
      {
        success: true,
        ...result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Job Shares GET error:", error);

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