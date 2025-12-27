# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WhatsApp Auto-Reply Bot with Google Sheets integration. A SaaS Next.js 16 application with subscription billing (Stripe), targeting Saudi/Egyptian markets with bilingual support (Arabic/English).

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run all unit tests (vitest)
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
npm run db:migrate   # Run Prisma migrations
npm run db:push      # Push schema changes without migration
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio
```

Run a single test file:
```bash
npx vitest run tests/unit/matcher.test.ts
```

Docker:
```bash
docker-compose up -d      # Start app + PostgreSQL
docker-compose down       # Stop
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth v5 (beta) with Credentials provider + JWT strategy
- **i18n**: next-intl (Arabic default, supports English)
- **UI**: shadcn/ui + Tailwind CSS v4 with RTL support
- **Payments**: Stripe (subscriptions, webhooks)
- **WhatsApp**: @whiskeysockets/baileys
- **Sheets**: googleapis

### Route Groups
- `(auth)/*` - Login/register/password-reset pages
- `(dashboard)/*` - Protected dashboard pages (require email verification)

### Middleware & Auth Flow
The middleware (`src/middleware.ts`) wraps NextAuth's `auth()`:
- Public routes: `/`, `/login`, `/register`, `/pricing`, `/docs/*`, `/api/auth/*`
- Auth-only routes: `/verify-email` (logged in but unverified users)
- Protected routes require both authentication AND email verification
- Adds security headers (X-Frame-Options, CSP, etc.)

### Key Modules

**WhatsApp Integration** (`src/lib/whatsapp/`)
- `client.ts` - Baileys client with file-based session storage
- `matcher.ts` - Priority-based rule matching (EXACT, CONTAINS, STARTS_WITH, REGEX)

**Google Sheets Sync** (`src/lib/google-sheets/`)
- `sync.ts` - Batch sync for contacts and messages with sync logging

**Subscription System** (`src/lib/services/`, `src/lib/stripe/`, `src/lib/features/`)
- `plan.ts` - Plan management (free, starter, professional, enterprise)
- `subscription.ts` - User subscription lifecycle
- `usage.ts` - Usage tracking (messages, rules per billing period)
- Feature gating via `hasFeature()` and `requireFeature()`

**Security** (`src/lib/security/`)
- `rate-limit.ts` - Rate limiting for API routes
- `lockout.ts` - Account lockout after failed login attempts
- `audit.ts` - Audit logging for security events

**Auto-Reply Rules**
- Rules sorted by priority (higher first), only active rules evaluated
- TriggerTypes: EXACT, CONTAINS, STARTS_WITH, REGEX
- Regex patterns use case-insensitive matching

### Database Models (Prisma)
Core:
- `User` - Users with roles, email verification, Stripe customer ID
- `Contact` - WhatsApp contacts with message counts
- `Message` - Message history with sync status and direction
- `AutoReplyRule` - Trigger/response pairs with priority
- `Settings` - App configuration

Subscription:
- `Plan` - Subscription tiers with limits (messagesPerMonth, rulesLimit, features JSON)
- `Subscription` - User subscriptions linked to Stripe
- `UsageRecord` - Monthly usage tracking per subscription

Security:
- `VerificationToken`, `PasswordResetToken` - Auth tokens
- `AuditLog` - Security event logging
- `WebhookEvent` - Stripe webhook processing

### i18n Configuration
- Default locale: Arabic (`ar`)
- Locales: `ar`, `en`
- Translation files: `messages/{locale}.json`
- Direction auto-switches based on locale (RTL for Arabic)
- Config in `src/i18n/config.ts`

## Testing

Tests located in `tests/` directory:
- `tests/unit/` - Unit tests (vitest)
- `tests/e2e/` - E2E tests (Playwright)

Vitest uses Node environment with `@/` path alias.
Playwright runs against `http://localhost:3000` with auto-start dev server.

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth secret
- `NEXTAUTH_URL` - Application URL

Stripe (for subscriptions):
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

Optional:
- `GOOGLE_SHEET_ID`, `GOOGLE_SHEETS_CREDENTIALS` - Sheets integration
- `WHATSAPP_SESSION_PATH` - Custom session storage path
- `RESEND_API_KEY` - Email sending (verification, password reset)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` - Override seed defaults

Default credentials after `npm run db:seed`:
- Email: `admin@example.com`
- Password: `admin123`
