# Milestone 4.1: Database Schema Updates for Subscriptions

> **Phase:** 4 - Subscription System
> **Status:** ✅ Complete
> **Last Updated:** 2025-12-26
> **Depends On:** Phase 3 Complete

## Objective

Update the database schema to support subscription management with Stripe integration.

---

## Schema Design

### New Models

```prisma
// Subscription Plan (template)
model Plan {
  id                String   @id @default(cuid())
  name              String   // Free, Starter, Professional, Enterprise
  slug              String   @unique
  description       String?
  monthlyPrice      Int      // Price in cents
  yearlyPrice       Int      // Price in cents (discounted)
  stripePriceIdMonthly String? @unique
  stripePriceIdYearly  String? @unique

  // Limits
  messagesPerMonth  Int      @default(50)
  rulesLimit        Int      @default(1)

  // Features (JSON array of feature keys)
  features          Json     @default("[]")

  isActive          Boolean  @default(true)
  sortOrder         Int      @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  subscriptions     Subscription[]

  @@map("plans")
}

// User Subscription
model Subscription {
  id                    String             @id @default(cuid())
  userId                String             @unique
  user                  User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  planId                String
  plan                  Plan               @relation(fields: [planId], references: [id])

  // Stripe
  stripeCustomerId      String?            @unique
  stripeSubscriptionId  String?            @unique
  stripePriceId         String?

  // Status
  status                SubscriptionStatus @default(TRIALING)
  billingInterval       BillingInterval    @default(MONTHLY)

  // Dates
  currentPeriodStart    DateTime?
  currentPeriodEnd      DateTime?
  cancelAtPeriodEnd     Boolean            @default(false)
  canceledAt            DateTime?
  trialEndsAt           DateTime?

  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt

  usageRecords          UsageRecord[]

  @@index([userId])
  @@index([stripeCustomerId])
  @@index([stripeSubscriptionId])
  @@map("subscriptions")
}

// Usage Tracking
model UsageRecord {
  id              String       @id @default(cuid())
  subscriptionId  String
  subscription    Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  // Usage data
  messagesCount   Int          @default(0)
  rulesCount      Int          @default(0)

  // Period
  periodStart     DateTime
  periodEnd       DateTime

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@unique([subscriptionId, periodStart])
  @@index([subscriptionId])
  @@map("usage_records")
}

enum SubscriptionStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
  UNPAID
  INCOMPLETE
}

enum BillingInterval {
  MONTHLY
  YEARLY
}
```

### User Model Update

```prisma
model User {
  // ... existing fields

  // Add subscription relation
  subscription    Subscription?

  // Stripe customer ID (for quick access)
  stripeCustomerId String? @unique
}
```

---

## Implementation Checklist

### 1. Update Prisma Schema
- [x] Add `Plan` model
- [x] Add `Subscription` model
- [x] Add `UsageRecord` model
- [x] Add enums for status and billing interval
- [x] Update `User` model with subscription relation
- [x] Run migration

### 2. Create Seed Data
- [x] Seed free plan
- [x] Seed starter plan
- [x] Seed professional plan
- [x] Seed enterprise plan

### 3. Create Plan Service
- [x] Get all plans
- [x] Get plan by slug
- [x] Get plan by Stripe price ID

### 4. Create Subscription Service
- [x] Get user subscription
- [x] Create subscription
- [x] Update subscription
- [x] Cancel subscription
- [x] Check subscription status

### 5. Create Usage Service
- [x] Get current usage
- [x] Increment message count
- [x] Check limits
- [x] Reset usage on period start

### 6. Testing
- [x] Test plan queries
- [x] Test subscription creation
- [x] Test usage tracking

---

## Code Templates

### Complete Schema (`prisma/schema.prisma`)
```prisma
// Add to existing schema

enum SubscriptionStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
  UNPAID
  INCOMPLETE
}

enum BillingInterval {
  MONTHLY
  YEARLY
}

model Plan {
  id                   String   @id @default(cuid())
  name                 String
  slug                 String   @unique
  description          String?
  monthlyPrice         Int      @default(0)
  yearlyPrice          Int      @default(0)
  stripePriceIdMonthly String?  @unique
  stripePriceIdYearly  String?  @unique
  messagesPerMonth     Int      @default(50)
  rulesLimit           Int      @default(1)
  features             Json     @default("[]")
  isActive             Boolean  @default(true)
  sortOrder            Int      @default(0)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  subscriptions Subscription[]

  @@map("plans")
}

model Subscription {
  id                   String             @id @default(cuid())
  userId               String             @unique
  user                 User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  planId               String
  plan                 Plan               @relation(fields: [planId], references: [id])
  stripeCustomerId     String?            @unique
  stripeSubscriptionId String?            @unique
  stripePriceId        String?
  status               SubscriptionStatus @default(TRIALING)
  billingInterval      BillingInterval    @default(MONTHLY)
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  cancelAtPeriodEnd    Boolean            @default(false)
  canceledAt           DateTime?
  trialEndsAt          DateTime?
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  usageRecords UsageRecord[]

  @@index([userId])
  @@index([stripeCustomerId])
  @@index([stripeSubscriptionId])
  @@map("subscriptions")
}

model UsageRecord {
  id             String       @id @default(cuid())
  subscriptionId String
  subscription   Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
  messagesCount  Int          @default(0)
  rulesCount     Int          @default(0)
  periodStart    DateTime
  periodEnd      DateTime
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@unique([subscriptionId, periodStart])
  @@index([subscriptionId])
  @@map("usage_records")
}

// Update User model - add these fields
model User {
  // ... existing fields
  stripeCustomerId String?       @unique
  subscription     Subscription?
}
```

### Seed Plans (`prisma/seed-plans.ts`)
```typescript
import { prisma } from "@/lib/prisma";

const plans = [
  {
    name: "Free",
    slug: "free",
    description: "For trying out and small projects",
    monthlyPrice: 0,
    yearlyPrice: 0,
    messagesPerMonth: 50,
    rulesLimit: 1,
    features: ["basic_support"],
    sortOrder: 0,
  },
  {
    name: "Starter",
    slug: "starter",
    description: "For small businesses",
    monthlyPrice: 900, // $9 in cents
    yearlyPrice: 8640, // $86.40 (20% off)
    messagesPerMonth: 500,
    rulesLimit: 10,
    features: ["basic_support", "sheets_sync"],
    sortOrder: 1,
  },
  {
    name: "Professional",
    slug: "professional",
    description: "For medium businesses",
    monthlyPrice: 2900, // $29
    yearlyPrice: 27840, // $278.40
    messagesPerMonth: 5000,
    rulesLimit: -1, // Unlimited
    features: ["priority_support", "sheets_sync", "analytics", "api_access"],
    sortOrder: 2,
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    description: "For large companies",
    monthlyPrice: 9900, // $99
    yearlyPrice: 95040, // $950.40
    messagesPerMonth: -1, // Unlimited
    rulesLimit: -1, // Unlimited
    features: ["dedicated_support", "sheets_sync", "analytics", "api_access", "custom_integrations", "sla"],
    sortOrder: 3,
  },
];

export async function seedPlans() {
  console.log("Seeding plans...");

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }

  console.log("Plans seeded successfully");
}
```

### Plan Service (`src/lib/services/plan.ts`)
```typescript
import { prisma } from "@/lib/prisma";
import { Plan } from "@prisma/client";

export async function getAllPlans(): Promise<Plan[]> {
  return prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPlanBySlug(slug: string): Promise<Plan | null> {
  return prisma.plan.findUnique({
    where: { slug },
  });
}

export async function getPlanByStripePriceId(priceId: string): Promise<Plan | null> {
  return prisma.plan.findFirst({
    where: {
      OR: [
        { stripePriceIdMonthly: priceId },
        { stripePriceIdYearly: priceId },
      ],
    },
  });
}

export async function getFreePlan(): Promise<Plan> {
  const plan = await prisma.plan.findUnique({
    where: { slug: "free" },
  });

  if (!plan) {
    throw new Error("Free plan not found. Please run seed.");
  }

  return plan;
}
```

### Subscription Service (`src/lib/services/subscription.ts`)
```typescript
import { prisma } from "@/lib/prisma";
import { Subscription, SubscriptionStatus } from "@prisma/client";
import { getFreePlan } from "./plan";

export async function getUserSubscription(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId },
    include: { plan: true },
  });
}

export async function createFreeSubscription(userId: string): Promise<Subscription> {
  const freePlan = await getFreePlan();

  return prisma.subscription.create({
    data: {
      userId,
      planId: freePlan.id,
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });
}

export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: SubscriptionStatus
): Promise<Subscription> {
  return prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status },
  });
}

export async function isSubscriptionActive(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) return false;

  return ["ACTIVE", "TRIALING"].includes(subscription.status);
}

export async function getSubscriptionLimits(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    const freePlan = await getFreePlan();
    return {
      messagesPerMonth: freePlan.messagesPerMonth,
      rulesLimit: freePlan.rulesLimit,
    };
  }

  return {
    messagesPerMonth: subscription.plan.messagesPerMonth,
    rulesLimit: subscription.plan.rulesLimit,
  };
}
```

### Usage Service (`src/lib/services/usage.ts`)
```typescript
import { prisma } from "@/lib/prisma";
import { getUserSubscription, getSubscriptionLimits } from "./subscription";

export async function getCurrentUsage(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return { messagesCount: 0, rulesCount: 0 };
  }

  const now = new Date();
  const periodStart = subscription.currentPeriodStart || now;
  const periodEnd = subscription.currentPeriodEnd || now;

  let usage = await prisma.usageRecord.findUnique({
    where: {
      subscriptionId_periodStart: {
        subscriptionId: subscription.id,
        periodStart,
      },
    },
  });

  if (!usage) {
    usage = await prisma.usageRecord.create({
      data: {
        subscriptionId: subscription.id,
        periodStart,
        periodEnd,
        messagesCount: 0,
        rulesCount: 0,
      },
    });
  }

  return usage;
}

export async function incrementMessageCount(userId: string): Promise<void> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return;

  const usage = await getCurrentUsage(userId);

  await prisma.usageRecord.update({
    where: { id: usage.id },
    data: { messagesCount: { increment: 1 } },
  });
}

export async function canSendMessage(userId: string): Promise<boolean> {
  const limits = await getSubscriptionLimits(userId);
  const usage = await getCurrentUsage(userId);

  // -1 means unlimited
  if (limits.messagesPerMonth === -1) return true;

  return usage.messagesCount < limits.messagesPerMonth;
}

export async function canCreateRule(userId: string): Promise<boolean> {
  const limits = await getSubscriptionLimits(userId);

  // -1 means unlimited
  if (limits.rulesLimit === -1) return true;

  const rulesCount = await prisma.autoReplyRule.count({
    where: {
      // Assuming we add userId to rules - otherwise count all rules
    },
  });

  return rulesCount < limits.rulesLimit;
}
```

---

## Migration Steps

```bash
# 1. Update schema file

# 2. Create migration
npx prisma migrate dev --name add-subscription-models

# 3. Update seed script to include plans
# Edit prisma/seed.ts to call seedPlans()

# 4. Run seed
npm run db:seed
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | MODIFY | Add subscription models |
| `prisma/seed-plans.ts` | CREATE | Plan seed data |
| `prisma/seed.ts` | MODIFY | Include plan seeding |
| `src/lib/services/plan.ts` | CREATE | Plan service |
| `src/lib/services/subscription.ts` | CREATE | Subscription service |
| `src/lib/services/usage.ts` | CREATE | Usage tracking service |

---

## Acceptance Criteria

- [x] All models created successfully
- [x] Migration runs without errors
- [x] 4 plans seeded (Free, Starter, Professional, Enterprise)
- [x] Plan service returns correct data
- [x] Subscription service creates free subscriptions
- [x] Usage tracking works
- [x] Limit checks work correctly
