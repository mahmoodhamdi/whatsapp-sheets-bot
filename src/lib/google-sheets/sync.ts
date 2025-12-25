import { prisma } from "@/lib/prisma";
import { getSheetsClient } from "./client";

const CONTACTS_SHEET = "Contacts";
const MESSAGES_SHEET = "Messages";

export async function syncContacts(): Promise<{ success: boolean; count: number }> {
  const client = await getSheetsClient();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!client || !sheetId) {
    return { success: false, count: 0 };
  }

  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { lastContact: "desc" },
    });

    const values = [
      ["Phone", "Name", "First Contact", "Last Contact", "Message Count"],
      ...contacts.map((c) => [
        c.phone,
        c.name || "",
        c.firstContact.toISOString(),
        c.lastContact.toISOString(),
        c.messageCount.toString(),
      ]),
    ];

    await client.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${CONTACTS_SHEET}!A1`,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    await logSync("GOOGLE_SHEETS", "SUCCESS", `Synced ${contacts.length} contacts`);

    return { success: true, count: contacts.length };
  } catch (error) {
    console.error("Contacts sync error:", error);
    await logSync("GOOGLE_SHEETS", "FAILED", String(error));
    return { success: false, count: 0 };
  }
}

export async function syncMessages(): Promise<{ success: boolean; count: number }> {
  const client = await getSheetsClient();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!client || !sheetId) {
    return { success: false, count: 0 };
  }

  try {
    // Get unsynced messages
    const messages = await prisma.message.findMany({
      where: { syncedToSheets: false },
      include: {
        contact: true,
        rule: true,
      },
      orderBy: { createdAt: "desc" },
      take: 1000, // Batch limit
    });

    if (messages.length === 0) {
      return { success: true, count: 0 };
    }

    // Get existing data to append
    const existingData = await client.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${MESSAGES_SHEET}!A1:F1`,
    });

    const hasHeader = existingData.data.values && existingData.data.values.length > 0;

    const values = hasHeader
      ? messages.map((m) => [
          m.createdAt.toISOString(),
          m.contact.phone,
          m.direction,
          m.content,
          m.rule?.name || "",
          m.status,
        ])
      : [
          ["Timestamp", "Phone", "Direction", "Content", "Rule Used", "Status"],
          ...messages.map((m) => [
            m.createdAt.toISOString(),
            m.contact.phone,
            m.direction,
            m.content,
            m.rule?.name || "",
            m.status,
          ]),
        ];

    await client.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${MESSAGES_SHEET}!A1`,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    // Mark messages as synced
    await prisma.message.updateMany({
      where: {
        id: { in: messages.map((m) => m.id) },
      },
      data: { syncedToSheets: true },
    });

    await logSync("GOOGLE_SHEETS", "SUCCESS", `Synced ${messages.length} messages`);

    return { success: true, count: messages.length };
  } catch (error) {
    console.error("Messages sync error:", error);
    await logSync("GOOGLE_SHEETS", "FAILED", String(error));
    return { success: false, count: 0 };
  }
}

export async function syncAll(): Promise<{
  success: boolean;
  contacts: number;
  messages: number;
}> {
  const contactsResult = await syncContacts();
  const messagesResult = await syncMessages();

  return {
    success: contactsResult.success && messagesResult.success,
    contacts: contactsResult.count,
    messages: messagesResult.count,
  };
}

async function logSync(
  type: "GOOGLE_SHEETS" | "WHATSAPP",
  status: "SUCCESS" | "FAILED" | "PENDING",
  details?: string
): Promise<void> {
  await prisma.syncLog.create({
    data: { type, status, details },
  });
}

export async function getSyncLogs(limit = 20) {
  return prisma.syncLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
