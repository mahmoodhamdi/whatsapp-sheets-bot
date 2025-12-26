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
    if (strength === 0) return { label: "", color: "bg-muted" };
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
          <span
            className={cn(
              strength >= 3 ? "text-green-600" : "text-muted-foreground"
            )}
          >
            {strengthLabel.label}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300",
              strengthLabel.color
            )}
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
