import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Baileys module
const mockSendMessage = vi.fn();
const mockLogout = vi.fn();
const mockSocket = {
  ev: {
    on: vi.fn(),
  },
  sendMessage: mockSendMessage,
  logout: mockLogout,
};

vi.mock("@whiskeysockets/baileys", () => ({
  default: vi.fn(() => mockSocket),
  useMultiFileAuthState: vi.fn().mockResolvedValue({
    state: {},
    saveCreds: vi.fn(),
  }),
  DisconnectReason: { loggedOut: 401 },
}));

// Mock usage service
vi.mock("@/lib/services/usage", () => ({
  canSendMessage: vi.fn().mockResolvedValue(true),
  incrementMessageCount: vi.fn().mockResolvedValue(undefined),
}));

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    settings: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    contact: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    message: {
      create: vi.fn(),
    },
    autoReplyRule: {
      findMany: vi.fn(),
    },
    subscription: {
      findFirst: vi.fn(),
    },
    user: {
      findFirst: vi.fn(),
    },
  },
}));

// Import after mocking
import {
  isConnected,
  getStatus,
  addQRListener,
  getSocket,
} from "@/lib/whatsapp/client";
import { prisma } from "@/lib/prisma";

describe("WhatsApp Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isConnected", () => {
    it("should return false when not connected", () => {
      // Initially not connected
      expect(isConnected()).toBe(false);
    });
  });

  describe("getStatus", () => {
    it("should return status from database", async () => {
      vi.mocked(prisma.settings.findUnique).mockResolvedValue({
        id: "default",
        whatsappConnected: true,
        googleSheetsId: null,
        defaultReply: "Test",
        businessName: "Test",
        workingHours: null,
      });

      const status = await getStatus();
      expect(status.connected).toBe(true);
    });

    it("should return false when no settings exist", async () => {
      vi.mocked(prisma.settings.findUnique).mockResolvedValue(null);

      const status = await getStatus();
      expect(status.connected).toBe(false);
    });

    it("should return undefined qr when not connecting", async () => {
      vi.mocked(prisma.settings.findUnique).mockResolvedValue({
        id: "default",
        whatsappConnected: false,
        googleSheetsId: null,
        defaultReply: null,
        businessName: null,
        workingHours: null,
      });

      const status = await getStatus();
      expect(status.qr).toBeUndefined();
    });
  });

  describe("addQRListener", () => {
    it("should add listener and return cleanup function", () => {
      const listener = vi.fn();
      const cleanup = addQRListener(listener);

      expect(typeof cleanup).toBe("function");

      // Cleanup should not throw
      cleanup();
    });

    it("should allow multiple listeners", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      const cleanup1 = addQRListener(listener1);
      const cleanup2 = addQRListener(listener2);

      // Clean up
      cleanup1();
      cleanup2();
    });
  });

  describe("getSocket", () => {
    it("should return null when not connected", () => {
      // Before connection, socket should be null
      const socket = getSocket();
      expect(socket).toBeNull();
    });
  });

  describe("Database Interactions", () => {
    it("should query settings table for status", async () => {
      vi.mocked(prisma.settings.findUnique).mockResolvedValue(null);

      await getStatus();

      expect(prisma.settings.findUnique).toHaveBeenCalledWith({
        where: { id: "default" },
      });
    });
  });
});

describe("WhatsApp Types", () => {
  it("should export WhatsAppStatus type structure", async () => {
    vi.mocked(prisma.settings.findUnique).mockResolvedValue({
      id: "default",
      whatsappConnected: true,
      googleSheetsId: null,
      defaultReply: null,
      businessName: null,
      workingHours: null,
    });

    const status = await getStatus();

    // Type check - status should have connected property
    expect(typeof status.connected).toBe("boolean");

    // qr should be undefined or string
    expect(status.qr === undefined || typeof status.qr === "string").toBe(true);
  });
});
