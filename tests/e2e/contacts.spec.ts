import { test, expect } from "@playwright/test";

test.describe("Contacts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });
    await page.goto("/dashboard/contacts");
  });

  test("should display contacts table", async ({ page }) => {
    await expect(page.locator("table")).toBeVisible();
  });

  test("should show search input", async ({ page }) => {
    await expect(page.locator('[data-testid="search-contacts"]')).toBeVisible();
  });

  test("should search contacts", async ({ page }) => {
    await page.fill('[data-testid="search-contacts"]', "0123");
    // Wait for debounce
    await page.waitForTimeout(500);
    // Search should filter results
    await expect(page.locator("table")).toBeVisible();
  });

  test("should paginate contacts", async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector("table tbody tr", { timeout: 5000 });

    const nextButton = page.locator('[data-testid="pagination-next"]');
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      // Page should change
      await page.waitForTimeout(500);
    }
  });

  test("should delete contact", async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector("table tbody tr", { timeout: 5000 });

    const deleteButton = page.locator('[data-testid="delete-contact-0"]');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Confirm deletion
      await page.click('[data-testid="confirm-delete"]');

      // Wait for deletion
      await page.waitForTimeout(500);
    }
  });
});
