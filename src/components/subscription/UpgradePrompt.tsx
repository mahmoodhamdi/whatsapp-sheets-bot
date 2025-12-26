"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, ArrowRight, Crown, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

interface UpgradePromptProps {
  /**
   * The feature that requires upgrade
   */
  feature?: string;
  /**
   * The plan required for this feature
   */
  requiredPlan?: string;
  /**
   * Current user's plan
   */
  currentPlan?: string;
  /**
   * Variant style
   */
  variant?: "default" | "banner" | "inline" | "card";
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Whether to show the current plan badge
   */
  showCurrentPlan?: boolean;
}

export function UpgradePrompt({
  feature,
  requiredPlan = "Professional",
  currentPlan = "Free",
  variant = "default",
  className = "",
  showCurrentPlan = true,
}: UpgradePromptProps) {
  const t = useTranslations("featureGate");

  // Banner variant - full width promotional banner
  if (variant === "banner") {
    return (
      <div
        className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-lg ${className}`}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6" />
            <div>
              <p className="font-semibold">{t("upgradeTitle")}</p>
              <p className="text-sm text-green-100">
                {t("upgradeDescription", { plan: requiredPlan })}
              </p>
            </div>
          </div>
          <Button asChild variant="secondary" className="shrink-0">
            <Link href="/pricing" className="gap-2">
              {t("viewPlans")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Inline variant - compact single line
  if (variant === "inline") {
    return (
      <div
        className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
      >
        <Zap className="h-4 w-4 text-amber-500" />
        <span>
          {feature ? t("featureRequires", { feature, plan: requiredPlan }) : t("requiresPlan", { plan: requiredPlan })}
        </span>
        <Link
          href="/pricing"
          className="text-primary hover:underline font-medium"
        >
          {t("upgrade")}
        </Link>
      </div>
    );
  }

  // Card variant - styled card with icon
  if (variant === "card") {
    return (
      <div
        className={`p-6 border rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800 ${className}`}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
            <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">
              {t("upgradeTitle")}
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              {t("upgradeDescription", { plan: requiredPlan })}
            </p>
            {showCurrentPlan && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                {t("currentPlan", { plan: currentPlan })}
              </p>
            )}
            <Button asChild size="sm" className="mt-4" variant="outline">
              <Link href="/pricing">{t("viewPlans")}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default variant - alert style
  return (
    <Alert className={className}>
      <Sparkles className="h-4 w-4" />
      <AlertTitle>{t("upgradeTitle")}</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{t("upgradeDescription", { plan: requiredPlan })}</p>
        {showCurrentPlan && (
          <p className="text-xs mt-1">
            {t("currentPlan", { plan: currentPlan })}
          </p>
        )}
        <Button asChild size="sm" className="mt-3" variant="outline">
          <Link href="/pricing">{t("viewPlans")}</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}

/**
 * A simple "Pro" badge to indicate premium features
 */
interface ProBadgeProps {
  plan?: string;
  className?: string;
}

export function ProBadge({ plan = "Pro", className = "" }: ProBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 ${className}`}
    >
      <Crown className="h-3 w-3" />
      {plan}
    </span>
  );
}
