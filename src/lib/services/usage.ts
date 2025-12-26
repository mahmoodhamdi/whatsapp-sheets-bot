import { prisma } from "@/lib/prisma";
import { UsageRecord } from "@prisma/client";
import { getUserSubscription, getSubscriptionLimits } from "./subscription";

export interface UsageData {
  messagesCount: number;
  rulesCount: number;
  periodStart: Date;
  periodEnd: Date;
}

/**
 * Get or create usage record for current period
 */
export async function getCurrentUsage(userId: string): Promise<UsageData> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    // No subscription - return zero usage
    const now = new Date();
    return {
      messagesCount: 0,
      rulesCount: 0,
      periodStart: now,
      periodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    };
  }

  const periodStart = subscription.currentPeriodStart || new Date();
  const periodEnd =
    subscription.currentPeriodEnd ||
    new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

  let usage = await prisma.usageRecord.findUnique({
    where: {
      subscriptionId_periodStart: {
        subscriptionId: subscription.id,
        periodStart,
      },
    },
  });

  if (!usage) {
    // Create new usage record for this period
    usage = await prisma.usageRecord.create({
      data: {
        subscriptionId: subscription.id,
        periodStart,
        periodEnd,
        messagesCount: 0,
        rulesCount: 0,
      },
    });
  }

  return {
    messagesCount: usage.messagesCount,
    rulesCount: usage.rulesCount,
    periodStart: usage.periodStart,
    periodEnd: usage.periodEnd,
  };
}

/**
 * Increment message count for user
 */
export async function incrementMessageCount(userId: string): Promise<void> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return;

  const periodStart = subscription.currentPeriodStart || new Date();
  const periodEnd =
    subscription.currentPeriodEnd ||
    new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

  await prisma.usageRecord.upsert({
    where: {
      subscriptionId_periodStart: {
        subscriptionId: subscription.id,
        periodStart,
      },
    },
    update: {
      messagesCount: { increment: 1 },
    },
    create: {
      subscriptionId: subscription.id,
      periodStart,
      periodEnd,
      messagesCount: 1,
      rulesCount: 0,
    },
  });
}

/**
 * Check if user can send a message (within limits)
 */
export async function canSendMessage(userId: string): Promise<boolean> {
  const limits = await getSubscriptionLimits(userId);

  // -1 means unlimited
  if (limits.isUnlimitedMessages) return true;

  const usage = await getCurrentUsage(userId);
  return usage.messagesCount < limits.messagesPerMonth;
}

/**
 * Check if user can create a new rule (within limits)
 */
export async function canCreateRule(userId: string): Promise<boolean> {
  const limits = await getSubscriptionLimits(userId);

  // -1 means unlimited
  if (limits.isUnlimitedRules) return true;

  // Count existing rules
  // Note: In a multi-tenant setup, rules would be associated with users
  // For now, we count all rules in the system
  const rulesCount = await prisma.autoReplyRule.count();

  return rulesCount < limits.rulesLimit;
}

/**
 * Get usage percentage for messages
 */
export async function getMessageUsagePercentage(
  userId: string
): Promise<number> {
  const limits = await getSubscriptionLimits(userId);

  if (limits.isUnlimitedMessages) return 0;

  const usage = await getCurrentUsage(userId);
  return Math.round((usage.messagesCount / limits.messagesPerMonth) * 100);
}

/**
 * Get remaining messages for current period
 */
export async function getRemainingMessages(userId: string): Promise<number> {
  const limits = await getSubscriptionLimits(userId);

  if (limits.isUnlimitedMessages) return -1;

  const usage = await getCurrentUsage(userId);
  return Math.max(0, limits.messagesPerMonth - usage.messagesCount);
}

/**
 * Reset usage for a new billing period
 */
export async function resetUsageForPeriod(
  subscriptionId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<UsageRecord> {
  return prisma.usageRecord.create({
    data: {
      subscriptionId,
      periodStart,
      periodEnd,
      messagesCount: 0,
      rulesCount: 0,
    },
  });
}

/**
 * Get usage history for a subscription
 */
export async function getUsageHistory(
  userId: string,
  limit: number = 12
): Promise<UsageRecord[]> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return [];

  return prisma.usageRecord.findMany({
    where: { subscriptionId: subscription.id },
    orderBy: { periodStart: "desc" },
    take: limit,
  });
}
