# Milestone 6.2: Usage Tracking

> **Phase:** 6 - Dashboard Integration
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26

## Objective

Track and display usage against subscription limits.

---

## Implementation Checklist

- [ ] Increment message count on send/receive
- [ ] Track rules count
- [ ] Display usage in dashboard
- [ ] Show warnings near limits
- [ ] Block actions at limit

---

## Code Templates

### Increment Usage on Message
```typescript
// src/lib/whatsapp/client.ts - In message handler
import { incrementMessageCount, canSendMessage } from "@/lib/services/usage";

async function handleIncomingMessage(message) {
  // Before processing
  const canSend = await canSendMessage(userId);
  if (!canSend) {
    console.log("Message limit reached");
    return; // Don't send auto-reply
  }

  // After sending auto-reply
  await incrementMessageCount(userId);
}
```

### Usage Display Component
```typescript
// src/components/dashboard/UsageDisplay.tsx
"use client";

import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface UsageDisplayProps {
  messagesUsed: number;
  messagesLimit: number;
  rulesUsed: number;
  rulesLimit: number;
}

export function UsageDisplay({
  messagesUsed,
  messagesLimit,
  rulesUsed,
  rulesLimit,
}: UsageDisplayProps) {
  const t = useTranslations("subscription.limits");

  const messagesPercent = messagesLimit === -1 ? 0 : (messagesUsed / messagesLimit) * 100;
  const isNearLimit = messagesPercent >= 80;
  const isAtLimit = messagesPercent >= 100;

  return (
    <div className="space-y-4">
      {isNearLimit && !isAtLimit && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{t("nearLimit")}</AlertDescription>
        </Alert>
      )}

      {isAtLimit && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{t("atLimit")}</AlertDescription>
        </Alert>
      )}

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>{t("messages")}</span>
          <span>
            {messagesLimit === -1
              ? t("unlimited")
              : `${messagesUsed} / ${messagesLimit}`}
          </span>
        </div>
        {messagesLimit !== -1 && (
          <Progress
            value={messagesPercent}
            className={isAtLimit ? "bg-destructive/20" : ""}
          />
        )}
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>{t("rules")}</span>
          <span>
            {rulesLimit === -1
              ? t("unlimited")
              : `${rulesUsed} / ${rulesLimit}`}
          </span>
        </div>
        {rulesLimit !== -1 && (
          <Progress value={(rulesUsed / rulesLimit) * 100} />
        )}
      </div>
    </div>
  );
}
```

### Dashboard Integration
```typescript
// In dashboard page
const usage = await getCurrentUsage(session.user.id);
const limits = await getSubscriptionLimits(session.user.id);
const rulesCount = await prisma.autoReplyRule.count();

<UsageDisplay
  messagesUsed={usage.messagesCount}
  messagesLimit={limits.messagesPerMonth}
  rulesUsed={rulesCount}
  rulesLimit={limits.rulesLimit}
/>
```

---

## Acceptance Criteria

- [ ] Message counts increment correctly
- [ ] Usage displayed in dashboard
- [ ] Warnings shown at 80%
- [ ] Actions blocked at 100%
- [ ] Unlimited plans work correctly
