import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

Given("I am on the login page", async function (this: CustomWorld) {
  await this.pages.login.open();
});

When("I login with valid credentials", async function (this: CustomWorld) {
  await this.pages.login.login(
    this.data.users.standard.username,
    this.data.users.standard.password,
    true
  );
});

When("I login with invalid credentials", async function (this: CustomWorld) {
  await this.pages.login.login(
    this.data.users.invalid.username,
    this.data.users.invalid.password
  );
});

When("I login with locked out credentials", async function (this: CustomWorld) {
  await this.pages.login.login(
    this.data.users.lockedOut.username,
    this.data.users.lockedOut.password
  );
});

Then("I should see the inventory page", async function (this: CustomWorld) {
  await this.pages.inventory.assertOnInventory();
});

Then("I should see a login error message", async function (this: CustomWorld) {
  const message = await this.pages.login.getErrorMessage();
  expect(message).toContain("Username and password");
});

Then("I should see a locked out message", async function (this: CustomWorld) {
  const message = await this.pages.login.getErrorMessage();
  expect(message).toContain("Sorry, this user has been locked out");
});
