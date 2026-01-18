import { expect } from "@playwright/test";
import type { Locator, Page } from "playwright";
import { testConfig } from "../../config/conftest";
import { BasePage } from "../basePage";
import { inventorySelectors } from "../../selectors/inventory/inventory.selectors";

export class InventoryPage extends BasePage {
  private readonly title = this.page.locator(inventorySelectors.title);
  private readonly inventoryItems = this.page.locator(
    inventorySelectors.inventoryItems
  );
  private readonly cartLink = this.page.locator(inventorySelectors.cartLink);
  private readonly cartBadge = this.page.locator(inventorySelectors.cartBadge);

  constructor(page: Page) {
    super(page);
  }

  async assertOnInventory(): Promise<void> {
    await this.page.waitForURL("**/inventory.html", {
      timeout: testConfig.timeoutMs
    });
    await expect(this.title).toHaveText("Products");
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  async addItemToCart(itemName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: itemName });
    await expect(item).toBeVisible();
    await item
      .locator("button", { hasText: inventorySelectors.addToCartButtonText })
      .click();
  }

  async openCart(): Promise<void> {
    await Promise.all([
      this.page.waitForURL("**/cart.html"),
      this.cartLink.click()
    ]);
  }

  async cartBadgeCount(): Promise<string> {
    if (await this.cartBadge.isVisible()) {
      return this.cartBadge.textContent().then((text) => text?.trim() ?? "");
    }

    return "";
  }
}
