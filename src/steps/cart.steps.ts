import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

Given("I am logged in", async function (this: CustomWorld) {
  await this.pages.login.open();
  await this.pages.login.login(
    this.data.users.standard.username,
    this.data.users.standard.password,
    true
  );
  await this.pages.inventory.assertOnInventory();
});

When("I add {string} to the cart", async function (this: CustomWorld, itemName: string) {
  await this.pages.inventory.addItemToCart(itemName);
});

Then("the cart badge should show {string}", async function (this: CustomWorld, expectedCount: string) {
  const badgeCount = await this.pages.inventory.cartBadgeCount();
  expect(badgeCount).toBe(expectedCount);
});

Then("the cart should contain {string}", async function (this: CustomWorld, itemName: string) {
  await this.pages.inventory.openCart();
  await this.pages.cart.assertHasItem(itemName);
});

When("I remove {string} from the cart", async function (this: CustomWorld, itemName: string) {
  await this.pages.cart.removeItem(itemName);
});

Then("the cart should be empty", async function (this: CustomWorld) {
  await this.pages.cart.assertEmpty();
});
