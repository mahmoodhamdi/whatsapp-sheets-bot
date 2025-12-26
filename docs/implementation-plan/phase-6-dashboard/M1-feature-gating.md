# Milestone 6.1: Feature Gating System

> **Phase:** 6 - Dashboard Integration
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26

## Objective

Implement feature restrictions based on subscription tier.

---

## Feature Gates

| Feature | Free | Starter | Pro | Enterprise |
|---------|------|---------|-----|------------|
| Messages/month | 50 | 500 | 5000 | Unlimited |
| Auto-reply rules | 1 | 10 | Unlimited | Unlimited |
| Google Sheets | ❌ | ✅ | ✅ | ✅ |
| Analytics | ❌ | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ | ✅ |

---

## Implementation Checklist

- [ ] Create feature check utilities
- [ ] Create FeatureGate component
- [ ] Apply gates to dashboard features
- [ ] Show upgrade prompts
- [ ] Block API access for restricted features

---

## Code Templates

### Feature Check Utility
```typescript
// src/lib/features/index.ts
import { getUserSubscription } from "@/lib/services/subscription";

export type Feature =
  | "sheets_sync"
  | "analytics"
  | "api_access"
  | "priority_support"
  | "unlimited_messages"
  | "unlimited_rules";

export async function hasFeature(userId: string, feature: Feature): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;

  const features = subscription.plan.features as string[];
  return features.includes(feature);
}

export async function canUseFeature(userId: string, feature: Feature): Promise<{
  allowed: boolean;
  reason?: string;
  upgradeUrl?: string;
}> {
  const allowed = await hasFeature(userId, feature);

  if (!allowed) {
    return {
      allowed: false,
      reason: `This feature requires a higher plan`,
      upgradeUrl: "/pricing",
    };
  }

  return { allowed: true };
}
```

### FeatureGate Component
```typescript
// src/components/subscription/FeatureGate.tsx
"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";

interface FeatureGateProps {
  feature: string;
  hasAccess: boolean;
  children: ReactNode;
  planRequired?: string;
}

export function FeatureGate({
  feature,
  hasAccess,
  children,
  planRequired = "Professional",
}: FeatureGateProps) {
  const t = useTranslations("subscription.upgrade");

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Lock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t("locked")}</h3>
        <p className="text-muted-foreground mb-4">
          {t("requiresPlan", { plan: planRequired })}
        </p>
        <Button asChild>
          <Link href="/pricing">{t("cta")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Server-Side Feature Check
```typescript
// Usage in server components
import { auth } from "@/lib/auth";
import { hasFeature } from "@/lib/features";

export default async function AnalyticsPage() {
  const session = await auth();
  const canAccessAnalytics = await hasFeature(session.user.id, "analytics");

  return (
    <FeatureGate feature="analytics" hasAccess={canAccessAnalytics}>
      <AnalyticsDashboard />
    </FeatureGate>
  );
}
```

### API Route Protection
```typescript
// Middleware for API routes
import { hasFeature } from "@/lib/features";

export async function checkFeatureAccess(userId: string, feature: Feature) {
  const allowed = await hasFeature(userId, feature);
  if (!allowed) {
    throw new Error("Feature not available on your plan");
  }
}

// Usage in API route
export async function POST(request: Request) {
  const session = await auth();
  await checkFeatureAccess(session.user.id, "api_access");
  // Continue with API logic...
}
```

---

## Acceptance Criteria

- [ ] Feature checks work correctly
- [ ] Locked features show upgrade prompt
- [ ] API routes protected
- [ ] Upgrade links work
- [ ] All feature gates applied
