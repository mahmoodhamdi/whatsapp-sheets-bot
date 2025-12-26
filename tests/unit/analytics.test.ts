/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock modules
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    message: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    contact: {
      count: vi.fn(),
    },
    autoReplyRule: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

// Mock features service
vi.mock("@/lib/features", () => ({
  hasFeature: vi.fn().mockResolvedValue(true),
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

describe("Analytics Overview API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const { GET } = await import("@/app/api/analytics/overview/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return overview stats", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);

    // Mock all the counts
    vi.mocked(prisma.message.count)
      .mockResolvedValueOnce(100) // totalMessages
      .mockResolvedValueOnce(10) // todayMessages
      .mockResolvedValueOnce(50) // weekMessages
      .mockResolvedValueOnce(80) // monthMessages
      .mockResolvedValueOnce(60) // incomingCount
      .mockResolvedValueOnce(40) // outgoingCount
      .mockResolvedValueOnce(35) // autoRepliedCount
      .mockResolvedValueOnce(90); // syncedToSheetsCount

    vi.mocked(prisma.contact.count).mockResolvedValue(25);
    vi.mocked(prisma.autoReplyRule.count)
      .mockResolvedValueOnce(10) // totalRules
      .mockResolvedValueOnce(8); // activeRules

    const { GET } = await import("@/app/api/analytics/overview/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.totalMessages).toBe(100);
    expect(data.totalContacts).toBe(25);
    expect(data.totalRules).toBe(10);
    expect(data.activeRules).toBe(8);
    expect(data.incomingCount).toBe(60);
    expect(data.outgoingCount).toBe(40);
    expect(data.responseRate).toBe(67); // 40/60 * 100 rounded
  });
});

describe("Analytics Messages API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const { GET } = await import("@/app/api/analytics/messages/route");
    const request = {
      nextUrl: { searchParams: new URLSearchParams() },
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return message analytics with summary", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    vi.mocked(prisma.message.findMany).mockResolvedValue([
      { direction: "INCOMING", createdAt: today },
      { direction: "INCOMING", createdAt: today },
      { direction: "OUTGOING", createdAt: today },
      { direction: "INCOMING", createdAt: yesterday },
      { direction: "OUTGOING", createdAt: yesterday },
    ] as any);

    const { GET } = await import("@/app/api/analytics/messages/route");
    const request = {
      nextUrl: { searchParams: new URLSearchParams({ period: "week" }) },
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toBeDefined();
    expect(data.summary).toBeDefined();
    expect(data.summary.totalIncoming).toBe(3);
    expect(data.summary.totalOutgoing).toBe(2);
  });

  it("should handle empty data", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
    vi.mocked(prisma.message.findMany).mockResolvedValue([]);

    const { GET } = await import("@/app/api/analytics/messages/route");
    const request = {
      nextUrl: { searchParams: new URLSearchParams({ period: "day" }) },
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.summary.totalIncoming).toBe(0);
    expect(data.summary.totalOutgoing).toBe(0);
    expect(data.summary.avgPerDay).toBe(0);
  });
});

describe("Analytics Rules API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const { GET } = await import("@/app/api/analytics/rules/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return rules analytics with stats", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);

    const now = new Date();
    vi.mocked(prisma.autoReplyRule.findMany).mockResolvedValue([
      {
        id: "rule-1",
        name: "Price Rule",
        triggerType: "CONTAINS",
        isActive: true,
        priority: 10,
        createdAt: now,
        messages: [
          { id: "m1", status: "SENT", createdAt: now },
          { id: "m2", status: "SENT", createdAt: now },
          { id: "m3", status: "FAILED", createdAt: now },
        ],
      },
      {
        id: "rule-2",
        name: "Greeting Rule",
        triggerType: "EXACT",
        isActive: true,
        priority: 5,
        createdAt: now,
        messages: [],
      },
    ] as any);

    const { GET } = await import("@/app/api/analytics/rules/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.rules).toHaveLength(2);

    // Check first rule stats
    const priceRule = data.rules.find((r: any) => r.id === "rule-1");
    expect(priceRule.totalMatches).toBe(3);
    expect(priceRule.successRate).toBe(67); // 2/3 * 100 rounded

    // Check top rules
    expect(data.topRules).toHaveLength(1);
    expect(data.topRules[0].name).toBe("Price Rule");

    // Check unused rules
    expect(data.unusedRules).toHaveLength(1);
    expect(data.unusedRules[0].name).toBe("Greeting Rule");
  });

  it("should handle rules with no messages", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);

    vi.mocked(prisma.autoReplyRule.findMany).mockResolvedValue([
      {
        id: "rule-1",
        name: "Unused Rule",
        triggerType: "CONTAINS",
        isActive: true,
        priority: 10,
        createdAt: new Date(),
        messages: [],
      },
    ] as any);

    const { GET } = await import("@/app/api/analytics/rules/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.rules[0].totalMatches).toBe(0);
    expect(data.rules[0].successRate).toBe(100); // Default 100% if no failures
    expect(data.rules[0].lastUsed).toBeNull();
    expect(data.topRules).toHaveLength(0);
    expect(data.unusedRules).toHaveLength(1);
  });
});
