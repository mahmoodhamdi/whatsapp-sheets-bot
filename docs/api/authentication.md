# Authentication API

This document describes the authentication endpoints.

## Overview

Authentication is handled via NextAuth.js with JWT sessions. All protected endpoints require a valid session cookie.

## Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one number

**Response (201 Created):**
```json
{
  "success": true,
  "user": {
    "id": "clxx...",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "message": "Registration successful. Please check your email to verify your account."
}
```

**Errors:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Invalid email or weak password |
| 409 | EMAIL_EXISTS | Email already registered |

---

### POST /api/auth/[...nextauth]

NextAuth.js handler for sign in/out operations.

**Sign In (Credentials):**
```
POST /api/auth/callback/credentials
Content-Type: application/x-www-form-urlencoded

email=user@example.com&password=SecurePass123!
```

**Sign Out:**
```
POST /api/auth/signout
```

---

### POST /api/auth/verify-email

Verify email with 6-digit code.

**Request Body:**
```json
{
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "message": "Email verified successfully"
}
```

**Errors:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | INVALID_CODE | Code is invalid or expired |
| 401 | UNAUTHORIZED | Not logged in |

---

### POST /api/auth/resend-verification

Resend verification email.

**Request:** No body required (uses session user)

**Response (200 OK):**
```json
{
  "message": "Verification email sent"
}
```

**Rate Limit:** 1 request per 60 seconds

---

### POST /api/auth/forgot-password

Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "If an account exists, a reset email has been sent"
}
```

> Note: Always returns success to prevent email enumeration.

---

### POST /api/auth/reset-password

Reset password with token.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successful"
}
```

**Errors:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | INVALID_TOKEN | Token is invalid or expired |
| 400 | WEAK_PASSWORD | Password doesn't meet requirements |

---

## User Profile

### GET /api/user/profile

Get current user profile.

**Response (200 OK):**
```json
{
  "id": "clxx...",
  "email": "user@example.com",
  "name": "John Doe",
  "emailVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### PATCH /api/user/profile

Update user profile.

**Request Body:**
```json
{
  "name": "Jane Doe"
}
```

**Response (200 OK):**
```json
{
  "id": "clxx...",
  "name": "Jane Doe",
  "email": "user@example.com"
}
```

---

### PATCH /api/user/password

Change password.

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password updated successfully"
}
```

**Errors:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | INVALID_PASSWORD | Current password is incorrect |
| 400 | WEAK_PASSWORD | New password doesn't meet requirements |

---

### DELETE /api/user/delete

Delete user account.

**Request Body:**
```json
{
  "password": "CurrentPass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Account deleted successfully"
}
```

> Warning: This action is irreversible. All user data will be deleted.

---

## Security

### Account Lockout

After 5 failed login attempts, the account is locked for 15 minutes.

### Session Expiry

Sessions expire after 24 hours of inactivity.

### Rate Limiting

Authentication endpoints are rate-limited:
- Login: 5 attempts per 15 minutes
- Password reset: 3 requests per hour
- Verification resend: 1 request per minute
