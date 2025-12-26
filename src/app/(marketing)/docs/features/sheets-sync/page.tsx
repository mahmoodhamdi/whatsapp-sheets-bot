import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Table2,
  Users,
  MessageSquare,
  RefreshCw,
  Clock,
  Settings,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";

export default async function SheetsSyncDocsPage() {
  const t = await getTranslations("docs.features.sheetsSync");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      {/* Quick links */}
      <div className="not-prose my-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <a href="#setup" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Settings className="h-5 w-5 text-green-600" />
          <span>{t("nav.setup")}</span>
        </a>
        <a href="#data-structure" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Table2 className="h-5 w-5 text-green-600" />
          <span>{t("nav.dataStructure")}</span>
        </a>
        <a href="#sync-options" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <RefreshCw className="h-5 w-5 text-green-600" />
          <span>{t("nav.syncOptions")}</span>
        </a>
        <a href="#troubleshooting" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <AlertCircle className="h-5 w-5 text-green-600" />
          <span>{t("nav.troubleshooting")}</span>
        </a>
      </div>

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.description")}</p>

      {/* Benefits */}
      <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
        <div className="p-4 border rounded-lg text-center">
          <FileSpreadsheet className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="font-medium">{t("overview.benefits.backup")}</p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <RefreshCw className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="font-medium">{t("overview.benefits.realtime")}</p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <Table2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="font-medium">{t("overview.benefits.reports")}</p>
        </div>
      </div>

      <h2 id="setup">{t("setup.title")}</h2>
      <p>{t("setup.description")}</p>

      <div className="not-prose my-6 space-y-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-sm font-medium">1</span>
            <h4 className="font-semibold">{t("setup.step1.title")}</h4>
          </div>
          <p className="text-sm text-muted-foreground ml-9">{t("setup.step1.description")}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-sm font-medium">2</span>
            <h4 className="font-semibold">{t("setup.step2.title")}</h4>
          </div>
          <p className="text-sm text-muted-foreground ml-9">{t("setup.step2.description")}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-sm font-medium">3</span>
            <h4 className="font-semibold">{t("setup.step3.title")}</h4>
          </div>
          <p className="text-sm text-muted-foreground ml-9 mb-2">{t("setup.step3.description")}</p>
          <pre className="text-xs bg-muted p-2 rounded ml-9">
            <code>{`# Linux/macOS
cat credentials.json | base64

# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("credentials.json"))`}</code>
          </pre>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-sm font-medium">4</span>
            <h4 className="font-semibold">{t("setup.step4.title")}</h4>
          </div>
          <p className="text-sm text-muted-foreground ml-9">{t("setup.step4.description")}</p>
        </div>
      </div>

      <h3>{t("configuration.title")}</h3>
      <p>{t("configuration.description")}</p>
      <pre>
        <code>{`GOOGLE_SHEET_ID="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
GOOGLE_SHEETS_CREDENTIALS="eyJ0eXBlIjoic2VydmljZV9hY2NvdW50Ii..."`}</code>
      </pre>

      <h2 id="data-structure">{t("dataStructure.title")}</h2>
      <p>{t("dataStructure.description")}</p>

      {/* Contacts sheet */}
      <div className="not-prose my-6 p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold">{t("dataStructure.contacts.title")}</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{t("dataStructure.contacts.description")}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 bg-muted">{t("dataStructure.contacts.columns.phone")}</th>
                <th className="text-left py-2 px-3 bg-muted">{t("dataStructure.contacts.columns.name")}</th>
                <th className="text-left py-2 px-3 bg-muted">{t("dataStructure.contacts.columns.messageCount")}</th>
                <th className="text-left py-2 px-3 bg-muted">{t("dataStructure.contacts.columns.lastContact")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-3 font-mono text-xs">+966501234567</td>
                <td className="py-2 px-3">Ahmed Ali</td>
                <td className="py-2 px-3">15</td>
                <td className="py-2 px-3">2025-01-15 14:30</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 font-mono text-xs">+201012345678</td>
                <td className="py-2 px-3">Sara Mohamed</td>
                <td className="py-2 px-3">8</td>
                <td className="py-2 px-3">2025-01-15 12:15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Messages sheet */}
      <div className="not-prose my-6 p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-5 w-5 text-green-600" />
          <h4 className="font-semibold">{t("dataStructure.messages.title")}</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{t("dataStructure.messages.description")}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 bg-muted">{t("dataStructure.messages.columns.timestamp")}</th>
                <th className="text-left py-2 px-3 bg-muted">{t("dataStructure.messages.columns.phone")}</th>
                <th className="text-left py-2 px-3 bg-muted">{t("dataStructure.messages.columns.direction")}</th>
                <th className="text-left py-2 px-3 bg-muted">{t("dataStructure.messages.columns.content")}</th>
                <th className="text-left py-2 px-3 bg-muted">{t("dataStructure.messages.columns.rule")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-3 font-mono text-xs">2025-01-15 14:30:22</td>
                <td className="py-2 px-3 font-mono text-xs">+966501234567</td>
                <td className="py-2 px-3"><span className="text-green-600">INCOMING</span></td>
                <td className="py-2 px-3">Hello</td>
                <td className="py-2 px-3">-</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 font-mono text-xs">2025-01-15 14:30:23</td>
                <td className="py-2 px-3 font-mono text-xs">+966501234567</td>
                <td className="py-2 px-3"><span className="text-blue-600">OUTGOING</span></td>
                <td className="py-2 px-3">Welcome! How can I help?</td>
                <td className="py-2 px-3">Greeting</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2 id="sync-options">{t("syncOptions.title")}</h2>
      <p>{t("syncOptions.description")}</p>

      <div className="not-prose my-6 grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold">{t("syncOptions.manual.title")}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{t("syncOptions.manual.description")}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold">{t("syncOptions.automatic.title")}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{t("syncOptions.automatic.description")}</p>
        </div>
      </div>

      <h3>{t("syncOptions.frequency.title")}</h3>
      <p>{t("syncOptions.frequency.description")}</p>
      <ul>
        <li>{t("syncOptions.frequency.realtime")}</li>
        <li>{t("syncOptions.frequency.batch")}</li>
        <li>{t("syncOptions.frequency.manual")}</li>
      </ul>

      {/* Success box */}
      <div className="not-prose my-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-200">
              {t("syncOptions.success.title")}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              {t("syncOptions.success.description")}
            </p>
          </div>
        </div>
      </div>

      <h2 id="troubleshooting">{t("troubleshooting.title")}</h2>
      <p>{t("troubleshooting.description")}</p>

      <div className="not-prose my-6 space-y-4">
        <div className="p-4 border border-yellow-200 dark:border-yellow-800 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">{t("troubleshooting.issues.permission.title")}</h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">{t("troubleshooting.issues.permission.solution")}</p>
        </div>
        <div className="p-4 border border-yellow-200 dark:border-yellow-800 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">{t("troubleshooting.issues.api.title")}</h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">{t("troubleshooting.issues.api.solution")}</p>
        </div>
        <div className="p-4 border border-yellow-200 dark:border-yellow-800 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">{t("troubleshooting.issues.credentials.title")}</h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">{t("troubleshooting.issues.credentials.solution")}</p>
        </div>
      </div>

      {/* Warning box */}
      <div className="not-prose my-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">
              {t("troubleshooting.warning.title")}
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t("troubleshooting.warning.description")}
            </p>
          </div>
        </div>
      </div>

      <h2>{t("nextSteps.title")}</h2>
      <div className="not-prose grid gap-3 my-4">
        <Link
          href="/docs/features/analytics"
          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">{t("nextSteps.analytics")}</p>
            <p className="text-sm text-muted-foreground">
              {t("nextSteps.analyticsDesc")}
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
      </div>
    </div>
  );
}
