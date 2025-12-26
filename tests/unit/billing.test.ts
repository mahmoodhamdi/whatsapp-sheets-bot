import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock NextAuth
vi.mock("next-auth", () => ({
  default: vi.fn(),
}));

// Mock auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    subscription: {
      findUnique: vi.fn(),
    },
    message: {
      count: vi.fn(),
    },
    autoReplyRule: {
      count: vi.fn(),
    },
  },
}));

// Mock Stripe
vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(() => ({
    billingPortal: {
      sessions: {
        create: vi.fn(),
      },
    },
  })),
  isStripeConfigured: vi.fn(() => true),
}));

import { POST as PortalPOST } from "@/app/api/stripe/portal/route";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

describe("Stripe Portal API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXTAUTH_URL = "http://localhost:3000";
    vi.mocked(isStripeConfigured).mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("POST /api/stripe/portal", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(auth).mockResolvedValueOnce(null);

      const response = await PortalPOST();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 503 when Stripe is not configured", async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { id: "user-1", email: "test@example.com" },
        expires: new Date(Date.now() + 86400000).toISOString(),
      });

      vi.mocked(isStripeConfigured).mockReturnValueOnce(false);

      const response = await PortalPOST();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe("Stripe is not configured");
    });

    it("should return 400 when user not found", async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { id: "user-1", email: "test@example.com" },
        expires: new Date(Date.now() + 86400000).toISOString(),
      });

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

      const response = await PortalPOST();
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("No billing account found. Please subscribe to a plan first.");
    });

    it("should return 400 when user has no Stripe customer", async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { id: "user-1", email: "test@example.com" },
        expires: new Date(Date.now() + 86400000).toISOString(),
      });

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "user-1",
        stripeCustomerId: null,
      } as never);

      const response = await PortalPOST();
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("No billing account found. Please subscribe to a plan first.");
    });

    it("should create portal session and return URL", async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { id: "user-1", email: "test@example.com" },
        expires: new Date(Date.now() + 86400000).toISOString(),
      });

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "user-1",
        stripeCustomerId: "cus_123",
      } as never);

      const mockPortalCreate = vi.fn().mockResolvedValueOnce({
        url: "https://billing.stripe.com/session/abc123",
      });

      vi.mocked(getStripe).mockReturnValueOnce({
        billingPortal: {
          sessions: {
            create: mockPortalCreate,
          },
        },
      } as never);

      const response = await PortalPOST();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.url).toBe("https://billing.stripe.com/session/abc123");
      expect(mockPortalCreate).toHaveBeenCalledWith({
        customer: "cus_123",
        return_url: "http://localhost:3000/dashboard/settings/billing",
      });
    });

    it("should handle Stripe errors gracefully", async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { id: "user-1", email: "test@example.com" },
        expires: new Date(Date.now() + 86400000).toISOString(),
      });

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "user-1",
        stripeCustomerId: "cus_123",
      } as never);

      const mockPortalCreate = vi.fn().mockRejectedValueOnce(new Error("Stripe API error"));

      vi.mocked(getStripe).mockReturnValueOnce({
        billingPortal: {
          sessions: {
            create: mockPortalCreate,
          },
        },
      } as never);

      const response = await PortalPOST();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to create billing portal session");
    });
  });
});

describe("Billing Settings Data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should calculate messages percentage correctly", () => {
    const messagesUsed = 80;
    const messagesLimit = 100;
    const isUnlimited = false;

    const percent = isUnlimited
      ? 0
      : Math.min((messagesUsed / messagesLimit) * 100, 100);

    expect(percent).toBe(80);
  });

  it("should return 0 for unlimited messages", () => {
    const messagesUsed = 1000;
    const messagesLimit = 100;
    const isUnlimited = true;

    const percent = isUnlimited
      ? 0
      : Math.min((messagesUsed / messagesLimit) * 100, 100);

    expect(percent).toBe(0);
  });

  it("should cap percentage at 100", () => {
    const messagesUsed = 150;
    const messagesLimit = 100;
    const isUnlimited = false;

    const percent = isUnlimited
      ? 0
      : Math.min((messagesUsed / messagesLimit) * 100, 100);

    expect(percent).toBe(100);
  });

  it("should detect near limit correctly", () => {
    const isNearLimit = (percent: number) => percent >= 80;

    expect(isNearLimit(79)).toBe(false);
    expect(isNearLimit(80)).toBe(true);
    expect(isNearLimit(90)).toBe(true);
    expect(isNearLimit(100)).toBe(true);
  });

  it("should format subscription status correctly", () => {
    const getStatusInfo = (status: string, cancelAtPeriodEnd: boolean) => {
      if (cancelAtPeriodEnd) return "canceling";
      if (status === "PAST_DUE") return "pastDue";
      if (status === "ACTIVE" || status === "TRIALING") return "active";
      return status.toLowerCase();
    };

    expect(getStatusInfo("ACTIVE", false)).toBe("active");
    expect(getStatusInfo("TRIALING", false)).toBe("active");
    expect(getStatusInfo("PAST_DUE", false)).toBe("pastDue");
    expect(getStatusInfo("ACTIVE", true)).toBe("canceling");
    expect(getStatusInfo("CANCELED", false)).toBe("canceled");
  });

  it("should determine if plan is paid correctly", () => {
    const hasPaidPlan = (
      slug: string | undefined,
      stripeSubscriptionId: string | null | undefined
    ) => slug !== "free" && !!stripeSubscriptionId;

    expect(hasPaidPlan("free", null)).toBe(false);
    expect(hasPaidPlan("free", "sub_123")).toBe(false);
    expect(hasPaidPlan("starter", null)).toBe(false);
    expect(hasPaidPlan("starter", "sub_123")).toBe(true);
    expect(hasPaidPlan("professional", "sub_456")).toBe(true);
  });
});
