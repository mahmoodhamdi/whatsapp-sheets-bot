import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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

export default function FeaturesPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">المميزات</h1>
        <p className="text-muted-foreground mb-8">
          صفحة المميزات - سيتم إضافة المحتوى في Phase 2
        </p>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowRight className="me-2 h-4 w-4 rtl:rotate-180" />
            العودة للرئيسية
          </Link>
        </Button>
      </div>
    </div>
  );
}
