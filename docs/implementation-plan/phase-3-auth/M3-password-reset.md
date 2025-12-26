# Milestone 3.3: Password Reset

> **Phase:** 3 - Authentication Enhancement
> **Status:** ✅ Complete
> **Last Updated:** 2025-12-26
> **Depends On:** M2-email-verification.md

## Objective

Implement secure password reset flow with email-based token verification.

---

## Flow Overview

1. User clicks "Forgot Password" on login page
2. User enters email on forgot password page
3. System sends reset link with token
4. User clicks link, lands on reset password page
5. User enters new password
6. Password updated, user redirected to login

---

## Implementation Checklist

### 1. Update Database Schema
- [x] Create `PasswordResetToken` model
- [x] Run migration

### 2. Create Forgot Password Page
- [x] Create `src/app/(auth)/forgot-password/page.tsx`
- [x] Email input form
- [x] Success message display

### 3. Create Reset Password Page
- [x] Create `src/app/(auth)/reset-password/page.tsx`
- [x] Token validation
- [x] New password form
- [x] Confirm password

### 4. Create API Routes
- [x] POST `/api/auth/forgot-password` - send reset email
- [x] POST `/api/auth/reset-password` - update password

### 5. Email Template
- [x] Create password reset email template (already existed)
- [x] Include reset link with token

### 6. Testing
- [x] Build passes
- [x] Lint passes
- [x] All 91 tests pass

---

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | MODIFIED | Added PasswordResetToken model |
| `src/lib/auth/password-reset.ts` | CREATED | Reset token utilities |
| `src/app/api/auth/forgot-password/route.ts` | CREATED | Send reset email API |
| `src/app/api/auth/reset-password/route.ts` | CREATED | Reset password API |
| `src/app/(auth)/forgot-password/page.tsx` | CREATED | Forgot password page |
| `src/app/(auth)/reset-password/page.tsx` | CREATED | Reset password page |
| `src/app/(auth)/login/page.tsx` | MODIFIED | Added forgot password & register links |
| `messages/ar.json` | MODIFIED | Added translations |
| `messages/en.json` | MODIFIED | Added translations |

---

## Acceptance Criteria

- [x] Forgot password form works
- [x] Reset email sent with link
- [x] Reset link opens reset page
- [x] Invalid/expired token shows error
- [x] Password updated successfully
- [x] All translations work
- [x] RTL layout correct
- [x] Build passes
- [x] All tests pass (91)
