# Handover Checklist

Run through this list jointly with the client during the handover session. Both parties sign at the end.

---

## Pre-Handover (Our Side)

- [ ] Production deployment is live and healthy (`/api/health` returns 200)
- [ ] All scheduled CI checks pass on `master` branch
- [ ] Stripe webhooks configured and tested with a live event
- [ ] Email sending verified end-to-end (verification email received by test account)
- [ ] WhatsApp bot connected and reply tested
- [ ] Google Sheets sync working (if subscribed)
- [ ] Admin account created with client's email
- [ ] Sentry receiving events
- [ ] Daily backups confirmed (first backup file visible)
- [ ] SSL certificate valid >30 days
- [ ] DNS A record TTL reduced to 300s during handover (revert to 3600 after stable)

## During Handover Session (1–2 hours, Zoom)

### A. Credentials Transfer
- [ ] Admin dashboard login passed to client (force password reset on first login)
- [ ] Stripe account: client added as Admin → we step down to Developer
- [ ] Server SSH: client adds their key, we remove ours from `authorized_keys`
- [ ] Domain registrar: ownership transfer initiated (separate doc)
- [ ] Cloudflare/DNS: client added as Super Admin, we step down to Editor
- [ ] Resend/email provider: client added as Owner
- [ ] Google Cloud project: client added with Owner role
- [ ] 1Password / Bitwarden vault shared (or credentials handed via secure channel)

### B. Source Code & Documentation
- [ ] Source code archive delivered (zip + checksum)
- [ ] GitHub repo transferred OR client added as Admin
- [ ] All sales/* docs delivered (this file, deployment guide, pricing, support, etc.)
- [ ] In-app docs reviewed (`/docs` route walkthrough)
- [ ] README + docs/ developer guide handed over
- [ ] CI/CD workflow walkthrough done

### C. Live Training (recorded)
- [ ] Creating + editing auto-reply rules
- [ ] Reviewing messages + contacts
- [ ] Managing subscription tier (in-app or Stripe)
- [ ] Working hours + holiday calendar
- [ ] Inviting team members (if multi-user enabled)
- [ ] Reading analytics dashboard
- [ ] Setting up Sheets sync
- [ ] Restoring from backup (dry run on staging)
- [ ] Reading logs / Sentry
- [ ] Common troubleshooting scenarios

### D. Q&A and Sign-off
- [ ] Client lists outstanding concerns
- [ ] We document each as: resolved-now / scheduled-for-warranty / out-of-scope
- [ ] Handover document signed by both parties (PDF e-sign)

---

## Post-Handover (First 30 Days = Warranty)

| When | What |
|---|---|
| Day 1 | We monitor Sentry + uptime, alert client if anything fires |
| Day 3 | Check-in call: "anything confusing so far?" |
| Day 7 | Send first weekly health report (uptime, errors, usage) |
| Day 14 | Optimization review: any rules underperforming? |
| Day 30 | Warranty ends + retrospective + support plan renewal pitch |

Warranty covers: bugs in the as-delivered scope.

Warranty does NOT cover: new feature requests, infrastructure issues, third-party outages, client-induced misconfiguration.

---

## Artifact Checklist

The client should leave the handover session with:

1. **Login credentials** for all systems (above)
2. **Source code archive** (`wsb-handover-YYYYMMDD.zip` + `.sha256`)
3. **Documentation pack**:
   - `sales/SALES_PITCH.md`
   - `sales/PRICING_FOR_CLIENTS.md`
   - `sales/DEPLOYMENT_GUIDE.md`
   - `sales/SUPPORT_PLANS.md`
   - `sales/ONBOARDING_30DAYS.md`
   - `sales/HANDOVER_CHECKLIST.md` (signed)
   - In-app docs (linked from `/docs`)
4. **Recorded training video** (link, 1080p)
5. **Architecture diagram** (PDF in `sales/architecture.pdf`)
6. **Signed contract + invoice paid in full**

---

## Signature Block

**Client representative:**
- Name: ___________________________
- Role: ___________________________
- Date: ___________________________
- Signature: ___________________________

**Vendor representative:**
- Name: ___________________________
- Role: ___________________________
- Date: ___________________________
- Signature: ___________________________

By signing, both parties acknowledge that the system has been delivered per spec, training has been completed, and the warranty period commences on the signature date.
