# Milestone 1.1: Public Route Structure

> **Phase:** 1 - Foundation & Public Routes
> **Status:** ✅ Complete
> **Last Updated:** 2025-12-26

## Objective

Set up the routing infrastructure for public-facing pages (landing, pricing, docs) that don't require authentication.

---

## Context

### Current Structure
```
src/app/
├── page.tsx                 # Root - redirects to /dashboard or /login
├── (auth)/                  # Unauthenticated pages (login only)
│   └── login/
└── (dashboard)/             # Protected pages (requires auth)
    └── dashboard/
```

### Target Structure
```
src/app/
├── (marketing)/             # NEW: Public marketing pages
│   ├── layout.tsx           # Marketing layout with navbar/footer
│   ├── page.tsx             # Landing page (/)
│   ├── pricing/
│   │   └── page.tsx         # Pricing page
│   ├── features/
│   │   └── page.tsx         # Features detail page
│   └── docs/
│       ├── layout.tsx       # Docs layout with sidebar
│       └── [...slug]/
│           └── page.tsx     # Dynamic docs pages
├── (auth)/                  # Auth pages (login, register, etc.)
│   ├── layout.tsx
│   ├── login/
│   ├── register/            # NEW
│   ├── forgot-password/     # NEW
│   └── verify-email/        # NEW
└── (dashboard)/             # Protected dashboard (unchanged)
```

### Middleware Update Required
Current middleware protects everything except `/login` and `/api/auth/*`.
Need to add marketing routes to public routes list.

---

## Implementation Checklist

### 1. Create Marketing Route Group
- [x] Create `src/app/(marketing)/` directory
- [x] Move root `page.tsx` logic to marketing group
- [x] Create placeholder `page.tsx` for landing

### 2. Update Middleware
- [x] Edit `src/middleware.ts`
- [x] Add marketing routes to `publicRoutes` array:
  ```typescript
  const publicRoutes = [
    "/",
    "/pricing",
    "/features",
    "/docs",
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
    "/api/auth",
  ];
  ```
- [x] Update route matching logic to handle nested paths

### 3. Create Route Placeholders
- [x] Create `src/app/(marketing)/pricing/page.tsx` (placeholder)
- [x] Create `src/app/(marketing)/features/page.tsx` (placeholder)
- [x] Create `src/app/(marketing)/docs/page.tsx` (placeholder)

### 4. Update Root Page
- [x] Update `src/app/page.tsx` to render landing content OR redirect
- [x] Option: Make root page the actual landing (recommended)

### 5. Testing
- [x] Verify `/` is accessible without auth
- [x] Verify `/pricing` is accessible without auth
- [x] Verify `/dashboard` still requires auth
- [x] Verify login redirect still works for protected routes

---

## Code Templates

### Updated Middleware (`src/middleware.ts`)
```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/pricing",
  "/features",
  "/docs",
  "/login",
  "/register",
  "/forgot-password",
  "/verify-email",
];

// Routes that start with these prefixes are public
const publicPrefixes = [
  "/api/auth",
  "/docs/",
];

function isPublicRoute(pathname: string): boolean {
  if (publicRoutes.includes(pathname)) return true;
  return publicPrefixes.some(prefix => pathname.startsWith(prefix));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    // If logged in and trying to access auth pages, redirect to dashboard
    if (isLoggedIn && ["/login", "/register"].includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
};
```

### Marketing Layout Placeholder (`src/app/(marketing)/layout.tsx`)
```typescript
import { ReactNode } from "react";

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar will be added in M2 */}
      <main className="flex-1">
        {children}
      </main>
      {/* Footer will be added in M2 */}
    </div>
  );
}
```

### Landing Page Placeholder (`src/app/(marketing)/page.tsx`)
```typescript
import { getTranslations } from "next-intl/server";

export default async function LandingPage() {
  const t = await getTranslations("landing");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold">WhatsApp Auto-Reply Bot</h1>
        <p className="text-muted-foreground mt-4">Landing page coming soon...</p>
      </div>
    </div>
  );
}
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/middleware.ts` | MODIFY | Add public routes for marketing pages |
| `src/app/(marketing)/layout.tsx` | CREATE | Marketing pages layout |
| `src/app/(marketing)/page.tsx` | CREATE | Landing page |
| `src/app/(marketing)/pricing/page.tsx` | CREATE | Pricing page placeholder |
| `src/app/(marketing)/features/page.tsx` | CREATE | Features page placeholder |
| `src/app/(marketing)/docs/page.tsx` | CREATE | Docs page placeholder |
| `src/app/page.tsx` | MODIFY | Update redirect logic or remove |

---

## Testing Instructions

```bash
# 1. Start dev server
npm run dev

# 2. Test public access (should work without login)
# Open browser: http://localhost:3000/
# Open browser: http://localhost:3000/pricing
# Open browser: http://localhost:3000/features

# 3. Test protected routes (should redirect to login)
# Open incognito: http://localhost:3000/dashboard

# 4. Test auth redirect (logged in users on login page)
# Login, then try: http://localhost:3000/login
# Should redirect to /dashboard

# 5. Run existing tests to ensure nothing broke
npm run test
npm run lint
```

---

## Acceptance Criteria

- [x] Marketing route group exists and is functional
- [x] Middleware correctly identifies public vs protected routes
- [x] All placeholder pages render without errors
- [x] Existing dashboard functionality unchanged
- [x] Auth flow still works correctly
- [x] All existing tests pass
- [x] No TypeScript errors
- [x] No ESLint errors

---

## Notes

- Keep placeholders minimal - actual content comes in Phase 2
- Ensure i18n works on new routes (use `getTranslations`)
- Marketing layout will be enhanced in M2 with navbar/footer
