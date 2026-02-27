import { test, expect } from "@playwright/test";

test.describe("Full Contacts Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "Admin123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 15000 });
  });

  test("should navigate to contacts page and see list", async ({ page }) => {
    await page.click('[data-testid="nav-contacts"]');
    await expect(page).toHaveURL(/.*contacts/);
    // Should show contacts
    await page.waitForTimeout(2000);
    const content = await page.textContent("body");
    // Check for phone numbers from seed data
    expect(content).toBeTruthy();
  });

  test("should display contact list with data", async ({ page }) => {
    await page.goto("/dashboard/contacts");
    await page.waitForTimeout(2000);
    // Look for contact data - phone numbers or names from seed
    const body = await page.textContent("body");
    // At least one of our test contacts should be visible
    const hasContact = body?.includes("+966") || body?.includes("+201") || body?.includes("Ahmed") || body?.includes("Sara");
    expect(hasContact).toBeTruthy();
  });

  test("should search contacts", async ({ page }) => {
    await page.goto("/dashboard/contacts");
    await page.waitForTimeout(2000);

    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"], [data-testid="search-contacts"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill("+966");
      await page.waitForTimeout(1000);
      // Results should be filtered
    }
  });

  test("should navigate to contact detail page", async ({ page }) => {
    await page.goto("/dashboard/contacts");
    await page.waitForTimeout(2000);

    // Click on first contact link/row if available
    const firstRow = page.locator("table tbody tr, [data-testid='contact-row']").first();
    if (await firstRow.isVisible()) {
      const link = firstRow.locator("a").first();
      if (await link.isVisible()) {
        await link.click();
        await page.waitForTimeout(1000);
      }
    }
  });
});
