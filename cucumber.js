const path = require("node:path");
const { pathToFileURL } = require("node:url");

const allureReporter = pathToFileURL(
  path.resolve(__dirname, "src/support/allure-reporter.mjs")
).toString();
const consoleFormatter = "progress";
const fileLogFormatter = ["progress", "reports/cucumber.log"];
const allureFormatter = [allureReporter];

module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    requireModule: ["ts-node/register"],
    require: ["src/steps/**/*.ts", "src/support/**/*.ts"],
    format: [consoleFormatter, fileLogFormatter, allureFormatter]
  }
};
