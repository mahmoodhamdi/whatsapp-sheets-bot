import { getTranslations } from "next-intl/server";

export default async function ContactsApiDocsPage() {
  const t = await getTranslations("docs.api.contacts");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      <h2>{t("endpoints.title")}</h2>

      <h3>GET /api/contacts</h3>
      <p>{t("endpoints.list.description")}</p>
      <h4>{t("endpoints.list.params")}</h4>
      <table>
        <thead>
          <tr>
            <th>{t("table.param")}</th>
            <th>{t("table.type")}</th>
            <th>{t("table.description")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>page</td>
            <td>number</td>
            <td>{t("endpoints.list.pageDesc")}</td>
          </tr>
          <tr>
            <td>limit</td>
            <td>number</td>
            <td>{t("endpoints.list.limitDesc")}</td>
          </tr>
          <tr>
            <td>search</td>
            <td>string</td>
            <td>{t("endpoints.list.searchDesc")}</td>
          </tr>
        </tbody>
      </table>

      <h4>{t("endpoints.list.response")}</h4>
      <pre>
        <code>{`{
  "contacts": [
    {
      "id": "contact-1",
      "phoneNumber": "+1234567890",
      "name": "John Doe",
      "messagesCount": 15,
      "lastMessageAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}`}</code>
      </pre>

      <h3>GET /api/contacts/:id</h3>
      <p>{t("endpoints.get.description")}</p>

      <h3>PUT /api/contacts/:id</h3>
      <p>{t("endpoints.update.description")}</p>
      <pre>
        <code>{`{
  "name": "Updated Name",
  "notes": "Important customer"
}`}</code>
      </pre>

      <h3>DELETE /api/contacts/:id</h3>
      <p>{t("endpoints.delete.description")}</p>
    </div>
  );
}
