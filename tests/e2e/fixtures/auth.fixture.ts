import { test as base, Page } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

// Extend the base test with authenticated page
export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsAdmin();
    await use(page);
  },
});

export { expect } from "@playwright/test";

// Helper function for manual login (when not using fixture)
export async function loginAsAdmin(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsAdmin();
}

// Test credentials
export const TEST_CREDENTIALS = {
  admin: {
    email: "admin@example.com",
    password: "admin123",
  },
};
