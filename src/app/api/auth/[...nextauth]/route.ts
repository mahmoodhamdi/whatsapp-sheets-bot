import { handlers } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { loginLimiter, getClientIP } from "@/lib/security/rate-limit";

// Wrap POST handler with rate limiting for login attempts
const wrappedPOST = async (request: NextRequest) => {
  // Only rate limit the credentials callback (login attempts)
  if (request.nextUrl.pathname.includes("/callback/credentials")) {
    const ip = getClientIP(request);
    const { success, resetIn } = loginLimiter(ip);

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many login attempts. Please try again later.",
          retryAfter: Math.ceil(resetIn / 1000),
        },
        { status: 429 }
      );
    }
  }

  return handlers.POST(request);
};

export const { GET } = handlers;
export { wrappedPOST as POST };
