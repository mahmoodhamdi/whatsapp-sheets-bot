import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly languageSwitcher: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator(".text-red-500");
    this.languageSwitcher = page.locator('[data-testid="language-switcher"]');
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAsAdmin() {
    await this.login("admin@example.com", "admin123");
    await this.page.waitForURL(/.*dashboard/, { timeout: 10000 });
  }

  async expectError() {
    await expect(this.errorMessage).toBeVisible();
  }

  async switchToEnglish() {
    await this.languageSwitcher.click();
    await this.page.click("text=English");
  }

  async switchToArabic() {
    await this.languageSwitcher.click();
    await this.page.click("text=العربية");
  }
}
