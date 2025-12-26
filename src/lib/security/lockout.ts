import { prisma } from "@/lib/prisma";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function checkAccountLocked(email: string): Promise<{
  isLocked: boolean;
  lockedUntil?: Date;
}> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { lockedUntil: true },
  });

  if (!user) {
    return { isLocked: false };
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { isLocked: true, lockedUntil: user.lockedUntil };
  }

  return { isLocked: false };
}

export async function recordFailedAttempt(email: string): Promise<{
  locked: boolean;
  attemptsRemaining: number;
}> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, failedLoginAttempts: true },
  });

  if (!user) {
    return { locked: false, attemptsRemaining: MAX_FAILED_ATTEMPTS };
  }

  const newAttempts = user.failedLoginAttempts + 1;
  const shouldLock = newAttempts >= MAX_FAILED_ATTEMPTS;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: newAttempts,
      lockedUntil: shouldLock
        ? new Date(Date.now() + LOCKOUT_DURATION_MS)
        : null,
    },
  });

  return {
    locked: shouldLock,
    attemptsRemaining: Math.max(0, MAX_FAILED_ATTEMPTS - newAttempts),
  };
}

export async function resetFailedAttempts(email: string): Promise<void> {
  await prisma.user.update({
    where: { email },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
}

export async function unlockAccount(email: string): Promise<void> {
  await prisma.user.update({
    where: { email },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
}

export function getLockoutDurationMinutes(): number {
  return LOCKOUT_DURATION_MS / 60000;
}

export function getMaxFailedAttempts(): number {
  return MAX_FAILED_ATTEMPTS;
}
