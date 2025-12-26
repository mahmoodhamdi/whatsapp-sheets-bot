# Milestone 6.2: Usage Tracking

> **Phase:** 6 - Dashboard Integration
> **Status:** ✅ Completed
> **Last Updated:** 2025-12-26

## Objective

Track and display usage against subscription limits.

---

## Implementation Checklist

- [x] Increment message count on send/receive
- [x] Track rules count
- [x] Display usage in dashboard
- [x] Show warnings near limits
- [x] Block actions at limit

---

## Files Created/Modified

### New Files

**Usage API Endpoint:**
- `src/app/api/usage/route.ts` - Detailed usage data with history

**Usage Display Component:**
- `src/components/dashboard/UsageDisplay.tsx`
  - `UsageDisplay` - Full usage display with progress bars and warnings
  - `UsageIndicator` - Compact inline usage indicator

### Modified Files

**WhatsApp Client:**
- `src/lib/whatsapp/client.ts`
  - Added `getBotOwnerUserId()` helper to get the subscription owner
  - Modified `handleIncomingMessage()` to check usage limits before auto-replying
  - Calls `canSendMessage()` before sending and `incrementMessageCount()` after

**Rules API (Limit Enforcement):**
- `src/app/api/rules/route.ts`
  - Added `canCreateRule()` check before creating new rules
  - Returns 403 with `RULE_LIMIT_REACHED` code when limit reached

**Dashboard:**
- `src/app/(dashboard)/dashboard/page.tsx`
  - Added `UsageDisplay` component to show usage on main dashboard

**Tests:**
- `tests/unit/api-routes.test.ts` - Added mock for `canCreateRule`
- `tests/unit/analytics.test.ts` - Added mock for `hasFeature`

### Translations

- `messages/en.json` - Added `usage` section
- `messages/ar.json` - Added `usage` section (Arabic)

---

## Usage API Response

```json
GET /api/usage

{
  "current": {
    "messagesUsed": 42,
    "messagesLimit": 500,
    "messagesPercent": 8,
    "messagesRemaining": 458,
    "isUnlimitedMessages": false,
    "rulesUsed": 3,
    "rulesLimit": 10,
    "rulesPercent": 30,
    "rulesRemaining": 7,
    "isUnlimitedRules": false,
    "periodStart": "2025-12-01T00:00:00.000Z",
    "periodEnd": "2025-12-31T23:59:59.999Z"
  },
  "warnings": {
    "nearMessageLimit": false,
    "atMessageLimit": false,
    "nearRuleLimit": false,
    "atRuleLimit": false
  },
  "history": [
    {
      "periodStart": "2025-12-01T00:00:00.000Z",
      "periodEnd": "2025-12-31T23:59:59.999Z",
      "messagesCount": 42,
      "rulesCount": 3
    }
  ]
}
```

---

## Rule Limit Error Response

```json
POST /api/rules (when limit reached)

HTTP 403 Forbidden
{
  "error": "Rule limit reached",
  "code": "RULE_LIMIT_REACHED",
  "message": "You have reached the maximum number of rules for your plan. Please upgrade to create more rules."
}
```

---

## Usage Examples

### Check Usage in WhatsApp Client
```typescript
// In handleIncomingMessage
const botOwnerId = await getBotOwnerUserId();
const canSend = botOwnerId ? await canSendMessage(botOwnerId) : true;

if (canSend) {
  const sent = await sendMessage(phone, response, ruleId, contactId);
  if (sent && botOwnerId) {
    await incrementMessageCount(botOwnerId);
  }
} else {
  console.log("Message limit reached, skipping auto-reply");
}
```

### Display Usage in Dashboard
```typescript
// In dashboard page.tsx
const session = await auth();
const userId = session?.user?.id;

const [usage, limits] = await Promise.all([
  getCurrentUsage(userId),
  getSubscriptionLimits(userId),
]);

<UsageDisplay
  messagesUsed={usage.messagesCount}
  messagesLimit={limits.messagesPerMonth}
  rulesUsed={usage.rulesCount}
  rulesLimit={limits.rulesLimit}
  periodStart={usage.periodStart}
  periodEnd={usage.periodEnd}
  showCard
  showWarnings
/>
```

---

## Acceptance Criteria

- [x] Message counts increment correctly
- [x] Usage displayed in dashboard
- [x] Warnings shown at 80%
- [x] Actions blocked at 100%
- [x] Unlimited plans work correctly
- [x] Bilingual support (EN/AR)

---

## Next Milestone

Proceed to **M3: Account Settings** to implement user account management features.
