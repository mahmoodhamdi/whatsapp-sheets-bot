import { getTranslations } from "next-intl/server";
import { Section, SectionHeader, FeatureCard } from "@/components/marketing";
import {
  MessageSquareReply,
  Sheet,
  Languages,
  BarChart3,
  Clock,
  FileText,
} from "lucide-react";

const featureIcons = {
  autoReply: MessageSquareReply,
  sheetsSync: Sheet,
  multiLanguage: Languages,
  analytics: BarChart3,
  scheduling: Clock,
  templates: FileText,
};

export async function FeaturesSection() {
  const t = await getTranslations("landing.features");

  const features = [
    {
      key: "autoReply",
      icon: featureIcons.autoReply,
      title: t("autoReply.title"),
      description: t("autoReply.description"),
    },
    {
      key: "sheetsSync",
      icon: featureIcons.sheetsSync,
      title: t("sheetsSync.title"),
      description: t("sheetsSync.description"),
    },
    {
      key: "multiLanguage",
      icon: featureIcons.multiLanguage,
      title: t("multiLanguage.title"),
      description: t("multiLanguage.description"),
    },
    {
      key: "analytics",
      icon: featureIcons.analytics,
      title: t("analytics.title"),
      description: t("analytics.description"),
    },
    {
      key: "scheduling",
      icon: featureIcons.scheduling,
      title: t("scheduling.title"),
      description: t("scheduling.description"),
    },
    {
      key: "templates",
      icon: featureIcons.templates,
      title: t("templates.title"),
      description: t("templates.description"),
    },
  ];

  return (
    <Section id="features" background="muted">
      <SectionHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.key}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </Section>
  );
}
