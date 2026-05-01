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

| Variable                    | Description                   |
| --------------------------- | ----------------------------- |
| `SAUCEDEMO_USERNAME`        | Standard test user login      |
| `SAUCEDEMO_PASSWORD`        | Shared password for all users |
| `SAUCEDEMO_LOCKED_USERNAME` | Locked-out user login         |

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
├── tests/                    # Test specs
│   ├── login.test.ts
│   ├── products.test.ts
│   └── checkout.test.ts
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
