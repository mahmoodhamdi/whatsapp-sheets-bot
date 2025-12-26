import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import Stripe from "stripe";

const changePlanSchema = z.object({
  planSlug: z.string(),
  billingInterval: z.enum(["monthly", "yearly"]),
});

/**
 * POST /api/subscription/change-plan
 * Upgrade or downgrade subscription to a different plan
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { planSlug, billingInterval } = changePlanSchema.parse(body);

    // Get current subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      include: { plan: true },
    });

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Get new plan
    const newPlan = await prisma.plan.findUnique({
      where: { slug: planSlug },
    });

    if (!newPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Cannot change to free plan via this API
    if (newPlan.slug === "free") {
      return NextResponse.json(
        { error: "Use cancel endpoint to downgrade to free plan" },
        { status: 400 }
      );
    }

    // Get new price ID
    const newPriceId =
      billingInterval === "yearly"
        ? newPlan.stripePriceIdYearly
        : newPlan.stripePriceIdMonthly;

    if (!newPriceId) {
      return NextResponse.json(
        { error: "Price not configured for this plan" },
        { status: 500 }
      );
    }

    const stripe = getStripe();

    // Get Stripe subscription
    const stripeSubscription = (await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    )) as Stripe.Subscription;

    // Update subscription with new price
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: "create_prorations",
    });

    // Update local subscription record
    const newBillingInterval = billingInterval === "yearly" ? "YEARLY" : "MONTHLY";
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        planId: newPlan.id,
        stripePriceId: newPriceId,
        billingInterval: newBillingInterval,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Subscription changed to ${newPlan.name}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Change plan error:", error);
    return NextResponse.json(
      { error: "Failed to change plan" },
      { status: 500 }
    );
  }
}
