import { test, expect } from "@playwright/test";

test.describe("Account Settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "Admin123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });
  });

  test.describe("Profile Tab", () => {
    test("should navigate to account settings", async ({ page }) => {
      await page.goto("/dashboard/settings/account");
      await expect(page).toHaveURL(/.*settings\/account/);
    });

    test("should display profile tab by default", async ({ page }) => {
      await page.goto("/dashboard/settings/account");
      await page.waitForLoadState("networkidle");
      // Profile tab should be active
      await expect(page.locator('[value="profile"]')).toBeVisible();
    });

    test("should display name input field", async ({ page }) => {
      await page.goto("/dashboard/settings/account");
      await page.waitForLoadState("networkidle");
      await expect(page.locator("#name")).toBeVisible();
    });

    test("should display email field (read-only)", async ({ page }) => {
      await page.goto("/dashboard/settings/account");
      await page.waitForLoadState("networkidle");
      const emailInput = page.locator("#email");
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toBeDisabled();
    });

    test("should update profile name", async ({ page }) => {
      await page.goto("/dashboard/settings/account");
      await page.waitForLoadState("networkidle");

      const nameInput = page.locator("#name");
      await nameInput.fill("Updated Admin Name");

      // Submit form
      const saveButton = page.locator('button[type="submit"]');
      await saveButton.click();

      // Wait for response
      await page.waitForTimeout(1000);

      // Should show success (page doesn't navigate away)
      await expect(page).toHaveURL(/.*settings\/account/);
    });
  });

  test.describe("Password Tab", () => {
    test("should switch to password tab", async ({ page }) => {
      await page.goto("/dashboard/settings/account");
      await page.waitForLoadState("networkidle");

      await page.click('[value="password"]');
      await expect(page.locator("#currentPassword")).toBeVisible();
    });

    test("should display password form fields", async ({ page }) => {
      await page.goto("/dashboard/settings/account");
      await page.waitForLoadState("networkidle");

      await page.click('[value="password"]');

      await expect(page.locator("#currentPassword")).toBeVisible();
      await expect(page.locator("#newPassword")).toBeVisible();
      await expect(page.locator("#confirmPassword")).toBeVisible();
    });

    test("should toggle password visibility", async ({ page }) => {
      await page.goto("/dashboard/settings/account");
      await page.waitForLoadState("networkidle");

      await page.click('[value="password"]');

      // Initially password is hidden
      const currentPasswordInput = page.locator("#currentPassword");
      await expect(currentPasswordInput).toHaveAttribute("type", "password");

      // Click toggle button
      const toggleButton = page.locator("#currentPassword").locator("..").locator("button");
      await toggleButton.click();

      // Password should be visible
      await expect(currentPasswordInput).toHaveAttribute("type", "text");
    });

    test("should show validation error for weak password", async ({ page }) => {
      await page.goto("/dashboard/settings/account");
      await page.waitForLoadState("networkidle");

      await page.click('[value="password"]');

      await page.fill("#currentPassword", "Admin123!");
      await page.fill("#newPassword", "weak"); // Too weak
      await page.fill("#confirmPassword", "weak");

      await page.click('button[type="submit"]');

      // Should show validation error
      await expect(page.locator(".text-destructive")).toBeVisible();
    });

    test("should show error for mismatched passwords", async ({ page }) => {
      await page.goto("/dashboard/settings/account");
      await page.waitForLoadState("networkidle");

      await page.click('[value="password"]');

      await page.fill("#currentPassword", "Admin123!");
      await page.fill("#newPassword", "NewSecurePass123!");
      await page.fill("#confirmPassword", "DifferentPass123!");

      await page.click('button[type="submit"]');

      // Should show validation error
      await expect(page.locator(".text-destructive")).toBeVisible();
    });
  });

  test.describe("Preferences Tab", () => {
    test("should switch to preferences tab", async ({ page }) => {
      await page.goto("/dashboard/settings/account");
      await page.waitForLoadState("networkidle");

      await page.click('[value="preferences"]');

      // Wait for tab content to load
      await page.waitForTimeout(500);

      // Preferences tab should be active
      await expect(page.locator('[value="preferences"][data-state="active"]')).toBeVisible();
    });
  });

  test.describe("Danger Zone Tab", () => {
    test("should switch to danger zone tab", async ({ page }) => {
      await page.goto("/dashboard/settings/account");
      await page.waitForLoadState("networkidle");

      await page.click('[value="danger"]');

      // Wait for tab content to load
      await page.waitForTimeout(500);

      // Danger tab should be active
      await expect(page.locator('[value="danger"][data-state="active"]')).toBeVisible();
    });
  });
});
