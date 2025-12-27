import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  UserPlus,
  LogIn,
  LogOut,
  Shield,
  AlertTriangle,
  CheckCircle,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication API",
  description:
    "Authentication API reference: register, sign in, sign out, session management, and password reset endpoints with examples and error codes.",
  openGraph: {
    title: "Authentication API | WhatsApp Auto-Reply Bot",
    description:
      "Complete API reference for authentication endpoints.",
  },
};

export default async function AuthApiDocsPage() {
  const t = await getTranslations("docs.api.auth");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      {/* Quick links */}
      <div className="not-prose my-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <a href="#register" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <UserPlus className="h-5 w-5 text-green-600" />
          <span>{t("nav.register")}</span>
        </a>
        <a href="#signin" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <LogIn className="h-5 w-5 text-green-600" />
          <span>{t("nav.signin")}</span>
        </a>
        <a href="#signout" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <LogOut className="h-5 w-5 text-green-600" />
          <span>{t("nav.signout")}</span>
        </a>
        <a href="#session" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Shield className="h-5 w-5 text-green-600" />
          <span>{t("nav.session")}</span>
        </a>
      </div>

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.description")}</p>

      {/* Authentication info box */}
      <div className="not-prose my-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-200">
              {t("overview.sessionAuth.title")}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t("overview.sessionAuth.description")}
            </p>
          </div>
        </div>
      </div>

      <h2>{t("endpoints.title")}</h2>

      {/* Register endpoint */}
      <div id="register" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-green-600 rounded">POST</span>
          <code className="text-sm font-mono">/api/auth/register</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.register.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.register.requestBody")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "password": "SecurePass123!"
}`}</code>
          </pre>

          <h4 className="font-semibold mt-4 mb-2">{t("endpoints.register.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "user": {
    "id": "user-123",
    "name": "Ahmed Ali",
    "email": "ahmed@example.com",
    "role": "USER",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}`}</code>
          </pre>

          <h4 className="font-semibold mt-4 mb-2">{t("endpoints.register.validation")}</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {t("endpoints.register.rules.name")}</li>
            <li>• {t("endpoints.register.rules.email")}</li>
            <li>• {t("endpoints.register.rules.password")}</li>
          </ul>
        </div>
      </div>

      {/* Signin endpoint */}
      <div id="signin" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-green-600 rounded">POST</span>
          <code className="text-sm font-mono">/api/auth/signin</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.signin.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.signin.requestBody")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "email": "ahmed@example.com",
  "password": "SecurePass123!"
}`}</code>
          </pre>

          <h4 className="font-semibold mt-4 mb-2">{t("endpoints.signin.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "user": {
    "id": "user-123",
    "name": "Ahmed Ali",
    "email": "ahmed@example.com",
    "role": "USER"
  }
}`}</code>
          </pre>

          {/* Rate limiting warning */}
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {t("endpoints.signin.rateLimit")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Signout endpoint */}
      <div id="signout" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-green-600 rounded">POST</span>
          <code className="text-sm font-mono">/api/auth/signout</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.signout.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.signout.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true
}`}</code>
          </pre>
        </div>
      </div>

      {/* Session endpoint */}
      <div id="session" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded">GET</span>
          <code className="text-sm font-mono">/api/auth/session</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.session.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.session.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "user": {
    "id": "user-123",
    "name": "Ahmed Ali",
    "email": "ahmed@example.com",
    "role": "USER"
  },
  "expires": "2025-02-15T10:30:00Z"
}`}</code>
          </pre>
        </div>
      </div>

      {/* Password Reset Endpoints */}
      <h2 id="password-reset">{t("passwordReset.title")}</h2>
      <p>{t("passwordReset.description")}</p>

      <div className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-green-600 rounded">POST</span>
          <code className="text-sm font-mono">/api/auth/forgot-password</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("passwordReset.forgot.description")}</p>

          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "email": "ahmed@example.com"
}`}</code>
          </pre>
        </div>
      </div>

      <div className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-green-600 rounded">POST</span>
          <code className="text-sm font-mono">/api/auth/reset-password</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("passwordReset.reset.description")}</p>

          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!"
}`}</code>
          </pre>
        </div>
      </div>

      <h2>{t("errors.title")}</h2>
      <p>{t("errors.description")}</p>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 bg-muted font-semibold">{t("errors.code")}</th>
              <th className="text-left py-3 px-4 bg-muted font-semibold">{t("errors.status")}</th>
              <th className="text-left py-3 px-4 bg-muted font-semibold">{t("errors.description")}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-red-600">400</td>
              <td className="py-3 px-4">Bad Request</td>
              <td className="py-3 px-4 text-muted-foreground">{t("errors.codes.badRequest")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-red-600">401</td>
              <td className="py-3 px-4">Unauthorized</td>
              <td className="py-3 px-4 text-muted-foreground">{t("errors.codes.unauthorized")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-red-600">403</td>
              <td className="py-3 px-4">Forbidden</td>
              <td className="py-3 px-4 text-muted-foreground">{t("errors.codes.forbidden")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-red-600">409</td>
              <td className="py-3 px-4">Conflict</td>
              <td className="py-3 px-4 text-muted-foreground">{t("errors.codes.conflict")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-red-600">422</td>
              <td className="py-3 px-4">Validation Error</td>
              <td className="py-3 px-4 text-muted-foreground">{t("errors.codes.validation")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-red-600">429</td>
              <td className="py-3 px-4">Too Many Requests</td>
              <td className="py-3 px-4 text-muted-foreground">{t("errors.codes.rateLimit")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Success tip */}
      <div className="not-prose my-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-200">
              {t("tip.title")}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              {t("tip.description")}
            </p>
          </div>
        </div>
      </div>

      <h2>{t("nextSteps.title")}</h2>
      <div className="not-prose grid gap-3 my-4">
        <Link
          href="/docs/api/contacts"
          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">{t("nextSteps.contacts")}</p>
            <p className="text-sm text-muted-foreground">
              {t("nextSteps.contactsDesc")}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
        <Link
          href="/docs/api/messages"
          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">{t("nextSteps.messages")}</p>
            <p className="text-sm text-muted-foreground">
              {t("nextSteps.messagesDesc")}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
