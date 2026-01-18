import { setWorldConstructor, World } from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "playwright";
import { testData } from "../data/testData";
import { PageFactory } from "./pageFactory";
import { ScenarioContext } from "./scenarioContext";

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  pages!: PageFactory;
  data = testData;
  scenario = new ScenarioContext();
}

setWorldConstructor(CustomWorld);
