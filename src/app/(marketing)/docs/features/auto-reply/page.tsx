import { getTranslations } from "next-intl/server";

export default async function AutoReplyDocsPage() {
  const t = await getTranslations("docs.features.autoReply");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.description")}</p>

      <h2>{t("triggerTypes.title")}</h2>
      <p>{t("triggerTypes.description")}</p>

      <h3>EXACT</h3>
      <p>{t("triggerTypes.exact.description")}</p>
      <pre>
        <code>{t("triggerTypes.exact.example")}</code>
      </pre>

      <h3>CONTAINS</h3>
      <p>{t("triggerTypes.contains.description")}</p>
      <pre>
        <code>{t("triggerTypes.contains.example")}</code>
      </pre>

      <h3>STARTS_WITH</h3>
      <p>{t("triggerTypes.startsWith.description")}</p>
      <pre>
        <code>{t("triggerTypes.startsWith.example")}</code>
      </pre>

      <h3>REGEX</h3>
      <p>{t("triggerTypes.regex.description")}</p>
      <pre>
        <code>{t("triggerTypes.regex.example")}</code>
      </pre>

      <h2>{t("priority.title")}</h2>
      <p>{t("priority.description")}</p>

      <h2>{t("workingHours.title")}</h2>
      <p>{t("workingHours.description")}</p>

      <h2>{t("bestPractices.title")}</h2>
      <ul>
        <li>{t("bestPractices.items.1")}</li>
        <li>{t("bestPractices.items.2")}</li>
        <li>{t("bestPractices.items.3")}</li>
        <li>{t("bestPractices.items.4")}</li>
      </ul>
    </div>
  );
}
