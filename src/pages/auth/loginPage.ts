import { env } from "../../config/env";
import { BasePage } from "../basePage";
import { loginSelectors } from "../../selectors/auth/login.selectors";

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.locator(
    loginSelectors.usernameInput
  );
  private readonly passwordInput = this.page.locator(
    loginSelectors.passwordInput
  );
  private readonly loginButton = this.page.locator(loginSelectors.loginButton);
  private readonly errorMessage = this.page.locator(loginSelectors.errorMessage);

  async open(): Promise<void> {
    await this.goto(env.baseUrl);
  }

  async login(
    username: string,
    password: string,
    waitForInventory = false
  ): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    if (waitForInventory) {
      await Promise.all([
        this.page.waitForURL("**/inventory.html"),
        this.loginButton.click()
      ]);
      return;
    }

    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: "visible" });
    return this.errorMessage.textContent().then((text) => text?.trim() ?? "");
  }
}
