# Milestone 1.3: Shared UI Components

> **Phase:** 1 - Foundation & Public Routes
> **Status:** ✅ Complete
> **Last Updated:** 2025-12-26
> **Depends On:** M1-public-routes.md

## Objective

Create reusable UI components for the landing page sections that will be built in Phase 2.

---

## Components to Create

### 1. Section Container
Consistent padding and max-width for all sections.

### 2. Section Header
Title + subtitle pattern used across sections.

### 3. Feature Card
Card for displaying features with icon, title, description.

### 4. Pricing Card
Card for subscription plans with features list.

### 5. Testimonial Card
Card for customer testimonials.

### 6. FAQ Accordion
Expandable Q&A items.

### 7. CTA Banner
Call-to-action banner with gradient background.

### 8. Animated Counter
For statistics display with animation.

---

## Implementation Checklist

### 1. Section Components
- [x] Create `src/components/marketing/Section.tsx`
- [x] Create `src/components/marketing/SectionHeader.tsx`
- [x] Add variants (centered, left-aligned)
- [x] Support RTL layout

### 2. Feature Card
- [x] Create `src/components/marketing/FeatureCard.tsx`
- [x] Support icon as prop
- [x] Add hover animations
- [x] Support dark mode

### 3. Pricing Card
- [x] Create `src/components/marketing/PricingCard.tsx`
- [x] Support popular/featured variant
- [x] Add feature list with check marks
- [x] Add CTA button
- [x] Support monthly/yearly toggle

### 4. Testimonial Card
- [x] Create `src/components/marketing/TestimonialCard.tsx`
- [x] Show avatar, name, role, company
- [x] Show quote with styling
- [x] Add star rating

### 5. FAQ Accordion
- [x] Create `src/components/marketing/FAQAccordion.tsx`
- [x] Use Radix Accordion
- [x] Animate open/close
- [x] Support multiple items

### 6. CTA Banner
- [x] Create `src/components/marketing/CTABanner.tsx`
- [x] Gradient background
- [x] Title, description, CTA button
- [x] Support variants

### 7. Stats Counter
- [x] Create `src/components/marketing/StatsCounter.tsx`
- [x] Animate counting up
- [x] Support suffix (%, +, K)
- [x] Trigger on scroll into view

### 8. Testing
- [x] Write unit tests for components
- [x] Test accessibility
- [x] Test RTL layout

---

## Code Templates

### Section Container (`src/components/marketing/Section.tsx`)
```typescript
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "muted" | "gradient";
}

export function Section({
  children,
  className,
  id,
  background = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24",
        background === "muted" && "bg-muted/50",
        background === "gradient" && "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
        className
      )}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}
```

### Section Header (`src/components/marketing/SectionHeader.tsx`)
```typescript
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
```

### Feature Card (`src/components/marketing/FeatureCard.tsx`)
```typescript
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300",
        "hover:border-green-500/50",
        className
      )}
    >
      <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
```

### Pricing Card (`src/components/marketing/PricingCard.tsx`)
```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  popular?: boolean;
  className?: string;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  ctaHref,
  popular = false,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative p-6 rounded-xl border bg-card",
        popular && "border-green-500 shadow-lg scale-105",
        className
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            الأكثر شيوعاً
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">/{period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        className={cn(
          "w-full",
          popular
            ? "bg-green-600 hover:bg-green-700"
            : "bg-secondary hover:bg-secondary/80"
        )}
        asChild
      >
        <Link href={ctaHref}>{cta}</Link>
      </Button>
    </div>
  );
}
```

### Testimonial Card (`src/components/marketing/TestimonialCard.tsx`)
```typescript
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
  };
  rating?: number;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  rating = 5,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl border bg-card",
        className
      )}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="h-5 w-5 fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-lg mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>
            {author.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">{author.name}</div>
          <div className="text-sm text-muted-foreground">
            {author.role} @ {author.company}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### FAQ Accordion (`src/components/marketing/FAQAccordion.tsx`)
```typescript
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className={className}>
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-start">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
```

### CTA Banner (`src/components/marketing/CTABanner.tsx`)
```typescript
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CTABannerProps {
  title: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function CTABanner({
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
}: CTABannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-green-700 p-8 md:p-12 text-white",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="text-green-100 text-lg mb-8">{description}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white text-green-700 hover:bg-green-50"
            asChild
          >
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>

          {secondaryCta && (
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Stats Counter (`src/components/marketing/StatsCounter.tsx`)
```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StatsCounterProps {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
}

export function StatsCounter({
  value,
  suffix = "",
  label,
  className,
}: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, value]);

  const animateCount = () => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
  };

  return (
    <div ref={ref} className={cn("text-center", className)}>
      <div className="text-4xl md:text-5xl font-bold text-green-600">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-muted-foreground">{label}</div>
    </div>
  );
}
```

### Barrel Export (`src/components/marketing/index.ts`)
```typescript
export { Section } from "./Section";
export { SectionHeader } from "./SectionHeader";
export { FeatureCard } from "./FeatureCard";
export { PricingCard } from "./PricingCard";
export { TestimonialCard } from "./TestimonialCard";
export { FAQAccordion } from "./FAQAccordion";
export { CTABanner } from "./CTABanner";
export { StatsCounter } from "./StatsCounter";
export { Navbar } from "./Navbar";
export { MobileMenu } from "./MobileMenu";
export { Footer } from "./Footer";
```

---

## Files to Create

| File | Description |
|------|-------------|
| `src/components/marketing/Section.tsx` | Section wrapper |
| `src/components/marketing/SectionHeader.tsx` | Section title/subtitle |
| `src/components/marketing/FeatureCard.tsx` | Feature display card |
| `src/components/marketing/PricingCard.tsx` | Pricing plan card |
| `src/components/marketing/TestimonialCard.tsx` | Customer review card |
| `src/components/marketing/FAQAccordion.tsx` | FAQ expandable list |
| `src/components/marketing/CTABanner.tsx` | Call-to-action banner |
| `src/components/marketing/StatsCounter.tsx` | Animated number counter |
| `src/components/marketing/index.ts` | Barrel exports |

---

## Dependencies to Add

```bash
# Add accordion component from shadcn/ui
npx shadcn@latest add accordion
```

---

## Testing Instructions

```bash
# 1. Add accordion component
npx shadcn@latest add accordion

# 2. Create all component files

# 3. Test components work (create a test page)
# Create a temporary test page to verify all components render

# 4. Run lint and type check
npm run lint
npx tsc --noEmit

# 5. Run unit tests
npm run test
```

---

## Acceptance Criteria

- [x] All 8 components created
- [x] Components support RTL layout
- [x] Components support dark mode
- [x] StatsCounter animates on scroll
- [x] PricingCard has popular variant
- [x] All components properly typed
- [x] No TypeScript errors
- [x] No ESLint errors
- [x] Accordion component installed
