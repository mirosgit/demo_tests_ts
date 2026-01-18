import type { Page } from "playwright";
import { LoginPage } from "../pages/auth/loginPage";
import { CartPage } from "../pages/cart/cartPage";
import { CheckoutCompletePage } from "../pages/checkout/checkoutCompletePage";
import { CheckoutInformationPage } from "../pages/checkout/checkoutInformationPage";
import { CheckoutOverviewPage } from "../pages/checkout/checkoutOverviewPage";
import { InventoryPage } from "../pages/inventory/inventoryPage";
import { BasePage } from "../pages/basePage";

type PageCtor<T extends BasePage> = new (page: Page) => T;

export class PageFactory {
  private readonly page: Page;
  private readonly instances = new Map<string, BasePage>();

  constructor(page: Page) {
    this.page = page;
  }

  get login(): LoginPage {
    return this.get(LoginPage);
  }

  get inventory(): InventoryPage {
    return this.get(InventoryPage);
  }

  get cart(): CartPage {
    return this.get(CartPage);
  }

  get checkoutInformation(): CheckoutInformationPage {
    return this.get(CheckoutInformationPage);
  }

  get checkoutOverview(): CheckoutOverviewPage {
    return this.get(CheckoutOverviewPage);
  }

  get checkoutComplete(): CheckoutCompletePage {
    return this.get(CheckoutCompletePage);
  }

  private get<T extends BasePage>(PageClass: PageCtor<T>): T {
    const key = PageClass.name;
    let instance = this.instances.get(key) as T | undefined;
    if (!instance) {
      instance = new PageClass(this.page);
      this.instances.set(key, instance);
    }
    return instance;
  }
}
