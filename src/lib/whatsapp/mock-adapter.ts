import { prisma } from "@/lib/prisma";
import { matchMessage } from "./matcher";
import type { WhatsAppStatus } from "./types";
import type { WhatsAppAdapter } from "./adapter";

interface OutboundLog {
  to: string;
  content: string;
  ruleId: string | null;
  at: Date;
}

const outboundLog: OutboundLog[] = [];
let mockConnected = false;

export const mockAdapter: WhatsAppAdapter = {
  mode: "mock",

  async connect() {
    mockConnected = true;
    await prisma.settings.upsert({
      where: { id: "default" },
      update: { whatsappConnected: true },
      create: { id: "default", whatsappConnected: true },
    });
  },

  async disconnect() {
    mockConnected = false;
    await prisma.settings.upsert({
      where: { id: "default" },
      update: { whatsappConnected: false },
      create: { id: "default", whatsappConnected: false },
    });
  },

  async sendMessage(phone: string, content: string) {
    if (!mockConnected) return false;
    outboundLog.push({ to: phone, content, ruleId: null, at: new Date() });
    return true;
  },

  async getStatus(): Promise<WhatsAppStatus> {
    return { connected: mockConnected };
  },
};

export async function simulateIncomingMessage(
  phone: string,
  text: string,
  pushName?: string,
): Promise<{ matched: boolean; reply?: string }> {
  if (!mockConnected) {
    throw new Error("Mock adapter not connected — call adapter.connect() first");
  }

  let contact = await prisma.contact.findUnique({ where: { phone } });
  if (!contact) {
    contact = await prisma.contact.create({
      data: { phone, name: pushName || null },
    });
  }

  const rules = await prisma.autoReplyRule.findMany({ where: { isActive: true } });
  const matched = matchMessage(text, rules);

  await prisma.message.create({
    data: {
      contactId: contact.id,
      direction: "INCOMING",
      content: text,
      status: "RECEIVED",
      ruleId: matched?.id || null,
    },
  });

  await prisma.contact.update({
    where: { id: contact.id },
    data: { lastContact: new Date(), messageCount: { increment: 1 } },
  });

  if (matched) {
    await mockAdapter.sendMessage(phone, matched.response);
    await prisma.message.create({
      data: {
        contactId: contact.id,
        direction: "OUTGOING",
        content: matched.response,
        status: "SENT",
        ruleId: matched.id,
      },
    });
    return { matched: true, reply: matched.response };
  }

  const settings = await prisma.settings.findUnique({ where: { id: "default" } });
  if (settings?.defaultReply) {
    await mockAdapter.sendMessage(phone, settings.defaultReply);
    await prisma.message.create({
      data: {
        contactId: contact.id,
        direction: "OUTGOING",
        content: settings.defaultReply,
        status: "SENT",
      },
    });
    return { matched: false, reply: settings.defaultReply };
  }

  return { matched: false };
}

export function getMockOutboundLog(): OutboundLog[] {
  return [...outboundLog];
}

export function resetMockState() {
  outboundLog.length = 0;
  mockConnected = false;
}
