import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

/* Middleware to verify JWT token from NextAuth Usage: Wrap  API routes with this function */
export async function verifyAuth(req) {
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      return {
        authenticated: false,
        error: "Unauthorized - No valid token found",
        userId: null
      };
    }

    // Token is valid
    return {
      authenticated: true,
      userId: token.id || token.sub,
      email: token.email,
      name: token.name,
      token
    };

  } catch (error) {
    return {
      authenticated: false,
      error: "Token verification failed",
      userId: null
    };
  }
}

/* Helper function to create unauthorized response */
export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json(
    { 
      success: false,
      message,
      error: "UNAUTHORIZED" 
    },
    { status: 401 }
  );
}

/* Helper function to create forbidden response */
export function forbiddenResponse(message = "Forbidden - Insufficient permissions") {
  return NextResponse.json(
    { 
      success: false,
      message,
      error: "FORBIDDEN" 
    },
    { status: 403 }
  );
}

/* Check if user owns the resource */
export function checkOwnership(tokenUserId, resourceUserId) {
  return tokenUserId === resourceUserId || 
         tokenUserId === resourceUserId.toString();
}
