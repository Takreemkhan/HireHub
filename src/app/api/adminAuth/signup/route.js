import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {

    const body = await req.json();
    const { email, password, confirmPassword, firstName, lastName, role } = body;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // check existing admin
    const existingUser = await db
      .collection(COLLECTIONS.ADMIN)
      .findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin already exists with this email"
        },
        { status: 409 }
      );
    }

    // ⭐ password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // create admin
    const result = await db.collection(COLLECTIONS.ADMIN).insertOne({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      createdAt: new Date(),
      isVerified: true
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin created",
        data: result
      },
      { status: 201 }
    );

  } catch (error) {

    console.error("Signup error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create account",
        error: error.message
      },
      { status: 500 }
    );
  }
}