import { getTranslations } from "next-intl/server";

export default async function AnalyticsDocsPage() {
  const t = await getTranslations("docs.features.analytics");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.description")}</p>

      <h2>{t("metrics.title")}</h2>

      <h3>{t("metrics.messages.title")}</h3>
      <p>{t("metrics.messages.description")}</p>
      <ul>
        <li>{t("metrics.messages.items.1")}</li>
        <li>{t("metrics.messages.items.2")}</li>
        <li>{t("metrics.messages.items.3")}</li>
      </ul>

      <h3>{t("metrics.rules.title")}</h3>
      <p>{t("metrics.rules.description")}</p>
      <ul>
        <li>{t("metrics.rules.items.1")}</li>
        <li>{t("metrics.rules.items.2")}</li>
      </ul>

      <h3>{t("metrics.contacts.title")}</h3>
      <p>{t("metrics.contacts.description")}</p>

      <h2>{t("timeRanges.title")}</h2>
      <p>{t("timeRanges.description")}</p>
      <ul>
        <li>{t("timeRanges.items.1")}</li>
        <li>{t("timeRanges.items.2")}</li>
        <li>{t("timeRanges.items.3")}</li>
        <li>{t("timeRanges.items.4")}</li>
      </ul>

      <h2>{t("export.title")}</h2>
      <p>{t("export.description")}</p>
    </div>
  );
}
