# Milestone 7.1: SEO Optimization

> **Phase:** 7 - Production Polish
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26

## Objective

Optimize all pages for search engines.

---

## Implementation Checklist

- [ ] Add metadata to all pages
- [ ] Create sitemap.xml
- [ ] Create robots.txt
- [ ] Add Open Graph tags
- [ ] Add Twitter cards
- [ ] Add structured data (JSON-LD)
- [ ] Optimize page titles and descriptions

---

## Code Templates

### Root Layout Metadata
```typescript
// src/app/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "WhatsApp Auto-Reply Bot | Automate Your Business",
    template: "%s | WhatsApp Bot",
  },
  description: "Automate your WhatsApp responses and sync with Google Sheets. Perfect for stores, clinics, and restaurants in Saudi Arabia and Egypt.",
  keywords: ["whatsapp bot", "auto reply", "automation", "saudi arabia", "egypt", "business"],
  authors: [{ name: "WhatsApp Bot Team" }],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    url: "https://whatsappbot.com",
    siteName: "WhatsApp Bot",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@whatsappbot",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### Page-Specific Metadata
```typescript
// src/app/(marketing)/pricing/page.tsx
export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose the perfect plan for your business. Free, Starter, Professional, and Enterprise options available.",
};
```

### Sitemap
```typescript
// src/app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://whatsappbot.com";

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/features`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/docs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  ];
}
```

### Robots.txt
```typescript
// src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/"],
    },
    sitemap: "https://whatsappbot.com/sitemap.xml",
  };
}
```

### Structured Data
```typescript
// src/components/seo/StructuredData.tsx
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WhatsApp Bot",
    url: "https://whatsappbot.com",
    logo: "https://whatsappbot.com/logo.png",
    sameAs: ["https://twitter.com/whatsappbot"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "WhatsApp Auto-Reply Bot",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## Assets Needed

- `/public/og-image.png` (1200x630)
- `/public/twitter-image.png` (1200x600)
- `/public/logo.png`
- `/public/favicon.ico`

---

## Acceptance Criteria

- [ ] All pages have unique titles
- [ ] Meta descriptions on all pages
- [ ] Open Graph images work
- [ ] Sitemap accessible
- [ ] Robots.txt correct
- [ ] Structured data valid (test with Google)
