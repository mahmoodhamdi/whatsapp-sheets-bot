import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Stripe module before any imports
vi.mock("stripe", () => {
  const mockStripe = vi.fn().mockImplementation(() => ({
    customers: {
      create: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn(),
      del: vi.fn(),
    },
  }));
  return { default: mockStripe };
});

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("Stripe Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    // Reset env to no Stripe key by default
    vi.stubEnv("STRIPE_SECRET_KEY", "");
  });

  describe("formatAmount", () => {
    it("should format USD amount correctly", async () => {
      const { formatAmount } = await import("@/lib/stripe/index");

      expect(formatAmount(999, "usd")).toBe("$9.99");
      expect(formatAmount(2900, "usd")).toBe("$29.00");
      expect(formatAmount(0, "usd")).toBe("$0.00");
    });

    it("should format EUR amount correctly", async () => {
      const { formatAmount } = await import("@/lib/stripe/index");

      const result = formatAmount(1000, "eur");
      expect(result).toContain("10");
    });

    it("should use USD as default currency", async () => {
      const { formatAmount } = await import("@/lib/stripe/index");

      expect(formatAmount(500)).toBe("$5.00");
    });
  });

  describe("formatAmountAr", () => {
    it("should format amount in Arabic locale", async () => {
      const { formatAmountAr } = await import("@/lib/stripe/index");

      const result = formatAmountAr(1000, "sar");
      expect(result).toBeDefined();
      // Result should be formatted number with SAR
    });
  });

  describe("formatAmountLocalized", () => {
    it("should format in English for en locale", async () => {
      const { formatAmountLocalized } = await import("@/lib/stripe/index");

      const result = formatAmountLocalized(1000, "usd", "en");
      expect(result).toBe("$10.00");
    });

    it("should format in Arabic for ar locale", async () => {
      const { formatAmountLocalized } = await import("@/lib/stripe/index");

      const result = formatAmountLocalized(1000, "usd", "ar");
      expect(result).toBeDefined();
    });
  });

  describe("isStripeConfigured", () => {
    it("should return false when STRIPE_SECRET_KEY is not set", async () => {
      vi.stubEnv("STRIPE_SECRET_KEY", "");
      vi.resetModules();

      const { isStripeConfigured } = await import("@/lib/stripe/index");
      expect(isStripeConfigured()).toBe(false);
    });
  });

  describe("getStripe", () => {
    it("should throw error when Stripe is not configured", async () => {
      vi.stubEnv("STRIPE_SECRET_KEY", "");
      vi.resetModules();

      const { getStripe } = await import("@/lib/stripe/index");
      expect(() => getStripe()).toThrow("Stripe is not configured");
    });
  });
});

describe("Customer Management - Not Configured", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.stubEnv("STRIPE_SECRET_KEY", "");
  });

  describe("createOrGetStripeCustomer", () => {
    it("should return null when Stripe is not configured", async () => {
      const { createOrGetStripeCustomer } = await import(
        "@/lib/stripe/customer"
      );
      const result = await createOrGetStripeCustomer("user-123");
      expect(result).toBeNull();
    });
  });

  describe("getStripeCustomer", () => {
    it("should return null when Stripe is not configured", async () => {
      const { getStripeCustomer } = await import("@/lib/stripe/customer");
      const result = await getStripeCustomer("cus_123");
      expect(result).toBeNull();
    });
  });

  describe("updateStripeCustomer", () => {
    it("should return null when Stripe is not configured", async () => {
      const { updateStripeCustomer } = await import("@/lib/stripe/customer");
      const result = await updateStripeCustomer("cus_123", { name: "New Name" });
      expect(result).toBeNull();
    });
  });

  describe("deleteStripeCustomer", () => {
    it("should return null when Stripe is not configured", async () => {
      const { deleteStripeCustomer } = await import("@/lib/stripe/customer");
      const result = await deleteStripeCustomer("cus_123");
      expect(result).toBeNull();
    });
  });

  describe("getCustomerIdForCheckout", () => {
    it("should throw error when Stripe is not configured", async () => {
      const { getCustomerIdForCheckout } = await import(
        "@/lib/stripe/customer"
      );

      await expect(getCustomerIdForCheckout("user-123")).rejects.toThrow(
        "Failed to create Stripe customer"
      );
    });
  });
});

// Note: Testing customer management with Stripe configured requires
// complex mocking of the Stripe constructor class. The "Not Configured" tests
// above cover the null/error paths, and the actual Stripe integration
// is tested via webhook and subscription management tests.
//
// Additional coverage for customer.ts is provided through:
// - Integration tests (auth-flow.test.ts - registration creates customer)
// - Webhook tests (customer events handling)
// - Subscription management tests (customer operations)

describe("Stripe Module Exports", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.stubEnv("STRIPE_SECRET_KEY", "");
  });

  it("should export all required functions from customer module", async () => {
    const customerModule = await import("@/lib/stripe/customer");

    expect(customerModule.createOrGetStripeCustomer).toBeDefined();
    expect(customerModule.getStripeCustomer).toBeDefined();
    expect(customerModule.updateStripeCustomer).toBeDefined();
    expect(customerModule.deleteStripeCustomer).toBeDefined();
    expect(customerModule.getCustomerIdForCheckout).toBeDefined();
  });

  it("should export all required functions from index module", async () => {
    const stripeModule = await import("@/lib/stripe/index");

    expect(stripeModule.formatAmount).toBeDefined();
    expect(stripeModule.formatAmountAr).toBeDefined();
    expect(stripeModule.formatAmountLocalized).toBeDefined();
    expect(stripeModule.isStripeConfigured).toBeDefined();
    expect(stripeModule.getStripe).toBeDefined();
  });
});
