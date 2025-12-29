# Vercel Deployment Guide

This guide covers deploying the WhatsApp Bot to Vercel.

## Prerequisites

- A [Vercel](https://vercel.com) account
- A PostgreSQL database (e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com))
- Stripe and Resend accounts configured

## Deployment Steps

### 1. Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository

### 2. Configure Environment Variables

Add the following environment variables in Vercel:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secure random string (32+ chars) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `STRIPE_SECRET_KEY` | Your Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
| `RESEND_API_KEY` | Your Resend API key |

### 3. Configure Build Settings

Vercel should auto-detect Next.js. Verify settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Install Command**: `npm ci`

### 4. Deploy

Click "Deploy" and wait for the build to complete.

### 5. Configure Database

After deployment, run migrations:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma db push
npm run db:seed
```

Or use the Vercel dashboard to run commands.

### 6. Configure Stripe Webhook

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select the required events
4. Update `STRIPE_WEBHOOK_SECRET` in Vercel

## Custom Domain

1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

## Environment-Specific Config

### Production vs Preview

Vercel supports different env vars per environment:

- **Production**: Used for main branch deployments
- **Preview**: Used for PR/branch deployments
- **Development**: Used for local development

Set appropriate values for each environment.

## Limitations

### WhatsApp Connection

The WhatsApp session requires persistent connections which may not work well with Vercel's serverless functions. Consider:

1. Using a separate server for WhatsApp connection
2. Using Vercel with a persistent database to store session state
3. Implementing session reconnection logic

### Serverless Function Timeout

Vercel's free tier has a 10-second timeout. For longer operations:

- Upgrade to Pro for 60-second timeout
- Use background jobs for long-running tasks

## Monitoring

### Vercel Analytics

Enable Vercel Analytics for performance monitoring:

1. Go to Project > Analytics
2. Enable Web Analytics
3. View performance metrics

### Error Tracking

Consider adding error tracking:

```bash
npm install @sentry/nextjs
```

## Troubleshooting

### Build Failures

Check build logs in Vercel dashboard. Common issues:

- Missing environment variables
- TypeScript errors
- Prisma client not generated

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Ensure database allows connections from Vercel IPs
- Check SSL requirements (`?sslmode=require`)

### Function Timeouts

- Optimize slow database queries
- Add indexes to frequently queried columns
- Consider connection pooling (e.g., PgBouncer)
