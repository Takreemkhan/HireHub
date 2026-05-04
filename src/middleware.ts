import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// ─── Routes that require a logged-in user ────────────────────────────────────
const PROTECTED_PREFIXES = [
  "/freelancer-dashboard",
  "/client-dashboard",
  "/post-page",
  "/payment-center",
  "/workspace-dashboard",
  "/freelancer",
  "/client",
  "/chat",
  "/current-job-post",
  "/client-profile",
  "/user-profile",
  "/freelancer-membership",
  "/client-membership",
  "/proposal-reference",
];

// ─── Admin-only routes ────────────────────────────────────────────────────────
const ADMIN_PREFIXES = ["/admin"];

// ─── Freelancer-only routes ───────────────────────────────────────────────────
const FREELANCER_ONLY_PREFIXES = ["/search-and-discovery"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

function isAdminRoute(pathname: string): boolean {
  return (
    ADMIN_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
    ) && pathname !== "/adminlogin"
  );
}

function isFreelancerOnly(pathname: string): boolean {
  return FREELANCER_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

/** NextAuth JWT cookie */
function getSessionToken(request: NextRequest): string | undefined {
  return (
    request.cookies.get("next-auth.session-token")?.value ??
    request.cookies.get("__Secure-next-auth.session-token")?.value
  );
}

/** JWT decode */
async function getUserRole(request: NextRequest): Promise<string | null> {
  const token = getSessionToken(request);
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return (payload.role as string) ?? null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Admin route guard ──────────────────────────────────────────────────
  if (isAdminRoute(pathname)) {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      const loginUrl = new URL("/adminlogin", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/adminlogin") {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (adminToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // ── 2. Freelancer-only route guard ────────────────────────────────────────
  // Rule: client → /client-dashboard | freelancer OR not-logged-in → allow
  if (isFreelancerOnly(pathname)) {
    const sessionToken = getSessionToken(request);

    // No session = not logged in → allow (freelancers & guests can browse)
    if (sessionToken) {
      const role = await getUserRole(request);
      // Only clients are blocked
      if (role === "client") {
        return NextResponse.redirect(new URL("/client-dashboard", request.url));
      }
    }

    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return response;
  }

  // ── 3. User-auth route guard ──────────────────────────────────────────────
  if (isProtected(pathname)) {
    const sessionToken = getSessionToken(request);
    if (!sessionToken) {
      const signInUrl = new URL("/sign-in-page", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  return NextResponse.next();
}

// ─── Middleware ─────────────────────────────────────────
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js)$|api/).*)",
  ],
};