# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WhatsApp Auto-Reply Bot with Google Sheets integration. A Next.js 16 application targeting Saudi/Egyptian markets (stores, clinics, restaurants) with bilingual support (Arabic/English).

## Commands

```bash
npm run dev          # Start development server
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
docker-compose logs -f    # View logs
docker-compose down       # Stop
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth v5 (beta) with Credentials provider + JWT strategy
- **i18n**: next-intl (Arabic default, supports English)
- **UI**: shadcn/ui + Tailwind CSS v4 with RTL support
- **WhatsApp**: @whiskeysockets/baileys
- **Sheets**: googleapis

### Route Groups
- `(auth)/*` - Login pages (unauthenticated)
- `(dashboard)/*` - Protected dashboard pages

### Middleware & Auth Flow
The middleware (`src/middleware.ts`) wraps NextAuth's `auth()` and:
- Redirects unauthenticated users to `/login` (except for public routes)
- Redirects authenticated users away from `/login` to `/dashboard`
- Public routes: `/login`, `/api/auth/*`

### Key Modules

**WhatsApp Integration** (`src/lib/whatsapp/`)
- `client.ts` - Baileys client with file-based session storage
- `matcher.ts` - Priority-based rule matching (EXACT, CONTAINS, STARTS_WITH, REGEX)

**Google Sheets Sync** (`src/lib/google-sheets/`)
- `sync.ts` - Batch sync for contacts and messages with sync logging

**Auto-Reply Rules**
- Rules sorted by priority (higher first), only active rules evaluated
- TriggerTypes: EXACT, CONTAINS, STARTS_WITH, REGEX
- Regex patterns use case-insensitive matching

### Database Models (Prisma)
- `User` - Admin users with roles (ADMIN, USER)
- `Contact` - WhatsApp contacts with message counts
- `Message` - Message history with sync status and direction (INCOMING/OUTGOING)
- `AutoReplyRule` - Trigger/response pairs with priority
- `Settings` - App configuration (WhatsApp status, default reply, working hours)
- `SyncLog` - Google Sheets sync history

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

Test setup file: `tests/setup.ts`
Vitest config uses Node environment with `@/` path alias.
Playwright runs against `http://localhost:3000` with auto-start dev server.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth secret
- `NEXTAUTH_URL` - Application URL (e.g., `http://localhost:3000`)

Optional:
- `GOOGLE_SHEET_ID` - Target Google Sheet ID
- `GOOGLE_SHEETS_CREDENTIALS` - Base64 encoded service account JSON
- `WHATSAPP_SESSION_PATH` - Custom session storage path
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` - Override seed defaults

Default credentials after `npm run db:seed`:
- Email: `admin@example.com`
- Password: `admin123`
