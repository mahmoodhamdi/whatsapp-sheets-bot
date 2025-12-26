import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export default async function QuickStartPage() {
  const t = await getTranslations("docs.quickStart");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      <h2>{t("step1.title")}</h2>
      <p>{t("step1.description")}</p>
      <div className="not-prose my-4">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          {t("step1.cta")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>

      <h2>{t("step2.title")}</h2>
      <p>{t("step2.description")}</p>
      <ol>
        <li>{t("step2.steps.1")}</li>
        <li>{t("step2.steps.2")}</li>
        <li>{t("step2.steps.3")}</li>
      </ol>

      <h2>{t("step3.title")}</h2>
      <p>{t("step3.description")}</p>
      <ul>
        <li>
          <strong>{t("step3.triggerTypes.exact")}</strong> -{" "}
          {t("step3.triggerTypes.exactDesc")}
        </li>
        <li>
          <strong>{t("step3.triggerTypes.contains")}</strong> -{" "}
          {t("step3.triggerTypes.containsDesc")}
        </li>
        <li>
          <strong>{t("step3.triggerTypes.startsWith")}</strong> -{" "}
          {t("step3.triggerTypes.startsWithDesc")}
        </li>
        <li>
          <strong>{t("step3.triggerTypes.regex")}</strong> -{" "}
          {t("step3.triggerTypes.regexDesc")}
        </li>
      </ul>

      <h2>{t("step4.title")}</h2>
      <p>{t("step4.description")}</p>

      <div className="not-prose my-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-200">
              {t("success.title")}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              {t("success.description")}
            </p>
          </div>
        </div>
      </div>

      <h2>{t("nextSteps.title")}</h2>
      <ul>
        <li>
          <Link href="/docs/features/auto-reply">{t("nextSteps.autoReply")}</Link>
        </li>
        <li>
          <Link href="/docs/features/sheets-sync">{t("nextSteps.sheetsSync")}</Link>
        </li>
        <li>
          <Link href="/docs/api/auth">{t("nextSteps.api")}</Link>
        </li>
      </ul>
    </div>
  );
}
