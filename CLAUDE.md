# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WhatsApp Auto-Reply Bot SaaS - A production-ready Next.js 16 application with Stripe subscriptions, targeting Saudi/Egyptian markets with bilingual support (Arabic/English).

**Status:** Production Ready (v1.0.0)

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run all unit tests (192 tests)
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run Playwright E2E tests
npm run db:push      # Push schema changes
npm run db:seed      # Seed database with plans and admin
npm run db:studio    # Open Prisma Studio
npm run analyze      # Bundle analyzer
```

Docker:
```bash
docker-compose up -d      # Start app + PostgreSQL
docker-compose down       # Stop
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router + Turbopack
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth v5 (Credentials + JWT)
- **Payments**: Stripe (subscriptions, webhooks, billing portal)
- **i18n**: next-intl (Arabic RTL default, English)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Analytics**: Google Analytics (GA4)
- **WhatsApp**: @whiskeysockets/baileys
- **Email**: Resend

### Route Groups
- `(auth)/*` - Login, register, password reset, email verification
- `(dashboard)/*` - Protected dashboard (requires auth + email verification)
- `(marketing)/*` - Landing page, pricing, documentation

### Key Modules

**Subscription System** (`src/lib/services/`, `src/lib/stripe/`)
- 4 plans: Free, Starter ($9), Professional ($29), Enterprise ($99)
- Feature gating via `hasFeature()` and `canPerformAction()`
- Usage tracking (messages/month, rules limit)

**WhatsApp** (`src/lib/whatsapp/`)
- Baileys client with QR code connection
- Priority-based rule matching (EXACT, CONTAINS, STARTS_WITH, REGEX)

**API Error Handling** (`src/lib/api/error-handler.ts`)
- `APIError` class with pre-defined error factories
- `handleAPIError()` for catch blocks
- `withErrorHandler()` wrapper for routes

### Database Models (Prisma)

**Core:**
- `User` - Auth, email verification, Stripe customer ID
- `Contact`, `Message`, `AutoReplyRule`, `Settings`

**Subscription:**
- `Plan` - Tiers with limits and features
- `Subscription` - User subscriptions linked to Stripe
- `UsageRecord` - Monthly usage tracking

### i18n Configuration
- Default: Arabic (`ar`) with RTL
- Supported: `ar`, `en`
- Files: `messages/{locale}.json`

## Testing

- **Unit Tests**: 192 tests (Vitest)
- **E2E Tests**: Playwright
- **Type Check**: `npx tsc --noEmit`
- **Lint**: `npm run lint`

## Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`

**Optional:**
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics
- `GOOGLE_SHEET_ID`, `GOOGLE_SHEETS_CREDENTIALS`

**Default Credentials** (after `npm run db:seed`):
- Email: `admin@example.com`
- Password: `admin123`
