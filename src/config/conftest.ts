import * as dotenv from "dotenv";

dotenv.config();

const readNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const debugEnabled =
  process.env.DEBUG === "true" || process.env.PWDEBUG === "1";
const headlessEnv = process.env.HEADLESS;
const headlessDefault =
  headlessEnv !== undefined ? headlessEnv !== "false" : !debugEnabled;

export const testConfig = {
  browser: process.env.BROWSER ?? "chrome",
  headless: headlessDefault,
  debug: debugEnabled,
  trace: process.env.TRACE === "true" || debugEnabled,
  traceOnFail: process.env.TRACE_ON_FAIL !== "false",
  screenshotOnFailure: process.env.SCREENSHOT_ON_FAIL !== "false",
  cleanupSession: process.env.CLEANUP_SESSION !== "false",
  slowMo: readNumber(process.env.SLOW_MO, 0),
  timeoutMs: readNumber(process.env.TIMEOUT_MS, 15000),
  fakerSeed: readNumber(process.env.FAKER_SEED, 0)
};
