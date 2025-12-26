# Milestone 1.2: Landing Layout & Navigation

> **Phase:** 1 - Foundation & Public Routes
> **Status:** ✅ Complete
> **Last Updated:** 2025-12-26
> **Depends On:** M1-public-routes.md

## Objective

Create the main layout for marketing pages including a responsive navigation bar and footer structure.

---

## Context

### Design Requirements
- **Theme:** Green primary color (matching dashboard)
- **Languages:** Arabic (RTL) + English (LTR)
- **Responsive:** Mobile-first design
- **Dark Mode:** Support light/dark themes
- **Font:** Cairo (already configured)

### Navigation Items
```
Logo | Features | Pricing | Docs | [Language] | Login | Get Started (CTA)
```

### Mobile Navigation
- Hamburger menu
- Full-screen overlay or slide-in drawer
- All nav items accessible

---

## Implementation Checklist

### 1. Create Navbar Component
- [x] Create `src/components/marketing/Navbar.tsx`
- [x] Implement desktop navigation
- [x] Implement mobile hamburger menu
- [x] Add language switcher
- [x] Add Login/Get Started buttons
- [x] Support RTL layout
- [x] Add scroll behavior (transparent → solid on scroll)

### 2. Create Footer Component
- [x] Create `src/components/marketing/Footer.tsx`
- [x] Add company info section
- [x] Add navigation links (Features, Pricing, Docs)
- [x] Add legal links (Privacy, Terms)
- [x] Add social media links
- [x] Add language switcher
- [x] Support RTL layout

### 3. Create Mobile Menu Component
- [x] Create `src/components/marketing/MobileMenu.tsx`
- [x] Use Sheet component from shadcn/ui
- [x] Add all nav items
- [x] Add close on navigation
- [x] Animate open/close

### 4. Update Marketing Layout
- [x] Update `src/app/(marketing)/layout.tsx`
- [x] Add Navbar at top
- [x] Add Footer at bottom
- [x] Ensure proper spacing

### 5. Add Translations
- [x] Add navbar translations to `messages/ar.json`
- [x] Add navbar translations to `messages/en.json`
- [x] Add footer translations

### 6. Testing
- [x] Test responsive behavior
- [x] Test RTL/LTR switching
- [x] Test dark/light mode
- [x] Test mobile menu
- [x] Test navigation links

---

## Code Templates

### Navbar Component (`src/components/marketing/Navbar.tsx`)
```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { Menu, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("nav");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/features", label: t("features") },
    { href: "/pricing", label: t("pricing") },
    { href: "/docs", label: t("docs") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <MessageSquare className="h-6 w-6 text-green-600" />
          <span className="hidden sm:inline">{t("brand")}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <Button variant="ghost" asChild>
            <Link href="/login">{t("login")}</Link>
          </Button>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/register">{t("getStarted")}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navItems={navItems}
        />
      </nav>
    </header>
  );
}
```

### Mobile Menu (`src/components/marketing/MobileMenu.tsx`)
```typescript
"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MessageSquare } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { href: string; label: string }[];
}

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const t = useTranslations("nav");

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-green-600" />
            {t("brand")}
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="text-lg py-2 border-b hover:text-green-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-4 space-y-4">
            <LanguageSwitcher />

            <Button variant="outline" className="w-full" asChild>
              <Link href="/login" onClick={onClose}>
                {t("login")}
              </Link>
            </Button>

            <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
              <Link href="/register" onClick={onClose}>
                {t("getStarted")}
              </Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
```

### Footer Component (`src/components/marketing/Footer.tsx`)
```typescript
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MessageSquare } from "lucide-react";

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
  };

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <MessageSquare className="h-6 w-6 text-green-600" />
              {t("brand")}
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              {t("description")}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("product")}</h3>
            <ul className="space-y-2">
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

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("legal")}</h3>
            <ul className="space-y-2">
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

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p>{t("copyright", { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
```

### Updated Marketing Layout (`src/app/(marketing)/layout.tsx`)
```typescript
import { ReactNode } from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

---

## Translation Keys

### Arabic (`messages/ar.json`) - Add to existing
```json
{
  "nav": {
    "brand": "واتساب بوت",
    "features": "المميزات",
    "pricing": "الأسعار",
    "docs": "التوثيق",
    "login": "تسجيل الدخول",
    "getStarted": "ابدأ مجاناً"
  },
  "footer": {
    "brand": "واتساب بوت",
    "description": "أتمتة ردود الواتساب وربطها مع جوجل شيتس لإدارة أعمالك بكفاءة.",
    "product": "المنتج",
    "features": "المميزات",
    "pricing": "الأسعار",
    "docs": "التوثيق",
    "legal": "قانوني",
    "privacy": "سياسة الخصوصية",
    "terms": "شروط الاستخدام",
    "copyright": "© {year} واتساب بوت. جميع الحقوق محفوظة."
  }
}
```

### English (`messages/en.json`) - Add to existing
```json
{
  "nav": {
    "brand": "WhatsApp Bot",
    "features": "Features",
    "pricing": "Pricing",
    "docs": "Docs",
    "login": "Login",
    "getStarted": "Get Started Free"
  },
  "footer": {
    "brand": "WhatsApp Bot",
    "description": "Automate your WhatsApp responses and sync with Google Sheets to manage your business efficiently.",
    "product": "Product",
    "features": "Features",
    "pricing": "Pricing",
    "docs": "Docs",
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
| `src/components/marketing/Navbar.tsx` | CREATE | Main navigation bar |
| `src/components/marketing/MobileMenu.tsx` | CREATE | Mobile menu drawer |
| `src/components/marketing/Footer.tsx` | CREATE | Site footer |
| `src/components/marketing/index.ts` | CREATE | Export barrel file |
| `src/app/(marketing)/layout.tsx` | MODIFY | Add Navbar and Footer |
| `messages/ar.json` | MODIFY | Add nav/footer translations |
| `messages/en.json` | MODIFY | Add nav/footer translations |

---

## Testing Instructions

```bash
# 1. Start dev server
npm run dev

# 2. Test desktop navigation
# - Verify all links work
# - Verify scroll behavior (transparent → solid)
# - Test language switcher
# - Test Login/Get Started buttons

# 3. Test mobile navigation
# - Resize to mobile viewport
# - Open hamburger menu
# - Verify all items present
# - Test close on navigation

# 4. Test RTL
# - Switch to Arabic
# - Verify layout mirrors correctly
# - Verify menu opens from correct side

# 5. Test dark mode
# - Toggle theme
# - Verify colors adapt

# 6. Run tests
npm run test
npm run lint
```

---

## Acceptance Criteria

- [x] Navbar renders on all marketing pages
- [x] Mobile menu works on small screens
- [x] Footer renders with all links
- [x] Language switcher works
- [x] RTL layout correct for Arabic
- [x] Dark mode works
- [x] Scroll behavior smooth
- [x] All links navigate correctly
- [x] No console errors
- [x] Translations complete for AR/EN
