/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    contact: {
      findMany: vi.fn(),
    },
    message: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
    syncLog: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

// Mock getSheetsClient
vi.mock("@/lib/google-sheets/client", () => ({
  getSheetsClient: vi.fn(),
}));

import { syncContacts, syncMessages, syncAll, getSyncLogs } from "@/lib/google-sheets/sync";
import { prisma } from "@/lib/prisma";
import { getSheetsClient } from "@/lib/google-sheets/client";

describe("syncContacts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_SHEET_ID = "test-sheet-id";
  });

  it("should return success false if no client", async () => {
    vi.mocked(getSheetsClient).mockResolvedValue(null);

    const result = await syncContacts();

    expect(result).toEqual({ success: false, count: 0 });
  });

  it("should return success false if no sheet ID", async () => {
    delete process.env.GOOGLE_SHEET_ID;
    vi.mocked(getSheetsClient).mockResolvedValue({} as any);

    const result = await syncContacts();

    expect(result).toEqual({ success: false, count: 0 });
  });

  it("should sync contacts to sheet", async () => {
    const mockContacts = [
      {
        id: "1",
        phone: "+1234567890",
        name: "Test Contact",
        firstContact: new Date("2024-01-01"),
        lastContact: new Date("2024-01-15"),
        messageCount: 5,
      },
    ];

    const mockUpdate = vi.fn().mockResolvedValue({});
    vi.mocked(getSheetsClient).mockResolvedValue({
      spreadsheets: {
        values: {
          update: mockUpdate,
        },
      },
    } as any);
    vi.mocked(prisma.contact.findMany).mockResolvedValue(mockContacts as any);
    vi.mocked(prisma.syncLog.create).mockResolvedValue({} as any);

    const result = await syncContacts();

    expect(result).toEqual({ success: true, count: 1 });
    expect(mockUpdate).toHaveBeenCalledWith({
      spreadsheetId: "test-sheet-id",
      range: "Contacts!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          ["Phone", "Name", "First Contact", "Last Contact", "Message Count"],
          [
            "+1234567890",
            "Test Contact",
            "2024-01-01T00:00:00.000Z",
            "2024-01-15T00:00:00.000Z",
            "5",
          ],
        ],
      },
    });
  });

  it("should log sync event on success", async () => {
    const mockContacts: any[] = [];
    const mockUpdate = vi.fn().mockResolvedValue({});
    vi.mocked(getSheetsClient).mockResolvedValue({
      spreadsheets: {
        values: {
          update: mockUpdate,
        },
      },
    } as any);
    vi.mocked(prisma.contact.findMany).mockResolvedValue(mockContacts);
    vi.mocked(prisma.syncLog.create).mockResolvedValue({} as any);

    await syncContacts();

    expect(prisma.syncLog.create).toHaveBeenCalledWith({
      data: {
        type: "GOOGLE_SHEETS",
        status: "SUCCESS",
        details: "Synced 0 contacts",
      },
    });
  });

  it("should log sync event on failure", async () => {
    const mockUpdate = vi.fn().mockRejectedValue(new Error("API Error"));
    vi.mocked(getSheetsClient).mockResolvedValue({
      spreadsheets: {
        values: {
          update: mockUpdate,
        },
      },
    } as any);
    vi.mocked(prisma.contact.findMany).mockResolvedValue([]);
    vi.mocked(prisma.syncLog.create).mockResolvedValue({} as any);

    const result = await syncContacts();

    expect(result).toEqual({ success: false, count: 0 });
    expect(prisma.syncLog.create).toHaveBeenCalledWith({
      data: {
        type: "GOOGLE_SHEETS",
        status: "FAILED",
        details: "Error: API Error",
      },
    });
  });
});

describe("syncMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_SHEET_ID = "test-sheet-id";
  });

  it("should return success false if no client", async () => {
    vi.mocked(getSheetsClient).mockResolvedValue(null);

    const result = await syncMessages();

    expect(result).toEqual({ success: false, count: 0 });
  });

  it("should return count 0 if no unsynced messages", async () => {
    const mockAppend = vi.fn().mockResolvedValue({});
    const mockGet = vi.fn().mockResolvedValue({ data: { values: [["Header"]] } });
    vi.mocked(getSheetsClient).mockResolvedValue({
      spreadsheets: {
        values: {
          append: mockAppend,
          get: mockGet,
        },
      },
    } as any);
    vi.mocked(prisma.message.findMany).mockResolvedValue([]);

    const result = await syncMessages();

    expect(result).toEqual({ success: true, count: 0 });
    expect(mockAppend).not.toHaveBeenCalled();
  });

  it("should sync only unsynced messages", async () => {
    const mockMessages = [
      {
        id: "msg-1",
        content: "Hello",
        direction: "INCOMING",
        status: "RECEIVED",
        syncedToSheets: false,
        createdAt: new Date("2024-01-15"),
        contact: { phone: "+1234567890" },
        rule: { name: "Greeting" },
      },
    ];

    const mockAppend = vi.fn().mockResolvedValue({});
    const mockGet = vi.fn().mockResolvedValue({ data: { values: [["Header"]] } });
    vi.mocked(getSheetsClient).mockResolvedValue({
      spreadsheets: {
        values: {
          append: mockAppend,
          get: mockGet,
        },
      },
    } as any);
    vi.mocked(prisma.message.findMany).mockResolvedValue(mockMessages as any);
    vi.mocked(prisma.message.updateMany).mockResolvedValue({ count: 1 });
    vi.mocked(prisma.syncLog.create).mockResolvedValue({} as any);

    const result = await syncMessages();

    expect(result).toEqual({ success: true, count: 1 });
    expect(prisma.message.findMany).toHaveBeenCalledWith({
      where: { syncedToSheets: false },
      include: { contact: true, rule: true },
      orderBy: { createdAt: "desc" },
      take: 1000,
    });
  });

  it("should mark messages as synced after sync", async () => {
    const mockMessages = [
      {
        id: "msg-1",
        content: "Hello",
        direction: "INCOMING",
        status: "RECEIVED",
        createdAt: new Date("2024-01-15"),
        contact: { phone: "+1234567890" },
        rule: null,
      },
    ];

    const mockAppend = vi.fn().mockResolvedValue({});
    const mockGet = vi.fn().mockResolvedValue({ data: { values: [["Header"]] } });
    vi.mocked(getSheetsClient).mockResolvedValue({
      spreadsheets: {
        values: {
          append: mockAppend,
          get: mockGet,
        },
      },
    } as any);
    vi.mocked(prisma.message.findMany).mockResolvedValue(mockMessages as any);
    vi.mocked(prisma.message.updateMany).mockResolvedValue({ count: 1 });
    vi.mocked(prisma.syncLog.create).mockResolvedValue({} as any);

    await syncMessages();

    expect(prisma.message.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ["msg-1"] } },
      data: { syncedToSheets: true },
    });
  });

  it("should create header if sheet is empty", async () => {
    const mockMessages = [
      {
        id: "msg-1",
        content: "Hello",
        direction: "INCOMING",
        status: "RECEIVED",
        createdAt: new Date("2024-01-15"),
        contact: { phone: "+1234567890" },
        rule: null,
      },
    ];

    const mockAppend = vi.fn().mockResolvedValue({});
    const mockGet = vi.fn().mockResolvedValue({ data: { values: null } }); // No header
    vi.mocked(getSheetsClient).mockResolvedValue({
      spreadsheets: {
        values: {
          append: mockAppend,
          get: mockGet,
        },
      },
    } as any);
    vi.mocked(prisma.message.findMany).mockResolvedValue(mockMessages as any);
    vi.mocked(prisma.message.updateMany).mockResolvedValue({ count: 1 });
    vi.mocked(prisma.syncLog.create).mockResolvedValue({} as any);

    await syncMessages();

    const appendCall = mockAppend.mock.calls[0][0];
    expect(appendCall.requestBody.values[0]).toEqual([
      "Timestamp",
      "Phone",
      "Direction",
      "Content",
      "Rule Used",
      "Status",
    ]);
  });

  it("should append without header if sheet has data", async () => {
    const mockMessages = [
      {
        id: "msg-1",
        content: "Hello",
        direction: "INCOMING",
        status: "RECEIVED",
        createdAt: new Date("2024-01-15"),
        contact: { phone: "+1234567890" },
        rule: null,
      },
    ];

    const mockAppend = vi.fn().mockResolvedValue({});
    const mockGet = vi.fn().mockResolvedValue({
      data: { values: [["Timestamp", "Phone", "Direction"]] },
    });
    vi.mocked(getSheetsClient).mockResolvedValue({
      spreadsheets: {
        values: {
          append: mockAppend,
          get: mockGet,
        },
      },
    } as any);
    vi.mocked(prisma.message.findMany).mockResolvedValue(mockMessages as any);
    vi.mocked(prisma.message.updateMany).mockResolvedValue({ count: 1 });
    vi.mocked(prisma.syncLog.create).mockResolvedValue({} as any);

    await syncMessages();

    const appendCall = mockAppend.mock.calls[0][0];
    // Should NOT have header as first row
    expect(appendCall.requestBody.values[0]).not.toEqual([
      "Timestamp",
      "Phone",
      "Direction",
      "Content",
      "Rule Used",
      "Status",
    ]);
  });
});

describe("syncAll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_SHEET_ID = "test-sheet-id";
  });

  it("should call both sync functions", async () => {
    const mockClient = {
      spreadsheets: {
        values: {
          update: vi.fn().mockResolvedValue({}),
          append: vi.fn().mockResolvedValue({}),
          get: vi.fn().mockResolvedValue({ data: { values: [["Header"]] } }),
        },
      },
    };
    vi.mocked(getSheetsClient).mockResolvedValue(mockClient as any);
    vi.mocked(prisma.contact.findMany).mockResolvedValue([]);
    vi.mocked(prisma.message.findMany).mockResolvedValue([]);
    vi.mocked(prisma.syncLog.create).mockResolvedValue({} as any);

    const result = await syncAll();

    expect(prisma.contact.findMany).toHaveBeenCalled();
    expect(prisma.message.findMany).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      contacts: 0,
      messages: 0,
    });
  });

  it("should return combined results", async () => {
    const mockContacts = [
      {
        id: "1",
        phone: "+1234567890",
        name: "Test",
        firstContact: new Date(),
        lastContact: new Date(),
        messageCount: 1,
      },
    ];
    const mockMessages = [
      {
        id: "msg-1",
        content: "Hello",
        direction: "INCOMING",
        status: "RECEIVED",
        createdAt: new Date(),
        contact: { phone: "+1234567890" },
        rule: null,
      },
      {
        id: "msg-2",
        content: "Hi",
        direction: "OUTGOING",
        status: "SENT",
        createdAt: new Date(),
        contact: { phone: "+1234567890" },
        rule: null,
      },
    ];

    const mockClient = {
      spreadsheets: {
        values: {
          update: vi.fn().mockResolvedValue({}),
          append: vi.fn().mockResolvedValue({}),
          get: vi.fn().mockResolvedValue({ data: { values: [["Header"]] } }),
        },
      },
    };
    vi.mocked(getSheetsClient).mockResolvedValue(mockClient as any);
    vi.mocked(prisma.contact.findMany).mockResolvedValue(mockContacts as any);
    vi.mocked(prisma.message.findMany).mockResolvedValue(mockMessages as any);
    vi.mocked(prisma.message.updateMany).mockResolvedValue({ count: 2 });
    vi.mocked(prisma.syncLog.create).mockResolvedValue({} as any);

    const result = await syncAll();

    expect(result).toEqual({
      success: true,
      contacts: 1,
      messages: 2,
    });
  });
});

describe("getSyncLogs", () => {
  it("should return sync logs with default limit", async () => {
    const mockLogs = [
      { id: "1", type: "GOOGLE_SHEETS", status: "SUCCESS", createdAt: new Date() },
    ];
    vi.mocked(prisma.syncLog.findMany).mockResolvedValue(mockLogs as any);

    const result = await getSyncLogs();

    expect(result).toEqual(mockLogs);
    expect(prisma.syncLog.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  });

  it("should respect custom limit", async () => {
    vi.mocked(prisma.syncLog.findMany).mockResolvedValue([]);

    await getSyncLogs(5);

    expect(prisma.syncLog.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  });
});
