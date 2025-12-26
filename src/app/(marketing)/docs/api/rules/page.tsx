import { getTranslations } from "next-intl/server";

export default async function RulesApiDocsPage() {
  const t = await getTranslations("docs.api.rules");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      <h2>{t("endpoints.title")}</h2>

      <h3>GET /api/rules</h3>
      <p>{t("endpoints.list.description")}</p>

      <h4>{t("endpoints.list.response")}</h4>
      <pre>
        <code>{`{
  "rules": [
    {
      "id": "rule-1",
      "name": "Welcome Message",
      "trigger": "hello",
      "triggerType": "CONTAINS",
      "response": "Welcome! How can I help you?",
      "priority": 10,
      "isActive": true,
      "matchCount": 150,
      "createdAt": "2025-01-10T08:00:00Z"
    }
  ]
}`}</code>
      </pre>

      <h3>POST /api/rules</h3>
      <p>{t("endpoints.create.description")}</p>
      <pre>
        <code>{`{
  "name": "New Rule",
  "trigger": "help",
  "triggerType": "EXACT",
  "response": "How can I assist you today?",
  "priority": 5,
  "isActive": true
}`}</code>
      </pre>

      <h4>{t("endpoints.create.triggerTypes")}</h4>
      <table>
        <thead>
          <tr>
            <th>{t("table.type")}</th>
            <th>{t("table.description")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>EXACT</td>
            <td>{t("endpoints.create.types.exact")}</td>
          </tr>
          <tr>
            <td>CONTAINS</td>
            <td>{t("endpoints.create.types.contains")}</td>
          </tr>
          <tr>
            <td>STARTS_WITH</td>
            <td>{t("endpoints.create.types.startsWith")}</td>
          </tr>
          <tr>
            <td>REGEX</td>
            <td>{t("endpoints.create.types.regex")}</td>
          </tr>
        </tbody>
      </table>

      <h3>PUT /api/rules/:id</h3>
      <p>{t("endpoints.update.description")}</p>

      <h3>DELETE /api/rules/:id</h3>
      <p>{t("endpoints.delete.description")}</p>

      <h3>POST /api/rules/:id/toggle</h3>
      <p>{t("endpoints.toggle.description")}</p>
      <pre>
        <code>{`{
  "isActive": false
}`}</code>
      </pre>
    </div>
  );
}
