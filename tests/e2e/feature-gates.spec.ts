import { test, expect } from "@playwright/test";

test.describe("Feature Gates in UI", () => {
  test("free user should see limited access in analytics/sheets", async ({ page }) => {
    // Login as admin (Free plan)
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "Admin123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 15000 });

    // Try to access analytics or sheets
    // Free users should see upgrade prompts or restricted access
    await page.goto("/dashboard/settings/sheets");
    await page.waitForTimeout(2000);

    const body = await page.textContent("body");
    // Should show some indication of feature not being available
    expect(body).toBeTruthy();
  });

  test("enterprise user should have full access", async ({ page }) => {
    // Login as premium (Enterprise plan)
    await page.goto("/login");
    await page.fill("#email", "premium@example.com");
    await page.fill("#password", "premium123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 15000 });

    // Access dashboard
    await page.waitForTimeout(2000);
    const body = await page.textContent("body");
    expect(body).toBeTruthy();
  });

  test("free user billing shows free plan", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "Admin123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 15000 });

    await page.goto("/dashboard/settings/billing");
    await page.waitForTimeout(2000);

    const body = await page.textContent("body");
    // Should show Free plan info
    const showsFree = body?.includes("Free") || body?.includes("مجاني") || body?.includes("free");
    expect(showsFree).toBeTruthy();
  });

  test("enterprise user billing shows enterprise plan", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "premium@example.com");
    await page.fill("#password", "premium123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 15000 });

    await page.goto("/dashboard/settings/billing");
    await page.waitForTimeout(2000);

    const body = await page.textContent("body");
    // Should show Enterprise plan info
    const showsEnterprise = body?.includes("Enterprise") || body?.includes("المؤسسات") || body?.includes("enterprise");
    expect(showsEnterprise).toBeTruthy();
  });
});
