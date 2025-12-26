# Milestone 2.3: Pricing Section

> **Phase:** 2 - Landing Page Sections
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26
> **Depends On:** M2-features-section.md

## Objective

Create a clear pricing section with subscription tiers and monthly/yearly toggle.

---

## Design Specifications

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│               خطط تناسب كل الأعمال                          │
│           اختر الخطة المناسبة لحجم عملك                     │
│                                                              │
│              [Monthly] ──○── [Yearly] وفر 20%               │
│                                                              │
│  ┌─────────┐  ┌─────────────┐  ┌─────────┐  ┌─────────┐    │
│  │  Free   │  │ ★ Popular ★ │  │  Pro    │  │ Enter-  │    │
│  │  $0     │  │  Starter    │  │  $29    │  │ prise   │    │
│  │         │  │  $9/mo      │  │         │  │  $99    │    │
│  │ ✓ 50msg │  │ ✓ 500 msg   │  │ ✓ 5000  │  │ ✓ Unlim │    │
│  │ ✓ 1rule │  │ ✓ 10 rules  │  │ ✓ Unlim │  │ ✓ All   │    │
│  │         │  │ ✓ Sheets    │  │ ✓ All   │  │ ✓ Dedic │    │
│  │ [Start] │  │ [Subscribe] │  │ [Subs]  │  │ [Contact│    │
│  └─────────┘  └─────────────┘  └─────────┘  └─────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Pricing Tiers

| Plan | Monthly USD | Monthly SAR | Messages | Rules | Features |
|------|-------------|-------------|----------|-------|----------|
| Free | $0 | 0 ر.س | 50 | 1 | Basic |
| Starter | $9 | 35 ر.س | 500 | 10 | + Sheets |
| Professional | $29 | 110 ر.س | 5,000 | Unlimited | + Analytics, Priority |
| Enterprise | $99 | 370 ر.س | Unlimited | Unlimited | + Dedicated, API, Custom |

### Visual Style
- Popular plan highlighted (scale, border, badge)
- Monthly/Yearly toggle with discount badge
- Check marks for features
- CTA button at bottom of each card

---

## Implementation Checklist

### 1. Create Pricing Section Component
- [ ] Create `src/components/marketing/sections/PricingSection.tsx`
- [ ] Implement billing toggle (monthly/yearly)
- [ ] Calculate yearly prices (20% discount)

### 2. Create Billing Toggle
- [ ] Create toggle component
- [ ] Add discount badge
- [ ] Handle state change

### 3. Define Pricing Data
- [ ] Create plans configuration
- [ ] Include both SAR and USD prices
- [ ] List features per plan

### 4. Use PricingCard Component
- [ ] Pass plan data as props
- [ ] Highlight popular plan
- [ ] Dynamic CTA based on plan type

### 5. Testing
- [ ] Test billing toggle
- [ ] Test responsive layout
- [ ] Test RTL layout
- [ ] Verify price calculations

---

## Code Template

### PricingSection Component
```typescript
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Section, SectionHeader, PricingCard } from "@/components/marketing";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Plan {
  key: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
}

const plans: Plan[] = [
  { key: "free", monthlyPrice: 0, yearlyPrice: 0 },
  { key: "starter", monthlyPrice: 9, yearlyPrice: 86 }, // ~20% off
  { key: "professional", monthlyPrice: 29, yearlyPrice: 278, popular: true },
  { key: "enterprise", monthlyPrice: 99, yearlyPrice: 950 },
];

const planFeatures: Record<string, string[]> = {
  free: ["messages:50", "rules:1"],
  starter: ["messages:500", "rules:10", "sheetsSync"],
  professional: ["messages:5000", "rulesUnlimited", "sheetsSync", "analytics", "priority"],
  enterprise: ["messagesUnlimited", "rulesUnlimited", "sheetsSync", "analytics", "priority", "dedicated", "api", "customIntegrations"],
};

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const t = useTranslations("pricing");
  const tFeatures = useTranslations("pricing.features");
  const tPlans = useTranslations("pricing.plans");

  const getFeatureLabel = (feature: string): string => {
    if (feature.includes(":")) {
      const [key, count] = feature.split(":");
      return tFeatures(key, { count });
    }
    return tFeatures(feature);
  };

  return (
    <Section id="pricing">
      <SectionHeader
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <Label
          htmlFor="billing-toggle"
          className={!isYearly ? "font-semibold" : "text-muted-foreground"}
        >
          {t("monthly")}
        </Label>

        <Switch
          id="billing-toggle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />

        <div className="flex items-center gap-2">
          <Label
            htmlFor="billing-toggle"
            className={isYearly ? "font-semibold" : "text-muted-foreground"}
          >
            {t("yearly")}
          </Label>
          {isYearly && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {t("yearlyDiscount", { percent: 20 })}
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const price = isYearly
            ? Math.round(plan.yearlyPrice / 12)
            : plan.monthlyPrice;

          const features = planFeatures[plan.key].map(getFeatureLabel);

          return (
            <PricingCard
              key={plan.key}
              name={tPlans(`${plan.key}.name`)}
              price={`$${price}`}
              period={t("perMonth")}
              description={tPlans(`${plan.key}.description`)}
              features={features}
              cta={tPlans(`${plan.key}.cta`)}
              ctaHref={plan.key === "enterprise" ? "/contact" : "/register"}
              popular={plan.popular}
            />
          );
        })}
      </div>
    </Section>
  );
}
```

### SAR Pricing Variant
```typescript
// For Saudi market, use SAR prices
const sarPlans: Plan[] = [
  { key: "free", monthlyPrice: 0, yearlyPrice: 0 },
  { key: "starter", monthlyPrice: 35, yearlyPrice: 336 },
  { key: "professional", monthlyPrice: 110, yearlyPrice: 1056, popular: true },
  { key: "enterprise", monthlyPrice: 370, yearlyPrice: 3552 },
];

// Can detect locale and show appropriate currency
const { locale } = useLocale();
const currency = locale === "ar" ? "ر.س" : "$";
const activePlans = locale === "ar" ? sarPlans : plans;
```

---

## Pricing Card Enhancement

### Updated PricingCard with Currency Support
```typescript
interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  popular?: boolean;
  yearlyBadge?: string; // For yearly savings
  className?: string;
}
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/marketing/sections/PricingSection.tsx` | CREATE | Pricing section |
| `src/components/marketing/sections/index.ts` | MODIFY | Add export |
| `src/app/(marketing)/page.tsx` | MODIFY | Add PricingSection |
| `src/components/marketing/PricingCard.tsx` | MODIFY | Add currency support if needed |

---

## Testing Instructions

```bash
# 1. Create PricingSection component

# 2. Update landing page

# 3. Start dev server
npm run dev

# 4. Test pricing section
# - Toggle monthly/yearly
# - Verify prices update
# - Check discount badge appears
# - Test all CTA links

# 5. Test responsive
# - 4 columns on desktop
# - 2 columns on tablet
# - 1 column on mobile

# 6. Test RTL
npm run lint
```

---

## Acceptance Criteria

- [ ] All 4 pricing tiers displayed
- [ ] Monthly/yearly toggle works
- [ ] 20% yearly discount shown
- [ ] Popular plan highlighted
- [ ] Features list complete per plan
- [ ] CTA buttons link correctly
- [ ] Responsive layout works
- [ ] RTL layout correct
- [ ] Dark mode works
