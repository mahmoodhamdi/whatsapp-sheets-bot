import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserSubscription } from "@/lib/services/subscription";
import { getCurrentUsage } from "@/lib/services/usage";

/**
 * GET /api/subscription
 * Get current user's subscription status and usage
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getUserSubscription(session.user.id);
    const usage = await getCurrentUsage(session.user.id);

    return NextResponse.json({
      subscription: subscription
        ? {
            id: subscription.id,
            plan: {
              id: subscription.plan.id,
              name: subscription.plan.name,
              slug: subscription.plan.slug,
              messagesPerMonth: subscription.plan.messagesPerMonth,
              rulesLimit: subscription.plan.rulesLimit,
              features: subscription.plan.features,
            },
            status: subscription.status,
            billingInterval: subscription.billingInterval,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            canceledAt: subscription.canceledAt,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
          }
        : null,
      usage: {
        messagesCount: usage.messagesCount,
        rulesCount: usage.rulesCount,
        periodStart: usage.periodStart,
        periodEnd: usage.periodEnd,
        limits: {
          messagesPerMonth: subscription?.plan.messagesPerMonth ?? 50,
          rulesLimit: subscription?.plan.rulesLimit ?? 1,
          isUnlimitedMessages:
            (subscription?.plan.messagesPerMonth ?? 50) === -1,
          isUnlimitedRules: (subscription?.plan.rulesLimit ?? 1) === -1,
        },
      },
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    return NextResponse.json(
      { error: "Failed to get subscription" },
      { status: 500 }
    );
  }
}
