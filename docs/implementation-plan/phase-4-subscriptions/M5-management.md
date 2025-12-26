# Milestone 4.5: Subscription Management

> **Phase:** 4 - Subscription System
> **Status:** ✅ Completed
> **Last Updated:** 2025-12-26
> **Depends On:** M4-webhooks.md

## Objective

Create APIs and utilities for managing subscriptions (upgrade, downgrade, cancel).

---

## Implementation Checklist

- [x] Get subscription status API
- [x] Upgrade/downgrade subscription API
- [x] Cancel subscription API
- [x] Resume canceled subscription API
- [x] Update payment method (Stripe Billing Portal)

---

## Code Templates

### Subscription Status API
```typescript
// src/app/api/subscription/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserSubscription } from "@/lib/services/subscription";
import { getCurrentUsage } from "@/lib/services/usage";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getUserSubscription(session.user.id);
  const usage = await getCurrentUsage(session.user.id);

  return NextResponse.json({
    subscription: subscription ? {
      id: subscription.id,
      plan: subscription.plan,
      status: subscription.status,
      billingInterval: subscription.billingInterval,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    } : null,
    usage: {
      messagesCount: usage.messagesCount,
      rulesCount: usage.rulesCount,
      limits: {
        messagesPerMonth: subscription?.plan.messagesPerMonth ?? 50,
        rulesLimit: subscription?.plan.rulesLimit ?? 1,
      },
    },
  });
}
```

### Change Plan API
```typescript
// src/app/api/subscription/change-plan/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const changePlanSchema = z.object({
  planSlug: z.string(),
  billingInterval: z.enum(["monthly", "yearly"]),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { planSlug, billingInterval } = changePlanSchema.parse(body);

  // Get current subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    include: { plan: true },
  });

  if (!subscription?.stripeSubscriptionId) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  // Get new plan
  const newPlan = await prisma.plan.findUnique({ where: { slug: planSlug } });
  if (!newPlan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const newPriceId = billingInterval === "yearly"
    ? newPlan.stripePriceIdYearly
    : newPlan.stripePriceIdMonthly;

  if (!newPriceId) {
    return NextResponse.json({ error: "Price not configured" }, { status: 500 });
  }

  // Get Stripe subscription
  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripeSubscriptionId
  );

  // Update subscription
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    items: [{
      id: stripeSubscription.items.data[0].id,
      price: newPriceId,
    }],
    proration_behavior: "create_prorations",
  });

  return NextResponse.json({ success: true });
}
```

### Cancel Subscription API
```typescript
// src/app/api/subscription/cancel/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.stripeSubscriptionId) {
    return NextResponse.json({ error: "No subscription" }, { status: 400 });
  }

  // Cancel at period end (not immediately)
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { cancelAtPeriodEnd: true },
  });

  return NextResponse.json({ success: true });
}
```

### Resume Subscription API
```typescript
// src/app/api/subscription/resume/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.stripeSubscriptionId) {
    return NextResponse.json({ error: "No subscription" }, { status: 400 });
  }

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: false,
  });

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { cancelAtPeriodEnd: false },
  });

  return NextResponse.json({ success: true });
}
```

---

## Acceptance Criteria

- [x] Get subscription status works
- [x] Plan upgrade works with proration
- [x] Plan downgrade works
- [x] Cancel at period end works
- [x] Resume canceled subscription works
