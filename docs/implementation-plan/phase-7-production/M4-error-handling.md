# Milestone 7.4: Error Handling & Monitoring

> **Phase:** 7 - Production Polish
> **Status:** ⬜ Not Started
> **Last Updated:** 2025-12-26

## Objective

Implement comprehensive error handling and monitoring.

---

## Implementation Checklist

- [ ] Global error boundary
- [ ] Custom error pages
- [ ] Error logging service
- [ ] API error handling
- [ ] User-friendly error messages
- [ ] Error alerting

---

## Code Templates

### Error Boundary
```typescript
// src/app/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">
          We're sorry, an unexpected error occurred.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
```

### Not Found Page
```typescript
// src/app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page not found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
```

### API Error Handler
```typescript
// src/lib/api/error-handler.ts
import { NextResponse } from "next/server";

export class APIError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
  }
}

export function handleAPIError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Unknown error" },
    { status: 500 }
  );
}

// Usage in API routes
export async function POST(request: Request) {
  try {
    // ... logic
  } catch (error) {
    return handleAPIError(error);
  }
}
```

### Error Logging (Sentry)
```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

---

## Error Pages to Create

- `/error` - Generic error
- `/not-found` - 404 page
- `/maintenance` - Maintenance mode (optional)

---

## Acceptance Criteria

- [ ] Error boundary catches errors
- [ ] Custom 404 page
- [ ] Custom 500 page
- [ ] Errors logged to service
- [ ] User-friendly messages
- [ ] RTL error pages
