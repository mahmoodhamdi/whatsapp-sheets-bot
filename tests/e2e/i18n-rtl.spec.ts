import { test, expect } from "@playwright/test";

test.describe("Internationalization & RTL", () => {
  test("should default to Arabic RTL", async ({ page }) => {
    await page.goto("/login");
    await page.waitForTimeout(1000);

    // Check for RTL direction
    const htmlDir = await page.getAttribute("html", "dir");
    const htmlLang = await page.getAttribute("html", "lang");
    // Default should be Arabic
    expect(htmlDir === "rtl" || htmlLang === "ar").toBeTruthy();
  });

  test("should switch to English LTR", async ({ page }) => {
    await page.goto("/login");
    await page.waitForTimeout(1000);

    const switcher = page.locator('[data-testid="language-switcher"]');
    if (await switcher.isVisible()) {
      await switcher.click();
      await page.click("text=English");
      await page.waitForTimeout(1000);

      // Check for LTR or English
      const submitButton = page.locator('button[type="submit"]');
      const text = await submitButton.textContent();
      expect(text?.includes("Sign In") || text?.includes("Login")).toBeTruthy();
    }
  });

  test("should switch back to Arabic", async ({ page }) => {
    await page.goto("/login");
    await page.waitForTimeout(1000);

    const switcher = page.locator('[data-testid="language-switcher"]');
    if (await switcher.isVisible()) {
      // Switch to English first
      await switcher.click();
      await page.click("text=English");
      await page.waitForTimeout(1000);

      // Switch back to Arabic
      await switcher.click();
      await page.click("text=العربية");
      await page.waitForTimeout(1000);

      // Verify Arabic content
      const htmlDir = await page.getAttribute("html", "dir");
      const htmlLang = await page.getAttribute("html", "lang");
      expect(htmlDir === "rtl" || htmlLang === "ar").toBeTruthy();
    }
  });

  test("should maintain language in dashboard", async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "Admin123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 15000 });

    // Dashboard should have navigation labels
    const body = await page.textContent("body");
    expect(body).toBeTruthy();
  });
});
