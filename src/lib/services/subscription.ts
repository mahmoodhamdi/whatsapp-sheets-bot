import { prisma } from "@/lib/prisma";
import {
  Subscription,
  SubscriptionStatus,
  Plan,
  BillingInterval,
} from "@prisma/client";
import { getFreePlan } from "./plan";

export type SubscriptionWithPlan = Subscription & { plan: Plan };

/**
 * Get user's subscription with plan details
 */
export async function getUserSubscription(
  userId: string
): Promise<SubscriptionWithPlan | null> {
  return prisma.subscription.findUnique({
    where: { userId },
    include: { plan: true },
  });
}

/**
 * Create a free subscription for a new user
 */
export async function createFreeSubscription(
  userId: string
): Promise<Subscription> {
  const freePlan = await getFreePlan();
  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  return prisma.subscription.create({
    data: {
      userId,
      planId: freePlan.id,
      status: "ACTIVE",
      billingInterval: "MONTHLY",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    },
  });
}

/**
 * Update subscription status
 */
export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: SubscriptionStatus
): Promise<Subscription> {
  return prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status },
  });
}

/**
 * Update subscription with Stripe data
 */
export async function updateSubscriptionFromStripe(
  userId: string,
  data: {
    stripeSubscriptionId: string;
    stripePriceId: string;
    planId: string;
    status: SubscriptionStatus;
    billingInterval: BillingInterval;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd?: boolean;
    trialEndsAt?: Date;
  }
): Promise<Subscription> {
  return prisma.subscription.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscriptionAtPeriodEnd(
  userId: string
): Promise<Subscription> {
  return prisma.subscription.update({
    where: { userId },
    data: {
      cancelAtPeriodEnd: true,
      canceledAt: new Date(),
    },
  });
}

/**
 * Reactivate a canceled subscription
 */
export async function reactivateSubscription(
  userId: string
): Promise<Subscription> {
  return prisma.subscription.update({
    where: { userId },
    data: {
      cancelAtPeriodEnd: false,
      canceledAt: null,
    },
  });
}

/**
 * Check if user has an active subscription
 */
export async function isSubscriptionActive(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) return false;

  const activeStatuses: SubscriptionStatus[] = ["ACTIVE", "TRIALING"];
  return activeStatuses.includes(subscription.status);
}

/**
 * Get subscription limits for a user
 */
export async function getSubscriptionLimits(userId: string): Promise<{
  messagesPerMonth: number;
  rulesLimit: number;
  isUnlimitedMessages: boolean;
  isUnlimitedRules: boolean;
}> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    const freePlan = await getFreePlan();
    return {
      messagesPerMonth: freePlan.messagesPerMonth,
      rulesLimit: freePlan.rulesLimit,
      isUnlimitedMessages: freePlan.messagesPerMonth === -1,
      isUnlimitedRules: freePlan.rulesLimit === -1,
    };
  }

  return {
    messagesPerMonth: subscription.plan.messagesPerMonth,
    rulesLimit: subscription.plan.rulesLimit,
    isUnlimitedMessages: subscription.plan.messagesPerMonth === -1,
    isUnlimitedRules: subscription.plan.rulesLimit === -1,
  };
}

/**
 * Check if user has a specific feature
 */
export async function userHasFeature(
  userId: string,
  feature: string
): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    const freePlan = await getFreePlan();
    const features = freePlan.features as string[];
    return features.includes(feature);
  }

  const features = subscription.plan.features as string[];
  return features.includes(feature);
}

/**
 * Get subscription by Stripe subscription ID
 */
export async function getSubscriptionByStripeId(
  stripeSubscriptionId: string
): Promise<SubscriptionWithPlan | null> {
  return prisma.subscription.findUnique({
    where: { stripeSubscriptionId },
    include: { plan: true },
  });
}

/**
 * Delete subscription (for downgrade to free)
 */
export async function deleteSubscription(userId: string): Promise<void> {
  await prisma.subscription.delete({
    where: { userId },
  });
}
