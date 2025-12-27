import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageSquare,
  Zap,
  BarChart3,
  Clock,
  Sheet,
  Globe,
  Shield,
  Smartphone,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore all features of our WhatsApp Auto-Reply Bot: smart auto-replies, Google Sheets sync, analytics dashboard, working hours, and multi-language support.",
  keywords: [
    "WhatsApp bot features",
    "auto reply rules",
    "Google Sheets integration",
    "analytics",
    "working hours",
    "مميزات بوت واتساب",
  ],
  openGraph: {
    title: "Features | WhatsApp Auto-Reply Bot",
    description:
      "Smart auto-replies, Google Sheets sync, analytics, and more. Everything you need to automate your business.",
  },
};

const features = [
  {
    icon: MessageSquare,
    titleKey: "autoReply.title",
    descriptionKey: "autoReply.description",
  },
  {
    icon: Zap,
    titleKey: "smartRules.title",
    descriptionKey: "smartRules.description",
  },
  {
    icon: Sheet,
    titleKey: "sheetsSync.title",
    descriptionKey: "sheetsSync.description",
  },
  {
    icon: BarChart3,
    titleKey: "analytics.title",
    descriptionKey: "analytics.description",
  },
  {
    icon: Clock,
    titleKey: "workingHours.title",
    descriptionKey: "workingHours.description",
  },
  {
    icon: Globe,
    titleKey: "multilingual.title",
    descriptionKey: "multilingual.description",
  },
  {
    icon: Shield,
    titleKey: "security.title",
    descriptionKey: "security.description",
  },
  {
    icon: Smartphone,
    titleKey: "mobile.title",
    descriptionKey: "mobile.description",
  },
];

export default async function FeaturesPage() {
  const t = await getTranslations("features");

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">
                    {t(feature.titleKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t(feature.descriptionKey)}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {t("cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              asChild
            >
              <Link href="/register">
                {t("cta.getStarted")}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">{t("cta.viewPricing")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
