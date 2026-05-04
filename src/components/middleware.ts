import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Routes that require a logged-in user ────────────────────────────────────
const PROTECTED_PREFIXES = [
  "/freelancer-dashboard",
  "/client-dashboard",
  "/post-page",
  "/payment-center",
  "/workspace-dashboard",
  "/freelancer",         // /freelancer/messages, /freelancer/contracts, etc.
  "/client",             // /client/messages, /client/contracts, etc.
  "/chat",
  "/current-job-post",
  "/client-profile",
  "/user-profile",
  "/freelancer-membership",
  "/client-membership",
  "/proposal-reference",
];

// ─── Admin-only routes (use separate admin_token cookie) ──────────────────────
const ADMIN_PREFIXES = ["/admin"];

// ─── Public routes that should never be blocked ──────────────────────────────
// (everything not in PROTECTED_PREFIXES is public by default)

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

/** NextAuth v4 stores the JWT in one of these two cookies */
function getSessionToken(request: NextRequest): string | undefined {
  return (
    request.cookies.get("next-auth.session-token")?.value ??
    request.cookies.get("__Secure-next-auth.session-token")?.value
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Admin route guard ───────────────────────────────────────────────────
  if (isAdminRoute(pathname)) {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      const loginUrl = new URL("/adminlogin", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in admin away from adminlogin
  if (pathname === "/adminlogin") {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (adminToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // ── 2. User-auth route guard ───────────────────────────────────────────────
  if (isProtected(pathname)) {
    const sessionToken = getSessionToken(request);

    if (!sessionToken) {
      // Not logged in → redirect to sign-in, preserve intended destination
      const signInUrl = new URL("/sign-in-page", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // ── 3. Logged in but on a protected page:
    //       Set Cache-Control: no-store so the browser NEVER caches this page.
    //       This kills the "back button shows old page after logout" bug.
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  return NextResponse.next();
}

// ─── Tell Next.js which paths this middleware should run on ──────────────────
export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *  - _next/static  (Next.js static files)
     *  - _next/image   (Next.js image optimisation)
     *  - favicon.ico
     *  - public folder files (png, svg, jpg, etc.)
     *  - /api routes   (API routes handle their own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js)$|api/).*)",
  ],
};