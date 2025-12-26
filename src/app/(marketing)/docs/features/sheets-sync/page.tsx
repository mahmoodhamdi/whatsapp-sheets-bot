import { getTranslations } from "next-intl/server";

export default async function SheetsSyncDocsPage() {
  const t = await getTranslations("docs.features.sheetsSync");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.description")}</p>

      <h2>{t("setup.title")}</h2>
      <ol>
        <li>{t("setup.steps.1")}</li>
        <li>{t("setup.steps.2")}</li>
        <li>{t("setup.steps.3")}</li>
        <li>{t("setup.steps.4")}</li>
      </ol>

      <h2>{t("configuration.title")}</h2>
      <p>{t("configuration.description")}</p>
      <pre>
        <code>{`GOOGLE_SHEET_ID="your-sheet-id"
GOOGLE_SHEETS_CREDENTIALS="base64-encoded-credentials"`}</code>
      </pre>

      <h2>{t("syncTypes.title")}</h2>

      <h3>{t("syncTypes.contacts.title")}</h3>
      <p>{t("syncTypes.contacts.description")}</p>

      <h3>{t("syncTypes.messages.title")}</h3>
      <p>{t("syncTypes.messages.description")}</p>

      <h2>{t("scheduling.title")}</h2>
      <p>{t("scheduling.description")}</p>

      <h2>{t("troubleshooting.title")}</h2>
      <ul>
        <li>{t("troubleshooting.items.1")}</li>
        <li>{t("troubleshooting.items.2")}</li>
        <li>{t("troubleshooting.items.3")}</li>
      </ul>
    </div>
  );
}
