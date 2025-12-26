import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  validateResetToken,
  consumeResetToken,
} from "@/lib/auth/password-reset";
import { createAuditLog, getClientInfo } from "@/lib/security/audit";
import bcrypt from "bcryptjs";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid password";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { token, password } = result.data;

    // Validate token
    const email = await validateResetToken(token);

    if (!email) {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    // Get user for audit logging
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password and reset failed attempts
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        lastPasswordChange: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Delete the used token
    await consumeResetToken(token);

    // Log password change
    await createAuditLog({
      userId: user?.id,
      action: "PASSWORD_RESET_COMPLETED",
      ...getClientInfo(request),
    });

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
