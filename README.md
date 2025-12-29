# WhatsApp Auto-Reply Bot SaaS

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A production-ready WhatsApp auto-reply SaaS with Stripe subscriptions, Google Sheets sync, and bilingual support (Arabic/English)**

[Live Demo](#) • [Features](#features) • [Installation](#installation) • [Documentation](./docs/README.md)

</div>

---

## Overview

A complete SaaS solution for automating WhatsApp responses, built for small businesses in Saudi Arabia and Egypt. Features include subscription-based pricing, a marketing landing page, comprehensive documentation, and a powerful dashboard.

### Target Audience
- Stores & Retail
- Clinics & Healthcare
- Restaurants & Food Services
- Any business needing WhatsApp automation

---

## Features

### SaaS Features
- **Subscription Plans** - Free, Starter ($9), Professional ($29), Enterprise ($99)
- **Stripe Integration** - Secure payments, billing portal, usage tracking
- **Feature Gating** - Plan-based access to features
- **Usage Limits** - Messages and rules limits per plan

### Marketing & SEO
- **Landing Page** - Hero, features, pricing, testimonials, FAQ sections
- **SEO Optimized** - Metadata, sitemap, robots.txt, structured data
- **Analytics** - Google Analytics (GA4) integration
- **Bilingual** - Arabic (RTL) and English support

### Core Features
- **Smart Auto-Reply** - Exact match, contains, starts with, regex patterns
- **WhatsApp Web** - QR code connection via Baileys
- **Google Sheets Sync** - Auto-sync contacts and messages
- **Working Hours** - Schedule when auto-replies are active

### Dashboard
- **Real-time Stats** - Messages, contacts, rule performance
- **Contact Management** - View, search, paginate contacts
- **Message History** - Complete log with filtering
- **Rule Management** - CRUD with priority ordering
- **Account Settings** - Profile, password, preferences
- **Dark Mode** - Full theme support

### Production Ready
- **Error Handling** - Global error boundaries, custom 404/500 pages
- **Loading States** - Skeleton loaders for all pages
- **API Caching** - Optimized response times
- **Type Safety** - Full TypeScript coverage

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL 15 + Prisma ORM |
| **Auth** | NextAuth v5 (Credentials + JWT) |
| **Payments** | Stripe (Subscriptions, Webhooks) |
| **WhatsApp** | @whiskeysockets/baileys |
| **Email** | Resend (Transactional) |
| **i18n** | next-intl (Arabic RTL + English) |
| **UI** | Tailwind CSS v4 + shadcn/ui |
| **Analytics** | Google Analytics (GA4) |
| **Testing** | Vitest + Playwright |
| **Deployment** | Docker, Netlify, DigitalOcean |

---

## Subscription Plans

| Plan | Price | Messages | Rules | Features |
|------|-------|----------|-------|----------|
| **Free** | $0/mo | 50/mo | 1 | Basic auto-reply |
| **Starter** | $9/mo | 500/mo | 10 | + Google Sheets sync |
| **Professional** | $29/mo | 5,000/mo | Unlimited | + Priority support, Analytics |
| **Enterprise** | $99/mo | Unlimited | Unlimited | + Custom integrations, Dedicated support |

---

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Stripe account (for payments)

### Installation

```bash
# Clone repository
git clone https://github.com/mahmoodhamdi/whatsapp-sheets-bot.git
cd whatsapp-sheets-bot

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:push
npm run db:seed

# Start development
npm run dev
```

### Docker

```bash
docker-compose up -d
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|:--------:|
| `DATABASE_URL` | PostgreSQL connection | ✅ |
| `NEXTAUTH_SECRET` | Auth secret key | ✅ |
| `NEXTAUTH_URL` | Application URL | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | ✅ |
| `RESEND_API_KEY` | Email service key | ✅ |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID | ❌ |
| `GOOGLE_SHEETS_CREDENTIALS` | Base64 service account | ❌ |
| `GOOGLE_SHEET_ID` | Target spreadsheet ID | ❌ |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth pages (login, register, reset)
│   ├── (dashboard)/      # Protected dashboard
│   ├── (marketing)/      # Landing page, pricing, docs
│   └── api/              # API routes
├── components/
│   ├── analytics/        # Google Analytics
│   ├── dashboard/        # Dashboard UI
│   ├── marketing/        # Landing page sections
│   ├── providers/        # Context providers
│   ├── seo/              # Structured data
│   ├── settings/         # Account settings
│   ├── subscription/     # Billing components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── api/              # API error handling
│   ├── google-sheets/    # Sheets integration
│   ├── services/         # Business logic
│   ├── stripe/           # Stripe integration
│   └── whatsapp/         # Baileys client
└── i18n/                 # Translations (ar, en)
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/[...nextauth]` | NextAuth handlers |
| POST | `/api/auth/forgot-password` | Password reset request |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/verify-email` | Email verification |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscription` | Get current subscription |
| POST | `/api/stripe/checkout` | Create checkout session |
| POST | `/api/stripe/portal` | Open billing portal |
| POST | `/api/subscription/cancel` | Cancel subscription |
| POST | `/api/subscription/resume` | Resume subscription |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PUT | `/api/user/profile` | User profile |
| PUT | `/api/user/password` | Change password |
| DELETE | `/api/user/delete` | Delete account |

### Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/rules` | Auto-reply rules |
| GET | `/api/contacts` | Contact list |
| GET | `/api/messages` | Message history |
| POST | `/api/messages/send` | Send message |
| GET/POST | `/api/whatsapp/*` | WhatsApp connection |
| POST | `/api/sheets/sync` | Trigger sync |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint check |
| `npm run test` | Unit & integration tests (247 tests) |
| `npm run test:e2e` | E2E tests |
| `npm run db:push` | Push schema |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Prisma Studio |
| `npm run analyze` | Bundle analyzer |

---

## Testing

```bash
# Unit & integration tests (247 tests)
npm run test

# E2E tests (95 tests)
npm run test:e2e

# Run specific test file
npx vitest tests/unit/matcher.test.ts

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

---

## Deployment

### Netlify / Vercel / DigitalOcean

1. Connect your repository
2. Set environment variables
3. Deploy

### Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Stripe Webhooks

Configure webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`

Events to subscribe:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

---

## Default Credentials

After `npm run db:seed`:
- **Email**: `admin@example.com`
- **Password**: `admin123`

---

## Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Verify DATABASE_URL format
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

#### Prisma Client Not Generated
```bash
npx prisma generate
```

#### WhatsApp QR Code Not Showing
- Ensure no other WhatsApp Web session is active
- Clear the `sessions/` folder and reconnect
- Check browser console for WebSocket errors

#### Stripe Webhooks Not Working
- Verify `STRIPE_WEBHOOK_SECRET` matches your endpoint secret
- For local development, use Stripe CLI:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Email Verification Not Sending
- Verify `RESEND_API_KEY` is set correctly
- Check Resend dashboard for delivery status
- Ensure sender domain is verified

### Getting Help

- [GitHub Issues](https://github.com/mahmoodhamdi/whatsapp-sheets-bot/issues)
- Check existing issues before creating new ones
- Include error logs and environment details

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with** ❤️ **by [Mahmood Hamdi](https://github.com/mahmoodhamdi)**

[Report Bug](https://github.com/mahmoodhamdi/whatsapp-sheets-bot/issues) • [Request Feature](https://github.com/mahmoodhamdi/whatsapp-sheets-bot/issues)

</div>
