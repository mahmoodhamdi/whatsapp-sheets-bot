import { Metadata } from "next";
import { HeroSection } from "@/components/marketing/sections/HeroSection";
import { FeaturesSection } from "@/components/marketing/sections/FeaturesSection";
import { PricingSection } from "@/components/marketing/sections/PricingSection";
import { TestimonialsSection } from "@/components/marketing/sections/TestimonialsSection";
import { FAQSection } from "@/components/marketing/sections/FAQSection";
import { CTASection } from "@/components/marketing/sections/CTASection";
import { FAQSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "WhatsApp Auto-Reply Bot | Automate Your Business Messages",
  description:
    "Automate your WhatsApp responses and sync with Google Sheets. Perfect for stores, clinics, and restaurants in Saudi Arabia and Egypt. Start free today!",
  keywords: [
    "WhatsApp bot",
    "auto reply",
    "Google Sheets",
    "business automation",
    "Saudi Arabia",
    "Egypt",
    "Arabic",
    "بوت واتساب",
    "رد آلي",
    "جوجل شيت",
  ],
  openGraph: {
    title: "WhatsApp Auto-Reply Bot | Automate Your Business",
    description:
      "Smart auto-reply WhatsApp bot with Google Sheets integration. Perfect for stores, clinics, and restaurants.",
    type: "website",
  },
};

const faqs = [
  {
    question: "How does the WhatsApp auto-reply bot work?",
    answer:
      "Our bot connects to your WhatsApp Business account and automatically responds to incoming messages based on your configured rules. You can set up exact matches, keyword triggers, or regex patterns.",
  },
  {
    question: "Can I sync messages with Google Sheets?",
    answer:
      "Yes! All contacts and messages can be automatically synced to Google Sheets, making it easy to track conversations and analyze customer data.",
  },
  {
    question: "Is there a free plan available?",
    answer:
      "Yes, we offer a free plan with up to 100 messages per month and 5 auto-reply rules. Perfect for small businesses getting started.",
  },
  {
    question: "Does it support Arabic language?",
    answer:
      "Absolutely! Our platform is fully bilingual with complete Arabic and English support, including RTL interface.",
  },
  {
    question: "Can I set working hours for auto-replies?",
    answer:
      "Yes, you can configure specific working hours. Outside these hours, a custom message will be sent to let customers know when you'll be available.",
  },
];

export default function LandingPage() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
