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

    const clientPromise = require("@/lib/mongodb").default;
    const { DB_NAME, COLLECTIONS } = require("@/lib/mongodb");
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const user = await db.collection(COLLECTIONS.USERS).findOne({ email });
    
    let userWithoutPassword = null;
    let token = null;

    if (user) {
      const { password: _, ...rest } = user;
      userWithoutPassword = rest;

      const jwt = require("jsonwebtoken");
      token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role || "freelancer" },
        process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "hirehub_default_secret_key_2024",
        { expiresIn: "30d" }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        user: userWithoutPassword,
        token: token
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