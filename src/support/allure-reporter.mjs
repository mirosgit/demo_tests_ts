import fs from "node:fs";
import { AllureRuntime } from "allure-js-commons";
import { CucumberJSAllureFormatter } from "allure-cucumberjs";

const resultsDir = "reports/allure-results";

const ensureResultsDir = () => {
  if (fs.existsSync(resultsDir)) {
    const stat = fs.statSync(resultsDir);
    if (!stat.isDirectory()) {
      fs.renameSync(resultsDir, `${resultsDir}.bak`);
    }
  }

  fs.mkdirSync(resultsDir, { recursive: true });

  for (const entry of fs.readdirSync(resultsDir)) {
    const entryPath = `${resultsDir}/${entry}`;
    if (fs.statSync(entryPath).isFile()) {
      fs.unlinkSync(entryPath);
    }
  }
};

export default class AllureReporter extends CucumberJSAllureFormatter {
  constructor(options) {
    ensureResultsDir();
    super(options, new AllureRuntime({ resultsDir }), {
      labels: [
        {
          pattern: [/@module:(.*)/],
          name: "suite"
        }
      ],
      links: []
    });
  }

  onTestCaseStarted(data) {
    super.onTestCaseStarted(data);
    const currentTest = this.currentTestsMap?.get(data.id);
    if (!currentTest || !currentTest.testResult) {
      return;
    }

    const labels = currentTest.testResult.labels ?? [];
    const suiteLabels = labels.filter((label) => label.name === "suite");
    const scenarioName = currentTest.wrappedItem?.name;
    const hasModuleSuite = suiteLabels.some(
      (label) => label.value !== scenarioName
    );
    if (!hasModuleSuite || !scenarioName) {
      return;
    }

    currentTest.testResult.labels = labels.filter(
      (label) => !(label.name === "suite" && label.value === scenarioName)
    );
  }
}
