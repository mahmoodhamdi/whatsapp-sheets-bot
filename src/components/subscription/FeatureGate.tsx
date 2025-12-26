"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface FeatureGateProps {
  /**
   * The feature being gated
   */
  feature: string;
  /**
   * Whether the user has access to this feature
   */
  hasAccess: boolean;
  /**
   * The content to show if user has access
   */
  children: ReactNode;
  /**
   * The plan required to access this feature
   */
  requiredPlan?: string;
  /**
   * Custom title for the locked state
   */
  title?: string;
  /**
   * Custom description for the locked state
   */
  description?: string;
  /**
   * Whether to show a compact version
   */
  compact?: boolean;
  /**
   * Custom class name for the wrapper
   */
  className?: string;
}

export function FeatureGate({
  feature,
  hasAccess,
  children,
  requiredPlan = "Professional",
  title,
  description,
  compact = false,
  className = "",
}: FeatureGateProps) {
  const t = useTranslations("featureGate");

  if (hasAccess) {
    return <>{children}</>;
  }

  // Compact version for inline use
  if (compact) {
    return (
      <div
        className={`flex items-center gap-3 p-4 bg-muted/50 border border-dashed rounded-lg ${className}`}
      >
        <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title || t("locked")}</p>
          <p className="text-xs text-muted-foreground">
            {t("requiresPlan", { plan: requiredPlan })}
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/pricing">{t("upgrade")}</Link>
        </Button>
      </div>
    );
  }

  // Full card version
  return (
    <Card className={`border-dashed bg-muted/30 ${className}`}>
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl">
          {title || t(`features.${feature}.title`, { fallback: t("locked") })}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          {description ||
            t(`features.${feature}.description`, {
              fallback: t("requiresPlan", { plan: requiredPlan }),
            })}
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>{t("availableIn", { plan: requiredPlan })}</span>
        </div>

        <Button asChild className="mt-4">
          <Link href="/pricing" className="gap-2">
            {t("viewPlans")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * A simpler locked overlay that can wrap any content
 */
interface LockedOverlayProps {
  children: ReactNode;
  hasAccess: boolean;
  requiredPlan?: string;
}

export function LockedOverlay({
  children,
  hasAccess,
  requiredPlan = "Professional",
}: LockedOverlayProps) {
  const t = useTranslations("featureGate");

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-30 pointer-events-none select-none blur-sm">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
        <div className="text-center p-6">
          <Lock className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium mb-1">{t("locked")}</p>
          <p className="text-sm text-muted-foreground mb-4">
            {t("requiresPlan", { plan: requiredPlan })}
          </p>
          <Button asChild size="sm">
            <Link href="/pricing">{t("upgrade")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
