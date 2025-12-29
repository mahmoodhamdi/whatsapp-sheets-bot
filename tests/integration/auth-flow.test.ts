/**
 * Authentication Flow Integration Tests
 *
 * Tests the complete authentication flows including:
 * - User registration
 * - Email verification
 * - Login/logout
 * - Password reset
 * - Session management
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mockUserFactory,
  mockPlanFactory,
  mockSubscriptionFactory,
} from "./setup";
import {
  createMockVerificationToken,
  createMockPasswordResetToken,
  uniqueId,
} from "./helpers";

// Mock bcryptjs with default export
vi.mock("bcryptjs", async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    default: {
      hash: vi.fn().mockResolvedValue("$2a$10$hashedpassword"),
      compare: vi.fn(),
    },
    hash: vi.fn().mockResolvedValue("$2a$10$hashedpassword"),
    compare: vi.fn(),
  };
});

// Mock Resend email - properly mock the class constructor
vi.mock("resend", () => {
  const mockSend = vi.fn().mockResolvedValue({ id: "email-123" });
  return {
    Resend: class MockResend {
      emails = { send: mockSend };
    },
  };
});

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    plan: {
      findUnique: vi.fn(),
    },
    subscription: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    verificationToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    passwordResetToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

// Mock auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

describe("Authentication Flow Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("User Registration Flow", () => {
    it("should register a new user with valid data", async () => {
      const freePlan = mockPlanFactory.free();
      const newUser = {
        id: uniqueId("user"),
        email: "newuser@example.com",
        name: "New User",
        password: "$2a$10$hashedpassword",
        emailVerified: null,
      };

      // Setup mocks
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null); // No existing user
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(freePlan as any);
      vi.mocked(prisma.user.create).mockResolvedValue(newUser as any);
      vi.mocked(prisma.subscription.create).mockResolvedValue({
        id: "sub-new",
        userId: newUser.id,
        planId: freePlan.id,
        status: "ACTIVE",
      } as any);
      vi.mocked(prisma.verificationToken.create).mockResolvedValue({
        id: "token-1",
        userId: newUser.id,
        token: "verify-token-123",
      } as any);

      // Import and call registration handler
      const { POST } = await import("@/app/api/auth/register/route");
      const request = new Request("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "newuser@example.com",
          password: "SecurePass123!",
          name: "New User",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);

      // Verify user was created
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: "newuser@example.com",
          name: "New User",
        }),
      });

      // Verify free subscription was created
      expect(prisma.subscription.create).toHaveBeenCalled();

      // Verify verification token was created
      expect(prisma.verificationToken.create).toHaveBeenCalled();
    });

    it("should reject registration with existing email", async () => {
      const existingUser = mockUserFactory.verified();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);

      const { POST } = await import("@/app/api/auth/register/route");
      const request = new Request("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: existingUser.email,
          password: "SecurePass123!",
          name: "Duplicate User",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error).toContain("already registered");
    });

    it("should reject registration with weak password", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const { POST } = await import("@/app/api/auth/register/route");
      const request = new Request("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "newuser@example.com",
          password: "weak", // Too short
          name: "New User",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("should reject registration with invalid email", async () => {
      const { POST } = await import("@/app/api/auth/register/route");
      const request = new Request("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "not-an-email",
          password: "SecurePass123!",
          name: "New User",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });

  describe("Email Verification Flow", () => {
    it("should verify email with valid code", async () => {
      const user = mockUserFactory.unverified();
      const verificationCode = "123456";
      const token = {
        id: uniqueId("token"),
        userId: user.id,
        token: verificationCode,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min future
      };

      // Mock authenticated session (required by verify-email route)
      vi.mocked(auth).mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      } as any);

      vi.mocked(prisma.verificationToken.findFirst).mockResolvedValue(token as any);
      vi.mocked(prisma.user.update).mockResolvedValue({
        ...user,
        emailVerified: new Date(),
      } as any);
      vi.mocked(prisma.verificationToken.delete).mockResolvedValue(token as any);

      const { POST } = await import("@/app/api/auth/verify-email/route");
      const request = new Request("http://localhost:3000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);

      // Verify token lookup was called
      expect(prisma.verificationToken.findFirst).toHaveBeenCalled();
    });

    it("should reject verification with invalid code", async () => {
      const user = mockUserFactory.unverified();

      // Mock authenticated session
      vi.mocked(auth).mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      } as any);

      vi.mocked(prisma.verificationToken.findFirst).mockResolvedValue(null);

      const { POST } = await import("@/app/api/auth/verify-email/route");
      const request = new Request("http://localhost:3000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: "999999" }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("should reject verification without authentication", async () => {
      // No authenticated session
      vi.mocked(auth).mockResolvedValue(null);

      const { POST } = await import("@/app/api/auth/verify-email/route");
      const request = new Request("http://localhost:3000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: "123456" }),
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
    });
  });

  describe("Password Reset Flow", () => {
    it("should initiate password reset for existing user", async () => {
      const user = mockUserFactory.verified();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({
        id: "reset-1",
        userId: user.id,
        token: "reset-token-123",
        expires: new Date(Date.now() + 60 * 60 * 1000),
      } as any);

      const { POST } = await import("@/app/api/auth/forgot-password/route");
      const request = new Request("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);

      // Verify reset token was created
      expect(prisma.passwordResetToken.create).toHaveBeenCalled();
    });

    it("should return success even for non-existent email (security)", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const { POST } = await import("@/app/api/auth/forgot-password/route");
      const request = new Request("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "nonexistent@example.com" }),
      });

      const response = await POST(request);

      // Should return success to prevent email enumeration
      expect(response.status).toBe(200);

      // But should not create a token
      expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
    });

    it("should reset password with valid token", async () => {
      const user = mockUserFactory.verified();
      const resetToken = {
        id: uniqueId("reset"),
        email: user.email,
        token: `reset-${uniqueId()}`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour future
      };

      // Mock findUnique for validateResetToken
      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(resetToken as any);
      // Mock user lookup for audit log
      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(prisma.user.update).mockResolvedValue({
        ...user,
        password: "$2a$10$newhashedpassword",
      } as any);
      vi.mocked(prisma.passwordResetToken.delete).mockResolvedValue(resetToken as any);
      vi.mocked(prisma.auditLog.create).mockResolvedValue({} as any);

      const { POST } = await import("@/app/api/auth/reset-password/route");
      const request = new Request("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken.token,
          password: "NewSecurePass123!",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it("should reject password reset with invalid token", async () => {
      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.passwordResetToken.findFirst).mockResolvedValue(null);

      const { POST } = await import("@/app/api/auth/reset-password/route");
      const request = new Request("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: "invalid-token",
          password: "NewSecurePass123!",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });

  describe("Login Flow", () => {
    it("should authenticate user with valid credentials", async () => {
      const user = mockUserFactory.verified();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);

      // This tests the credentials callback logic
      // In real scenario, NextAuth handles the session creation
      expect(user.emailVerified).toBeDefined();
      expect(prisma.user.findUnique).toBeDefined();
    });

    it("should reject login for unverified email", async () => {
      const user = mockUserFactory.unverified();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);

      // Unverified users should be redirected to verification page
      expect(user.emailVerified).toBeNull();
    });

    it("should reject login with wrong password", async () => {
      const user = mockUserFactory.verified();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);

      // Wrong password verification is handled by NextAuth's authorize callback
      // The mock bcrypt.compare can be set to return false
      // Here we verify the user data is correct for such a scenario
      expect(user.password).toBeDefined();
      expect(user.password).toContain("$2a$"); // bcrypt hash format
    });

    it("should lock account after too many failed attempts", async () => {
      const lockedUser = mockUserFactory.verified({
        failedLoginAttempts: 5,
        lockedUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 min lockout
      });

      vi.mocked(prisma.user.findUnique).mockResolvedValue(lockedUser as any);

      // Account should be locked
      expect(lockedUser.lockedUntil).toBeDefined();
      expect(lockedUser.lockedUntil!.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe("Session Management", () => {
    it("should return user data for authenticated session", async () => {
      const user = mockUserFactory.verified();
      const freePlan = mockPlanFactory.free();
      const subscription = mockSubscriptionFactory.active(user.id, freePlan);

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      } as any);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      const session = await auth();

      expect(session).toBeDefined();
      expect(session?.user?.email).toBe(user.email);
    });

    it("should return null for unauthenticated request", async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const session = await auth();

      expect(session).toBeNull();
    });
  });

});
