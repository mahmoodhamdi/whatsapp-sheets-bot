# Milestone 6.4: Upgrade Prompts

> **Phase:** 6 - Dashboard Integration
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26

## Objective

Create strategic upgrade prompts throughout the dashboard.

---

## Prompt Locations

1. **Dashboard header** - Current plan badge with upgrade button
2. **Feature locked** - When accessing restricted features
3. **Usage warning** - When nearing limits
4. **Rule creation** - When at rule limit
5. **Settings** - Plan comparison

---

## Implementation Checklist

- [ ] Create UpgradeBanner component
- [ ] Create UsageLimitWarning component
- [ ] Create FeatureLockedCard component
- [ ] Add prompts to relevant pages
- [ ] Track upgrade click analytics

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

- [ ] Upgrade banner shown for free users
- [ ] Usage warnings appear at 80%
- [ ] Locked features show upgrade option
- [ ] All prompts link to pricing
- [ ] Prompts can be dismissed
- [ ] Not annoying for paid users

---

## Phase 6 Completion

- [ ] M1: Feature Gating ✅
- [ ] M2: Usage Tracking ✅
- [ ] M3: Account Settings ✅
- [ ] M4: Upgrade Prompts ✅

**Update MASTER_PLAN.md!**
