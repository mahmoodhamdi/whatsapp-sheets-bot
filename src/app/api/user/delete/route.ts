import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user with subscription
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cancel Stripe subscription if exists
    if (user.subscription?.stripeSubscriptionId && stripe) {
      try {
        await stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId);
      } catch (stripeError) {
        console.error("Failed to cancel Stripe subscription:", stripeError);
        // Continue with account deletion even if Stripe cancellation fails
      }
    }

    // Delete Stripe customer if exists
    if (user.stripeCustomerId && stripe) {
      try {
        await stripe.customers.del(user.stripeCustomerId);
      } catch (stripeError) {
        console.error("Failed to delete Stripe customer:", stripeError);
        // Continue with account deletion even if Stripe customer deletion fails
      }
    }

    // Delete user (cascades to related data due to Prisma schema)
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
