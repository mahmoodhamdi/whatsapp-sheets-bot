# Milestone 6.3: Account Settings

> **Phase:** 6 - Dashboard Integration
> **Status:** ✅ Completed
> **Last Updated:** 2025-12-27

## Objective

Create comprehensive account settings page.

---

## Settings Sections

1. **Profile** - Name, email
2. **Password** - Change password
3. **Preferences** - Language, theme
4. **Billing** - Subscription, invoices (linked to existing billing page)
5. **Security** - Sessions, 2FA (future)
6. **Danger Zone** - Delete account

---

## Implementation Checklist

- [x] Create settings layout with tabs
- [x] Profile update form
- [x] Password change form
- [x] Preferences settings (language + theme)
- [x] Link to billing settings (existing /dashboard/settings/billing page)
- [x] Delete account with confirmation

---

## Code Templates

### Settings Page Layout
```typescript
// src/app/(dashboard)/dashboard/settings/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { PasswordSettings } from "@/components/settings/PasswordSettings";
import { PreferencesSettings } from "@/components/settings/PreferencesSettings";
import { DangerZone } from "@/components/settings/DangerZone";

export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="password">
          <PasswordSettings />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesSettings />
        </TabsContent>

        <TabsContent value="danger">
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### Profile Update API
```typescript
// src/app/api/user/profile/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2).max(50),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name } = profileSchema.parse(body);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  return NextResponse.json({ success: true });
}
```

### Delete Account API
```typescript
// src/app/api/user/delete/route.ts
import { NextResponse } from "next/server";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Cancel Stripe subscription if exists
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (user?.subscription?.stripeSubscriptionId) {
    await stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId);
  }

  // Delete user (cascades to related data)
  await prisma.user.delete({
    where: { id: session.user.id },
  });

  return NextResponse.json({ success: true });
}
```

---

## Acceptance Criteria

- [x] Profile update works
- [x] Password change works
- [x] Language/theme preferences save
- [x] Delete account with confirmation
- [x] Subscription cancellation on delete

---

## Files Created/Modified

### New Files
- `src/app/(dashboard)/dashboard/settings/account/page.tsx` - Account settings page with tabs
- `src/components/settings/ProfileSettings.tsx` - Profile edit form
- `src/components/settings/PasswordSettings.tsx` - Password change form
- `src/components/settings/PreferencesSettings.tsx` - Language/theme settings
- `src/components/settings/DangerZone.tsx` - Delete account section
- `src/app/api/user/profile/route.ts` - Profile API (GET/PATCH)
- `src/app/api/user/password/route.ts` - Password change API
- `src/app/api/user/delete/route.ts` - Account deletion API
- `tests/unit/user-api.test.ts` - Unit tests for user APIs

### Modified Files
- `src/app/layout.tsx` - Added ThemeProvider for dark mode support
- `src/components/settings/index.ts` - Added exports for new components
- `messages/en.json` - Added accountSettings translations
- `messages/ar.json` - Added accountSettings translations (Arabic)

---

## Usage

Access account settings at `/dashboard/settings/account`

### API Endpoints
- `GET /api/user/profile` - Get current user profile
- `PATCH /api/user/profile` - Update profile name
- `PATCH /api/user/password` - Change password
- `DELETE /api/user/delete` - Delete account (cancels Stripe subscription)
