import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show login page for unauthenticated users", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*login/);
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "wrong@email.com");
    await page.fill("#password", "wrongpassword");
    await page.click('button[type="submit"]');
    // Wait for error message to appear
    await expect(page.locator(".text-red-500")).toBeVisible();
  });

  test("should login with valid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
  });

  test("should logout successfully", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "admin123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Logout - click avatar to open menu
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
  });

  test("should switch language", async ({ page }) => {
    await page.goto("/login");
    // Click language switcher
    await page.click('[data-testid="language-switcher"]');
    await page.click("text=English");
    // Page should now be in English
    await expect(page.locator('button[type="submit"]')).toContainText("Sign In");
  });
});
