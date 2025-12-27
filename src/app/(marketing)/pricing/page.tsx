import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckoutButton } from "@/components/subscription/CheckoutButton";
import { PricingSchema } from "@/components/seo/StructuredData";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Affordable pricing plans for WhatsApp Auto-Reply Bot. Start free with 50 messages/month, upgrade for more features. Plans from $0 to $99/month.",
  keywords: [
    "WhatsApp bot pricing",
    "subscription plans",
    "free plan",
    "business plan",
    "أسعار بوت واتساب",
  ],
  openGraph: {
    title: "Pricing | WhatsApp Auto-Reply Bot",
    description:
      "Start free with 50 messages/month. Upgrade for unlimited messages and advanced features.",
  },
};

const plans = [
  {
    slug: "free",
    name: "Free",
    nameAr: "مجاني",
    price: 0,
    description: "Perfect for getting started",
    descriptionAr: "مثالي للبدء",
    features: [
      "50 messages/month",
      "1 auto-reply rule",
      "Basic dashboard",
      "Community support",
    ],
    featuresAr: [
      "50 رسالة/شهر",
      "قاعدة رد تلقائي واحدة",
      "لوحة تحكم أساسية",
      "دعم المجتمع",
    ],
    popular: false,
  },
  {
    slug: "starter",
    name: "Starter",
    nameAr: "مبتدئ",
    price: 9,
    description: "For small businesses",
    descriptionAr: "للأعمال الصغيرة",
    features: [
      "500 messages/month",
      "10 auto-reply rules",
      "Google Sheets sync",
      "Email support",
      "Basic analytics",
    ],
    featuresAr: [
      "500 رسالة/شهر",
      "10 قواعد رد تلقائي",
      "مزامنة جوجل شيتس",
      "دعم البريد الإلكتروني",
      "تحليلات أساسية",
    ],
    popular: false,
  },
  {
    slug: "professional",
    name: "Professional",
    nameAr: "احترافي",
    price: 29,
    description: "For growing businesses",
    descriptionAr: "للأعمال النامية",
    features: [
      "5,000 messages/month",
      "Unlimited rules",
      "Advanced analytics",
      "Priority support",
      "Working hours",
      "Custom branding",
    ],
    featuresAr: [
      "5,000 رسالة/شهر",
      "قواعد غير محدودة",
      "تحليلات متقدمة",
      "دعم أولوية",
      "ساعات العمل",
      "العلامة التجارية المخصصة",
    ],
    popular: true,
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    nameAr: "مؤسسات",
    price: 99,
    description: "For large organizations",
    descriptionAr: "للمؤسسات الكبيرة",
    features: [
      "Unlimited messages",
      "Unlimited rules",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "API access",
    ],
    featuresAr: [
      "رسائل غير محدودة",
      "قواعد غير محدودة",
      "تكاملات مخصصة",
      "دعم مخصص",
      "ضمان SLA",
      "وصول API",
    ],
    popular: false,
  },
];

export default async function PricingPage() {
  const t = await getTranslations("pricing");
  const locale = (await import("next-intl/server").then((m) => m.getLocale()));
  const isArabic = locale === "ar";

  return (
    <>
      <PricingSchema
        plans={plans.map((p) => ({
          name: p.name,
          price: p.price,
          description: p.description,
          features: p.features,
        }))}
      />

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.slug}
                className={cn(
                  "relative flex flex-col",
                  plan.popular && "border-green-500 border-2 shadow-lg"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                      {t("popular")}
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">
                    {isArabic ? plan.nameAr : plan.name}
                  </CardTitle>
                  <CardDescription>
                    {isArabic ? plan.descriptionAr : plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{t("month")}</span>
                  </div>

                  <ul className="space-y-3">
                    {(isArabic ? plan.featuresAr : plan.features).map(
                      (feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>

                <CardFooter>
                  {plan.price === 0 ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <Link href="/register">{t("getStarted")}</Link>
                    </Button>
                  ) : (
                    <CheckoutButton
                      planSlug={plan.slug}
                      billingInterval="monthly"
                      className={cn(
                        "w-full",
                        plan.popular && "bg-green-600 hover:bg-green-700"
                      )}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {t("subscribe")}
                    </CheckoutButton>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* FAQ Link */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              {t("questions")}{" "}
              <Link href="/#faq" className="text-green-600 hover:underline">
                {t("faqLink")}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
