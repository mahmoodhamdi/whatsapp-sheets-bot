import { getTranslations } from "next-intl/server";

export default async function AuthApiDocsPage() {
  const t = await getTranslations("docs.api.auth");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="lead text-xl text-muted-foreground">{t("subtitle")}</p>

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.description")}</p>

      <h2>{t("endpoints.title")}</h2>

      <h3>POST /api/auth/register</h3>
      <p>{t("endpoints.register.description")}</p>
      <pre>
        <code>{`{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}`}</code>
      </pre>

      <h3>POST /api/auth/signin</h3>
      <p>{t("endpoints.signin.description")}</p>
      <pre>
        <code>{`{
  "email": "john@example.com",
  "password": "securepassword123"
}`}</code>
      </pre>

      <h3>POST /api/auth/signout</h3>
      <p>{t("endpoints.signout.description")}</p>

      <h3>GET /api/auth/session</h3>
      <p>{t("endpoints.session.description")}</p>

      <h2>{t("authentication.title")}</h2>
      <p>{t("authentication.description")}</p>

      <h2>{t("errors.title")}</h2>
      <table>
        <thead>
          <tr>
            <th>{t("errors.code")}</th>
            <th>{t("errors.description")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>401</td>
            <td>{t("errors.unauthorized")}</td>
          </tr>
          <tr>
            <td>403</td>
            <td>{t("errors.forbidden")}</td>
          </tr>
          <tr>
            <td>422</td>
            <td>{t("errors.validation")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
