import { describe, it, expect, beforeEach, vi } from "vitest";
import { resolveMode } from "@/lib/whatsapp/adapter";
import { mockAdapter, resetMockState } from "@/lib/whatsapp/mock-adapter";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    settings: { upsert: vi.fn().mockResolvedValue({}) },
    contact: {
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: "c1", phone: "+201234567890" }),
      update: vi.fn().mockResolvedValue({}),
    },
    autoReplyRule: { findMany: vi.fn().mockResolvedValue([]) },
    message: { create: vi.fn().mockResolvedValue({}) },
  },
}));

describe("WhatsApp adapter", () => {
  beforeEach(() => {
    resetMockState();
    delete process.env.WHATSAPP_MODE;
  });

  describe("resolveMode", () => {
    it("defaults to baileys when env unset", () => {
      expect(resolveMode()).toBe("baileys");
    });

    it("returns mock when WHATSAPP_MODE=mock", () => {
      process.env.WHATSAPP_MODE = "mock";
      expect(resolveMode()).toBe("mock");
    });

    it("returns cloud_api when set", () => {
      process.env.WHATSAPP_MODE = "cloud_api";
      expect(resolveMode()).toBe("cloud_api");
    });

    it("falls back to baileys on unknown values", () => {
      process.env.WHATSAPP_MODE = "garbage";
      expect(resolveMode()).toBe("baileys");
    });

    it("is case-insensitive", () => {
      process.env.WHATSAPP_MODE = "MOCK";
      expect(resolveMode()).toBe("mock");
    });
  });

  describe("mockAdapter", () => {
    it("starts disconnected", async () => {
      const status = await mockAdapter.getStatus();
      expect(status.connected).toBe(false);
    });

    it("connects and disconnects", async () => {
      await mockAdapter.connect();
      expect((await mockAdapter.getStatus()).connected).toBe(true);
      await mockAdapter.disconnect();
      expect((await mockAdapter.getStatus()).connected).toBe(false);
    });

    it("rejects sendMessage when disconnected", async () => {
      const ok = await mockAdapter.sendMessage("+201234567890", "hi");
      expect(ok).toBe(false);
    });

    it("accepts sendMessage when connected", async () => {
      await mockAdapter.connect();
      const ok = await mockAdapter.sendMessage("+201234567890", "hi");
      expect(ok).toBe(true);
    });
  });
});
