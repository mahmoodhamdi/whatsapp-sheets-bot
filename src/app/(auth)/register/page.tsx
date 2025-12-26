"use client";

import { useTranslations, useLocale } from "next-intl";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const locale = useLocale();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-green-500 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
          </Link>
          <LanguageSwitcher currentLocale={locale} />
        </div>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
