import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    plan: {
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock stripe
vi.mock("@/lib/stripe", () => ({
  isStripeConfigured: vi.fn(),
  getStripe: vi.fn(),
}));

// Mock subscription service
vi.mock("@/lib/services/subscription", () => ({
  getUserSubscription: vi.fn(),
}));

// Mock usage service
vi.mock("@/lib/services/usage", () => ({
  getCurrentUsage: vi.fn(),
}));

describe("Subscription Management APIs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("GET /api/subscription", () => {
    it("should return 401 when not authenticated", async () => {
      const { auth } = await import("@/lib/auth");
      vi.mocked(auth).mockResolvedValue(null);

      const { GET } = await import("@/app/api/subscription/route");
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return subscription and usage data", async () => {
      const { auth } = await import("@/lib/auth");
      const { getUserSubscription } = await import(
        "@/lib/services/subscription"
      );
      const { getCurrentUsage } = await import("@/lib/services/usage");

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as never);

      const mockSubscription = {
        id: "sub-1",
        plan: {
          id: "plan-1",
          name: "Starter",
          slug: "starter",
          messagesPerMonth: 500,
          rulesLimit: 10,
          features: ["sheetsSync"],
        },
        status: "ACTIVE",
        billingInterval: "MONTHLY",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        canceledAt: null,
        stripeSubscriptionId: "sub_stripe_123",
      };

      vi.mocked(getUserSubscription).mockResolvedValue(
        mockSubscription as never
      );

      vi.mocked(getCurrentUsage).mockResolvedValue({
        messagesCount: 100,
        rulesCount: 5,
        periodStart: new Date(),
        periodEnd: new Date(),
      });

      const { GET } = await import("@/app/api/subscription/route");
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.subscription).toBeDefined();
      expect(data.subscription.plan.name).toBe("Starter");
      expect(data.usage.messagesCount).toBe(100);
      expect(data.usage.limits.messagesPerMonth).toBe(500);
    });

    it("should return null subscription when user has none", async () => {
      const { auth } = await import("@/lib/auth");
      const { getUserSubscription } = await import(
        "@/lib/services/subscription"
      );
      const { getCurrentUsage } = await import("@/lib/services/usage");

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as never);

      vi.mocked(getUserSubscription).mockResolvedValue(null);
      vi.mocked(getCurrentUsage).mockResolvedValue({
        messagesCount: 0,
        rulesCount: 0,
        periodStart: new Date(),
        periodEnd: new Date(),
      });

      const { GET } = await import("@/app/api/subscription/route");
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.subscription).toBeNull();
      expect(data.usage.limits.messagesPerMonth).toBe(50); // Default
    });
  });

  describe("POST /api/subscription/cancel", () => {
    it("should return 401 when not authenticated", async () => {
      const { auth } = await import("@/lib/auth");
      vi.mocked(auth).mockResolvedValue(null);

      const { POST } = await import("@/app/api/subscription/cancel/route");
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 400 when no subscription found", async () => {
      const { auth } = await import("@/lib/auth");
      const { prisma } = await import("@/lib/prisma");

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as never);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);

      const { POST } = await import("@/app/api/subscription/cancel/route");
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("No subscription found");
    });

    it("should return 400 when trying to cancel free plan", async () => {
      const { auth } = await import("@/lib/auth");
      const { prisma } = await import("@/lib/prisma");

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as never);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        plan: { slug: "free" },
        cancelAtPeriodEnd: false,
      } as never);

      const { POST } = await import("@/app/api/subscription/cancel/route");
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Free plan cannot be canceled");
    });

    it("should cancel subscription at period end", async () => {
      const { auth } = await import("@/lib/auth");
      const { prisma } = await import("@/lib/prisma");
      const { isStripeConfigured, getStripe } = await import("@/lib/stripe");

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as never);

      const periodEnd = new Date();
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        plan: { slug: "starter" },
        stripeSubscriptionId: "sub_stripe_123",
        cancelAtPeriodEnd: false,
        currentPeriodEnd: periodEnd,
      } as never);

      vi.mocked(isStripeConfigured).mockReturnValue(true);
      const mockStripe = {
        subscriptions: {
          update: vi.fn().mockResolvedValue({}),
        },
      };
      vi.mocked(getStripe).mockReturnValue(mockStripe as never);

      vi.mocked(prisma.subscription.update).mockResolvedValue({} as never);

      const { POST } = await import("@/app/api/subscription/cancel/route");
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith(
        "sub_stripe_123",
        { cancel_at_period_end: true }
      );
    });
  });

  describe("POST /api/subscription/resume", () => {
    it("should return 401 when not authenticated", async () => {
      const { auth } = await import("@/lib/auth");
      vi.mocked(auth).mockResolvedValue(null);

      const { POST } = await import("@/app/api/subscription/resume/route");
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 400 when subscription not scheduled for cancellation", async () => {
      const { auth } = await import("@/lib/auth");
      const { prisma } = await import("@/lib/prisma");

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as never);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        cancelAtPeriodEnd: false,
        status: "ACTIVE",
      } as never);

      const { POST } = await import("@/app/api/subscription/resume/route");
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Subscription is not scheduled for cancellation");
    });

    it("should resume subscription", async () => {
      const { auth } = await import("@/lib/auth");
      const { prisma } = await import("@/lib/prisma");
      const { isStripeConfigured, getStripe } = await import("@/lib/stripe");

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as never);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        stripeSubscriptionId: "sub_stripe_123",
        cancelAtPeriodEnd: true,
        status: "ACTIVE",
      } as never);

      vi.mocked(isStripeConfigured).mockReturnValue(true);
      const mockStripe = {
        subscriptions: {
          update: vi.fn().mockResolvedValue({}),
        },
      };
      vi.mocked(getStripe).mockReturnValue(mockStripe as never);

      vi.mocked(prisma.subscription.update).mockResolvedValue({} as never);

      const { POST } = await import("@/app/api/subscription/resume/route");
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith(
        "sub_stripe_123",
        { cancel_at_period_end: false }
      );
    });
  });

  describe("POST /api/subscription/portal", () => {
    it("should return 401 when not authenticated", async () => {
      const { auth } = await import("@/lib/auth");
      vi.mocked(auth).mockResolvedValue(null);

      const { POST } = await import("@/app/api/subscription/portal/route");
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 503 when Stripe not configured", async () => {
      const { auth } = await import("@/lib/auth");
      const { isStripeConfigured } = await import("@/lib/stripe");

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as never);

      vi.mocked(isStripeConfigured).mockReturnValue(false);

      const { POST } = await import("@/app/api/subscription/portal/route");
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe("Stripe is not configured");
    });

    it("should return 400 when no billing account", async () => {
      const { auth } = await import("@/lib/auth");
      const { prisma } = await import("@/lib/prisma");
      const { isStripeConfigured } = await import("@/lib/stripe");

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as never);

      vi.mocked(isStripeConfigured).mockReturnValue(true);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        stripeCustomerId: null,
      } as never);

      const { POST } = await import("@/app/api/subscription/portal/route");
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("No billing account found");
    });

    it("should return billing portal URL", async () => {
      const { auth } = await import("@/lib/auth");
      const { prisma } = await import("@/lib/prisma");
      const { isStripeConfigured, getStripe } = await import("@/lib/stripe");

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as never);

      vi.mocked(isStripeConfigured).mockReturnValue(true);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        stripeCustomerId: "cus_123",
      } as never);

      const mockStripe = {
        billingPortal: {
          sessions: {
            create: vi.fn().mockResolvedValue({
              url: "https://billing.stripe.com/session/123",
            }),
          },
        },
      };
      vi.mocked(getStripe).mockReturnValue(mockStripe as never);

      const { POST } = await import("@/app/api/subscription/portal/route");
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.url).toBe("https://billing.stripe.com/session/123");
    });
  });

  describe("POST /api/subscription/change-plan", () => {
    it("should return 401 when not authenticated", async () => {
      const { auth } = await import("@/lib/auth");
      vi.mocked(auth).mockResolvedValue(null);

      const { POST } = await import(
        "@/app/api/subscription/change-plan/route"
      );
      const request = new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ planSlug: "professional", billingInterval: "monthly" }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 503 when Stripe not configured", async () => {
      const { auth } = await import("@/lib/auth");
      const { isStripeConfigured } = await import("@/lib/stripe");

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as never);

      vi.mocked(isStripeConfigured).mockReturnValue(false);

      const { POST } = await import(
        "@/app/api/subscription/change-plan/route"
      );
      const request = new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ planSlug: "professional", billingInterval: "monthly" }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe("Stripe is not configured");
    });

    it("should return 400 when no active subscription", async () => {
      const { auth } = await import("@/lib/auth");
      const { prisma } = await import("@/lib/prisma");
      const { isStripeConfigured } = await import("@/lib/stripe");

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as never);

      vi.mocked(isStripeConfigured).mockReturnValue(true);
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);

      const { POST } = await import(
        "@/app/api/subscription/change-plan/route"
      );
      const request = new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ planSlug: "professional", billingInterval: "monthly" }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("No active subscription found");
    });

    it("should change plan successfully", async () => {
      const { auth } = await import("@/lib/auth");
      const { prisma } = await import("@/lib/prisma");
      const { isStripeConfigured, getStripe } = await import("@/lib/stripe");

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      } as never);

      vi.mocked(isStripeConfigured).mockReturnValue(true);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        stripeSubscriptionId: "sub_stripe_123",
        plan: { slug: "starter" },
      } as never);

      vi.mocked(prisma.plan.findUnique).mockResolvedValue({
        id: "plan-2",
        name: "Professional",
        slug: "professional",
        stripePriceIdMonthly: "price_pro_monthly",
        stripePriceIdYearly: "price_pro_yearly",
      } as never);

      const mockStripe = {
        subscriptions: {
          retrieve: vi.fn().mockResolvedValue({
            items: { data: [{ id: "si_123" }] },
          }),
          update: vi.fn().mockResolvedValue({}),
        },
      };
      vi.mocked(getStripe).mockReturnValue(mockStripe as never);

      vi.mocked(prisma.subscription.update).mockResolvedValue({} as never);

      const { POST } = await import(
        "@/app/api/subscription/change-plan/route"
      );
      const request = new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ planSlug: "professional", billingInterval: "monthly" }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Subscription changed to Professional");
    });
  });
});
