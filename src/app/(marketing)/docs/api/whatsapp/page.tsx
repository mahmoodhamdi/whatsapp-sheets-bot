import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  MessageSquare,
  Plug,
  Unplug,
  QrCode,
  Activity,
  AlertTriangle,
  CheckCircle,
  Smartphone,
} from "lucide-react";

export default async function WhatsAppApiDocsPage() {
  const t = await getTranslations("docs.api.whatsapp");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      {/* Quick links */}
      <div className="not-prose my-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <a href="#status" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Activity className="h-5 w-5 text-green-600" />
          <span>{t("nav.status")}</span>
        </a>
        <a href="#qr" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <QrCode className="h-5 w-5 text-green-600" />
          <span>{t("nav.qr")}</span>
        </a>
        <a href="#connect" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Plug className="h-5 w-5 text-green-600" />
          <span>{t("nav.connect")}</span>
        </a>
        <a href="#disconnect" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Unplug className="h-5 w-5 text-green-600" />
          <span>{t("nav.disconnect")}</span>
        </a>
      </div>

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.description")}</p>

      {/* Connection info box */}
      <div className="not-prose my-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-200">
              {t("overview.baileys.title")}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t("overview.baileys.description")}
            </p>
          </div>
        </div>
      </div>

      <h2>{t("endpoints.title")}</h2>

      {/* Status endpoint */}
      <div id="status" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded">GET</span>
          <code className="text-sm font-mono">/api/whatsapp/status</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.status.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.status.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>{`{
  "connected": true,
  "phoneNumber": "+966501234567",
  "name": "Business Account",
  "lastSeen": "2025-01-15T10:30:00Z"
}`}</code>
          </pre>

          <h4 className="font-semibold mb-2">{t("endpoints.status.states")}</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium">{t("endpoints.status.connected")}</span>
              <span className="text-xs text-muted-foreground">{t("endpoints.status.connectedDesc")}</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="text-sm font-medium">{t("endpoints.status.connecting")}</span>
              <span className="text-xs text-muted-foreground">{t("endpoints.status.connectingDesc")}</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-sm font-medium">{t("endpoints.status.disconnected")}</span>
              <span className="text-xs text-muted-foreground">{t("endpoints.status.disconnectedDesc")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code endpoint */}
      <div id="qr" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded">GET</span>
          <code className="text-sm font-mono">/api/whatsapp/qr</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.qr.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.qr.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>{`{
  "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "expiresAt": "2025-01-15T10:32:00Z"
}`}</code>
          </pre>

          <h4 className="font-semibold mb-2">{t("endpoints.qr.usage")}</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>{t("endpoints.qr.step1")}</li>
            <li>{t("endpoints.qr.step2")}</li>
            <li>{t("endpoints.qr.step3")}</li>
            <li>{t("endpoints.qr.step4")}</li>
          </ol>

          {/* Warning box */}
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {t("endpoints.qr.warning")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connect endpoint */}
      <div id="connect" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-green-600 rounded">POST</span>
          <code className="text-sm font-mono">/api/whatsapp/connect</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.connect.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.connect.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>{`{
  "success": true,
  "message": "Connection initiated. Please scan the QR code.",
  "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}`}</code>
          </pre>

          <h4 className="font-semibold mb-2">{t("endpoints.connect.flow")}</h4>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-sm">
              1. {t("endpoints.connect.flow1")}
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-sm">
              2. {t("endpoints.connect.flow2")}
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm">
              3. {t("endpoints.connect.flow3")}
            </span>
          </div>
        </div>
      </div>

      {/* Disconnect endpoint */}
      <div id="disconnect" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded">POST</span>
          <code className="text-sm font-mono">/api/whatsapp/disconnect</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.disconnect.description")}</p>

          {/* Warning box */}
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {t("endpoints.disconnect.warning")}
              </p>
            </div>
          </div>

          <h4 className="font-semibold mb-2">{t("endpoints.disconnect.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "message": "WhatsApp disconnected successfully"
}`}</code>
          </pre>
        </div>
      </div>

      {/* Error codes */}
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
              <td className="py-3 px-4 font-mono text-red-600">409</td>
              <td className="py-3 px-4">Conflict</td>
              <td className="py-3 px-4 text-muted-foreground">{t("errors.codes.conflict")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-red-600">503</td>
              <td className="py-3 px-4">Service Unavailable</td>
              <td className="py-3 px-4 text-muted-foreground">{t("errors.codes.unavailable")}</td>
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
