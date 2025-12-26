import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/subscription/resume
 * Resume a subscription that was scheduled for cancellation
 */
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 400 }
      );
    }

    // Check if subscription is scheduled for cancellation
    if (!subscription.cancelAtPeriodEnd) {
      return NextResponse.json(
        { error: "Subscription is not scheduled for cancellation" },
        { status: 400 }
      );
    }

    // Check if subscription is already canceled
    if (subscription.status === "CANCELED") {
      return NextResponse.json(
        { error: "Subscription is already canceled. Please resubscribe." },
        { status: 400 }
      );
    }

    // Resume on Stripe if configured
    if (subscription.stripeSubscriptionId && isStripeConfigured()) {
      const stripe = getStripe();
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: false,
      });
    }

    // Update local subscription record
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: false,
        canceledAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription has been resumed",
    });
  } catch (error) {
    console.error("Resume subscription error:", error);
    return NextResponse.json(
      { error: "Failed to resume subscription" },
      { status: 500 }
    );
  }
}
