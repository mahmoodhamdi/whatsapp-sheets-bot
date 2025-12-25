export interface WhatsAppStatus {
  connected: boolean;
  qr?: string;
  phone?: string;
}

export interface IncomingMessage {
  from: string;
  content: string;
  timestamp: Date;
  messageId: string;
}

export interface OutgoingMessage {
  to: string;
  content: string;
}
