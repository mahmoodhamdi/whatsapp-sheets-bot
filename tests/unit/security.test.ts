import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  createRateLimiter,
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  verificationLimiter,
  apiLimiter,
  getClientIP,
} from "@/lib/security/rate-limit";
import {
  checkAccountLocked,
  recordFailedAttempt,
  resetFailedAttempts,
  unlockAccount,
  getLockoutDurationMinutes,
  getMaxFailedAttempts,
} from "@/lib/security/lockout";
import {
  createAuditLog,
  getClientInfo,
  getUserAuditLogs,
  getSecurityEvents,
} from "@/lib/security/audit";

describe("Rate Limiter", () => {
  describe("createRateLimiter", () => {
    it("should allow requests within limit", () => {
      const limiter = createRateLimiter({ windowMs: 60000, max: 5 });

      const result1 = limiter("test-ip-1");
      expect(result1.success).toBe(true);
      expect(result1.remaining).toBe(4);

      const result2 = limiter("test-ip-1");
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(3);
    });

    it("should block requests exceeding limit", () => {
      const limiter = createRateLimiter({ windowMs: 60000, max: 3 });

      // Use up all requests
      limiter("test-ip-2");
      limiter("test-ip-2");
      limiter("test-ip-2");

      // This should be blocked
      const result = limiter("test-ip-2");
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("should track different identifiers separately", () => {
      const limiter = createRateLimiter({ windowMs: 60000, max: 2 });

      // Use up limit for ip-a
      limiter("ip-a");
      limiter("ip-a");
      const resultA = limiter("ip-a");
      expect(resultA.success).toBe(false);

      // ip-b should still work
      const resultB = limiter("ip-b");
      expect(resultB.success).toBe(true);
    });

    it("should return correct resetIn time", () => {
      const windowMs = 60000;
      const limiter = createRateLimiter({ windowMs, max: 1 });

      const result = limiter("test-ip-reset");
      expect(result.resetIn).toBeLessThanOrEqual(windowMs);
      expect(result.resetIn).toBeGreaterThan(0);
    });
  });

  describe("Pre-configured limiters", () => {
    it("loginLimiter should allow 5 requests per minute", () => {
      // First 5 should succeed
      for (let i = 0; i < 5; i++) {
        expect(loginLimiter(`login-test-${Date.now()}-${i}`).success).toBe(true);
      }
    });

    it("registerLimiter should allow 3 requests per minute", () => {
      for (let i = 0; i < 3; i++) {
        expect(registerLimiter(`register-test-${Date.now()}-${i}`).success).toBe(true);
      }
    });

    it("passwordResetLimiter should allow 3 requests per minute", () => {
      for (let i = 0; i < 3; i++) {
        expect(passwordResetLimiter(`pwreset-test-${Date.now()}-${i}`).success).toBe(true);
      }
    });

    it("verificationLimiter should allow 1 request per minute", () => {
      const result = verificationLimiter(`verify-test-${Date.now()}`);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(0);
    });

    it("apiLimiter should allow 60 requests per minute", () => {
      const result = apiLimiter(`api-test-${Date.now()}`);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(59);
    });
  });

  describe("getClientIP", () => {
    it("should extract IP from x-forwarded-for header", () => {
      const request = new Request("http://localhost", {
        headers: {
          "x-forwarded-for": "192.168.1.1, 10.0.0.1",
        },
      });

      const ip = getClientIP(request);
      expect(ip).toBe("192.168.1.1");
    });

    it("should extract IP from x-real-ip header", () => {
      const request = new Request("http://localhost", {
        headers: {
          "x-real-ip": "10.0.0.1",
        },
      });

      const ip = getClientIP(request);
      expect(ip).toBe("10.0.0.1");
    });

    it("should return unknown when no IP headers present", () => {
      const request = new Request("http://localhost");
      const ip = getClientIP(request);
      expect(ip).toBe("unknown");
    });

    it("should prefer x-forwarded-for over x-real-ip", () => {
      const request = new Request("http://localhost", {
        headers: {
          "x-forwarded-for": "192.168.1.1",
          "x-real-ip": "10.0.0.1",
        },
      });

      const ip = getClientIP(request);
      expect(ip).toBe("192.168.1.1");
    });
  });
});

describe("Account Lockout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checkAccountLocked", () => {
    it("should return false for non-existent user", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await checkAccountLocked("test@example.com");
      expect(result.isLocked).toBe(false);
    });

    it("should return false for unlocked user", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        lockedUntil: null,
      } as never);

      const result = await checkAccountLocked("test@example.com");
      expect(result.isLocked).toBe(false);
    });

    it("should return true for locked user", async () => {
      const futureDate = new Date(Date.now() + 60000);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        lockedUntil: futureDate,
      } as never);

      const result = await checkAccountLocked("test@example.com");
      expect(result.isLocked).toBe(true);
      expect(result.lockedUntil).toEqual(futureDate);
    });

    it("should return false for expired lockout", async () => {
      const pastDate = new Date(Date.now() - 60000);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        lockedUntil: pastDate,
      } as never);

      const result = await checkAccountLocked("test@example.com");
      expect(result.isLocked).toBe(false);
    });
  });

  describe("recordFailedAttempt", () => {
    it("should return not locked for non-existent user", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await recordFailedAttempt("nonexistent@example.com");
      expect(result.locked).toBe(false);
      expect(result.attemptsRemaining).toBe(5);
    });

    it("should increment failed attempts", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-1",
        failedLoginAttempts: 0,
      } as never);
      vi.mocked(prisma.user.update).mockResolvedValue({} as never);

      const result = await recordFailedAttempt("test@example.com");
      expect(result.locked).toBe(false);
      expect(result.attemptsRemaining).toBe(4);
    });

    it("should lock account after max attempts", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-1",
        failedLoginAttempts: 4,
      } as never);
      vi.mocked(prisma.user.update).mockResolvedValue({} as never);

      const result = await recordFailedAttempt("test@example.com");
      expect(result.locked).toBe(true);
      expect(result.attemptsRemaining).toBe(0);
    });
  });

  describe("resetFailedAttempts", () => {
    it("should reset failed attempts counter", async () => {
      vi.mocked(prisma.user.update).mockResolvedValue({} as never);

      await resetFailedAttempts("test@example.com");

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
    });
  });

  describe("unlockAccount", () => {
    it("should unlock account", async () => {
      vi.mocked(prisma.user.update).mockResolvedValue({} as never);

      await unlockAccount("test@example.com");

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
    });
  });

  describe("Configuration getters", () => {
    it("should return lockout duration in minutes", () => {
      const minutes = getLockoutDurationMinutes();
      expect(minutes).toBe(15);
    });

    it("should return max failed attempts", () => {
      const max = getMaxFailedAttempts();
      expect(max).toBe(5);
    });
  });
});

describe("Audit Logging", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createAuditLog", () => {
    it("should create audit log entry", async () => {
      vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

      await createAuditLog({
        userId: "user-123",
        action: "LOGIN_SUCCESS",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      });

      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: {
          userId: "user-123",
          action: "LOGIN_SUCCESS",
          details: undefined,
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0",
        },
      });
    });

    it("should create audit log with details", async () => {
      vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

      await createAuditLog({
        userId: "user-123",
        action: "LOGIN_FAILED",
        details: { reason: "invalid_password" },
      });

      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: {
          userId: "user-123",
          action: "LOGIN_FAILED",
          details: { reason: "invalid_password" },
          ipAddress: undefined,
          userAgent: undefined,
        },
      });
    });

    it("should not throw on error", async () => {
      vi.mocked(prisma.auditLog.create).mockRejectedValue(new Error("DB error"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      // Should not throw
      await expect(
        createAuditLog({
          action: "LOGIN_SUCCESS",
        })
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe("getClientInfo", () => {
    it("should extract client info from request", () => {
      const request = new Request("http://localhost", {
        headers: {
          "x-forwarded-for": "192.168.1.1",
          "user-agent": "Test Browser",
        },
      });

      const info = getClientInfo(request);
      expect(info.ipAddress).toBe("192.168.1.1");
      expect(info.userAgent).toBe("Test Browser");
    });

    it("should return unknown for missing headers", () => {
      const request = new Request("http://localhost");

      const info = getClientInfo(request);
      expect(info.ipAddress).toBe("unknown");
      expect(info.userAgent).toBe("unknown");
    });

    it("should use x-real-ip as fallback", () => {
      const request = new Request("http://localhost", {
        headers: {
          "x-real-ip": "10.0.0.1",
        },
      });

      const info = getClientInfo(request);
      expect(info.ipAddress).toBe("10.0.0.1");
    });
  });

  describe("getUserAuditLogs", () => {
    it("should return user audit logs", async () => {
      const mockLogs = [
        {
          action: "LOGIN_SUCCESS",
          details: null,
          ipAddress: "192.168.1.1",
          createdAt: new Date(),
        },
      ];
      vi.mocked(prisma.auditLog.findMany).mockResolvedValue(mockLogs as never);

      const logs = await getUserAuditLogs("user-123");

      expect(logs).toEqual(mockLogs);
      expect(prisma.auditLog.findMany).toHaveBeenCalledWith({
        where: { userId: "user-123" },
        select: {
          action: true,
          details: true,
          ipAddress: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    });

    it("should respect custom limit", async () => {
      vi.mocked(prisma.auditLog.findMany).mockResolvedValue([]);

      await getUserAuditLogs("user-123", 10);

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
        })
      );
    });
  });

  describe("getSecurityEvents", () => {
    it("should return security events from last 24 hours", async () => {
      const mockEvents = [
        {
          action: "LOGIN_FAILED",
          userId: "user-123",
          ipAddress: "192.168.1.1",
          createdAt: new Date(),
        },
      ];
      vi.mocked(prisma.auditLog.findMany).mockResolvedValue(mockEvents as never);

      const events = await getSecurityEvents();

      expect(events).toEqual(mockEvents);
      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            action: {
              in: [
                "LOGIN_FAILED",
                "ACCOUNT_LOCKED",
                "PASSWORD_RESET_REQUESTED",
                "PASSWORD_CHANGED",
              ],
            },
          }),
        })
      );
    });

    it("should respect custom hours parameter", async () => {
      vi.mocked(prisma.auditLog.findMany).mockResolvedValue([]);
      const beforeCall = Date.now();

      await getSecurityEvents(12);

      const call = vi.mocked(prisma.auditLog.findMany).mock.calls[0][0];
      const sinceDate = call?.where?.createdAt?.gte as Date;
      const timeDiff = beforeCall - sinceDate.getTime();

      // Should be approximately 12 hours (with some tolerance)
      expect(timeDiff).toBeGreaterThan(11 * 60 * 60 * 1000);
      expect(timeDiff).toBeLessThan(13 * 60 * 60 * 1000);
    });
  });
});
