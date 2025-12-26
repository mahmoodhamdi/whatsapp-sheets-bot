# Milestone 4.4: Stripe Webhook Handlers

> **Phase:** 4 - Subscription System
> **Status:** ✅ Completed
> **Last Updated:** 2025-12-26
> **Depends On:** M3-checkout.md

## Objective

Handle Stripe webhooks to sync subscription status with database.

---

## Webhook Events to Handle

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create/update subscription |
| `customer.subscription.created` | Sync subscription to DB |
| `customer.subscription.updated` | Update subscription status |
| `customer.subscription.deleted` | Mark subscription canceled |
| `invoice.paid` | Update period dates |
| `invoice.payment_failed` | Mark as past_due |

---

## Implementation Checklist

- [x] Create webhook endpoint
- [x] Verify webhook signature
- [x] Handle each event type
- [x] Update subscription records
- [x] Log webhook events (WebhookEvent model)
- [x] Test with Stripe CLI (unit tests)

---

## Code Template

### Webhook Handler
```typescript
// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planSlug = session.metadata?.planSlug;

  if (!userId || !planSlug) return;

  const plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
  if (!plan) return;

  const stripeSubscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      planId: plan.id,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0].price.id,
      status: "ACTIVE",
      billingInterval: stripeSubscription.items.data[0].price.recurring?.interval === "year" ? "YEARLY" : "MONTHLY",
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    },
    update: {
      planId: plan.id,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0].price.id,
      status: "ACTIVE",
      billingInterval: stripeSubscription.items.data[0].price.recurring?.interval === "year" ? "YEARLY" : "MONTHLY",
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: false,
      canceledAt: null,
    },
  });
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) return;

  const statusMap: Record<string, "ACTIVE" | "PAST_DUE" | "CANCELED" | "UNPAID" | "INCOMPLETE" | "TRIALING"> = {
    active: "ACTIVE",
    past_due: "PAST_DUE",
    canceled: "CANCELED",
    unpaid: "UNPAID",
    incomplete: "INCOMPLETE",
    trialing: "TRIALING",
  };

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: statusMap[subscription.status] || "ACTIVE",
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
    },
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "ACTIVE",
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: invoice.subscription as string },
    data: { status: "PAST_DUE" },
  });
}
```

---

## Testing with Stripe CLI

```bash
# Install Stripe CLI
# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

---

## Acceptance Criteria

- [x] Webhook signature verified
- [x] Checkout completion creates subscription
- [x] Subscription updates synced
- [x] Cancellation handled
- [x] Payment failures tracked
- [x] All events logged
