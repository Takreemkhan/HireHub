import { NextResponse } from "next/server";
import { unauthorizedResponse, verifyAuth } from "@/lib/auth.middleware";
import { getProfileByUserId } from "@/app/controllers/client.controller";

export async function GET(req, { params }) {
  try {

    const { id } = await params;
    console.log("user-id", id);

    const profile = await getProfileByUserId(id);

    console.log("user-profile", profile);

    // ✅ Profile not found case
    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile not found",
        },
        { status: 404 }
      );
    }

    // ✅ Success response
    return NextResponse.json(
      {
        success: true,
        data: profile,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("File-upload GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch profile",
        error: error.message,
      },
      { status: 500 }
    );
  }
}