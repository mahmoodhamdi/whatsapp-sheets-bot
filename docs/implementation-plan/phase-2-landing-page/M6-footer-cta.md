# Milestone 2.6: Footer & CTA Section

> **Phase:** 2 - Landing Page Sections
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26
> **Depends On:** M5-faq-section.md

## Objective

Complete the landing page with a compelling CTA section and finalize the footer.

---

## Design Specifications

### CTA Section Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║          🎯 جاهز لأتمتة ردودك؟                        ║  │
│  ║                                                       ║  │
│  ║   ابدأ تجربتك المجانية اليوم بدون بطاقة ائتمان       ║  │
│  ║                                                       ║  │
│  ║      [ابدأ الآن مجاناً]    [شاهد العرض]               ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
└─────────────────────────────────────────────────────────────┘
```

### Footer Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  [Logo] WhatsApp Bot          المنتج         قانوني         │
│                               ─────────      ────────        │
│  أتمتة ردود الواتساب          المميزات       الخصوصية       │
│  وربطها مع جوجل شيتس          الأسعار        الشروط         │
│                               التوثيق                       │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  © 2025 WhatsApp Bot        [🌐 العربية ▼]    [Twitter] [📧]│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Visual Style
- CTA: Gradient green background, white text, bold
- Footer: Muted background, organized columns
- Social icons: Twitter, Email, WhatsApp

---

## Implementation Checklist

### 1. Create CTA Section
- [ ] Create `src/components/marketing/sections/CTASection.tsx`
- [ ] Use CTABanner component or create new
- [ ] Add gradient background
- [ ] Add primary and secondary buttons

### 2. Finalize Footer Component
- [ ] Update `src/components/marketing/Footer.tsx`
- [ ] Add all link sections
- [ ] Add social media icons
- [ ] Add language switcher
- [ ] Add copyright with year

### 3. Assemble Landing Page
- [ ] Add all sections in order
- [ ] Verify smooth scrolling
- [ ] Test anchor links (/#features, /#pricing)

### 4. Testing
- [ ] Test CTA buttons
- [ ] Test footer links
- [ ] Test social links
- [ ] Test responsive layout

---

## Code Templates

### CTASection Component
```typescript
import { getTranslations } from "next-intl/server";
import { Section, CTABanner } from "@/components/marketing";

export async function CTASection() {
  const t = await getTranslations("landing.cta");

  return (
    <Section>
      <CTABanner
        title={t("title")}
        description={t("description")}
        primaryCta={{
          label: t("button"),
          href: "/register",
        }}
        secondaryCta={{
          label: t("demo"),
          href: "#demo",
        }}
      />
    </Section>
  );
}
```

### Complete Footer Component
```typescript
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MessageSquare, Twitter, Mail, Phone } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { href: "/features", label: t("features") },
      { href: "/pricing", label: t("pricing") },
      { href: "/docs", label: t("docs") },
    ],
    legal: [
      { href: "/privacy", label: t("privacy") },
      { href: "/terms", label: t("terms") },
    ],
    support: [
      { href: "/docs/getting-started", label: t("gettingStarted") },
      { href: "/docs/faq", label: t("faq") },
      { href: "mailto:support@whatsappbot.com", label: t("contact") },
    ],
  };

  const socialLinks = [
    { href: "https://twitter.com/whatsappbot", icon: Twitter, label: "Twitter" },
    { href: "mailto:support@whatsappbot.com", icon: Mail, label: "Email" },
    { href: "https://wa.me/966XXXXXXXXX", icon: Phone, label: "WhatsApp" },
  ];

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <MessageSquare className="h-6 w-6 text-green-600" />
              {t("brand")}
            </Link>
            <p className="mt-4 text-muted-foreground max-w-sm">
              {t("description")}
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-green-100 hover:text-green-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("product")}</h3>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("support")}</h3>
            <ul className="space-y-3">
              {links.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("legal")}</h3>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {t("copyright", { year: currentYear })}
          </p>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
```

### Complete Landing Page Assembly
```typescript
// src/app/(marketing)/page.tsx
import { HeroSection } from "@/components/marketing/sections/HeroSection";
import { FeaturesSection } from "@/components/marketing/sections/FeaturesSection";
import { PricingSection } from "@/components/marketing/sections/PricingSection";
import { TestimonialsSection } from "@/components/marketing/sections/TestimonialsSection";
import { FAQSection } from "@/components/marketing/sections/FAQSection";
import { CTASection } from "@/components/marketing/sections/CTASection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
```

---

## Translation Updates

### Add to Arabic (`messages/ar.json`)
```json
{
  "landing": {
    "cta": {
      "title": "جاهز لأتمتة ردودك؟",
      "description": "ابدأ تجربتك المجانية اليوم بدون بطاقة ائتمان",
      "button": "ابدأ الآن مجاناً",
      "demo": "شاهد العرض"
    }
  },
  "footer": {
    "brand": "واتساب بوت",
    "description": "أتمتة ردود الواتساب وربطها مع جوجل شيتس لإدارة أعمالك بكفاءة.",
    "product": "المنتج",
    "features": "المميزات",
    "pricing": "الأسعار",
    "docs": "التوثيق",
    "support": "الدعم",
    "gettingStarted": "البدء السريع",
    "faq": "الأسئلة الشائعة",
    "contact": "تواصل معنا",
    "legal": "قانوني",
    "privacy": "سياسة الخصوصية",
    "terms": "شروط الاستخدام",
    "copyright": "© {year} واتساب بوت. جميع الحقوق محفوظة."
  }
}
```

### Add to English (`messages/en.json`)
```json
{
  "landing": {
    "cta": {
      "title": "Ready to Automate Your Replies?",
      "description": "Start your free trial today with no credit card required",
      "button": "Start Free Now",
      "demo": "Watch Demo"
    }
  },
  "footer": {
    "brand": "WhatsApp Bot",
    "description": "Automate your WhatsApp responses and sync with Google Sheets to manage your business efficiently.",
    "product": "Product",
    "features": "Features",
    "pricing": "Pricing",
    "docs": "Docs",
    "support": "Support",
    "gettingStarted": "Getting Started",
    "faq": "FAQ",
    "contact": "Contact Us",
    "legal": "Legal",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "copyright": "© {year} WhatsApp Bot. All rights reserved."
  }
}
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/marketing/sections/CTASection.tsx` | CREATE | CTA section |
| `src/components/marketing/sections/index.ts` | MODIFY | Add export |
| `src/components/marketing/Footer.tsx` | MODIFY | Complete footer |
| `src/app/(marketing)/page.tsx` | MODIFY | Assemble all sections |
| `messages/ar.json` | MODIFY | Add CTA/footer translations |
| `messages/en.json` | MODIFY | Add CTA/footer translations |

---

## Anchor Links

Add smooth scrolling for internal links:

```typescript
// src/app/(marketing)/layout.tsx
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      {/* ... */}
    </div>
  );
}
```

Or in `globals.css`:
```css
html {
  scroll-behavior: smooth;
}
```

---

## Testing Instructions

```bash
# 1. Create CTASection component

# 2. Update Footer with all links

# 3. Assemble landing page with all sections

# 4. Start dev server
npm run dev

# 5. Full landing page test
# - Scroll through all sections
# - Test anchor links (/#features, /#pricing, /#faq)
# - Click CTA buttons
# - Test footer links
# - Test social icons

# 6. Test responsive at all breakpoints
# - Mobile (375px)
# - Tablet (768px)
# - Desktop (1024px+)

# 7. Test RTL completely

# 8. Run final tests
npm run test
npm run lint
npm run build
```

---

## Acceptance Criteria

### CTA Section
- [ ] Compelling title and description
- [ ] Primary CTA links to /register
- [ ] Secondary CTA exists
- [ ] Gradient background renders
- [ ] Responsive on all devices

### Footer
- [ ] All navigation links work
- [ ] Social icons link correctly
- [ ] Language switcher works
- [ ] Copyright year dynamic
- [ ] RTL layout correct

### Landing Page Complete
- [ ] All 6 sections render in order
- [ ] Smooth scrolling works
- [ ] No layout issues
- [ ] Fast page load (< 3s)
- [ ] SEO meta tags present
- [ ] No console errors
- [ ] All tests pass
- [ ] Build succeeds

---

## Phase 2 Completion Checklist

After this milestone, verify:

- [ ] M1: Hero Section ✅
- [ ] M2: Features Section ✅
- [ ] M3: Pricing Section ✅
- [ ] M4: Testimonials Section ✅
- [ ] M5: FAQ Section ✅
- [ ] M6: Footer & CTA ✅

**Update MASTER_PLAN.md to mark Phase 2 complete!**
