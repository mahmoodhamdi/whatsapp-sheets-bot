import { test } from "@playwright/test";
import path from "path";

const screenshotsDir = path.join(__dirname, "../../docs/screenshots");

test.describe("Screenshot Capture - All Pages", () => {
  // Login Page Screenshots
  test.describe("Login Page", () => {
    test("capture login page - Arabic", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");
      await page.screenshot({
        path: `${screenshotsDir}/01-login-ar.png`,
        fullPage: true,
      });
    });

    test("capture login page - English", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");
      // Switch to English
      await page.click('[data-testid="language-switcher"]');
      await page.click("text=English");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/02-login-en.png`,
        fullPage: true,
      });
    });

    test("capture login page - with error", async ({ page }) => {
      await page.goto("/login");
      await page.fill("#email", "wrong@email.com");
      await page.fill("#password", "wrongpassword");
      await page.click('button[type="submit"]');
      await page.waitForSelector(".text-red-500", { timeout: 5000 });
      await page.screenshot({
        path: `${screenshotsDir}/03-login-error.png`,
        fullPage: true,
      });
    });
  });

  // Dashboard Screenshots (requires login)
  test.describe("Dashboard Pages", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login");
      await page.fill("#email", "admin@example.com");
      await page.fill("#password", "Admin123!");
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/, { timeout: 10000 });
    });

    test("capture dashboard - main", async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: `${screenshotsDir}/04-dashboard-main.png`,
        fullPage: true,
      });
    });

    test("capture messages page - empty", async ({ page }) => {
      await page.goto("/dashboard/messages");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/05-messages-empty.png`,
        fullPage: true,
      });
    });

    test("capture contacts page - empty", async ({ page }) => {
      await page.goto("/dashboard/contacts");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/06-contacts-empty.png`,
        fullPage: true,
      });
    });

    test("capture rules page - with rules", async ({ page }) => {
      await page.goto("/dashboard/rules");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/07-rules-list.png`,
        fullPage: true,
      });
    });

    test("capture create rule page", async ({ page }) => {
      await page.goto("/dashboard/rules/new");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/08-rules-create.png`,
        fullPage: true,
      });
    });

    test("capture settings page", async ({ page }) => {
      await page.goto("/dashboard/settings");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/09-settings-main.png`,
        fullPage: true,
      });
    });

    test("capture whatsapp settings page", async ({ page }) => {
      await page.goto("/dashboard/settings/whatsapp");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/10-settings-whatsapp.png`,
        fullPage: true,
      });
    });

    test("capture sheets settings page", async ({ page }) => {
      await page.goto("/dashboard/settings/sheets");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/11-settings-sheets.png`,
        fullPage: true,
      });
    });

    // Dark mode screenshots
    test("capture dashboard - dark mode", async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");
      // Toggle dark mode if theme switcher exists
      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(500);
      } else {
        // Force dark mode via class
        await page.evaluate(() => {
          document.documentElement.classList.add("dark");
        });
        await page.waitForTimeout(500);
      }
      await page.screenshot({
        path: `${screenshotsDir}/12-dashboard-dark.png`,
        fullPage: true,
      });
    });

    test("capture rules page - dark mode", async ({ page }) => {
      await page.goto("/dashboard/rules");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => {
        document.documentElement.classList.add("dark");
      });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/13-rules-dark.png`,
        fullPage: true,
      });
    });

    // Mobile responsive screenshots
    test("capture dashboard - mobile view", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/14-dashboard-mobile.png`,
        fullPage: true,
      });
    });

    test("capture rules page - mobile view", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/dashboard/rules");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/15-rules-mobile.png`,
        fullPage: true,
      });
    });

    // User menu screenshot
    test("capture user menu open", async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");
      await page.click('[data-testid="user-menu"]');
      await page.waitForTimeout(300);
      await page.screenshot({
        path: `${screenshotsDir}/16-user-menu.png`,
        fullPage: true,
      });
    });

    // Delete confirmation dialog
    test("capture delete confirmation dialog", async ({ page }) => {
      await page.goto("/dashboard/rules");
      await page.waitForLoadState("networkidle");
      await page.waitForSelector("table tbody tr", { timeout: 5000 });
      const deleteButton = page.locator('[data-testid="delete-rule-0"]');
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForTimeout(300);
        await page.screenshot({
          path: `${screenshotsDir}/17-delete-dialog.png`,
          fullPage: true,
        });
      }
    });

    // Additional screenshots for comprehensive coverage
    test("capture messages page - dark mode", async ({ page }) => {
      await page.goto("/dashboard/messages");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => {
        document.documentElement.classList.add("dark");
      });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/18-messages-dark.png`,
        fullPage: true,
      });
    });

    test("capture contacts page - dark mode", async ({ page }) => {
      await page.goto("/dashboard/contacts");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => {
        document.documentElement.classList.add("dark");
      });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/19-contacts-dark.png`,
        fullPage: true,
      });
    });

    test("capture settings page - dark mode", async ({ page }) => {
      await page.goto("/dashboard/settings");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => {
        document.documentElement.classList.add("dark");
      });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/20-settings-dark.png`,
        fullPage: true,
      });
    });

    test("capture create rule form filled", async ({ page }) => {
      await page.goto("/dashboard/rules/new");
      await page.waitForLoadState("networkidle");
      // Fill the form
      await page.fill("#name", "Welcome Message");
      await page.fill("#trigger", "hello");
      await page.fill("#response", "Welcome! How can I help you today?");
      await page.fill("#priority", "100");
      await page.waitForTimeout(300);
      await page.screenshot({
        path: `${screenshotsDir}/21-rules-form-filled.png`,
        fullPage: true,
      });
    });

    test("capture messages page - mobile view", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/dashboard/messages");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/22-messages-mobile.png`,
        fullPage: true,
      });
    });

    test("capture contacts page - mobile view", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/dashboard/contacts");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/23-contacts-mobile.png`,
        fullPage: true,
      });
    });

    test("capture settings page - mobile view", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/dashboard/settings");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/24-settings-mobile.png`,
        fullPage: true,
      });
    });

    test("capture sidebar navigation", async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");
      // Hover over navigation items
      await page.hover('[data-testid="nav-rules"]');
      await page.waitForTimeout(300);
      await page.screenshot({
        path: `${screenshotsDir}/25-sidebar-hover.png`,
        fullPage: true,
      });
    });

    test("capture login page - dark mode", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => {
        document.documentElement.classList.add("dark");
      });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/26-login-dark.png`,
        fullPage: true,
      });
    });

    test("capture whatsapp settings - dark mode", async ({ page }) => {
      await page.goto("/dashboard/settings/whatsapp");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => {
        document.documentElement.classList.add("dark");
      });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/27-whatsapp-dark.png`,
        fullPage: true,
      });
    });

    test("capture sheets settings - dark mode", async ({ page }) => {
      await page.goto("/dashboard/settings/sheets");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => {
        document.documentElement.classList.add("dark");
      });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotsDir}/28-sheets-dark.png`,
        fullPage: true,
      });
    });
  });
});
