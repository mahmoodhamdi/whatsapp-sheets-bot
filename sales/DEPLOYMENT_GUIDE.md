# Deployment Guide

Two deployment variants based on whether the client provides infrastructure.

---

## Variant A — Client-Provided Infrastructure

### Prerequisites Checklist
- [ ] VPS: Ubuntu 22.04+ LTS (4GB RAM minimum, 8GB recommended)
- [ ] Public IPv4 address with port 80/443 reachable
- [ ] Domain name with DNS access (A record will point to VPS)
- [ ] PostgreSQL 14+ (can be on same VPS or managed)
- [ ] Stripe account (test mode first, then live keys)
- [ ] Resend account (or SMTP credentials)
- [ ] Google Cloud project with Sheets API enabled (optional but recommended)
- [ ] WhatsApp Business number ready to connect (mobile device with QR scan capability)

### 1. Server Hardening (10 min)
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ufw fail2ban
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Install Runtime
```bash
# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL 15
sudo apt install -y postgresql postgresql-contrib

# Nginx
sudo apt install -y nginx certbot python3-certbot-nginx

# PM2 (process manager)
sudo npm install -g pm2
```

### 3. Database Setup
```bash
sudo -u postgres psql <<SQL
CREATE USER wsbapp WITH PASSWORD '<strong-password>';
CREATE DATABASE wsb OWNER wsbapp;
GRANT ALL PRIVILEGES ON DATABASE wsb TO wsbapp;
SQL
```

### 4. App Deploy
```bash
# As deploy user (not root)
git clone <handover-repo-url> /opt/wsb
cd /opt/wsb
cp .env.example .env
# Edit .env with production values — see ENV_VARS reference below
npm ci --production=false
npx prisma migrate deploy
npm run db:seed
npm run build
```

### 5. PM2 Configuration
```bash
# /opt/wsb/ecosystem.config.js
module.exports = {
  apps: [{
    name: 'wsb',
    script: 'npm',
    args: 'start',
    cwd: '/opt/wsb',
    env: { NODE_ENV: 'production', PORT: 3000 },
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
  }]
};
```
```bash
pm2 start ecosystem.config.js
pm2 startup systemd
pm2 save
```

### 6. Nginx Reverse Proxy
```nginx
# /etc/nginx/sites-available/wsb
server {
    listen 80;
    server_name wsb.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    client_max_body_size 10M;
}
```
```bash
sudo ln -s /etc/nginx/sites-available/wsb /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d wsb.yourdomain.com
```

### 7. Backup Cron
```bash
# /opt/wsb/scripts/backup.sh — invoked daily at 03:00
0 3 * * * /opt/wsb/scripts/backup.sh >> /var/log/wsb-backup.log 2>&1
```

See `scripts/backup.sh` in the repo for the script. It does `pg_dump` and rotates 30 days of backups.

### 8. Smoke Test
```bash
curl https://wsb.yourdomain.com/api/health
# Expect: {"status":"healthy",...}
```

---

## Variant B — We Provide Infrastructure

### Recommended Sizing

| Tier | VPS | RAM | Disk | Cost (DigitalOcean) |
|---|---|---|---|---|
| Up to 1,000 msg/day | Premium Droplet 2vCPU | 4GB | 80GB | ~$24/mo |
| Up to 10,000 msg/day | Premium Droplet 4vCPU | 8GB | 160GB | ~$48/mo |
| 10,000+ msg/day | Dedicated 8vCPU | 16GB | 320GB | ~$96/mo |

DB recommendation: separate managed Postgres ($15-30/mo) for the Pro and higher tiers.

### What We Set Up
- Droplet provisioned with our hardened image
- Cloudflare DNS proxy (DDoS protection + CDN)
- Let's Encrypt SSL with auto-renewal
- Daily off-site encrypted backup to Backblaze B2
- Uptime monitoring via UptimeRobot (1-min interval)
- Sentry error tracking pre-configured

### Handover at Setup
- Server SSH access (you keep root, we keep a deploy user we can disable)
- Cloudflare account ownership transfer (optional)
- All credentials in 1Password vault shared with you

---

## ENV_VARS Reference (Production)

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | ✓ | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `NEXTAUTH_SECRET` | ✓ | 32+ random bytes (`openssl rand -hex 32`) |
| `NEXTAUTH_URL` | ✓ | Full https URL |
| `STRIPE_SECRET_KEY` | ✓ | Live key |
| `STRIPE_WEBHOOK_SECRET` | ✓ | From Stripe webhook endpoint config |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✓ | Live key |
| `STRIPE_PRICE_*` | ✓ | 6 Stripe price IDs (3 plans × 2 intervals) |
| `RESEND_API_KEY` | ✓ | Or use `EMAIL_MODE=smtp` |
| `EMAIL_FROM` | ✓ | Verified sender domain |
| `WHATSAPP_MODE` | ✓ | `baileys` for standard, `cloud_api` for Meta-official |
| `WHATSAPP_SESSION_PATH` | optional | Default `./sessions` — persist with volume mount |
| `WHATSAPP_CLOUD_API_TOKEN` | for cloud_api | From Meta Business Manager |
| `GOOGLE_SHEETS_CREDENTIALS` | optional | Base64 service account JSON |
| `GOOGLE_SHEET_ID` | optional | Target spreadsheet ID |
| `NEXT_PUBLIC_SENTRY_DSN` | recommended | Sentry project DSN |
| `SENTRY_AUTH_TOKEN` | recommended | For source map uploads |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | optional | GA4 tracking |

---

## Common Pitfalls

1. **Sessions directory not persisted** → bot loses WhatsApp login on container restart. Always mount or use a stable path.
2. **Stripe webhooks pointing to localhost** during migration → events drop silently. Update webhook URL **before** going live.
3. **Missing CSP exception for Stripe** → checkout fails. The middleware sets this; don't override.
4. **PostgreSQL connection pool exhaustion** under load → set `?connection_limit=20` in `DATABASE_URL`.
5. **Email going to spam** → verify SPF/DKIM/DMARC for your sending domain before launch.

---

## Rollback Plan

Every deploy creates a tagged release. To roll back:
```bash
cd /opt/wsb
git fetch --tags
git checkout <previous-tag>
npm ci --production=false
npm run build
pm2 reload wsb
```

DB rollback uses backups in `/var/backups/wsb/`. Restoration is documented in `scripts/restore.sh`.
