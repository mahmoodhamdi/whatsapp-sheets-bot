import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Zap,
  Target,
  Hash,
  Code,
  Clock,
  ListOrdered,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Auto-Reply Rules",
  description:
    "Master WhatsApp auto-reply rules: trigger types (EXACT, CONTAINS, STARTS_WITH, REGEX), priority settings, dynamic variables, and best practices.",
  openGraph: {
    title: "Auto-Reply Rules | WhatsApp Auto-Reply Bot",
    description:
      "Learn to create powerful auto-reply rules with trigger types and dynamic variables.",
  },
};

export default async function AutoReplyDocsPage() {
  const t = await getTranslations("docs.features.autoReply");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      {/* Quick links */}
      <div className="not-prose my-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <a href="#trigger-types" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Target className="h-5 w-5 text-green-600" />
          <span>{t("nav.triggerTypes")}</span>
        </a>
        <a href="#priority" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <ListOrdered className="h-5 w-5 text-green-600" />
          <span>{t("nav.priority")}</span>
        </a>
        <a href="#variables" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Code className="h-5 w-5 text-green-600" />
          <span>{t("nav.variables")}</span>
        </a>
        <a href="#examples" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Lightbulb className="h-5 w-5 text-green-600" />
          <span>{t("nav.examples")}</span>
        </a>
      </div>

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.description")}</p>

      {/* How it works */}
      <div className="not-prose my-6 p-4 bg-muted rounded-lg">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-semibold">{t("overview.howItWorks.title")}</p>
            <ol className="text-sm text-muted-foreground mt-2 space-y-1 list-decimal list-inside">
              <li>{t("overview.howItWorks.step1")}</li>
              <li>{t("overview.howItWorks.step2")}</li>
              <li>{t("overview.howItWorks.step3")}</li>
              <li>{t("overview.howItWorks.step4")}</li>
            </ol>
          </div>
        </div>
      </div>

      <h2 id="trigger-types">{t("triggerTypes.title")}</h2>
      <p>{t("triggerTypes.description")}</p>

      {/* Trigger type cards */}
      <div className="not-prose my-6 grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold">EXACT</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{t("triggerTypes.exact.description")}</p>
          <pre className="text-xs bg-muted p-2 rounded">
            <code>{t("triggerTypes.exact.example")}</code>
          </pre>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold">CONTAINS</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{t("triggerTypes.contains.description")}</p>
          <pre className="text-xs bg-muted p-2 rounded">
            <code>{t("triggerTypes.contains.example")}</code>
          </pre>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="h-5 w-5 text-orange-600" />
            <h4 className="font-semibold">STARTS_WITH</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{t("triggerTypes.startsWith.description")}</p>
          <pre className="text-xs bg-muted p-2 rounded">
            <code>{t("triggerTypes.startsWith.example")}</code>
          </pre>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-5 w-5 text-red-600" />
            <h4 className="font-semibold">REGEX</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{t("triggerTypes.regex.description")}</p>
          <pre className="text-xs bg-muted p-2 rounded">
            <code>{t("triggerTypes.regex.example")}</code>
          </pre>
        </div>
      </div>

      <h2 id="priority">{t("priority.title")}</h2>
      <p>{t("priority.description")}</p>

      {/* Priority example */}
      <div className="not-prose my-4 p-4 bg-muted rounded-lg">
        <p className="text-sm font-medium mb-3">{t("priority.example.title")}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-background rounded border">
            <span className="text-sm">{t("priority.example.rule1")}</span>
            <span className="text-xs font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">Priority: 100</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-background rounded border">
            <span className="text-sm">{t("priority.example.rule2")}</span>
            <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">Priority: 50</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-background rounded border">
            <span className="text-sm">{t("priority.example.rule3")}</span>
            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 px-2 py-1 rounded">Priority: 1</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{t("priority.example.note")}</p>
      </div>

      <h2 id="variables">{t("variables.title")}</h2>
      <p>{t("variables.description")}</p>

      <table>
        <thead>
          <tr>
            <th>{t("variables.table.variable")}</th>
            <th>{t("variables.table.description")}</th>
            <th>{t("variables.table.example")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>{"{name}"}</code></td>
            <td>{t("variables.items.name")}</td>
            <td><code>Hello {"{name}"}!</code></td>
          </tr>
          <tr>
            <td><code>{"{phone}"}</code></td>
            <td>{t("variables.items.phone")}</td>
            <td><code>Your number: {"{phone}"}</code></td>
          </tr>
          <tr>
            <td><code>{"{date}"}</code></td>
            <td>{t("variables.items.date")}</td>
            <td><code>Today is {"{date}"}</code></td>
          </tr>
          <tr>
            <td><code>{"{time}"}</code></td>
            <td>{t("variables.items.time")}</td>
            <td><code>Current time: {"{time}"}</code></td>
          </tr>
        </tbody>
      </table>

      <h2 id="examples">{t("examples.title")}</h2>
      <p>{t("examples.description")}</p>

      {/* Example cards */}
      <div className="not-prose my-6 space-y-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">{t("examples.greeting.title")}</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("examples.trigger")}:</span>
              <code className="font-mono">^(hello|hi|hey)$</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("examples.type")}:</span>
              <code className="font-mono">REGEX</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("examples.response")}:</span>
              <span className="font-mono">{t("examples.greeting.response")}</span>
            </div>
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">{t("examples.pricing.title")}</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("examples.trigger")}:</span>
              <code className="font-mono">price</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("examples.type")}:</span>
              <code className="font-mono">CONTAINS</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("examples.response")}:</span>
              <span className="font-mono">{t("examples.pricing.response")}</span>
            </div>
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">{t("examples.order.title")}</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("examples.trigger")}:</span>
              <code className="font-mono">order</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("examples.type")}:</span>
              <code className="font-mono">STARTS_WITH</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("examples.response")}:</span>
              <span className="font-mono">{t("examples.order.response")}</span>
            </div>
          </div>
        </div>
      </div>

      <h2>{t("testing.title")}</h2>
      <p>{t("testing.description")}</p>
      <ol>
        <li>{t("testing.steps.1")}</li>
        <li>{t("testing.steps.2")}</li>
        <li>{t("testing.steps.3")}</li>
        <li>{t("testing.steps.4")}</li>
      </ol>

      {/* Tip box */}
      <div className="not-prose my-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">
              {t("testing.tip.title")}
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t("testing.tip.description")}
            </p>
          </div>
        </div>
      </div>

      <h2>{t("bestPractices.title")}</h2>
      <div className="not-prose my-4 space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <span className="text-sm">{t(`bestPractices.items.${i}`)}</span>
          </div>
        ))}
      </div>

      {/* Warning box */}
      <div className="not-prose my-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">
              {t("bestPractices.warning.title")}
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t("bestPractices.warning.description")}
            </p>
          </div>
        </div>
      </div>

      <h2>{t("nextSteps.title")}</h2>
      <div className="not-prose grid gap-3 my-4">
        <Link
          href="/docs/features/working-hours"
          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
        >
          <Clock className="h-5 w-5 text-green-600" />
          <div className="flex-1">
            <p className="font-medium">{t("nextSteps.workingHours")}</p>
            <p className="text-sm text-muted-foreground">
              {t("nextSteps.workingHoursDesc")}
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
