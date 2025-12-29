import { Page, Locator, expect } from "@playwright/test";

export class SettingsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly businessNameInput: Locator;
  readonly defaultReplyInput: Locator;
  readonly saveButton: Locator;
  readonly whatsappLink: Locator;
  readonly sheetsLink: Locator;
  readonly billingLink: Locator;
  readonly profileLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1");
    this.businessNameInput = page.locator("#businessName");
    this.defaultReplyInput = page.locator("#defaultReply");
    this.saveButton = page.locator('button:has-text("حفظ"), button:has-text("Save")');
    this.whatsappLink = page.locator('a[href="/dashboard/settings/whatsapp"]');
    this.sheetsLink = page.locator('a[href="/dashboard/settings/sheets"]');
    this.billingLink = page.locator('a[href="/dashboard/settings/billing"]');
    this.profileLink = page.locator('a[href="/dashboard/settings/profile"]');
  }

  async goto() {
    await this.page.goto("/dashboard/settings");
  }

  async gotoProfile() {
    await this.page.goto("/dashboard/settings/profile");
  }

  async gotoBilling() {
    await this.page.goto("/dashboard/settings/billing");
  }

  async gotoWhatsApp() {
    await this.page.goto("/dashboard/settings/whatsapp");
  }

  async gotoSheets() {
    await this.page.goto("/dashboard/settings/sheets");
  }

  async updateBusinessName(name: string) {
    await this.businessNameInput.fill(name);
    await expect(this.businessNameInput).toHaveValue(name);
  }

  async updateDefaultReply(reply: string) {
    await this.defaultReplyInput.fill(reply);
    await expect(this.defaultReplyInput).toHaveValue(reply);
  }

  async save() {
    await this.saveButton.click();
  }
}

export class ProfilePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly saveButton: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly changePasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1");
    this.nameInput = page.locator("#name");
    this.emailInput = page.locator("#email");
    this.saveButton = page.locator('[data-testid="save-profile"]');
    this.currentPasswordInput = page.locator("#currentPassword");
    this.newPasswordInput = page.locator("#newPassword");
    this.confirmPasswordInput = page.locator("#confirmPassword");
    this.changePasswordButton = page.locator('[data-testid="change-password"]');
  }

  async goto() {
    await this.page.goto("/dashboard/settings/profile");
  }

  async updateName(name: string) {
    await this.nameInput.fill(name);
  }

  async changePassword(currentPassword: string, newPassword: string) {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(newPassword);
    await this.changePasswordButton.click();
  }
}

export class BillingPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly currentPlan: Locator;
  readonly upgradeButton: Locator;
  readonly cancelButton: Locator;
  readonly usageMessages: Locator;
  readonly usageRules: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1");
    this.currentPlan = page.locator('[data-testid="current-plan"]');
    this.upgradeButton = page.locator('[data-testid="upgrade-button"]');
    this.cancelButton = page.locator('[data-testid="cancel-subscription"]');
    this.usageMessages = page.locator('[data-testid="usage-messages"]');
    this.usageRules = page.locator('[data-testid="usage-rules"]');
  }

  async goto() {
    await this.page.goto("/dashboard/settings/billing");
  }

  async expectPlanVisible() {
    await expect(this.currentPlan).toBeVisible();
  }
}
