import { DataTable, Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";

When("I open the cart", async function (this: CustomWorld) {
  await this.pages.inventory.openCart();
});

When("I proceed to checkout", async function (this: CustomWorld) {
  await this.pages.cart.checkout();
});

When("I provide checkout information", async function (this: CustomWorld) {
  const fallback = this.data.checkout.default;
  await this.pages.checkoutInformation.fillInformation(
    fallback.firstName,
    fallback.lastName,
    fallback.postalCode
  );
});

When(
  "I provide checkout information:",
  async function (this: CustomWorld, dataTable: DataTable) {
    const data = dataTable.rowsHash();
    const fallback = this.data.checkout.default;
    await this.pages.checkoutInformation.fillInformation(
      data.firstName || fallback.firstName,
      data.lastName || fallback.lastName,
      data.postalCode || fallback.postalCode
    );
  }
);

When("I finish the checkout", async function (this: CustomWorld) {
  await this.pages.checkoutOverview.finishCheckout();
});

Then(
  "I should see the checkout complete message",
  async function (this: CustomWorld) {
    await this.pages.checkoutComplete.assertComplete();
  }
);
