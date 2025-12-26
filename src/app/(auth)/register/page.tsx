"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const locale = useLocale();

  return (
    <div className="relative">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher currentLocale={locale} />
      </div>
      <AuthCard
        title={t("title")}
        description={t("subtitle")}
        footer={
          <p className="text-sm text-muted-foreground">
            {t("haveAccount")}{" "}
            <Link
              href="/login"
              className="text-green-600 hover:text-green-700 hover:underline font-medium"
            >
              {t("loginLink")}
            </Link>
          </p>
        }
      >
        <RegisterForm />
      </AuthCard>
    </div>
  );
}
