import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "Admin123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });
  });

  test("should display stats cards", async ({ page }) => {
    await expect(page.locator('[data-testid="stats-total-messages"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-total-contacts"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-active-rules"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-today-messages"]')).toBeVisible();
  });

  test("should display recent messages section", async ({ page }) => {
    await expect(page.locator('[data-testid="recent-messages"]')).toBeVisible();
  });

  test("should display top contacts section", async ({ page }) => {
    await expect(page.locator('[data-testid="top-contacts"]')).toBeVisible();
  });

  test("should navigate to contacts page", async ({ page }) => {
    await page.click('[data-testid="nav-contacts"]');
    await expect(page).toHaveURL(/.*contacts/);
  });

  test("should navigate to messages page", async ({ page }) => {
    await page.click('[data-testid="nav-messages"]');
    await expect(page).toHaveURL(/.*messages/);
  });

  test("should navigate to settings page", async ({ page }) => {
    await page.click('[data-testid="nav-settings"]');
    await expect(page).toHaveURL(/.*settings/);
  });

  test("should navigate to rules page", async ({ page }) => {
    await page.click('[data-testid="nav-rules"]');
    await expect(page).toHaveURL(/.*rules/);
  });
});
