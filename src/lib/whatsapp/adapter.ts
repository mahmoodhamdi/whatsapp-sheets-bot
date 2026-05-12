import type { WhatsAppStatus } from "./types";

export type WhatsAppMode = "baileys" | "mock" | "cloud_api";

export interface WhatsAppAdapter {
  mode: WhatsAppMode;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(phone: string, content: string): Promise<boolean>;
  getStatus(): Promise<WhatsAppStatus>;
}

export function resolveMode(): WhatsAppMode {
  const mode = (process.env.WHATSAPP_MODE || "baileys").toLowerCase();
  if (mode === "mock" || mode === "cloud_api" || mode === "baileys") {
    return mode;
  }
  return "baileys";
}
