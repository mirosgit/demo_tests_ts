import { After, Before, Status, setDefaultTimeout } from "@cucumber/cucumber";
import fs from "node:fs";
import path from "node:path";
import { chromium, firefox, webkit } from "playwright";
import { testConfig } from "../config/conftest";
import { env } from "../config/env";
import { PageFactory } from "./pageFactory";
import { CustomWorld } from "./world";

setDefaultTimeout(testConfig.timeoutMs + 30000);

const browserType = () => {
  switch (testConfig.browser) {
    case "firefox":
      return firefox;
    case "webkit":
      return webkit;
    default:
      return chromium;
  }
};

const artifactsDir = path.resolve("reports/artifacts");

const ensureArtifactsDir = (): void => {
  fs.mkdirSync(artifactsDir, { recursive: true });
};

const safeName = (name: string): string => {
  const cleaned = name.replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
  return cleaned.slice(0, 120) || "scenario";
};

Before(async function (this: CustomWorld) {
  const launchArgs = testConfig.headless ? [] : ["--start-maximized"];
  const launchOptions = {
    headless: testConfig.headless,
    slowMo: testConfig.slowMo,
    args: launchArgs,
    channel: testConfig.browser === "chrome" ? "chrome" : undefined,
    devtools: testConfig.debug
  };

  this.browser = await browserType().launch(launchOptions);
  this.context = await this.browser.newContext({
    viewport: testConfig.headless ? { width: 1920, height: 1080 } : null
  });
  this.page = await this.context.newPage();
  this.pages = new PageFactory(this.page);
  this.scenario.reset();

  const traceEnabled = testConfig.trace || testConfig.traceOnFail;

  if (traceEnabled) {
    await this.context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true
    });
  }
});

After(async function (this: CustomWorld, scenario) {
  const scenarioName = safeName(scenario.pickle.name);
  const failed = scenario.result?.status === Status.FAILED;

  if (failed && testConfig.screenshotOnFailure && this.page) {
    ensureArtifactsDir();
    await this.page.screenshot({
      path: path.join(artifactsDir, `${scenarioName}.png`),
      fullPage: true
    });
  }

  const traceEnabled = testConfig.trace || testConfig.traceOnFail;
  if (traceEnabled && this.context) {
    if (failed) {
      ensureArtifactsDir();
      const tracePath = path.join(artifactsDir, `${scenarioName}-trace.zip`);
      await this.context.tracing.stop({ path: tracePath });
      if (this.attach) {
        const traceBuffer = fs.readFileSync(tracePath);
        await this.attach(traceBuffer, {
          mediaType: "application/zip",
          fileName: `${scenarioName}-trace.zip`
        });
      }
    } else {
      await this.context.tracing.stop();
    }
  }

  if (testConfig.cleanupSession && this.page && !this.page.isClosed()) {
    try {
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    } catch {
      // Ignore cleanup errors to avoid masking test failures.
    }
    try {
      await this.context.clearCookies();
    } catch {
      // Ignore cleanup errors to avoid masking test failures.
    }
    try {
      await this.page.goto(env.baseUrl, { waitUntil: "domcontentloaded" });
    } catch {
      // Ignore cleanup errors to avoid masking test failures.
    }
  }

  if (this.context) {
    await this.context.close();
  }
  if (this.browser) {
    await this.browser.close();
  }
});
