import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Users,
  FileText,
  Calendar,
  Download,
  PieChart,
  Activity,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description:
    "Track WhatsApp messaging performance: message metrics, rule performance, contact analytics, time ranges, and data export options.",
  openGraph: {
    title: "Analytics Dashboard | WhatsApp Auto-Reply Bot",
    description:
      "Monitor your WhatsApp business metrics with our powerful analytics dashboard.",
  },
};

export default async function AnalyticsDocsPage() {
  const t = await getTranslations("docs.features.analytics");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      {/* Quick links */}
      <div className="not-prose my-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <a href="#dashboard" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <BarChart3 className="h-5 w-5 text-green-600" />
          <span>{t("nav.dashboard")}</span>
        </a>
        <a href="#messages" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <MessageSquare className="h-5 w-5 text-green-600" />
          <span>{t("nav.messages")}</span>
        </a>
        <a href="#rules" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <FileText className="h-5 w-5 text-green-600" />
          <span>{t("nav.rules")}</span>
        </a>
        <a href="#export" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Download className="h-5 w-5 text-green-600" />
          <span>{t("nav.export")}</span>
        </a>
      </div>

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.description")}</p>

      <h2 id="dashboard">{t("dashboard.title")}</h2>
      <p>{t("dashboard.description")}</p>

      {/* Dashboard cards */}
      <div className="not-prose my-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{t("dashboard.cards.totalMessages")}</span>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">1,234</p>
          <p className="text-xs text-green-600">+12% {t("dashboard.cards.fromLastMonth")}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{t("dashboard.cards.totalContacts")}</span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">456</p>
          <p className="text-xs text-green-600">+8% {t("dashboard.cards.fromLastMonth")}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{t("dashboard.cards.activeRules")}</span>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-muted-foreground">{t("dashboard.cards.rulesActive")}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{t("dashboard.cards.responseRate")}</span>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">98%</p>
          <p className="text-xs text-green-600">{t("dashboard.cards.excellent")}</p>
        </div>
      </div>

      <h2 id="messages">{t("metrics.title")}</h2>

      <h3>{t("metrics.messages.title")}</h3>
      <p>{t("metrics.messages.description")}</p>

      {/* Message metrics visualization */}
      <div className="not-prose my-6 p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <h4 className="font-semibold">{t("metrics.messages.chart.title")}</h4>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-3 bg-muted rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">789</p>
            <p className="text-sm text-muted-foreground">{t("metrics.messages.chart.incoming")}</p>
          </div>
          <div className="p-3 bg-muted rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">445</p>
            <p className="text-sm text-muted-foreground">{t("metrics.messages.chart.outgoing")}</p>
          </div>
          <div className="p-3 bg-muted rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-600">42</p>
            <p className="text-sm text-muted-foreground">{t("metrics.messages.chart.avgPerDay")}</p>
          </div>
        </div>
      </div>

      <ul>
        <li>{t("metrics.messages.items.1")}</li>
        <li>{t("metrics.messages.items.2")}</li>
        <li>{t("metrics.messages.items.3")}</li>
      </ul>

      <h3 id="rules">{t("metrics.rules.title")}</h3>
      <p>{t("metrics.rules.description")}</p>

      {/* Rule performance */}
      <div className="not-prose my-6 p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-5 w-5 text-purple-600" />
          <h4 className="font-semibold">{t("metrics.rules.performance.title")}</h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm">Greeting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div className="w-4/5 h-full bg-green-500"></div>
              </div>
              <span className="text-sm font-mono">245</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span className="text-sm">Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div className="w-3/5 h-full bg-blue-500"></div>
              </div>
              <span className="text-sm font-mono">156</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              <span className="text-sm">Order Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div className="w-2/5 h-full bg-purple-500"></div>
              </div>
              <span className="text-sm font-mono">89</span>
            </div>
          </div>
        </div>
      </div>

      <ul>
        <li>{t("metrics.rules.items.1")}</li>
        <li>{t("metrics.rules.items.2")}</li>
      </ul>

      <h3>{t("metrics.contacts.title")}</h3>
      <p>{t("metrics.contacts.description")}</p>

      <h2>{t("timeRanges.title")}</h2>
      <p>{t("timeRanges.description")}</p>

      {/* Time range buttons */}
      <div className="not-prose my-4 flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
          {t("timeRanges.options.today")}
        </span>
        <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
          {t("timeRanges.options.week")}
        </span>
        <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
          {t("timeRanges.options.month")}
        </span>
        <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
          {t("timeRanges.options.year")}
        </span>
        <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {t("timeRanges.options.custom")}
        </span>
      </div>

      <ul>
        <li>{t("timeRanges.items.1")}</li>
        <li>{t("timeRanges.items.2")}</li>
        <li>{t("timeRanges.items.3")}</li>
        <li>{t("timeRanges.items.4")}</li>
      </ul>

      <h2 id="export">{t("export.title")}</h2>
      <p>{t("export.description")}</p>

      {/* Export options */}
      <div className="not-prose my-6 grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Download className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold">{t("export.options.sheets.title")}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{t("export.options.sheets.description")}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold">{t("export.options.api.title")}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{t("export.options.api.description")}</p>
        </div>
      </div>

      <h3>{t("export.howTo.title")}</h3>
      <ol>
        <li>{t("export.howTo.steps.1")}</li>
        <li>{t("export.howTo.steps.2")}</li>
        <li>{t("export.howTo.steps.3")}</li>
      </ol>

      <h2>{t("nextSteps.title")}</h2>
      <div className="not-prose grid gap-3 my-4">
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
        <Link
          href="/docs/api/messages"
          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">{t("nextSteps.messagesApi")}</p>
            <p className="text-sm text-muted-foreground">
              {t("nextSteps.messagesApiDesc")}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
