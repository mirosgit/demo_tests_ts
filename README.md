# demo_tests_ts

Playwright + TypeScript + Cucumber (BDD) automation framework example.

## Application Under Test
- https://www.saucedemo.com/

## Setup
1) Install dependencies

```bash
npm install
```

2) Install Playwright browsers

```bash
npx playwright install
```

## Run Tests

```bash
npm test
```

Optional flags:
- `HEADLESS=false npm test`
- `PWDEBUG=1 npm test`
- `npm test -- --headed`
- `npm test -- --headless`
- `npm test -- --debug`
- `npm test -- --trace`
- `npm test -- --slowmo 300`

Console output uses the default `progress` formatter. A copy of the run log is saved to
`reports/cucumber.log`.

## Allure Report
1) Run tests to generate results:

```bash
npm test
```

2) Generate the HTML report:

```bash
npm run report:generate
```

3) Open the report:

```bash
npm run report:open
```

## Environment Configuration
Create a `.env` file (see `.env.example`) for URL and credentials:

- `BASE_URL` (default: https://www.saucedemo.com)
- `E2E_ACCEPTED_USERS` (comma-separated list)
- `E2E_USERNAME` / `E2E_PASSWORD`
- `E2E_LOCKED_OUT_USERNAME`
- `E2E_INVALID_USERNAME` / `E2E_INVALID_PASSWORD`

All other runtime settings live in `src/config/conftest.ts` and can still be
overridden via environment variables if needed:

- `BROWSER` (chrome | chromium | firefox | webkit)
- `HEADLESS` (true | false)
- `DEBUG` (true | false)
- `TRACE` (true | false)
- `TRACE_ON_FAIL` (true | false)
- `SCREENSHOT_ON_FAIL` (true | false)
- `CLEANUP_SESSION` (true | false)
- `SLOW_MO` (ms)
- `TIMEOUT_MS` (ms)
- `FAKER_SEED` (number, optional)

## Project Structure
- `features/` - Gherkin feature files
- `src/steps/` - Step definitions (test logic)
- `src/pages/` - Page Objects (page logic, grouped by domain)
- `src/selectors/` - Centralized selectors per domain + common selectors
- `src/support/` - Cucumber hooks and world
- `src/config/` - Environment/config handling
- `src/data/` - Centralized test data and fixtures

Key scaling helpers:
- `src/support/pageFactory.ts` - Page Object registry (single instance per page)
- `src/support/scenarioContext.ts` - Lightweight scenario state store

## Notes / Assumptions
- The demo site already provides stable selectors and test users.
- Defaults target the standard_user account on SauceDemo.
- The invalid login scenario uses a valid username with an invalid password by default.
- Username values are validated against SauceDemo's accepted user list to avoid picking up OS-level env vars.
- Chrome is the default browser; in headed mode the window is started maximized.
- Debug artifacts (screenshots + traces) are saved to `reports/artifacts`.
- `--debug` or `PWDEBUG=1` runs headed and opens DevTools by default.
- Traces are attached to the Allure report for failed scenarios (disable via `TRACE_ON_FAIL=false`).
- Session data is cleared after each scenario (disable via `CLEANUP_SESSION=false`).

## Test Scenarios
- Successful login
- Login with invalid credentials
- Locked out user cannot login
- Add an item to the cart
- Remove an item from the cart
- Complete checkout with one item
