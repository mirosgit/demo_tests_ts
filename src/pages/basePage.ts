import type { Page } from "playwright";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }
}
