import { google, sheets_v4 } from "googleapis";

let sheetsClient: sheets_v4.Sheets | null = null;

export async function getSheetsClient(): Promise<sheets_v4.Sheets | null> {
  if (sheetsClient) return sheetsClient;

  const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
  if (!credentials) {
    console.warn("Google Sheets credentials not configured");
    return null;
  }

  try {
    const decodedCredentials = JSON.parse(
      Buffer.from(credentials, "base64").toString("utf-8")
    );

    const auth = new google.auth.GoogleAuth({
      credentials: decodedCredentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    sheetsClient = google.sheets({ version: "v4", auth });
    return sheetsClient;
  } catch (error) {
    console.error("Failed to initialize Google Sheets client:", error);
    return null;
  }
}

export async function checkConnection(): Promise<boolean> {
  const client = await getSheetsClient();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!client || !sheetId) return false;

  try {
    await client.spreadsheets.get({ spreadsheetId: sheetId });
    return true;
  } catch {
    return false;
  }
}
