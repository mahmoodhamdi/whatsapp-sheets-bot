import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

/**
 * Stripe Webhook Handler
 * Handles subscription lifecycle events from Stripe
 */
export async function POST(request: Request) {
  // Check if Stripe is configured
  if (!isStripeConfigured()) {
    console.warn("Stripe webhook received but Stripe is not configured");
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  const stripe = getStripe();

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Log the webhook event
  const webhookLog = await prisma.webhookEvent.create({
    data: {
      stripeEventId: event.id,
      eventType: event.type,
      payload: event.data.object as object,
    },
  });

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark event as processed
    await prisma.webhookEvent.update({
      where: { id: webhookLog.id },
      data: { processed: true },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);

    // Log the error
    await prisma.webhookEvent.update({
      where: { id: webhookLog.id },
      data: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

/**
 * Handle checkout.session.completed
 * Creates or updates subscription after successful checkout
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planSlug = session.metadata?.planSlug;

  if (!userId || !planSlug) {
    console.warn("Checkout session missing userId or planSlug metadata");
    return;
  }

  const plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
  if (!plan) {
    console.error(`Plan not found: ${planSlug}`);
    return;
  }

  if (!session.subscription) {
    console.warn("Checkout session has no subscription");
    return;
  }

  const stripe = getStripe();
  const stripeSubscription = (await stripe.subscriptions.retrieve(
    session.subscription as string
  )) as Stripe.Subscription;

  const priceItem = stripeSubscription.items.data[0];
  const billingInterval =
    priceItem.price.recurring?.interval === "year" ? "YEARLY" : "MONTHLY";

  // In Stripe SDK v20+, current_period fields are on SubscriptionItem
  const periodStart = new Date(priceItem.current_period_start * 1000);
  const periodEnd = new Date(priceItem.current_period_end * 1000);

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      planId: plan.id,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: priceItem.price.id,
      status: "ACTIVE",
      billingInterval,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
    update: {
      planId: plan.id,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: priceItem.price.id,
      status: "ACTIVE",
      billingInterval,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      canceledAt: null,
    },
  });

  console.log(`Subscription activated for user ${userId} on plan ${planSlug}`);
}

/**
 * Handle customer.subscription.created and customer.subscription.updated
 * Syncs subscription status changes
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    console.warn(`Subscription not found in DB: ${subscription.id}`);
    return;
  }

  const statusMap: Record<
    string,
    "ACTIVE" | "PAST_DUE" | "CANCELED" | "UNPAID" | "INCOMPLETE" | "TRIALING"
  > = {
    active: "ACTIVE",
    past_due: "PAST_DUE",
    canceled: "CANCELED",
    unpaid: "UNPAID",
    incomplete: "INCOMPLETE",
    incomplete_expired: "CANCELED",
    trialing: "TRIALING",
    paused: "PAST_DUE",
  };

  // In Stripe SDK v20+, current_period fields are on SubscriptionItem
  const subscriptionItem = subscription.items.data[0];
  const periodStart = new Date(subscriptionItem.current_period_start * 1000);
  const periodEnd = new Date(subscriptionItem.current_period_end * 1000);

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: statusMap[subscription.status] || "ACTIVE",
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log(
    `Subscription ${subscription.id} updated to status: ${subscription.status}`
  );
}

/**
 * Handle customer.subscription.deleted
 * Marks subscription as canceled
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const result = await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
    },
  });

  if (result.count > 0) {
    console.log(`Subscription ${subscription.id} canceled`);
  } else {
    console.warn(`Subscription not found for deletion: ${subscription.id}`);
  }
}

/**
 * Handle invoice.paid
 * Updates subscription period dates after successful payment
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // In Stripe SDK v20+, subscription is accessed via parent.subscription_details
  const subscriptionId =
    typeof invoice.parent?.subscription_details?.subscription === "string"
      ? invoice.parent.subscription_details.subscription
      : invoice.parent?.subscription_details?.subscription?.id;

  if (!subscriptionId) {
    return;
  }

  const stripe = getStripe();
  const subscription = (await stripe.subscriptions.retrieve(
    subscriptionId
  )) as Stripe.Subscription;

  // In Stripe SDK v20+, current_period fields are on SubscriptionItem
  const subscriptionItem = subscription.items.data[0];
  const periodStart = new Date(subscriptionItem.current_period_start * 1000);
  const periodEnd = new Date(subscriptionItem.current_period_end * 1000);

  const result = await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "ACTIVE",
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
  });

  if (result.count > 0) {
    console.log(`Invoice paid for subscription ${subscription.id}`);
  }
}

/**
 * Handle invoice.payment_failed
 * Marks subscription as past due
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // In Stripe SDK v20+, subscription is accessed via parent.subscription_details
  const subscriptionId =
    typeof invoice.parent?.subscription_details?.subscription === "string"
      ? invoice.parent.subscription_details.subscription
      : invoice.parent?.subscription_details?.subscription?.id;

  if (!subscriptionId) {
    return;
  }

  const result = await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: "PAST_DUE" },
  });

  if (result.count > 0) {
    console.log(
      `Payment failed for subscription ${subscriptionId}, marked as PAST_DUE`
    );
  }
}
