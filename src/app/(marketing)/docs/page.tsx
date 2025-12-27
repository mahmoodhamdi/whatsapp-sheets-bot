import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, MessageSquare, Table2, Zap, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Complete documentation for WhatsApp Auto-Reply Bot. Learn how to set up auto-replies, integrate with Google Sheets, and automate your business messaging.",
  openGraph: {
    title: "Documentation | WhatsApp Auto-Reply Bot",
    description:
      "Complete guide to setting up and using WhatsApp Auto-Reply Bot for your business.",
  },
};

export default async function DocsIntroductionPage() {
  const t = await getTranslations("docs.introduction");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      <h2>{t("whatIs.title")}</h2>
      <p>{t("whatIs.description")}</p>

      <h2>{t("keyFeatures.title")}</h2>
      <div className="grid gap-4 md:grid-cols-2 not-prose my-6">
        <FeatureCard
          icon={<MessageSquare className="h-6 w-6 text-green-600" />}
          title={t("keyFeatures.autoReply.title")}
          description={t("keyFeatures.autoReply.description")}
        />
        <FeatureCard
          icon={<Table2 className="h-6 w-6 text-green-600" />}
          title={t("keyFeatures.sheetsSync.title")}
          description={t("keyFeatures.sheetsSync.description")}
        />
        <FeatureCard
          icon={<Zap className="h-6 w-6 text-green-600" />}
          title={t("keyFeatures.instant.title")}
          description={t("keyFeatures.instant.description")}
        />
        <FeatureCard
          icon={<Globe className="h-6 w-6 text-green-600" />}
          title={t("keyFeatures.multilingual.title")}
          description={t("keyFeatures.multilingual.description")}
        />
      </div>

      <h2>{t("getStarted.title")}</h2>
      <p>{t("getStarted.description")}</p>
      <div className="not-prose">
        <Link
          href="/docs/quick-start"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          {t("getStarted.cta")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-1">{icon}</div>
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
