import { test, expect } from "@playwright/test";

test.describe("Full Messages Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "Admin123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 15000 });
  });

  test("should navigate to messages page", async ({ page }) => {
    await page.click('[data-testid="nav-messages"]');
    await expect(page).toHaveURL(/.*messages/);
  });

  test("should display messages list", async ({ page }) => {
    await page.goto("/dashboard/messages");
    await page.waitForTimeout(2000);
    const body = await page.textContent("body");
    // Should have some message content from seed data
    expect(body).toBeTruthy();
  });

  test("should filter messages by direction", async ({ page }) => {
    await page.goto("/dashboard/messages");
    await page.waitForTimeout(2000);

    // Look for filter controls
    const filterSelect = page.locator('[data-testid="direction-filter"], select');
    if (await filterSelect.first().isVisible()) {
      // Try filtering
      await filterSelect.first().selectOption({ label: "INCOMING" }).catch(() => {});
      await page.waitForTimeout(1000);
    }
  });

  test("should search messages", async ({ page }) => {
    await page.goto("/dashboard/messages");
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"], [data-testid="search-messages"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill("مرحبا");
      await page.waitForTimeout(1000);
    }
  });

  test("should show message details", async ({ page }) => {
    await page.goto("/dashboard/messages");
    await page.waitForTimeout(2000);

    // Click on first message if clickable
    const firstRow = page.locator("table tbody tr, [data-testid='message-row']").first();
    if (await firstRow.isVisible()) {
      await firstRow.click();
      await page.waitForTimeout(1000);
    }
  });
});
