# AGENTS.md — Agent Instructions

This file is the authoritative guide for AI agents (Claude, Copilot, Cursor, etc.) working in this repository. Read it before making any changes.

---

## Project purpose

End-to-end test suite for [saucedemo.com](https://www.saucedemo.com/) using Playwright + TypeScript. Maintained as a Senior/Lead SDET portfolio project; production-grade standards apply throughout.

---

## Folder structure

```text
playwright-web-automation-ts/
├── .claude/            # AI tooling context (PLAN.md with full implementation roadmap)
├── .github/            # CI/CD workflows, PR template, Dependabot, CODEOWNERS
├── config/             # Environment config (env.ts reads from process.env)
├── fixtures/           # Playwright fixture extensions (page object injection)
├── pages/              # Page Object Model classes
├── test-data/          # Typed constants for users, checkout data, product slugs
├── tests/              # Test files (.spec.ts)
├── utils/              # Shared helpers and utilities
├── AGENTS.md           # This file
├── CLAUDE.md           # Pointer to this file
├── ROADMAP.md          # High-level 20-PR improvement roadmap
└── playwright.config.ts
```

---

## How to run

```bash
# Install dependencies
npm ci

# Run all tests (headless)
npm test

# Run with headed browser
npm run test:headed

# Open Playwright UI mode
npm run test:ui

# Open HTML report
npm run test:report

# Type-check
npm run typecheck

# Lint
npm run lint

# Lint and auto-fix
npm run lint:fix

# Format all files
npm run format

# Check formatting without writing (used in CI)
npm run format:check
```

> **Environment variables:** copy `.env.example` to `.env` and fill in credentials before running locally. Never hardcode credentials anywhere in the codebase.

> **Pre-commit hooks:** Husky runs `lint-staged` on every `git commit`. Staged `.ts` files are auto-fixed by ESLint and formatted by Prettier before the commit is created. Never bypass hooks with `--no-verify`.

---

## How to add a new page

1. Create `pages/myPage.ts` extending the base pattern used in existing page objects.
2. Add a fixture property to `fixtures/index.ts`.
3. Import `{ test, expect }` from `@/fixtures` (not from `@playwright/test`) in new test files.

---

## How to add a new test

1. Create `tests/myFeature.spec.ts`.
2. Import `{ test, expect }` from `@/fixtures`.
3. Tag tests with `@smoke` or `@regression` via the `tag` test option:

   ```ts
   test('my test', { tag: '@smoke' }, async ({ productsPage }) => { ... });
   ```

4. Use the fixture-injected page objects — do not instantiate page objects manually with `new`.

---

## Selector strategy

| Situation                           | Selector                                       |
| ----------------------------------- | ---------------------------------------------- |
| Element has a `data-test` attribute | `page.getByTestId('element-name')`             |
| Element has a meaningful role/label | `page.getByRole(...)` / `page.getByLabel(...)` |
| Element has stable visible text     | `page.getByText(...)`                          |
| None of the above                   | `page.locator(css)` as last resort             |

`testIdAttribute` is set to `'data-test'` in `playwright.config.ts`. Never use positional CSS selectors (`:nth-child`) or XPath unless absolutely unavoidable.

---

## Conventions

- **Credentials:** use `.env` variables (`SAUCEDEMO_USERNAME`, `SAUCEDEMO_PASSWORD`, `SAUCEDEMO_LOCKED_USERNAME`). Never hardcode credentials.
- **Navigation:** use `page.goto('/')` — `baseURL` is set in `playwright.config.ts`.
- **Waits:** never use `page.waitForTimeout()`. Use auto-waiting locator assertions (`expect(locator).toBeVisible()`) or `waitForLoadState('networkidle')` only when genuinely necessary.
- **Strict equality:** always use `===` / `!==`, never `==` / `!=`.
- **Lint/format:** `eslint` and `prettier` are enforced via pre-commit hooks. Do not bypass with `--no-verify`.
- **Path aliases:** import from `@/pages`, `@/fixtures`, `@/test-data`, `@/utils`, `@/config` — not via deep relative paths.
- **Network interception:** use `page.route()` for stubbing/intercepting requests in tests.
- **Authentication:** `global-setup.ts` logs in once and saves cookies/storage to `.auth/user.json`. Playwright applies this to every test context automatically — never add `loginPage.login()` to products or checkout tests. Tests that exercise the login form must override with `test.use({ storageState: { cookies: [], origins: [] } })`.

---

## What not to do

- Do not add `waitForTimeout` anywhere.
- Do not hardcode credentials, URLs (other than `'/'`), or test data inline in test files.
- Do not instantiate page objects manually in tests — use fixtures.
- Do not skip pre-commit hooks (`--no-verify`).
- Do not commit `.env`, `.auth/`, or any file containing secrets.
- Do not use `page.metrics()` for performance assertions — it is Chromium/CDP only. Use `window.performance.getEntriesByType('navigation')` via `page.evaluate()`.
- Do not add AI tool attribution (Claude, Copilot, etc.) to commit messages or PR descriptions.

---

## CI

GitHub Actions runs on push to `main` and on pull requests. The pipeline:

1. Runs `typecheck`, `lint`, and `format:check` (gates the test job)
2. Runs tests in parallel across Chromium, Firefox, and WebKit
3. Uploads HTML reports as artifacts (30-day retention)

`SAUCEDEMO_PASSWORD` is a GitHub Actions secret. `SAUCEDEMO_USERNAME` and `SAUCEDEMO_LOCKED_USERNAME` are Actions variables (non-sensitive, public demo site values).

---

## Further context

See [`.claude/PLAN.md`](.claude/PLAN.md) for the full implementation roadmap and [`ROADMAP.md`](ROADMAP.md) for the high-level PR overview.
