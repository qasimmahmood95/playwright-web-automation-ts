# playwright-web-automation-ts

Production-ready Playwright test suite for the [SauceDemo](https://www.saucedemo.com/) e-commerce flow, built with TypeScript.

[![Playwright Tests](https://github.com/qasimmahmood95/playwright-web-automation-ts/actions/workflows/playwright.yml/badge.svg)](https://github.com/qasimmahmood95/playwright-web-automation-ts/actions/workflows/playwright.yml)

## Tech stack

<!-- markdownlint-disable MD033 -->
<table>
  <tr>
    <td>
      <a target="_blank" href="https://playwright.dev/"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/playwright/playwright-original.svg" alt="playwright" width="42" height="42" /></a>
    </td>
    <td>
      <a target="_blank" href="https://www.typescriptlang.org/"><img src="https://skillicons.dev/icons?i=ts" alt="ts" width="42" height="42" /></a>
    </td>
    <td>
      <a target="_blank" href="https://eslint.org/"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/eslint/eslint-original.svg" alt="eslint" width="42" height="42" /></a>
    </td>
    <td>
      <a target="_blank" href="https://github.com/"><img src="https://skillicons.dev/icons?i=github" alt="github" width="42" height="42" /></a>
    </td>
    <td>
      <a target="_blank" href="https://github.com/features/actions"><img src="https://skillicons.dev/icons?i=githubactions" alt="githubactions" width="42" height="42" /></a>
    </td>
  </tr>
</table>
<!-- markdownlint-enable MD033 -->

- [Playwright](https://playwright.dev/) - test framework
- [TypeScript](https://www.typescriptlang.org/) - strict mode
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) - linting and formatting
- [GitHub Actions](https://github.com/features/actions) - CI/CD

## Prerequisites

- [Node.js](https://nodejs.org/) v24 or higher (see `.nvmrc`)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [nvm](https://github.com/nvm-sh/nvm) (optional, for Node version management)

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/qasimmahmood95/playwright-web-automation-ts.git
cd playwright-web-automation-ts

# 2. Install dependencies
npm ci

# 3. Copy the environment variable template and fill in credentials
cp .env.example .env

# 4. Install browsers
npx playwright install --with-deps
```

## Environment variables

Credentials are read from a `.env` file at the project root (gitignored). Copy the template to get started:

```bash
cp .env.example .env
```

| Variable                     | Description                   |
| ---------------------------- | ----------------------------- |
| `SAUCEDEMO_USERNAME`         | Standard test user login      |
| `SAUCEDEMO_PASSWORD`         | Shared password for all users |
| `SAUCEDEMO_LOCKED_USERNAME`  | Locked-out user login         |
| `SAUCEDEMO_PROBLEM_USERNAME` | Problem user login            |

In CI these are passed as [GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

## Run commands

```bash
# Run all tests (headless)
npm test

# Run with a visible browser
npm run test:headed

# Open Playwright UI mode
npm run test:ui

# Open the HTML report from the last run
npm run test:report

# Tagged suites
npm run test:smoke
npm run test:regression
npm run test:a11y
```

## Code quality

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Lint and auto-fix
npm run lint:fix

# Format all files
npm run format

# Check formatting without writing
npm run format:check
```

## Architecture

### Page Object Model

Each page of the application has a dedicated class in `pages/` that encapsulates all locators and interactions for that page. Test files never use raw `page.locator()` calls — all selector logic lives in the page objects.

### Fixtures

`fixtures/index.ts` extends Playwright's base `test` with pre-instantiated page objects (`loginPage`, `productsPage`, `checkoutPage`). This eliminates boilerplate in every test file — page objects are injected by name rather than constructed with `new`.

```ts
// Before fixtures
test('example', async ({ page }) => {
  const login = new LoginPage(page);
  await login.login(username, password);
});

// With fixtures
test('example', async ({ loginPage }) => {
  await loginPage.login(username, password);
});
```

All test files import `{ test, expect }` from `@/fixtures`, not directly from `@playwright/test`.

### Multi-role storageState authentication

`tests/global.setup.ts` is a Playwright setup project that runs once before each browser's test suite. It logs in once per **role** (`standard`, `problem`) and saves cookies and storage to `.auth/<browser>-<role>.json`. Each test project depends on its matching setup project, and the `role` fixture option in `fixtures/index.ts` resolves which state file a test loads — no test ever goes through the login form.

Tests run as `standard` by default. Switching role is a one-liner at file or describe-block level:

```ts
test.describe('Problem user', () => {
  test.use({ role: 'problem' });

  test('sees broken product images', async ({ productsPage }) => { ... });
});
```

Each browser project (chromium, firefox, webkit) has a dedicated setup dependency, so CI jobs remain isolated and each only needs its own browser installed.

Tests that specifically exercise the login page opt out of stored auth:

```ts
test.use({ storageState: { cookies: [], origins: [] } });
```

## Test strategy

### Test tags

| Tag           | Scope                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------- |
| `@smoke`      | Critical-path user journeys — login, add to cart, checkout. Fast signal on every change. |
| `@regression` | The full functional suite. Every functional test carries it.                             |
| `@a11y`       | Automated WCAG 2.0/2.1 A + AA scans (axe-core) of the journey pages. Non-functional.     |

Tags are applied through the test's `{ tag: [...] }` option — never encoded in describe-block names or titles:

```ts
test('Standard user can login', { tag: ['@smoke', '@regression'] }, async ({ loginPage }) => { ... });
```

Future suites from the [roadmap](ROADMAP.md) (`@visual`, `@performance`) will follow the same scheme.

```bash
# Critical-path journeys only
npm run test:smoke        # playwright test --grep @smoke

# Full functional suite
npm run test:regression   # playwright test --grep @regression

# Accessibility scans
npm run test:a11y         # playwright test --grep @a11y
```

> `test:regression` matches the full functional suite by design — every functional test carries the tag. Non-functional suites carry their own tags: `@a11y` is the first, with `@visual` and `@performance` to follow.

### Test design principles

- **Focused tests** — each test verifies one behaviour. Long journeys are split into focused tests rather than chained into a single mega-test.
- **Data-driven negative tests** — invalid inputs and their expected errors live as typed constants in `test-data/`; checkout form validation iterates `InvalidCheckoutScenarios` instead of duplicating test bodies.
- **Scoped teardown** — reset-app-state/logout teardown runs only on tests that mutate state (cart, checkout), not on read-only assertions.
- **Role-based auth** — tests never log in through the UI; stored auth is loaded via the `role` fixture (see [Multi-role storageState authentication](#multi-role-storagestate-authentication) above).

### Accessibility

Automated WCAG 2.0/2.1 A + AA scans run through [axe-core](https://github.com/dequelabs/axe-core) (`@axe-core/playwright`) against the four journey pages: login (signed out), inventory, cart (with an item), and checkout step one.

SauceDemo ships real accessibility defects, so the suite asserts **no new violations** rather than zero: known rule failures are pinned per page in `test-data/a11y.ts`, each with a comment naming the defect. A scan fails only on violations outside that baseline, and baselined rules that stop firing are soft-flagged as report annotations so the baseline can shrink over time. Full axe results are attached to the HTML report for every scan.

### Network resilience

SauceDemo is a fully client-side React app — login and inventory ship inside the JS bundle, with no auth or product APIs — so network tests target the traffic that actually exists: static bundles, product images, and third-party requests. Four `@regression` tests use `page.route()` interception:

- Product images **aborted** — the page must stay fully functional with broken images
- Product images **stubbed** with a deterministic placeholder — the binary-response pattern visual tests will reuse
- All **cross-origin traffic blocked** — the app must never depend on third-party availability
- **Injected latency** on product images — the page must still reach a usable state

Interception helpers live in `utils/network.ts`; route patterns and latency constants are typed test data in `test-data/routes.ts`. Every interception test asserts its intercept counter fired, so route-pattern drift fails loudly instead of silently passing.

## Project structure

```text
playwright-web-automation-ts/
├── .claude/                  # AI tooling context (full implementation plan)
├── .github/workflows/        # CI/CD pipeline
├── config/
│   └── env.ts                # Environment variable helpers
├── fixtures/
│   └── index.ts              # Extended test with page object fixtures
├── pages/                    # Page Object Model classes
│   ├── loginPage.ts
│   ├── productsPage.ts
│   └── checkoutPage.ts
├── test-data/                # Typed constants for test inputs
│   ├── users.ts              # All 6 SauceDemo user types
│   ├── checkout.ts           # Valid and invalid checkout form scenarios
│   ├── a11y.ts               # Known accessibility violations baseline
│   └── routes.ts             # Route patterns and traffic-shaping constants
├── tests/                    # Test specs
│   ├── global.setup.ts       # storageState authentication setup
│   ├── login.test.ts
│   ├── products.test.ts
│   ├── checkout.test.ts
│   ├── accessibility.test.ts # WCAG scans of the journey pages
│   └── network.test.ts       # Network interception and resilience tests
├── utils/
│   ├── a11y.ts               # axe-core scan helper with baseline filtering
│   ├── auth.ts               # Auth roles and storage-state file paths
│   ├── helpers.ts            # Product slug constants (Products)
│   └── network.ts            # Route-interception helpers with intercept counters
├── AGENTS.md                 # AI agent instructions (conventions, selectors, what not to do)
├── CLAUDE.md                 # Claude Code pointer to AGENTS.md
├── ROADMAP.md                # 20-PR improvement roadmap
└── playwright.config.ts
```

## Contributing

Pre-commit hooks run automatically on every `git commit` via Husky and lint-staged. Staged `.ts` files are linted (`eslint --fix`) and formatted (`prettier --write`) before the commit is created. No manual step required — hooks run transparently.

Dependencies are kept up to date automatically via [Dependabot](https://docs.github.com/en/code-security/dependabot), which raises weekly PRs for npm packages and GitHub Actions.

## CI/CD

Every push and pull request to `main` runs two jobs:

1. **Lint & type-check** — `typecheck`, `lint`, `format:check` must pass before tests run
2. **Test (matrix)** — Chromium, Firefox, and WebKit run in parallel; each uploads its own HTML report as an artifact (30-day retention)

Credentials are injected from GitHub Actions secrets. HTML reports are available under **Actions → run → Artifacts**.

## AI agent support

This repo includes first-class support for AI coding assistants:

- [`AGENTS.md`](AGENTS.md) — the single source of truth for project conventions, run commands, selector strategy, and best practices. Readable by any AI assistant (Cursor, Copilot, Claude, etc.)
- [`CLAUDE.md`](CLAUDE.md) — a Claude Code-specific pointer to `AGENTS.md`
- [`.claude/PLAN.md`](.claude/PLAN.md) — full 20-PR implementation roadmap with per-PR file lists and rationale
