# Milestone 3.2: Email Verification

> **Phase:** 3 - Authentication Enhancement
> **Status:** ✅ Complete
> **Last Updated:** 2025-12-26
> **Depends On:** M1-registration.md

## Objective

Implement email verification to ensure valid user emails before full account access.

---

## Context

### Flow Overview
1. User registers → account created with `emailVerified: false`
2. System sends verification email with 6-digit code
3. User enters code on verification page
4. Account marked as verified
5. User can access dashboard

### Email Service
- **Resend** - Developer-friendly, good free tier
- Lazy-loaded client to avoid build-time errors
- Dev mode logs emails to console when no API key

---

## Implementation Checklist

### 1. Update Database Schema
- [x] Add `emailVerified` field to User model
- [x] Create `VerificationToken` model
- [x] Generate Prisma client

### 2. Set Up Email Service
- [x] Install Resend SDK
- [x] Create email service utility with lazy-loading
- [x] Create email templates (bilingual)

### 3. Create Verification Token System
- [x] Generate 6-digit code
- [x] Store with expiry (15 minutes)
- [x] Handle token validation

### 4. Update Registration Flow
- [x] Set `emailVerified: false` on creation
- [x] Send verification email
- [x] Redirect to verification page

### 5. Create Verification Page
- [x] Create `src/app/(auth)/verify-email/page.tsx`
- [x] 6-digit code input
- [x] Resend code button with cooldown
- [x] Auto-redirect after verification

### 6. Create Verification APIs
- [x] Send verification endpoint
- [x] Verify token endpoint

### 7. Middleware Update
- [x] Check emailVerified status
- [x] Redirect unverified users to verification page
- [x] Allow auth-only routes without verification

### 8. Session Updates
- [x] Add emailVerified to JWT token
- [x] Add emailVerified to session
- [x] Refresh on session update

---

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | MODIFIED | Added emailVerified, VerificationToken |
| `src/lib/email/index.ts` | CREATED | Email service with Resend |
| `src/lib/email/templates.ts` | CREATED | Bilingual email templates |
| `src/lib/auth/verification.ts` | CREATED | Token utilities |
| `src/app/api/auth/send-verification/route.ts` | CREATED | Send email API |
| `src/app/api/auth/verify-email/route.ts` | CREATED | Verify token API |
| `src/app/api/auth/register/route.ts` | MODIFIED | Send verification on register |
| `src/app/(auth)/verify-email/page.tsx` | CREATED | Verification page |
| `src/middleware.ts` | MODIFIED | Email verification checks |
| `src/lib/auth.ts` | MODIFIED | Add emailVerified to session |
| `src/types/next-auth.d.ts` | MODIFIED | Type declarations |
| `src/components/auth/RegisterForm.tsx` | MODIFIED | Redirect to verify-email |
| `messages/ar.json` | MODIFIED | Added error key |
| `messages/en.json` | MODIFIED | Added error key |

---

## Environment Variables

```env
# Optional - if not set, emails are logged to console
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM="WhatsApp Bot <noreply@yourdomain.com>"
```

---

## Acceptance Criteria

- [x] VerificationToken model created
- [x] Email service configured (with dev fallback)
- [x] Verification email sent on registration
- [x] 6-digit code input works
- [x] Invalid code shows error
- [x] Expired code shows error
- [x] Successful verification updates user
- [x] Resend with cooldown works
- [x] Unverified users redirected
- [x] All translations work
- [x] Build passes
- [x] All tests pass (91)

---

## Notes

- Email templates are bilingual (Arabic/English)
- Resend client is lazy-loaded to avoid build-time errors when no API key
- 15-minute expiry on verification codes
- 60-second cooldown on resend
- Session is automatically updated after verification
