import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/auth/password-reset";
import { sendEmail } from "@/lib/email";
import { passwordResetEmailTemplate } from "@/lib/email/templates";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
  locale: z.enum(["ar", "en"]).optional().default("ar"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { email, locale } = result.data;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If the email exists, a reset link has been sent",
      });
    }

    // Create reset token
    const token = await createPasswordResetToken(email);

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // Send email
    await sendEmail({
      to: email,
      subject:
        locale === "ar"
          ? "إعادة تعيين كلمة المرور - WhatsApp Bot"
          : "Reset Your Password - WhatsApp Bot",
      html: passwordResetEmailTemplate(resetUrl, locale),
    });

    return NextResponse.json({
      message: "If the email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
