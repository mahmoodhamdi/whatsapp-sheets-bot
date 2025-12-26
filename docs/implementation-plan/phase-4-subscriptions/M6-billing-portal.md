# Milestone 4.6: Billing Portal

> **Phase:** 4 - Subscription System
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26
> **Depends On:** M5-management.md

## Objective

Create billing settings page with Stripe Customer Portal integration.

---

## Implementation Checklist

- [ ] Create billing settings page
- [ ] Show current plan & usage
- [ ] Create Customer Portal session API
- [ ] Show billing history
- [ ] Upgrade prompts

---

## Code Templates

### Customer Portal API
```typescript
// src/app/api/stripe/portal/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No customer" }, { status: 400 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard/settings/billing`,
  });

  return NextResponse.json({ url: portalSession.url });
}
```

### Billing Settings Page
```typescript
// src/app/(dashboard)/dashboard/settings/billing/page.tsx
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getUserSubscription } from "@/lib/services/subscription";
import { getCurrentUsage } from "@/lib/services/usage";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const t = await getTranslations("subscription.billing");
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const subscription = await getUserSubscription(session.user.id);
  const usage = await getCurrentUsage(session.user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <BillingSettings
        subscription={subscription}
        usage={usage}
      />
    </div>
  );
}
```

### BillingSettings Component
```typescript
// src/components/settings/BillingSettings.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";

export function BillingSettings({ subscription, usage }) {
  const t = useTranslations("subscription.billing");
  const [isLoading, setIsLoading] = useState(false);

  const openPortal = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setIsLoading(false);
    }
  };

  const messagesUsed = usage.messagesCount;
  const messagesLimit = subscription?.plan.messagesPerMonth ?? 50;
  const messagesPercent = messagesLimit === -1 ? 0 : (messagesUsed / messagesLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t("currentPlan")}
            <Badge variant={subscription?.status === "ACTIVE" ? "default" : "secondary"}>
              {subscription?.status ?? "FREE"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">{subscription?.plan.name ?? "Free"}</span>
            {subscription?.currentPeriodEnd && (
              <span className="text-muted-foreground">
                {t("renewsOn", { date: new Date(subscription.currentPeriodEnd).toLocaleDateString() })}
              </span>
            )}
          </div>

          {subscription?.cancelAtPeriodEnd && (
            <p className="text-destructive">{t("canceledNotice")}</p>
          )}
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle>{t("usage")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{t("messages")}</span>
              <span>{messagesLimit === -1 ? "Unlimited" : `${messagesUsed} / ${messagesLimit}`}</span>
            </div>
            {messagesLimit !== -1 && <Progress value={messagesPercent} />}
          </div>
        </CardContent>
      </Card>

      {/* Manage Billing */}
      <Card>
        <CardHeader>
          <CardTitle>{t("manageBilling")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={openPortal} disabled={isLoading}>
            {isLoading ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <CreditCard className="me-2 h-4 w-4" />}
            {t("openPortal")}
            <ExternalLink className="ms-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Configure Stripe Customer Portal

In Stripe Dashboard → Settings → Billing → Customer Portal:
- Enable subscription cancellation
- Enable plan switching
- Enable payment method updates
- Set return URL

---

## Acceptance Criteria

- [ ] Billing page shows current plan
- [ ] Usage displayed with progress bars
- [ ] Customer Portal opens correctly
- [ ] Can update payment method via portal
- [ ] Can view invoices via portal
- [ ] Cancel notice shown if applicable

---

## Phase 4 Completion

- [ ] M1: Schema ✅
- [ ] M2: Stripe Setup ✅
- [ ] M3: Checkout ✅
- [ ] M4: Webhooks ✅
- [ ] M5: Management ✅
- [ ] M6: Billing Portal ✅

**Update MASTER_PLAN.md!**
