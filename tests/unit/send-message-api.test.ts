/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock modules before importing
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contact: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    message: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/whatsapp/client", () => ({
  isConnected: vi.fn(),
  sendMessageRaw: vi.fn(),
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isConnected, sendMessageRaw } from "@/lib/whatsapp/client";

// Helper to create mock request
function createMockRequest(body: object): Request {
  return {
    json: () => Promise.resolve(body),
  } as Request;
}

describe("Send Message API Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should require authentication", async () => {
      vi.mocked(auth).mockResolvedValue(null);

      // Import the route handler
      const { POST } = await import("@/app/api/messages/send/route");
      const request = createMockRequest({ phone: "1234567890", content: "Hello" });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("WhatsApp Connection Check", () => {
    it("should fail if WhatsApp is not connected", async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
      vi.mocked(isConnected).mockReturnValue(false);

      const { POST } = await import("@/app/api/messages/send/route");
      const request = createMockRequest({ phone: "1234567890", content: "Hello" });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.code).toBe("WHATSAPP_NOT_CONNECTED");
    });
  });

  describe("Input Validation", () => {
    it("should validate phone number", async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
      vi.mocked(isConnected).mockReturnValue(true);

      const { POST } = await import("@/app/api/messages/send/route");
      const request = createMockRequest({ phone: "123", content: "Hello" });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid request");
    });

    it("should validate content is not empty", async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
      vi.mocked(isConnected).mockReturnValue(true);

      const { POST } = await import("@/app/api/messages/send/route");
      const request = createMockRequest({ phone: "1234567890", content: "" });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid request");
    });
  });

  describe("Message Sending", () => {
    it("should create contact if not exists", async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
      vi.mocked(isConnected).mockReturnValue(true);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.contact.create).mockResolvedValue({
        id: "contact-1",
        phone: "1234567890",
        name: null,
        firstContact: new Date(),
        lastContact: new Date(),
        messageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(prisma.message.create).mockResolvedValue({
        id: "msg-1",
        contactId: "contact-1",
        direction: "OUTGOING",
        content: "Hello",
        status: "PENDING",
        ruleId: null,
        syncedToSheets: false,
        createdAt: new Date(),
        contact: { phone: "1234567890" },
      } as any);
      vi.mocked(prisma.message.update).mockResolvedValue({
        id: "msg-1",
        contactId: "contact-1",
        direction: "OUTGOING",
        content: "Hello",
        status: "SENT",
        ruleId: null,
        syncedToSheets: false,
        createdAt: new Date(),
        contact: { phone: "1234567890" },
      } as any);
      vi.mocked(sendMessageRaw).mockResolvedValue(true);
      vi.mocked(prisma.contact.update).mockResolvedValue({} as any);

      const { POST } = await import("@/app/api/messages/send/route");
      const request = createMockRequest({ phone: "1234567890", content: "Hello" });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.contact.create).toHaveBeenCalled();
    });

    it("should update message status to FAILED when send fails", async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
      vi.mocked(isConnected).mockReturnValue(true);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue({
        id: "contact-1",
        phone: "1234567890",
        name: null,
        firstContact: new Date(),
        lastContact: new Date(),
        messageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(prisma.message.create).mockResolvedValue({
        id: "msg-1",
        contactId: "contact-1",
        direction: "OUTGOING",
        content: "Hello",
        status: "PENDING",
        ruleId: null,
        syncedToSheets: false,
        createdAt: new Date(),
        contact: { phone: "1234567890" },
      } as any);
      vi.mocked(prisma.message.update).mockResolvedValue({
        id: "msg-1",
        contactId: "contact-1",
        direction: "OUTGOING",
        content: "Hello",
        status: "FAILED",
        ruleId: null,
        syncedToSheets: false,
        createdAt: new Date(),
        contact: { phone: "1234567890" },
      } as any);
      vi.mocked(sendMessageRaw).mockResolvedValue(false);

      const { POST } = await import("@/app/api/messages/send/route");
      const request = createMockRequest({ phone: "1234567890", content: "Hello" });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Failed to send message");
      expect(prisma.message.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: "FAILED" },
        })
      );
    });

    it("should not update contact stats when send fails", async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
      vi.mocked(isConnected).mockReturnValue(true);
      vi.mocked(prisma.contact.findUnique).mockResolvedValue({
        id: "contact-1",
        phone: "1234567890",
        name: null,
        firstContact: new Date(),
        lastContact: new Date(),
        messageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(prisma.message.create).mockResolvedValue({
        id: "msg-1",
        contactId: "contact-1",
        direction: "OUTGOING",
        content: "Hello",
        status: "PENDING",
        ruleId: null,
        syncedToSheets: false,
        createdAt: new Date(),
        contact: { phone: "1234567890" },
      } as any);
      vi.mocked(prisma.message.update).mockResolvedValue({
        id: "msg-1",
        status: "FAILED",
        contact: { phone: "1234567890" },
      } as any);
      vi.mocked(sendMessageRaw).mockResolvedValue(false);

      const { POST } = await import("@/app/api/messages/send/route");
      const request = createMockRequest({ phone: "1234567890", content: "Hello" });

      await POST(request as any);

      // Contact update should NOT have been called since send failed
      expect(prisma.contact.update).not.toHaveBeenCalled();
    });
  });
});
