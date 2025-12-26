import { getTranslations } from "next-intl/server";

export default async function InstallationPage() {
  const t = await getTranslations("docs.installation");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      <h2>{t("requirements.title")}</h2>
      <ul>
        <li>Node.js 18+</li>
        <li>PostgreSQL 14+</li>
        <li>Docker (optional)</li>
      </ul>

      <h2>{t("docker.title")}</h2>
      <p>{t("docker.description")}</p>
      <pre>
        <code>{`docker-compose up -d`}</code>
      </pre>

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
      <pre>
        <code>{`DATABASE_URL="postgresql://user:password@localhost:5432/whatsapp_bot"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"`}</code>
      </pre>

      <h3>{t("manual.step4.title")}</h3>
      <pre>
        <code>{`npm run db:push
npm run db:seed`}</code>
      </pre>

      <h3>{t("manual.step5.title")}</h3>
      <pre>
        <code>{`npm run dev`}</code>
      </pre>

      <h2>{t("production.title")}</h2>
      <p>{t("production.description")}</p>
      <pre>
        <code>{`npm run build
npm start`}</code>
      </pre>
    </div>
  );
}
