# Milestone 5.1: Documentation Infrastructure

> **Phase:** 5 - Documentation System
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26

## Objective

Set up MDX-based documentation system with navigation and search.

---

## Implementation Checklist

- [ ] Install MDX dependencies
- [ ] Configure next/mdx
- [ ] Create docs layout with sidebar
- [ ] Create docs navigation component
- [ ] Set up docs content structure
- [ ] Add search functionality (optional)

---

## Code Templates

### MDX Configuration
```typescript
// next.config.ts
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
});
```

### Docs Layout
```typescript
// src/app/(marketing)/docs/layout.tsx
import { DocsSidebar } from "@/components/docs/DocsSidebar";

export default function DocsLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <aside className="hidden md:block w-64 shrink-0">
          <DocsSidebar />
        </aside>
        <main className="flex-1 min-w-0 prose prose-green dark:prose-invert max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Docs Sidebar
```typescript
// src/components/docs/DocsSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const docsNav = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "Features",
    items: [
      { title: "Auto-Reply Rules", href: "/docs/features/auto-reply" },
      { title: "Google Sheets Sync", href: "/docs/features/sheets-sync" },
      { title: "Analytics", href: "/docs/features/analytics" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "Authentication", href: "/docs/api/auth" },
      { title: "Contacts", href: "/docs/api/contacts" },
      { title: "Messages", href: "/docs/api/messages" },
      { title: "Rules", href: "/docs/api/rules" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-20 space-y-6">
      {docsNav.map((section) => (
        <div key={section.title}>
          <h4 className="font-semibold mb-2">{section.title}</h4>
          <ul className="space-y-1">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block py-1 text-sm hover:text-green-600",
                    pathname === item.href
                      ? "text-green-600 font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
```

### Sample MDX Page
```mdx
// src/app/(marketing)/docs/page.mdx
# Introduction

Welcome to the WhatsApp Auto-Reply Bot documentation.

## What is WhatsApp Bot?

WhatsApp Bot is a powerful automation tool that helps businesses...

## Key Features

- **Smart Auto-Replies** - Respond instantly to customer messages
- **Google Sheets Sync** - Keep all data synchronized
- **Multi-language** - Arabic and English support

## Getting Started

[Get started with the quick start guide →](/docs/quick-start)
```

---

## Dependencies

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install -D @types/mdx
```

---

## Files to Create

| File | Description |
|------|-------------|
| `next.config.ts` | MDX configuration |
| `src/app/(marketing)/docs/layout.tsx` | Docs layout |
| `src/components/docs/DocsSidebar.tsx` | Navigation sidebar |
| `src/app/(marketing)/docs/page.mdx` | Introduction page |
| `mdx-components.tsx` | MDX component overrides |

---

## Acceptance Criteria

- [ ] MDX pages render correctly
- [ ] Sidebar navigation works
- [ ] Active page highlighted
- [ ] Responsive layout
- [ ] Code blocks styled
- [ ] RTL support for Arabic docs
