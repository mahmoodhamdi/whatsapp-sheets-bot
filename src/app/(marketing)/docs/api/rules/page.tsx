import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  Hash,
  Code,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Auto-Reply Rules API",
  description:
    "Rules API reference: create, update, delete, and toggle auto-reply rules. Trigger types, priority settings, and rule schema documentation.",
  openGraph: {
    title: "Auto-Reply Rules API | WhatsApp Auto-Reply Bot",
    description:
      "Complete API reference for managing auto-reply rules.",
  },
};

export default async function RulesApiDocsPage() {
  const t = await getTranslations("docs.api.rules");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      {/* Quick links */}
      <div className="not-prose my-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <a href="#list" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <FileText className="h-5 w-5 text-green-600" />
          <span>{t("nav.list")}</span>
        </a>
        <a href="#create" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Plus className="h-5 w-5 text-green-600" />
          <span>{t("nav.create")}</span>
        </a>
        <a href="#update" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Edit className="h-5 w-5 text-green-600" />
          <span>{t("nav.update")}</span>
        </a>
        <a href="#delete" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Trash2 className="h-5 w-5 text-green-600" />
          <span>{t("nav.delete")}</span>
        </a>
        <a href="#toggle" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <ToggleLeft className="h-5 w-5 text-green-600" />
          <span>{t("nav.toggle")}</span>
        </a>
      </div>

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.description")}</p>

      {/* Trigger types info */}
      <div className="not-prose my-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-3 border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="font-mono text-sm font-medium">EXACT</span>
          </div>
          <p className="text-xs text-muted-foreground">{t("overview.types.exact")}</p>
        </div>
        <div className="p-3 border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-green-600" />
            <span className="font-mono text-sm font-medium">CONTAINS</span>
          </div>
          <p className="text-xs text-muted-foreground">{t("overview.types.contains")}</p>
        </div>
        <div className="p-3 border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Hash className="h-4 w-4 text-purple-600" />
            <span className="font-mono text-sm font-medium">STARTS_WITH</span>
          </div>
          <p className="text-xs text-muted-foreground">{t("overview.types.startsWith")}</p>
        </div>
        <div className="p-3 border rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Code className="h-4 w-4 text-orange-600" />
            <span className="font-mono text-sm font-medium">REGEX</span>
          </div>
          <p className="text-xs text-muted-foreground">{t("overview.types.regex")}</p>
        </div>
      </div>

      <h2>{t("endpoints.title")}</h2>

      {/* List rules endpoint */}
      <div id="list" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded">GET</span>
          <code className="text-sm font-mono">/api/rules</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.list.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.list.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "rules": [
    {
      "id": "rule-1",
      "name": "Welcome Message",
      "trigger": "hello",
      "triggerType": "CONTAINS",
      "response": "Welcome! How can I help you today?",
      "priority": 10,
      "isActive": true,
      "matchCount": 150,
      "createdAt": "2025-01-10T08:00:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    },
    {
      "id": "rule-2",
      "name": "Pricing Info",
      "trigger": "price",
      "triggerType": "CONTAINS",
      "response": "Our prices start at 99 SAR. Would you like more details?",
      "priority": 5,
      "isActive": true,
      "matchCount": 75,
      "createdAt": "2025-01-12T09:00:00Z",
      "updatedAt": "2025-01-14T14:20:00Z"
    }
  ]
}`}</code>
          </pre>
        </div>
      </div>

      {/* Create rule endpoint */}
      <div id="create" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-green-600 rounded">POST</span>
          <code className="text-sm font-mono">/api/rules</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.create.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.create.requestBody")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>{`{
  "name": "Support Request",
  "trigger": "help",
  "triggerType": "EXACT",
  "response": "Our support team is here to help! Please describe your issue.",
  "priority": 8,
  "isActive": true
}`}</code>
          </pre>

          <h4 className="font-semibold mb-2">{t("endpoints.create.fields")}</h4>
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
                  <td className="py-2 px-3 font-mono text-sm">name</td>
                  <td className="py-2 px-3 text-blue-600">string</td>
                  <td className="py-2 px-3 text-green-600">{t("table.yes")}</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.create.nameDesc")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">trigger</td>
                  <td className="py-2 px-3 text-blue-600">string</td>
                  <td className="py-2 px-3 text-green-600">{t("table.yes")}</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.create.triggerDesc")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">triggerType</td>
                  <td className="py-2 px-3 text-blue-600">string</td>
                  <td className="py-2 px-3 text-green-600">{t("table.yes")}</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.create.triggerTypeDesc")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">response</td>
                  <td className="py-2 px-3 text-blue-600">string</td>
                  <td className="py-2 px-3 text-green-600">{t("table.yes")}</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.create.responseDesc")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">priority</td>
                  <td className="py-2 px-3 text-blue-600">number</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("table.no")}</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.create.priorityDesc")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">isActive</td>
                  <td className="py-2 px-3 text-blue-600">boolean</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("table.no")}</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.create.isActiveDesc")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="font-semibold mb-2">{t("endpoints.create.triggerTypes")}</h4>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.type")}</th>
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.description")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">EXACT</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.create.types.exact")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">CONTAINS</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.create.types.contains")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">STARTS_WITH</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.create.types.startsWith")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">REGEX</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.create.types.regex")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="font-semibold mb-2">{t("endpoints.create.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "rule": {
    "id": "rule-3",
    "name": "Support Request",
    "trigger": "help",
    "triggerType": "EXACT",
    "response": "Our support team is here to help!",
    "priority": 8,
    "isActive": true,
    "matchCount": 0,
    "createdAt": "2025-01-15T14:30:00Z"
  }
}`}</code>
          </pre>
        </div>
      </div>

      {/* Update rule endpoint */}
      <div id="update" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-yellow-600 rounded">PUT</span>
          <code className="text-sm font-mono">/api/rules/:id</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.update.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.update.requestBody")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>{`{
  "name": "Updated Support Request",
  "response": "We're here to help! What do you need assistance with?",
  "priority": 10
}`}</code>
          </pre>

          <h4 className="font-semibold mb-2">{t("endpoints.update.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "rule": {
    "id": "rule-3",
    "name": "Updated Support Request",
    "trigger": "help",
    "triggerType": "EXACT",
    "response": "We're here to help! What do you need assistance with?",
    "priority": 10,
    "isActive": true,
    "updatedAt": "2025-01-15T15:00:00Z"
  }
}`}</code>
          </pre>
        </div>
      </div>

      {/* Delete rule endpoint */}
      <div id="delete" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded">DELETE</span>
          <code className="text-sm font-mono">/api/rules/:id</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.delete.description")}</p>

          {/* Warning box */}
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {t("endpoints.delete.warning")}
              </p>
            </div>
          </div>

          <h4 className="font-semibold mb-2">{t("endpoints.delete.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "message": "Rule deleted successfully"
}`}</code>
          </pre>
        </div>
      </div>

      {/* Toggle rule endpoint */}
      <div id="toggle" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-purple-600 rounded">PATCH</span>
          <code className="text-sm font-mono">/api/rules/:id/toggle</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.toggle.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.toggle.requestBody")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>{`{
  "isActive": false
}`}</code>
          </pre>

          <h4 className="font-semibold mb-2">{t("endpoints.toggle.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "rule": {
    "id": "rule-1",
    "name": "Welcome Message",
    "isActive": false,
    "updatedAt": "2025-01-15T16:00:00Z"
  }
}`}</code>
          </pre>
        </div>
      </div>

      {/* Rule object */}
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
              <td className="py-3 px-4 font-mono text-sm">name</td>
              <td className="py-3 px-4 text-blue-600">string</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.name")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">trigger</td>
              <td className="py-3 px-4 text-blue-600">string</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.trigger")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">triggerType</td>
              <td className="py-3 px-4 text-blue-600">enum</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.triggerType")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">response</td>
              <td className="py-3 px-4 text-blue-600">string</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.response")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">priority</td>
              <td className="py-3 px-4 text-blue-600">number</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.priority")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">isActive</td>
              <td className="py-3 px-4 text-blue-600">boolean</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.isActive")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">matchCount</td>
              <td className="py-3 px-4 text-blue-600">number</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.matchCount")}</td>
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
