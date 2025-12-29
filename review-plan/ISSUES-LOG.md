# Issues Log

## Purpose
تسجيل كل المشاكل المكتشفة أثناء الـ review.

---

## Issue Template

```markdown
### ISSUE-XXX: [Title]
- **Severity**: Critical / High / Medium / Low
- **Phase**: Phase X
- **Milestone**: M.X.X
- **File(s)**: path/to/file.ts
- **Description**: وصف المشكلة
- **Impact**: تأثير المشكلة
- **Status**: Open / In Progress / Fixed / Won't Fix
- **Fixed In**: (commit hash or PR)
```

---

## Critical Issues 🔴

_(No critical issues found)_

---

## High Priority Issues 🟠

### ISSUE-001: Missing API Error Handling
- **Severity**: High
- **Phase**: Phase 1
- **Milestone**: M1.1
- **File(s)**:
  - `src/app/api/messages/route.ts`
  - `src/app/api/contacts/route.ts`
- **Description**: These API routes have no try-catch error handling. Database or network errors will crash without proper response.
- **Impact**: 500 errors without meaningful messages to client
- **Status**: Open
- **Recommendation**: Use `withErrorHandler` wrapper from `src/lib/api/error-handler.ts`

---

### ISSUE-002: Missing Response Status Validation in Client Components
- **Severity**: High
- **Phase**: Phase 1
- **Milestone**: M1.1
- **File(s)**:
  - `src/app/(dashboard)/dashboard/messages/page.tsx:81`
  - `src/app/(dashboard)/dashboard/contacts/page.tsx:61`
  - `src/app/(dashboard)/dashboard/rules/page.tsx:50`
- **Description**: Client fetch calls don't check `res.ok` before parsing JSON. A 403 or 500 error would still be parsed as JSON.
- **Impact**: Vague "errors.general" messages instead of specific feedback
- **Status**: Open
- **Recommendation**: Add `if (!res.ok) throw new Error(...)` before `res.json()`

---

### ISSUE-003: Duplicated Fetch Pattern Across Pages (~200 lines)
- **Severity**: High
- **Phase**: Phase 1
- **Milestone**: M1.1
- **File(s)**:
  - `src/app/(dashboard)/dashboard/messages/page.tsx:66-90`
  - `src/app/(dashboard)/dashboard/contacts/page.tsx:53-70`
  - `src/app/(dashboard)/dashboard/rules/page.tsx:40-60`
- **Description**: All three pages have nearly identical fetch, pagination, loading, and error handling logic (~80% duplicated code).
- **Impact**: Maintenance burden, inconsistent behavior, harder to fix bugs
- **Status**: Open
- **Recommendation**: Create `usePaginatedFetch()` custom hook

---

## Medium Priority Issues 🟡

### ISSUE-004: BillingSettings.tsx Too Many Responsibilities
- **Severity**: Medium
- **Phase**: Phase 1
- **Milestone**: M1.1
- **File(s)**: `src/components/settings/BillingSettings.tsx` (416 lines)
- **Description**: Component handles subscription display, usage metrics, billing portal, cancellation, resumption, and upgrade prompts.
- **Impact**: Hard to test individual concerns, difficult to maintain
- **Status**: Open
- **Recommendation**: Split into smaller focused components

---

### ISSUE-005: Usage Calculation Logic Duplicated
- **Severity**: Medium
- **Phase**: Phase 1
- **Milestone**: M1.1
- **File(s)**:
  - `src/components/dashboard/UsageDisplay.tsx:40-48`
  - `src/components/settings/BillingSettings.tsx:83-85`
  - `src/components/subscription/UsageLimitWarning.tsx:29-30`
- **Description**: Same percentage calculation and threshold logic (80%, 100%) duplicated in 3+ locations.
- **Impact**: If threshold logic changes, must update multiple files
- **Status**: Open
- **Recommendation**: Extract to utility function or custom hook

---

### ISSUE-006: ESLint Rules Disabled in useEffect Dependencies
- **Severity**: Medium
- **Phase**: Phase 1
- **Milestone**: M1.1
- **File(s)**:
  - `src/app/(dashboard)/dashboard/messages/page.tsx:94,104`
  - `src/app/(dashboard)/dashboard/contacts/page.tsx:72,84`
  - `src/app/(dashboard)/dashboard/rules/page.tsx:60-63`
- **Description**: `eslint-disable-next-line react-hooks/exhaustive-deps` used to suppress warnings about missing dependencies.
- **Impact**: Could cause stale closures or missed updates
- **Status**: Open
- **Recommendation**: Use `useCallback` with proper dependencies instead

---

### ISSUE-007: Inconsistent Authentication Checks in API Routes
- **Severity**: Medium
- **Phase**: Phase 1
- **Milestone**: M1.1
- **File(s)**:
  - `src/app/api/rules/route.ts:52` - uses `!session?.user?.id`
  - `src/app/api/contacts/route.ts:7` - uses `!session`
  - `src/app/api/messages/route.ts:8` - uses `!session`
- **Description**: Different routes use different strictness for auth checks.
- **Impact**: Potential security inconsistency
- **Status**: Open
- **Recommendation**: Use consistent strict check `!session?.user?.id`

---

### ISSUE-008: Overly Broad Catch in DELETE Handlers
- **Severity**: Medium
- **Phase**: Phase 1
- **Milestone**: M1.1
- **File(s)**:
  - `src/app/api/contacts/[id]/route.ts:47-48`
  - `src/app/api/rules/[id]/route.ts:105-110`
- **Description**: DELETE handlers catch all errors and return 404, hiding real database errors.
- **Impact**: Difficult to debug actual failures
- **Status**: Open
- **Recommendation**: Check for specific Prisma not-found error, let others propagate

---

### ISSUE-013: Unsafe Double Type Assertion for Features
- **Severity**: Medium
- **Phase**: Phase 1
- **Milestone**: M1.2
- **File(s)**:
  - `src/lib/features/index.ts:66-67`
  - `src/lib/features/index.ts:94,97`
  - `src/lib/features/index.ts:130,133`
  - `src/lib/features/index.ts:153`
- **Description**: Double cast `(plan.features as string[]) as Feature[]` bypasses TypeScript safety. The `Plan.features` is typed as `Json` (Prisma), and the double cast assumes the value is a valid Feature array without runtime validation.
- **Impact**: If database contains invalid feature names, code won't error - just silently fail feature checks
- **Status**: Open
- **Recommendation**: Create `parseFeatures(json: unknown): Feature[]` validation function with Zod or manual validation

---

### ISSUE-014: Non-Type-Safe Error Property Casting
- **Severity**: Medium
- **Phase**: Phase 1
- **Milestone**: M1.2
- **File(s)**: `src/lib/features/index.ts:171-173`
- **Description**: Error object properties assigned via type assertion `(error as Error & { code: string }).code = "..."`. This pattern isn't type-safe for error handling downstream.
- **Impact**: Consumers of this error may not have proper types
- **Status**: Open
- **Recommendation**: Create custom `FeatureNotAvailableError` class extending Error

---

## Low Priority Issues 🟢

### ISSUE-009: Missing Separate Error State in Client Components
- **Severity**: Low
- **Phase**: Phase 1
- **Milestone**: M1.1
- **File(s)**: All dashboard page components
- **Description**: Components only have `isLoading` state, no separate `error` state for retry functionality.
- **Impact**: No way to show retry button on error
- **Status**: Open
- **Recommendation**: Add `error` state alongside `isLoading`

---

### ISSUE-010: ProfileSettings.tsx Unnecessary Dependencies in useEffect
- **Severity**: Low
- **Phase**: Phase 1
- **Milestone**: M1.1
- **File(s)**: `src/components/settings/ProfileSettings.tsx:50-67`
- **Description**: `reset` and `tErrors` in dependency array could cause unnecessary re-fetches.
- **Impact**: Minor performance issue
- **Status**: Open
- **Recommendation**: Use empty dependency array `[]` for initial fetch

---

### ISSUE-011: Header.tsx Initials Computation in Component
- **Severity**: Low
- **Phase**: Phase 1
- **Milestone**: M1.1
- **File(s)**: `src/components/dashboard/Header.tsx:33-38`
- **Description**: User initials computed inline in component.
- **Impact**: Minor code organization issue
- **Status**: Open
- **Recommendation**: Extract to utility function

---

### ISSUE-012: No Barrel Exports for Dashboard Components
- **Severity**: Low
- **Phase**: Phase 1
- **Milestone**: M1.1
- **File(s)**: `src/components/dashboard/`
- **Description**: Dashboard components don't have an `index.ts` for barrel exports, unlike other component folders.
- **Impact**: Inconsistent import patterns
- **Status**: Open
- **Recommendation**: Add `index.ts` with exports

---

### ISSUE-015: Query Parameter Enum Casts Without Validation
- **Severity**: Low
- **Phase**: Phase 1
- **Milestone**: M1.2
- **File(s)**:
  - `src/app/api/messages/route.ts:15` - `as Direction | null`
  - `src/app/api/analytics/messages/route.ts:45` - `as Period`
- **Description**: Query parameters cast directly to enum types without validation. Invalid values would pass TypeScript but fail at database or default silently.
- **Impact**: Silent failures or unclear error messages for invalid params
- **Status**: Open
- **Recommendation**: Use Zod `.enum()` validation for query parameters

---

### ISSUE-016: Empty Object Context Initialization Pattern
- **Severity**: Low
- **Phase**: Phase 1
- **Milestone**: M1.2
- **File(s)**: `src/components/ui/form.tsx:29,73`
- **Description**: React contexts initialized with `{} as ContextType` which bypasses TypeScript's null checks.
- **Impact**: Minor - pattern works but is not type-safe
- **Status**: Open
- **Recommendation**: Use `undefined` as default with proper null checks, or accept current shadcn/ui pattern

---

### ISSUE-017: API GET Routes Missing Error Handling
- **Severity**: High
- **Phase**: Phase 1
- **Milestone**: M1.3
- **File(s)**:
  - `src/app/api/messages/route.ts:6` - GET has no try-catch
  - `src/app/api/contacts/route.ts:5` - GET has no try-catch
  - `src/app/api/messages/[contactId]/route.ts:5` - GET has no try-catch
  - `src/app/api/rules/route.ts:17` - GET has no try-catch
  - `src/app/api/rules/[id]/route.ts:16` - GET has no try-catch
- **Description**: These API GET handlers have no error handling. Database errors (network issues, query failures) will result in unhandled promise rejections crashing the route.
- **Impact**: Server returns 500 errors without meaningful messages; potential application instability
- **Status**: Open
- **Recommendation**: Wrap with `withErrorHandler` from `src/lib/api/error-handler.ts` or add try-catch
- **Related**: ISSUE-001 (same root cause, different routes)

---

### ISSUE-018: Sensitive Data in Dev Mode Logging
- **Severity**: Medium
- **Phase**: Phase 1
- **Milestone**: M1.3
- **File(s)**: `src/lib/email/index.ts:27-31`
- **Description**: Email dev mode logs email content including subject and HTML body to console. While only in dev mode, this could expose sensitive user information in logs.
- **Impact**: Potential exposure of email content in development logs
- **Status**: Open
- **Recommendation**: Remove HTML content from logs or use a dedicated logger with proper log levels and redaction
- **Code**:
```typescript
console.log("=== EMAIL (dev mode - no RESEND_API_KEY) ===");
console.log("To:", to);
console.log("Subject:", subject);
console.log("HTML:", html.substring(0, 200) + "...");
```

---

### ISSUE-019: Role Stored in Session But Not Used
- **Severity**: Low
- **Phase**: Phase 2
- **Milestone**: M2.1
- **File(s)**:
  - `src/lib/auth.ts:91` - Role added to session
  - `src/lib/auth.ts:71` - Role stored in JWT
- **Description**: User role (ADMIN/USER) is stored in the session but never used for authorization. No API routes check for admin role.
- **Impact**: Minor - role infrastructure exists but is unused
- **Status**: Open
- **Recommendation**: Either implement role-based access control or remove role from session to reduce token size

---

### ISSUE-020: Login Endpoint Missing IP-Based Rate Limiting
- **Severity**: Medium
- **Phase**: Phase 2
- **Milestone**: M2.1
- **File(s)**:
  - `src/lib/auth.ts:18-63` - authorize function
  - `src/lib/security/rate-limit.ts:63-66` - loginLimiter defined but unused
- **Description**: The `loginLimiter` (5 attempts per 15 minutes) is defined but never used. Login only has account lockout (per email) but no IP-based rate limiting. An attacker could try different usernames from the same IP without limit.
- **Impact**: Potential brute force attack vector across multiple accounts from same IP
- **Status**: Open
- **Recommendation**: Add loginLimiter check in a login API route or NextAuth event callback

---

### ISSUE-021: Login Success/Failure Events Not Audit Logged
- **Severity**: Medium
- **Phase**: Phase 2
- **Milestone**: M2.1
- **File(s)**:
  - `src/lib/auth.ts:18-63` - authorize function
  - `src/lib/security/audit.ts:5-6` - LOGIN_SUCCESS/LOGIN_FAILED defined but unused
- **Description**: The AuditAction types include LOGIN_SUCCESS and LOGIN_FAILED, but these events are never logged. Password reset and verification are logged, but login events are not.
- **Impact**: No audit trail for login activity, harder to detect account compromise
- **Status**: Open
- **Recommendation**: Add audit logging in NextAuth events (signIn callback) or in a custom login API route

---

### ISSUE-022: No Multi-Tenant Data Isolation (Critical Design Decision)
- **Severity**: Critical
- **Phase**: Phase 2
- **Milestone**: M2.1
- **File(s)**:
  - `prisma/schema.prisma:62-74` - Contact model (no userId)
  - `prisma/schema.prisma:76-91` - Message model (no userId)
  - `prisma/schema.prisma:107-120` - AutoReplyRule model (no userId)
  - `prisma/schema.prisma:129-138` - Settings model (single record)
- **Description**: The database schema has no per-user data isolation. All users share:
  - All contacts
  - All messages
  - All auto-reply rules
  - Global settings
- **Impact**:
  - Any authenticated user can view/edit ALL data
  - Not suitable for multi-tenant SaaS deployment
  - May be intentional for single WhatsApp instance use case
- **Status**: Open - Requires Design Decision
- **Recommendation**:
  - **Option A**: Document as intentional single-tenant design
  - **Option B**: Add userId to Contact, Message, AutoReplyRule models and enforce ownership checks
- **Note**: The CLAUDE.md mentions "AutoReplyRules are currently global (not per-user). Multi-tenant rule isolation is noted as future work in code comments."

---

### ISSUE-023: URL Parameters Not Validated as CUID
- **Severity**: Low
- **Phase**: Phase 2
- **Milestone**: M2.2
- **File(s)**:
  - `src/app/api/contacts/[id]/route.ts:14,42`
  - `src/app/api/rules/[id]/route.ts:25,52,103`
  - `src/app/api/rules/[id]/toggle/route.ts:14`
  - `src/app/api/messages/[contactId]/route.ts:14`
- **Description**: URL path parameters (id, contactId) are extracted and used directly without validating they are valid cuid format. Invalid IDs will cause Prisma errors.
- **Impact**: Minor - Prisma returns 404-like errors for invalid IDs, but error handling is less clean
- **Status**: Open
- **Recommendation**: Add Zod schema for URL params: `z.object({ id: z.string().cuid() })`

---

### ISSUE-024: User Regex Patterns Vulnerable to ReDoS
- **Severity**: High
- **Phase**: Phase 2
- **Milestone**: M2.2
- **File(s)**:
  - `src/lib/whatsapp/matcher.ts:49-55`
  - `src/app/api/rules/route.ts:75-83` - Validates regex syntax but not safety
- **Description**: When a user creates an auto-reply rule with `triggerType: REGEX`, the regex pattern is compiled and executed against incoming messages without protection against catastrophic backtracking (ReDoS).
- **Impact**:
  - A malicious or poorly-written regex like `(a+)+$` can hang the server
  - DoS vulnerability that could affect all WhatsApp message processing
- **Status**: Open
- **Code**:
```typescript
// matcher.ts:49-55
case "REGEX":
  try {
    const regex = new RegExp(trigger, "i");
    return regex.test(message);  // No timeout, no ReDoS protection
  } catch {
    console.error("Invalid regex:", trigger);
    return false;
  }
```
- **Recommendation**:
  - Option A: Use `safe-regex` library to validate patterns before saving
  - Option B: Add timeout to regex execution (use `vm` module or Worker)
  - Option C: Limit regex complexity (no nested quantifiers)

---

### ISSUE-025: Missing Content-Security-Policy Header
- **Severity**: Medium
- **Phase**: Phase 2
- **Milestone**: M2.3
- **File(s)**: `src/middleware.ts:34-43`
- **Description**: The middleware sets several security headers but is missing Content-Security-Policy (CSP). CSP helps prevent XSS attacks by specifying which sources of content are allowed.
- **Impact**: Without CSP, the application has less protection against XSS if any bypass is found
- **Status**: Open
- **Current Headers**:
  - X-Frame-Options: DENY ✅
  - X-Content-Type-Options: nosniff ✅
  - Referrer-Policy: strict-origin-when-cross-origin ✅
  - Permissions-Policy: camera=(), microphone=(), geolocation=() ✅
  - X-XSS-Protection: 1; mode=block ✅
  - **Content-Security-Policy: MISSING** ❌
- **Recommendation**: Add CSP header with appropriate directives:
```typescript
response.headers.set(
  "Content-Security-Policy",
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
);
```

---

### ISSUE-026: Missing HSTS Header for Production
- **Severity**: Medium
- **Phase**: Phase 2
- **Milestone**: M2.3
- **File(s)**: `src/middleware.ts:34-43`
- **Description**: Strict-Transport-Security (HSTS) header is not set. In production, this header ensures browsers only connect via HTTPS.
- **Impact**: Without HSTS, users could be vulnerable to downgrade attacks on first visit
- **Status**: Open
- **Recommendation**: Add HSTS header for production:
```typescript
if (process.env.NODE_ENV === 'production') {
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
}
```

---

### ISSUE-027: Missing Database Indexes for Frequently Queried Fields
- **Severity**: Medium
- **Phase**: Phase 3
- **Milestone**: M3.1
- **File(s)**: `prisma/schema.prisma`
- **Description**: Several models are missing indexes on frequently queried fields, which can cause slow queries as data grows.
- **Impact**: Slower query performance, especially as data volume increases
- **Status**: Open
- **Missing Indexes**:
  - `Contact`: `@@index([lastContact])` - used for sorting
  - `Message`: `@@index([syncedToSheets])` - used in sync queries
  - `Message`: `@@index([direction])` - used in analytics filters
  - `AutoReplyRule`: `@@index([isActive])` - used for filtering active rules
  - `AutoReplyRule`: `@@index([priority])` - used for ordering
  - `SyncLog`: `@@index([createdAt])` - used for ordering
- **Recommendation**: Add the missing indexes to schema.prisma:
```prisma
model Contact {
  // ... existing fields
  @@index([lastContact])
}

model Message {
  // ... existing fields
  @@index([syncedToSheets])
  @@index([direction])
}

model AutoReplyRule {
  // ... existing fields
  @@index([isActive])
  @@index([priority])
}

model SyncLog {
  // ... existing fields
  @@index([createdAt])
}
```

---

### ISSUE-028: Analytics Rules Endpoint Loads All Messages Per Rule
- **Severity**: High
- **Phase**: Phase 3
- **Milestone**: M3.1
- **File(s)**: `src/app/api/analytics/rules/route.ts:28-40`
- **Description**: The analytics rules endpoint loads ALL messages for each rule using `include: { messages: {...} }`. This could cause severe memory issues and slow responses if rules have many associated messages.
- **Impact**:
  - High memory usage (could OOM with many messages)
  - Slow API response times
  - Potential server instability
- **Status**: Open
- **Current Code**:
```typescript
const rules = await prisma.autoReplyRule.findMany({
  include: {
    messages: {
      select: { id: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    },
  },
});
```
- **Recommendation**: Use `_count` and a separate query for recent messages:
```typescript
const rules = await prisma.autoReplyRule.findMany({
  select: {
    id: true,
    name: true,
    triggerType: true,
    isActive: true,
    priority: true,
    _count: { select: { messages: true } },
  },
});

// For each rule, get only the last message separately if needed
// Or use a raw query with GROUP BY for efficiency
```

---

### ISSUE-029: syncContacts Has No Limit on Query
- **Severity**: Low
- **Phase**: Phase 3
- **Milestone**: M3.1
- **File(s)**: `src/lib/google-sheets/sync.ts:16-18`
- **Description**: The `syncContacts` function loads all contacts without a limit, which could cause memory issues if there are many contacts.
- **Impact**: Memory issues with large contact lists
- **Status**: Open
- **Current Code**:
```typescript
const contacts = await prisma.contact.findMany({
  orderBy: { lastContact: "desc" },
});
```
- **Recommendation**: Add pagination or batching:
```typescript
const contacts = await prisma.contact.findMany({
  orderBy: { lastContact: "desc" },
  take: 10000, // Reasonable batch limit
});
```

---

### ISSUE-030: No Dynamic Imports for Heavy Components
- **Severity**: Low
- **Phase**: Phase 3
- **Milestone**: M3.2
- **File(s)**:
  - `src/app/(dashboard)/dashboard/contacts/page.tsx` - AlertDialog imported statically
  - `src/app/(dashboard)/dashboard/rules/page.tsx` - AlertDialog, RuleForm imported statically
  - `src/components/settings/BillingSettings.tsx` - Heavy component, 416 lines
- **Description**: Heavy components like AlertDialog, modals, and forms are imported statically instead of using Next.js dynamic() for code splitting. These components are not needed on initial render.
- **Impact**: Larger initial bundle size, slower Time to Interactive
- **Status**: Open
- **Recommendation**: Use dynamic imports for components not needed on first render:
```typescript
import dynamic from 'next/dynamic';

const AlertDialog = dynamic(
  () => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialog),
  { ssr: false }
);

const RuleForm = dynamic(
  () => import('@/components/rules/RuleForm'),
  { loading: () => <Skeleton className="h-96" /> }
);
```

---

### ISSUE-031: No React.memo on List Item Components
- **Severity**: Low
- **Phase**: Phase 3
- **Milestone**: M3.2
- **File(s)**:
  - `src/app/(dashboard)/dashboard/messages/page.tsx:176-211` - TableRow in map
  - `src/app/(dashboard)/dashboard/contacts/page.tsx` - TableRow in map
  - `src/app/(dashboard)/dashboard/rules/page.tsx` - TableRow in map
- **Description**: List pages render table rows inline without React.memo, which can cause unnecessary re-renders when parent state changes (e.g., pagination, search).
- **Impact**: Minor performance impact, unnecessary re-renders on state changes
- **Status**: Open
- **Current Pattern**:
```typescript
messages.map((message) => (
  <TableRow key={message.id}>
    {/* ... */}
  </TableRow>
))
```
- **Recommendation**: Extract row component and wrap with React.memo:
```typescript
const MessageRow = React.memo(function MessageRow({ message }) {
  return (
    <TableRow>
      {/* ... */}
    </TableRow>
  );
});

// Usage
messages.map((message) => <MessageRow key={message.id} message={message} />)
```

---

### ISSUE-032: Most API Endpoints Missing Cache-Control Headers
- **Severity**: Low
- **Phase**: Phase 3
- **Milestone**: M3.3
- **File(s)**:
  - `src/app/api/subscription/route.ts` - No caching
  - `src/app/api/usage/route.ts` - No caching
  - `src/app/api/settings/route.ts` - No caching
  - `src/app/api/rules/route.ts` - No caching
  - All other GET endpoints
- **Description**: Out of 37 API routes, only 4 have Cache-Control headers (3 analytics + 1 SSE). Cacheable endpoints like subscription status, settings, and rules list don't include caching headers.
- **Impact**:
  - Browser makes fresh requests every time
  - No stale-while-revalidate for faster perceived performance
  - CDN cannot cache responses
- **Status**: Open
- **Recommendation**: Add appropriate Cache-Control headers:
```typescript
// For user-specific, semi-static data (subscription, settings)
return NextResponse.json(data, {
  headers: {
    "Cache-Control": "private, max-age=300, stale-while-revalidate=600",
  },
});

// For frequently changing data (rules list)
return NextResponse.json(data, {
  headers: {
    "Cache-Control": "private, max-age=60, stale-while-revalidate=120",
  },
});
```

---

### ISSUE-033: No Server-Side Caching for Frequently Accessed Data
- **Severity**: Low
- **Phase**: Phase 3
- **Milestone**: M3.3
- **File(s)**:
  - `src/lib/services/plan.ts:42-52` - getFreePlan() queries DB every time
  - `src/lib/services/plan.ts:7-12` - getAllPlans() queries DB every time
  - `src/lib/services/subscription.ts` - getUserSubscription() queries DB every time
- **Description**: Frequently accessed data like plan information is queried from the database on every request. Plan data rarely changes but is queried multiple times per user action.
- **Impact**:
  - Unnecessary database queries
  - Increased latency for common operations
  - Higher database load
- **Status**: Open
- **Current Code**:
```typescript
export async function getFreePlan(): Promise<Plan> {
  const plan = await prisma.plan.findUnique({
    where: { slug: "free" },
  });
  // ... every call hits the database
}
```
- **Recommendation**: Implement simple in-memory cache:
```typescript
import { unstable_cache } from 'next/cache';

export const getFreePlan = unstable_cache(
  async () => {
    const plan = await prisma.plan.findUnique({
      where: { slug: "free" },
    });
    if (!plan) throw new Error("Free plan not found");
    return plan;
  },
  ['free-plan'],
  { revalidate: 3600 } // 1 hour
);
```

---

### ISSUE-034: Sidebar Not Mobile-Responsive
- **Severity**: Medium
- **Phase**: Phase 4
- **Milestone**: M4.1
- **File(s)**: `src/components/dashboard/Sidebar.tsx`
- **Description**: The sidebar component is collapsible on desktop but has no mobile-responsive behavior. On mobile screens, the sidebar is either always visible (taking up screen space) or hidden without a toggle mechanism. There's no hamburger menu or slide-out drawer for mobile users.
- **Impact**:
  - Poor mobile user experience
  - Navigation difficult on small screens
  - Dashboard layout broken on mobile
- **Status**: Open
- **Current Behavior**:
  - Sidebar uses `w-64` (256px) or `w-16` (64px collapsed) fixed width
  - Uses `md:flex` but no mobile overlay/drawer pattern
  - No mobile toggle button in Header
- **Recommendation**: Implement mobile drawer pattern:
```typescript
// Option A: Use Sheet component from shadcn/ui for mobile
const MobileSidebar = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" className="w-64 p-0">
      <SidebarContent />
    </SheetContent>
  </Sheet>
);

// Option B: Use CSS to hide sidebar on mobile, show with toggle
// Hidden by default on mobile: className="hidden md:flex"
// Toggle state managed by context or prop
```

---

### ISSUE-035: Messages Search Only Searches Content
- **Severity**: Low
- **Phase**: Phase 4
- **Milestone**: M4.2
- **File(s)**: `src/app/api/messages/route.ts:31-33`
- **Description**: The messages search only searches the `content` field, not contact name or phone number. Users expecting to find messages from a specific contact by name won't find results.
- **Impact**: Limited search functionality, user confusion
- **Status**: Open
- **Current Code**:
```typescript
if (search) {
  where.content = { contains: search };
}
```
- **Recommendation**: Add OR query to search contact as well:
```typescript
if (search) {
  where.OR = [
    { content: { contains: search } },
    { contact: { phone: { contains: search } } },
    { contact: { name: { contains: search } } },
  ];
}
```

---

### ISSUE-036: Pagination Arrows Don't Rotate for RTL
- **Severity**: Low
- **Phase**: Phase 4
- **Milestone**: M4.2
- **File(s)**:
  - `src/app/(dashboard)/dashboard/messages/page.tsx:229,239`
  - `src/app/(dashboard)/dashboard/contacts/page.tsx:191,201`
- **Description**: The ChevronLeft and ChevronRight icons used for pagination don't rotate in RTL mode. In RTL, "previous" should point right and "next" should point left, but currently they remain fixed.
- **Impact**: Confusing UX for Arabic users
- **Status**: Open
- **Current Code**:
```typescript
<ChevronLeft className="h-4 w-4" />
<ChevronRight className="h-4 w-4" />
```
- **Recommendation**: Add RTL rotation:
```typescript
<ChevronLeft className="h-4 w-4 rtl:rotate-180" />
<ChevronRight className="h-4 w-4 rtl:rotate-180" />
```

---

### ISSUE-037: Messages Page Missing loading.tsx
- **Severity**: Low
- **Phase**: Phase 4
- **Milestone**: M4.2
- **File(s)**: `src/app/(dashboard)/dashboard/messages/` (missing loading.tsx)
- **Description**: The messages page directory is missing a loading.tsx file. The contacts page has one at `src/app/(dashboard)/dashboard/contacts/loading.tsx`, but messages only has inline skeleton loading states.
- **Impact**: No route-level loading skeleton for messages page during navigation
- **Status**: Open
- **Recommendation**: Create `src/app/(dashboard)/dashboard/messages/loading.tsx` similar to contacts loading.tsx:
```typescript
// Copy and adapt from contacts/loading.tsx
export default function MessagesLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      {/* Search + filter skeleton */}
      {/* Table skeleton with 5 rows */}
      {/* Pagination skeleton */}
    </div>
  );
}
```

---

### ISSUE-038: Rules loading.tsx Layout Mismatch
- **Severity**: Low
- **Phase**: Phase 4
- **Milestone**: M4.3
- **File(s)**: `src/app/(dashboard)/dashboard/rules/loading.tsx`
- **Description**: The rules page loading.tsx shows a card grid layout, but the actual rules page uses a table layout. This causes a jarring visual transition when the page loads.
- **Impact**: Poor loading UX, layout shift during navigation
- **Status**: Open
- **Current Loading**:
```typescript
// Shows 6 cards in a grid
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {Array.from({ length: 6 }).map((_, i) => (
    <Card key={i}>...
```
- **Recommendation**: Update loading.tsx to show table skeleton:
```typescript
export default function RulesLoading() {
  return (
    <div className="space-y-6">
      {/* Header with create button skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      {/* Table skeleton */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>...</TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map(...)}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

---

### ISSUE-039: BillingSettings Uses Native confirm() Dialog
- **Severity**: Low
- **Phase**: Phase 4
- **Milestone**: M4.3
- **File(s)**: `src/components/settings/BillingSettings.tsx:107`
- **Description**: The cancel subscription button uses the native browser `confirm()` dialog instead of the styled AlertDialog component used elsewhere in the app.
- **Impact**: Inconsistent UX, native dialog doesn't match app styling
- **Status**: Open
- **Current Code**:
```typescript
const handleCancel = async () => {
  if (!confirm(t("cancelConfirm"))) return;  // Native confirm()
  // ...
};
```
- **Recommendation**: Replace with AlertDialog like DangerZone component:
```typescript
const [showCancelDialog, setShowCancelDialog] = useState(false);

<AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
  <AlertDialogTrigger asChild>
    <Button variant="outline" className="text-destructive">
      {t("cancelSubscription")}
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{t("cancelTitle")}</AlertDialogTitle>
      <AlertDialogDescription>{t("cancelConfirm")}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
      <AlertDialogAction onClick={handleCancel} className="bg-destructive">
        {t("confirmCancel")}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Statistics

| Severity | Open | Fixed | Total |
|----------|------|-------|-------|
| Critical | 1 | 0 | 1 |
| High | 6 | 0 | 6 |
| Medium | 14 | 0 | 14 |
| Low | 18 | 0 | 18 |
| **Total** | **39** | **0** | **39** |

---

## Last Updated
- Date: 2025-12-28
- By: Claude Code (M4.3 Review)
