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
├── components/         # Shared cross-page UI (header, sidebar nav) composed by page objects / injected as fixtures
├── config/             # Environment config (env.ts reads from process.env)
├── fixtures/           # Playwright fixture extensions (page object injection)
├── pages/              # Page Object Model classes
├── test-data/          # Typed constants (users, checkout scenarios, a11y baseline, route patterns, product slugs)
├── tests/              # Test files (.test.ts)
├── utils/              # Shared helpers and utilities
├── AGENTS.md           # This file
├── CLAUDE.md           # Pointer to this file
├── Dockerfile          # Containerised test run (Playwright Linux base image)
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

# Run only smoke-tagged critical-path tests
npm run test:smoke

# Run the full tagged regression suite
npm run test:regression

# Run accessibility scans
npm run test:a11y

# Run visual regression tests (baselines are Linux-only)
npm run test:visual

# Run performance checks
npm run test:performance

# Run the critical @smoke journey on a mobile (Pixel 7) viewport
npm run test:mobile

# Run with headed browser
npm run test:headed

# Open Playwright UI mode
npm run test:ui

# Open HTML report
npm run test:report

# Run the full suite in Docker (bundled browsers, matches the CI Linux platform)
npm run test:docker

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

> **Docker:** the full suite also runs in a container via `npm run test:docker`. The image builds on `mcr.microsoft.com/playwright`, so it bundles all three browsers (no `npx playwright install`) and matches the CI Linux platform — use it to reproduce a CI-only failure or run `@visual` locally on macOS/Windows. Credentials pass through at runtime with `--env-file .env`; they are never baked into an image. See the [Docker section in the README](README.md#docker).

---

## How to add a new page

1. Create `pages/myPage.ts` extending the base pattern used in existing page objects.
2. Add a fixture property to `fixtures/index.ts`.
3. Import `{ test, expect }` from `@/fixtures` (not from `@playwright/test`) in new test files.

---

## How to add a new test

1. Create `tests/myFeature.test.ts`.
2. Import `{ test, expect }` from `@/fixtures`.
3. Tag every functional test `@regression`; critical-path journeys additionally get `@smoke`; non-functional suites carry their own tag (`@a11y`, `@visual`, `@performance`). Tags go through the `tag` test option — never in describe block names or test titles:

   ```ts
   test('my test', { tag: ['@smoke', '@regression'] }, async ({ productsPage }) => { ... });
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

- **Credentials:** use `.env` variables (`SAUCEDEMO_USERNAME`, `SAUCEDEMO_PASSWORD`, `SAUCEDEMO_LOCKED_USERNAME`, `SAUCEDEMO_PROBLEM_USERNAME`, `SAUCEDEMO_PERFORMANCE_USERNAME`). Never hardcode credentials.
- **Navigation:** navigate with relative paths against `baseURL` (`page.goto('/')`, `page.goto('/inventory.html')`) — `baseURL` comes from `config/env.ts` via `playwright.config.ts`.
- **Waits:** never use `page.waitForTimeout()`. Use auto-waiting locator assertions (`expect(locator).toBeVisible()`) or `waitForLoadState('networkidle')` only when genuinely necessary. Injected latency for traffic shaping lives inside `utils/network.ts` route handlers — never timers in test bodies.
- **Locators:** page objects own all locators — test files never call `page.locator()` or `getBy*` directly.
- **Components:** shared cross-page chrome (Swag Labs logo, header cart icon + badge, burger menu, sidebar reset-app-state/logout) lives in `components/` as focused classes owning only their own locators; page-specific UI stays in `pages/`. Page objects compose `HeaderComponent`; the sidebar drawer (`NavigationComponent`) is injected as the `appMenu` fixture and drives the reset/logout teardown. Test files reach shared UI through the page object or the injected fixture, never via raw locators.
- **Teardown:** reset-app-state/logout teardown only on tests that mutate state; read-only tests get none.
- **Accessibility:** a11y scans go through `utils/a11y.ts`; the known-violations baseline lives in `test-data/a11y.ts` with a comment per entry. Never use `disableRules()` to silence a finding.
- **Visual baselines:** Linux-only, generated exclusively by the `update-snapshots.yml` workflow on the CI runner — never hand-edit PNGs or commit locally generated snapshots. macOS/Windows baselines (`-darwin`/`-win32`) are gitignored; Docker-generated `-linux` baselines are **not** gitignored (they share the CI suffix) but must never be committed either — the container is a faithful CI-platform _runner_, not an authoritative baseline _generator_. Re-baseline via the workflow and review baseline-diff commits image-by-image.
- **Docker:** `npm run test:docker` runs the suite in a Linux container (`FROM mcr.microsoft.com/playwright:v1.61.1-noble`, pinned to the same Playwright version as `package-lock.json`) that mirrors the CI platform. Use it to reproduce and debug `@visual` runs locally on macOS/Windows. CI itself does **not** run in this container — it stays on `ubuntu-latest` with npx-installed browsers. Keep the Dockerfile `FROM` tag on the same Playwright version as `package-lock.json` (Dependabot's docker ecosystem bumps it); bump both together.
- **Performance:** measurement helpers live in `utils/performance.ts`, thresholds in `test-data/performance.ts` with a rationale comment each. Use the cross-browser navigation-timing API, never `page.metrics()`. Absolute thresholds are generous sanity ceilings, never tight SLOs — shared CI runners are noisy; prefer same-run relative comparisons for seeded-behaviour assertions.
- **Mobile:** the `Mobile Chrome` project (`devices['Pixel 7']`) runs the `@smoke` journey on a touch viewport. It runs on the chromium binary, so it reuses the `setup:chromium` auth state (no new setup project). Keep it scoped to `@smoke` via the project's `grep`: `@visual`, `@a11y`, and `@performance` stay desktop-only, since a mobile viewport would need its own baselines and thresholds. In CI it is a matrix entry that installs chromium and runs `--project="Mobile Chrome"`.
- **Strict equality:** always use `===` / `!==`, never `==` / `!=`.
- **Lint/format:** `eslint` and `prettier` are enforced via pre-commit hooks. Do not bypass with `--no-verify`.
- **Path aliases:** import from `@/pages`, `@/components`, `@/fixtures`, `@/test-data`, `@/utils`, `@/config` — not via deep relative paths.
- **Test data:** shared inputs live in `test-data/` as typed constants. Generated data (e.g. checkout fields via `@faker-js/faker`) must be seeded with a fixed `faker.seed(...)` so every run produces the same values and any failure reproduces exactly. Never call Faker unseeded in test data.
- **Network interception:** interception helpers live in `utils/network.ts` and route patterns in `test-data/routes.ts`. Register routes before `page.goto()`. Never put `expect()` inside a route handler. No `unroute()` teardown needed — context isolation cleans up. saucedemo is fully client-side: never stub app APIs that don't exist (there are no auth or product endpoints).
- **Authentication:** `tests/global.setup.ts` is a Playwright setup project that logs in once per browser + role pair (`standard`, `problem`, `glitch`) and saves cookies/storage to `.auth/<browser>-<role>.json`. Tests load the `standard` state by default via the `role` fixture option in `fixtures/index.ts`; switch role with `test.use({ role: 'problem' })` at file or describe level. A single test that must compare roles (e.g. performance deltas) creates symmetric fresh contexts from the saved auth files via a `utils/` helper. Roles are defined in `utils/auth.ts`; adding a role also means wiring its username env var through `config/env.ts`, `.env.example`, and the CI workflow `env` block — never log in inside a test. Never add `loginPage.login()` to products or checkout tests. Tests that exercise the login form must override with `test.use({ storageState: { cookies: [], origins: [] } })`.

---

## What not to do

- Do not add `waitForTimeout` anywhere.
- Do not hardcode credentials, absolute URLs, or test data inline in test files. Relative paths under `baseURL` (e.g. `'/inventory.html'`) are fine; route glob patterns are test data and live in `test-data/routes.ts`.
- Do not instantiate page objects manually in tests — use fixtures.
- Do not skip pre-commit hooks (`--no-verify`).
- Do not commit `.env`, `.auth/`, or any file containing secrets.
- Do not use `page.metrics()` for performance assertions — it is Chromium/CDP only. Use `window.performance.getEntriesByType('navigation')` via `page.evaluate()`.
- Do not add AI tool attribution (Claude, Copilot, etc.) to commit messages or PR descriptions.

---

## CI

GitHub Actions runs on push to `main`, on pull requests, and on a weekly schedule. The pipeline:

1. Runs `typecheck`, `lint`, and `format:check` (gates the test job)
2. Runs tests in parallel across Chromium, Firefox, and WebKit, plus a mobile (Pixel 7) job that runs the `@smoke` journey on the chromium binary
3. Uploads HTML reports as artifacts (30-day retention)
4. On green `main` builds, merges the per-browser blob reports into one HTML report and deploys it to GitHub Pages (`publish-report` job — least-privilege `pages`/`id-token` scopes, main-push only)

A `schedule:` trigger (Mon 06:00 UTC) re-runs the full matrix as a weekly canary — saucedemo.com is a third-party dependency that can drift between commits, so this keeps the badge honest while the repo is dormant. It's validation only: `publish-report` is push-to-main gated, so scheduled runs never republish. A `concurrency` block cancels superseded runs for the same PR only — non-PR events (push, schedule, `workflow_dispatch`) use a unique per-run group key (`github.run_id`), so they never share a slot and a push mid-deploy to Pages always finishes.

`SAUCEDEMO_PASSWORD` is a GitHub Actions secret. `SAUCEDEMO_USERNAME`, `SAUCEDEMO_LOCKED_USERNAME`, and `SAUCEDEMO_PROBLEM_USERNAME` are Actions variables (non-sensitive, public demo site values).

A second, manually dispatched workflow (`update-snapshots.yml`) regenerates the visual baselines on a branch, commits them as `github-actions[bot]`, and re-dispatches the test workflow so the new head SHA gets a CI run.

---

## Further context

See [`.claude/PLAN.md`](.claude/PLAN.md) for the full implementation roadmap and [`ROADMAP.md`](ROADMAP.md) for the high-level PR overview.
