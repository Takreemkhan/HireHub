import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { verifyOTP } from "@/app/controllers/otp-verification.controller";

/* POST - Verify OTP and Reset Password */
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, otp, newPassword } = body;

    // Validation
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, OTP, and new password are required"
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be at least 6 characters"
        },
        { status: 400 }
      );
    }

    // Verify OTP code first
    const verifyResult = await verifyOTP(email.toLowerCase(), otp);
    if (!verifyResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: verifyResult.message || "Invalid or expired OTP"
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in database
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updateResult = await db.collection(COLLECTIONS.USERS).updateOne(
      { email: email.toLowerCase() },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        } 
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found"
        },
        { status: 404 }
      );
    }

    // Also mark the OTP verification record as verified/used
    await db.collection(COLLECTIONS.OTP_VERIFICATIONS).updateOne(
      { email: email.toLowerCase() },
      { $set: { verified: true, verifiedAt: new Date() } }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully. You can now log in."
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to reset password",
        error: error.message
      },
      { status: 500 }
    );
  }
}
