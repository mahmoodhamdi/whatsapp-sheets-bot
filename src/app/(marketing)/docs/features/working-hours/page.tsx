import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Calendar,
  Moon,
  Sun,
  Globe,
  Settings,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Working Hours",
  description:
    "Configure business working hours for WhatsApp auto-replies. Set schedules, off-hours messages, timezone settings, and custom business examples.",
  openGraph: {
    title: "Working Hours | WhatsApp Auto-Reply Bot",
    description:
      "Set up business hours to control when auto-replies are active.",
  },
};

export default async function WorkingHoursDocsPage() {
  const t = await getTranslations("docs.features.workingHours");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      {/* Quick links */}
      <div className="not-prose my-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <a href="#configuration" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Settings className="h-5 w-5 text-green-600" />
          <span>{t("nav.configuration")}</span>
        </a>
        <a href="#schedule" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Calendar className="h-5 w-5 text-green-600" />
          <span>{t("nav.schedule")}</span>
        </a>
        <a href="#off-hours" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Moon className="h-5 w-5 text-green-600" />
          <span>{t("nav.offHours")}</span>
        </a>
        <a href="#timezone" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Globe className="h-5 w-5 text-green-600" />
          <span>{t("nav.timezone")}</span>
        </a>
      </div>

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.description")}</p>

      {/* Benefits */}
      <div className="not-prose my-6 grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <h4 className="font-semibold">{t("overview.benefits.workHours.title")}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{t("overview.benefits.workHours.description")}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="h-5 w-5 text-indigo-500" />
            <h4 className="font-semibold">{t("overview.benefits.offHours.title")}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{t("overview.benefits.offHours.description")}</p>
        </div>
      </div>

      <h2 id="configuration">{t("configuration.title")}</h2>
      <p>{t("configuration.description")}</p>

      <ol>
        <li>{t("configuration.steps.1")}</li>
        <li>{t("configuration.steps.2")}</li>
        <li>{t("configuration.steps.3")}</li>
        <li>{t("configuration.steps.4")}</li>
      </ol>

      <h2 id="schedule">{t("schedule.title")}</h2>
      <p>{t("schedule.description")}</p>

      {/* Weekly schedule example */}
      <div className="not-prose my-6 p-4 border rounded-lg">
        <h4 className="font-semibold mb-4">{t("schedule.example.title")}</h4>
        <div className="space-y-2">
          {["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].map((day, index) => (
            <div key={day} className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm font-medium capitalize">{t(`schedule.days.${day}`)}</span>
              <div className="flex items-center gap-2">
                {index === 5 || index === 6 ? (
                  <span className="text-sm text-muted-foreground">{t("schedule.closed")}</span>
                ) : (
                  <>
                    <span className="text-sm font-mono bg-background px-2 py-1 rounded">09:00</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-sm font-mono bg-background px-2 py-1 rounded">18:00</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip box */}
      <div className="not-prose my-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-200">
              {t("schedule.tip.title")}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t("schedule.tip.description")}
            </p>
          </div>
        </div>
      </div>

      <h2 id="off-hours">{t("offHours.title")}</h2>
      <p>{t("offHours.description")}</p>

      <h3>{t("offHours.message.title")}</h3>
      <p>{t("offHours.message.description")}</p>

      {/* Message example */}
      <div className="not-prose my-4 p-4 bg-muted rounded-lg">
        <p className="text-sm font-medium mb-2">{t("offHours.message.example.title")}</p>
        <div className="p-3 bg-background rounded border">
          <p className="text-sm">{t("offHours.message.example.text")}</p>
        </div>
      </div>

      <h3>{t("offHours.variables.title")}</h3>
      <p>{t("offHours.variables.description")}</p>

      <table>
        <thead>
          <tr>
            <th>{t("offHours.variables.table.variable")}</th>
            <th>{t("offHours.variables.table.description")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>{"{openTime}"}</code></td>
            <td>{t("offHours.variables.items.openTime")}</td>
          </tr>
          <tr>
            <td><code>{"{closeTime}"}</code></td>
            <td>{t("offHours.variables.items.closeTime")}</td>
          </tr>
          <tr>
            <td><code>{"{nextOpen}"}</code></td>
            <td>{t("offHours.variables.items.nextOpen")}</td>
          </tr>
        </tbody>
      </table>

      <h2 id="timezone">{t("timezone.title")}</h2>
      <p>{t("timezone.description")}</p>

      {/* Common timezones */}
      <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold">{t("timezone.regions.middleEast.title")}</h4>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Asia/Riyadh (UTC+3)</li>
            <li>• Asia/Dubai (UTC+4)</li>
            <li>• Africa/Cairo (UTC+2)</li>
          </ul>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold">{t("timezone.regions.other.title")}</h4>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Europe/London (UTC+0)</li>
            <li>• America/New_York (UTC-5)</li>
            <li>• Asia/Kolkata (UTC+5:30)</li>
          </ul>
        </div>
      </div>

      {/* Warning box */}
      <div className="not-prose my-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">
              {t("timezone.warning.title")}
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t("timezone.warning.description")}
            </p>
          </div>
        </div>
      </div>

      <h2>{t("examples.title")}</h2>

      <div className="not-prose my-6 space-y-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">{t("examples.retail.title")}</h4>
          <p className="text-sm text-muted-foreground mb-2">{t("examples.retail.description")}</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-mono bg-muted px-2 py-1 rounded">09:00 - 22:00</span>
            <span className="text-xs text-muted-foreground">{t("examples.retail.days")}</span>
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">{t("examples.clinic.title")}</h4>
          <p className="text-sm text-muted-foreground mb-2">{t("examples.clinic.description")}</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-mono bg-muted px-2 py-1 rounded">08:00 - 17:00</span>
            <span className="text-xs text-muted-foreground">{t("examples.clinic.days")}</span>
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">{t("examples.restaurant.title")}</h4>
          <p className="text-sm text-muted-foreground mb-2">{t("examples.restaurant.description")}</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-mono bg-muted px-2 py-1 rounded">11:00 - 23:00</span>
            <span className="text-xs text-muted-foreground">{t("examples.restaurant.days")}</span>
          </div>
        </div>
      </div>

      {/* Success box */}
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
      <div className="not-prose grid gap-3 my-4">
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
      </div>
    </div>
  );
}
