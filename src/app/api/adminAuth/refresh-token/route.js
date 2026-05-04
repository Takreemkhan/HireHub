import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {

  try {

    const body = await req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message: "Invalid refresh token"
      },
      { status: 403 }
    );
  }
}