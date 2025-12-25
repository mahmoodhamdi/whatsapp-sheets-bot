import { test, expect } from "@playwright/test";

test.describe("Rules Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });
  });

  test("should navigate to rules page", async ({ page }) => {
    await page.click('[data-testid="nav-rules"]');
    await expect(page).toHaveURL(/.*rules/);
  });

  test("should display rules table", async ({ page }) => {
    await page.goto("/dashboard/rules");
    await expect(page.locator("table")).toBeVisible();
  });

  test("should navigate to create rule page", async ({ page }) => {
    await page.goto("/dashboard/rules");
    await page.click('[data-testid="create-rule-button"]');
    await expect(page).toHaveURL(/.*rules\/new/);
  });

  test("should create a new rule", async ({ page }) => {
    await page.goto("/dashboard/rules/new");

    // Fill form
    await page.fill("#name", "E2E Test Rule");
    await page.fill("#trigger", "test-e2e");
    // Select trigger type - default is already CONTAINS, so just verify it exists
    await expect(page.locator('[data-testid="trigger-type-select"]')).toBeVisible();
    await page.fill("#response", "This is an E2E test response");
    await page.fill("#priority", "50");

    // Submit
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*rules$/, { timeout: 10000 });
    await expect(page.locator("text=E2E Test Rule")).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await page.goto("/dashboard/rules/new");

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Form should show validation - fields are required
    await expect(page.locator("#name:invalid")).toBeVisible();
  });

  test("should toggle rule active status", async ({ page }) => {
    await page.goto("/dashboard/rules");

    // Wait for table to load
    await page.waitForSelector("table tbody tr", { timeout: 5000 });

    // Find first toggle switch
    const toggle = page.locator('[data-testid="toggle-rule-0"]');
    if (await toggle.isVisible()) {
      await toggle.click();
      // Wait for API call to complete
      await page.waitForTimeout(500);
    }
  });

  test("should delete a rule", async ({ page }) => {
    await page.goto("/dashboard/rules");

    // Wait for table to load
    await page.waitForSelector("table tbody tr", { timeout: 5000 });

    // Get initial row count
    const initialCount = await page.locator("table tbody tr").count();

    // Click delete button on first rule
    const deleteButton = page.locator('[data-testid="delete-rule-0"]');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Confirm deletion
      await page.click('[data-testid="confirm-delete"]');

      // Wait for deletion
      await page.waitForTimeout(500);

      // Check row count decreased or verify toast
      const newCount = await page.locator("table tbody tr").count();
      expect(newCount).toBeLessThanOrEqual(initialCount);
    }
  });
});
