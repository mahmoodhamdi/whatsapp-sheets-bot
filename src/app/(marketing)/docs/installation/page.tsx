import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, CheckCircle, AlertTriangle, Server, Container } from "lucide-react";

export default async function InstallationPage() {
  const t = await getTranslations("docs.installation");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      <h2>{t("requirements.title")}</h2>
      <p>{t("requirements.description")}</p>

      <div className="not-prose my-4 grid gap-3 md:grid-cols-2">
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">{t("requirements.required")}</h4>
          <ul className="text-sm space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Node.js 18+
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              PostgreSQL 14+
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              npm or yarn
            </li>
          </ul>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">{t("requirements.optional")}</h4>
          <ul className="text-sm space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              Docker & Docker Compose
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              Google Cloud Account
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              Stripe Account
            </li>
          </ul>
        </div>
      </div>

      {/* Installation Methods */}
      <div className="not-prose my-6 grid gap-4 md:grid-cols-2">
        <div className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-2 mb-2">
            <Container className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-green-800 dark:text-green-200">
              {t("docker.badge")}
            </h4>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            {t("docker.recommendation")}
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Server className="h-5 w-5" />
            <h4 className="font-semibold">{t("manual.badge")}</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("manual.recommendation")}
          </p>
        </div>
      </div>

      <h2>{t("docker.title")}</h2>
      <p>{t("docker.description")}</p>

      <h3>{t("docker.step1.title")}</h3>
      <pre>
        <code>{`git clone https://github.com/your-repo/whatsapp-sheets-bot.git
cd whatsapp-sheets-bot`}</code>
      </pre>

      <h3>{t("docker.step2.title")}</h3>
      <p>{t("docker.step2.description")}</p>
      <pre>
        <code>{`cp .env.example .env`}</code>
      </pre>

      <h3>{t("docker.step3.title")}</h3>
      <pre>
        <code>{`docker-compose up -d`}</code>
      </pre>
      <p>{t("docker.step3.description")}</p>

      <h3>{t("docker.step4.title")}</h3>
      <pre>
        <code>{`docker-compose logs -f`}</code>
      </pre>

      <div className="not-prose my-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-200">
              {t("docker.success.title")}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              {t("docker.success.description")}
            </p>
          </div>
        </div>
      </div>

      <h2>{t("manual.title")}</h2>
      <p>{t("manual.description")}</p>

      <h3>{t("manual.step1.title")}</h3>
      <pre>
        <code>{`git clone https://github.com/your-repo/whatsapp-sheets-bot.git
cd whatsapp-sheets-bot`}</code>
      </pre>

      <h3>{t("manual.step2.title")}</h3>
      <pre>
        <code>{`npm install`}</code>
      </pre>

      <h3>{t("manual.step3.title")}</h3>
      <pre>
        <code>{`cp .env.example .env`}</code>
      </pre>
      <p>{t("manual.step3.description")}</p>

      <h4>{t("manual.step3.required")}</h4>
      <pre>
        <code>{`# Database
DATABASE_URL="postgresql://user:password@localhost:5432/whatsapp_bot"

# Authentication
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"`}</code>
      </pre>

      <h4>{t("manual.step3.optional")}</h4>
      <pre>
        <code>{`# Google Sheets (optional)
GOOGLE_SHEET_ID="your-sheet-id"
GOOGLE_SHEETS_CREDENTIALS="base64-encoded-json"

# Stripe (optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."`}</code>
      </pre>

      <h3>{t("manual.step4.title")}</h3>
      <pre>
        <code>{`# Push schema to database
npm run db:push

# Seed with initial data
npm run db:seed`}</code>
      </pre>
      <p>{t("manual.step4.description")}</p>

      <h3>{t("manual.step5.title")}</h3>
      <pre>
        <code>{`npm run dev`}</code>
      </pre>
      <p>{t("manual.step5.description")}</p>

      <h2>{t("production.title")}</h2>
      <p>{t("production.description")}</p>

      <h3>{t("production.build.title")}</h3>
      <pre>
        <code>{`npm run build`}</code>
      </pre>

      <h3>{t("production.start.title")}</h3>
      <pre>
        <code>{`npm start`}</code>
      </pre>

      <div className="not-prose my-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">
              {t("production.warning.title")}
            </p>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
              <li>• {t("production.warning.item1")}</li>
              <li>• {t("production.warning.item2")}</li>
              <li>• {t("production.warning.item3")}</li>
              <li>• {t("production.warning.item4")}</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>{t("verification.title")}</h2>
      <p>{t("verification.description")}</p>
      <ol>
        <li>{t("verification.steps.1")}</li>
        <li>{t("verification.steps.2")}</li>
        <li>{t("verification.steps.3")}</li>
        <li>{t("verification.steps.4")}</li>
      </ol>

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
          href="/docs/quick-start"
          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">{t("nextSteps.quickStart")}</p>
            <p className="text-sm text-muted-foreground">
              {t("nextSteps.quickStartDesc")}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
