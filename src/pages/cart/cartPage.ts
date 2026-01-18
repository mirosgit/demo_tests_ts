import { expect } from "@playwright/test";
import { BasePage } from "../basePage";
import { cartSelectors } from "../../selectors/cart/cart.selectors";

export class CartPage extends BasePage {
  private readonly cartItems = this.page.locator(cartSelectors.cartItems);
  private readonly checkoutButton = this.page.locator(
    cartSelectors.checkoutButton
  );

  async assertHasItem(itemName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: itemName });
    await expect(item).toBeVisible();
  }

  async removeItem(itemName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: itemName });
    await expect(item).toBeVisible();
    await item
      .locator("button", { hasText: cartSelectors.removeButtonText })
      .click();
  }

  async assertEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }

  async checkout(): Promise<void> {
    await Promise.all([
      this.page.waitForURL("**/checkout-step-one.html"),
      this.checkoutButton.click()
    ]);
  }
}
