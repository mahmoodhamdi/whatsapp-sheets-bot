# Milestone 3.4: Auth UI Improvements

> **Phase:** 3 - Authentication Enhancement
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26
> **Depends On:** M3-password-reset.md

## Objective

Improve the authentication UI with better design, animations, and user experience.

---

## Improvements

### 1. Login Page Enhancement
- Add logo and branding
- Improve form styling
- Add "Remember me" option
- Add link to forgot password
- Add link to register

### 2. Auth Layout Update
- Consistent design across all auth pages
- Background pattern or gradient
- Mobile-optimized layout

### 3. Password Strength Indicator
- Visual password strength meter
- Real-time feedback
- Color-coded (weak/medium/strong)

### 4. Form Validation UX
- Inline validation messages
- Success states
- Loading states

### 5. Transitions & Animations
- Page transitions
- Form feedback animations
- Button loading states

---

## Implementation Checklist

### 1. Update Auth Layout
- [ ] Improve `src/app/(auth)/layout.tsx`
- [ ] Add decorative background
- [ ] Add branding section
- [ ] Split layout (branding | form)

### 2. Create Password Strength Component
- [ ] Create `src/components/auth/PasswordStrength.tsx`
- [ ] Calculate password strength
- [ ] Show visual indicator
- [ ] Show requirements checklist

### 3. Update Login Page
- [ ] Improve `src/app/(auth)/login/page.tsx`
- [ ] Add forgot password link
- [ ] Add register link
- [ ] Add remember me option

### 4. Update Login Form
- [ ] Improve error display
- [ ] Add loading states
- [ ] Better validation feedback

### 5. Create Auth Card Component
- [ ] Create `src/components/auth/AuthCard.tsx`
- [ ] Consistent styling
- [ ] Logo and title

### 6. Testing
- [ ] Test all auth pages
- [ ] Test password strength indicator
- [ ] Test form validation UX

---

## Code Templates

### Auth Layout with Split Design
```typescript
// src/app/(auth)/layout.tsx
import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { MessageSquare } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const t = await getTranslations("auth");

  return (
    <div className="min-h-screen flex">
      {/* Branding Side - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-700 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-10 w-10" />
            <span className="text-2xl font-bold">{t("brand")}</span>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            {t("brandTagline")}
          </h1>
          <p className="text-green-100 text-lg">
            {t("brandDescription")}
          </p>

          {/* Features list */}
          <ul className="space-y-3">
            {["feature1", "feature2", "feature3"].map((key) => (
              <li key={key} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-300" />
                {t(`brandFeatures.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm text-green-200">
          © {new Date().getFullYear()} WhatsApp Bot
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### Password Strength Component
```typescript
// src/components/auth/PasswordStrength.tsx
"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  key: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  { key: "minLength", test: (p) => p.length >= 8 },
  { key: "hasUppercase", test: (p) => /[A-Z]/.test(p) },
  { key: "hasLowercase", test: (p) => /[a-z]/.test(p) },
  { key: "hasNumber", test: (p) => /[0-9]/.test(p) },
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const t = useTranslations("auth.passwordStrength");

  const { strength, passedRequirements } = useMemo(() => {
    const passed = requirements.filter((req) => req.test(password));
    return {
      strength: passed.length,
      passedRequirements: passed.map((r) => r.key),
    };
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (strength === 0) return { label: t("empty"), color: "bg-muted" };
    if (strength === 1) return { label: t("weak"), color: "bg-red-500" };
    if (strength === 2) return { label: t("fair"), color: "bg-orange-500" };
    if (strength === 3) return { label: t("good"), color: "bg-yellow-500" };
    return { label: t("strong"), color: "bg-green-500" };
  }, [strength, t]);

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{t("strength")}</span>
          <span className={cn(
            strength >= 3 ? "text-green-600" : "text-muted-foreground"
          )}>
            {strengthLabel.label}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300", strengthLabel.color)}
            style={{ width: `${(strength / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <ul className="space-y-1">
        {requirements.map((req) => {
          const isPassed = passedRequirements.includes(req.key);
          return (
            <li
              key={req.key}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                isPassed ? "text-green-600" : "text-muted-foreground"
              )}
            >
              {isPassed ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              {t(`requirements.${req.key}`)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

### Auth Card Component
```typescript
// src/components/auth/AuthCard.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  showLogo?: boolean;
}

export function AuthCard({
  title,
  description,
  children,
  showLogo = true,
}: AuthCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        {showLogo && (
          <Link href="/" className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
          </Link>
        )}
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
```

### Updated Login Form
```typescript
// src/components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { toast } from "sonner";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tErrors = useTranslations("errors.auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(tErrors("invalidCredentials"));
        return;
      }

      router.push(callbackUrl);
    } catch (error) {
      toast.error(tErrors("somethingWrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          {...register("email")}
          disabled={isLoading}
          className="h-11"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t("password")}</Label>
          <Link
            href="/forgot-password"
            className="text-sm text-green-600 hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("passwordPlaceholder")}
            {...register("password")}
            disabled={isLoading}
            className="h-11"
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

      {/* Remember Me */}
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked === true)}
        />
        <Label htmlFor="remember" className="text-sm font-normal">
          {t("rememberMe")}
        </Label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full h-11 bg-green-600 hover:bg-green-700"
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

      <Separator className="my-6" />

      {/* Register Link */}
      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-green-600 hover:underline font-medium">
          {t("registerLink")}
        </Link>
      </p>
    </form>
  );
}
```

---

## Translation Updates

### Add to `messages/ar.json`
```json
{
  "auth": {
    "brand": "واتساب بوت",
    "brandTagline": "أتمتة ردودك. زيادة مبيعاتك.",
    "brandDescription": "انضم لآلاف الأعمال التي تستخدم منصتنا لأتمتة خدمة العملاء",
    "brandFeatures": {
      "feature1": "ردود تلقائية ذكية على مدار الساعة",
      "feature2": "مزامنة تلقائية مع جوجل شيتس",
      "feature3": "تحليلات مفصلة لأداء الردود"
    },
    "login": {
      "forgotPassword": "نسيت كلمة المرور؟",
      "rememberMe": "تذكرني",
      "noAccount": "ليس لديك حساب؟",
      "registerLink": "سجل الآن"
    },
    "passwordStrength": {
      "strength": "قوة كلمة المرور",
      "empty": "",
      "weak": "ضعيفة",
      "fair": "مقبولة",
      "good": "جيدة",
      "strong": "قوية",
      "requirements": {
        "minLength": "8 أحرف على الأقل",
        "hasUppercase": "حرف كبير واحد على الأقل",
        "hasLowercase": "حرف صغير واحد على الأقل",
        "hasNumber": "رقم واحد على الأقل"
      }
    }
  }
}
```

### Add to `messages/en.json`
```json
{
  "auth": {
    "brand": "WhatsApp Bot",
    "brandTagline": "Automate Your Replies. Grow Your Sales.",
    "brandDescription": "Join thousands of businesses using our platform to automate customer service",
    "brandFeatures": {
      "feature1": "Smart 24/7 auto-replies",
      "feature2": "Automatic Google Sheets sync",
      "feature3": "Detailed reply performance analytics"
    },
    "login": {
      "forgotPassword": "Forgot password?",
      "rememberMe": "Remember me",
      "noAccount": "Don't have an account?",
      "registerLink": "Sign up now"
    },
    "passwordStrength": {
      "strength": "Password strength",
      "empty": "",
      "weak": "Weak",
      "fair": "Fair",
      "good": "Good",
      "strong": "Strong",
      "requirements": {
        "minLength": "At least 8 characters",
        "hasUppercase": "At least one uppercase letter",
        "hasLowercase": "At least one lowercase letter",
        "hasNumber": "At least one number"
      }
    }
  }
}
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/app/(auth)/layout.tsx` | MODIFY | Split design layout |
| `src/components/auth/PasswordStrength.tsx` | CREATE | Password strength indicator |
| `src/components/auth/AuthCard.tsx` | CREATE | Reusable auth card |
| `src/components/auth/LoginForm.tsx` | CREATE | Improved login form |
| `src/app/(auth)/login/page.tsx` | MODIFY | Use new components |
| `messages/ar.json` | MODIFY | Add translations |
| `messages/en.json` | MODIFY | Add translations |

---

## Acceptance Criteria

- [ ] Split layout on desktop (branding | form)
- [ ] Mobile shows form only
- [ ] Password strength indicator works
- [ ] Remember me checkbox visible
- [ ] Forgot password link works
- [ ] Register link works
- [ ] Loading states visible
- [ ] All translations work
- [ ] RTL layout correct
- [ ] Dark mode works
