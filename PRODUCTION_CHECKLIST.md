# Production Deployment Checklist

## Pre-Deployment

### Environment Variables
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - Random 32+ character string (`openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` - Production URL (e.g., `https://your-domain.com`)
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key (sk_live_xxx)
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret (whsec_xxx)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (pk_live_xxx)
- [ ] `RESEND_API_KEY` - Resend API key for emails
- [ ] `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error tracking
- [ ] `SENTRY_ORG` - Sentry organization slug
- [ ] `SENTRY_PROJECT` - Sentry project slug
- [ ] `SENTRY_AUTH_TOKEN` - Sentry auth token for source maps

### Database
- [ ] PostgreSQL 15+ running and accessible
- [ ] Run `npx prisma migrate deploy` for production migrations
- [ ] Run `npm run db:seed` to create admin user and plans
- [ ] Verify database connection works

### Stripe Setup
- [ ] Create products and prices in Stripe Dashboard
- [ ] Configure webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
- [ ] Enable webhook events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
  - `invoice.payment_succeeded`
- [ ] Test webhook signature verification

### Domain & SSL
- [ ] Domain configured and pointing to server
- [ ] SSL certificate installed (Let's Encrypt or similar)
- [ ] Force HTTPS redirect enabled

### Security
- [ ] All API endpoints tested
- [ ] Rate limiting verified
- [ ] CSP headers verified
- [ ] Security headers verified (check with securityheaders.com)
- [ ] Environment variables not exposed in client bundle

## Deployment Steps

### 1. Build
```bash
npm run build
```

### 2. Database Migration
```bash
npx prisma migrate deploy
```

### 3. Seed (First Time Only)
```bash
npm run db:seed
```

### 4. Start Production Server
```bash
npm start
```

### 5. Or Deploy with Docker
```bash
docker compose up -d
```

## Post-Deployment Verification

### Functionality
- [ ] Homepage loads correctly
- [ ] Login/Register works
- [ ] Email verification sends
- [ ] Password reset works
- [ ] Dashboard loads for authenticated users
- [ ] WhatsApp connection works
- [ ] Rules CRUD works
- [ ] Subscription checkout works
- [ ] Stripe webhooks processed

### Performance
- [ ] Page load times < 3s
- [ ] API response times < 500ms
- [ ] No console errors
- [ ] Lighthouse score > 80

### Monitoring
- [ ] Sentry receiving errors
- [ ] Logs accessible
- [ ] Health endpoint responding (`/api/health`)

## Rollback Plan

1. Stop the new deployment
2. Restore previous Docker image or code
3. Run `npx prisma migrate resolve` if needed
4. Restart services
5. Verify functionality

## Contacts

- **Technical Lead**: [Name] - [email]
- **DevOps**: [Name] - [email]
- **On-Call**: [Phone]

## Notes

- First deployment should include running `db:seed` to create plans
- WhatsApp session data is stored in `./sessions` directory
- Monitor `/api/health` endpoint for service status
- Check Stripe webhook logs for payment issues
