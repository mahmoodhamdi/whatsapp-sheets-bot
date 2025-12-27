import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { PricingSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Affordable pricing plans for WhatsApp Auto-Reply Bot. Start free with 100 messages/month, upgrade for more features. Plans from $0 to $99/month.",
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
      "Start free with 100 messages/month. Upgrade for unlimited messages and advanced features.",
  },
};

const pricingPlans = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: ["100 messages/month", "5 auto-reply rules", "Basic analytics"],
  },
  {
    name: "Starter",
    price: 19,
    description: "For small businesses",
    features: [
      "1,000 messages/month",
      "20 auto-reply rules",
      "Google Sheets sync",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: 49,
    description: "For growing businesses",
    features: [
      "10,000 messages/month",
      "Unlimited rules",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: 99,
    description: "For large organizations",
    features: [
      "Unlimited messages",
      "Unlimited rules",
      "Custom integrations",
      "Dedicated support",
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <PricingSchema plans={pricingPlans} />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold mb-4">الأسعار</h1>
          <p className="text-muted-foreground mb-8">
            صفحة الأسعار - سيتم إضافة المحتوى في Phase 2
          </p>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowRight className="me-2 h-4 w-4 rtl:rotate-180" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
