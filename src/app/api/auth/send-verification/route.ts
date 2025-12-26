import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createVerificationToken } from "@/lib/auth/verification";
import { sendEmail } from "@/lib/email";
import { verificationEmailTemplate } from "@/lib/email/templates";
import { verificationLimiter, getClientIP } from "@/lib/security/rate-limit";
import { createAuditLog, getClientInfo } from "@/lib/security/audit";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting per user
    const ip = getClientIP(request);
    const rateLimitKey = `verification:${session.user.id}:${ip}`;
    const { success, resetIn } = verificationLimiter(rateLimitKey);

    if (!success) {
      return NextResponse.json(
        {
          error: "Please wait before requesting another code",
          retryAfter: Math.ceil(resetIn / 1000),
        },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    // Get locale from request body or default to "ar"
    let locale = "ar";
    try {
      const body = await request.json();
      locale = body.locale || "ar";
    } catch {
      // Body might be empty, use default locale
    }

    // Generate and store token
    const token = await createVerificationToken(user.id);

    // Send email
    await sendEmail({
      to: user.email,
      subject:
        locale === "ar"
          ? "تأكيد بريدك الإلكتروني - واتساب بوت"
          : "Verify Your Email - WhatsApp Bot",
      html: verificationEmailTemplate(token, locale),
    });

    // Log the action
    await createAuditLog({
      userId: user.id,
      action: "VERIFICATION_CODE_SENT",
      ...getClientInfo(request),
    });

    return NextResponse.json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Send verification error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
