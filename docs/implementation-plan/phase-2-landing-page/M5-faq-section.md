# Milestone 2.5: FAQ Section

> **Phase:** 2 - Landing Page Sections
> **Status:** ✅ Complete
> **Last Updated:** 2025-12-26
> **Depends On:** M4-testimonials-section.md

## Objective

Create an FAQ section to address common questions and reduce support burden.

---

## Design Specifications

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                    الأسئلة الشائعة                          │
│              إجابات على أكثر الأسئلة شيوعاً                  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ▶ كيف أبدأ باستخدام البوت؟                          │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  ▶ هل البوت يعمل على مدار الساعة؟                   │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  ▼ كيف تتم مزامنة البيانات مع جوجل شيتس؟            │    │
│  │    تتم المزامنة تلقائياً كل دقيقة...                │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  ▶ هل يمكنني تخصيص الردود؟                         │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  ▶ ما هي طرق الدفع المتاحة؟                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│           لم تجد إجابتك؟ [تواصل مع الدعم]                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### FAQ Categories
1. **Getting Started** - Setup, connection, first steps
2. **Features** - Auto-reply, sheets sync, analytics
3. **Billing** - Plans, payments, cancellation
4. **Technical** - Integration, API, troubleshooting

### Visual Style
- Accordion-style expandable items
- Clean dividers
- Contact support CTA at bottom
- Two-column layout on desktop (optional)

---

## Implementation Checklist

### 1. Create FAQ Section Component
- [x] Create `src/components/marketing/sections/FAQSection.tsx`
- [x] Use FAQAccordion component
- [x] Add support CTA

### 2. Define FAQ Data
- [x] Create FAQ questions array
- [x] Add Arabic content
- [x] Add English content
- [ ] Organize by category (optional - skipped)

### 3. Add Contact Support CTA
- [x] Link to support/contact page
- [x] Or mailto link
- [x] Style as secondary action

### 4. Testing
- [x] Test accordion expand/collapse
- [x] Test keyboard navigation
- [x] Test RTL layout

---

## Code Template

### FAQSection Component
```typescript
import { getTranslations } from "next-intl/server";
import { Section, SectionHeader, FAQAccordion } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

export async function FAQSection() {
  const t = await getTranslations("landing.faq");

  // FAQ items from translations
  const faqItems = [
    { question: t("items.0.question"), answer: t("items.0.answer") },
    { question: t("items.1.question"), answer: t("items.1.answer") },
    { question: t("items.2.question"), answer: t("items.2.answer") },
    { question: t("items.3.question"), answer: t("items.3.answer") },
    { question: t("items.4.question"), answer: t("items.4.answer") },
    { question: t("items.5.question"), answer: t("items.5.answer") },
  ];

  return (
    <Section id="faq">
      <SectionHeader
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="max-w-3xl mx-auto">
        <FAQAccordion items={faqItems} />

        {/* Contact Support CTA */}
        <div className="mt-12 text-center p-6 rounded-xl bg-muted/50">
          <p className="text-muted-foreground mb-4">
            {t("notFound")}
          </p>
          <Button variant="outline" asChild>
            <Link href="mailto:support@whatsappbot.com">
              <Mail className="me-2 h-4 w-4" />
              {t("contactSupport")}
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
```

---

## Translation Content

### Arabic FAQ (`messages/ar.json`)
```json
{
  "landing": {
    "faq": {
      "title": "الأسئلة الشائعة",
      "subtitle": "إجابات على أكثر الأسئلة شيوعاً",
      "notFound": "لم تجد إجابة لسؤالك؟",
      "contactSupport": "تواصل مع الدعم",
      "items": [
        {
          "question": "كيف أبدأ باستخدام البوت؟",
          "answer": "بعد إنشاء حسابك، قم بربط رقم الواتساب عبر مسح رمز QR من لوحة التحكم. ثم أنشئ قواعد الرد التلقائي وستكون جاهزاً للعمل خلال دقائق."
        },
        {
          "question": "هل البوت يعمل على مدار الساعة؟",
          "answer": "نعم، البوت يعمل 24/7. كما يمكنك تحديد ساعات عمل محددة وتخصيص رسالة للأوقات خارج الدوام."
        },
        {
          "question": "كيف تتم مزامنة البيانات مع جوجل شيتس؟",
          "answer": "تتم المزامنة تلقائياً. كل رسالة واردة وصادرة تُحفظ في جوجل شيتس مع بيانات المرسل والوقت. يمكنك الوصول للبيانات في أي وقت."
        },
        {
          "question": "هل يمكنني تخصيص الردود؟",
          "answer": "نعم، يمكنك إنشاء قواعد رد غير محدودة بناءً على كلمات مفتاحية، عبارات، أو حتى أنماط معقدة باستخدام التعبيرات النمطية (Regex)."
        },
        {
          "question": "ما هي طرق الدفع المتاحة؟",
          "answer": "نقبل بطاقات الائتمان الرئيسية (فيزا، ماستركارد) ومدى. للشركات والخطط المؤسسية، نقبل التحويل البنكي."
        },
        {
          "question": "هل يمكنني إلغاء اشتراكي في أي وقت؟",
          "answer": "نعم، جميع خططنا بدون عقود طويلة الأمد. يمكنك الإلغاء من إعدادات حسابك وستستمر في استخدام الخدمة حتى نهاية فترة الفوترة الحالية."
        }
      ]
    }
  }
}
```

### English FAQ (`messages/en.json`)
```json
{
  "landing": {
    "faq": {
      "title": "Frequently Asked Questions",
      "subtitle": "Answers to the most common questions",
      "notFound": "Didn't find your answer?",
      "contactSupport": "Contact Support",
      "items": [
        {
          "question": "How do I get started with the bot?",
          "answer": "After creating your account, connect your WhatsApp number by scanning the QR code from the dashboard. Then create auto-reply rules and you'll be ready in minutes."
        },
        {
          "question": "Does the bot work 24/7?",
          "answer": "Yes, the bot works around the clock. You can also set specific working hours and customize out-of-office messages."
        },
        {
          "question": "How does Google Sheets sync work?",
          "answer": "Sync happens automatically. Every incoming and outgoing message is saved to Google Sheets with sender info and timestamp. Access your data anytime."
        },
        {
          "question": "Can I customize the replies?",
          "answer": "Yes, you can create unlimited reply rules based on keywords, phrases, or even complex patterns using regular expressions (Regex)."
        },
        {
          "question": "What payment methods are available?",
          "answer": "We accept major credit cards (Visa, Mastercard) and Mada. For enterprise plans, we accept bank transfers."
        },
        {
          "question": "Can I cancel my subscription anytime?",
          "answer": "Yes, all our plans have no long-term contracts. You can cancel from your account settings and continue using the service until the end of the current billing period."
        }
      ]
    }
  }
}
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/marketing/sections/FAQSection.tsx` | CREATE | FAQ section |
| `src/components/marketing/sections/index.ts` | MODIFY | Add export |
| `src/app/(marketing)/page.tsx` | MODIFY | Add FAQSection |
| `messages/ar.json` | MODIFY | Add FAQ content |
| `messages/en.json` | MODIFY | Add FAQ content |

---

## Testing Instructions

```bash
# 1. Create FAQSection component

# 2. Add translation content

# 3. Update landing page

# 4. Start dev server
npm run dev

# 5. Test FAQ section
# - Click to expand/collapse items
# - Verify only one item open at a time
# - Test keyboard navigation (Enter, Space)
# - Check support link works

# 6. Test RTL
# - Expand arrow on correct side
# - Text alignment

# 7. Run tests
npm run lint
```

---

## Acceptance Criteria

- [x] 6+ FAQ items displayed
- [x] Accordion expand/collapse works
- [x] Only one item open at a time
- [x] Keyboard accessible
- [x] Contact support CTA visible
- [x] RTL layout correct
- [x] Dark mode works
- [x] Smooth animations
