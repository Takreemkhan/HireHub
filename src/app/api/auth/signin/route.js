import { NextResponse } from "next/server";
import { checkEmailVerified } from "@/app/controllers/otp-verification.controller";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

/**
 * POST - Sign in (requires verified email) */
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required"
        },
        { status: 400 }
      );
    }

    // Check if email is verified
    const verification = await checkEmailVerified(email);

    if (!verification.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password"
        },
        { status: 401 }
      );
    }

    if (!verification.verified) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email before logging in",
          requiresVerification: true,
          email
        },
        { status: 403 }
      );
    }

    // Get user
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const user = await db.collection(COLLECTIONS.USERS).findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account has been blocked. Please contact support.",
          isBlocked: true
        },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password"
        },
        { status: 401 }
      );
    }

    // Create session (your existing session logic)
    // For now, returning user data
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: userWithoutPassword
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to sign in",
        error: error.message
      },
      { status: 500 }
    );
  }
}