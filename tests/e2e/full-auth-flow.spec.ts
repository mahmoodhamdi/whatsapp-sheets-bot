import { test, expect } from "@playwright/test";

test.describe("Full Authentication Flow", () => {
  test("should show login page with form fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should redirect unauthenticated users from dashboard to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*login/);
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "wrong@email.com");
    await page.fill("#password", "WrongPass123");
    await page.click('button[type="submit"]');
    await expect(page.locator(".text-red-500")).toBeVisible({ timeout: 5000 });
  });

  test("should login with valid credentials and reach dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "Admin123!");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  });

  test("should logout and redirect to login", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "Admin123!");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
  });

  test("should show register page with form fields", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
  });

  test("should redirect protected pages to login without auth", async ({ page }) => {
    const protectedPages = [
      "/dashboard",
      "/dashboard/rules",
      "/dashboard/contacts",
      "/dashboard/messages",
      "/dashboard/settings",
    ];
    for (const path of protectedPages) {
      await page.goto(path);
      await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
    }
  });
});
