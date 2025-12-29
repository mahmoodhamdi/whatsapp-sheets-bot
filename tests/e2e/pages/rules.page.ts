import { Page, Locator, expect } from "@playwright/test";

export class RulesPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly table: Locator;
  readonly createButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1");
    this.table = page.locator("table");
    this.createButton = page.locator('[data-testid="create-rule-button"]');
    this.searchInput = page.locator('[data-testid="search-rules"]');
  }

  async goto() {
    await this.page.goto("/dashboard/rules");
  }

  async gotoCreate() {
    await this.page.goto("/dashboard/rules/new");
  }

  async clickCreate() {
    await this.createButton.click();
    await expect(this.page).toHaveURL(/.*rules\/new/);
  }

  async toggleRule(index: number) {
    const toggle = this.page.locator(`[data-testid="toggle-rule-${index}"]`);
    if (await toggle.isVisible()) {
      await toggle.click();
      await this.page.waitForTimeout(500);
    }
  }

  async deleteRule(index: number) {
    const deleteButton = this.page.locator(`[data-testid="delete-rule-${index}"]`);
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await this.page.locator('[data-testid="confirm-delete"]').click();
      await this.page.waitForTimeout(500);
    }
  }

  async expectTableVisible() {
    await expect(this.table).toBeVisible();
  }

  async getRuleCount(): Promise<number> {
    await this.page.waitForSelector("table tbody tr", { timeout: 5000 }).catch(() => {});
    return await this.page.locator("table tbody tr").count();
  }
}

export class RuleFormPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly triggerInput: Locator;
  readonly triggerTypeSelect: Locator;
  readonly responseInput: Locator;
  readonly priorityInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator("#name");
    this.triggerInput = page.locator("#trigger");
    this.triggerTypeSelect = page.locator('[data-testid="trigger-type-select"]');
    this.responseInput = page.locator("#response");
    this.priorityInput = page.locator("#priority");
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto("/dashboard/rules/new");
  }

  async fillForm(data: {
    name: string;
    trigger: string;
    response: string;
    priority?: string;
  }) {
    await this.nameInput.fill(data.name);
    await this.triggerInput.fill(data.trigger);
    await this.responseInput.fill(data.response);
    if (data.priority) {
      await this.priorityInput.fill(data.priority);
    }
  }

  async submit() {
    await this.submitButton.click();
  }

  async createRule(data: {
    name: string;
    trigger: string;
    response: string;
    priority?: string;
  }) {
    await this.fillForm(data);
    await this.submit();
    await expect(this.page).toHaveURL(/.*rules$/, { timeout: 10000 });
  }
}
