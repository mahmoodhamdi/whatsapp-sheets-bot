"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { Loader2 } from "lucide-react";

interface SubscriptionData {
  subscription: {
    id: string;
    plan: {
      id: string;
      name: string;
      slug: string;
      messagesPerMonth: number;
      rulesLimit: number;
      features: string[];
    };
    status: string;
    billingInterval: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    canceledAt: string | null;
    stripeSubscriptionId: string | null;
  } | null;
  usage: {
    messagesCount: number;
    rulesCount: number;
    periodStart: string;
    periodEnd: string;
    limits: {
      messagesPerMonth: number;
      rulesLimit: number;
      isUnlimitedMessages: boolean;
      isUnlimitedRules: boolean;
    };
  };
}

export default function BillingPage() {
  const t = useTranslations("billing");
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch("/api/subscription");
        if (!response.ok) {
          throw new Error("Failed to fetch subscription");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      {data && (
        <BillingSettings subscription={data.subscription} usage={data.usage} />
      )}
    </div>
  );
}
