import { BasePage } from "../basePage";
import { checkoutSelectors } from "../../selectors/checkout/checkout.selectors";

export class CheckoutOverviewPage extends BasePage {
  private readonly finishButton = this.page.locator(
    checkoutSelectors.overview.finishButton
  );

  async finishCheckout(): Promise<void> {
    await this.finishButton.waitFor({ state: "visible" });
    await Promise.all([
      this.page.waitForURL("**/checkout-complete.html"),
      this.finishButton.click()
    ]);
  }
}
