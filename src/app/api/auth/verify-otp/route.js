import { NextResponse } from "next/server";
import { verifyOTP } from "@/app/controllers/otp-verification.controller";

/* POST - Verify OTP */
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    // Validation
    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and OTP are required"
        },
        { status: 400 }
      );
    }

    // Verify OTP
    const result = await verifyOTP(email, otp);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify OTP",
        error: error.message
      },
      { status: 500 }
    );
  }
}