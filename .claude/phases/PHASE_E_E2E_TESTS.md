# Phase E: E2E Tests

## Overview
إعداد Playwright وكتابة E2E Tests شاملة.

## Tasks

### Task 1: Setup Playwright
**Install:**
```bash
npm install -D @playwright/test
npx playwright install
```

**File:** `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Update:** `package.json`
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### Task 2: Auth Flow Tests
**File:** `tests/e2e/auth.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page for unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wrong@email.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('.text-destructive')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should switch language', async ({ page }) => {
    await page.goto('/login');
    await page.click('[data-testid="language-switcher"]');
    await page.click('text=English');
    await expect(page.locator('h1')).toContainText('Login');
  });
});
```

### Task 3: Rules CRUD Tests
**File:** `tests/e2e/rules.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Rules Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);
  });

  test('should navigate to rules page', async ({ page }) => {
    await page.click('text=Rules');
    await expect(page).toHaveURL(/.*rules/);
  });

  test('should create a new rule', async ({ page }) => {
    await page.goto('/dashboard/rules/new');

    await page.fill('input[name="name"]', 'Test Rule');
    await page.fill('input[name="trigger"]', 'hello');
    await page.selectOption('select[name="triggerType"]', 'CONTAINS');
    await page.fill('textarea[name="response"]', 'Hi there!');
    await page.fill('input[name="priority"]', '10');

    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*rules$/);
    await expect(page.locator('text=Test Rule')).toBeVisible();
  });

  test('should edit an existing rule', async ({ page }) => {
    await page.goto('/dashboard/rules');
    await page.click('[data-testid="edit-rule-0"]');

    await page.fill('input[name="name"]', 'Updated Rule');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*rules$/);
    await expect(page.locator('text=Updated Rule')).toBeVisible();
  });

  test('should toggle rule active status', async ({ page }) => {
    await page.goto('/dashboard/rules');
    const toggle = page.locator('[data-testid="toggle-rule-0"]');

    const initialState = await toggle.isChecked();
    await toggle.click();

    await expect(toggle).toHaveAttribute('data-state', initialState ? 'unchecked' : 'checked');
  });

  test('should delete a rule', async ({ page }) => {
    await page.goto('/dashboard/rules');
    const ruleCount = await page.locator('[data-testid^="rule-row-"]').count();

    await page.click('[data-testid="delete-rule-0"]');
    await page.click('button:has-text("Delete")'); // Confirm dialog

    await expect(page.locator('[data-testid^="rule-row-"]')).toHaveCount(ruleCount - 1);
  });

  test('should validate regex pattern', async ({ page }) => {
    await page.goto('/dashboard/rules/new');

    await page.fill('input[name="name"]', 'Regex Rule');
    await page.fill('input[name="trigger"]', '[invalid(regex');
    await page.selectOption('select[name="triggerType"]', 'REGEX');
    await page.fill('textarea[name="response"]', 'Response');

    await page.click('button[type="submit"]');
    await expect(page.locator('.text-destructive')).toBeVisible();
  });
});
```

### Task 4: Dashboard Tests
**File:** `tests/e2e/dashboard.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);
  });

  test('should display stats cards', async ({ page }) => {
    await expect(page.locator('[data-testid="stats-total-messages"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-total-contacts"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-active-rules"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-today-messages"]')).toBeVisible();
  });

  test('should display recent messages', async ({ page }) => {
    await expect(page.locator('[data-testid="recent-messages"]')).toBeVisible();
  });

  test('should display top contacts', async ({ page }) => {
    await expect(page.locator('[data-testid="top-contacts"]')).toBeVisible();
  });

  test('should navigate to contacts page', async ({ page }) => {
    await page.click('text=Contacts');
    await expect(page).toHaveURL(/.*contacts/);
  });

  test('should navigate to messages page', async ({ page }) => {
    await page.click('text=Messages');
    await expect(page).toHaveURL(/.*messages/);
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.click('text=Settings');
    await expect(page).toHaveURL(/.*settings/);
  });
});
```

### Task 5: Contacts Tests
**File:** `tests/e2e/contacts.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Contacts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.goto('/dashboard/contacts');
  });

  test('should display contacts table', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
  });

  test('should search contacts', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '0123');
    await page.waitForTimeout(500); // Debounce
    // Verify filtered results
  });

  test('should paginate contacts', async ({ page }) => {
    const nextButton = page.locator('button:has-text("Next")');
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await expect(page).toHaveURL(/.*page=2/);
    }
  });

  test('should delete contact', async ({ page }) => {
    await page.click('[data-testid="delete-contact-0"]');
    await page.click('button:has-text("Delete")');
    // Verify contact removed
  });
});
```

### Task 6: Add Test IDs to Components

**Components to update:**
- `Header.tsx` - add `data-testid="user-menu"`, `data-testid="logout-button"`
- `LanguageSwitcher.tsx` - add `data-testid="language-switcher"`
- `StatsCard.tsx` - add `data-testid="stats-{type}"`
- Rules page - add `data-testid="edit-rule-{index}"`, `data-testid="delete-rule-{index}"`
- Contacts page - add `data-testid="delete-contact-{index}"`

### Task 7: Update CI/CD
**File:** `.github/workflows/ci.yml`

Add E2E test job:
```yaml
e2e:
  needs: test
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: "20"
    - run: npm ci
    - run: npx playwright install --with-deps
    - run: npm run test:e2e
    - uses: actions/upload-artifact@v4
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
```

## Validation

1. Run `npm run test:e2e` - all tests should pass
2. Run `npm run test:e2e:ui` - verify in UI mode
3. Check CI/CD pipeline runs E2E tests

## Files to Create/Modify

| File | Action |
|------|--------|
| `playwright.config.ts` | Create |
| `tests/e2e/auth.spec.ts` | Create |
| `tests/e2e/rules.spec.ts` | Create |
| `tests/e2e/dashboard.spec.ts` | Create |
| `tests/e2e/contacts.spec.ts` | Create |
| `package.json` | Add scripts |
| `.github/workflows/ci.yml` | Add e2e job |
| Components | Add test IDs |

---

## Prompt for Claude

```
اشتغل على Phase E من الخطة - E2E Tests.

المطلوب:
1. Install Playwright: npm install -D @playwright/test && npx playwright install
2. أنشئ `playwright.config.ts`
3. أنشئ `tests/e2e/auth.spec.ts` - tests للـ authentication flow
4. أنشئ `tests/e2e/rules.spec.ts` - tests للـ rules CRUD
5. أنشئ `tests/e2e/dashboard.spec.ts` - tests للـ dashboard
6. أنشئ `tests/e2e/contacts.spec.ts` - tests للـ contacts
7. أضف data-testid للـ components المطلوبة
8. حدث package.json بالـ scripts الجديدة
9. حدث CI/CD ليشغل الـ E2E tests

لما تخلص:
- شغل npm run test:e2e
- أعطيني تقرير بالنتائج
- أي tests فشلت وإزاي نصلحها
```
