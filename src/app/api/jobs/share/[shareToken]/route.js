import { NextResponse } from "next/server";
import { getJobByShareToken } from "@/app/controllers/job-sharing.controller";

/* GET - View job via public share link  */
export async function GET(req, context) {
  try {
    const params = await context.params;
    const { shareToken } = params;

    if (!shareToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Share token is required"
        },
        { status: 400 }
      );
    }

    const result = await getJobByShareToken(shareToken);

    return NextResponse.json(
      {
        success: true,
        ...result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Public Share View error:", error);

    if (error.message.includes("Invalid") || error.message.includes("expired")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 404 }
      );
    }

    if (error.message.includes("not found") || error.message.includes("no longer available")) {
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
        message: "Failed to load job",
        error: error.message
      },
      { status: 500 }
    );
  }
}