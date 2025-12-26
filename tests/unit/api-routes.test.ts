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
    contact: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      delete: vi.fn(),
    },
    autoReplyRule: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock usage service
vi.mock("@/lib/services/usage", () => ({
  canCreateRule: vi.fn().mockResolvedValue(true),
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Import route handlers
import { GET as getContacts } from "@/app/api/contacts/route";
import {
  GET as getContact,
  DELETE as deleteContact,
} from "@/app/api/contacts/[id]/route";
import { GET as getRules, POST as createRule } from "@/app/api/rules/route";
import { PATCH as toggleRule } from "@/app/api/rules/[id]/toggle/route";

// Helper to create NextRequest
function createRequest(url: string, options?: RequestInit): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"), options);
}

describe("GET /api/contacts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const request = createRequest("/api/contacts");
    const response = await getContacts(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return paginated contacts", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.contact.findMany).mockResolvedValue([
      {
        id: "1",
        phone: "+1234567890",
        name: "Test",
        firstContact: new Date(),
        lastContact: new Date(),
        messageCount: 5,
      },
    ] as any);
    vi.mocked(prisma.contact.count).mockResolvedValue(1);

    const request = createRequest("/api/contacts?page=1&limit=10");
    const response = await getContacts(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.contacts).toHaveLength(1);
    expect(data.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
  });

  it("should filter by search query", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.contact.findMany).mockResolvedValue([]);
    vi.mocked(prisma.contact.count).mockResolvedValue(0);

    const request = createRequest("/api/contacts?search=john");
    await getContacts(request);

    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { phone: { contains: "john" } },
            { name: { contains: "john" } },
          ],
        },
      })
    );
  });
});

describe("GET /api/contacts/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const request = createRequest("/api/contacts/123");
    const response = await getContact(request, {
      params: Promise.resolve({ id: "123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 if contact not found", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.contact.findUnique).mockResolvedValue(null);

    const request = createRequest("/api/contacts/123");
    const response = await getContact(request, {
      params: Promise.resolve({ id: "123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Contact not found");
  });

  it("should return contact with messages", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.contact.findUnique).mockResolvedValue({
      id: "123",
      phone: "+1234567890",
      name: "Test",
      messages: [{ id: "msg-1", content: "Hello" }],
    } as any);

    const request = createRequest("/api/contacts/123");
    const response = await getContact(request, {
      params: Promise.resolve({ id: "123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe("123");
    expect(data.messages).toHaveLength(1);
  });
});

describe("DELETE /api/contacts/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const request = createRequest("/api/contacts/123", { method: "DELETE" });
    const response = await deleteContact(request, {
      params: Promise.resolve({ id: "123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 if contact not found", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.contact.delete).mockRejectedValue(new Error("Not found"));

    const request = createRequest("/api/contacts/123", { method: "DELETE" });
    const response = await deleteContact(request, {
      params: Promise.resolve({ id: "123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Contact not found");
  });

  it("should delete contact", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.contact.delete).mockResolvedValue({} as any);

    const request = createRequest("/api/contacts/123", { method: "DELETE" });
    const response = await deleteContact(request, {
      params: Promise.resolve({ id: "123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.contact.delete).toHaveBeenCalledWith({
      where: { id: "123" },
    });
  });
});

describe("GET /api/rules", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const request = createRequest("/api/rules");
    const response = await getRules(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return all rules", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.autoReplyRule.findMany).mockResolvedValue([
      { id: "1", name: "Rule 1", isActive: true, priority: 10 },
      { id: "2", name: "Rule 2", isActive: false, priority: 5 },
    ] as any);

    const request = createRequest("/api/rules");
    const response = await getRules(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
  });

  it("should filter by activeOnly", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.autoReplyRule.findMany).mockResolvedValue([]);

    const request = createRequest("/api/rules?activeOnly=true");
    await getRules(request);

    expect(prisma.autoReplyRule.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isActive: true },
      })
    );
  });

  it("should order by priority desc", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.autoReplyRule.findMany).mockResolvedValue([]);

    const request = createRequest("/api/rules");
    await getRules(request);

    expect(prisma.autoReplyRule.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      })
    );
  });
});

describe("POST /api/rules", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const request = createRequest("/api/rules", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const response = await createRule(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should validate required fields", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);

    const request = createRequest("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "" }), // Missing required fields
    });
    const response = await createRule(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request");
  });

  it("should validate regex pattern", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);

    const request = createRequest("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Rule",
        trigger: "[invalid regex",
        triggerType: "REGEX",
        response: "Hello",
      }),
    });
    const response = await createRule(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid regex pattern");
  });

  it("should create rule", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.autoReplyRule.create).mockResolvedValue({
      id: "new-rule",
      name: "Test Rule",
      trigger: "hello",
      triggerType: "EXACT",
      response: "Hi there!",
      priority: 10,
      isActive: true,
    } as any);

    const request = createRequest("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Rule",
        trigger: "hello",
        triggerType: "EXACT",
        response: "Hi there!",
        priority: 10,
      }),
    });
    const response = await createRule(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe("Test Rule");
    expect(prisma.autoReplyRule.create).toHaveBeenCalled();
  });
});

describe("PATCH /api/rules/[id]/toggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const request = createRequest("/api/rules/123/toggle", { method: "PATCH" });
    const response = await toggleRule(request, {
      params: Promise.resolve({ id: "123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 if rule not found", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.autoReplyRule.findUnique).mockResolvedValue(null);

    const request = createRequest("/api/rules/123/toggle", { method: "PATCH" });
    const response = await toggleRule(request, {
      params: Promise.resolve({ id: "123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Rule not found");
  });

  it("should toggle isActive from true to false", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.autoReplyRule.findUnique).mockResolvedValue({
      id: "123",
      isActive: true,
    } as any);
    vi.mocked(prisma.autoReplyRule.update).mockResolvedValue({
      id: "123",
      isActive: false,
    } as any);

    const request = createRequest("/api/rules/123/toggle", { method: "PATCH" });
    const response = await toggleRule(request, {
      params: Promise.resolve({ id: "123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isActive).toBe(false);
    expect(prisma.autoReplyRule.update).toHaveBeenCalledWith({
      where: { id: "123" },
      data: { isActive: false },
    });
  });

  it("should toggle isActive from false to true", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.autoReplyRule.findUnique).mockResolvedValue({
      id: "123",
      isActive: false,
    } as any);
    vi.mocked(prisma.autoReplyRule.update).mockResolvedValue({
      id: "123",
      isActive: true,
    } as any);

    const request = createRequest("/api/rules/123/toggle", { method: "PATCH" });
    const response = await toggleRule(request, {
      params: Promise.resolve({ id: "123" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isActive).toBe(true);
  });
});
