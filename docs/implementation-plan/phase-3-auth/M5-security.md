# Milestone 3.5: Auth Security Hardening

> **Phase:** 3 - Authentication Enhancement
> **Status:** ✅ Complete
> **Last Updated:** 2025-12-26
> **Depends On:** M4-auth-ui.md

## Objective

Implement security best practices for the authentication system.

---

## Security Measures

### 1. Rate Limiting
- Limit login attempts per IP
- Limit password reset requests
- Limit verification code requests

### 2. Account Lockout
- Lock account after 5 failed attempts
- Unlock after 15 minutes or email verification

### 3. Session Security
- Secure cookie settings
- Session invalidation on password change
- Force logout from all devices option

### 4. Password Security
- Password hash strength (bcrypt rounds)
- Password history (prevent reuse)
- Compromised password check (optional)

### 5. Audit Logging
- Log authentication events
- Log security-related actions

---

## Implementation Checklist

### 1. Rate Limiting
- [x] Install rate limiting package (in-memory implementation)
- [x] Create rate limiter utility
- [x] Apply to login endpoint
- [x] Apply to password reset endpoint
- [x] Apply to verification endpoint

### 2. Account Lockout
- [x] Add `failedLoginAttempts` to User model
- [x] Add `lockedUntil` to User model
- [x] Implement lockout logic
- [x] Implement unlock mechanism

### 3. Session Management
- [x] Review cookie settings
- [x] Add session invalidation on password change
- [x] Create logout all devices endpoint

### 4. Audit Logging
- [x] Create `AuditLog` model
- [x] Log login attempts
- [x] Log password changes
- [x] Log suspicious activity

### 5. Security Headers
- [x] Add security headers middleware
- [x] Configure security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- [x] Add XSS protection

### 6. Testing
- [x] Test rate limiting
- [x] Test account lockout
- [x] Test session invalidation

---

## Code Templates

### Schema Updates
```prisma
model User {
  id                  String    @id @default(cuid())
  email               String    @unique
  password            String
  name                String
  role                Role      @default(USER)
  emailVerified       Boolean   @default(false)
  failedLoginAttempts Int       @default(0)
  lockedUntil         DateTime?
  lastPasswordChange  DateTime  @default(now())
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  verificationTokens VerificationToken[]
  auditLogs          AuditLog[]
  sessions           Session[]

  @@map("users")
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token        String   @unique
  userAgent    String?
  ipAddress    String?
  lastActivity DateTime @default(now())
  expiresAt    DateTime
  createdAt    DateTime @default(now())

  @@index([userId])
  @@map("sessions")
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  action    String
  details   Json?
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([action])
  @@index([createdAt])
  @@map("audit_logs")
}
```

### Rate Limiter Utility
```typescript
// src/lib/security/rate-limit.ts
import { NextResponse } from "next/server";

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Max requests per window
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  return async function(identifier: string): Promise<{ success: boolean; remaining: number }> {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return { success: true, remaining: config.max - 1 };
    }

    if (record.count >= config.max) {
      return { success: false, remaining: 0 };
    }

    record.count++;
    return { success: true, remaining: config.max - record.count };
  };
}

// Pre-configured limiters
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
});

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests
});

export const verificationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // 1 request
});
```

### Account Lockout Logic
```typescript
// src/lib/security/lockout.ts
import { prisma } from "@/lib/prisma";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function checkAccountLocked(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { lockedUntil: true },
  });

  if (!user) return false;

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return true;
  }

  return false;
}

export async function recordFailedAttempt(email: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, failedLoginAttempts: true },
  });

  if (!user) return;

  const newAttempts = user.failedLoginAttempts + 1;
  const shouldLock = newAttempts >= MAX_FAILED_ATTEMPTS;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: newAttempts,
      lockedUntil: shouldLock
        ? new Date(Date.now() + LOCKOUT_DURATION_MS)
        : null,
    },
  });
}

export async function resetFailedAttempts(email: string): Promise<void> {
  await prisma.user.update({
    where: { email },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
}
```

### Audit Logging
```typescript
// src/lib/security/audit.ts
import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "PASSWORD_CHANGED"
  | "PASSWORD_RESET_REQUESTED"
  | "PASSWORD_RESET_COMPLETED"
  | "EMAIL_VERIFIED"
  | "ACCOUNT_LOCKED"
  | "ACCOUNT_UNLOCKED";

interface AuditLogData {
  userId?: string;
  action: AuditAction;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

// Helper to get client info from request
export function getClientInfo(request: Request): {
  ipAddress: string;
  userAgent: string;
} {
  return {
    ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    userAgent: request.headers.get("user-agent") || "unknown",
  };
}
```

### Updated Login with Security
```typescript
// Update src/lib/auth.ts callbacks
import { checkAccountLocked, recordFailedAttempt, resetFailedAttempts } from "@/lib/security/lockout";
import { createAuditLog, getClientInfo } from "@/lib/security/audit";

// In credentials provider authorize function:
async authorize(credentials, request) {
  if (!credentials?.email || !credentials?.password) {
    return null;
  }

  const email = credentials.email as string;

  // Check if account is locked
  const isLocked = await checkAccountLocked(email);
  if (isLocked) {
    await createAuditLog({
      action: "LOGIN_FAILED",
      details: { email, reason: "account_locked" },
      ...getClientInfo(request),
    });
    throw new Error("Account is temporarily locked");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const passwordMatch = await bcrypt.compare(
    credentials.password as string,
    user.password
  );

  if (!passwordMatch) {
    await recordFailedAttempt(email);
    await createAuditLog({
      userId: user.id,
      action: "LOGIN_FAILED",
      details: { reason: "invalid_password" },
      ...getClientInfo(request),
    });
    return null;
  }

  // Reset failed attempts on successful login
  await resetFailedAttempts(email);

  await createAuditLog({
    userId: user.id,
    action: "LOGIN_SUCCESS",
    ...getClientInfo(request),
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
```

### Security Headers Middleware
```typescript
// src/middleware.ts - Add security headers
import { NextResponse } from "next/server";

export default auth((req) => {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // CSP (adjust as needed)
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  return response;
});
```

### Logout All Devices API
```typescript
// src/app/api/auth/logout-all/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog, getClientInfo } from "@/lib/security/audit";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all sessions for user (if using database sessions)
    await prisma.session.deleteMany({
      where: { userId: session.user.id },
    });

    await createAuditLog({
      userId: session.user.id,
      action: "LOGOUT",
      details: { type: "all_devices" },
      ...getClientInfo(request),
    });

    return NextResponse.json({ message: "Logged out from all devices" });
  } catch (error) {
    console.error("Logout all error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | MODIFY | Add security fields, AuditLog, Session |
| `src/lib/security/rate-limit.ts` | CREATE | Rate limiting utility |
| `src/lib/security/lockout.ts` | CREATE | Account lockout logic |
| `src/lib/security/audit.ts` | CREATE | Audit logging |
| `src/lib/auth.ts` | MODIFY | Add security checks |
| `src/middleware.ts` | MODIFY | Add security headers |
| `src/app/api/auth/logout-all/route.ts` | CREATE | Logout all devices |

---

## Production Considerations

### Use Redis for Rate Limiting
```typescript
// For production, use Redis instead of in-memory store
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});
```

### Environment Variables
```env
# For production rate limiting
UPSTASH_REDIS_URL=https://xxx.upstash.io
UPSTASH_REDIS_TOKEN=xxx
```

---

## Testing Instructions

```bash
# 1. Update schema and migrate
npx prisma migrate dev --name add-security-features

# 2. Create security utilities

# 3. Test rate limiting
# - Try logging in 6 times rapidly
# - Should be blocked after 5 attempts

# 4. Test account lockout
# - Enter wrong password 5 times
# - Account should be locked
# - Wait 15 minutes or unlock manually

# 5. Test audit logs
# - Check database for audit entries
# - Verify all actions logged

# 6. Test security headers
# - Check response headers in browser dev tools

# 7. Run tests
npm run lint
```

---

## Acceptance Criteria

- [x] Rate limiting works on login
- [x] Rate limiting works on password reset
- [x] Account locks after 5 failed attempts
- [x] Account unlocks after 15 minutes
- [x] Audit logs created for auth events
- [x] Security headers present
- [x] Logout all devices works
- [x] All tests pass

---

## Phase 3 Completion

After this milestone, Phase 3 is complete:

- [x] M1: Registration ✅
- [x] M2: Email Verification ✅
- [x] M3: Password Reset ✅
- [x] M4: Auth UI ✅
- [x] M5: Security ✅

**Phase 3 Complete!**
