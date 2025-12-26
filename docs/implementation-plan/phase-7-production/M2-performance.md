# Milestone 7.2: Performance Optimization

> **Phase:** 7 - Production Polish
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26

## Objective

Optimize performance for fast loading and smooth UX.

---

## Implementation Checklist

- [ ] Image optimization
- [ ] Bundle analysis
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Caching strategies
- [ ] Database query optimization
- [ ] API response optimization

---

## Optimizations

### Image Optimization
```typescript
// Use Next.js Image component
import Image from "next/image";

<Image
  src="/hero-image.png"
  alt="Hero"
  width={600}
  height={400}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

### Dynamic Imports
```typescript
// Lazy load heavy components
import dynamic from "next/dynamic";

const HeavyChart = dynamic(
  () => import("@/components/analytics/Chart"),
  { loading: () => <ChartSkeleton /> }
);
```

### API Caching
```typescript
// src/app/api/plans/route.ts
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
  });
  return NextResponse.json(plans);
}
```

### Database Optimization
```typescript
// Select only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // Don't select password, etc.
  },
});

// Use pagination
const messages = await prisma.message.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: "desc" },
});
```

### Bundle Analysis
```bash
# Add to package.json scripts
"analyze": "ANALYZE=true npm run build"

# Install analyzer
npm install @next/bundle-analyzer
```

```typescript
// next.config.ts
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer({
  // config
});
```

---

## Performance Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTI (Time to Interactive) | < 3.5s |

---

## Acceptance Criteria

- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] Bundle size reasonable
- [ ] No layout shifts
- [ ] Fast API responses
