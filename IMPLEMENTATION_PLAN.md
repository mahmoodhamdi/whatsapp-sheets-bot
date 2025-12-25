# Implementation Plan: WhatsApp Auto-Reply Bot + Google Sheets

## Overview

This document outlines the implementation plan for building a WhatsApp auto-reply bot with Google Sheets integration. The project targets the Saudi and Egyptian markets (stores, clinics, restaurants).

---

## Phase 1: Project Setup & Infrastructure

### Step 1.1: Initialize Next.js Project
**Files to create/modify:**
- `package.json`
- `next.config.js`
- `tsconfig.json`
- `.gitignore`
- `.env.example`

**Actions:**
1. Initialize Next.js 14 with TypeScript and App Router
2. Configure TypeScript with strict mode
3. Setup path aliases (@/*)
4. Add .gitignore with proper exclusions

**Testing:**
- Run `npm run dev` and verify localhost:3000 works

---

### Step 1.2: Setup Prisma & Database Schema
**Files to create/modify:**
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/lib/prisma.ts`

**Actions:**
1. Install Prisma and configure PostgreSQL
2. Create all models (User, Contact, Message, AutoReplyRule, Settings, SyncLog)
3. Setup Prisma client singleton
4. Create seed script for initial data

**Testing:**
- Run `npx prisma migrate dev`
- Run `npx prisma db seed`
- Verify tables created in PostgreSQL

---

### Step 1.3: Configure Tailwind CSS & shadcn/ui
**Files to create/modify:**
- `tailwind.config.ts`
- `src/app/globals.css`
- `components.json`
- `src/components/ui/*` (shadcn components)

**Actions:**
1. Configure Tailwind with RTL support
2. Add Arabic font (Cairo/Tajawal)
3. Setup shadcn/ui with proper theme
4. Install essential components (Button, Input, Card, Table, Dialog, etc.)

**Testing:**
- Create test component with RTL text
- Verify styling works correctly

---

### Step 1.4: Setup i18n (English/Arabic)
**Files to create/modify:**
- `src/i18n/settings.ts`
- `src/i18n/client.ts`
- `public/locales/en/common.json`
- `public/locales/ar/common.json`
- `src/components/providers/I18nProvider.tsx`

**Actions:**
1. Install and configure next-intl
2. Create translation files (EN/AR)
3. Setup language switcher
4. Configure RTL/LTR based on language

**Testing:**
- Switch between EN/AR
- Verify RTL layout for Arabic

---

## Phase 2: Authentication

### Step 2.1: NextAuth Configuration
**Files to create/modify:**
- `src/lib/auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/types/next-auth.d.ts`

**Actions:**
1. Configure NextAuth with Credentials provider
2. Setup JWT strategy
3. Add session callback with user role
4. Create auth middleware

**Testing:**
- Test login with seeded admin user
- Verify session persistence

---

### Step 2.2: Login Page
**Files to create/modify:**
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/layout.tsx`

**Actions:**
1. Create login form with email/password
2. Add validation with Zod
3. Handle errors and loading states
4. Redirect to dashboard on success

**Testing:**
- Login with correct credentials
- Test error handling with wrong credentials

---

## Phase 3: Dashboard Layout

### Step 3.1: Dashboard Layout & Navigation
**Files to create/modify:**
- `src/app/(dashboard)/layout.tsx`
- `src/components/dashboard/Sidebar.tsx`
- `src/components/dashboard/Header.tsx`
- `src/components/dashboard/MobileNav.tsx`

**Actions:**
1. Create responsive sidebar with navigation links
2. Add header with user menu and language switcher
3. Implement mobile navigation
4. Add RTL support

**Testing:**
- Navigate between all pages
- Test responsive behavior
- Test RTL layout

---

### Step 3.2: Dashboard Overview Page
**Files to create/modify:**
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/StatsCard.tsx`
- `src/components/dashboard/RecentMessages.tsx`
- `src/components/dashboard/TopContacts.tsx`

**Actions:**
1. Create stats cards (Total Messages, Contacts, Active Rules, Today's Messages)
2. Add recent messages list
3. Add top contacts widget
4. Implement data fetching with React Query

**Testing:**
- Verify stats display correctly
- Test with empty state
- Test with sample data

---

## Phase 4: Core Features (CRUD)

### Step 4.1: Contacts API & Page
**Files to create/modify:**
- `src/app/api/contacts/route.ts`
- `src/app/api/contacts/[id]/route.ts`
- `src/app/(dashboard)/dashboard/contacts/page.tsx`
- `src/components/dashboard/DataTable.tsx`

**Actions:**
1. Create GET (list), DELETE endpoints
2. Implement pagination and search
3. Create contacts table with sorting
4. Add contact detail view

**Testing:**
- List contacts with pagination
- Search contacts
- Delete contact

---

### Step 4.2: Messages API & Page
**Files to create/modify:**
- `src/app/api/messages/route.ts`
- `src/app/api/messages/[contactId]/route.ts`
- `src/app/api/messages/send/route.ts`
- `src/app/(dashboard)/dashboard/messages/page.tsx`

**Actions:**
1. Create GET (list with filters), POST (send) endpoints
2. Implement filtering by direction, date, contact
3. Create messages list with filters
4. Add manual send message feature

**Testing:**
- List messages with filters
- View messages by contact
- Send manual message

---

### Step 4.3: Auto-Reply Rules API & Pages
**Files to create/modify:**
- `src/app/api/rules/route.ts`
- `src/app/api/rules/[id]/route.ts`
- `src/app/api/rules/[id]/toggle/route.ts`
- `src/app/(dashboard)/dashboard/rules/page.tsx`
- `src/app/(dashboard)/dashboard/rules/new/page.tsx`
- `src/app/(dashboard)/dashboard/rules/[id]/page.tsx`
- `src/components/rules/RuleForm.tsx`
- `src/components/rules/RuleList.tsx`

**Actions:**
1. Create full CRUD + toggle endpoints
2. Create rules list with active toggle
3. Create rule form (create/edit)
4. Add rule preview/test feature

**Testing:**
- Create new rule
- Edit existing rule
- Toggle rule active status
- Delete rule

---

## Phase 5: WhatsApp Integration

### Step 5.1: Baileys Client Setup
**Files to create/modify:**
- `src/lib/whatsapp/client.ts`
- `src/lib/whatsapp/handlers.ts`
- `src/lib/whatsapp/matcher.ts`
- `src/lib/whatsapp/types.ts`

**Actions:**
1. Initialize Baileys with file-based session storage
2. Create connection event handlers
3. Create message event handlers
4. Implement auto-reply matcher logic

**Matcher Logic:**
```typescript
// Priority-based matching
// 1. Sort rules by priority (higher first)
// 2. For each rule:
//    - EXACT: message === trigger
//    - CONTAINS: message.includes(trigger)
//    - STARTS_WITH: message.startsWith(trigger)
//    - REGEX: new RegExp(trigger).test(message)
// 3. Return first matching rule's response
```

**Testing:**
- Unit tests for matcher
- Manual WhatsApp connection test

---

### Step 5.2: WhatsApp API Endpoints
**Files to create/modify:**
- `src/app/api/whatsapp/status/route.ts`
- `src/app/api/whatsapp/connect/route.ts`
- `src/app/api/whatsapp/disconnect/route.ts`
- `src/app/api/whatsapp/qr/route.ts`

**Actions:**
1. Create status endpoint (connected/disconnected)
2. Create connect endpoint (returns QR or connects)
3. Create disconnect endpoint
4. Create QR endpoint (SSE for real-time QR updates)

**Testing:**
- Connect via QR scan
- Check status
- Disconnect

---

### Step 5.3: WhatsApp Settings UI
**Files to create/modify:**
- `src/app/(dashboard)/dashboard/settings/whatsapp/page.tsx`
- `src/components/whatsapp/QRCode.tsx`
- `src/components/whatsapp/ConnectionStatus.tsx`
- `src/hooks/useWhatsApp.ts`

**Actions:**
1. Create QR code display component
2. Create connection status indicator
3. Add connect/disconnect buttons
4. Implement auto-refresh for QR

**Testing:**
- Display QR code
- Show connection status
- Connect/disconnect functionality

---

## Phase 6: Google Sheets Integration

### Step 6.1: Google Sheets Client
**Files to create/modify:**
- `src/lib/google-sheets/client.ts`
- `src/lib/google-sheets/sync.ts`
- `src/lib/google-sheets/types.ts`

**Actions:**
1. Configure googleapis with service account
2. Create sync functions:
   - syncContacts: Sync contacts to "Contacts" sheet
   - syncMessages: Sync messages to "Messages" sheet
   - syncLogs: Log sync events
3. Implement batch updates for efficiency

**Sheet Structure:**
```
Contacts Sheet:
| Phone | Name | First Contact | Last Contact | Message Count |

Messages Sheet:
| Timestamp | Phone | Direction | Content | Rule Used | Status |
```

**Testing:**
- Unit tests for sync functions
- Manual sync test

---

### Step 6.2: Google Sheets API & Settings
**Files to create/modify:**
- `src/app/api/sheets/status/route.ts`
- `src/app/api/sheets/connect/route.ts`
- `src/app/api/sheets/sync/route.ts`
- `src/app/api/sheets/logs/route.ts`
- `src/app/(dashboard)/dashboard/settings/sheets/page.tsx`

**Actions:**
1. Create status endpoint (checks sheet access)
2. Create manual sync endpoint
3. Create sync logs endpoint
4. Create settings page with sync controls

**Testing:**
- Check connection status
- Manual sync trigger
- View sync logs

---

## Phase 7: Settings & Analytics

### Step 7.1: General Settings
**Files to create/modify:**
- `src/app/api/settings/route.ts`
- `src/app/(dashboard)/dashboard/settings/page.tsx`

**Actions:**
1. Create GET/PUT settings endpoints
2. Create settings form (business name, default reply, working hours)
3. Add validation

**Testing:**
- Update settings
- Verify persistence

---

### Step 7.2: Analytics API & Dashboard
**Files to create/modify:**
- `src/app/api/analytics/overview/route.ts`
- `src/app/api/analytics/messages/route.ts`
- `src/app/api/analytics/rules/route.ts`
- `src/components/dashboard/Charts.tsx`
- `src/hooks/useAnalytics.ts`

**Actions:**
1. Create overview endpoint (aggregate stats)
2. Create messages trend endpoint (by date)
3. Create rules performance endpoint
4. Add Recharts visualizations

**Testing:**
- Verify chart rendering
- Test with various date ranges

---

## Phase 8: Testing

### Step 8.1: Unit Tests
**Files to create/modify:**
- `tests/unit/matcher.test.ts`
- `tests/unit/sync.test.ts`
- `vitest.config.ts`

**Actions:**
1. Configure Vitest
2. Write matcher tests (all trigger types)
3. Write sync tests (mocked Google Sheets)

---

### Step 8.2: E2E Tests
**Files to create/modify:**
- `tests/e2e/auth.spec.ts`
- `tests/e2e/rules.spec.ts`
- `tests/e2e/dashboard.spec.ts`
- `playwright.config.ts`

**Actions:**
1. Configure Playwright
2. Write auth flow tests
3. Write rules CRUD tests
4. Write dashboard tests

---

## Phase 9: Docker & CI/CD

### Step 9.1: Docker Configuration
**Files to create/modify:**
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

**Actions:**
1. Create multi-stage Dockerfile
2. Create docker-compose with app + postgres
3. Configure volumes for sessions

**Testing:**
- Build and run with docker-compose
- Verify all services work

---

### Step 9.2: GitHub Actions CI/CD
**Files to create/modify:**
- `.github/workflows/ci.yml`

**Actions:**
1. Setup test job (lint, unit tests, build, e2e)
2. Setup build-push job (Docker image)
3. Configure secrets

**Testing:**
- Push to trigger workflow
- Verify all jobs pass

---

## Implementation Order (Commits)

| # | Commit Message | Phase |
|---|----------------|-------|
| 1 | chore: initial project setup with Next.js 14 | 1.1 |
| 2 | chore: add Prisma and database schema | 1.2 |
| 3 | chore: configure Tailwind CSS and shadcn/ui | 1.3 |
| 4 | chore: setup i18n with next-intl (EN/AR) | 1.4 |
| 5 | feat: add authentication with NextAuth | 2.1 |
| 6 | feat: implement login page with RTL support | 2.2 |
| 7 | feat: create dashboard layout and navigation | 3.1 |
| 8 | feat: add dashboard overview with stats | 3.2 |
| 9 | feat: implement contacts CRUD API | 4.1 |
| 10 | feat: create contacts list page | 4.1 |
| 11 | feat: implement messages API | 4.2 |
| 12 | feat: create messages page with filters | 4.2 |
| 13 | feat: implement auto-reply rules CRUD API | 4.3 |
| 14 | feat: create rules management page | 4.3 |
| 15 | feat: add rule creation/edit form | 4.3 |
| 16 | feat: integrate WhatsApp with Baileys | 5.1 |
| 17 | feat: implement QR code connection flow | 5.2, 5.3 |
| 18 | feat: add message matching engine | 5.1 |
| 19 | feat: implement auto-reply handler | 5.1 |
| 20 | feat: integrate Google Sheets API | 6.1 |
| 21 | feat: add sheets sync functionality | 6.2 |
| 22 | feat: implement settings page | 7.1 |
| 23 | feat: add analytics API and charts | 7.2 |
| 24 | test: add unit tests for matcher | 8.1 |
| 25 | test: add unit tests for sync | 8.1 |
| 26 | test: add E2E tests for auth flow | 8.2 |
| 27 | test: add E2E tests for rules CRUD | 8.2 |
| 28 | test: add E2E tests for dashboard | 8.2 |
| 29 | chore: add Docker configuration | 9.1 |
| 30 | chore: setup GitHub Actions CI/CD | 9.2 |
| 31 | docs: add README with screenshots | - |
| 32 | chore: final cleanup and optimization | - |

---

## How It Works (After Implementation)

### Flow 1: WhatsApp Connection
```
User opens Settings > WhatsApp
  -> Frontend calls GET /api/whatsapp/status
  -> If disconnected, calls POST /api/whatsapp/connect
  -> Backend initializes Baileys client
  -> QR code generated and sent via SSE
  -> User scans with WhatsApp mobile app
  -> Connection established, session saved
  -> Status updated to "connected"
```

### Flow 2: Auto-Reply Processing
```
Customer sends message to WhatsApp number
  -> Baileys receives message event
  -> Handler extracts message content and sender
  -> Contact created/updated in database
  -> Message logged in database
  -> Matcher checks message against active rules
  -> If match found:
     -> Response sent via Baileys
     -> Outgoing message logged
  -> If no match:
     -> Default reply sent (if configured)
  -> Google Sheets sync triggered (async)
```

### Flow 3: Google Sheets Sync
```
Background job or manual trigger
  -> Fetch unsync'd messages from database
  -> Connect to Google Sheets API
  -> Append rows to Messages sheet
  -> Update Contacts sheet with latest info
  -> Mark messages as synced
  -> Log sync event
```

### Flow 4: Rule Management
```
Admin creates rule:
  -> Name: "Price Inquiry"
  -> Trigger: "price|سعر|كم"
  -> Type: REGEX
  -> Response: "أسعارنا تبدأ من..."
  -> Priority: 10

When message "كم السعر؟" received:
  -> Matcher tests regex against message
  -> Regex matches "سعر"
  -> Response sent automatically
```

---

## Dependencies

### Production
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "@prisma/client": "^5.0.0",
  "next-auth": "^4.24.0",
  "next-intl": "^3.0.0",
  "@tanstack/react-query": "^5.0.0",
  "@whiskeysockets/baileys": "^6.0.0",
  "googleapis": "^130.0.0",
  "zod": "^3.22.0",
  "recharts": "^2.10.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "lucide-react": "^0.300.0"
}
```

### Development
```json
{
  "typescript": "^5.0.0",
  "prisma": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "vitest": "^1.0.0",
  "@playwright/test": "^1.40.0",
  "eslint": "^8.0.0"
}
```

---

## Security Considerations

1. **Environment Variables**: Never commit `.env` - use `.env.example` as template
2. **Authentication**: All API routes protected with NextAuth session
3. **Input Validation**: Zod schemas for all inputs
4. **SQL Injection**: Prisma handles parameterized queries
5. **XSS**: React escapes by default
6. **CSRF**: NextAuth includes CSRF protection
7. **Rate Limiting**: Consider adding for production
8. **WhatsApp Session**: Stored locally, not in database

---

## Notes

- Each commit should have passing tests before push
- Arabic translations must be complete for each feature
- RTL layout must be tested for each component
- Mobile responsiveness required for all pages
