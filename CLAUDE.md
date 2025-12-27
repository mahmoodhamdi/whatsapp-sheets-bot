# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WhatsApp Auto-Reply Bot SaaS - A production-ready Next.js 16 application with Stripe subscriptions, targeting Saudi/Egyptian markets with bilingual support (Arabic/English).

## Commands

```bash
# Development
npm run dev              # Start dev server (Turbopack)
npm run build            # Production build
npm run start            # Production server
npm run lint             # Run ESLint
npx tsc --noEmit         # Type check

# Testing
npm run test             # Run all unit tests (Vitest)
npm run test:watch       # Run tests in watch mode
npx vitest tests/unit/matcher.test.ts           # Run single test file
npx vitest -t "should match exact trigger"      # Run tests by name pattern
npm run test:e2e         # Run Playwright E2E tests
npm run test:e2e:ui      # Playwright with UI

# Database
npm run db:push          # Push schema changes (dev)
npm run db:migrate       # Create migration (production)
npm run db:seed          # Seed database (creates admin + subscription plans)
npm run db:studio        # Open Prisma Studio

# Analysis (Windows)
npm run analyze          # Bundle analyzer
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router + Turbopack
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth v5 (Credentials + JWT)
- **Payments**: Stripe (subscriptions, webhooks, billing portal)
- **i18n**: next-intl (Arabic RTL default, English)
- **UI**: shadcn/ui + Tailwind CSS v4
- **WhatsApp**: @whiskeysockets/baileys
- **Email**: Resend

### Route Groups (`src/app/`)
- `(auth)/*` - Login, register, password reset, email verification
- `(dashboard)/*` - Protected dashboard (requires auth + email verification)
- `(marketing)/*` - Landing page, pricing, documentation

### Middleware (`src/middleware.ts`)
- Uses NextAuth's `auth()` wrapper for session validation
- Public routes: `/`, `/pricing`, `/features`, `/docs`, `/login`, `/register`, `/forgot-password`, `/reset-password`
- Auth-only routes (no email verification required): `/verify-email`
- All other routes require auth + verified email, redirect to `/verify-email` or `/login`
- Adds security headers (X-Frame-Options, CSP, etc.) to all responses

### Key Modules

**Subscription System** (`src/lib/services/`, `src/lib/features/`)
- 4 plans: Free, Starter ($9), Professional ($29), Enterprise ($99)
- Feature gating: `hasFeature(userId, feature)` and `canUseFeature(userId, feature)`
- Usage tracking: `canSendMessage(userId)`, `canCreateRule(userId)`
- Limits: -1 = unlimited, otherwise numeric limit per month
- For API routes requiring features: `await requireFeature(userId, "analytics")`

**WhatsApp** (`src/lib/whatsapp/`)
- Baileys client with QR code connection
- Priority-based rule matching: EXACT > CONTAINS > STARTS_WITH > REGEX

**Stripe Integration** (`src/lib/stripe/`)
- Webhook endpoint: `/api/webhooks/stripe`
- Handles: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

**API Error Handling** (`src/lib/api/error-handler.ts`)
```typescript
// Use pre-defined errors
throw Errors.Unauthorized();
throw Errors.FeatureNotAvailable("analytics", "Professional");
throw Errors.LimitReached("messages");

// Or wrap routes with automatic error handling
export const POST = withErrorHandler(async (request) => {
  // auto-catches and formats errors
});
```

**Security** (`src/lib/security/`)
- Rate limiting, account lockout, audit logging
- Password reset and email verification token management

### Database Models (Prisma)

**Core:** `User`, `Contact`, `Message`, `AutoReplyRule`, `Settings`

**Subscription:** `Plan`, `Subscription`, `UsageRecord`, `WebhookEvent`

**Security:** `VerificationToken`, `PasswordResetToken`, `AuditLog`

**Note:** AutoReplyRules are currently global (not per-user). Multi-tenant rule isolation is noted as future work in code comments.

### i18n Configuration
- Default: Arabic (`ar`) with RTL
- Supported: `ar`, `en`
- Files: `messages/{locale}.json`
- Always update both translation files when modifying UI text

### Feature Flags
Features stored in Plan.features JSON array:
- `basic_support`, `priority_support`, `dedicated_support`
- `sheets_sync`, `analytics`, `api_access`
- `custom_integrations`, `sla`

Type-safe feature checking via `Feature` type in `src/lib/features/index.ts`

## Testing

Tests in `tests/` directory, config in `vitest.config.ts`:
- Unit tests: `tests/unit/*.test.ts`
- E2E tests: `tests/e2e/` (Playwright)
- Setup: `tests/setup.ts` (mocks env vars)

Run tests before pushing changes.

## Environment Variables

**Required:** `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `RESEND_API_KEY`

**Optional:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `GOOGLE_SHEET_ID`, `GOOGLE_SHEETS_CREDENTIALS`

**Default Credentials** (after `npm run db:seed`): `admin@example.com` / `admin123`
