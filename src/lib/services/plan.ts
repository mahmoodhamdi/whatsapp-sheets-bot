import { prisma } from "@/lib/prisma";
import { Plan } from "@prisma/client";

/**
 * Get all active plans sorted by order
 */
export async function getAllPlans(): Promise<Plan[]> {
  return prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Get a plan by its slug
 */
export async function getPlanBySlug(slug: string): Promise<Plan | null> {
  return prisma.plan.findUnique({
    where: { slug },
  });
}

/**
 * Get a plan by Stripe price ID (monthly or yearly)
 */
export async function getPlanByStripePriceId(
  priceId: string
): Promise<Plan | null> {
  return prisma.plan.findFirst({
    where: {
      OR: [
        { stripePriceIdMonthly: priceId },
        { stripePriceIdYearly: priceId },
      ],
    },
  });
}

/**
 * Get the free plan (throws if not found)
 */
export async function getFreePlan(): Promise<Plan> {
  const plan = await prisma.plan.findUnique({
    where: { slug: "free" },
  });

  if (!plan) {
    throw new Error("Free plan not found. Please run database seed.");
  }

  return plan;
}

/**
 * Check if a plan has a specific feature
 */
export function planHasFeature(plan: Plan, feature: string): boolean {
  const features = plan.features as string[];
  return features.includes(feature);
}

/**
 * Get plan limits
 */
export function getPlanLimits(plan: Plan): {
  messagesPerMonth: number;
  rulesLimit: number;
  isUnlimitedMessages: boolean;
  isUnlimitedRules: boolean;
} {
  return {
    messagesPerMonth: plan.messagesPerMonth,
    rulesLimit: plan.rulesLimit,
    isUnlimitedMessages: plan.messagesPerMonth === -1,
    isUnlimitedRules: plan.rulesLimit === -1,
  };
}
