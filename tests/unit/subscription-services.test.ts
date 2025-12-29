/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    plan: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
    subscription: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
    },
    usageRecord: {
      findUnique: vi.fn(),
      create: vi.fn(),
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    autoReplyRule: {
      count: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  getAllPlans,
  getPlanBySlug,
  getPlanByStripePriceId,
  getFreePlan,
  planHasFeature,
  getPlanLimits,
} from "@/lib/services/plan";
import {
  getUserSubscription,
  createFreeSubscription,
  isSubscriptionActive,
  getSubscriptionLimits,
  userHasFeature,
  updateSubscriptionStatus,
  updateSubscriptionFromStripe,
  cancelSubscriptionAtPeriodEnd,
  reactivateSubscription,
  getSubscriptionByStripeId,
  deleteSubscription,
} from "@/lib/services/subscription";
import {
  getCurrentUsage,
  canSendMessage,
  canCreateRule,
  getMessageUsagePercentage,
  getRemainingMessages,
  incrementMessageCount,
  resetUsageForPeriod,
  getUsageHistory,
} from "@/lib/services/usage";

const mockFreePlan = {
  id: "plan-free",
  name: "Free",
  slug: "free",
  description: "For testing",
  monthlyPrice: 0,
  yearlyPrice: 0,
  messagesPerMonth: 50,
  rulesLimit: 1,
  features: ["basic_support"],
  isActive: true,
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProPlan = {
  id: "plan-pro",
  name: "Professional",
  slug: "professional",
  description: "For medium businesses",
  monthlyPrice: 2900,
  yearlyPrice: 27840,
  messagesPerMonth: 5000,
  rulesLimit: -1,
  features: ["priority_support", "sheets_sync", "analytics"],
  isActive: true,
  sortOrder: 2,
  stripePriceIdMonthly: "price_monthly_pro",
  stripePriceIdYearly: "price_yearly_pro",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Plan Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllPlans", () => {
    it("should return all active plans sorted by order", async () => {
      const mockPlans = [mockFreePlan, mockProPlan];
      vi.mocked(prisma.plan.findMany).mockResolvedValue(mockPlans as any);

      const result = await getAllPlans();

      expect(result).toEqual(mockPlans);
      expect(prisma.plan.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
    });
  });

  describe("getPlanBySlug", () => {
    it("should return plan by slug", async () => {
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(mockFreePlan as any);

      const result = await getPlanBySlug("free");

      expect(result).toEqual(mockFreePlan);
      expect(prisma.plan.findUnique).toHaveBeenCalledWith({
        where: { slug: "free" },
      });
    });

    it("should return null for non-existent slug", async () => {
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(null);

      const result = await getPlanBySlug("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("getPlanByStripePriceId", () => {
    it("should return plan by monthly price ID", async () => {
      vi.mocked(prisma.plan.findFirst).mockResolvedValue(mockProPlan as any);

      const result = await getPlanByStripePriceId("price_monthly_pro");

      expect(result).toEqual(mockProPlan);
      expect(prisma.plan.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { stripePriceIdMonthly: "price_monthly_pro" },
            { stripePriceIdYearly: "price_monthly_pro" },
          ],
        },
      });
    });
  });

  describe("getFreePlan", () => {
    it("should return the free plan", async () => {
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(mockFreePlan as any);

      const result = await getFreePlan();

      expect(result).toEqual(mockFreePlan);
    });

    it("should throw error if free plan not found", async () => {
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(null);

      await expect(getFreePlan()).rejects.toThrow("Free plan not found");
    });
  });

  describe("planHasFeature", () => {
    it("should return true if plan has feature", () => {
      const result = planHasFeature(mockProPlan as any, "sheets_sync");
      expect(result).toBe(true);
    });

    it("should return false if plan does not have feature", () => {
      const result = planHasFeature(mockFreePlan as any, "sheets_sync");
      expect(result).toBe(false);
    });
  });

  describe("getPlanLimits", () => {
    it("should return plan limits correctly", () => {
      const result = getPlanLimits(mockFreePlan as any);

      expect(result).toEqual({
        messagesPerMonth: 50,
        rulesLimit: 1,
        isUnlimitedMessages: false,
        isUnlimitedRules: false,
      });
    });

    it("should detect unlimited limits", () => {
      const result = getPlanLimits(mockProPlan as any);

      expect(result.isUnlimitedRules).toBe(true);
      expect(result.isUnlimitedMessages).toBe(false);
    });
  });
});

describe("Subscription Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserSubscription", () => {
    it("should return user subscription with plan", async () => {
      const mockSubscription = {
        id: "sub-1",
        userId: "user-1",
        planId: "plan-free",
        status: "ACTIVE",
        plan: mockFreePlan,
      };
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(
        mockSubscription as any
      );

      const result = await getUserSubscription("user-1");

      expect(result).toEqual(mockSubscription);
      expect(prisma.subscription.findUnique).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        include: { plan: true },
      });
    });

    it("should return null if no subscription", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);

      const result = await getUserSubscription("user-1");

      expect(result).toBeNull();
    });
  });

  describe("createFreeSubscription", () => {
    it("should create a free subscription for user", async () => {
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(mockFreePlan as any);
      vi.mocked(prisma.subscription.create).mockResolvedValue({
        id: "sub-new",
        userId: "user-1",
        planId: "plan-free",
        status: "ACTIVE",
      } as any);

      const result = await createFreeSubscription("user-1");

      expect(result.status).toBe("ACTIVE");
      expect(prisma.subscription.create).toHaveBeenCalled();
    });
  });

  describe("isSubscriptionActive", () => {
    it("should return true for active subscription", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        status: "ACTIVE",
        plan: mockFreePlan,
      } as any);

      const result = await isSubscriptionActive("user-1");

      expect(result).toBe(true);
    });

    it("should return true for trialing subscription", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        status: "TRIALING",
        plan: mockFreePlan,
      } as any);

      const result = await isSubscriptionActive("user-1");

      expect(result).toBe(true);
    });

    it("should return false for canceled subscription", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        status: "CANCELED",
        plan: mockFreePlan,
      } as any);

      const result = await isSubscriptionActive("user-1");

      expect(result).toBe(false);
    });

    it("should return false if no subscription", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);

      const result = await isSubscriptionActive("user-1");

      expect(result).toBe(false);
    });
  });

  describe("getSubscriptionLimits", () => {
    it("should return plan limits from subscription", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        plan: mockProPlan,
      } as any);

      const result = await getSubscriptionLimits("user-1");

      expect(result.messagesPerMonth).toBe(5000);
      expect(result.rulesLimit).toBe(-1);
      expect(result.isUnlimitedRules).toBe(true);
    });

    it("should return free plan limits if no subscription", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(mockFreePlan as any);

      const result = await getSubscriptionLimits("user-1");

      expect(result.messagesPerMonth).toBe(50);
      expect(result.rulesLimit).toBe(1);
    });
  });

  describe("userHasFeature", () => {
    it("should return true if user plan has feature", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        plan: mockProPlan,
      } as any);

      const result = await userHasFeature("user-1", "sheets_sync");

      expect(result).toBe(true);
    });

    it("should return false if user plan does not have feature", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        plan: mockFreePlan,
      } as any);

      const result = await userHasFeature("user-1", "sheets_sync");

      expect(result).toBe(false);
    });

    it("should check free plan features if no subscription", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(mockFreePlan as any);

      const result = await userHasFeature("user-1", "basic_support");

      expect(result).toBe(true);
    });
  });

  describe("updateSubscriptionStatus", () => {
    it("should update subscription status", async () => {
      vi.mocked(prisma.subscription.update).mockResolvedValue({
        id: "sub-1",
        status: "PAST_DUE",
      } as any);

      const result = await updateSubscriptionStatus("sub-1", "PAST_DUE");

      expect(result.status).toBe("PAST_DUE");
      expect(prisma.subscription.update).toHaveBeenCalledWith({
        where: { id: "sub-1" },
        data: { status: "PAST_DUE" },
      });
    });
  });

  describe("updateSubscriptionFromStripe", () => {
    it("should upsert subscription with Stripe data", async () => {
      const stripeData = {
        stripeSubscriptionId: "sub_stripe_123",
        stripePriceId: "price_123",
        planId: "plan-pro",
        status: "ACTIVE" as const,
        billingInterval: "MONTHLY" as const,
        currentPeriodStart: new Date("2024-01-01"),
        currentPeriodEnd: new Date("2024-02-01"),
        cancelAtPeriodEnd: false,
      };
      vi.mocked(prisma.subscription.upsert).mockResolvedValue({
        id: "sub-1",
        userId: "user-1",
        ...stripeData,
      } as any);

      const result = await updateSubscriptionFromStripe("user-1", stripeData);

      expect(result.stripeSubscriptionId).toBe("sub_stripe_123");
      expect(prisma.subscription.upsert).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        update: stripeData,
        create: {
          userId: "user-1",
          ...stripeData,
        },
      });
    });
  });

  describe("cancelSubscriptionAtPeriodEnd", () => {
    it("should mark subscription for cancellation", async () => {
      vi.mocked(prisma.subscription.update).mockResolvedValue({
        id: "sub-1",
        cancelAtPeriodEnd: true,
        canceledAt: expect.any(Date),
      } as any);

      const result = await cancelSubscriptionAtPeriodEnd("user-1");

      expect(result.cancelAtPeriodEnd).toBe(true);
      expect(prisma.subscription.update).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        data: {
          cancelAtPeriodEnd: true,
          canceledAt: expect.any(Date),
        },
      });
    });
  });

  describe("reactivateSubscription", () => {
    it("should reactivate a canceled subscription", async () => {
      vi.mocked(prisma.subscription.update).mockResolvedValue({
        id: "sub-1",
        cancelAtPeriodEnd: false,
        canceledAt: null,
      } as any);

      const result = await reactivateSubscription("user-1");

      expect(result.cancelAtPeriodEnd).toBe(false);
      expect(result.canceledAt).toBeNull();
      expect(prisma.subscription.update).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        data: {
          cancelAtPeriodEnd: false,
          canceledAt: null,
        },
      });
    });
  });

  describe("getSubscriptionByStripeId", () => {
    it("should return subscription by Stripe ID", async () => {
      const mockSubscription = {
        id: "sub-1",
        stripeSubscriptionId: "sub_stripe_123",
        plan: mockProPlan,
      };
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(
        mockSubscription as any
      );

      const result = await getSubscriptionByStripeId("sub_stripe_123");

      expect(result).toEqual(mockSubscription);
      expect(prisma.subscription.findUnique).toHaveBeenCalledWith({
        where: { stripeSubscriptionId: "sub_stripe_123" },
        include: { plan: true },
      });
    });

    it("should return null for non-existent Stripe ID", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);

      const result = await getSubscriptionByStripeId("invalid_id");

      expect(result).toBeNull();
    });
  });

  describe("deleteSubscription", () => {
    it("should delete subscription for user", async () => {
      vi.mocked(prisma.subscription.delete).mockResolvedValue({
        id: "sub-1",
      } as any);

      await deleteSubscription("user-1");

      expect(prisma.subscription.delete).toHaveBeenCalledWith({
        where: { userId: "user-1" },
      });
    });
  });
});

describe("Usage Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCurrentUsage", () => {
    it("should return zero usage if no subscription", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);

      const result = await getCurrentUsage("user-1");

      expect(result.messagesCount).toBe(0);
      expect(result.rulesCount).toBe(0);
    });

    it("should return existing usage record", async () => {
      const periodStart = new Date("2024-01-01");
      const periodEnd = new Date("2024-01-31");
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        plan: mockFreePlan,
      } as any);
      vi.mocked(prisma.usageRecord.findUnique).mockResolvedValue({
        messagesCount: 25,
        rulesCount: 1,
        periodStart,
        periodEnd,
      } as any);

      const result = await getCurrentUsage("user-1");

      expect(result.messagesCount).toBe(25);
    });

    it("should create new usage record if none exists", async () => {
      const periodStart = new Date("2024-01-01");
      const periodEnd = new Date("2024-01-31");
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        plan: mockFreePlan,
      } as any);
      vi.mocked(prisma.usageRecord.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.usageRecord.create).mockResolvedValue({
        messagesCount: 0,
        rulesCount: 0,
        periodStart,
        periodEnd,
      } as any);

      const result = await getCurrentUsage("user-1");

      expect(result.messagesCount).toBe(0);
      expect(prisma.usageRecord.create).toHaveBeenCalled();
    });
  });

  describe("canSendMessage", () => {
    it("should return true if under limit", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        plan: mockFreePlan,
      } as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(mockFreePlan as any);
      vi.mocked(prisma.usageRecord.findUnique).mockResolvedValue({
        messagesCount: 25,
        rulesCount: 0,
        periodStart: new Date(),
        periodEnd: new Date(),
      } as any);

      const result = await canSendMessage("user-1");

      expect(result).toBe(true);
    });

    it("should return false if at limit", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        plan: mockFreePlan,
      } as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(mockFreePlan as any);
      vi.mocked(prisma.usageRecord.findUnique).mockResolvedValue({
        messagesCount: 50,
        rulesCount: 0,
        periodStart: new Date(),
        periodEnd: new Date(),
      } as any);

      const result = await canSendMessage("user-1");

      expect(result).toBe(false);
    });

    it("should return true if unlimited plan", async () => {
      const unlimitedPlan = { ...mockProPlan, messagesPerMonth: -1 };
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        plan: unlimitedPlan,
      } as any);

      const result = await canSendMessage("user-1");

      expect(result).toBe(true);
    });
  });

  describe("canCreateRule", () => {
    it("should return true if under limit", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        plan: mockFreePlan,
      } as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(mockFreePlan as any);
      vi.mocked(prisma.autoReplyRule.count).mockResolvedValue(0);

      const result = await canCreateRule("user-1");

      expect(result).toBe(true);
    });

    it("should return false if at limit", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        plan: mockFreePlan,
      } as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(mockFreePlan as any);
      vi.mocked(prisma.autoReplyRule.count).mockResolvedValue(1);

      const result = await canCreateRule("user-1");

      expect(result).toBe(false);
    });

    it("should return true if unlimited rules", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        plan: mockProPlan,
      } as any);

      const result = await canCreateRule("user-1");

      expect(result).toBe(true);
    });
  });

  describe("getMessageUsagePercentage", () => {
    it("should return correct percentage", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        plan: mockFreePlan,
      } as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(mockFreePlan as any);
      vi.mocked(prisma.usageRecord.findUnique).mockResolvedValue({
        messagesCount: 25,
        rulesCount: 0,
        periodStart: new Date(),
        periodEnd: new Date(),
      } as any);

      const result = await getMessageUsagePercentage("user-1");

      expect(result).toBe(50);
    });

    it("should return 0 for unlimited plan", async () => {
      const unlimitedPlan = { ...mockProPlan, messagesPerMonth: -1 };
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        plan: unlimitedPlan,
      } as any);

      const result = await getMessageUsagePercentage("user-1");

      expect(result).toBe(0);
    });
  });

  describe("getRemainingMessages", () => {
    it("should return remaining messages", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        plan: mockFreePlan,
      } as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(mockFreePlan as any);
      vi.mocked(prisma.usageRecord.findUnique).mockResolvedValue({
        messagesCount: 30,
        rulesCount: 0,
        periodStart: new Date(),
        periodEnd: new Date(),
      } as any);

      const result = await getRemainingMessages("user-1");

      expect(result).toBe(20);
    });

    it("should return -1 for unlimited plan", async () => {
      const unlimitedPlan = { ...mockProPlan, messagesPerMonth: -1 };
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        plan: unlimitedPlan,
      } as any);

      const result = await getRemainingMessages("user-1");

      expect(result).toBe(-1);
    });

    it("should return 0 if over limit", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        plan: mockFreePlan,
      } as any);
      vi.mocked(prisma.plan.findUnique).mockResolvedValue(mockFreePlan as any);
      vi.mocked(prisma.usageRecord.findUnique).mockResolvedValue({
        messagesCount: 60,
        rulesCount: 0,
        periodStart: new Date(),
        periodEnd: new Date(),
      } as any);

      const result = await getRemainingMessages("user-1");

      expect(result).toBe(0);
    });
  });

  describe("incrementMessageCount", () => {
    it("should increment message count for existing record", async () => {
      const periodStart = new Date("2024-01-01");
      const periodEnd = new Date("2024-01-31");
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        plan: mockFreePlan,
      } as any);
      vi.mocked(prisma.usageRecord.upsert).mockResolvedValue({
        messagesCount: 26,
        rulesCount: 0,
        periodStart,
        periodEnd,
      } as any);

      await incrementMessageCount("user-1");

      expect(prisma.usageRecord.upsert).toHaveBeenCalledWith({
        where: {
          subscriptionId_periodStart: {
            subscriptionId: "sub-1",
            periodStart,
          },
        },
        update: {
          messagesCount: { increment: 1 },
        },
        create: {
          subscriptionId: "sub-1",
          periodStart,
          periodEnd,
          messagesCount: 1,
          rulesCount: 0,
        },
      });
    });

    it("should do nothing if no subscription", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);

      await incrementMessageCount("user-1");

      expect(prisma.usageRecord.upsert).not.toHaveBeenCalled();
    });
  });

  describe("resetUsageForPeriod", () => {
    it("should create new usage record for period", async () => {
      const periodStart = new Date("2024-02-01");
      const periodEnd = new Date("2024-03-01");
      vi.mocked(prisma.usageRecord.create).mockResolvedValue({
        id: "usage-new",
        subscriptionId: "sub-1",
        messagesCount: 0,
        rulesCount: 0,
        periodStart,
        periodEnd,
      } as any);

      const result = await resetUsageForPeriod("sub-1", periodStart, periodEnd);

      expect(result.messagesCount).toBe(0);
      expect(result.rulesCount).toBe(0);
      expect(prisma.usageRecord.create).toHaveBeenCalledWith({
        data: {
          subscriptionId: "sub-1",
          periodStart,
          periodEnd,
          messagesCount: 0,
          rulesCount: 0,
        },
      });
    });
  });

  describe("getUsageHistory", () => {
    it("should return usage history for user", async () => {
      const mockHistory = [
        { id: "usage-1", messagesCount: 100, periodStart: new Date("2024-01-01") },
        { id: "usage-2", messagesCount: 80, periodStart: new Date("2023-12-01") },
      ];
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        plan: mockFreePlan,
      } as any);
      vi.mocked(prisma.usageRecord.findMany).mockResolvedValue(mockHistory as any);

      const result = await getUsageHistory("user-1", 12);

      expect(result).toEqual(mockHistory);
      expect(prisma.usageRecord.findMany).toHaveBeenCalledWith({
        where: { subscriptionId: "sub-1" },
        orderBy: { periodStart: "desc" },
        take: 12,
      });
    });

    it("should return empty array if no subscription", async () => {
      vi.mocked(prisma.subscription.findUnique).mockResolvedValue(null);

      const result = await getUsageHistory("user-1");

      expect(result).toEqual([]);
      expect(prisma.usageRecord.findMany).not.toHaveBeenCalled();
    });
  });
});
