import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    webhookEvent: {
      create: vi.fn().mockResolvedValue({ id: "webhook-1" }),
      update: vi.fn().mockResolvedValue({}),
    },
    plan: {
      findUnique: vi.fn(),
    },
    subscription: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

// Mock stripe
vi.mock("@/lib/stripe", () => ({
  isStripeConfigured: vi.fn(),
  getStripe: vi.fn(),
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

describe("Stripe Webhook Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("POST /api/webhooks/stripe", () => {
    it("should return 503 when Stripe is not configured", async () => {
      const { isStripeConfigured } = await import("@/lib/stripe");
      vi.mocked(isStripeConfigured).mockReturnValue(false);

      const { POST } = await import(
        "@/app/api/webhooks/stripe/route"
      );

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: "{}",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe("Stripe not configured");
    });

    it("should return 500 when webhook secret is not configured", async () => {
      const { isStripeConfigured } = await import("@/lib/stripe");
      vi.mocked(isStripeConfigured).mockReturnValue(true);

      // Clear the webhook secret
      const originalEnv = process.env.STRIPE_WEBHOOK_SECRET;
      delete process.env.STRIPE_WEBHOOK_SECRET;

      const { POST } = await import(
        "@/app/api/webhooks/stripe/route"
      );

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: "{}",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Webhook secret not configured");

      // Restore
      process.env.STRIPE_WEBHOOK_SECRET = originalEnv;
    });

    it("should return 400 when signature is missing", async () => {
      const { isStripeConfigured } = await import("@/lib/stripe");
      vi.mocked(isStripeConfigured).mockReturnValue(true);

      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const { headers } = await import("next/headers");
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue(null),
      } as unknown as Headers);

      const { POST } = await import(
        "@/app/api/webhooks/stripe/route"
      );

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: "{}",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("No signature");
    });

    it("should return 400 when signature is invalid", async () => {
      const { isStripeConfigured, getStripe } = await import("@/lib/stripe");
      vi.mocked(isStripeConfigured).mockReturnValue(true);

      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const mockStripe = {
        webhooks: {
          constructEvent: vi.fn().mockImplementation(() => {
            throw new Error("Invalid signature");
          }),
        },
      };
      vi.mocked(getStripe).mockReturnValue(mockStripe as unknown as ReturnType<typeof getStripe>);

      const { headers } = await import("next/headers");
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue("invalid_signature"),
      } as unknown as Headers);

      const { POST } = await import(
        "@/app/api/webhooks/stripe/route"
      );

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: "{}",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid signature");
    });

    it("should process checkout.session.completed event", async () => {
      const { isStripeConfigured, getStripe } = await import("@/lib/stripe");
      const { prisma } = await import("@/lib/prisma");

      vi.mocked(isStripeConfigured).mockReturnValue(true);
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const mockEvent = {
        id: "evt_test_123",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_123",
            customer: "cus_test_123",
            subscription: "sub_test_123",
            metadata: {
              userId: "user-1",
              planSlug: "starter",
            },
          },
        },
      };

      const mockSubscription = {
        id: "sub_test_123",
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        items: {
          data: [
            {
              price: {
                id: "price_test_123",
                recurring: { interval: "month" },
              },
            },
          ],
        },
      };

      const mockStripe = {
        webhooks: {
          constructEvent: vi.fn().mockReturnValue(mockEvent),
        },
        subscriptions: {
          retrieve: vi.fn().mockResolvedValue(mockSubscription),
        },
      };
      vi.mocked(getStripe).mockReturnValue(mockStripe as unknown as ReturnType<typeof getStripe>);

      vi.mocked(prisma.plan.findUnique).mockResolvedValue({
        id: "plan-1",
        slug: "starter",
        name: "Starter",
        description: null,
        monthlyPrice: 900,
        yearlyPrice: 8600,
        stripePriceIdMonthly: "price_monthly",
        stripePriceIdYearly: "price_yearly",
        messagesPerMonth: 500,
        rulesLimit: 10,
        features: [],
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(prisma.subscription.upsert).mockResolvedValue({
        id: "sub-1",
        userId: "user-1",
        planId: "plan-1",
        stripeCustomerId: "cus_test_123",
        stripeSubscriptionId: "sub_test_123",
        stripePriceId: "price_test_123",
        status: "ACTIVE",
        billingInterval: "MONTHLY",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        canceledAt: null,
        trialEndsAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { headers } = await import("next/headers");
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue("valid_signature"),
      } as unknown as Headers);

      const { POST } = await import(
        "@/app/api/webhooks/stripe/route"
      );

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(prisma.subscription.upsert).toHaveBeenCalled();
      expect(prisma.webhookEvent.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { processed: true },
        })
      );
    });

    it("should process customer.subscription.updated event", async () => {
      const { isStripeConfigured, getStripe } = await import("@/lib/stripe");
      const { prisma } = await import("@/lib/prisma");

      vi.mocked(isStripeConfigured).mockReturnValue(true);
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const mockEvent = {
        id: "evt_test_456",
        type: "customer.subscription.updated",
        data: {
          object: {
            id: "sub_test_123",
            status: "active",
            cancel_at_period_end: false,
            items: {
              data: [
                {
                  current_period_start: Math.floor(Date.now() / 1000),
                  current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
                },
              ],
            },
          },
        },
      };

      const mockStripe = {
        webhooks: {
          constructEvent: vi.fn().mockReturnValue(mockEvent),
        },
      };
      vi.mocked(getStripe).mockReturnValue(mockStripe as unknown as ReturnType<typeof getStripe>);

      vi.mocked(prisma.subscription.findUnique).mockResolvedValue({
        id: "sub-1",
        userId: "user-1",
        planId: "plan-1",
        stripeCustomerId: "cus_test_123",
        stripeSubscriptionId: "sub_test_123",
        stripePriceId: "price_test_123",
        status: "ACTIVE",
        billingInterval: "MONTHLY",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        canceledAt: null,
        trialEndsAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(prisma.subscription.update).mockResolvedValue({
        id: "sub-1",
        userId: "user-1",
        planId: "plan-1",
        stripeCustomerId: "cus_test_123",
        stripeSubscriptionId: "sub_test_123",
        stripePriceId: "price_test_123",
        status: "ACTIVE",
        billingInterval: "MONTHLY",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        canceledAt: null,
        trialEndsAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { headers } = await import("next/headers");
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue("valid_signature"),
      } as unknown as Headers);

      const { POST } = await import(
        "@/app/api/webhooks/stripe/route"
      );

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(prisma.subscription.update).toHaveBeenCalled();
    });

    it("should process customer.subscription.deleted event", async () => {
      const { isStripeConfigured, getStripe } = await import("@/lib/stripe");
      const { prisma } = await import("@/lib/prisma");

      vi.mocked(isStripeConfigured).mockReturnValue(true);
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const mockEvent = {
        id: "evt_test_789",
        type: "customer.subscription.deleted",
        data: {
          object: {
            id: "sub_test_123",
          },
        },
      };

      const mockStripe = {
        webhooks: {
          constructEvent: vi.fn().mockReturnValue(mockEvent),
        },
      };
      vi.mocked(getStripe).mockReturnValue(mockStripe as unknown as ReturnType<typeof getStripe>);

      vi.mocked(prisma.subscription.updateMany).mockResolvedValue({ count: 1 });

      const { headers } = await import("next/headers");
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue("valid_signature"),
      } as unknown as Headers);

      const { POST } = await import(
        "@/app/api/webhooks/stripe/route"
      );

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(prisma.subscription.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { stripeSubscriptionId: "sub_test_123" },
          data: expect.objectContaining({
            status: "CANCELED",
          }),
        })
      );
    });

    it("should process invoice.payment_failed event", async () => {
      const { isStripeConfigured, getStripe } = await import("@/lib/stripe");
      const { prisma } = await import("@/lib/prisma");

      vi.mocked(isStripeConfigured).mockReturnValue(true);
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const mockEvent = {
        id: "evt_test_payment_failed",
        type: "invoice.payment_failed",
        data: {
          object: {
            id: "inv_test_123",
            parent: {
              subscription_details: {
                subscription: "sub_test_123",
              },
            },
          },
        },
      };

      const mockStripe = {
        webhooks: {
          constructEvent: vi.fn().mockReturnValue(mockEvent),
        },
      };
      vi.mocked(getStripe).mockReturnValue(mockStripe as unknown as ReturnType<typeof getStripe>);

      vi.mocked(prisma.subscription.updateMany).mockResolvedValue({ count: 1 });

      const { headers } = await import("next/headers");
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue("valid_signature"),
      } as unknown as Headers);

      const { POST } = await import(
        "@/app/api/webhooks/stripe/route"
      );

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(prisma.subscription.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { stripeSubscriptionId: "sub_test_123" },
          data: { status: "PAST_DUE" },
        })
      );
    });

    it("should handle unhandled event types gracefully", async () => {
      const { isStripeConfigured, getStripe } = await import("@/lib/stripe");
      const { prisma } = await import("@/lib/prisma");

      vi.mocked(isStripeConfigured).mockReturnValue(true);
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const mockEvent = {
        id: "evt_unhandled",
        type: "payment_intent.created",
        data: {
          object: {},
        },
      };

      const mockStripe = {
        webhooks: {
          constructEvent: vi.fn().mockReturnValue(mockEvent),
        },
      };
      vi.mocked(getStripe).mockReturnValue(mockStripe as unknown as ReturnType<typeof getStripe>);

      const { headers } = await import("next/headers");
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue("valid_signature"),
      } as unknown as Headers);

      const { POST } = await import(
        "@/app/api/webhooks/stripe/route"
      );

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      // Event should still be logged and marked as processed
      expect(prisma.webhookEvent.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { processed: true },
        })
      );
    });

    it("should log error when handler fails", async () => {
      const { isStripeConfigured, getStripe } = await import("@/lib/stripe");
      const { prisma } = await import("@/lib/prisma");

      vi.mocked(isStripeConfigured).mockReturnValue(true);
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const mockEvent = {
        id: "evt_error",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_123",
            customer: "cus_test_123",
            subscription: "sub_test_123",
            metadata: {
              userId: "user-1",
              planSlug: "starter",
            },
          },
        },
      };

      const mockStripe = {
        webhooks: {
          constructEvent: vi.fn().mockReturnValue(mockEvent),
        },
        subscriptions: {
          retrieve: vi.fn().mockRejectedValue(new Error("Stripe API error")),
        },
      };
      vi.mocked(getStripe).mockReturnValue(mockStripe as unknown as ReturnType<typeof getStripe>);

      vi.mocked(prisma.plan.findUnique).mockResolvedValue({
        id: "plan-1",
        slug: "starter",
        name: "Starter",
        description: null,
        monthlyPrice: 900,
        yearlyPrice: 8600,
        stripePriceIdMonthly: "price_monthly",
        stripePriceIdYearly: "price_yearly",
        messagesPerMonth: 500,
        rulesLimit: 10,
        features: [],
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { headers } = await import("next/headers");
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue("valid_signature"),
      } as unknown as Headers);

      const { POST } = await import(
        "@/app/api/webhooks/stripe/route"
      );

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Handler failed");
      expect(prisma.webhookEvent.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            error: "Stripe API error",
          }),
        })
      );
    });
  });
});
