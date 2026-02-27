import { test, expect } from "@playwright/test";

test.describe("Settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "Admin123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });
  });

  test.describe("Main Settings Page", () => {
    test("should display settings page", async ({ page }) => {
      await page.goto("/dashboard/settings");
      await expect(page.locator("h1")).toBeVisible();
    });

    test("should navigate to account settings", async ({ page }) => {
      await page.goto("/dashboard/settings");
      const accountLink = page.locator('a[href="/dashboard/settings/account"]');
      if (await accountLink.isVisible()) {
        await accountLink.click();
        await expect(page).toHaveURL(/.*settings\/account/);
      }
    });

    test("should navigate to billing settings", async ({ page }) => {
      await page.goto("/dashboard/settings");
      const billingLink = page.locator('a[href="/dashboard/settings/billing"]');
      if (await billingLink.isVisible()) {
        await billingLink.click();
        await expect(page).toHaveURL(/.*settings\/billing/);
      }
    });

    test("should display general settings card", async ({ page }) => {
      await page.goto("/dashboard/settings");
      await expect(page.locator("#businessName")).toBeVisible();
    });

    test("should display default reply textarea", async ({ page }) => {
      await page.goto("/dashboard/settings");
      await expect(page.locator("#defaultReply")).toBeVisible();
    });

    test("should display WhatsApp status card", async ({ page }) => {
      await page.goto("/dashboard/settings");
      await expect(page.locator('a[href="/dashboard/settings/whatsapp"]')).toBeVisible();
    });

    test("should display Google Sheets card", async ({ page }) => {
      await page.goto("/dashboard/settings");
      await expect(page.locator('a[href="/dashboard/settings/sheets"]')).toBeVisible();
    });

    test("should update business name", async ({ page }) => {
      await page.goto("/dashboard/settings");
      const businessInput = page.locator("#businessName");
      await businessInput.fill("Test Business Name");
      await expect(businessInput).toHaveValue("Test Business Name");
    });

    test("should update default reply", async ({ page }) => {
      await page.goto("/dashboard/settings");
      const replyInput = page.locator("#defaultReply");
      await replyInput.fill("Test auto-reply message");
      await expect(replyInput).toHaveValue("Test auto-reply message");
    });

    test("should have save button", async ({ page }) => {
      await page.goto("/dashboard/settings");
      await expect(page.locator('button:has-text("حفظ"), button:has-text("Save")')).toBeVisible();
    });
  });

  test.describe("WhatsApp Settings Page", () => {
    test("should navigate to WhatsApp settings", async ({ page }) => {
      await page.goto("/dashboard/settings/whatsapp");
      await expect(page).toHaveURL(/.*settings\/whatsapp/);
    });

    test("should display WhatsApp connection status", async ({ page }) => {
      await page.goto("/dashboard/settings/whatsapp");
      await page.waitForLoadState("networkidle");
      // Page should load successfully
      await expect(page.locator("h1")).toBeVisible();
    });

    test("should display connect/disconnect button", async ({ page }) => {
      await page.goto("/dashboard/settings/whatsapp");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      // Should have either connect or disconnect button
      const connectBtn = page.locator('button:has-text("اتصال"), button:has-text("Connect")');
      const disconnectBtn = page.locator('button:has-text("قطع"), button:has-text("Disconnect")');
      const hasConnect = await connectBtn.isVisible().catch(() => false);
      const hasDisconnect = await disconnectBtn.isVisible().catch(() => false);
      expect(hasConnect || hasDisconnect).toBeTruthy();
    });
  });

  test.describe("Google Sheets Settings Page", () => {
    test("should navigate to Sheets settings", async ({ page }) => {
      await page.goto("/dashboard/settings/sheets");
      await expect(page).toHaveURL(/.*settings\/sheets/);
    });

    test("should display Sheets configuration", async ({ page }) => {
      await page.goto("/dashboard/settings/sheets");
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toBeVisible();
    });

    test("should display sync button", async ({ page }) => {
      await page.goto("/dashboard/settings/sheets");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      // Should have sync or configure button
      const syncBtn = page.locator('button:has-text("مزامنة"), button:has-text("Sync")');
      await expect(syncBtn.first()).toBeVisible();
    });
  });
});
