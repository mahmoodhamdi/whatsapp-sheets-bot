"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, ArrowUpRight } from "lucide-react";

interface PlanBadgeProps {
  planName: string;
  planSlug: string;
  showUpgradeLink?: boolean;
  className?: string;
}

export function PlanBadge({
  planName,
  planSlug,
  showUpgradeLink = true,
  className = "",
}: PlanBadgeProps) {
  const t = useTranslations("planBadge");
  const isFree = planSlug === "free";
  const isPremium = ["professional", "enterprise"].includes(planSlug);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge
        variant={isFree ? "secondary" : "default"}
        className={`gap-1 ${
          isPremium
            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"
            : ""
        }`}
      >
        {isPremium ? (
          <Crown className="h-3 w-3" />
        ) : isFree ? null : (
          <Sparkles className="h-3 w-3" />
        )}
        {planName}
      </Badge>
      {isFree && showUpgradeLink && (
        <Link
          href="/pricing"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          {t("upgrade")}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

/**
 * Async wrapper that fetches subscription data
 */
export function PlanBadgeWithData() {
  // This component will be used with React Server Components
  // or with a client-side data fetch
  return null;
}
