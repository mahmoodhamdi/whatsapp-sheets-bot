import { beforeEach, vi } from "vitest";

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Mock environment variables
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.GOOGLE_SHEET_ID = "test-sheet-id";
process.env.GOOGLE_SHEETS_CREDENTIALS = "eyJ0ZXN0IjoidGVzdCJ9"; // base64 of {"test":"test"}
process.env.AUTH_SECRET = "test-secret";
process.env.NEXTAUTH_URL = "http://localhost:3000";
