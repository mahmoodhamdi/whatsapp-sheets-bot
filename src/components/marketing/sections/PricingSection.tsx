"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Section, SectionHeader, PricingCard } from "@/components/marketing";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Plan {
  key: string;
  monthlyPriceUSD: number;
  yearlyPriceUSD: number;
  monthlyPriceSAR: number;
  yearlyPriceSAR: number;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    key: "free",
    monthlyPriceUSD: 0,
    yearlyPriceUSD: 0,
    monthlyPriceSAR: 0,
    yearlyPriceSAR: 0,
  },
  {
    key: "starter",
    monthlyPriceUSD: 9,
    yearlyPriceUSD: 86,
    monthlyPriceSAR: 35,
    yearlyPriceSAR: 336,
  },
  {
    key: "professional",
    monthlyPriceUSD: 29,
    yearlyPriceUSD: 278,
    monthlyPriceSAR: 110,
    yearlyPriceSAR: 1056,
    popular: true,
  },
  {
    key: "enterprise",
    monthlyPriceUSD: 99,
    yearlyPriceUSD: 950,
    monthlyPriceSAR: 370,
    yearlyPriceSAR: 3552,
  },
];

const planFeatures: Record<string, string[]> = {
  free: ["messages:50", "rules:1"],
  starter: ["messages:500", "rules:10", "sheetsSync"],
  professional: [
    "messages:5000",
    "rulesUnlimited",
    "sheetsSync",
    "analytics",
    "priority",
  ],
  enterprise: [
    "messagesUnlimited",
    "rulesUnlimited",
    "sheetsSync",
    "analytics",
    "priority",
    "dedicated",
    "api",
    "customIntegrations",
  ],
};

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const t = useTranslations("pricing");
  const tFeatures = useTranslations("pricing.features");
  const tPlans = useTranslations("pricing.plans");
  const locale = useLocale();

  const isArabic = locale === "ar";
  const currency = isArabic ? "ر.س" : "$";

  const getFeatureLabel = (feature: string): string => {
    if (feature.includes(":")) {
      const [key, count] = feature.split(":");
      return tFeatures(key, { count });
    }
    return tFeatures(feature);
  };

  const getPrice = (plan: Plan): number => {
    if (isArabic) {
      return isYearly
        ? Math.round(plan.yearlyPriceSAR / 12)
        : plan.monthlyPriceSAR;
    }
    return isYearly
      ? Math.round(plan.yearlyPriceUSD / 12)
      : plan.monthlyPriceUSD;
  };

  const formatPrice = (price: number): string => {
    if (isArabic) {
      return `${price} ${currency}`;
    }
    return `${currency}${price}`;
  };

  return (
    <Section id="pricing">
      <SectionHeader title={t("title")} subtitle={t("subtitle")} />

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <Label
          htmlFor="billing-toggle"
          className={!isYearly ? "font-semibold" : "text-muted-foreground"}
        >
          {t("monthly")}
        </Label>

        <Switch
          id="billing-toggle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />

        <div className="flex items-center gap-2">
          <Label
            htmlFor="billing-toggle"
            className={isYearly ? "font-semibold" : "text-muted-foreground"}
          >
            {t("yearly")}
          </Label>
          {isYearly && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            >
              {t("yearlyDiscount", { percent: 20 })}
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const price = getPrice(plan);
          const features = planFeatures[plan.key].map(getFeatureLabel);

          return (
            <PricingCard
              key={plan.key}
              name={tPlans(`${plan.key}.name`)}
              price={formatPrice(price)}
              period={t("perMonth")}
              description={tPlans(`${plan.key}.description`)}
              features={features}
              cta={tPlans(`${plan.key}.cta`)}
              ctaHref={plan.key === "enterprise" ? "/contact" : "/register"}
              planSlug={plan.key}
              billingInterval={isYearly ? "yearly" : "monthly"}
              popular={plan.popular}
              popularLabel={t("popular")}
            />
          );
        })}
      </div>
    </Section>
  );
}
