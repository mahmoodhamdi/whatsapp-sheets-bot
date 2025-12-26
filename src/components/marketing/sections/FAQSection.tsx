import { getTranslations } from "next-intl/server";
import { Section, SectionHeader, FAQAccordion } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

export async function FAQSection() {
  const t = await getTranslations("landing.faq");

  const faqItems = [
    { question: t("items.0.question"), answer: t("items.0.answer") },
    { question: t("items.1.question"), answer: t("items.1.answer") },
    { question: t("items.2.question"), answer: t("items.2.answer") },
    { question: t("items.3.question"), answer: t("items.3.answer") },
    { question: t("items.4.question"), answer: t("items.4.answer") },
    { question: t("items.5.question"), answer: t("items.5.answer") },
  ];

  return (
    <Section id="faq">
      <SectionHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="max-w-3xl mx-auto">
        <FAQAccordion items={faqItems} />

        {/* Contact Support CTA */}
        <div className="mt-12 text-center p-6 rounded-xl bg-muted/50">
          <p className="text-muted-foreground mb-4">{t("notFound")}</p>
          <Button variant="outline" asChild>
            <Link href="mailto:support@example.com">
              <Mail className="me-2 h-4 w-4" />
              {t("contactSupport")}
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
