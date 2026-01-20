# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WhatsApp Auto-Reply Bot SaaS - A production-ready Next.js 16 application with Stripe subscriptions, targeting Saudi/Egyptian markets with bilingual support (Arabic/English).

## Commands

```bash
# Development
npm run dev              # Start dev server (Turbopack)
npm run build            # Production build
npm run lint             # ESLint
npx tsc --noEmit         # Type check

# Testing
npm run test             # Run all unit tests (Vitest)
npm run test:watch       # Watch mode
npx vitest tests/unit/matcher.test.ts           # Single file
npx vitest -t "should match exact trigger"      # By pattern
npm run test:e2e         # Playwright E2E tests
npm run test:e2e:ui      # Playwright UI mode

# Database
npm run db:push          # Push schema (dev)
npm run db:migrate       # Create migration (prod)
npm run db:seed          # Seed admin + plans
npm run db:studio        # Prisma Studio
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 + App Router + Turbopack
- **Database**: PostgreSQL + Prisma ORM
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
- Uses NextAuth's `auth()` wrapper
- Public routes: `/`, `/pricing`, `/features`, `/docs`, `/docs/*`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/privacy`, `/terms`
- Auth-only (no email verification): `/verify-email`
- All other routes require auth + verified email
- Adds security headers to all responses

### Key Modules

**Subscription System** (`src/lib/services/`, `src/lib/features/`)
```typescript
// Feature gating
await hasFeature(userId, "analytics")     // Returns boolean
await canUseFeature(userId, "analytics")  // Returns detailed result
await requireFeature(userId, "analytics") // Throws if unavailable

// Usage tracking
await canSendMessage(userId)  // Check message limit
await canCreateRule(userId)   // Check rule limit
```
- 4 plans: Free (50 msg), Starter ($9, 500 msg), Professional ($29, 5000 msg), Enterprise ($99, unlimited)
- Limits: -1 = unlimited, otherwise numeric per month

**WhatsApp** (`src/lib/whatsapp/`)
- Baileys client with QR code connection
- Rule matching priority: EXACT > CONTAINS > STARTS_WITH > REGEX (by priority field, then type)
- Matcher normalizes messages (lowercase + trim) before matching

**Stripe Integration** (`src/lib/stripe/`)
- Webhook: `/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

**API Error Handling** (`src/lib/api/error-handler.ts`)
```typescript
// Pre-defined errors
throw Errors.Unauthorized();
throw Errors.FeatureNotAvailable("analytics", "Professional");
throw Errors.LimitReached("messages");
throw Errors.BadRequest("Invalid input", details);

// Wrapper with automatic error handling
export const POST = withErrorHandler(async (request) => {
  // auto-catches and formats ZodError, APIError, etc.
});
```

**Security** (`src/lib/security/`)
- Rate limiting, account lockout (failedLoginAttempts, lockedUntil)
- Audit logging via `AuditLog` model
- Token management for password reset and email verification

### Database Schema

**Core Models:**
- `User` - with `stripeCustomerId`, `emailVerified`, lockout fields
- `Contact` - WhatsApp contacts with message count
- `Message` - direction (INCOMING/OUTGOING), linked to Contact and AutoReplyRule
- `AutoReplyRule` - trigger, triggerType, response, priority, isActive
- `Settings` - singleton for WhatsApp connection state, working hours

**Subscription Models:**
- `Plan` - slug, prices, limits (messagesPerMonth, rulesLimit), features JSON
- `Subscription` - linked to User and Plan, Stripe IDs, status, period dates
- `UsageRecord` - per-period message/rule counts
- `WebhookEvent` - idempotent Stripe webhook processing

**Note:** AutoReplyRules are global (not per-user). Multi-tenant isolation is future work.

### i18n
- Default: Arabic (`ar`) with RTL
- Supported: `ar`, `en`
- Files: `messages/{locale}.json`
- Always update both translation files when modifying UI text

### Feature Flags
Type-safe `Feature` type in `src/lib/features/index.ts`:
- `basic_support`, `priority_support`, `dedicated_support`
- `sheets_sync`, `analytics`, `api_access`
- `custom_integrations`, `sla`

## Testing

- Unit tests: `tests/unit/*.test.ts`
- Integration tests: `tests/integration/*.test.ts`
- E2E tests: `tests/e2e/*.spec.ts` (Playwright with Page Object Model in `tests/e2e/pages/`)
- Setup: `tests/setup.ts` (mocks env vars)
- Config: `vitest.config.ts`, `playwright.config.ts`

## Environment Variables

**Required:** `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `RESEND_API_KEY`

**Optional:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `GOOGLE_SHEET_ID`, `GOOGLE_SHEETS_CREDENTIALS`

**Default Credentials** (after `npm run db:seed`): `admin@example.com` / `admin123`
