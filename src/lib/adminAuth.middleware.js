import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const JWT_EXPIRE = "7d";

// Generate JWT Token
export const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      name: admin.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// Verify JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Set cookie with token
export const setTokenCookie = (token) => {
  cookies().set({
    name: "admin_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
};

// Remove token cookie
export const removeTokenCookie = () => {
  cookies().delete("admin_token");
};

// Get token from cookie
export const getTokenFromCookie = () => {
  return cookies().get("admin_token")?.value;
};