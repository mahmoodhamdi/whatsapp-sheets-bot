# 30-Day Onboarding Plan

For a client who has signed and paid. Goal: from contract to confident self-service operator in 30 days.

---

## Week 1 — Foundation

### Day 0 (Kickoff)
- 1-hour kickoff Zoom: confirm scope, success metrics, primary contact, escalation path
- Set up shared Slack channel or WhatsApp group
- Send pre-deployment questionnaire (see `forms/pre-deploy.md`)

### Day 1–3 (Infrastructure)
- Receive completed questionnaire
- Provision infrastructure (Managed tier) or hand off prerequisites checklist (Self-Hosted)
- DNS records prepared + TTL lowered
- Stripe account: create products + prices, configure webhook endpoint
- Email provider: set up SPF/DKIM/DMARC
- Connect Sentry, set up alert rules

### Day 4–5 (Deployment)
- Production deploy
- Run smoke tests: registration, login, Stripe webhook test event, email delivery
- Admin account created for client
- Schedule Day 7 milestone review

### Day 6–7 (Verification)
- Client logs in for first time, force password reset
- Walk through the dashboard end-to-end (60 min training session)
- Identify any gaps for next week

---

## Week 2 — WhatsApp Activation

### Day 8–10
- Connect WhatsApp business number (QR scan with admin's phone)
- Test outbound: send a message from dashboard
- Test inbound: text the business number from another phone, verify message appears
- Confirm auto-reconnect works (kill connection, observe recovery)

### Day 11–14 (First Rules)
- Workshop: list top 20 customer questions
- Translate into auto-reply rules — start with EXACT then add CONTAINS
- Test each rule with sample messages
- Configure default reply for unmatched messages
- Set up working hours + after-hours message
- (Optional) Configure forwarding to human (Slack/Telegram/email)

---

## Week 3 — Team & Integrations

### Day 15–17 (Team Onboarding)
- Invite additional team members if multi-user
- Walk team through their role: who creates rules, who reviews messages
- Set up dashboard alerts for rule failures or limit breaches

### Day 18–21 (Sheets + Analytics)
- Connect Google Sheets account
- Configure sync mapping (which columns, which fields)
- First sync — verify in sheet
- Walk through analytics dashboard: response rate, message volume, top rules
- Set up KPIs: target response rate, target rule coverage

---

## Week 4 — Optimization & Handover

### Day 22–25 (Tuning)
- Review week's rule hit rate
- Identify gap rules (messages not matched anywhere)
- Refine top 5 rules based on real conversations
- A/B test reply wording where possible

### Day 26–28 (Operational Readiness)
- Train backup person on admin tasks
- Document client-specific edge cases in private runbook
- Set up custom alerting if needed
- Schedule monthly review cadence

### Day 29 (Retrospective)
- 1-hour Zoom: what worked, what didn't, what's next
- Quantified outcome report: response rate before vs. after, hours saved, NPS feedback if available
- Open backlog of future enhancement ideas

### Day 30 (Transition)
- Move from onboarding to standard support plan
- First weekly health report becomes monthly
- Client owns day-to-day operations
- We remain available per support tier SLA

---

## Onboarding Deliverables Checklist

By Day 30, the client should have:

- [ ] Live production deployment with valid SSL
- [ ] WhatsApp connected and stable for ≥7 days
- [ ] At least 20 auto-reply rules covering 80% of typical messages
- [ ] Working hours + holiday calendar configured
- [ ] Email notifications tested
- [ ] Sheets sync running (if applicable)
- [ ] All team members trained
- [ ] First month's analytics report
- [ ] Backup verified (one restore drill completed)
- [ ] Runbook for client-specific scenarios
- [ ] Roadmap of next-quarter enhancements

---

## Common First-Month Issues + Fixes

| Issue | Cause | Resolution |
|---|---|---|
| WhatsApp disconnects nightly | Phone screen lock kills foreground service | Use a dedicated device, keep plugged in, disable battery saver |
| Rule not matching expected text | Case sensitivity or punctuation | Normalize text in trigger, prefer CONTAINS over EXACT for natural messages |
| Email going to spam | DKIM not verified | Add DNS records, wait 24h, retry |
| Stripe checkout fails on iOS | Safari content-blocker | Whitelist Stripe domains in client's privacy policy |
| Dashboard slow on first load | Cold start on small VPS | Upgrade tier or enable PM2 cluster mode |
| Sheets sync errors | Service account lacks Editor role | Re-share sheet with the service account email |

---

## Success Metrics to Track

By Day 30, expect:

- **Response time**: Median < 60 seconds (vs. baseline ~hours)
- **Response rate**: ≥85% of messages get *some* reply (matched + default)
- **Rule coverage**: ≥60% messages match a defined rule (rest get default reply)
- **Hours saved**: Client estimate of CS rep hours displaced
- **System uptime**: ≥99% over the 30 days
