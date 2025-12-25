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
npm run db:migrate   # Run Prisma migrations
npm run db:push      # Push schema changes without migration
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio
```

Run a single test file:
```bash
npx vitest run tests/unit/matcher.test.ts
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
- `User` - Admin users with roles
- `Contact` - WhatsApp contacts with message counts
- `Message` - Message history with sync status
- `AutoReplyRule` - Trigger/response pairs with priority
- `Settings` - App configuration (WhatsApp status, default reply, working hours)
- `SyncLog` - Google Sheets sync history

### i18n Configuration
- Default locale: Arabic (`ar`)
- Locales: `ar`, `en`
- Translation files: `messages/{locale}.json`
- Direction auto-switches based on locale (RTL for Arabic)

## Testing

Tests located in `tests/` directory:
- `tests/unit/` - Unit tests (vitest)
- `tests/e2e/` - E2E tests (planned for Playwright)

Test configuration in `vitest.config.ts` uses Node environment with `@/` path alias.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - NextAuth secret
- `GOOGLE_SHEET_ID` - Target Google Sheet ID
- Google service account credentials for Sheets API
