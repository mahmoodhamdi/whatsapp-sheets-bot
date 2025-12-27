# Milestone 6.4: Upgrade Prompts

> **Phase:** 6 - Dashboard Integration
> **Status:** ✅ Completed
> **Last Updated:** 2025-12-27

## Objective

Create strategic upgrade prompts throughout the dashboard.

---

## Prompt Locations

1. **Dashboard header** - Current plan badge with upgrade link
2. **Dashboard main page** - Dismissible upgrade banner for free users
3. **Feature locked** - When accessing restricted features (FeatureGate component)
4. **Usage warning** - When nearing limits (UsageDisplay component)
5. **Rule creation** - When at rule limit (RuleLimitWarning)

---

## Implementation Checklist

- [x] Create UpgradeBanner component (dismissible for free users)
- [x] Create UsageLimitWarning component (80% and 100% warnings)
- [x] Create PlanBadge component for header
- [x] Add prompts to relevant pages
- [x] FeatureGate already handles locked features

---

## Code Templates

### Upgrade Banner
```typescript
// src/components/subscription/UpgradeBanner.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { useState } from "react";

export function UpgradeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5" />
        <span>Upgrade to Pro for unlimited messages and advanced features</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="bg-white text-green-700 hover:bg-green-50"
          asChild
        >
          <Link href="/pricing">Upgrade Now</Link>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

### Usage Limit Warning
```typescript
// src/components/subscription/UsageLimitWarning.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface UsageLimitWarningProps {
  usagePercent: number;
  resourceName: string;
}

export function UsageLimitWarning({ usagePercent, resourceName }: UsageLimitWarningProps) {
  if (usagePercent < 80) return null;

  const isAtLimit = usagePercent >= 100;

  return (
    <Alert variant={isAtLimit ? "destructive" : "warning"}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>
        {isAtLimit ? "Limit Reached" : "Approaching Limit"}
      </AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>
          {isAtLimit
            ? `You've reached your ${resourceName} limit.`
            : `You've used ${usagePercent}% of your ${resourceName}.`}
        </span>
        <Button size="sm" asChild>
          <Link href="/pricing">Upgrade</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
```

### Dashboard Header with Plan Badge
```typescript
// In dashboard header
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function PlanBadge({ planName, isFree }) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant={isFree ? "secondary" : "default"}>
        {planName} Plan
      </Badge>
      {isFree && (
        <Link
          href="/pricing"
          className="text-sm text-green-600 hover:underline"
        >
          Upgrade
        </Link>
      )}
    </div>
  );
}
```

---

## Acceptance Criteria

- [x] Upgrade banner shown for free users
- [x] Usage warnings appear at 80%
- [x] Locked features show upgrade option
- [x] All prompts link to pricing
- [x] Prompts can be dismissed (session-based)
- [x] Not annoying for paid users (banner only for free plan)

---

## Files Created/Modified

### New Files
- `src/components/subscription/UpgradeBanner.tsx` - Dismissible upgrade banner
- `src/components/subscription/UsageLimitWarning.tsx` - Warning components for usage limits
- `src/components/subscription/PlanBadge.tsx` - Plan badge for header

### Modified Files
- `src/app/(dashboard)/layout.tsx` - Added plan data fetching for header
- `src/components/dashboard/Header.tsx` - Added PlanBadge and billing menu
- `src/app/(dashboard)/dashboard/page.tsx` - Added UpgradeBanner
- `src/app/(dashboard)/dashboard/rules/new/page.tsx` - Added RuleLimitWarning
- `src/components/subscription/index.ts` - Exported new components
- `messages/en.json` - Added upgrade prompt translations
- `messages/ar.json` - Added upgrade prompt translations (Arabic)

---

## Phase 6 Completion

- [x] M1: Feature Gating ✅
- [x] M2: Usage Tracking ✅
- [x] M3: Account Settings ✅
- [x] M4: Upgrade Prompts ✅

**Phase 6 is now complete!**
