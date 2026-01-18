import { expect } from "@playwright/test";
import { BasePage } from "../basePage";
import { checkoutSelectors } from "../../selectors/checkout/checkout.selectors";

export class CheckoutCompletePage extends BasePage {
  private readonly completeHeader = this.page.locator(
    checkoutSelectors.complete.completeHeader
  );

  async assertComplete(): Promise<void> {
    await expect(this.completeHeader).toHaveText("Thank you for your order!");
  }
}
