import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Clock,
  Lightbulb,
} from "lucide-react";

export default async function QuickStartPage() {
  const t = await getTranslations("docs.quickStart");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      {/* Time estimate */}
      <div className="not-prose my-6 flex items-center gap-2 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="text-sm">{t("timeEstimate")}</span>
      </div>

      {/* Video placeholder */}
      <div className="not-prose my-6 p-8 bg-muted rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center">
        <PlayCircle className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground font-medium">{t("videoPlaceholder")}</p>
        <p className="text-sm text-muted-foreground">{t("videoComingSoon")}</p>
      </div>

      {/* Prerequisites */}
      <div className="not-prose my-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-200">
              {t("prerequisites.title")}
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
              <li>• {t("prerequisites.item1")}</li>
              <li>• {t("prerequisites.item2")}</li>
              <li>• {t("prerequisites.item3")}</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>{t("step1.title")}</h2>
      <p>{t("step1.description")}</p>
      <ol>
        <li>{t("step1.steps.1")}</li>
        <li>{t("step1.steps.2")}</li>
        <li>{t("step1.steps.3")}</li>
        <li>{t("step1.steps.4")}</li>
      </ol>
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
        <li>{t("step2.steps.4")}</li>
      </ol>

      {/* Tip box */}
      <div className="not-prose my-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">
              {t("step2.tip.title")}
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t("step2.tip.description")}
            </p>
          </div>
        </div>
      </div>

      <h2>{t("step3.title")}</h2>
      <p>{t("step3.description")}</p>

      {/* Example rule */}
      <div className="not-prose my-4 p-4 bg-muted rounded-lg">
        <p className="text-sm font-medium mb-2">{t("step3.example.title")}</p>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("step3.example.name")}</span>
            <span className="font-mono">Welcome Message</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("step3.example.trigger")}</span>
            <span className="font-mono">hello</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("step3.example.type")}</span>
            <span className="font-mono">CONTAINS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("step3.example.response")}</span>
            <span className="font-mono">{t("step3.example.responseText")}</span>
          </div>
        </div>
      </div>

      <h3>{t("step3.triggerTypesTitle")}</h3>
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
      <ol>
        <li>{t("step4.steps.1")}</li>
        <li>{t("step4.steps.2")}</li>
        <li>{t("step4.steps.3")}</li>
      </ol>

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

      <h2>{t("troubleshooting.title")}</h2>
      <h3>{t("troubleshooting.qrNotLoading.title")}</h3>
      <p>{t("troubleshooting.qrNotLoading.description")}</p>

      <h3>{t("troubleshooting.notConnecting.title")}</h3>
      <p>{t("troubleshooting.notConnecting.description")}</p>

      <h3>{t("troubleshooting.ruleNotMatching.title")}</h3>
      <p>{t("troubleshooting.ruleNotMatching.description")}</p>

      <h2>{t("nextSteps.title")}</h2>
      <div className="not-prose grid gap-3 my-4">
        <Link
          href="/docs/configuration"
          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">{t("nextSteps.configuration")}</p>
            <p className="text-sm text-muted-foreground">
              {t("nextSteps.configurationDesc")}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
        <Link
          href="/docs/features/auto-reply"
          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">{t("nextSteps.autoReply")}</p>
            <p className="text-sm text-muted-foreground">
              {t("nextSteps.autoReplyDesc")}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
        <Link
          href="/docs/features/sheets-sync"
          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">{t("nextSteps.sheetsSync")}</p>
            <p className="text-sm text-muted-foreground">
              {t("nextSteps.sheetsSyncDesc")}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
