import { type Page, type Locator, expect } from '@playwright/test';

export abstract class BasePage {
  /** Route relative to baseURL, e.g. '/login' */
  abstract readonly path: string;
  /** Element that proves the page is ready for interaction */
  abstract readonly readySignal: Locator;

  constructor(protected readonly page: Page) {}

  async goto(): Promise<this> {
    await this.page.goto(this.path);
    await this.expectLoaded();
    return this;
  }

  async expectLoaded(): Promise<void> {
    await expect(this.readySignal).toBeVisible();
  }
}
