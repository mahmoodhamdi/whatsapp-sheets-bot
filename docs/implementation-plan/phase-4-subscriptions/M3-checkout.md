# Milestone 4.3: Checkout Flow

> **Phase:** 4 - Subscription System
> **Status:** ✅ Completed
> **Last Updated:** 2025-12-26
> **Depends On:** M2-stripe-setup.md

## Objective

Implement Stripe Checkout for subscription purchases.

---

## Flow

1. User selects plan on pricing page
2. Backend creates Stripe Checkout session
3. User redirected to Stripe Checkout
4. Payment processed
5. Webhook updates subscription
6. User redirected to success page

---

## Implementation Checklist

- [x] Create Checkout Session API
- [x] Create checkout success page (via query params)
- [x] Create checkout cancel page (via query params)
- [x] Integrate with pricing page
- [x] Handle free plan separately
- [x] Test complete flow

---

## Code Templates

### Create Checkout Session API
```typescript
// src/app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { createOrGetStripeCustomer } from "@/lib/stripe/customer";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const checkoutSchema = z.object({
  planSlug: z.string(),
  billingInterval: z.enum(["monthly", "yearly"]),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planSlug, billingInterval } = checkoutSchema.parse(body);

    // Get plan
    const plan = await prisma.plan.findUnique({
      where: { slug: planSlug },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Free plan doesn't need checkout
    if (plan.slug === "free") {
      return NextResponse.json({ error: "Free plan doesn't require payment" }, { status: 400 });
    }

    // Get price ID
    const priceId = billingInterval === "yearly"
      ? plan.stripePriceIdYearly
      : plan.stripePriceIdMonthly;

    if (!priceId) {
      return NextResponse.json({ error: "Price not configured" }, { status: 500 });
    }

    // Get or create Stripe customer
    const customerId = await createOrGetStripeCustomer(session.user.id);

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/settings/billing?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planSlug: plan.slug,
        },
      },
      metadata: {
        userId: session.user.id,
        planSlug: plan.slug,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
```

### Pricing Page with Checkout
```typescript
// src/app/(marketing)/pricing/page.tsx
import { getTranslations } from "next-intl/server";
import { PricingSection } from "@/components/marketing/sections/PricingSection";

export default async function PricingPage() {
  const t = await getTranslations("pricing");

  return (
    <div className="pt-20">
      <PricingSection />
    </div>
  );
}
```

### Checkout Button Component
```typescript
// src/components/subscription/CheckoutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CheckoutButtonProps {
  planSlug: string;
  billingInterval: "monthly" | "yearly";
  children: React.ReactNode;
  className?: string;
}

export function CheckoutButton({
  planSlug,
  billingInterval,
  children,
  className,
}: CheckoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug, billingInterval }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="me-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
```

### Updated PricingCard
```typescript
// Update src/components/marketing/PricingCard.tsx to use CheckoutButton
import { CheckoutButton } from "@/components/subscription/CheckoutButton";

// In PricingCard component, replace Button with:
{plan.slug === "free" ? (
  <Button className="w-full" asChild>
    <Link href="/register">{cta}</Link>
  </Button>
) : plan.slug === "enterprise" ? (
  <Button className="w-full" variant="outline" asChild>
    <Link href="/contact">{cta}</Link>
  </Button>
) : (
  <CheckoutButton
    planSlug={plan.slug}
    billingInterval={isYearly ? "yearly" : "monthly"}
    className="w-full"
  >
    {cta}
  </CheckoutButton>
)}
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/app/api/stripe/checkout/route.ts` | CREATE |
| `src/components/subscription/CheckoutButton.tsx` | CREATE |
| `src/components/marketing/PricingCard.tsx` | MODIFY |
| `src/app/(marketing)/pricing/page.tsx` | MODIFY |

---

## Acceptance Criteria

- [x] Checkout session created successfully
- [x] User redirected to Stripe Checkout
- [x] Success/cancel URLs work
- [x] Free plan handled separately
- [x] Enterprise shows contact button
- [x] Loading states work
