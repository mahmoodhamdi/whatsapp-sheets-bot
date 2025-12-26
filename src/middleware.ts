import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/pricing",
  "/features",
  "/docs",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/privacy",
  "/terms",
];

// Routes that start with these prefixes are public
const publicPrefixes = ["/api/auth", "/docs/"];

// Routes that require authentication but not email verification
const authOnlyRoutes = ["/verify-email"];

function isPublicRoute(pathname: string): boolean {
  if (publicRoutes.includes(pathname)) return true;
  return publicPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function isAuthOnlyRoute(pathname: string): boolean {
  return authOnlyRoutes.includes(pathname);
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isEmailVerified = req.auth?.user?.emailVerified ?? false;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    // If logged in and trying to access auth pages, redirect appropriately
    if (isLoggedIn && ["/login", "/register"].includes(pathname)) {
      // If email not verified, go to verify-email
      if (!isEmailVerified) {
        return NextResponse.redirect(new URL("/verify-email", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes - require authentication
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth-only routes (like verify-email) - don't require email verification
  if (isAuthOnlyRoute(pathname)) {
    // If already verified, redirect to dashboard
    if (isEmailVerified) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // For all other protected routes, require email verification
  if (!isEmailVerified) {
    return NextResponse.redirect(new URL("/verify-email", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)",
  ],
};
