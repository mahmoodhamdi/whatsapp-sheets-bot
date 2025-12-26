# Milestone 2.4: Testimonials Section

> **Phase:** 2 - Landing Page Sections
> **Status:** ✅ Complete
> **Last Updated:** 2025-12-26
> **Depends On:** M3-pricing-section.md

## Objective

Create a social proof section with customer testimonials to build trust.

---

## Design Specifications

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│               ماذا يقول عملاؤنا                             │
│          انضم لآلاف الأعمال التي تستخدم منصتنا              │
│                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐    │
│  │ ★★★★★         │  │ ★★★★★         │  │ ★★★★★         │    │
│  │               │  │               │  │               │    │
│  │ "Quote..."    │  │ "Quote..."    │  │ "Quote..."    │    │
│  │               │  │               │  │               │    │
│  │ [Avatar] Name │  │ [Avatar] Name │  │ [Avatar] Name │    │
│  │ Role @ Company│  │ Role @ Company│  │ Role @ Company│    │
│  └───────────────┘  └───────────────┘  └───────────────┘    │
│                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐    │
│  │ Logo          │  │ Logo          │  │ Logo          │    │
│  └───────────────┘  └───────────────┘  └───────────────┘    │
│                  (Trusted by logos)                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Testimonial Content
Focus on Saudi/Egyptian businesses:
- Restaurant owner
- Clinic manager
- Store owner
- Service provider

### Visual Style
- Card-based layout
- Star rating (5 stars)
- Avatar with fallback
- Company logo bar (optional)
- Carousel on mobile (optional)

---

## Implementation Checklist

### 1. Create Testimonials Section
- [x] Create `src/components/marketing/sections/TestimonialsSection.tsx`
- [x] Use Section and SectionHeader components
- [x] Implement responsive grid

### 2. Create Testimonial Data
- [x] Define testimonials array
- [x] Include Arabic testimonials
- [x] Include English testimonials
- [x] Add realistic business types

### 3. Add Company Logos Bar
- [x] Create logos component
- [x] Add placeholder logos
- [ ] Implement infinite scroll (optional - skipped)

### 4. Mobile Carousel (Optional)
- [ ] Implement swipeable carousel (optional - skipped)
- [ ] Add pagination dots (optional - skipped)
- [ ] Auto-play option (optional - skipped)

### 5. Testing
- [x] Test responsive layout
- [x] Test RTL layout
- [x] Verify avatar fallbacks work

---

## Code Template

### TestimonialsSection Component
```typescript
import { getTranslations } from "next-intl/server";
import { Section, SectionHeader, TestimonialCard } from "@/components/marketing";

// Testimonial data - in production, this could come from CMS or database
const testimonials = {
  ar: [
    {
      quote: "وفر لنا البوت ساعات من العمل اليومي. العملاء يحصلون على ردود فورية والمبيعات زادت 30%",
      author: {
        name: "أحمد الشمري",
        role: "صاحب مطعم",
        company: "مطعم الديرة",
        avatar: "/images/testimonials/ahmed.jpg",
      },
      rating: 5,
    },
    {
      quote: "نظام مزامنة جوجل شيتس ممتاز! كل بيانات المرضى منظمة ومحفوظة تلقائياً",
      author: {
        name: "د. سارة المطيري",
        role: "مديرة عيادة",
        company: "عيادة الصحة",
        avatar: "/images/testimonials/sara.jpg",
      },
      rating: 5,
    },
    {
      quote: "سهولة الاستخدام مذهلة. بدأنا العمل خلال دقائق والدعم الفني سريع جداً",
      author: {
        name: "محمد عبدالله",
        role: "صاحب متجر",
        company: "متجر النور",
        avatar: "/images/testimonials/mohammed.jpg",
      },
      rating: 5,
    },
  ],
  en: [
    {
      quote: "The bot saved us hours of daily work. Customers get instant replies and sales increased by 30%",
      author: {
        name: "Ahmed Al-Shammari",
        role: "Restaurant Owner",
        company: "Al-Deera Restaurant",
        avatar: "/images/testimonials/ahmed.jpg",
      },
      rating: 5,
    },
    {
      quote: "The Google Sheets sync is excellent! All patient data is organized and saved automatically",
      author: {
        name: "Dr. Sara Al-Mutairi",
        role: "Clinic Manager",
        company: "Health Clinic",
        avatar: "/images/testimonials/sara.jpg",
      },
      rating: 5,
    },
    {
      quote: "Amazing ease of use. We started working within minutes and tech support is very fast",
      author: {
        name: "Mohammed Abdullah",
        role: "Store Owner",
        company: "Al-Noor Store",
        avatar: "/images/testimonials/mohammed.jpg",
      },
      rating: 5,
    },
  ],
};

export async function TestimonialsSection() {
  const t = await getTranslations("landing.testimonials");
  const locale = await getLocale();

  const currentTestimonials = testimonials[locale as keyof typeof testimonials] || testimonials.ar;

  return (
    <Section id="testimonials" background="muted">
      <SectionHeader
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            quote={testimonial.quote}
            author={testimonial.author}
            rating={testimonial.rating}
          />
        ))}
      </div>

      {/* Optional: Company Logos */}
      <div className="mt-16 pt-8 border-t">
        <p className="text-center text-sm text-muted-foreground mb-8">
          {t("trustedBy")}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {/* Placeholder logos - replace with actual client logos */}
          {["Company 1", "Company 2", "Company 3", "Company 4"].map((company, i) => (
            <div
              key={i}
              className="h-8 w-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

### With Locale Helper
```typescript
import { getLocale } from "next-intl/server";

// Add this import at top
```

---

## Avatar Placeholders

Since we don't have real customer photos, use:

### Option 1: UI Avatars API
```typescript
const getAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=16a34a&color=fff`;
```

### Option 2: Initials Fallback
```typescript
// AvatarFallback already handles this in TestimonialCard
<AvatarFallback>
  {author.name.split(" ").map(n => n[0]).join("")}
</AvatarFallback>
```

---

## Translation Keys

Add to translation files:
```json
{
  "landing": {
    "testimonials": {
      "title": "ماذا يقول عملاؤنا",
      "subtitle": "انضم لآلاف الأعمال التي تستخدم منصتنا",
      "trustedBy": "موثوق من قبل شركات رائدة"
    }
  }
}
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/marketing/sections/TestimonialsSection.tsx` | CREATE | Testimonials section |
| `src/components/marketing/sections/index.ts` | MODIFY | Add export |
| `src/app/(marketing)/page.tsx` | MODIFY | Add TestimonialsSection |
| `messages/ar.json` | MODIFY | Add testimonials translations |
| `messages/en.json` | MODIFY | Add testimonials translations |

---

## Testing Instructions

```bash
# 1. Create TestimonialsSection component

# 2. Update landing page

# 3. Start dev server
npm run dev

# 4. Test testimonials section
# - Verify all 3 testimonials display
# - Check avatar fallbacks
# - Verify star ratings

# 5. Test language switch
# - Arabic testimonials in AR
# - English testimonials in EN

# 6. Test responsive
npm run lint
```

---

## Acceptance Criteria

- [x] 3+ testimonials displayed
- [x] Star ratings visible
- [x] Author info complete (name, role, company)
- [x] Avatar or initials fallback works
- [x] Language-specific content loads
- [x] Responsive grid works
- [x] RTL layout correct
- [x] Dark mode works
