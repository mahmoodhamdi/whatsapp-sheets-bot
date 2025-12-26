# Milestone 6.1: Feature Gating System

> **Phase:** 6 - Dashboard Integration
> **Status:** ✅ Completed
> **Last Updated:** 2025-12-26

## Objective

Implement feature restrictions based on subscription tier.

---

## Feature Gates Implemented

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

- [x] Create feature check utilities
- [x] Create FeatureGate component
- [x] Create UpgradePrompt component
- [x] Apply gates to dashboard features (Sheets settings)
- [x] Show upgrade prompts when features locked
- [x] Block API access for restricted features
- [x] Add bilingual translations (EN/AR)

---

## Files Created/Modified

### New Files

**Feature Utilities:**
- `src/lib/features/index.ts` - Feature check utilities
  - `hasFeature(userId, feature)` - Check if user has feature access
  - `canUseFeature(userId, feature)` - Detailed feature access check
  - `getUserFeatures(userId)` - Get all user features
  - `requireFeature(userId, feature)` - Server-side feature guard (throws error)
  - `hasFeatures(userId, features)` - Check multiple features at once

**UI Components:**
- `src/components/subscription/FeatureGate.tsx`
  - `FeatureGate` - Full card with lock icon and upgrade CTA
  - `LockedOverlay` - Blurred overlay for locked content
- `src/components/subscription/UpgradePrompt.tsx`
  - `UpgradePrompt` - Multiple variants (default, banner, inline, card)
  - `ProBadge` - Premium feature indicator badge

**Dashboard Pages:**
- `src/app/(dashboard)/dashboard/settings/sheets/page.tsx` - Server wrapper with feature gate
- `src/app/(dashboard)/dashboard/settings/sheets/SheetsSettingsContent.tsx` - Client component

### Modified Files (API Route Protection)

**Sheets API (requires `sheets_sync` - Starter+):**
- `src/app/api/sheets/status/route.ts`
- `src/app/api/sheets/sync/route.ts`
- `src/app/api/sheets/logs/route.ts`

**Analytics API (requires `analytics` - Professional+):**
- `src/app/api/analytics/overview/route.ts`
- `src/app/api/analytics/messages/route.ts`
- `src/app/api/analytics/rules/route.ts`

### Translations
- `messages/en.json` - Added `featureGate` section
- `messages/ar.json` - Added `featureGate` section (Arabic)

---

## Feature Types

```typescript
export type Feature =
  | "basic_support"
  | "priority_support"
  | "dedicated_support"
  | "sheets_sync"
  | "analytics"
  | "api_access"
  | "custom_integrations"
  | "sla";
```

---

## Usage Examples

### Server Component (Page)
```typescript
import { auth } from "@/lib/auth";
import { hasFeature } from "@/lib/features";
import { FeatureGate } from "@/components/subscription/FeatureGate";

export default async function SheetsPage() {
  const session = await auth();
  const hasAccess = await hasFeature(session.user.id, "sheets_sync");

  return (
    <FeatureGate feature="sheets_sync" hasAccess={hasAccess} requiredPlan="Starter">
      <SheetsContent />
    </FeatureGate>
  );
}
```

### API Route Protection
```typescript
import { hasFeature } from "@/lib/features";

export async function GET() {
  const session = await auth();

  const hasAccess = await hasFeature(session.user.id, "analytics");
  if (!hasAccess) {
    return NextResponse.json(
      { error: "Feature not available", code: "FEATURE_NOT_AVAILABLE", requiredPlan: "Professional" },
      { status: 403 }
    );
  }

  // Continue with API logic...
}
```

---

## API Error Response Format

When a feature is not available, API routes return:

```json
{
  "error": "Feature not available",
  "code": "FEATURE_NOT_AVAILABLE",
  "requiredPlan": "Professional",
  "message": "Advanced analytics requires Professional plan or higher"
}
```

HTTP Status: `403 Forbidden`

---

## Acceptance Criteria

- [x] Feature checks work correctly
- [x] Locked features show upgrade prompt
- [x] API routes protected with 403 response
- [x] Upgrade links direct to /pricing
- [x] All feature gates applied (Sheets, Analytics)
- [x] Bilingual support (EN/AR)

---

## Next Milestone

Proceed to **M2: Usage Tracking** to implement real-time usage monitoring and limits enforcement.
