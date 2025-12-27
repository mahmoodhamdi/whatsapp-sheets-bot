import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Key, MessageSquare, Table2, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Configuration Guide",
  description:
    "Configure WhatsApp Auto-Reply Bot: environment variables, WhatsApp connection, Google Sheets integration, and working hours setup.",
  openGraph: {
    title: "Configuration | WhatsApp Auto-Reply Bot",
    description:
      "Complete configuration guide for environment, WhatsApp, and Google Sheets.",
  },
};

export default async function ConfigurationPage() {
  const t = await getTranslations("docs.configuration");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      {/* Quick links */}
      <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
        <a href="#environment" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Key className="h-5 w-5 text-green-600" />
          <span>{t("sections.environment")}</span>
        </a>
        <a href="#whatsapp" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <MessageSquare className="h-5 w-5 text-green-600" />
          <span>{t("sections.whatsapp")}</span>
        </a>
        <a href="#sheets" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Table2 className="h-5 w-5 text-green-600" />
          <span>{t("sections.sheets")}</span>
        </a>
        <a href="#hours" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Clock className="h-5 w-5 text-green-600" />
          <span>{t("sections.hours")}</span>
        </a>
      </div>

      <h2 id="environment">{t("environment.title")}</h2>
      <p>{t("environment.description")}</p>

      <h3>{t("environment.database.title")}</h3>
      <p>{t("environment.database.description")}</p>
      <pre>
        <code>{`DATABASE_URL="postgresql://username:password@localhost:5432/whatsapp_bot"`}</code>
      </pre>
      <table>
        <thead>
          <tr>
            <th>{t("environment.table.variable")}</th>
            <th>{t("environment.table.description")}</th>
            <th>{t("environment.table.required")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>DATABASE_URL</code></td>
            <td>{t("environment.database.urlDesc")}</td>
            <td>{t("environment.table.yes")}</td>
          </tr>
        </tbody>
      </table>

      <h3>{t("environment.auth.title")}</h3>
      <p>{t("environment.auth.description")}</p>
      <pre>
        <code>{`NEXTAUTH_SECRET="your-32-character-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"`}</code>
      </pre>
      <table>
        <thead>
          <tr>
            <th>{t("environment.table.variable")}</th>
            <th>{t("environment.table.description")}</th>
            <th>{t("environment.table.required")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>NEXTAUTH_SECRET</code></td>
            <td>{t("environment.auth.secretDesc")}</td>
            <td>{t("environment.table.yes")}</td>
          </tr>
          <tr>
            <td><code>NEXTAUTH_URL</code></td>
            <td>{t("environment.auth.urlDesc")}</td>
            <td>{t("environment.table.yes")}</td>
          </tr>
        </tbody>
      </table>

      <div className="not-prose my-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">
              {t("environment.auth.warning.title")}
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t("environment.auth.warning.description")}
            </p>
            <pre className="mt-2 text-xs bg-yellow-100 dark:bg-yellow-900/40 p-2 rounded">
              <code>openssl rand -base64 32</code>
            </pre>
          </div>
        </div>
      </div>

      <h3>{t("environment.stripe.title")}</h3>
      <p>{t("environment.stripe.description")}</p>
      <pre>
        <code>{`STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."`}</code>
      </pre>

      <h2 id="whatsapp">{t("whatsapp.title")}</h2>
      <p>{t("whatsapp.description")}</p>

      <h3>{t("whatsapp.connection.title")}</h3>
      <ol>
        <li>{t("whatsapp.connection.steps.1")}</li>
        <li>{t("whatsapp.connection.steps.2")}</li>
        <li>{t("whatsapp.connection.steps.3")}</li>
        <li>{t("whatsapp.connection.steps.4")}</li>
      </ol>

      <h3>{t("whatsapp.session.title")}</h3>
      <p>{t("whatsapp.session.description")}</p>
      <pre>
        <code>{`WHATSAPP_SESSION_PATH="./whatsapp-session"`}</code>
      </pre>

      <h3>{t("whatsapp.defaultReply.title")}</h3>
      <p>{t("whatsapp.defaultReply.description")}</p>

      <h2 id="sheets">{t("sheets.title")}</h2>
      <p>{t("sheets.description")}</p>

      <h3>{t("sheets.setup.title")}</h3>
      <ol>
        <li>
          <strong>{t("sheets.setup.step1.title")}</strong>
          <p>{t("sheets.setup.step1.description")}</p>
        </li>
        <li>
          <strong>{t("sheets.setup.step2.title")}</strong>
          <p>{t("sheets.setup.step2.description")}</p>
        </li>
        <li>
          <strong>{t("sheets.setup.step3.title")}</strong>
          <p>{t("sheets.setup.step3.description")}</p>
          <pre>
            <code>{`# On Linux/macOS
cat credentials.json | base64

# On Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("credentials.json"))`}</code>
          </pre>
        </li>
        <li>
          <strong>{t("sheets.setup.step4.title")}</strong>
          <p>{t("sheets.setup.step4.description")}</p>
        </li>
      </ol>

      <h3>{t("sheets.config.title")}</h3>
      <pre>
        <code>{`GOOGLE_SHEET_ID="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
GOOGLE_SHEETS_CREDENTIALS="eyJ0eXBlIjoic2VydmljZV9hY2NvdW50Ii..."`}</code>
      </pre>

      <h2 id="hours">{t("hours.title")}</h2>
      <p>{t("hours.description")}</p>

      <h3>{t("hours.setup.title")}</h3>
      <p>{t("hours.setup.description")}</p>
      <ol>
        <li>{t("hours.setup.steps.1")}</li>
        <li>{t("hours.setup.steps.2")}</li>
        <li>{t("hours.setup.steps.3")}</li>
        <li>{t("hours.setup.steps.4")}</li>
      </ol>

      <h3>{t("hours.offHours.title")}</h3>
      <p>{t("hours.offHours.description")}</p>

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
