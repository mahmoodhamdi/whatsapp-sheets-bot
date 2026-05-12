# Support Plans

Three tiers of post-deployment support. All include access to our private documentation portal and product roadmap.

| Plan | Duration | Channels | Response SLA | Resolution SLA | Includes |
|---|---|---|---|---|---|
| **Basic** | 3 months | Email | 48 business hours | Best-effort | Bug fixes only |
| **Priority** | 6 months | Email + WhatsApp + Telegram | 24 hours | 72 hours (critical) | Bugs + minor enhancements + 2 monthly check-ins |
| **Enterprise** | 12 months | Dedicated channel + phone | 4 hours (critical), 24h (normal) | 99.5% uptime SLA | Everything above + quarterly review + dedicated engineer |

---

## What Counts as Each Severity

### Critical (Sev-1)
- App unreachable (500-level errors on all routes)
- Database connection lost
- WhatsApp adapter disconnected and won't recover
- Auth completely broken
- Stripe webhooks not processing → billing impact

### High (Sev-2)
- Auto-replies not triggering despite matching rules
- Specific dashboard pages broken
- Email delivery delayed >1 hour
- Significant performance regression

### Medium (Sev-3)
- UI glitches that have workarounds
- Non-critical feature broken
- Documentation gaps

### Low (Sev-4)
- Cosmetic issues
- Enhancement requests
- Translation polish

---

## Plan Details

### Basic — EGP 0 (Free with any deployment) for 30 days, then EGP 1,500/mo • SAR 300/mo
- 5 tickets/month
- Email-only support
- Bug fixes within the existing version
- Does NOT include: new features, version upgrades, infrastructure issues, third-party API troubleshooting

### Priority — EGP 6,000 / 6 months • SAR 1,200 / 6 months
- 15 tickets/month
- WhatsApp + Telegram + email support (Sun–Thu, 10am–8pm Cairo time)
- 2× monthly 30-min check-in calls
- Minor enhancements (≤4 hours each) included up to 4 per quarter
- Free upgrade to latest minor versions (`v1.x.x`)

### Enterprise — EGP 24,000 / 12 months • SAR 4,800 / 12 months
- Unlimited tickets
- Dedicated Slack channel or WhatsApp group
- Phone support for Sev-1 issues
- 99.5% uptime SLA (Managed hosting clients only)
- Quarterly business review + roadmap input
- Free upgrades including major versions
- 1 free customization/quarter (up to 8 hours each)
- Priority for new feature requests

---

## Out of Scope (Any Plan)
- WhatsApp account bans (Baileys is unofficial — risk acknowledged in DPA)
- Stripe account-level issues (you own the account)
- DNS, domain, or upstream cloud provider issues
- Third-party integrations beyond what we ship
- Performance issues caused by client custom code

---

## How to Open a Ticket

**Basic**: email support@yourbrand.com with subject `[WSB] <short desc>`.

**Priority/Enterprise**: same email OR drop in the support channel. Include:
1. URL of the affected page
2. Steps to reproduce
3. Screenshot or screen recording
4. Sentry event ID if visible
5. Severity self-assessment

We respond within SLA acknowledging receipt + ETA for first investigation.

---

## Escalation Path

| Step | Trigger | Action |
|---|---|---|
| 1 | First reply within SLA | Engineer takes ownership |
| 2 | Not resolved in 2× SLA | Lead engineer joins |
| 3 | Not resolved in 4× SLA | Founder/PM joins, daily updates |
| 4 | Persistent outage | Refund or credit per contract |

---

## Renewal

We send renewal proposals 30 days before plan expiry. No auto-renewal — you opt in each cycle.

Lapsed support clients can re-onboard at any time but pay a one-time re-onboarding fee (50% of plan cost) to cover catch-up review.
