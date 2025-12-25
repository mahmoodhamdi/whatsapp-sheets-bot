# Phase A: Fix Send Message API

## Overview
ربط API إرسال الرسائل مع WhatsApp client الفعلي.

## Current Problem
الملف `src/app/api/messages/send/route.ts` يحفظ الرسالة في DB لكن لا يرسلها فعلياً عبر WhatsApp.

```typescript
// TODO: Actually send via WhatsApp using Baileys
// This will be implemented in Phase 5
```

## Tasks

### Task 1: Update Send Message API
**File:** `src/app/api/messages/send/route.ts`

**Actions:**
1. Import `sendMessage` from `@/lib/whatsapp/client`
2. Import `getWhatsAppStatus` from `@/lib/whatsapp/client`
3. Check if WhatsApp is connected before sending
4. Call `sendMessage(phone, content)`
5. Update message status based on result
6. Handle errors properly

**Expected Code Flow:**
```typescript
// 1. Validate input
// 2. Check WhatsApp connection
// 3. Get or create contact
// 4. Create message in DB with status PENDING
// 5. Send via WhatsApp
// 6. Update message status to SENT or FAILED
// 7. Return response
```

### Task 2: Add Translation Keys
**Files:**
- `messages/en.json`
- `messages/ar.json`

**Keys to add:**
```json
{
  "messages": {
    "sendSuccess": "Message sent successfully",
    "sendFailed": "Failed to send message",
    "whatsappNotConnected": "WhatsApp is not connected"
  }
}
```

### Task 3: Update WhatsApp Client Export
**File:** `src/lib/whatsapp/client.ts`

**Ensure exports:**
- `sendMessage(phone: string, message: string): Promise<boolean>`
- `getWhatsAppStatus(): WhatsAppStatus`

### Task 4: Write Unit Test
**File:** `tests/unit/send-message.test.ts`

**Test cases:**
- Should fail if WhatsApp not connected
- Should create contact if not exists
- Should update message status on success
- Should handle send failure

## Validation

After implementation:
1. Run `npm run lint` - should pass
2. Run `npm run test` - should pass
3. Run `npm run build` - should pass
4. Manual test:
   - Connect WhatsApp from settings
   - Try sending message from Messages page
   - Verify message received on phone

## Files to Modify

| File | Action |
|------|--------|
| `src/app/api/messages/send/route.ts` | Update logic |
| `src/lib/whatsapp/client.ts` | Verify exports |
| `messages/en.json` | Add keys |
| `messages/ar.json` | Add keys |
| `tests/unit/send-message.test.ts` | Create |

---

## Prompt for Claude

```
اشتغل على Phase A من الخطة.

المطلوب:
1. افتح `src/app/api/messages/send/route.ts` واربطه مع WhatsApp client
2. تأكد إن sendMessage و getWhatsAppStatus متصدرين من client.ts
3. أضف translation keys للنجاح والفشل
4. اكتب unit test للـ API
5. شغل lint و test و build وتأكد كله passing

لما تخلص، ابعتلي تقرير بالتغييرات وأي مشاكل واجهتها.
```
