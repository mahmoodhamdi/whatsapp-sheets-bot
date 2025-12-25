# Phase C: Complete Translations

## Overview
إكمال ترجمة جميع النصوص المتبقية في المشروع.

## Current Issues

### 1. Settings Page
**File:** `src/app/(dashboard)/dashboard/settings/page.tsx`

**Hardcoded strings:**
- "General settings for your WhatsApp bot"
- "Working Hours" (if exists)
- Card descriptions

### 2. WhatsApp Settings Page
**File:** `src/app/(dashboard)/dashboard/settings/whatsapp/page.tsx`

**Hardcoded strings:**
- "Manage your WhatsApp connection"
- Status descriptions
- Button labels (some)

### 3. Google Sheets Settings Page
**File:** `src/app/(dashboard)/dashboard/settings/sheets/page.tsx`

**Hardcoded strings:**
- "Sync your data with Google Sheets"
- Setup instructions
- Table headers in logs

## Tasks

### Task 1: Audit All Pages for Hardcoded Strings
**Files to check:**
- `src/app/(dashboard)/dashboard/settings/page.tsx`
- `src/app/(dashboard)/dashboard/settings/whatsapp/page.tsx`
- `src/app/(dashboard)/dashboard/settings/sheets/page.tsx`
- `src/app/(dashboard)/dashboard/contacts/page.tsx`
- `src/app/(dashboard)/dashboard/messages/page.tsx`
- `src/app/(dashboard)/dashboard/rules/page.tsx`
- `src/components/rules/RuleForm.tsx`

### Task 2: Update Translation Files

**File:** `messages/en.json`
```json
{
  "settings": {
    "title": "Settings",
    "general": "General",
    "generalDescription": "General settings for your WhatsApp bot",
    "businessName": "Business Name",
    "businessNamePlaceholder": "Enter your business name",
    "defaultReply": "Default Reply",
    "defaultReplyDescription": "This message will be sent when no rule matches",
    "workingHours": "Working Hours",
    "saveChanges": "Save Changes",
    "saving": "Saving...",
    "saveSuccess": "Settings saved successfully",
    "saveFailed": "Failed to save settings"
  },
  "whatsapp": {
    "title": "WhatsApp",
    "description": "Manage your WhatsApp connection",
    "status": "Connection Status",
    "connected": "Connected",
    "disconnected": "Disconnected",
    "connecting": "Connecting...",
    "connect": "Connect",
    "disconnect": "Disconnect",
    "scanQR": "Scan this QR code with WhatsApp",
    "waitingForQR": "Waiting for QR code...",
    "connectionSuccess": "WhatsApp connected successfully",
    "connectionFailed": "Failed to connect WhatsApp",
    "disconnectSuccess": "WhatsApp disconnected",
    "disconnectFailed": "Failed to disconnect WhatsApp"
  },
  "sheets": {
    "title": "Google Sheets",
    "description": "Sync your data with Google Sheets",
    "status": "Connection Status",
    "connected": "Connected",
    "notConfigured": "Not Configured",
    "sheetId": "Sheet ID",
    "syncNow": "Sync Now",
    "syncing": "Syncing...",
    "lastSync": "Last Sync",
    "syncLogs": "Sync Logs",
    "syncSuccess": "Data synced successfully",
    "syncFailed": "Failed to sync data",
    "noLogs": "No sync logs yet",
    "setupInstructions": "Setup Instructions",
    "step1": "Create a Google Cloud project",
    "step2": "Enable Google Sheets API",
    "step3": "Create a service account",
    "step4": "Share your sheet with the service account email",
    "step5": "Add credentials to environment variables"
  }
}
```

**File:** `messages/ar.json`
```json
{
  "settings": {
    "title": "الإعدادات",
    "general": "عام",
    "generalDescription": "الإعدادات العامة لبوت الواتساب",
    "businessName": "اسم النشاط التجاري",
    "businessNamePlaceholder": "أدخل اسم نشاطك التجاري",
    "defaultReply": "الرد الافتراضي",
    "defaultReplyDescription": "سيتم إرسال هذه الرسالة عندما لا تتطابق أي قاعدة",
    "workingHours": "ساعات العمل",
    "saveChanges": "حفظ التغييرات",
    "saving": "جاري الحفظ...",
    "saveSuccess": "تم حفظ الإعدادات بنجاح",
    "saveFailed": "فشل في حفظ الإعدادات"
  },
  "whatsapp": {
    "title": "واتساب",
    "description": "إدارة اتصال الواتساب",
    "status": "حالة الاتصال",
    "connected": "متصل",
    "disconnected": "غير متصل",
    "connecting": "جاري الاتصال...",
    "connect": "اتصال",
    "disconnect": "قطع الاتصال",
    "scanQR": "امسح رمز QR بواتساب",
    "waitingForQR": "في انتظار رمز QR...",
    "connectionSuccess": "تم الاتصال بواتساب بنجاح",
    "connectionFailed": "فشل الاتصال بواتساب",
    "disconnectSuccess": "تم قطع الاتصال بواتساب",
    "disconnectFailed": "فشل قطع الاتصال بواتساب"
  },
  "sheets": {
    "title": "جوجل شيت",
    "description": "مزامنة بياناتك مع جوجل شيت",
    "status": "حالة الاتصال",
    "connected": "متصل",
    "notConfigured": "غير مُعد",
    "sheetId": "معرف الجدول",
    "syncNow": "مزامنة الآن",
    "syncing": "جاري المزامنة...",
    "lastSync": "آخر مزامنة",
    "syncLogs": "سجل المزامنة",
    "syncSuccess": "تمت مزامنة البيانات بنجاح",
    "syncFailed": "فشل في مزامنة البيانات",
    "noLogs": "لا توجد سجلات مزامنة",
    "setupInstructions": "تعليمات الإعداد",
    "step1": "أنشئ مشروع Google Cloud",
    "step2": "فعّل Google Sheets API",
    "step3": "أنشئ حساب خدمة",
    "step4": "شارك الجدول مع إيميل حساب الخدمة",
    "step5": "أضف بيانات الاعتماد لمتغيرات البيئة"
  }
}
```

### Task 3: Update Components to Use Translations

**For each page:**
1. Import `useTranslations`
2. Replace hardcoded strings with `t('key')`
3. Test RTL layout

### Task 4: Verify All Translations

**Checklist:**
- [ ] Settings page - all strings translated
- [ ] WhatsApp settings - all strings translated
- [ ] Google Sheets settings - all strings translated
- [ ] Error messages translated
- [ ] Success messages translated
- [ ] Button labels translated
- [ ] Placeholder texts translated

## Validation

1. Switch to Arabic and verify all text is in Arabic
2. Switch to English and verify all text is in English
3. Verify RTL layout is correct for Arabic
4. Run `npm run build` to check for missing keys
5. No console warnings about missing translations

## Files to Modify

| File | Action |
|------|--------|
| `messages/en.json` | Add missing keys |
| `messages/ar.json` | Add missing keys |
| `src/app/(dashboard)/dashboard/settings/page.tsx` | Use translations |
| `src/app/(dashboard)/dashboard/settings/whatsapp/page.tsx` | Use translations |
| `src/app/(dashboard)/dashboard/settings/sheets/page.tsx` | Use translations |

---

## Prompt for Claude

```
اشتغل على Phase C من الخطة - Complete Translations.

المطلوب:
1. افتح ملفات الترجمة وشوف الـ keys الموجودة
2. افتح صفحات Settings و WhatsApp و Sheets
3. حدد كل الـ hardcoded strings
4. أضف الـ keys الناقصة لملفات الترجمة (EN و AR)
5. حدث الـ components تستخدم useTranslations
6. تأكد إن RTL شغال صح للعربي

لما تخلص:
- شغل npm run build
- أعطيني قائمة بكل الـ keys اللي أضفتها
- أعطيني screenshot أو وصف للتغييرات
```
