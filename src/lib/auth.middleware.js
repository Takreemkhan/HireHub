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
      // Fallback to checking standard JWT Bearer token in Authorization header
      let authHeader = null;
      if (req.headers && typeof req.headers.get === "function") {
        authHeader = req.headers.get("authorization");
      } else if (req.headers && typeof req.headers === "object") {
        authHeader = req.headers.authorization || req.headers.Authorization;
      }

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const jwtToken = authHeader.substring(7);
        const jwt = require("jsonwebtoken");
        try {
          const decoded = jwt.verify(
            jwtToken,
            process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "hirehub_default_secret_key_2024"
          );
          if (decoded) {
            return {
              authenticated: true,
              userId: decoded.userId || decoded.id || decoded.sub,
              email: decoded.email,
              name: decoded.name || "",
              token: decoded
            };
          }
        } catch (jwtError) {
          console.error("JWT Verification failed in fallback:", jwtError);
        }
      }

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
