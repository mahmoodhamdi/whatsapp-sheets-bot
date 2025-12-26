# Milestone 7.3: Analytics Integration

> **Phase:** 7 - Production Polish
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26

## Objective

Add analytics to track user behavior and business metrics.

---

## Analytics Options

1. **Vercel Analytics** - Simple, privacy-focused
2. **Google Analytics** - Comprehensive, free
3. **Plausible** - Privacy-focused, paid
4. **PostHog** - Open source, feature-rich

---

## Implementation Checklist

- [ ] Choose analytics provider
- [ ] Install and configure
- [ ] Track page views
- [ ] Track custom events
- [ ] Track conversions
- [ ] Create dashboard/reports

---

## Code Templates

### Vercel Analytics
```bash
npm install @vercel/analytics
```

```typescript
// src/app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Custom Event Tracking
```typescript
// src/lib/analytics.ts
import { track } from "@vercel/analytics";

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  track(name, properties);
}

// Usage
trackEvent("subscription_started", { plan: "professional" });
trackEvent("rule_created", { triggerType: "contains" });
trackEvent("message_sent", { isAutoReply: true });
```

### Conversion Tracking
```typescript
// After successful checkout
trackEvent("purchase", {
  plan: planSlug,
  value: price,
  currency: "USD",
});

// After registration
trackEvent("sign_up", {
  method: "credentials",
});
```

### Google Analytics (Alternative)
```typescript
// src/components/analytics/GoogleAnalytics.tsx
"use client";

import Script from "next/script";

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
```

---

## Events to Track

| Event | Properties |
|-------|------------|
| `page_view` | path, referrer |
| `sign_up` | method |
| `login` | method |
| `subscription_started` | plan, billing |
| `subscription_cancelled` | plan, reason |
| `rule_created` | triggerType |
| `message_sent` | isAutoReply |
| `feature_used` | featureName |

---

## Acceptance Criteria

- [ ] Analytics tracking active
- [ ] Page views recorded
- [ ] Key events tracked
- [ ] Conversion tracking works
- [ ] Dashboard accessible
