# Phase B: Analytics APIs

## Overview
إنشاء APIs للتحليلات والإحصائيات المتقدمة.

## Tasks

### Task 1: Overview Analytics API
**File:** `src/app/api/analytics/overview/route.ts`

**GET Response:**
```typescript
{
  totalMessages: number;
  totalContacts: number;
  totalRules: number;
  activeRules: number;
  todayMessages: number;
  weekMessages: number;
  monthMessages: number;
  incomingCount: number;
  outgoingCount: number;
  autoRepliedCount: number;
  syncedToSheetsCount: number;
}
```

**Implementation:**
- Use Prisma aggregations
- Calculate date ranges (today, week, month)
- Count by direction
- Count messages with ruleId (auto-replied)

### Task 2: Messages Analytics API
**File:** `src/app/api/analytics/messages/route.ts`

**GET Query Params:**
- `period`: "day" | "week" | "month" | "year"
- `from`: ISO date string (optional)
- `to`: ISO date string (optional)

**Response:**
```typescript
{
  data: Array<{
    date: string;        // ISO date
    incoming: number;
    outgoing: number;
    total: number;
  }>;
  summary: {
    totalIncoming: number;
    totalOutgoing: number;
    avgPerDay: number;
    peakDay: string;
    peakCount: number;
  };
}
```

**Implementation:**
- Group messages by date
- Calculate daily/weekly/monthly aggregations
- Use Prisma groupBy or raw SQL

### Task 3: Rules Analytics API
**File:** `src/app/api/analytics/rules/route.ts`

**GET Response:**
```typescript
{
  rules: Array<{
    id: string;
    name: string;
    triggerType: string;
    isActive: boolean;
    totalMatches: number;
    lastUsed: string | null;
    successRate: number;  // % of sent messages
  }>;
  topRules: Array<{
    id: string;
    name: string;
    matches: number;
  }>;
  unusedRules: Array<{
    id: string;
    name: string;
    createdAt: string;
  }>;
}
```

**Implementation:**
- Count messages per rule
- Find rules with no messages
- Calculate success rate (SENT vs FAILED)

### Task 4: Add Translation Keys
**Files:** `messages/en.json`, `messages/ar.json`

```json
{
  "analytics": {
    "title": "Analytics",
    "overview": "Overview",
    "messages": "Messages",
    "rules": "Rules Performance",
    "period": "Period",
    "day": "Day",
    "week": "Week",
    "month": "Month",
    "year": "Year",
    "totalIncoming": "Total Incoming",
    "totalOutgoing": "Total Outgoing",
    "avgPerDay": "Average Per Day",
    "peakDay": "Peak Day",
    "topRules": "Top Rules",
    "unusedRules": "Unused Rules",
    "matches": "Matches",
    "successRate": "Success Rate"
  }
}
```

### Task 5: Write Unit Tests
**File:** `tests/unit/analytics.test.ts`

**Test cases:**
- Overview returns correct counts
- Messages aggregation works for different periods
- Rules analytics calculates correctly
- Empty data handling

## Validation

1. Run `npm run lint`
2. Run `npm run test`
3. Run `npm run build`
4. Test endpoints manually:
   - `GET /api/analytics/overview`
   - `GET /api/analytics/messages?period=week`
   - `GET /api/analytics/rules`

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/app/api/analytics/overview/route.ts` | Create |
| `src/app/api/analytics/messages/route.ts` | Create |
| `src/app/api/analytics/rules/route.ts` | Create |
| `messages/en.json` | Add keys |
| `messages/ar.json` | Add keys |
| `tests/unit/analytics.test.ts` | Create |

---

## Prompt for Claude

```
اشتغل على Phase B من الخطة - Analytics APIs.

المطلوب:
1. أنشئ `src/app/api/analytics/overview/route.ts` - إحصائيات عامة
2. أنشئ `src/app/api/analytics/messages/route.ts` - تحليل الرسائل بالفترات
3. أنشئ `src/app/api/analytics/rules/route.ts` - أداء القواعد
4. أضف translation keys للـ analytics
5. اكتب unit tests للـ APIs الثلاثة
6. شغل lint و test و build

كل API لازم يكون:
- Protected بـ authentication
- يرجع JSON response
- يتعامل مع الأخطاء صح

لما تخلص، ابعتلي تقرير بالـ endpoints وأمثلة على الـ responses.
```
