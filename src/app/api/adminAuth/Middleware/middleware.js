import { NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from "@/lib/jwt";

// Routes jo bina login ke accessible hain
const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/verify-email",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Only protect /api routes
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // No tokens at all
  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { success: false, message: "Please login karein." },
      { status: 401 }
    );
  }

  // Verify access token
  if (accessToken) {
    const decoded = verifyAccessToken(accessToken);
    if (decoded) return NextResponse.next();
  }

  // Try refresh token to issue new access token
  if (refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);
    if (decoded) {
      const newAccessToken = generateAccessToken({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      });

      const response = NextResponse.next();
      response.cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return response;
    }
  }

  return NextResponse.json(
    { success: false, message: "Session expire ho gaya. Please dobara login karein." },
    { status: 401 }
  );
}

export const config = {
  matcher: ["/api/:path*"],
};