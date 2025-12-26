# Milestone 2.1: Hero Section

> **Phase:** 2 - Landing Page Sections
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26
> **Depends On:** Phase 1 Complete

## Objective

Create an impactful hero section that communicates the product value proposition and drives conversions.

---

## Design Specifications

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                        [Navbar]                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────┐     ┌─────────────────────────┐    │
│  │   أتمتة ردود        │     │                         │    │
│  │   الواتساب لعملك    │     │    [Product Preview]    │    │
│  │                     │     │    Dashboard mockup     │    │
│  │   Subtitle text     │     │    or animation         │    │
│  │                     │     │                         │    │
│  │   [CTA] [Secondary] │     │                         │    │
│  │                     │     │                         │    │
│  │   Trusted by 500+   │     └─────────────────────────┘    │
│  └─────────────────────┘                                    │
│                                                              │
│              [Stats Bar: Messages | Businesses | Uptime]     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Visual Elements
- **Background:** Subtle gradient (green-50 to white)
- **Decoration:** Abstract shapes, dots pattern, or WhatsApp-style chat bubbles
- **Animation:** Fade-in on load, floating elements
- **Image:** Dashboard screenshot or mockup with subtle shadow

### Mobile Layout
- Stack vertically (text → image → stats)
- Full-width CTA buttons
- Smaller headings

---

## Implementation Checklist

### 1. Create Hero Component
- [ ] Create `src/components/marketing/sections/HeroSection.tsx`
- [ ] Implement responsive layout (2 columns → 1 column)
- [ ] Add gradient background
- [ ] Add decorative elements

### 2. Add Content
- [ ] Title with proper typography
- [ ] Subtitle paragraph
- [ ] Primary CTA button (Get Started Free)
- [ ] Secondary CTA button (Watch Demo)
- [ ] Trust badge (Trusted by X+ businesses)

### 3. Add Visual Elements
- [ ] Product preview image/mockup
- [ ] Background decorations
- [ ] Floating animation (optional)

### 4. Add Stats Bar
- [ ] Messages sent counter
- [ ] Businesses count
- [ ] Uptime percentage
- [ ] Customer satisfaction

### 5. Animations (Optional)
- [ ] Install framer-motion if not present
- [ ] Add fade-in animation for text
- [ ] Add slide-up for image
- [ ] Add count-up for stats

### 6. Testing
- [ ] Test responsive layout
- [ ] Test RTL layout
- [ ] Test dark mode
- [ ] Verify CTA links work

---

## Code Template

### HeroSection Component
```typescript
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { StatsCounter } from "@/components/marketing/StatsCounter";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function HeroSection() {
  const t = await getTranslations("landing.hero");
  const tStats = await getTranslations("landing.stats");

  const stats = [
    { value: 1000000, suffix: "+", label: tStats("messages") },
    { value: 500, suffix: "+", label: tStats("businesses") },
    { value: 99.9, suffix: "%", label: tStats("uptime") },
    { value: 98, suffix: "%", label: tStats("satisfaction") },
  ];

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50/50 dark:from-green-950/20 dark:via-background dark:to-green-950/10" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-300/20 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-start">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("title")}
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              {t("subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-lg px-8"
                asChild
              >
                <Link href="/register">
                  {t("cta")}
                  <ArrowLeft className="ms-2 h-5 w-5 rtl:rotate-180" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                asChild
              >
                <Link href="#demo">
                  <Play className="me-2 h-5 w-5" />
                  {t("ctaSecondary")}
                </Link>
              </Button>
            </div>

            {/* Trust Badge */}
            <p className="mt-8 text-sm text-muted-foreground">
              {t("trustedBy", { count: "500" })}
            </p>
          </div>

          {/* Product Preview */}
          <div className="relative">
            <div className="relative rounded-2xl shadow-2xl overflow-hidden border bg-card">
              <Image
                src="/images/dashboard-preview.png"
                alt="Dashboard Preview"
                width={600}
                height={400}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 bg-green-500 text-white p-3 rounded-xl shadow-lg">
              <span className="text-2xl">💬</span>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-card p-3 rounded-xl shadow-lg border">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatsCounter
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Landing Page Integration
```typescript
// src/app/(marketing)/page.tsx
import { HeroSection } from "@/components/marketing/sections/HeroSection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      {/* More sections will be added */}
    </>
  );
}
```

---

## Assets Needed

| Asset | Size | Format | Notes |
|-------|------|--------|-------|
| Dashboard Preview | 1200x800 | PNG/WebP | Screenshot or mockup |
| Background Pattern | Tiled | SVG | Optional decoration |

### Creating Dashboard Preview

Option 1: Use actual screenshot
```bash
# Take screenshot of dashboard and save as
public/images/dashboard-preview.png
```

Option 2: Use placeholder
```typescript
// Use existing screenshot from docs/screenshots/
import Image from "next/image";
<Image src="/docs/screenshots/04-dashboard-main.png" ... />
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/marketing/sections/HeroSection.tsx` | CREATE | Hero section component |
| `src/components/marketing/sections/index.ts` | CREATE | Barrel exports |
| `src/app/(marketing)/page.tsx` | MODIFY | Add HeroSection |
| `public/images/dashboard-preview.png` | CREATE | Product preview image |

---

## Testing Instructions

```bash
# 1. Create required files

# 2. Add dashboard preview image
# Copy from docs/screenshots/ or create new

# 3. Start dev server
npm run dev

# 4. Test hero section
# - Verify layout on desktop
# - Verify layout on mobile
# - Test CTA button links
# - Test stats counter animation

# 5. Test RTL
# Switch to Arabic, verify layout mirrors

# 6. Run tests
npm run lint
```

---

## Acceptance Criteria

- [ ] Hero section renders on landing page
- [ ] Responsive layout works (desktop/tablet/mobile)
- [ ] CTA buttons link to correct pages
- [ ] Stats counters animate on scroll
- [ ] RTL layout correct
- [ ] Dark mode works
- [ ] Product preview image loads
- [ ] No layout shift (CLS) issues
- [ ] Page loads fast (LCP < 2.5s)
