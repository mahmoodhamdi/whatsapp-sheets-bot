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
npm run analyze          # Bundle analyzer (sets ANALYZE=true)

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
- **Error Tracking**: Sentry (`@sentry/nextjs`)

### Path Alias
`@/*` maps to `./src/*` (configured in `tsconfig.json`). Always use `@/` imports.

### Route Groups (`src/app/`)
- `(auth)/*` - Login, register, password reset, email verification
- `(dashboard)/*` - Protected dashboard (requires auth + email verification)
- `(marketing)/*` - Landing page, pricing, documentation

### Middleware (`src/middleware.ts`)
- Uses NextAuth's `auth()` wrapper
- Public routes: `/`, `/pricing`, `/features`, `/docs`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/privacy`, `/terms`
- Public prefixes: `/api/auth`, `/docs/` (all sub-paths are public)
- Auth-only (no email verification): `/verify-email`
- All other routes require auth + verified email
- Adds security headers (CSP, HSTS, X-Frame-Options, etc.) to all responses

### Key Modules

**Subscription System** (`src/lib/services/`, `src/lib/features/`)
```typescript
// Feature gating (src/lib/features/index.ts)
await hasFeature(userId, "analytics")     // Returns boolean
await canUseFeature(userId, "analytics")  // Returns detailed result with upgradeUrl
await requireFeature(userId, "analytics") // Throws if unavailable

// Usage tracking (src/lib/services/usage.ts)
await canSendMessage(userId)  // Check message limit
await canCreateRule(userId)   // Check rule limit
```
- 4 plans: Free (50 msg), Starter ($9, 500 msg), Professional ($29, 5000 msg), Enterprise ($99, unlimited)
- Limits: -1 = unlimited, otherwise numeric per month

**WhatsApp** (`src/lib/whatsapp/`)
- Baileys client with QR code connection
- Rule matching (`matcher.ts`): rules sorted by `priority` field (higher number = higher priority), then first match wins. Matcher normalizes messages (lowercase + trim) before matching. REGEX triggers use the original (unnormalized) trigger pattern.

**Stripe Integration** (`src/lib/stripe/`)
- Webhook: `/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- `WebhookEvent` model ensures idempotent processing

**API Error Handling** (`src/lib/api/error-handler.ts`)
```typescript
// Pre-defined errors
throw Errors.Unauthorized();
throw Errors.FeatureNotAvailable("analytics", "Professional");
throw Errors.LimitReached("messages");
throw Errors.BadRequest("Invalid input", details);

// Wrapper with automatic error handling (catches ZodError, APIError, etc.)
export const POST = withErrorHandler(async (request) => { ... });
```

**Validation Schemas** (`src/lib/validations/`)
- `auth.ts` - registerSchema, loginSchema (Zod)
- `api.ts` - paginationSchema, searchSchema, contactsQuerySchema, messagesQuerySchema, analyticsQuerySchema, phoneSchema
- Use `parseQueryParams(searchParams, schema)` helper for API query param validation

**API Caching** (`src/lib/api/cache.ts`)
- `withCacheHeaders(data, cacheConfigs.short)` for response-level caching
- `withCache(key, fn, ttlMs)` for in-memory caching of expensive computations
- Pre-defined configs: `sensitive` (no-store), `short` (1min), `medium` (5min), `long` (1hr), `staticPublic` (1day)

**Security** (`src/lib/security/`)
- In-memory rate limiting with pre-configured limiters: `loginLimiter` (5/min), `registerLimiter` (3/min), `apiLimiter` (60/min), `verificationLimiter` (1/min)
- Account lockout (failedLoginAttempts, lockedUntil)
- Audit logging via `AuditLog` model
- Token management for password reset and email verification

**Environment Validation** (`src/lib/env.ts`)
- Zod schemas validate server and client env vars
- Stripe and Resend keys are optional in the schema (app runs without payments/email in dev)
- `checkProductionReadiness()` reports missing/warning env vars

### Database Schema

**Core Models:**
- `User` - with `stripeCustomerId`, `emailVerified`, lockout fields, `Role` enum (ADMIN/USER)
- `Contact` - WhatsApp contacts with message count
- `Message` - direction (INCOMING/OUTGOING), linked to Contact and AutoReplyRule, `syncedToSheets` flag
- `AutoReplyRule` - trigger, triggerType (EXACT/CONTAINS/STARTS_WITH/REGEX), response, priority, isActive
- `Settings` - singleton (id="default") for WhatsApp connection state, working hours

**Subscription Models:**
- `Plan` - slug, prices, limits (messagesPerMonth, rulesLimit), features JSON array
- `Subscription` - linked to User (1:1) and Plan, Stripe IDs, status, period dates
- `UsageRecord` - per-period message/rule counts, unique on (subscriptionId, periodStart)
- `WebhookEvent` - idempotent Stripe webhook processing

**Note:** AutoReplyRules are global (not per-user). Multi-tenant isolation is future work.

### Auth Details
- NextAuth v5 with JWT strategy, custom `emailVerified` field added to session/token
- Session update trigger refreshes `emailVerified` from DB
- Custom pages: signIn → `/login`
- `postinstall` runs `prisma generate` automatically

### i18n
- Default: Arabic (`ar`) with RTL
- Supported: `ar`, `en`
- Config: `src/i18n/config.ts` (locales, directions), translation files: `messages/{locale}.json`
- Always update both translation files when modifying UI text

### Feature Flags
Type-safe `Feature` type in `src/lib/features/index.ts`:
- `basic_support`, `priority_support`, `dedicated_support`
- `sheets_sync`, `analytics`, `api_access`
- `custom_integrations`, `sla`

`FEATURE_METADATA` maps each feature to its required plan slug for upgrade prompts.

## Testing

- Unit tests: `tests/unit/*.test.ts` (17 test files)
- Integration tests: `tests/integration/*.test.ts`
- E2E tests: `tests/e2e/*.spec.ts` (Playwright with Page Object Model in `tests/e2e/pages/`)
- Setup: `tests/setup.ts` (mocks env vars including DATABASE_URL, GOOGLE_SHEET_ID, AUTH_SECRET)
- Config: `vitest.config.ts` (node environment, `@` alias, 10s timeout), `playwright.config.ts`
- Vitest excludes `tests/e2e/**` from unit test runs

## Environment Variables

**Required (core):** `DATABASE_URL`, `NEXTAUTH_SECRET` (min 32 chars), `NEXTAUTH_URL`

**Required (features):** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `RESEND_API_KEY` - app runs without these in dev but subscriptions/email won't work

**Optional:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `GOOGLE_SHEET_ID`, `GOOGLE_SHEETS_CREDENTIALS`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `WHATSAPP_SESSION_PATH` (default: `./sessions`)

**Default Credentials** (after `npm run db:seed`): `admin@example.com` / `admin123`
