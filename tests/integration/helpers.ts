/**
 * Integration Test Helpers
 *
 * Utilities for creating test requests, mocking auth sessions,
 * and setting up common test scenarios.
 */

import { vi } from "vitest";
import { NextRequest } from "next/server";
import {
  mockPlanFactory,
  mockUserFactory,
  mockSubscriptionFactory,
  mockUsageFactory,
} from "./setup";

/**
 * Create a mock NextRequest for testing API routes
 */
export function createMockRequest(
  url: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    searchParams?: Record<string, string>;
  } = {}
): NextRequest {
  const { method = "GET", body, headers = {}, searchParams = {} } = options;

  const urlObj = new URL(url, "http://localhost:3000");
  Object.entries(searchParams).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });

  const requestInit: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body && method !== "GET") {
    requestInit.body = JSON.stringify(body);
  }

  return new NextRequest(urlObj, requestInit);
}

/**
 * Mock authenticated session for API routes
 */
export function mockAuthSession(
  user: ReturnType<typeof mockUserFactory.verified> | null
) {
  return vi.fn().mockResolvedValue(
    user
      ? {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: user.emailVerified,
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }
      : null
  );
}

/**
 * Create a complete test scenario with user, subscription, and usage
 */
export function createTestScenario(
  planType: "free" | "starter" | "professional",
  usageType: "empty" | "nearLimit" | "atLimit" = "empty"
) {
  const plan = mockPlanFactory[planType]();
  const user = mockUserFactory.withSubscription(planType);
  const subscription = mockSubscriptionFactory.active(user.id, plan);

  let usage;
  switch (usageType) {
    case "nearLimit":
      usage = mockUsageFactory.nearLimit(subscription.id, plan.messagesPerMonth);
      break;
    case "atLimit":
      usage = mockUsageFactory.atLimit(subscription.id, plan.messagesPerMonth);
      break;
    default:
      usage = mockUsageFactory.empty(subscription.id);
  }

  return { plan, user, subscription, usage };
}

/**
 * Setup Prisma mocks for a test scenario
 */
export function setupPrismaMocks(
  prismaMock: {
    user: { findUnique: ReturnType<typeof vi.fn> };
    plan: { findUnique: ReturnType<typeof vi.fn>; findFirst: ReturnType<typeof vi.fn> };
    subscription: { findUnique: ReturnType<typeof vi.fn> };
    usageRecord: { findUnique: ReturnType<typeof vi.fn> };
    autoReplyRule: { count: ReturnType<typeof vi.fn> };
  },
  scenario: ReturnType<typeof createTestScenario>
) {
  const { plan, user, subscription, usage } = scenario;

  prismaMock.user.findUnique.mockResolvedValue(user);
  prismaMock.plan.findUnique.mockResolvedValue(plan);
  prismaMock.plan.findFirst.mockResolvedValue(plan);
  prismaMock.subscription.findUnique.mockResolvedValue(subscription);
  prismaMock.usageRecord.findUnique.mockResolvedValue(usage);
  prismaMock.autoReplyRule.count.mockResolvedValue(0);
}

/**
 * Extract JSON from a Response object
 */
export async function getResponseJson<T = unknown>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Failed to parse response as JSON: ${text}`);
  }
}

/**
 * Assert response status and return JSON body
 */
export async function expectResponse<T = unknown>(
  response: Response,
  expectedStatus: number
): Promise<T> {
  if (response.status !== expectedStatus) {
    const body = await response.text();
    throw new Error(
      `Expected status ${expectedStatus}, got ${response.status}. Body: ${body}`
    );
  }
  return getResponseJson<T>(response);
}

/**
 * Generate unique test IDs to avoid collisions
 */
let testIdCounter = 0;
export function uniqueId(prefix: string = "test"): string {
  return `${prefix}-${Date.now()}-${++testIdCounter}`;
}

/**
 * Create mock verification token
 */
export function createMockVerificationToken(userId: string) {
  return {
    id: uniqueId("token"),
    userId,
    token: `verify-${uniqueId()}`,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    createdAt: new Date(),
  };
}

/**
 * Create mock password reset token
 */
export function createMockPasswordResetToken(userId: string) {
  return {
    id: uniqueId("reset"),
    userId,
    token: `reset-${uniqueId()}`,
    expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    createdAt: new Date(),
  };
}

/**
 * Wait for a condition to be true (useful for async operations)
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await condition()) return;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error(`waitFor timed out after ${timeout}ms`);
}
