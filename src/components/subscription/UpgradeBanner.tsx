"use client";

import { useState, useSyncExternalStore, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { trackUpgradePromptClicked } from "@/lib/analytics";

interface UpgradeBannerProps {
  planName?: string;
  className?: string;
  storageKey?: string;
}

// Custom hook to read from sessionStorage without hydration mismatch
function useSessionStorage(key: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    []
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(key);
  }, [key]);

  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function UpgradeBanner({
  planName = "free",
  className = "",
  storageKey = "upgrade-banner-dismissed",
}: UpgradeBannerProps) {
  const t = useTranslations("upgradeBanner");
  const dismissedValue = useSessionStorage(storageKey);
  const [localDismissed, setLocalDismissed] = useState(false);

  const handleDismiss = () => {
    setLocalDismissed(true);
    sessionStorage.setItem(storageKey, "true");
  };

  const isDismissed = dismissedValue === "true" || localDismissed;

  // Don't show for paid plans or if dismissed
  if (planName !== "free" || isDismissed) {
    return null;
  }

  return (
    <div
      className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg ${className}`}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{t("title")}</p>
            <p className="text-sm text-green-100">{t("description")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white text-green-700 hover:bg-green-50"
            asChild
          >
            <Link
              href="/pricing"
              className="gap-2"
              onClick={() => trackUpgradePromptClicked("dashboard_banner")}
            >
              {t("cta")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={handleDismiss}
            aria-label={t("dismiss")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
