# Phase D: Unit Tests

## Overview
كتابة Unit Tests شاملة للـ functions والـ utilities.

## Current Status

**Existing Tests:**
- `tests/unit/matcher.test.ts` ✅ (Complete)

**Missing Tests:**
- Sync functions
- API route handlers (mocked)
- Utility functions

## Tasks

### Task 1: Sync Functions Tests
**File:** `tests/unit/sync.test.ts`

**Test cases:**
```typescript
describe('syncContacts', () => {
  it('should return success false if no client', async () => {});
  it('should return success false if no sheet ID', async () => {});
  it('should sync contacts to sheet', async () => {});
  it('should log sync event on success', async () => {});
  it('should log sync event on failure', async () => {});
});

describe('syncMessages', () => {
  it('should return count 0 if no unsynced messages', async () => {});
  it('should sync only unsynced messages', async () => {});
  it('should mark messages as synced after sync', async () => {});
  it('should create header if sheet is empty', async () => {});
  it('should append without header if sheet has data', async () => {});
});

describe('syncAll', () => {
  it('should call both sync functions', async () => {});
  it('should return combined results', async () => {});
});
```

**Mocking:**
```typescript
// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    contact: { findMany: vi.fn() },
    message: { findMany: vi.fn(), updateMany: vi.fn() },
    syncLog: { create: vi.fn() },
  },
}));

// Mock Google Sheets client
vi.mock('@/lib/google-sheets/client', () => ({
  getSheetsClient: vi.fn(),
}));
```

### Task 2: Auth Utilities Tests
**File:** `tests/unit/auth.test.ts`

**Test cases:**
```typescript
describe('auth configuration', () => {
  it('should have credentials provider', () => {});
  it('should reject invalid credentials', async () => {});
  it('should return user object on valid credentials', async () => {});
  it('should include role in JWT token', async () => {});
  it('should include role in session', async () => {});
});
```

### Task 3: API Routes Tests (Mocked)
**File:** `tests/unit/api-routes.test.ts`

**Test cases for `/api/contacts`:**
```typescript
describe('GET /api/contacts', () => {
  it('should return 401 if not authenticated', async () => {});
  it('should return paginated contacts', async () => {});
  it('should filter by search query', async () => {});
});

describe('DELETE /api/contacts/[id]', () => {
  it('should return 401 if not authenticated', async () => {});
  it('should return 404 if contact not found', async () => {});
  it('should delete contact', async () => {});
});
```

**Test cases for `/api/rules`:**
```typescript
describe('GET /api/rules', () => {
  it('should return all rules', async () => {});
  it('should filter by activeOnly', async () => {});
  it('should order by priority desc', async () => {});
});

describe('POST /api/rules', () => {
  it('should validate required fields', async () => {});
  it('should validate regex pattern', async () => {});
  it('should create rule', async () => {});
});

describe('PATCH /api/rules/[id]/toggle', () => {
  it('should toggle isActive', async () => {});
});
```

### Task 4: Utility Functions Tests
**File:** `tests/unit/utils.test.ts`

**Test cases:**
```typescript
describe('cn utility', () => {
  it('should merge class names', () => {});
  it('should handle conditional classes', () => {});
  it('should handle tailwind conflicts', () => {});
});
```

### Task 5: WhatsApp Client Tests
**File:** `tests/unit/whatsapp-client.test.ts`

**Test cases:**
```typescript
describe('getWhatsAppStatus', () => {
  it('should return disconnected initially', () => {});
  it('should return connected after connection', () => {});
  it('should return QR when available', () => {});
});

describe('sendMessage', () => {
  it('should fail if not connected', async () => {});
  it('should format phone number correctly', async () => {});
});
```

## Test Utilities Setup

**File:** `tests/setup.ts`
```typescript
import { beforeEach, vi } from 'vitest';

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test';
process.env.GOOGLE_SHEET_ID = 'test-sheet-id';
```

**Update:** `vitest.config.ts`
```typescript
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/e2e/**"],
    setupFiles: ["tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
  // ...
});
```

## Validation

1. Run `npm run test` - all tests should pass
2. Run `npm run test -- --coverage` - check coverage
3. Target: >80% coverage for tested files

## Files to Create/Modify

| File | Action |
|------|--------|
| `tests/setup.ts` | Create |
| `tests/unit/sync.test.ts` | Create |
| `tests/unit/auth.test.ts` | Create |
| `tests/unit/api-routes.test.ts` | Create |
| `tests/unit/utils.test.ts` | Create |
| `tests/unit/whatsapp-client.test.ts` | Create |
| `vitest.config.ts` | Update |

---

## Prompt for Claude

```
اشتغل على Phase D من الخطة - Unit Tests.

المطلوب:
1. أنشئ `tests/setup.ts` للـ global setup
2. أنشئ `tests/unit/sync.test.ts` - tests للـ sync functions
3. أنشئ `tests/unit/utils.test.ts` - tests للـ utility functions
4. أنشئ `tests/unit/api-routes.test.ts` - tests للـ API routes (mocked)
5. حدث `vitest.config.ts` لإضافة setupFiles

كل test file لازم:
- يستخدم vi.mock للـ dependencies
- يغطي happy path و error cases
- يكون readable و maintainable

لما تخلص:
- شغل npm run test
- أعطيني تقرير بعدد الـ tests
- أعطيني أي failures وإزاي تصلحها
```
