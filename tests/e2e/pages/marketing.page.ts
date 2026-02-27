import { Page, Locator } from "@playwright/test";

export class MarketingPage {
  readonly page: Page;
  readonly hero: Locator;
  readonly featuresSection: Locator;
  readonly pricingSection: Locator;
  readonly faqSection: Locator;
  readonly ctaSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hero = page.locator('[data-testid="hero"], section:first-of-type');
    this.featuresSection = page.locator('[data-testid="features"], #features');
    this.pricingSection = page.locator('[data-testid="pricing"], #pricing');
    this.faqSection = page.locator('[data-testid="faq"], #faq');
    this.ctaSection = page.locator('[data-testid="cta"], #cta');
  }

  async goto() {
    await this.page.goto("/");
  }

  async gotoPricing() {
    await this.page.goto("/pricing");
  }

  async gotoFeatures() {
    await this.page.goto("/features");
  }

  async gotoDocs() {
    await this.page.goto("/docs");
  }
}
