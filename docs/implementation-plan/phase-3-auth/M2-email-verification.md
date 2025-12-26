# Milestone 3.2: Email Verification

> **Phase:** 3 - Authentication Enhancement
> **Status:** ⬜ Not Started
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

### Email Service Options
- **Resend** (recommended) - Developer-friendly, good free tier
- **SendGrid** - Enterprise option
- **Nodemailer + SMTP** - Self-hosted option

---

## Implementation Checklist

### 1. Update Database Schema
- [ ] Add `emailVerified` field to User model
- [ ] Create `VerificationToken` model
- [ ] Run migration

### 2. Set Up Email Service
- [ ] Install Resend SDK
- [ ] Create email service utility
- [ ] Create email templates

### 3. Create Verification Token System
- [ ] Generate 6-digit code
- [ ] Store with expiry (15 minutes)
- [ ] Handle token validation

### 4. Update Registration Flow
- [ ] Set `emailVerified: false` on creation
- [ ] Send verification email
- [ ] Redirect to verification page

### 5. Create Verification Page
- [ ] Create `src/app/(auth)/verify-email/page.tsx`
- [ ] 6-digit code input
- [ ] Resend code button
- [ ] Timer for resend cooldown

### 6. Create Verification API
- [ ] Verify token endpoint
- [ ] Resend token endpoint

### 7. Middleware Update
- [ ] Check emailVerified status
- [ ] Redirect unverified users to verification page

### 8. Testing
- [ ] Test token generation
- [ ] Test email sending (mock)
- [ ] Test verification flow

---

## Code Templates

### Schema Update (`prisma/schema.prisma`)
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String
  role          Role      @default(USER)
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  verificationTokens VerificationToken[]

  @@map("users")
}

model VerificationToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([userId])
  @@map("verification_tokens")
}
```

### Email Service Setup
```typescript
// src/lib/email/index.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: "WhatsApp Bot <noreply@yourdomain.com>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email send error:", error);
      throw new Error("Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}
```

### Verification Token Utilities
```typescript
// src/lib/auth/verification.ts
import { prisma } from "@/lib/prisma";
import { randomInt } from "crypto";

export function generateVerificationCode(): string {
  return randomInt(100000, 999999).toString();
}

export async function createVerificationToken(userId: string): Promise<string> {
  // Delete existing tokens for this user
  await prisma.verificationToken.deleteMany({
    where: { userId },
  });

  const token = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.verificationToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

export async function verifyToken(
  userId: string,
  token: string
): Promise<boolean> {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      userId,
      token,
      expiresAt: { gt: new Date() },
    },
  });

  if (!verificationToken) {
    return false;
  }

  // Mark email as verified
  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });

  // Delete used token
  await prisma.verificationToken.delete({
    where: { id: verificationToken.id },
  });

  return true;
}
```

### Email Templates
```typescript
// src/lib/email/templates.ts
export function verificationEmailTemplate(code: string, locale: string = "ar") {
  const isArabic = locale === "ar";

  return `
<!DOCTYPE html>
<html dir="${isArabic ? "rtl" : "ltr"}" lang="${locale}">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Cairo', Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .code { font-size: 32px; font-weight: bold; letter-spacing: 8px;
            background: #f0fdf4; padding: 20px; text-align: center;
            border-radius: 8px; color: #16a34a; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${isArabic ? "تأكيد بريدك الإلكتروني" : "Verify Your Email"}</h1>
    <p>${isArabic ? "استخدم الرمز التالي لتأكيد حسابك:" : "Use the following code to verify your account:"}</p>
    <div class="code">${code}</div>
    <p>${isArabic ? "هذا الرمز صالح لمدة 15 دقيقة." : "This code is valid for 15 minutes."}</p>
    <p>${isArabic ? "إذا لم تطلب هذا الرمز، يمكنك تجاهل هذا البريد." : "If you didn't request this code, you can ignore this email."}</p>
  </div>
</body>
</html>
  `;
}
```

### Send Verification API
```typescript
// src/app/api/auth/send-verification/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createVerificationToken } from "@/lib/auth/verification";
import { sendEmail } from "@/lib/email";
import { verificationEmailTemplate } from "@/lib/email/templates";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 });
    }

    // Generate and store token
    const token = await createVerificationToken(user.id);

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Verify your email - WhatsApp Bot",
      html: verificationEmailTemplate(token),
    });

    return NextResponse.json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Send verification error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
```

### Verify Token API
```typescript
// src/app/api/auth/verify-email/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verifyToken } from "@/lib/auth/verification";
import { z } from "zod";

const verifySchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = verifySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    const isValid = await verifyToken(session.user.id, result.data.code);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
```

### Verification Page
```typescript
// src/app/(auth)/verify-email/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export default function VerifyEmailPage() {
  const t = useTranslations("auth.verifyEmail");
  const router = useRouter();
  const { data: session, update } = useSession();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Send initial verification email
    sendVerificationEmail();
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const sendVerificationEmail = async () => {
    setIsResending(true);
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
      });

      if (response.ok) {
        setResendCooldown(60); // 60 second cooldown
      }
    } catch (error) {
      console.error("Failed to send verification email");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) return;

    setIsVerifying(true);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        toast.success(t("success"));
        // Update session
        await update();
        router.push("/dashboard");
      } else {
        const data = await response.json();
        toast.error(data.error || t("error"));
      }
    } catch (error) {
      toast.error(t("error"));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>
            {t("subtitle")} <strong>{session?.user?.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            {t("instruction")}
          </p>

          <Input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="text-center text-2xl tracking-widest"
            disabled={isVerifying}
          />

          <Button
            onClick={handleVerify}
            disabled={code.length !== 6 || isVerifying}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isVerifying ? (
              <>
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t("resend")}</p>
            <Button
              variant="link"
              onClick={sendVerificationEmail}
              disabled={resendCooldown > 0 || isResending}
            >
              {resendCooldown > 0
                ? `${t("resendLink")} (${resendCooldown}s)`
                : t("resendLink")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Environment Variables

Add to `.env`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxx
```

---

## Dependencies

```bash
npm install resend
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | MODIFY | Add emailVerified, VerificationToken |
| `src/lib/email/index.ts` | CREATE | Email service |
| `src/lib/email/templates.ts` | CREATE | Email templates |
| `src/lib/auth/verification.ts` | CREATE | Token utilities |
| `src/app/api/auth/send-verification/route.ts` | CREATE | Send email API |
| `src/app/api/auth/verify-email/route.ts` | CREATE | Verify token API |
| `src/app/(auth)/verify-email/page.tsx` | CREATE | Verification page |
| `src/middleware.ts` | MODIFY | Check emailVerified |

---

## Testing Instructions

```bash
# 1. Install Resend
npm install resend

# 2. Update Prisma schema and migrate
npx prisma migrate dev --name add-email-verification

# 3. Create all files

# 4. Start dev server
npm run dev

# 5. Test flow
# - Register new user
# - Check email received (use Resend dashboard or test mode)
# - Enter code on verification page
# - Verify redirect to dashboard

# 6. Test resend
# - Wait for cooldown
# - Click resend
# - New code should arrive

# 7. Run tests
npm run lint
```

---

## Acceptance Criteria

- [ ] VerificationToken model created
- [ ] Email service configured
- [ ] Verification email sent on registration
- [ ] 6-digit code input works
- [ ] Invalid code shows error
- [ ] Expired code shows error
- [ ] Successful verification updates user
- [ ] Resend with cooldown works
- [ ] Unverified users redirected
- [ ] All translations work
