import { expect } from "@playwright/test";
import { testConfig } from "../../config/conftest";
import { BasePage } from "../basePage";
import { checkoutSelectors } from "../../selectors/checkout/checkout.selectors";

export class CheckoutInformationPage extends BasePage {
  private readonly firstNameInput = this.page.locator(
    checkoutSelectors.information.firstNameInput
  );
  private readonly lastNameInput = this.page.locator(
    checkoutSelectors.information.lastNameInput
  );
  private readonly postalCodeInput = this.page.locator(
    checkoutSelectors.information.postalCodeInput
  );
  private readonly continueButton = this.page.locator(
    checkoutSelectors.information.continueButton
  );
  private readonly errorMessage = this.page.locator("[data-test=\"error\"]");

  async fillInformation(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    const safeFirstName = firstName.trim() || "John";
    const safeLastName = lastName.trim() || "Doe";
    const safePostalCode = postalCode.trim() || "12345";

    await this.firstNameInput.waitFor({ state: "visible" });
    await this.firstNameInput.fill(safeFirstName);
    await this.lastNameInput.fill(safeLastName);
    await this.postalCodeInput.fill(safePostalCode);
    await expect(this.firstNameInput).toHaveValue(safeFirstName);
    await expect(this.lastNameInput).toHaveValue(safeLastName);
    await expect(this.postalCodeInput).toHaveValue(safePostalCode);
    await this.continueButton.scrollIntoViewIfNeeded();
    await this.continueButton.click();

    const nextStep = this.page
      .waitForURL("**/checkout-step-two.html", {
        timeout: testConfig.timeoutMs
      })
      .then(() => "next" as const);
    const errorStep = this.errorMessage
      .waitFor({ state: "visible", timeout: testConfig.timeoutMs })
      .then(() => "error" as const);

    let outcome: "next" | "error";
    try {
      outcome = await Promise.race([nextStep, errorStep]);
    } catch (error) {
      throw new Error(
        `Checkout did not proceed from step one (url: ${this.page.url()}).`
      );
    }

    if (outcome === "error") {
      const message = await this.errorMessage.textContent();
      throw new Error(message?.trim() || "Checkout step one failed.");
    }
  }
}
