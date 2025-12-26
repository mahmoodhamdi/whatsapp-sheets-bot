import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createPasswordResetToken(email: string): Promise<string> {
  // Delete existing tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });

  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      token,
      email,
      expiresAt,
    },
  });

  return token;
}

export async function validateResetToken(token: string): Promise<string | null> {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    return null;
  }

  if (resetToken.expiresAt < new Date()) {
    // Token expired, delete it
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });
    return null;
  }

  return resetToken.email;
}

export async function consumeResetToken(token: string): Promise<void> {
  await prisma.passwordResetToken.delete({
    where: { token },
  });
}
