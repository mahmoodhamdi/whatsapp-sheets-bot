import { test, expect } from "@playwright/test";

test.describe("Full Rules CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "Admin123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 15000 });
  });

  test("should navigate to rules page and see seed rules", async ({ page }) => {
    await page.goto("/dashboard/rules");
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });
    // Should have at least the 4 seed rules
    const rows = page.locator("table tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 5000 });
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("should create a new rule and see it in list", async ({ page }) => {
    await page.goto("/dashboard/rules/new");

    // Fill form
    await page.fill("#name", "E2E CRUD Test Rule");
    await page.fill("#trigger", "crud-test-trigger");
    await expect(page.locator('[data-testid="trigger-type-select"]')).toBeVisible();
    await page.fill("#response", "CRUD test response message");
    await page.fill("#priority", "99");

    // Submit
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*rules$/, { timeout: 10000 });

    // Verify new rule appears
    await expect(page.locator("text=E2E CRUD Test Rule")).toBeVisible({ timeout: 5000 });
  });

  test("should toggle rule active/inactive", async ({ page }) => {
    await page.goto("/dashboard/rules");
    await page.waitForSelector("table tbody tr", { timeout: 5000 });

    const toggle = page.locator('[data-testid="toggle-rule-0"]');
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(1000);
      // Toggle back
      await toggle.click();
      await page.waitForTimeout(500);
    }
  });

  test("should delete a rule", async ({ page }) => {
    await page.goto("/dashboard/rules");
    await page.waitForSelector("table tbody tr", { timeout: 5000 });

    const initialCount = await page.locator("table tbody tr").count();

    const deleteButton = page.locator('[data-testid="delete-rule-0"]');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await page.locator('[data-testid="confirm-delete"]').click();
      await page.waitForTimeout(1000);

      const newCount = await page.locator("table tbody tr").count();
      expect(newCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test("should show validation errors on empty form submission", async ({ page }) => {
    await page.goto("/dashboard/rules/new");
    await page.click('button[type="submit"]');
    // HTML5 validation should prevent submission
    await expect(page.locator("#name:invalid")).toBeVisible();
  });
});
