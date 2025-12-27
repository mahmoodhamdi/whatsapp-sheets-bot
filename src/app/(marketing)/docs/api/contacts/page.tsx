import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  UserPlus,
  UserMinus,
  Search,
  Edit,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contacts API",
  description:
    "Contacts API reference: list, search, update, and delete WhatsApp contacts. Pagination, filtering, and contact schema documentation.",
  openGraph: {
    title: "Contacts API | WhatsApp Auto-Reply Bot",
    description:
      "Complete API reference for managing WhatsApp contacts.",
  },
};

export default async function ContactsApiDocsPage() {
  const t = await getTranslations("docs.api.contacts");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      {/* Quick links */}
      <div className="not-prose my-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <a href="#list" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Users className="h-5 w-5 text-green-600" />
          <span>{t("nav.list")}</span>
        </a>
        <a href="#get" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Search className="h-5 w-5 text-green-600" />
          <span>{t("nav.get")}</span>
        </a>
        <a href="#update" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <Edit className="h-5 w-5 text-green-600" />
          <span>{t("nav.update")}</span>
        </a>
        <a href="#delete" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
          <UserMinus className="h-5 w-5 text-green-600" />
          <span>{t("nav.delete")}</span>
        </a>
      </div>

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.description")}</p>

      <h2>{t("endpoints.title")}</h2>

      {/* List contacts endpoint */}
      <div id="list" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded">GET</span>
          <code className="text-sm font-mono">/api/contacts</code>
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
                  <td className="py-2 px-3 font-mono text-sm">search</td>
                  <td className="py-2 px-3 text-blue-600">string</td>
                  <td className="py-2 px-3 text-muted-foreground">-</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.list.searchDesc")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="font-semibold mb-2">{t("endpoints.list.example")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>GET /api/contacts?page=1&limit=10&search=ahmed</code>
          </pre>

          <h4 className="font-semibold mb-2">{t("endpoints.list.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "contacts": [
    {
      "id": "contact-1",
      "phoneNumber": "+966501234567",
      "name": "Ahmed Ali",
      "messagesCount": 15,
      "lastMessageAt": "2025-01-15T10:30:00Z",
      "createdAt": "2025-01-01T08:00:00Z"
    },
    {
      "id": "contact-2",
      "phoneNumber": "+201012345678",
      "name": "Sara Mohamed",
      "messagesCount": 8,
      "lastMessageAt": "2025-01-15T12:15:00Z",
      "createdAt": "2025-01-05T09:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "totalPages": 16
  }
}`}</code>
          </pre>
        </div>
      </div>

      {/* Get contact endpoint */}
      <div id="get" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded">GET</span>
          <code className="text-sm font-mono">/api/contacts/:id</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.get.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.get.params")}</h4>
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
                  <td className="py-2 px-3 font-mono text-sm">id</td>
                  <td className="py-2 px-3 text-blue-600">string</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.get.idDesc")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="font-semibold mb-2">{t("endpoints.get.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "contact": {
    "id": "contact-1",
    "phoneNumber": "+966501234567",
    "name": "Ahmed Ali",
    "messagesCount": 15,
    "lastMessageAt": "2025-01-15T10:30:00Z",
    "createdAt": "2025-01-01T08:00:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}`}</code>
          </pre>
        </div>
      </div>

      {/* Update contact endpoint */}
      <div id="update" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-yellow-600 rounded">PUT</span>
          <code className="text-sm font-mono">/api/contacts/:id</code>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{t("endpoints.update.description")}</p>

          <h4 className="font-semibold mb-2">{t("endpoints.update.requestBody")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>{`{
  "name": "Ahmed Ali Ibrahim"
}`}</code>
          </pre>

          <h4 className="font-semibold mb-2">{t("endpoints.update.fields")}</h4>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.field")}</th>
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.type")}</th>
                  <th className="text-left py-2 px-3 bg-muted/50 font-medium">{t("table.description")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-3 font-mono text-sm">name</td>
                  <td className="py-2 px-3 text-blue-600">string</td>
                  <td className="py-2 px-3 text-muted-foreground">{t("endpoints.update.nameDesc")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="font-semibold mb-2">{t("endpoints.update.response")}</h4>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "contact": {
    "id": "contact-1",
    "phoneNumber": "+966501234567",
    "name": "Ahmed Ali Ibrahim",
    "updatedAt": "2025-01-15T14:30:00Z"
  }
}`}</code>
          </pre>
        </div>
      </div>

      {/* Delete contact endpoint */}
      <div id="delete" className="not-prose my-6 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted border-b">
          <span className="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded">DELETE</span>
          <code className="text-sm font-mono">/api/contacts/:id</code>
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
  "message": "Contact deleted successfully"
}`}</code>
          </pre>
        </div>
      </div>

      {/* Contact object */}
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
              <td className="py-3 px-4 font-mono text-sm">phoneNumber</td>
              <td className="py-3 px-4 text-blue-600">string</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.phoneNumber")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">name</td>
              <td className="py-3 px-4 text-blue-600">string | null</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.name")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">messagesCount</td>
              <td className="py-3 px-4 text-blue-600">number</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.messagesCount")}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-mono text-sm">lastMessageAt</td>
              <td className="py-3 px-4 text-blue-600">string | null</td>
              <td className="py-3 px-4 text-muted-foreground">{t("schema.fields.lastMessageAt")}</td>
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
      </div>
    </div>
  );
}
