import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "REGISTER"
  | "PASSWORD_CHANGED"
  | "PASSWORD_RESET_REQUESTED"
  | "PASSWORD_RESET_COMPLETED"
  | "EMAIL_VERIFIED"
  | "VERIFICATION_CODE_SENT"
  | "ACCOUNT_LOCKED"
  | "ACCOUNT_UNLOCKED"
  | "LOGOUT_ALL_DEVICES";

interface AuditLogData {
  userId?: string;
  action: AuditAction;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        details: data.details as Prisma.InputJsonValue | undefined,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  } catch (error) {
    // Don't throw - audit logging should not break the main flow
    console.error("Failed to create audit log:", error);
  }
}

// Helper to get client info from request
export function getClientInfo(request: Request): {
  ipAddress: string;
  userAgent: string;
} {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ipAddress = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "unknown";

  return {
    ipAddress,
    userAgent: request.headers.get("user-agent") || "unknown",
  };
}

// Get recent audit logs for a user
export async function getUserAuditLogs(
  userId: string,
  limit: number = 50
): Promise<
  Array<{
    action: string;
    details: unknown;
    ipAddress: string | null;
    createdAt: Date;
  }>
> {
  return prisma.auditLog.findMany({
    where: { userId },
    select: {
      action: true,
      details: true,
      ipAddress: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// Get security-related events for monitoring
export async function getSecurityEvents(
  hours: number = 24
): Promise<
  Array<{
    action: string;
    userId: string | null;
    ipAddress: string | null;
    createdAt: Date;
  }>
> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  return prisma.auditLog.findMany({
    where: {
      createdAt: { gte: since },
      action: {
        in: [
          "LOGIN_FAILED",
          "ACCOUNT_LOCKED",
          "PASSWORD_RESET_REQUESTED",
          "PASSWORD_CHANGED",
        ],
      },
    },
    select: {
      action: true,
      userId: true,
      ipAddress: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
