"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface UsageLimitWarningProps {
  usagePercent: number;
  resourceName: "messages" | "rules";
  used?: number;
  limit?: number;
  className?: string;
}

export function UsageLimitWarning({
  usagePercent,
  resourceName,
  used,
  limit,
  className = "",
}: UsageLimitWarningProps) {
  const t = useTranslations("usageLimitWarning");

  // Don't show if below 80%
  if (usagePercent < 80) return null;

  const isAtLimit = usagePercent >= 100;
  const variant = isAtLimit ? "destructive" : "default";

  return (
    <Alert
      variant={variant}
      className={`${
        !isAtLimit
          ? "border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800"
          : ""
      } ${className}`}
    >
      <AlertTriangle
        className={`h-4 w-4 ${!isAtLimit ? "text-amber-600" : ""}`}
      />
      <AlertTitle className={!isAtLimit ? "text-amber-800 dark:text-amber-200" : ""}>
        {isAtLimit ? t("atLimitTitle") : t("nearLimitTitle")}
      </AlertTitle>
      <AlertDescription
        className={`flex flex-col sm:flex-row sm:items-center gap-3 ${
          !isAtLimit ? "text-amber-700 dark:text-amber-300" : ""
        }`}
      >
        <span className="flex-1">
          {isAtLimit
            ? t("atLimitDescription", { resource: t(`resources.${resourceName}`) })
            : t("nearLimitDescription", {
                resource: t(`resources.${resourceName}`),
                percent: Math.round(usagePercent),
                used: used ?? 0,
                limit: limit ?? 0,
              })}
        </span>
        <Button asChild size="sm" variant={isAtLimit ? "default" : "outline"}>
          <Link href="/pricing" className="gap-2">
            {t("upgrade")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Rule limit specific warning - shown when trying to create rules at limit
 */
interface RuleLimitWarningProps {
  currentRules: number;
  maxRules: number;
  className?: string;
}

export function RuleLimitWarning({
  currentRules,
  maxRules,
  className = "",
}: RuleLimitWarningProps) {
  const t = useTranslations("usageLimitWarning");

  if (currentRules < maxRules) return null;

  return (
    <Alert variant="destructive" className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t("ruleLimitTitle")}</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="flex-1">
          {t("ruleLimitDescription", { current: currentRules, max: maxRules })}
        </span>
        <Button asChild size="sm">
          <Link href="/pricing" className="gap-2">
            {t("upgradeForMore")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
