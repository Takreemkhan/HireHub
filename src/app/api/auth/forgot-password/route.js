import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { generateOTP, saveOTP, sendForgotPasswordOTPEmail } from "@/app/controllers/otp-verification.controller";

/* POST - Request Forgot Password OTP */
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

    // Check if user exists in the database
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const user = await db.collection(COLLECTIONS.USERS).findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Account not found with this email"
        },
        { status: 404 }
      );
    }

    // Generate and save OTP
    const otp = generateOTP();
    await saveOTP(email.toLowerCase(), otp);

    // Send reset OTP email
    await sendForgotPasswordOTPEmail(email.toLowerCase(), otp);

    return NextResponse.json(
      {
        success: true,
        message: "Password reset OTP sent to your email"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process forgot password request",
        error: error.message
      },
      { status: 500 }
    );
  }
}
