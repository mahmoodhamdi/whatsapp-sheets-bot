# Features

Inventory of shipped features with their plan availability. Reflects the state after the sales-readiness pass on 2026-05-12.

## Legend
- **Plan**: lowest tier where feature is enabled (Free / Starter / Pro / Enterprise)
- **Status**: shipped / experimental / planned
- **Added in**: branch or commit reference

## Core (All Plans)

| Feature | Plan | Status | Added in |
|---|---|---|---|
| Email + password auth (NextAuth v5) | Free | shipped | pre-existing |
| Email verification flow | Free | shipped | pre-existing |
| Password reset flow | Free | shipped | pre-existing |
| Bilingual UI (Arabic RTL + English) | Free | shipped | pre-existing |
| Dark/light theme toggle | Free | shipped | pre-existing |
| Dashboard with stats overview | Free | shipped | pre-existing |
| Auto-reply rules (EXACT/CONTAINS/STARTS_WITH/REGEX) | Free | shipped | pre-existing |
| Working hours / business hours | Free | shipped | pre-existing |
| Contacts management | Free | shipped | pre-existing |
| Messages history | Free | shipped | pre-existing |
| Default reply for unmatched | Free | shipped | pre-existing |
| Account settings + delete account | Free | shipped | pre-existing |

## Subscription Tiers (Stripe)

| Feature | Plan | Status |
|---|---|---|
| 4-tier subscription system | Free→Enterprise | shipped |
| Stripe checkout | Free+ to upgrade | shipped |
| Customer portal (manage subscription) | Starter+ | shipped |
| Webhook-driven plan sync | All | shipped |
| Usage metering (messages, rules) | All | shipped |
| Plan-limit enforcement (403 on limit reached) | All | shipped |

## Integrations

| Feature | Plan | Status |
|---|---|---|
| Google Sheets sync (incoming + outgoing) | Pro | shipped |
| Sentry error tracking | All (when configured) | shipped |
| Resend email delivery | All | shipped |
| SMTP fallback for self-hosted | All | shipped (this branch) |

## WhatsApp

| Feature | Plan | Status |
|---|---|---|
| Baileys-based WhatsApp connection | All | shipped |
| QR code auth flow | All | shipped |
| Auto-reconnect on disconnect | All | shipped |
| Outbound message sending | All | shipped |
| Inbound message handling + auto-match | All | shipped |
| **Adapter abstraction (mock/baileys/cloud_api)** | All | **added this branch** |
| **Mock adapter for demo/dev environments** | All | **added this branch** |
| **Dev simulator endpoint (`POST /api/dev/whatsapp/simulate-message`)** | All | **added this branch** |

## Operational Maturity (Added This Branch)

| Feature | Status |
|---|---|
| Enhanced `/api/health` with DB / Stripe / Mailer / WhatsApp probes | shipped |
| Component-level status reporting in health response | shipped |
| Comprehensive sales documentation pack | shipped |
| Bilingual sales pitch (AR + EN) | shipped |

## Existing Hardening (Pre-Existing — Confirmed Working)

| Feature | Status |
|---|---|
| In-memory rate limiting (login, register, verification, API) | confirmed |
| Account lockout after failed logins | confirmed |
| Audit log model + middleware | confirmed |
| Zod request validation across routes | confirmed |
| CSRF + security headers in middleware | confirmed |
| Environment validation at startup | confirmed |

## Planned for Future Releases

These are documented in the brief but deferred. Each is sized as a separate feature:

| Feature | Sized | Why Deferred |
|---|---|---|
| WhatsApp Cloud API adapter (full impl) | 3–5 days | Requires Meta Business onboarding for testing |
| AI-powered replies (OpenAI/Anthropic) | 1 week | Wire-up + cost-control + safety review |
| Conversation flow builder (visual) | 2 weeks | Significant UI work + drag/drop component |
| Broadcast/Campaign with audience filters | 1 week | Compliance review for opt-in/opt-out |
| Live chat takeover (human agent handoff) | 1 week | Real-time channel + presence tracking |
| Quick replies / Templates library | 3 days | UI + storage + scoping |
| Contact tags + segments | 5 days | Schema + filter UI |
| Out-of-office + holidays calendar | 3 days | Extension of existing working hours |
| Forward unhandled to Slack/Telegram/Email | 3 days | Per-channel client + config UI |
| Signed webhook events for client integrations | 2 days | HMAC + delivery retries |
| Zapier/Make integration | 1 week | Public API stabilization + recipes |
| Audit log GDPR export endpoint | 2 days | Build on existing AuditLog model |
| White-label theming | 5 days | CSS variables + admin UI |
| Mobile-optimized PWA polish | 3 days | Service worker + manifest + install prompt |
| Sentiment analysis on incoming | 3 days | Model selection + processing |
| Response analytics (response rate, time to resolve) | 5 days | Aggregation + chart components |
| Per-contact conversation export (PDF/CSV) | 3 days | jsPDF + streaming export |

Each future feature has rough scoping; concrete plans land when prioritized.
