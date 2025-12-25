import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Baileys module
vi.mock("@whiskeysockets/baileys", () => ({
  default: vi.fn(),
  useMultiFileAuthState: vi.fn(),
  DisconnectReason: { loggedOut: 401 },
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
  },
}));

// Import after mocking
import { isConnected, getStatus } from "@/lib/whatsapp/client";
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
  });
});
