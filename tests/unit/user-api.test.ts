/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

// Mock stripe
vi.mock("@/lib/stripe", () => ({
  stripe: {
    subscriptions: {
      cancel: vi.fn(),
    },
    customers: {
      del: vi.fn(),
    },
  },
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Import route handlers
import { GET as getProfile, PATCH as updateProfile } from "@/app/api/user/profile/route";
import { PATCH as updatePassword } from "@/app/api/user/password/route";
import { DELETE as deleteAccount } from "@/app/api/user/delete/route";

// Helper to create NextRequest
function createRequest(url: string, options?: RequestInit): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"), options);
}

describe("GET /api/user/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const response = await getProfile();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return user profile", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
    } as any);

    const response = await getProfile();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe("user-1");
    expect(data.name).toBe("Test User");
    expect(data.email).toBe("test@example.com");
  });

  it("should return 404 if user not found", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const response = await getProfile();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("User not found");
  });
});

describe("PATCH /api/user/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const request = createRequest("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Name" }),
    });
    const response = await updateProfile(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should update profile name", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    vi.mocked(prisma.user.update).mockResolvedValue({
      id: "user-1",
      name: "New Name",
      email: "test@example.com",
    } as any);

    const request = createRequest("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Name" }),
    });
    const response = await updateProfile(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe("New Name");
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { name: "New Name" },
      select: { id: true, name: true, email: true },
    });
  });

  it("should validate name length", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);

    const request = createRequest("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "A" }), // Too short
    });
    const response = await updateProfile(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });
});

describe("PATCH /api/user/password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const request = createRequest("/api/user/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: "oldpass",
        newPassword: "NewPass123",
      }),
    });
    const response = await updatePassword(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return error if current password is wrong", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      password: "hashed-password",
    } as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const request = createRequest("/api/user/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: "wrongpassword",
        newPassword: "NewPass123",
      }),
    });
    const response = await updatePassword(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.code).toBe("INVALID_PASSWORD");
  });

  it("should update password", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      password: "hashed-password",
    } as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(bcrypt.hash).mockResolvedValue("new-hashed-password" as never);
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);

    const request = createRequest("/api/user/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: "correctpassword",
        newPassword: "NewPass123",
      }),
    });
    const response = await updatePassword(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(bcrypt.hash).toHaveBeenCalledWith("NewPass123", 12);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: expect.objectContaining({
        password: "new-hashed-password",
      }),
    });
  });

  it("should validate password requirements", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);

    const request = createRequest("/api/user/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: "oldpass",
        newPassword: "weak", // Does not meet requirements
      }),
    });
    const response = await updatePassword(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });
});

describe("DELETE /api/user/delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const response = await deleteAccount();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should delete user account", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      stripeCustomerId: null,
      subscription: null,
    } as any);
    vi.mocked(prisma.user.delete).mockResolvedValue({} as any);

    const response = await deleteAccount();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: "user-1" },
    });
  });

  it("should return 404 if user not found", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const response = await deleteAccount();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("User not found");
  });
});
