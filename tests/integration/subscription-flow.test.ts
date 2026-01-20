/**
 * Subscription Flow Integration Tests
 *
 * Tests the complete subscription flows including:
 * - Free plan limitations
 * - Feature gating
 * - Usage tracking
 * - Upgrade/downgrade
 * - Limit enforcement
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mockPlanFactory,
  mockUserFactory,
  mockSubscriptionFactory,
  mockUsageFactory,
} from "./setup";
import { createTestScenario } from "./helpers";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    plan: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    subscription: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
    usageRecord: {
      findUnique: vi.fn(),
      create: vi.fn(),
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    autoReplyRule: {
      count: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

// Mock Stripe
vi.mock("@/lib/stripe/index", () => ({
  isStripeConfigured: vi.fn().mockReturnValue(false),
  getStripe: vi.fn(),
  formatAmount: vi.fn((amount) => `$${(amount / 100).toFixed(2)}`),
}));

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

describe("Subscription Flow Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Free Plan Limitations", () => {
    it("should allow creating rules up to the limit", async () => {
      const scenario = createTestScenario("free", "empty");
      const { user, subscription, plan } = scenario;

      vi.mocked(auth).mockResolvedValue({
        user: { id: user.id, email: user.email, emailVerified: user.emailVerified },
      } as any);
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(plan as any);
      vi.mocked(prisma.autoReplyRule.count).mockResolvedValue(0); // No rules yet

      // Import canCreateRule
      const { canCreateRule } = await import("@/lib/services/usage");

      const canCreate = await canCreateRule(user.id);

      expect(canCreate).toBe(true);
    });

    it("should block creating rules when at limit", async () => {
      const scenario = createTestScenario("free", "empty");
      const { user, subscription, plan } = scenario;

      vi.mocked(auth).mockResolvedValue({
        user: { id: user.id, email: user.email },
      } as any);
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(plan as any);
      vi.mocked(prisma.autoReplyRule.count).mockResolvedValue(1); // At limit (free = 1 rule)

      const { canCreateRule } = await import("@/lib/services/usage");

      const canCreate = await canCreateRule(user.id);

      expect(canCreate).toBe(false);
    });

    it("should allow sending messages under limit", async () => {
      const scenario = createTestScenario("free", "empty");
      const { user, subscription, plan, usage } = scenario;

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(plan as any);
      vi.mocked(prisma.usageRecord.findUnique).mockResolvedValue(usage as any);

      const { canSendMessage } = await import("@/lib/services/usage");

      const canSend = await canSendMessage(user.id);

      expect(canSend).toBe(true);
    });

    it("should block sending messages when at limit", async () => {
      const scenario = createTestScenario("free", "atLimit");
      const { user, subscription, plan, usage } = scenario;

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(plan as any);
      vi.mocked(prisma.usageRecord.findUnique).mockResolvedValue(usage as any);

      const { canSendMessage } = await import("@/lib/services/usage");

      const canSend = await canSendMessage(user.id);

      expect(canSend).toBe(false);
    });

    it("should show near-limit warning when approaching limit", async () => {
      const scenario = createTestScenario("free", "nearLimit");
      const { user, subscription, plan, usage } = scenario;

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(plan as any);
      vi.mocked(prisma.usageRecord.findUnique).mockResolvedValue(usage as any);

      const { getMessageUsagePercentage } = await import("@/lib/services/usage");

      const percentage = await getMessageUsagePercentage(user.id);

      expect(percentage).toBeGreaterThanOrEqual(80);
      expect(percentage).toBeLessThanOrEqual(100);
    });
  });

  describe("Feature Gating", () => {
    it("should deny analytics access for free users", async () => {
      const freePlan = mockPlanFactory.free();
      const user = mockUserFactory.withSubscription("free");
      const subscription = mockSubscriptionFactory.active(user.id, freePlan);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      const { userHasFeature } = await import("@/lib/services/subscription");

      const hasAnalytics = await userHasFeature(user.id, "analytics");

      expect(hasAnalytics).toBe(false);
    });

    it("should allow analytics access for professional users", async () => {
      const proPlan = mockPlanFactory.professional();
      const user = mockUserFactory.withSubscription("professional");
      const subscription = mockSubscriptionFactory.active(user.id, proPlan);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      const { userHasFeature } = await import("@/lib/services/subscription");

      const hasAnalytics = await userHasFeature(user.id, "analytics");

      expect(hasAnalytics).toBe(true);
    });

    it("should deny sheets_sync for free users", async () => {
      const freePlan = mockPlanFactory.free();
      const user = mockUserFactory.withSubscription("free");
      const subscription = mockSubscriptionFactory.active(user.id, freePlan);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      const { userHasFeature } = await import("@/lib/services/subscription");

      const hasSheets = await userHasFeature(user.id, "sheets_sync");

      expect(hasSheets).toBe(false);
    });

    it("should allow sheets_sync for starter users", async () => {
      const starterPlan = mockPlanFactory.starter();
      const user = mockUserFactory.withSubscription("starter");
      const subscription = mockSubscriptionFactory.active(user.id, starterPlan);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      const { userHasFeature } = await import("@/lib/services/subscription");

      const hasSheets = await userHasFeature(user.id, "sheets_sync");

      expect(hasSheets).toBe(true);
    });

    it("should deny api_access for starter users", async () => {
      const starterPlan = mockPlanFactory.starter();
      const user = mockUserFactory.withSubscription("starter");
      const subscription = mockSubscriptionFactory.active(user.id, starterPlan);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      const { userHasFeature } = await import("@/lib/services/subscription");

      const hasApiAccess = await userHasFeature(user.id, "api_access");

      expect(hasApiAccess).toBe(false);
    });

    it("should allow api_access for professional users", async () => {
      const proPlan = mockPlanFactory.professional();
      const user = mockUserFactory.withSubscription("professional");
      const subscription = mockSubscriptionFactory.active(user.id, proPlan);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      const { userHasFeature } = await import("@/lib/services/subscription");

      const hasApiAccess = await userHasFeature(user.id, "api_access");

      expect(hasApiAccess).toBe(true);
    });
  });

  describe("Professional Plan Unlimited Features", () => {
    it("should allow unlimited rules for professional users", async () => {
      const proPlan = mockPlanFactory.professional();
      const user = mockUserFactory.withSubscription("professional");
      const subscription = mockSubscriptionFactory.active(user.id, proPlan);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);
      vi.mocked(prisma.autoReplyRule.count).mockResolvedValue(100); // Many rules

      const { canCreateRule } = await import("@/lib/services/usage");

      const canCreate = await canCreateRule(user.id);

      // Professional has rulesLimit = -1 (unlimited)
      expect(canCreate).toBe(true);
    });

    it("should return -1 for remaining messages with unlimited plan", async () => {
      const proPlan = { ...mockPlanFactory.professional(), messagesPerMonth: -1 };
      const user = mockUserFactory.withSubscription("professional");
      const subscription = mockSubscriptionFactory.active(user.id, proPlan as any);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      const { getRemainingMessages } = await import("@/lib/services/usage");

      const remaining = await getRemainingMessages(user.id);

      expect(remaining).toBe(-1); // Unlimited
    });
  });

  describe("Usage Tracking", () => {
    it("should track message count correctly", async () => {
      const scenario = createTestScenario("free", "empty");
      const { user, subscription, usage } = scenario;

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);
      vi.mocked(prisma.usageRecord.upsert).mockResolvedValue({
        ...usage,
        messagesCount: 1,
      } as any);

      const { incrementMessageCount } = await import("@/lib/services/usage");

      await incrementMessageCount(user.id);

      expect(prisma.usageRecord.upsert).toHaveBeenCalled();
    });

    it("should return correct usage percentage", async () => {
      const scenario = createTestScenario("free", "empty");
      const { user, subscription, plan } = scenario;

      // 25 messages out of 50
      const usage = {
        ...mockUsageFactory.empty(subscription.id),
        messagesCount: 25,
      };

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(plan as any);
      vi.mocked(prisma.usageRecord.findUnique).mockResolvedValue(usage as any);

      const { getMessageUsagePercentage } = await import("@/lib/services/usage");

      const percentage = await getMessageUsagePercentage(user.id);

      expect(percentage).toBe(50); // 25/50 = 50%
    });

    it("should return zero percentage for no usage", async () => {
      const scenario = createTestScenario("free", "empty");
      const { user, subscription, plan, usage } = scenario;

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(plan as any);
      vi.mocked(prisma.usageRecord.findUnique).mockResolvedValue(usage as any);

      const { getMessageUsagePercentage } = await import("@/lib/services/usage");

      const percentage = await getMessageUsagePercentage(user.id);

      expect(percentage).toBe(0);
    });
  });

  describe("Subscription Status", () => {
    it("should recognize active subscription", async () => {
      const proPlan = mockPlanFactory.professional();
      const user = mockUserFactory.withSubscription("professional");
      const subscription = mockSubscriptionFactory.active(user.id, proPlan);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      const { isSubscriptionActive } = await import("@/lib/services/subscription");

      const isActive = await isSubscriptionActive(user.id);

      expect(isActive).toBe(true);
    });

    it("should recognize trialing subscription as active", async () => {
      const proPlan = mockPlanFactory.professional();
      const user = mockUserFactory.withSubscription("professional");
      const subscription = {
        ...mockSubscriptionFactory.active(user.id, proPlan),
        status: "TRIALING" as const,
      };

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      const { isSubscriptionActive } = await import("@/lib/services/subscription");

      const isActive = await isSubscriptionActive(user.id);

      expect(isActive).toBe(true);
    });

    it("should recognize canceled subscription as inactive", async () => {
      const proPlan = mockPlanFactory.professional();
      const user = mockUserFactory.withSubscription("professional");
      const subscription = {
        ...mockSubscriptionFactory.active(user.id, proPlan),
        status: "CANCELED" as const,
      };

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      const { isSubscriptionActive } = await import("@/lib/services/subscription");

      const isActive = await isSubscriptionActive(user.id);

      expect(isActive).toBe(false);
    });

    it("should handle subscription cancellation at period end", async () => {
      const proPlan = mockPlanFactory.professional();
      const user = mockUserFactory.withSubscription("professional");
      const subscription = mockSubscriptionFactory.canceled(user.id, proPlan);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      // Still active until period end
      const { isSubscriptionActive } = await import("@/lib/services/subscription");

      const isActive = await isSubscriptionActive(user.id);

      expect(isActive).toBe(true); // Active status, just cancelAtPeriodEnd=true
      expect(subscription.cancelAtPeriodEnd).toBe(true);
    });
  });

  describe("Plan Limits Comparison", () => {
    it("should return correct limits for free plan", async () => {
      const freePlan = mockPlanFactory.free();
      const user = mockUserFactory.withSubscription("free");
      const subscription = mockSubscriptionFactory.active(user.id, freePlan);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      const { getSubscriptionLimits } = await import("@/lib/services/subscription");

      const limits = await getSubscriptionLimits(user.id);

      expect(limits.messagesPerMonth).toBe(50);
      expect(limits.rulesLimit).toBe(1);
      expect(limits.isUnlimitedMessages).toBe(false);
      expect(limits.isUnlimitedRules).toBe(false);
    });

    it("should return correct limits for professional plan", async () => {
      const proPlan = mockPlanFactory.professional();
      const user = mockUserFactory.withSubscription("professional");
      const subscription = mockSubscriptionFactory.active(user.id, proPlan);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);

      const { getSubscriptionLimits } = await import("@/lib/services/subscription");

      const limits = await getSubscriptionLimits(user.id);

      expect(limits.messagesPerMonth).toBe(5000);
      expect(limits.rulesLimit).toBe(-1);
      expect(limits.isUnlimitedMessages).toBe(false);
      expect(limits.isUnlimitedRules).toBe(true);
    });

    it("should return free plan limits for user without subscription", async () => {
      const freePlan = mockPlanFactory.free();

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(freePlan as any);

      const { getSubscriptionLimits } = await import("@/lib/services/subscription");

      const limits = await getSubscriptionLimits("user-no-sub");

      expect(limits.messagesPerMonth).toBe(50);
      expect(limits.rulesLimit).toBe(1);
    });
  });

  describe("API Route Integration", () => {
    it("should return 401 for unauthenticated subscription request", async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const { GET } = await import("@/app/api/subscription/route");
      const request = new Request("http://localhost:3000/api/subscription");

      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it("should return subscription data for authenticated user", async () => {
      const proPlan = mockPlanFactory.professional();
      const user = mockUserFactory.withSubscription("professional");
      const subscription = mockSubscriptionFactory.active(user.id, proPlan);

      vi.mocked(auth).mockResolvedValue({
        user: { id: user.id, email: user.email, emailVerified: user.emailVerified },
      } as any);
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(subscription as any);
      vi.mocked(prisma.usageRecord.findUnique).mockResolvedValue(
        mockUsageFactory.empty(subscription.id) as any
      );

      const { GET } = await import("@/app/api/subscription/route");
      const request = new Request("http://localhost:3000/api/subscription");

      const response = await GET(request);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.subscription).toBeDefined();
      expect(data.usage).toBeDefined();
    });
  });
});
