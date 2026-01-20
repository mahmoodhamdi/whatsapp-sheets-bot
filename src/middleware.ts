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

// Security headers configuration
const securityHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://*.sentry.io wss:",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; "),
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "X-XSS-Protection": "1; mode=block",
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

// Add security headers to response
function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
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
        return addSecurityHeaders(
          NextResponse.redirect(new URL("/verify-email", req.url))
        );
      }
      return addSecurityHeaders(
        NextResponse.redirect(new URL("/dashboard", req.url))
      );
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // Protect all other routes - require authentication
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return addSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // Auth-only routes (like verify-email) - don't require email verification
  if (isAuthOnlyRoute(pathname)) {
    // If already verified, redirect to dashboard
    if (isEmailVerified) {
      return addSecurityHeaders(
        NextResponse.redirect(new URL("/dashboard", req.url))
      );
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // For all other protected routes, require email verification
  if (!isEmailVerified) {
    return addSecurityHeaders(
      NextResponse.redirect(new URL("/verify-email", req.url))
    );
  }

  return addSecurityHeaders(NextResponse.next());
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)",
  ],
};
