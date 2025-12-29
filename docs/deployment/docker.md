# Docker Deployment Guide

This guide covers deploying the WhatsApp Bot using Docker.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- A server with at least 1GB RAM

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/mahmoodhamdi/whatsapp-sheets-bot.git
cd whatsapp-sheets-bot
```

### 2. Configure Environment

Create a `.env` file:

```env
# Database (internal Docker network)
DATABASE_URL=postgresql://postgres:your-secure-password@db:5432/whatsapp_bot

# Auth
NEXTAUTH_SECRET=your-32-character-secret-here
NEXTAUTH_URL=https://yourdomain.com

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email
RESEND_API_KEY=re_...
```

### 3. Run with Docker Compose

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Initialize Database

```bash
# Run migrations
docker-compose exec app npx prisma db push

# Seed data
docker-compose exec app npm run db:seed
```

## Production Configuration

### docker-compose.prod.yml

See the production compose file for recommended settings:

- Resource limits
- Restart policies
- Health checks
- Logging configuration

### SSL/TLS

For production, use a reverse proxy like Nginx or Traefik:

```yaml
# Add to docker-compose.prod.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - app
```

## Useful Commands

```bash
# View logs
docker-compose logs -f app

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose build --no-cache
docker-compose up -d

# Access container shell
docker-compose exec app sh

# Run Prisma Studio
docker-compose exec app npx prisma studio
```

## Health Checks

The application exposes a health endpoint at `/api/health`:

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-29T10:00:00.000Z",
  "version": "1.0.0"
}
```

## Volumes

| Volume | Purpose |
|--------|---------|
| `postgres_data` | PostgreSQL database files |
| `whatsapp_sessions` | WhatsApp session data |

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs app

# Check health
docker-compose ps
```

### Database Connection Issues

```bash
# Verify database is running
docker-compose exec db pg_isready

# Check network
docker network ls
```

### Out of Memory

Increase memory limits in docker-compose.yml:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
```

## Backup & Restore

### Backup Database

```bash
docker-compose exec db pg_dump -U postgres whatsapp_bot > backup.sql
```

### Restore Database

```bash
docker-compose exec -T db psql -U postgres whatsapp_bot < backup.sql
```
