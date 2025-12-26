# Milestone 3.3: Password Reset

> **Phase:** 3 - Authentication Enhancement
> **Status:** ⬜ Not Started
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
- [ ] Create `PasswordResetToken` model
- [ ] Run migration

### 2. Create Forgot Password Page
- [ ] Create `src/app/(auth)/forgot-password/page.tsx`
- [ ] Email input form
- [ ] Success message display

### 3. Create Reset Password Page
- [ ] Create `src/app/(auth)/reset-password/page.tsx`
- [ ] Token validation
- [ ] New password form
- [ ] Confirm password

### 4. Create API Routes
- [ ] POST `/api/auth/forgot-password` - send reset email
- [ ] POST `/api/auth/reset-password` - update password

### 5. Email Template
- [ ] Create password reset email template
- [ ] Include reset link with token

### 6. Testing
- [ ] Test forgot password flow
- [ ] Test invalid/expired tokens
- [ ] Test successful reset

---

## Code Templates

### Schema Update (`prisma/schema.prisma`)
```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  email     String
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([email])
  @@map("password_reset_tokens")
}
```

### Password Reset Utilities
```typescript
// src/lib/auth/password-reset.ts
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createPasswordResetToken(email: string): Promise<string> {
  // Delete existing tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });

  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      token,
      email,
      expiresAt,
    },
  });

  return token;
}

export async function validateResetToken(token: string): Promise<string | null> {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    return null;
  }

  if (resetToken.expiresAt < new Date()) {
    // Token expired, delete it
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });
    return null;
  }

  return resetToken.email;
}

export async function consumeResetToken(token: string): Promise<void> {
  await prisma.passwordResetToken.delete({
    where: { token },
  });
}
```

### Forgot Password API
```typescript
// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/auth/password-reset";
import { sendEmail } from "@/lib/email";
import { passwordResetEmailTemplate } from "@/lib/email/templates";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: "If the email exists, a reset link has been sent" });
    }

    // Create reset token
    const token = await createPasswordResetToken(email);

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // Send email
    await sendEmail({
      to: email,
      subject: "Reset your password - WhatsApp Bot",
      html: passwordResetEmailTemplate(resetUrl),
    });

    return NextResponse.json({ message: "If the email exists, a reset link has been sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
```

### Reset Password API
```typescript
// src/app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateResetToken, consumeResetToken } from "@/lib/auth/password-reset";
import bcrypt from "bcryptjs";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    const { token, password } = result.data;

    // Validate token
    const email = await validateResetToken(token);

    if (!email) {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Delete the used token
    await consumeResetToken(token);

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
```

### Email Template
```typescript
// Add to src/lib/email/templates.ts
export function passwordResetEmailTemplate(resetUrl: string, locale: string = "ar") {
  const isArabic = locale === "ar";

  return `
<!DOCTYPE html>
<html dir="${isArabic ? "rtl" : "ltr"}" lang="${locale}">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Cairo', Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; background: #16a34a; color: white;
              padding: 12px 24px; text-decoration: none; border-radius: 8px;
              font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${isArabic ? "إعادة تعيين كلمة المرور" : "Reset Your Password"}</h1>
    <p>${isArabic ? "تلقينا طلباً لإعادة تعيين كلمة مرورك. انقر على الزر أدناه:" : "We received a request to reset your password. Click the button below:"}</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" class="button">
        ${isArabic ? "إعادة تعيين كلمة المرور" : "Reset Password"}
      </a>
    </p>
    <p>${isArabic ? "هذا الرابط صالح لمدة ساعة واحدة." : "This link is valid for 1 hour."}</p>
    <p>${isArabic ? "إذا لم تطلب إعادة التعيين، يمكنك تجاهل هذا البريد." : "If you didn't request this, you can ignore this email."}</p>
  </div>
</body>
</html>
  `;
}
```

### Forgot Password Page
```typescript
// src/app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        toast.error(t("error"));
      }
    } catch (error) {
      toast.error(t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("successTitle")}</h2>
            <p className="text-muted-foreground mb-6">{t("success")}</p>
            <Button variant="outline" asChild>
              <Link href="/login">
                <ArrowLeft className="me-2 h-4 w-4 rtl:rotate-180" />
                {t("backToLogin")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>

            <Button variant="link" className="w-full" asChild>
              <Link href="/login">{t("backToLogin")}</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Reset Password Page
```typescript
// src/app/(auth)/reset-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const t = useTranslations("auth.resetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidToken, setIsInvalidToken] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsInvalidToken(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        const data = await response.json();
        if (data.error.includes("expired")) {
          setIsInvalidToken(true);
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      toast.error(t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isInvalidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("invalidTokenTitle")}</h2>
            <p className="text-muted-foreground mb-6">{t("invalidToken")}</p>
            <Button asChild>
              <Link href="/forgot-password">{t("requestNewLink")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("successTitle")}</h2>
            <p className="text-muted-foreground">{t("success")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Lock className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute end-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t("confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading || !password || !confirmPassword}
            >
              {isLoading ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | MODIFY | Add PasswordResetToken |
| `src/lib/auth/password-reset.ts` | CREATE | Reset token utilities |
| `src/lib/email/templates.ts` | MODIFY | Add reset email template |
| `src/app/api/auth/forgot-password/route.ts` | CREATE | Forgot password API |
| `src/app/api/auth/reset-password/route.ts` | CREATE | Reset password API |
| `src/app/(auth)/forgot-password/page.tsx` | CREATE | Forgot password page |
| `src/app/(auth)/reset-password/page.tsx` | CREATE | Reset password page |
| `src/middleware.ts` | MODIFY | Add routes to public |

---

## Testing Instructions

```bash
# 1. Update schema and migrate
npx prisma migrate dev --name add-password-reset-token

# 2. Create all files

# 3. Start dev server
npm run dev

# 4. Test forgot password
# - Go to /login, click "Forgot Password"
# - Enter email
# - Check email for reset link
# - Click link

# 5. Test reset password
# - Enter new password
# - Verify redirect to login
# - Login with new password

# 6. Test invalid token
# - Go to /reset-password?token=invalid
# - Should show error

# 7. Run tests
npm run lint
```

---

## Acceptance Criteria

- [ ] Forgot password form works
- [ ] Reset email sent with link
- [ ] Reset link opens reset page
- [ ] Invalid/expired token shows error
- [ ] Password updated successfully
- [ ] User can login with new password
- [ ] All translations work
- [ ] RTL layout correct
