import { getTranslations } from "next-intl/server";
import { Section, CTABanner } from "@/components/marketing";

export async function CTASection() {
  const t = await getTranslations("landing.cta");

  return (
    <Section>
      <CTABanner
        title={t("title")}
        description={t("description")}
        primaryCta={{
          label: t("button"),
          href: "/register",
        }}
        secondaryCta={{
          label: t("demo"),
          href: "#demo",
        }}
      />
    </Section>
  );
}
