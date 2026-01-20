import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCurrentUsage, getUsageHistory } from "@/lib/services/usage";
import { getSubscriptionLimits } from "@/lib/services/subscription";
import { withCacheHeaders, cacheConfigs } from "@/lib/api/cache";

/**
 * GET /api/usage
 * Get current user's usage details and history
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [usage, limits, history] = await Promise.all([
      getCurrentUsage(userId),
      getSubscriptionLimits(userId),
      getUsageHistory(userId, 6),
    ]);

    // Calculate percentages and status
    const messagesPercent = limits.isUnlimitedMessages
      ? 0
      : Math.min(100, (usage.messagesCount / limits.messagesPerMonth) * 100);
    const rulesPercent = limits.isUnlimitedRules
      ? 0
      : Math.min(100, (usage.rulesCount / limits.rulesLimit) * 100);

    const messagesRemaining = limits.isUnlimitedMessages
      ? -1
      : Math.max(0, limits.messagesPerMonth - usage.messagesCount);
    const rulesRemaining = limits.isUnlimitedRules
      ? -1
      : Math.max(0, limits.rulesLimit - usage.rulesCount);

    return withCacheHeaders(
      {
        current: {
          messagesUsed: usage.messagesCount,
          messagesLimit: limits.messagesPerMonth,
          messagesPercent: Math.round(messagesPercent),
          messagesRemaining,
          isUnlimitedMessages: limits.isUnlimitedMessages,
          rulesUsed: usage.rulesCount,
          rulesLimit: limits.rulesLimit,
          rulesPercent: Math.round(rulesPercent),
          rulesRemaining,
          isUnlimitedRules: limits.isUnlimitedRules,
          periodStart: usage.periodStart,
          periodEnd: usage.periodEnd,
        },
        warnings: {
          nearMessageLimit: messagesPercent >= 80 && messagesPercent < 100,
          atMessageLimit: messagesPercent >= 100,
          nearRuleLimit: rulesPercent >= 80 && rulesPercent < 100,
          atRuleLimit: rulesPercent >= 100,
        },
        history: history.map((record) => ({
          periodStart: record.periodStart,
          periodEnd: record.periodEnd,
          messagesCount: record.messagesCount,
          rulesCount: record.rulesCount,
        })),
      },
      cacheConfigs.short
    );
  } catch (error) {
    console.error("Get usage error:", error);
    return NextResponse.json({ error: "Failed to get usage" }, { status: 500 });
  }
}
