# WhatsApp Bot - Landing Page & Subscriptions Master Plan

> **Last Updated:** 2025-12-26
> **Overall Progress:** 3/7 Phases Complete

## Overview

This plan outlines the complete implementation of a professional landing page with authentication, subscriptions, and documentation for the WhatsApp Auto-Reply Bot SaaS product.

### Target Audience
- Saudi/Egyptian small businesses (stores, clinics, restaurants)
- Bilingual support (Arabic RTL default, English)

### Key Deliverables
1. Marketing landing page with features, pricing, testimonials
2. Enhanced authentication (registration, email verification, password reset)
3. Subscription system with Stripe integration
4. Documentation portal
5. Feature-gated dashboard based on subscription tier

---

## Progress Tracker

| Phase | Status | Progress | Milestones |
|-------|--------|----------|------------|
| Phase 1: Foundation | ✅ Complete | 4/4 | [Details](#phase-1-foundation--public-routes) |
| Phase 2: Landing Page | ✅ Complete | 6/6 | [Details](#phase-2-landing-page-sections) |
| Phase 3: Auth Enhancement | ✅ Complete | 5/5 | [Details](#phase-3-authentication-enhancement) |
| Phase 4: Subscriptions | 🔄 In Progress | 2/6 | [Details](#phase-4-subscription-system) |
| Phase 5: Documentation | ⬜ Not Started | 0/4 | [Details](#phase-5-documentation-system) |
| Phase 6: Dashboard Integration | ⬜ Not Started | 0/4 | [Details](#phase-6-dashboard-integration) |
| Phase 7: Production Polish | ⬜ Not Started | 0/5 | [Details](#phase-7-production-polish) |

**Legend:** ⬜ Not Started | 🔄 In Progress | ✅ Complete

---

## Phase 1: Foundation & Public Routes

**Goal:** Set up the infrastructure for public-facing pages

| # | Milestone | Status | Prompt File |
|---|-----------|--------|-------------|
| 1.1 | Public Route Structure | ✅ | [phase-1-foundation/M1-public-routes.md](./phase-1-foundation/M1-public-routes.md) |
| 1.2 | Landing Layout & Navigation | ✅ | [phase-1-foundation/M2-landing-layout.md](./phase-1-foundation/M2-landing-layout.md) |
| 1.3 | Shared UI Components | ✅ | [phase-1-foundation/M3-shared-components.md](./phase-1-foundation/M3-shared-components.md) |
| 1.4 | i18n Extensions | ✅ | [phase-1-foundation/M4-i18n-extensions.md](./phase-1-foundation/M4-i18n-extensions.md) |

---

## Phase 2: Landing Page Sections

**Goal:** Build all landing page sections with responsive design

| # | Milestone | Status | Prompt File |
|---|-----------|--------|-------------|
| 2.1 | Hero Section | ✅ | [phase-2-landing-page/M1-hero-section.md](./phase-2-landing-page/M1-hero-section.md) |
| 2.2 | Features Section | ✅ | [phase-2-landing-page/M2-features-section.md](./phase-2-landing-page/M2-features-section.md) |
| 2.3 | Pricing Section | ✅ | [phase-2-landing-page/M3-pricing-section.md](./phase-2-landing-page/M3-pricing-section.md) |
| 2.4 | Testimonials Section | ✅ | [phase-2-landing-page/M4-testimonials-section.md](./phase-2-landing-page/M4-testimonials-section.md) |
| 2.5 | FAQ Section | ✅ | [phase-2-landing-page/M5-faq-section.md](./phase-2-landing-page/M5-faq-section.md) |
| 2.6 | Footer & CTA | ✅ | [phase-2-landing-page/M6-footer-cta.md](./phase-2-landing-page/M6-footer-cta.md) |

---

## Phase 3: Authentication Enhancement

**Goal:** Extend auth system with registration, verification, and recovery

| # | Milestone | Status | Prompt File |
|---|-----------|--------|-------------|
| 3.1 | Registration System | ✅ | [phase-3-auth/M1-registration.md](./phase-3-auth/M1-registration.md) |
| 3.2 | Email Verification | ✅ | [phase-3-auth/M2-email-verification.md](./phase-3-auth/M2-email-verification.md) |
| 3.3 | Password Reset | ✅ | [phase-3-auth/M3-password-reset.md](./phase-3-auth/M3-password-reset.md) |
| 3.4 | Auth UI Improvements | ✅ | [phase-3-auth/M4-auth-ui.md](./phase-3-auth/M4-auth-ui.md) |
| 3.5 | Auth Security Hardening | ✅ | [phase-3-auth/M5-security.md](./phase-3-auth/M5-security.md) |

---

## Phase 4: Subscription System

**Goal:** Implement Stripe-based subscription with multiple tiers

| # | Milestone | Status | Prompt File |
|---|-----------|--------|-------------|
| 4.1 | Database Schema Updates | ✅ | [phase-4-subscriptions/M1-schema.md](./phase-4-subscriptions/M1-schema.md) |
| 4.2 | Stripe Integration Setup | ✅ | [phase-4-subscriptions/M2-stripe-setup.md](./phase-4-subscriptions/M2-stripe-setup.md) |
| 4.3 | Checkout Flow | ⬜ | [phase-4-subscriptions/M3-checkout.md](./phase-4-subscriptions/M3-checkout.md) |
| 4.4 | Webhook Handlers | ⬜ | [phase-4-subscriptions/M4-webhooks.md](./phase-4-subscriptions/M4-webhooks.md) |
| 4.5 | Subscription Management | ⬜ | [phase-4-subscriptions/M5-management.md](./phase-4-subscriptions/M5-management.md) |
| 4.6 | Billing Portal | ⬜ | [phase-4-subscriptions/M6-billing-portal.md](./phase-4-subscriptions/M6-billing-portal.md) |

---

## Phase 5: Documentation System

**Goal:** Create comprehensive documentation portal

| # | Milestone | Status | Prompt File |
|---|-----------|--------|-------------|
| 5.1 | Docs Infrastructure | ⬜ | [phase-5-docs/M1-infrastructure.md](./phase-5-docs/M1-infrastructure.md) |
| 5.2 | Getting Started Guide | ⬜ | [phase-5-docs/M2-getting-started.md](./phase-5-docs/M2-getting-started.md) |
| 5.3 | Feature Documentation | ⬜ | [phase-5-docs/M3-features-docs.md](./phase-5-docs/M3-features-docs.md) |
| 5.4 | API Reference | ⬜ | [phase-5-docs/M4-api-reference.md](./phase-5-docs/M4-api-reference.md) |

---

## Phase 6: Dashboard Integration

**Goal:** Connect subscriptions to dashboard with feature gating

| # | Milestone | Status | Prompt File |
|---|-----------|--------|-------------|
| 6.1 | Feature Gating System | ⬜ | [phase-6-dashboard/M1-feature-gating.md](./phase-6-dashboard/M1-feature-gating.md) |
| 6.2 | Usage Tracking | ⬜ | [phase-6-dashboard/M2-usage-tracking.md](./phase-6-dashboard/M2-usage-tracking.md) |
| 6.3 | Account Settings | ⬜ | [phase-6-dashboard/M3-account-settings.md](./phase-6-dashboard/M3-account-settings.md) |
| 6.4 | Upgrade Prompts | ⬜ | [phase-6-dashboard/M4-upgrade-prompts.md](./phase-6-dashboard/M4-upgrade-prompts.md) |

---

## Phase 7: Production Polish

**Goal:** Optimize for production deployment

| # | Milestone | Status | Prompt File |
|---|-----------|--------|-------------|
| 7.1 | SEO Optimization | ⬜ | [phase-7-production/M1-seo.md](./phase-7-production/M1-seo.md) |
| 7.2 | Performance Optimization | ⬜ | [phase-7-production/M2-performance.md](./phase-7-production/M2-performance.md) |
| 7.3 | Analytics Integration | ⬜ | [phase-7-production/M3-analytics.md](./phase-7-production/M3-analytics.md) |
| 7.4 | Error Handling & Monitoring | ⬜ | [phase-7-production/M4-error-handling.md](./phase-7-production/M4-error-handling.md) |
| 7.5 | Final Testing & QA | ⬜ | [phase-7-production/M5-final-testing.md](./phase-7-production/M5-final-testing.md) |

---

## Subscription Tiers (Planned)

| Plan | Price (Monthly) | Features |
|------|-----------------|----------|
| **Free** | $0 | 50 messages/month, 1 auto-reply rule, Basic support |
| **Starter** | $9 | 500 messages/month, 10 rules, Google Sheets sync |
| **Professional** | $29 | 5,000 messages/month, Unlimited rules, Priority support |
| **Enterprise** | $99 | Unlimited messages, Custom integrations, Dedicated support |

---

## Tech Stack Additions

| Component | Technology | Purpose |
|-----------|------------|---------|
| Payments | Stripe | Subscription billing |
| Email | Resend | Transactional emails |
| Analytics | Vercel Analytics / Plausible | Usage tracking |
| Docs | MDX + next/mdx | Documentation pages |
| Animations | Framer Motion | Landing page animations |

---

## How to Use This Plan

### Starting a New Session

1. Check this file for current progress
2. Find the next incomplete milestone (⬜)
3. Open the corresponding prompt file
4. Give Claude Code the file path:
   ```
   Read docs/implementation-plan/phase-X-xxx/MY-milestone.md and implement everything
   ```

### After Completing Work

Claude Code should:
1. Update the milestone status in this file (⬜ → ✅)
2. Update the checklist in the milestone file
3. Commit changes with descriptive message

### Resuming After Break

1. Read this MASTER_PLAN.md for overall progress
2. Read the last in-progress milestone file
3. Check its checklist to see what's done
4. Continue from where you left off

---

## Important Notes

- All UI must support Arabic (RTL) and English (LTR)
- Use existing shadcn/ui components when possible
- Follow the green color theme established in the dashboard
- Write unit tests for utilities and integration tests for flows
- Never commit until all tests pass
