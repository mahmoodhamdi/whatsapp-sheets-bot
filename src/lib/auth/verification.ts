import { prisma } from "@/lib/prisma";
import { randomInt } from "crypto";

/**
 * Generate a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return randomInt(100000, 999999).toString();
}

/**
 * Create a new verification token for a user
 * Deletes any existing tokens first
 */
export async function createVerificationToken(userId: string): Promise<string> {
  // Delete existing tokens for this user
  await prisma.verificationToken.deleteMany({
    where: { userId },
  });

  const token = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.verificationToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

/**
 * Verify a token and mark email as verified
 * Returns true if successful, false if token is invalid/expired
 */
export async function verifyToken(
  userId: string,
  token: string
): Promise<boolean> {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      userId,
      token,
      expiresAt: { gt: new Date() },
    },
  });

  if (!verificationToken) {
    return false;
  }

  // Mark email as verified
  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });

  // Delete used token
  await prisma.verificationToken.delete({
    where: { id: verificationToken.id },
  });

  return true;
}

/**
 * Check if a user's email is verified
 */
export async function isEmailVerified(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });

  return user?.emailVerified ?? false;
}
