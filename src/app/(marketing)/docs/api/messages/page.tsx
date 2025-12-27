import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  Send,
  Inbox,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Messages API",
  description:
    "Messages API reference: list messages, get by contact, send messages via WhatsApp. Filtering, pagination, and message schema documentation.",
  openGraph: {
    title: "Messages API | WhatsApp Auto-Reply Bot",
    description:
      "Complete API reference for WhatsApp message operations.",
  },
};

export default async function MessagesApiDocsPage() {
  const t = await getTranslations("docs.api.messages");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      {/* Quick links */}
      <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
        <a href="#list" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Inbox className="h-5 w-5 text-green-600" />
          <span>{t("nav.list")}</span>
        </a>
        <a href="#contact" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <MessageSquare className="h-5 w-5 text-green-600" />
          <span>{t("nav.byContact")}</span>
        </a>
        <a href="#send" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Send className="h-5 w-5 text-green-600" />
          <span>{t("nav.send")}</span>
        </a>
      </div>

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.description")}</p>

      {/* WhatsApp connection info */}
      <div className="not-prose my-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-200">
              {t("overview.whatsappRequired.title")}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t("overview.whatsappRequired.description")}
            </p>
          </div>
        </div>
      </div>

      <h2>{t("endpoints.title")}</h2>

      {/* List messages endpoint */}
      <div id="list" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded">GET</span>
          <code className="text-sm font-mono">/api/messages</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.list.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.list.params")}</h4>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.param")}</th>
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.type")}</th>
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.default")}</th>
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.description")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">page</td>
                  <td className="py-2 px-3 text-blue-600">number</td>
                  <td className="py-2 px-3 text-muted-foreground">1</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.list.pageDesc")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">limit</td>
                  <td className="py-2 px-3 text-blue-600">number</td>
                  <td className="py-2 px-3 text-muted-foreground">20</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.list.limitDesc")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">direction</td>
                  <td className="py-2 px-3 text-blue-600">string</td>
                  <td className="py-2 px-3 text-muted-foreground">-</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.list.directionDesc")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="font-semibold mb-2">{t("endpoints.list.directionValues")}</h4>
          <div className="flex gap-2 mb-4">
            <span className="px-2 py-1 text-xs font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">INCOMING</span>
            <span className="px-2 py-1 text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">OUTGOING</span>
          </div>

          <h4 className="font-semibold mb-2">{t("endpoints.list.example")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>GET /api/messages?page=1&limit=10&direction=INCOMING</code>
          </pre>

          <h4 className="font-semibold mb-2">{t("endpoints.list.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "messages": [
    {
      "id": "msg-1",
      "content": "Hello!",
      "direction": "INCOMING",
      "contactId": "contact-1",
      "contact": {
        "phoneNumber": "+966501234567",
        "name": "Ahmed Ali"
      },
      "matchedRuleId": null,
      "createdAt": "2025-01-15T10:30:00Z"
    },
    {
      "id": "msg-2",
      "content": "Welcome! How can I help?",
      "direction": "OUTGOING",
      "contactId": "contact-1",
      "matchedRuleId": "rule-1",
      "matchedRule": {
        "name": "Greeting"
      },
      "createdAt": "2025-01-15T10:30:01Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 500,
    "totalPages": 50
  }
}`}</code>
          </pre>
        </div>
      </div>

      {/* Get messages by contact endpoint */}
      <div id="contact" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded">GET</span>
          <code className="text-sm font-mono">/api/messages/:contactId</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.getByContact.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.getByContact.params")}</h4>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.param")}</th>
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.type")}</th>
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.description")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">contactId</td>
                  <td className="py-2 px-3 text-blue-600">string</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.getByContact.contactIdDesc")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="font-semibold mb-2">{t("endpoints.getByContact.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "messages": [
    {
      "id": "msg-1",
      "content": "Hello!",
      "direction": "INCOMING",
      "createdAt": "2025-01-15T10:30:00Z"
    },
    {
      "id": "msg-2",
      "content": "Welcome! How can I help?",
      "direction": "OUTGOING",
      "matchedRuleId": "rule-1",
      "createdAt": "2025-01-15T10:30:01Z"
    }
  ],
  "contact": {
    "id": "contact-1",
    "phoneNumber": "+966501234567",
    "name": "Ahmed Ali"
  }
}`}</code>
          </pre>
        </div>
      </div>

      {/* Send message endpoint */}
      <div id="send" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-green-600 rounded">POST</span>
          <code className="text-sm font-mono">/api/messages/send</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.send.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.send.requestBody")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>{`{
  "phoneNumber": "+966501234567",
  "message": "Hello from the API!"
}`}</code>
          </pre>

          <h4 className="font-semibold mb-2">{t("endpoints.send.fields")}</h4>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.field")}</th>
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.type")}</th>
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.required")}</th>
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.description")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">phoneNumber</td>
                  <td className="py-2 px-3 text-blue-600">string</td>
                  <td className="py-2 px-3 text-green-600">{t("table.yes")}</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.send.phoneDesc")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">message</td>
                  <td className="py-2 px-3 text-blue-600">string</td>
                  <td className="py-2 px-3 text-green-600">{t("table.yes")}</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.send.messageDesc")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Warning box */}
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {t("endpoints.send.warning")}
              </p>
            </div>
          </div>

          <h4 className="font-semibold mb-2">{t("endpoints.send.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "message": {
    "id": "msg-123",
    "content": "Hello from the API!",
    "direction": "OUTGOING",
    "contactId": "contact-1",
    "createdAt": "2025-01-15T14:30:00Z"
  }
}`}</code>
          </pre>
        </div>
      </div>

      {/* Message object */}
      <h2>{t("schema.title")}</h2>
      <p>{t("schema.description")}</p>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 bg-muted font-semibold">{t("table.field")}</th>
              <th className="text-left py-3 px-4 bg-muted font-semibold">{t("table.type")}</th>
              <th className="text-left py-3 px-4 bg-muted font-semibold">{t("table.description")}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">id</td>
              <td className="py-3 px-4 text-blue-600">string</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.id")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">content</td>
              <td className="py-3 px-4 text-blue-600">string</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.content")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">direction</td>
              <td className="py-3 px-4 text-blue-600">INCOMING | OUTGOING</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.direction")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">contactId</td>
              <td className="py-3 px-4 text-blue-600">string</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.contactId")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">matchedRuleId</td>
              <td className="py-3 px-4 text-blue-600">string | null</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.matchedRuleId")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">syncedToSheets</td>
              <td className="py-3 px-4 text-blue-600">boolean</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.syncedToSheets")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">createdAt</td>
              <td className="py-3 px-4 text-blue-600">string</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.createdAt")}</td>
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
          href="/docs/api/rules"
          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">{t("nextSteps.rules")}</p>
            <p className="text-sm text-muted-foreground">
              {t("nextSteps.rulesDesc")}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
        <Link
          href="/docs/api/whatsapp"
          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">{t("nextSteps.whatsapp")}</p>
            <p className="text-sm text-muted-foreground">
              {t("nextSteps.whatsappDesc")}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
