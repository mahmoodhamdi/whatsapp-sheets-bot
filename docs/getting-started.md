# Getting Started

This guide will help you set up the WhatsApp Auto-Reply Bot for local development.

## Prerequisites

- **Node.js** 20 or higher
- **PostgreSQL** 15 or higher
- **npm** 9 or higher
- A **Stripe** account (for payments)
- A **Resend** account (for emails)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mahmoodhamdi/whatsapp-sheets-bot.git
cd whatsapp-sheets-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration. See [Configuration Guide](./configuration.md) for details.

### 4. Set Up Database

```bash
# Push schema to database
npm run db:push

# Seed with initial data (creates admin user and plans)
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Login

Use the default credentials:
- **Email**: `admin@example.com`
- **Password**: `admin123`

## Next Steps

1. **Configure WhatsApp** - Go to Settings > WhatsApp and scan the QR code
2. **Create Rules** - Set up auto-reply rules in Dashboard > Rules
3. **Configure Stripe** - Set up your Stripe webhooks for payments
4. **Deploy** - See [Deployment Guides](./deployment/)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Authentication pages
│   ├── (dashboard)/    # Protected dashboard
│   ├── (marketing)/    # Public marketing pages
│   └── api/            # API routes
├── components/         # React components
├── lib/               # Business logic & utilities
└── i18n/              # Translations (ar, en)
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run db:studio` | Open Prisma Studio |
| `npm run lint` | Run ESLint |

## Troubleshooting

See the [Troubleshooting section](../README.md#troubleshooting) in the README.
