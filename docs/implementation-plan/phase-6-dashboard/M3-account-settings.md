# Milestone 6.3: Account Settings

> **Phase:** 6 - Dashboard Integration
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26

## Objective

Create comprehensive account settings page.

---

## Settings Sections

1. **Profile** - Name, email
2. **Password** - Change password
3. **Preferences** - Language, theme
4. **Billing** - Subscription, invoices
5. **Security** - Sessions, 2FA (future)
6. **Danger Zone** - Delete account

---

## Implementation Checklist

- [ ] Create settings layout with tabs
- [ ] Profile update form
- [ ] Password change form
- [ ] Preferences settings
- [ ] Link to billing settings
- [ ] Delete account with confirmation

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

- [ ] Profile update works
- [ ] Password change works
- [ ] Language/theme preferences save
- [ ] Delete account with confirmation
- [ ] Subscription cancellation on delete
