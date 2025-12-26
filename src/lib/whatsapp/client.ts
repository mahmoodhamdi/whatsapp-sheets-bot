import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  proto,
  AnyMessageContent,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import { prisma } from "@/lib/prisma";
import { matchMessage } from "./matcher";
import type { WhatsAppStatus } from "./types";
import { canSendMessage, incrementMessageCount } from "@/lib/services/usage";

/**
 * Get the bot owner's user ID.
 * In single-tenant mode, this is the first user with a subscription,
 * or the first admin user.
 */
async function getBotOwnerUserId(): Promise<string | null> {
  // First try to find a user with an active subscription
  const subscription = await prisma.subscription.findFirst({
    where: {
      status: { in: ["ACTIVE", "TRIALING"] },
    },
    select: { userId: true },
    orderBy: { createdAt: "asc" },
  });

  if (subscription) {
    return subscription.userId;
  }

  // Fallback to first admin user
  const adminUser = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  return adminUser?.id || null;
}

// Simple logger compatible with Baileys
const logger = {
  level: "silent",
  trace: () => {},
  debug: () => {},
  info: () => {},
  warn: console.warn,
  error: console.error,
  fatal: console.error,
  child: () => logger,
};

const SESSION_PATH = process.env.WHATSAPP_SESSION_PATH || "./sessions";

let socket: WASocket | null = null;
let currentQR: string | null = null;
let connectionStatus: "disconnected" | "connecting" | "connected" =
  "disconnected";

// Event listeners for QR updates
type QRListener = (qr: string | null) => void;
const qrListeners: Set<QRListener> = new Set();

export function addQRListener(listener: QRListener): () => void {
  qrListeners.add(listener);
  // Send current QR if available
  if (currentQR) {
    listener(currentQR);
  }
  return () => qrListeners.delete(listener);
}

function notifyQRListeners(qr: string | null) {
  currentQR = qr;
  qrListeners.forEach((listener) => listener(qr));
}

export async function getStatus(): Promise<WhatsAppStatus> {
  const settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });

  return {
    connected: settings?.whatsappConnected || false,
    qr: currentQR || undefined,
  };
}

export async function connectWhatsApp(): Promise<void> {
  if (socket && connectionStatus === "connected") {
    return;
  }

  connectionStatus = "connecting";

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);

    socket = makeWASocket({
      auth: state,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      logger: logger as any,
      printQRInTerminal: false,
      browser: ["WhatsApp Bot", "Chrome", "1.0.0"],
    });

    socket.ev.on("creds.update", saveCreds);

    socket.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        notifyQRListeners(qr);
      }

      if (connection === "close") {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;

        connectionStatus = "disconnected";
        notifyQRListeners(null);

        await prisma.settings.upsert({
          where: { id: "default" },
          update: { whatsappConnected: false },
          create: { id: "default", whatsappConnected: false },
        });

        if (shouldReconnect) {
          console.log("Reconnecting to WhatsApp...");
          setTimeout(() => connectWhatsApp(), 3000);
        } else {
          console.log("Logged out from WhatsApp");
        }
      } else if (connection === "open") {
        connectionStatus = "connected";
        currentQR = null;
        notifyQRListeners(null);

        await prisma.settings.upsert({
          where: { id: "default" },
          update: { whatsappConnected: true },
          create: { id: "default", whatsappConnected: true },
        });

        console.log("Connected to WhatsApp!");
      }
    });

    socket.ev.on("messages.upsert", async ({ messages }) => {
      for (const msg of messages) {
        await handleIncomingMessage(msg);
      }
    });
  } catch (error) {
    console.error("WhatsApp connection error:", error);
    connectionStatus = "disconnected";
    throw error;
  }
}

export async function disconnectWhatsApp(): Promise<void> {
  if (socket) {
    await socket.logout();
    socket = null;
    connectionStatus = "disconnected";
    currentQR = null;

    await prisma.settings.upsert({
      where: { id: "default" },
      update: { whatsappConnected: false },
      create: { id: "default", whatsappConnected: false },
    });
  }
}

async function handleIncomingMessage(
  msg: proto.IWebMessageInfo
): Promise<void> {
  // Skip non-text messages and status updates
  if (!msg.message || !msg.key || msg.key.fromMe || !msg.key.remoteJid) return;

  const textMessage =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    "";

  if (!textMessage) return;

  // Extract phone number (remove @s.whatsapp.net suffix)
  const remoteJid = msg.key.remoteJid;
  const phone = remoteJid.replace("@s.whatsapp.net", "");

  // Skip group messages
  if (remoteJid.includes("@g.us")) return;

  try {
    // Find or create contact
    let contact = await prisma.contact.findUnique({ where: { phone } });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          phone,
          name: msg.pushName || null,
        },
      });
    } else if (msg.pushName && contact.name !== msg.pushName) {
      // Update name if changed
      contact = await prisma.contact.update({
        where: { id: contact.id },
        data: { name: msg.pushName },
      });
    }

    // Get active rules
    const rules = await prisma.autoReplyRule.findMany({
      where: { isActive: true },
    });

    // Match message against rules
    const matchedRule = matchMessage(textMessage, rules);

    // Save incoming message
    await prisma.message.create({
      data: {
        contactId: contact.id,
        direction: "INCOMING",
        content: textMessage,
        status: "RECEIVED",
        ruleId: matchedRule?.id || null,
      },
    });

    // Update contact stats
    await prisma.contact.update({
      where: { id: contact.id },
      data: {
        lastContact: new Date(),
        messageCount: { increment: 1 },
      },
    });

    // Send auto-reply if matched (check usage limits first)
    const botOwnerId = await getBotOwnerUserId();

    if (matchedRule) {
      const canSend = botOwnerId ? await canSendMessage(botOwnerId) : true;
      if (canSend) {
        const sent = await sendMessage(phone, matchedRule.response, matchedRule.id, contact.id);
        if (sent && botOwnerId) {
          await incrementMessageCount(botOwnerId);
        }
      } else {
        console.log("Message limit reached, skipping auto-reply");
      }
    } else {
      // Send default reply if no match and default reply is set
      const settings = await prisma.settings.findUnique({
        where: { id: "default" },
      });
      if (settings?.defaultReply) {
        const canSend = botOwnerId ? await canSendMessage(botOwnerId) : true;
        if (canSend) {
          const sent = await sendMessage(phone, settings.defaultReply, null, contact.id);
          if (sent && botOwnerId) {
            await incrementMessageCount(botOwnerId);
          }
        } else {
          console.log("Message limit reached, skipping default reply");
        }
      }
    }
  } catch (error) {
    console.error("Error handling incoming message:", error);
  }
}

export async function sendMessage(
  phone: string,
  content: string,
  ruleId: string | null = null,
  contactId?: string
): Promise<boolean> {
  if (!socket || connectionStatus !== "connected") {
    console.error("WhatsApp not connected");
    return false;
  }

  try {
    const jid = phone.includes("@") ? phone : `${phone}@s.whatsapp.net`;

    const messageContent: AnyMessageContent = { text: content };
    await socket.sendMessage(jid, messageContent);

    // Find contact if not provided
    if (!contactId) {
      const cleanPhone = phone.replace("@s.whatsapp.net", "");
      const contact = await prisma.contact.findUnique({
        where: { phone: cleanPhone },
      });
      contactId = contact?.id;
    }

    // Log outgoing message
    if (contactId) {
      await prisma.message.create({
        data: {
          contactId,
          direction: "OUTGOING",
          content,
          status: "SENT",
          ruleId,
        },
      });

      await prisma.contact.update({
        where: { id: contactId },
        data: {
          lastContact: new Date(),
          messageCount: { increment: 1 },
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
}

export function getSocket(): WASocket | null {
  return socket;
}

export function isConnected(): boolean {
  return connectionStatus === "connected";
}

/**
 * Send a message without logging to database.
 * Used by API routes that handle their own message logging.
 */
export async function sendMessageRaw(
  phone: string,
  content: string
): Promise<boolean> {
  if (!socket || connectionStatus !== "connected") {
    return false;
  }

  try {
    const jid = phone.includes("@") ? phone : `${phone}@s.whatsapp.net`;
    await socket.sendMessage(jid, { text: content });
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
}
