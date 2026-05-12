# Competitive Positioning

How we compare against the major WhatsApp automation tools in the EG/SA SMB market.

---

## Comparison Matrix

| Feature | **Our Solution** | Wati | Respond.io | Twilio Studio |
|---|---|---|---|---|
| **Pricing model** | One-time + optional support | $39+/mo per user | $79+/mo per agent | Per-message billing |
| **Source code ownership** | ✓ Full | ✗ SaaS only | ✗ SaaS only | ✗ SaaS only |
| **Self-hosting option** | ✓ | ✗ | ✗ | ✗ |
| **Per-message fees** | ✗ None | $0.005-0.05/msg | $0.005-0.07/msg | $0.005-0.10/msg |
| **Arabic-first UI** | ✓ Native RTL | Partial | ✗ | ✗ |
| **Egyptian Arabic defaults** | ✓ | ✗ | ✗ | ✗ |
| **Saudi Riyal billing** | ✓ Native | ✗ USD only | ✗ USD only | ✗ USD only |
| **Auto-reply rules** | ✓ 4 match types | ✓ | ✓ | ✓ (via Studio flows) |
| **Google Sheets sync** | ✓ Built-in | Via Zapier ($$) | Via API | Via Functions |
| **Multi-account/numbers** | ✓ Add-on | Per-seat extra | ✓ | ✓ |
| **WhatsApp Cloud API** | ✓ (Enterprise) | ✓ | ✓ | ✓ |
| **WhatsApp via Baileys** | ✓ (legal risk noted) | ✗ | ✗ | ✗ |
| **Stripe subscriptions** | ✓ 4 tiers built-in | N/A (they handle billing) | N/A | N/A |
| **GDPR / Data export** | ✓ Built-in | ✓ | ✓ | Via API |
| **Audit logging** | ✓ Built-in | Limited | ✓ | Limited |
| **Hosted in MENA** | ✓ (client choice) | ✗ (EU/US) | ✗ (SG/US) | ✗ (US) |
| **Bilingual emails** | ✓ AR/EN templates | EN only | EN/limited | EN only |
| **Time to deploy** | 1–2 weeks | 1 day (SaaS signup) | 1 day | 1 day |
| **Cost — Year 1, 5 users, 10k msg/mo** | EGP 35,000 once | ≈ USD 2,800 + msg fees | ≈ USD 5,500 + msg fees | ≈ USD 600 + heavy msg fees |
| **Cost — Year 3, same usage** | EGP 35,000 + 12,000 support | ≈ USD 8,400+ | ≈ USD 16,500+ | ≈ USD 1,800+ |

---

## Where Each Competitor Wins

### Wati (wati.io)
- Faster initial onboarding (no deployment)
- Larger pre-built template library
- Verified WhatsApp Business API official partner
- Better suited if client has zero technical ability

### Respond.io
- More polished omnichannel inbox (also handles IG, FB, etc.)
- More mature workflow builder
- Better for medium-large operations (>20 agents)

### Twilio Studio
- Industrial-grade reliability
- Better suited for developer-led teams building custom flows
- Cheapest at very low volumes

---

## Where We Win

### Total cost of ownership
On a 3-year TCO basis with 10k messages/month, we beat all three for SMBs by 60-95%.

### Sovereignty
Client owns the code. No vendor lock-in. Can migrate hosting, sell to another buyer, or take in-house.

### Arabic-first
The whole UI was designed RTL-first. Default replies are in natural Egyptian and Saudi Arabic, not Google-translated English.

### No per-message fees
Critical for B2C businesses sending broadcast announcements. A 5,000-contact broadcast costs us $0 of marginal cost; competitors charge $25-250.

### Local presence
Same time zone, Arabic-speaking support, willing to meet in person in Cairo/Riyadh/Jeddah.

### Honest about Baileys
We disclose that Baileys is unofficial and carries WhatsApp account-ban risk. We offer Cloud API as the enterprise upgrade path. Competitors who only mention Cloud API are sometimes more expensive but more compliant. We let the client choose.

---

## Objection Handling

### "Wati is faster to deploy"
True for week one. By month six, our system is humming and Wati's bill has crossed $1,500 with per-message fees. By year three, the gap is $10,000+. Plus our client owns the asset.

### "What if you go out of business?"
You own the source code. You can hire any Next.js developer to maintain it. No vendor lock-in. We hand over comprehensive documentation specifically so you're not dependent on us.

### "Is Baileys legal?"
Baileys is a reverse-engineered WhatsApp library. WhatsApp has banned accounts using it before, especially at high volume. For low-volume SMB use (<5,000 msg/day), the risk is small. For higher volume or compliance-conscious operations, use our Cloud API adapter (enterprise tier add-on).

### "Twilio is cheaper"
At <2,000 messages/month, yes. At 10,000/month, Twilio's per-message fees alone exceed our annual support fee. Plus you don't own anything with Twilio.

### "Why not just use Zapier + Google Sheets?"
You can. It works until ~50 messages/day, then breaks down. No RTL UI, no analytics, no rule priorities, no working hours, no auto-reconnect. We're the system you graduate to.

### "We're already on Wati"
Migration is included in our Pro tier. We import your existing rules + contacts. We don't take you down — we run in parallel for a week, you switch when comfortable.

---

## Win Themes by Buyer Type

| Buyer | Lead with |
|---|---|
| **Founder / Owner-operator** | Sovereignty + TCO. They feel the bill every month. |
| **Marketing manager** | Speed + analytics. They want to A/B test reply copy. |
| **IT manager** | Self-hosted + audit logs + security posture. |
| **Customer service lead** | Working hours + team training + day-to-day usability. |
| **CFO** | Total-cost-3yr spreadsheet — we have one ready. |
| **Procurement** | Compliance: GDPR export, audit logging, SLA. |
