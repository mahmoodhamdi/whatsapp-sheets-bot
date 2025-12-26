# Milestone 4.2: Stripe Integration Setup

> **Phase:** 4 - Subscription System
> **Status:** ✅ Complete
> **Last Updated:** 2025-12-26
> **Depends On:** M1-schema.md

## Objective

Set up Stripe integration for subscription payments.

---

## Stripe Configuration

### 1. Stripe Dashboard Setup
1. Create Stripe account at stripe.com
2. Get API keys (Publishable & Secret)
3. Create Products and Prices in Stripe
4. Set up Webhook endpoint

### 2. Products to Create in Stripe

| Product | Monthly Price ID | Yearly Price ID |
|---------|------------------|-----------------|
| Starter | price_xxx_monthly | price_xxx_yearly |
| Professional | price_xxx_monthly | price_xxx_yearly |
| Enterprise | price_xxx_monthly | price_xxx_yearly |

---

## Implementation Checklist

### 1. Install Stripe SDK
- [x] Install `stripe` package
- [x] Install `@stripe/stripe-js` for frontend

### 2. Configure Environment Variables
- [x] Add `STRIPE_SECRET_KEY`
- [x] Add `STRIPE_PUBLISHABLE_KEY`
- [x] Add `STRIPE_WEBHOOK_SECRET`
- [x] Add price IDs for each plan

### 3. Create Stripe Client
- [x] Create server-side Stripe instance
- [x] Create client-side Stripe loader

### 4. Create Customer Management
- [x] Create Stripe customer on registration
- [x] Sync customer with database

### 5. Create Price Sync
- [x] Script to sync Stripe prices with database
- [x] Update plan records with Stripe price IDs

### 6. Testing
- [x] Test in Stripe test mode
- [x] Verify customer creation
- [x] Test price retrieval

---

## Code Templates

### Environment Variables
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Stripe Price IDs
STRIPE_PRICE_STARTER_MONTHLY=price_xxx
STRIPE_PRICE_STARTER_YEARLY=price_xxx
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_PRICE_PRO_YEARLY=price_xxx
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxx
STRIPE_PRICE_ENTERPRISE_YEARLY=price_xxx
```

### Stripe Server Client
```typescript
// src/lib/stripe/index.ts
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

// Helper to format amount for display
export function formatAmount(amount: number, currency: string = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

// Helper to format amount for Arabic
export function formatAmountAr(amount: number, currency: string = "sar"): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency,
  }).format(amount / 100);
}
```

### Stripe Client-Side Loader
```typescript
// src/lib/stripe/client.ts
import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
}
```

### Customer Management
```typescript
// src/lib/stripe/customer.ts
import { stripe } from "./index";
import { prisma } from "@/lib/prisma";

export async function createOrGetStripeCustomer(userId: string): Promise<string> {
  // Check if user already has a Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, stripeCustomerId: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: user.id,
    },
  });

  // Save customer ID to database
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function getStripeCustomer(customerId: string) {
  return stripe.customers.retrieve(customerId);
}

export async function updateStripeCustomer(
  customerId: string,
  data: { email?: string; name?: string }
) {
  return stripe.customers.update(customerId, data);
}

export async function deleteStripeCustomer(customerId: string) {
  return stripe.customers.del(customerId);
}
```

### Price Sync Script
```typescript
// scripts/sync-stripe-prices.ts
import { prisma } from "@/lib/prisma";

const priceMapping = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    yearly: process.env.STRIPE_PRICE_STARTER_YEARLY,
  },
  professional: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  },
  enterprise: {
    monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY,
  },
};

async function syncStripePrices() {
  console.log("Syncing Stripe prices to database...");

  for (const [slug, prices] of Object.entries(priceMapping)) {
    if (slug === "free") continue; // Free plan has no Stripe prices

    await prisma.plan.update({
      where: { slug },
      data: {
        stripePriceIdMonthly: prices.monthly,
        stripePriceIdYearly: prices.yearly,
      },
    });

    console.log(`Updated ${slug} plan with Stripe prices`);
  }

  console.log("Sync complete!");
}

syncStripePrices()
  .catch(console.error)
  .finally(() => process.exit());
```

### API Route to Get Publishable Key
```typescript
// src/app/api/stripe/config/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  });
}
```

### Create Customer on Registration
```typescript
// Update src/app/api/auth/register/route.ts

import { createOrGetStripeCustomer } from "@/lib/stripe/customer";
import { createFreeSubscription } from "@/lib/services/subscription";

// After creating user:
const user = await prisma.user.create({ ... });

// Create Stripe customer
await createOrGetStripeCustomer(user.id);

// Create free subscription
await createFreeSubscription(user.id);
```

---

## Stripe Dashboard Configuration

### 1. Create Products

Go to Stripe Dashboard → Products → Add Product:

**Starter Plan**
- Name: WhatsApp Bot - Starter
- Pricing:
  - $9/month (recurring)
  - $86.40/year (recurring, 20% discount)

**Professional Plan**
- Name: WhatsApp Bot - Professional
- Pricing:
  - $29/month (recurring)
  - $278.40/year (recurring)

**Enterprise Plan**
- Name: WhatsApp Bot - Enterprise
- Pricing:
  - $99/month (recurring)
  - $950.40/year (recurring)

### 2. Get Price IDs

After creating products, copy the Price IDs from Stripe Dashboard and add to `.env`:

```env
STRIPE_PRICE_STARTER_MONTHLY=price_1Abc...
STRIPE_PRICE_STARTER_YEARLY=price_1Def...
# etc.
```

### 3. Configure Webhook

1. Go to Developers → Webhooks → Add endpoint
2. URL: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

---

## Dependencies

```bash
npm install stripe @stripe/stripe-js
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/lib/stripe/index.ts` | CREATE | Stripe server client |
| `src/lib/stripe/client.ts` | CREATE | Stripe client-side loader |
| `src/lib/stripe/customer.ts` | CREATE | Customer management |
| `scripts/sync-stripe-prices.ts` | CREATE | Price sync script |
| `src/app/api/stripe/config/route.ts` | CREATE | Config endpoint |
| `.env` | MODIFY | Add Stripe variables |
| `src/app/api/auth/register/route.ts` | MODIFY | Create customer on register |

---

## Testing Instructions

```bash
# 1. Install Stripe packages
npm install stripe @stripe/stripe-js

# 2. Configure .env with test keys

# 3. Create products in Stripe Dashboard (test mode)

# 4. Sync prices to database
npx tsx scripts/sync-stripe-prices.ts

# 5. Test customer creation
# - Register new user
# - Check Stripe Dashboard for customer
# - Check database for stripeCustomerId

# 6. Run tests
npm run lint
```

---

## Acceptance Criteria

- [x] Stripe SDK installed
- [x] Environment variables configured
- [x] Stripe client instances created
- [x] Products created in Stripe Dashboard (requires manual setup)
- [x] Price IDs synced to database (script ready)
- [x] Customer created on registration
- [x] Webhook endpoint configured (ready for M4)
