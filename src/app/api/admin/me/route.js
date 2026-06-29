import { NextResponse } from "next/server";
import { verifyToken, getTokenFromCookie } from "@/lib/adminAuth.middleware";

export async function GET() {
  try {
    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
    }
    return NextResponse.json({
      success: true,
      email: decoded.email,
      name: decoded.name || "Admin",
      id: decoded.id
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
