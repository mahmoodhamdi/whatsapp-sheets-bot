import { getTranslations } from "next-intl/server";

export default async function MessagesApiDocsPage() {
  const t = await getTranslations("docs.api.messages");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      <h2>{t("endpoints.title")}</h2>

      <h3>GET /api/messages</h3>
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
            <td>direction</td>
            <td>string</td>
            <td>{t("endpoints.list.directionDesc")}</td>
          </tr>
        </tbody>
      </table>

      <h4>{t("endpoints.list.response")}</h4>
      <pre>
        <code>{`{
  "messages": [
    {
      "id": "msg-1",
      "content": "Hello!",
      "direction": "INCOMING",
      "contactId": "contact-1",
      "createdAt": "2025-01-15T10:30:00Z",
      "matchedRuleId": "rule-1"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500
  }
}`}</code>
      </pre>

      <h3>GET /api/messages/:contactId</h3>
      <p>{t("endpoints.getByContact.description")}</p>

      <h3>POST /api/messages/send</h3>
      <p>{t("endpoints.send.description")}</p>
      <pre>
        <code>{`{
  "phoneNumber": "+1234567890",
  "message": "Hello from the API!"
}`}</code>
      </pre>

      <h4>{t("endpoints.send.response")}</h4>
      <pre>
        <code>{`{
  "success": true,
  "messageId": "msg-123"
}`}</code>
      </pre>
    </div>
  );
}
