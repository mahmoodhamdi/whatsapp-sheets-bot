# Milestone 3.1: Registration System

> **Phase:** 3 - Authentication Enhancement
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26
> **Depends On:** Phase 1 Complete

## Objective

Implement a complete user registration system with form validation and database integration.

---

## Context

### Current Auth Setup
- NextAuth v5 with Credentials provider
- JWT session strategy
- Login page exists at `/login`
- User model with: id, email, password (hashed), name, role

### New Requirements
- Registration page at `/register`
- Form: name, email, password, confirm password, terms checkbox
- Password requirements: min 8 chars, 1 uppercase, 1 number
- Email uniqueness check
- Automatic login after registration

---

## Implementation Checklist

### 1. Create Registration API Route
- [ ] Create `src/app/api/auth/register/route.ts`
- [ ] Validate input with Zod
- [ ] Check email uniqueness
- [ ] Hash password with bcrypt
- [ ] Create user in database
- [ ] Return success/error response

### 2. Create Registration Page
- [ ] Create `src/app/(auth)/register/page.tsx`
- [ ] Use React Hook Form + Zod
- [ ] Add all form fields
- [ ] Show validation errors
- [ ] Handle submission

### 3. Create Registration Form Component
- [ ] Create `src/components/auth/RegisterForm.tsx`
- [ ] Password visibility toggle
- [ ] Terms checkbox with links
- [ ] Loading state

### 4. Add Validation Schema
- [ ] Create `src/lib/validations/auth.ts`
- [ ] Email format validation
- [ ] Password strength validation
- [ ] Confirm password match

### 5. Auto-Login After Registration
- [ ] Call signIn after successful registration
- [ ] Redirect to dashboard
- [ ] Handle errors gracefully

### 6. Testing
- [ ] Unit test validation schema
- [ ] Test API route
- [ ] E2E test registration flow

---

## Code Templates

### Registration API Route
```typescript
// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
```

### Validation Schema
```typescript
// src/lib/validations/auth.ts
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

### Registration Form Component
```typescript
// src/components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth";
import { toast } from "sonner";

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const tErrors = useTranslations("errors.auth");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || tErrors("somethingWrong"));
        return;
      }

      // Auto-login after registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error(tErrors("invalidCredentials"));
        return;
      }

      toast.success(t("success"));
      router.push("/dashboard");
    } catch (error) {
      toast.error(tErrors("somethingWrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          placeholder={t("namePlaceholder")}
          {...register("name")}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          {...register("email")}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("passwordPlaceholder")}
            {...register("password")}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute end-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={t("confirmPasswordPlaceholder")}
          {...register("confirmPassword")}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start space-x-2 rtl:space-x-reverse">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setValue("acceptTerms", checked === true)}
          disabled={isLoading}
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="terms" className="text-sm font-normal">
            {t("terms")}{" "}
            <Link href="/terms" className="text-green-600 hover:underline">
              {t("termsLink")}
            </Link>{" "}
            {t("and")}{" "}
            <Link href="/privacy" className="text-green-600 hover:underline">
              {t("privacyLink")}
            </Link>
          </Label>
          {errors.acceptTerms && (
            <p className="text-sm text-destructive">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={isLoading}
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

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground">
        {t("haveAccount")}{" "}
        <Link href="/login" className="text-green-600 hover:underline">
          {t("loginLink")}
        </Link>
      </p>
    </form>
  );
}
```

### Registration Page
```typescript
// src/app/(auth)/register/page.tsx
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export default async function RegisterPage() {
  const t = await getTranslations("auth.register");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex justify-center mb-4">
            <MessageSquare className="h-10 w-10 text-green-600" />
          </Link>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Dependencies

```bash
# Checkbox component (if not installed)
npx shadcn@latest add checkbox
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/app/api/auth/register/route.ts` | CREATE | Registration API |
| `src/lib/validations/auth.ts` | CREATE | Validation schemas |
| `src/components/auth/RegisterForm.tsx` | CREATE | Registration form |
| `src/app/(auth)/register/page.tsx` | CREATE | Registration page |
| `src/middleware.ts` | MODIFY | Add /register to public routes |
| `messages/ar.json` | MODIFY | Add registration translations |
| `messages/en.json` | MODIFY | Add registration translations |

---

## Testing Instructions

```bash
# 1. Install checkbox if needed
npx shadcn@latest add checkbox

# 2. Create all files

# 3. Start dev server
npm run dev

# 4. Test registration
# - Go to /register
# - Try invalid inputs (validation)
# - Try existing email (409 error)
# - Complete valid registration
# - Verify redirect to dashboard
# - Verify user in database

# 5. Run tests
npm run test
npm run lint
```

---

## Unit Test

```typescript
// tests/unit/validations.test.ts
import { describe, it, expect } from "vitest";
import { registerSchema } from "@/lib/validations/auth";

describe("registerSchema", () => {
  it("should validate correct data", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Password1",
      confirmPassword: "Password1",
      acceptTerms: true,
    });
    expect(result.success).toBe(true);
  });

  it("should reject weak password", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "weak",
      confirmPassword: "weak",
      acceptTerms: true,
    });
    expect(result.success).toBe(false);
  });

  it("should reject mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Password1",
      confirmPassword: "Password2",
      acceptTerms: true,
    });
    expect(result.success).toBe(false);
  });
});
```

---

## Acceptance Criteria

- [ ] Registration form displays all fields
- [ ] Validation errors show correctly
- [ ] Password visibility toggle works
- [ ] Terms checkbox required
- [ ] Duplicate email shows error
- [ ] Successful registration creates user
- [ ] Auto-login redirects to dashboard
- [ ] RTL layout correct
- [ ] All translations work
- [ ] Unit tests pass
