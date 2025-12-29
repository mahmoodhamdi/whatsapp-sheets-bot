/**
 * Integration Test Setup
 *
 * This file provides utilities for integration tests that test
 * the interaction between multiple components (API routes, services, etc.)
 */

import { vi, beforeEach, afterEach } from "vitest";

// Mock environment variables for integration tests
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.NEXTAUTH_SECRET = "integration-test-secret-key-12345";
process.env.NEXTAUTH_URL = "http://localhost:3000";
process.env.RESEND_API_KEY = "re_test_123456789";
process.env.STRIPE_SECRET_KEY = "";
process.env.STRIPE_WEBHOOK_SECRET = "";

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  vi.resetModules();
});

/**
 * Mock data factories
 */
export const mockPlanFactory = {
  free: () => ({
    id: "plan-free",
    name: "Free",
    slug: "free",
    description: "Free plan for testing",
    monthlyPrice: 0,
    yearlyPrice: 0,
    messagesPerMonth: 50,
    rulesLimit: 1,
    features: ["basic_support"],
    isActive: true,
    sortOrder: 0,
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),

  starter: () => ({
    id: "plan-starter",
    name: "Starter",
    slug: "starter",
    description: "Starter plan",
    monthlyPrice: 900,
    yearlyPrice: 8640,
    messagesPerMonth: 500,
    rulesLimit: 5,
    features: ["basic_support", "sheets_sync"],
    isActive: true,
    sortOrder: 1,
    stripePriceIdMonthly: "price_starter_monthly",
    stripePriceIdYearly: "price_starter_yearly",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),

  professional: () => ({
    id: "plan-pro",
    name: "Professional",
    slug: "professional",
    description: "Professional plan",
    monthlyPrice: 2900,
    yearlyPrice: 27840,
    messagesPerMonth: 5000,
    rulesLimit: -1, // unlimited
    features: ["priority_support", "sheets_sync", "analytics", "api_access"],
    isActive: true,
    sortOrder: 2,
    stripePriceIdMonthly: "price_pro_monthly",
    stripePriceIdYearly: "price_pro_yearly",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};

export const mockUserFactory = {
  verified: (overrides = {}) => ({
    id: "user-verified-1",
    email: "verified@example.com",
    name: "Verified User",
    password: "$2a$10$hashedpassword", // bcrypt hash
    emailVerified: new Date(),
    image: null,
    stripeCustomerId: null,
    failedLoginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  unverified: (overrides = {}) => ({
    id: "user-unverified-1",
    email: "unverified@example.com",
    name: "Unverified User",
    password: "$2a$10$hashedpassword",
    emailVerified: null,
    image: null,
    stripeCustomerId: null,
    failedLoginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  withSubscription: (planSlug: "free" | "starter" | "professional", overrides = {}) => ({
    id: `user-${planSlug}-1`,
    email: `${planSlug}@example.com`,
    name: `${planSlug.charAt(0).toUpperCase() + planSlug.slice(1)} User`,
    password: "$2a$10$hashedpassword",
    emailVerified: new Date(),
    image: null,
    stripeCustomerId: planSlug !== "free" ? `cus_${planSlug}_123` : null,
    failedLoginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
};

export const mockSubscriptionFactory = {
  active: (userId: string, plan: ReturnType<typeof mockPlanFactory.free>) => ({
    id: `sub-${userId}`,
    userId,
    planId: plan.id,
    status: "ACTIVE" as const,
    billingInterval: "MONTHLY" as const,
    stripeSubscriptionId: plan.slug !== "free" ? `sub_stripe_${userId}` : null,
    stripePriceId: plan.stripePriceIdMonthly,
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false,
    canceledAt: null,
    trialEndsAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    plan,
  }),

  canceled: (userId: string, plan: ReturnType<typeof mockPlanFactory.free>) => ({
    id: `sub-${userId}`,
    userId,
    planId: plan.id,
    status: "ACTIVE" as const,
    billingInterval: "MONTHLY" as const,
    stripeSubscriptionId: `sub_stripe_${userId}`,
    stripePriceId: plan.stripePriceIdMonthly,
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: true,
    canceledAt: new Date(),
    trialEndsAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    plan,
  }),
};

export const mockUsageFactory = {
  empty: (subscriptionId: string) => ({
    id: `usage-${subscriptionId}`,
    subscriptionId,
    periodStart: new Date(),
    periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    messagesCount: 0,
    rulesCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),

  nearLimit: (subscriptionId: string, limit: number) => ({
    id: `usage-${subscriptionId}`,
    subscriptionId,
    periodStart: new Date(),
    periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    messagesCount: Math.floor(limit * 0.9),
    rulesCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),

  atLimit: (subscriptionId: string, limit: number) => ({
    id: `usage-${subscriptionId}`,
    subscriptionId,
    periodStart: new Date(),
    periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    messagesCount: limit,
    rulesCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};

export const mockRuleFactory = {
  exact: (overrides = {}) => ({
    id: "rule-exact-1",
    name: "Exact Match Rule",
    trigger: "hello",
    triggerType: "EXACT" as const,
    response: "Hello! How can I help you?",
    priority: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  contains: (overrides = {}) => ({
    id: "rule-contains-1",
    name: "Contains Match Rule",
    trigger: "price",
    triggerType: "CONTAINS" as const,
    response: "Our prices start at $9/month.",
    priority: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  regex: (overrides = {}) => ({
    id: "rule-regex-1",
    name: "Regex Match Rule",
    trigger: "\\d{3,}",
    triggerType: "REGEX" as const,
    response: "I see you mentioned a number.",
    priority: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
};
