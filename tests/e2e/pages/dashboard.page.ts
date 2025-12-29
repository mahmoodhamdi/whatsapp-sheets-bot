import { Page, Locator, expect } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly statsMessages: Locator;
  readonly statsContacts: Locator;
  readonly statsRules: Locator;
  readonly statsToday: Locator;
  readonly recentMessages: Locator;
  readonly topContacts: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;

  // Navigation
  readonly navDashboard: Locator;
  readonly navMessages: Locator;
  readonly navContacts: Locator;
  readonly navRules: Locator;
  readonly navSettings: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1");
    this.statsMessages = page.locator('[data-testid="stats-total-messages"]');
    this.statsContacts = page.locator('[data-testid="stats-total-contacts"]');
    this.statsRules = page.locator('[data-testid="stats-active-rules"]');
    this.statsToday = page.locator('[data-testid="stats-today-messages"]');
    this.recentMessages = page.locator('[data-testid="recent-messages"]');
    this.topContacts = page.locator('[data-testid="top-contacts"]');
    this.userMenu = page.locator('[data-testid="user-menu"]');
    this.logoutButton = page.locator('[data-testid="logout-button"]');

    // Navigation
    this.navDashboard = page.locator('[data-testid="nav-dashboard"]');
    this.navMessages = page.locator('[data-testid="nav-messages"]');
    this.navContacts = page.locator('[data-testid="nav-contacts"]');
    this.navRules = page.locator('[data-testid="nav-rules"]');
    this.navSettings = page.locator('[data-testid="nav-settings"]');
  }

  async goto() {
    await this.page.goto("/dashboard");
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
    await this.page.waitForURL(/.*login/, { timeout: 10000 });
  }

  async navigateToMessages() {
    await this.navMessages.click();
    await expect(this.page).toHaveURL(/.*messages/);
  }

  async navigateToContacts() {
    await this.navContacts.click();
    await expect(this.page).toHaveURL(/.*contacts/);
  }

  async navigateToRules() {
    await this.navRules.click();
    await expect(this.page).toHaveURL(/.*rules/);
  }

  async navigateToSettings() {
    await this.navSettings.click();
    await expect(this.page).toHaveURL(/.*settings/);
  }

  async expectStatsVisible() {
    await expect(this.statsMessages).toBeVisible();
    await expect(this.statsContacts).toBeVisible();
    await expect(this.statsRules).toBeVisible();
    await expect(this.statsToday).toBeVisible();
  }
}
