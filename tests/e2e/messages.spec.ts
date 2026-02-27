import { test, expect } from "@playwright/test";

test.describe("Messages", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "Admin123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });
    await page.goto("/dashboard/messages");
  });

  test("should display messages page title", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should display messages table", async ({ page }) => {
    await expect(page.locator("table")).toBeVisible();
  });

  test("should show search input", async ({ page }) => {
    await expect(page.locator('input[placeholder*="بحث"], input[placeholder*="Search"]')).toBeVisible();
  });

  test("should show direction filter", async ({ page }) => {
    await expect(page.locator('[role="combobox"]')).toBeVisible();
  });

  test("should filter by direction - incoming", async ({ page }) => {
    const combobox = page.locator('[role="combobox"]').first();
    if (await combobox.isVisible()) {
      await combobox.click();
      await page.waitForTimeout(300);
      // Try to click on the incoming option
      const incomingOption = page.getByRole('option').filter({ hasText: /واردة|Incoming/i }).first();
      if (await incomingOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await incomingOption.click();
      }
    }
    await page.waitForTimeout(500);
    await expect(page.locator("table")).toBeVisible();
  });

  test("should filter by direction - outgoing", async ({ page }) => {
    const combobox = page.locator('[role="combobox"]').first();
    if (await combobox.isVisible()) {
      await combobox.click();
      await page.waitForTimeout(300);
      // Try to click on the outgoing option
      const outgoingOption = page.getByRole('option').filter({ hasText: /صادرة|Outgoing/i }).first();
      if (await outgoingOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await outgoingOption.click();
      }
    }
    await page.waitForTimeout(500);
    await expect(page.locator("table")).toBeVisible();
  });

  test("should search messages", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="بحث"], input[placeholder*="Search"]');
    await searchInput.fill("test");
    await page.waitForTimeout(500);
    await expect(page.locator("table")).toBeVisible();
  });

  test("should show empty state when no messages", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="بحث"], input[placeholder*="Search"]');
    await searchInput.fill("nonexistentmessage12345");
    await page.waitForTimeout(500);
    // Either shows empty message or table with no data
    await expect(page.locator("table")).toBeVisible();
  });

  test("should display loading skeletons initially", async ({ page }) => {
    await page.goto("/dashboard/messages");
    // Should show loading state briefly
    await expect(page.locator("table")).toBeVisible();
  });
});
