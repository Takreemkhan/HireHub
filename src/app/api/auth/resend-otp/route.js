import { NextResponse } from "next/server";
import { resendOTP } from "@/app/controllers/otp-verification.controller";

/* POST - Resend OTP  */
export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required"
        },
        { status: 400 }
      );
    }

    // Resend OTP
    const result = await resendOTP(email);

    return NextResponse.json(
      {
        success: true,
        message: result.message
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Resend OTP error:", error);

    if (error.message.includes("not found") || 
        error.message.includes("already verified") ||
        error.message.includes("Too many")) {
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
        message: "Failed to resend OTP",
        error: error.message
      },
      { status: 500 }
    );
  }
}