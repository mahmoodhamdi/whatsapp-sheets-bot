# Configuration Guide

This guide covers all environment variables and configuration options.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `NEXTAUTH_SECRET` | Secret for JWT signing (32+ chars) | `your-super-secret-key-here` |
| `NEXTAUTH_URL` | Application base URL | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Stripe secret API key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_live_...` |
| `RESEND_API_KEY` | Resend email API key | `re_...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID | - |
| `GOOGLE_SHEETS_CREDENTIALS` | Base64 encoded service account JSON | - |
| `GOOGLE_SHEET_ID` | Target Google Sheet ID | - |
| `WHATSAPP_SESSION_PATH` | Path to store WhatsApp sessions | `./sessions` |

## Database Configuration

### Local Development

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/whatsapp_bot"
```

### Production (with SSL)

```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"
```

## Stripe Configuration

### 1. Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** and **Secret key**

### 2. Configure Webhook

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the **Signing secret**

### 3. Local Development with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Google Sheets Configuration

### 1. Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create a Service Account
5. Download JSON credentials

### 2. Encode Credentials

```bash
# Encode the JSON file to base64
base64 -i credentials.json
```

### 3. Share Your Sheet

Share your Google Sheet with the service account email (found in the JSON file).

### 4. Set Environment Variables

```env
GOOGLE_SHEETS_CREDENTIALS="base64-encoded-json-here"
GOOGLE_SHEET_ID="your-sheet-id-from-url"
```

## Email Configuration (Resend)

### 1. Get API Key

1. Sign up at [Resend](https://resend.com)
2. Verify your domain
3. Create an API key

### 2. Configure Environment

```env
RESEND_API_KEY="re_..."
```

## Security Configuration

### Generating NEXTAUTH_SECRET

```bash
# Generate a secure random string
openssl rand -base64 32
```

### Production Checklist

- [ ] Use strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Enable SSL for database connection
- [ ] Use `https://` for `NEXTAUTH_URL`
- [ ] Verify Stripe webhook secret is correct
- [ ] Verify email domain in Resend

## Feature Flags

Features are controlled per subscription plan in the database. The available features are:

| Feature | Description | Plans |
|---------|-------------|-------|
| `basic_support` | Basic email support | All |
| `sheets_sync` | Google Sheets sync | Starter+ |
| `analytics` | Usage analytics dashboard | Professional+ |
| `api_access` | REST API access | Professional+ |
| `priority_support` | Priority support | Professional+ |
| `custom_integrations` | Custom integrations | Enterprise |
| `dedicated_support` | Dedicated support | Enterprise |
| `sla` | SLA guarantee | Enterprise |
