# playwright-web-automation-ts

Production-ready Playwright test suite for the [SauceDemo](https://www.saucedemo.com/) e-commerce flow, built with TypeScript.

[![Playwright Tests](https://github.com/qasimmahmood95/playwright-web-automation-ts/actions/workflows/playwright.yml/badge.svg)](https://github.com/qasimmahmood95/playwright-web-automation-ts/actions/workflows/playwright.yml)
[![Live report](https://img.shields.io/badge/live%20report-Playwright-2EAD33?logo=playwright)](https://qasimmahmood95.github.io/playwright-web-automation-ts/)

📊 **[View the live test report →](https://qasimmahmood95.github.io/playwright-web-automation-ts/)** — the merged Chromium/Firefox/WebKit HTML report from the latest `main` build, published to GitHub Pages.

## Highlights

A production-grade E2E suite that goes well beyond click-through tests:

- **Five tagged test dimensions** — functional (`@smoke` / `@regression`), accessibility (`@a11y`, axe-core WCAG scans), visual (`@visual`, cross-browser screenshots), and performance (`@performance`, navigation timing) — each runnable in isolation.
- **Multi-role authentication via `storageState`** — a setup project logs in once per browser + role (`standard` / `problem` / `glitch`) and saves the session; tests switch role with a one-line fixture option and never touch the login form.
- **CI-generated visual baselines** — screenshots are baselined on the CI Linux platform by a dedicated `workflow_dispatch` pipeline that commits them and re-triggers checks, so `@visual` is stable and never depends on a contributor's local OS.
- **Architecture-aware, honest testing** — the network and performance suites are built around SauceDemo's actual fully client-side app (no fake API stubs); performance asserts the seeded `performance_glitch_user` delay through a same-run relative comparison, immune to CI noise.
- **Runs anywhere, reports live** — a version-pinned Playwright Docker image reproduces the CI platform locally, and every green `main` build publishes a merged three-browser HTML report to [GitHub Pages](https://qasimmahmood95.github.io/playwright-web-automation-ts/).
- **Clean framework design** — Page Object Model plus shared UI components, typed fixtures, path aliases, externalised test data, and first-class AI-agent docs ([`AGENTS.md`](AGENTS.md)).

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

| Variable                         | Description                   |
| -------------------------------- | ----------------------------- |
| `SAUCEDEMO_USERNAME`             | Standard test user login      |
| `SAUCEDEMO_PASSWORD`             | Shared password for all users |
| `SAUCEDEMO_LOCKED_USERNAME`      | Locked-out user login         |
| `SAUCEDEMO_PROBLEM_USERNAME`     | Problem user login            |
| `SAUCEDEMO_PERFORMANCE_USERNAME` | Performance glitch user login |

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
npm run test:visual
npm run test:performance
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

## Docker

The suite runs in a container built on [`mcr.microsoft.com/playwright`](https://mcr.microsoft.com/en-us/product/playwright/about), pinned to the same Playwright version as `package-lock.json`. The image bundles Node, all three browser engines, and their system dependencies, so there is no local `npx playwright install` step. It renders on the same Ubuntu/Playwright-on-Linux platform as CI, so it is the closest local environment for running the `@visual` suite from macOS or Windows, where native rendering never matches the Linux baselines.

```bash
# Build the image and run the full suite inside it
npm run test:docker
```

| Concern     | Handling                                                                                                   |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| Browsers    | Bundled in the base image — no `npx playwright install` step.                                              |
| Credentials | Public demo defaults come from `config/env.ts`; override at runtime with `--env-file .env`, never a layer. |
| Platform    | Linux, matching CI — the closest local environment to reproduce a CI-only failure.                         |
| HTML report | Written inside the container; mount a volume to keep it on the host (see below).                           |

To exercise non-default credentials, pass your local `.env` at runtime — the same file used for local runs, never copied into the image (`.dockerignore` excludes it):

```bash
docker run --rm --env-file .env playwright-web-automation-ts
```

The HTML report is written inside the container and discarded when it exits. To keep it, mount a host directory over the report path (files land root-owned, since the container runs as root):

```bash
docker run --rm -v "$(pwd)/playwright-report:/app/playwright-report" playwright-web-automation-ts
```

This is a **local convenience, not a change to CI** — the pipeline still runs on `ubuntu-latest` with npx-installed browsers. The `@visual` suite compares against the CI-generated `-linux` baselines; whether they match inside the container depends on the image rendering identically to the runner (same platform, but not guaranteed byte-identical). Treat any Docker-only `@visual` diffs as environment noise, and never commit baselines the container produces — the canonical Linux baselines are generated exclusively by the `update-snapshots.yml` workflow (see [Visual regression](#visual-regression)), and the container's snapshots carry the same `-linux` suffix, so `.gitignore` (which only excludes `-darwin`/`-win32`) will not stop an accidental commit. Keep the Dockerfile's base-image tag in lockstep with the `@playwright/test` version — a version skew changes the browser builds.

## Architecture

### Page Object Model

Each page of the application has a dedicated class in `pages/` that encapsulates all locators and interactions for that page. Test files never use raw `page.locator()` calls — all selector logic lives in the page objects.

### Shared components

Cross-page chrome — the Swag Labs logo, the header cart icon + item badge and burger menu button, and the sidebar's reset-app-state and logout actions — lives in `components/` instead of being duplicated across page objects. `HeaderComponent` owns the always-visible top bar; `NavigationComponent` owns the sidebar drawer the burger opens. Page objects compose the header (so a test reaches the cart or logo through the page object it already uses, e.g. `productsPage.checkShoppingCartHasItems()`), while the sidebar drawer is injected directly as the `appMenu` fixture and drives the reset-and-logout teardown. Anything tied to a single page stays in that page object; the split is simply shared-across-pages → `components/`, one-page-only → `pages/`.

### Fixtures

`fixtures/index.ts` extends Playwright's base `test` with pre-instantiated page objects (`loginPage`, `productsPage`, `checkoutPage`) and shared UI components (`appHeader`, `appMenu`). This eliminates boilerplate in every test file — page objects and components are injected by name rather than constructed with `new`.

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

`tests/global.setup.ts` is a Playwright setup project that runs once before each browser's test suite. It logs in once per **role** (`standard`, `problem`, `glitch`) and saves cookies and storage to `.auth/<browser>-<role>.json`. Each test project depends on its matching setup project, and the `role` fixture option in `fixtures/index.ts` resolves which state file a test loads — no test ever goes through the login form.

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

| Tag            | Scope                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `@smoke`       | Critical-path user journeys — login, add to cart, checkout. Fast signal on every change.       |
| `@regression`  | The full functional suite. Every functional test carries it.                                   |
| `@a11y`        | Automated WCAG 2.0/2.1 A + AA scans (axe-core) of the journey pages. Non-functional.           |
| `@visual`      | Full-page screenshot comparisons against CI-generated Linux baselines. Non-functional.         |
| `@performance` | Cross-browser navigation-timing checks (sanity ceiling + seeded-glitch delta). Non-functional. |

Tags are applied through the test's `{ tag: [...] }` option — never encoded in describe-block names or titles:

```ts
test('Standard user can login', { tag: ['@smoke', '@regression'] }, async ({ loginPage }) => { ... });
```

```bash
# Critical-path journeys only
npm run test:smoke          # playwright test --grep @smoke

# Full functional suite
npm run test:regression     # playwright test --grep @regression

# Accessibility scans
npm run test:a11y           # playwright test --grep @a11y

# Visual regression
npm run test:visual         # playwright test --grep @visual

# Performance checks
npm run test:performance    # playwright test --grep @performance
```

> `test:regression` matches the full functional suite by design — every functional test carries the tag. Non-functional suites carry their own tags: `@a11y`, `@visual`, and `@performance`.

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
- Product images **stubbed** with a deterministic placeholder — a reusable binary-response stubbing pattern
- All **cross-origin traffic blocked** — the app must never depend on third-party availability
- **Injected latency** on product images — the page must still reach a usable state

Interception helpers live in `utils/network.ts`; route patterns and latency constants are typed test data in `test-data/routes.ts`. Every interception test asserts its intercept counter fired, so route-pattern drift fails loudly instead of silently passing.

### Visual regression

Full-page screenshot tests (`@visual`) cover five states: login, inventory as `standard_user`, inventory as `problem_user` (capturing its known same-image-everywhere defect), cart with an item, and checkout step one.

Baselines are **Linux-only and generated exclusively in CI**: the manually dispatched **Update visual snapshots** workflow runs `--update-snapshots` on the target branch, commits the PNGs as `github-actions[bot]`, and re-dispatches the test workflow so the new head SHA still gets a full CI run (a plain `GITHUB_TOKEN` push doesn't retrigger PR checks, but a token-created `workflow_dispatch` does). Locally generated macOS/Windows baselines are gitignored — don't run `@visual` locally unless you're on Linux with matching browser builds.

When a dependency bump or a site deploy legitimately changes rendering, the visual jobs go red until someone dispatches the update workflow on that branch and reviews the baseline diff image-by-image. That is the intended re-baseline loop, not a flake.

```bash
npm run test:visual          # compare against committed baselines
npm run test:visual:update   # regenerate baselines (CI/Linux only)
```

To run `@visual` locally on a non-Linux machine, use the [Docker image](#docker) — it renders on the same Ubuntu/Playwright platform as CI. Do not commit baselines it produces; re-baselining stays with the update workflow.

### Performance

Navigation timing (`@performance`) is read through the standard cross-browser Web Performance API (`performance.getEntriesByType('navigation')`) — never `page.metrics()`, which is Chromium-only. Two tests:

- **Sanity ceiling** — the inventory page's DOM-content-loaded time stays under a generous bound for `standard_user`. A smoke alarm for pathological regressions, not an SLO: shared CI runners are too noisy for tight absolute thresholds.
- **Seeded-glitch delta** — `performance_glitch_user` triggers a deliberate ~5s render busy-wait in the app; the test measures both roles in symmetric fresh contexts in the same run and asserts the glitch's wall-clock time-to-rendered measurably exceeds the standard one. The relative comparison is immune to runner speed, and time-to-rendered captures the delay on every engine (whether the busy-wait lands before or after DOMContentLoaded is engine-dependent).

Measured values attach to the HTML report as annotations on every run. Thresholds live in `test-data/performance.ts` with a rationale comment each.

```bash
npm run test:performance   # playwright test --grep @performance
```

## Project structure

```text
playwright-web-automation-ts/
├── .claude/                  # AI tooling context (full implementation plan)
├── .dockerignore             # Files excluded from the Docker build context (node_modules, .env, reports)
├── .github/workflows/        # CI/CD pipeline
├── components/               # Shared cross-page UI composed by page objects / injected as fixtures
│   ├── HeaderComponent.ts       # Swag Labs logo, cart icon + badge, burger menu button
│   └── NavigationComponent.ts   # Sidebar reset-app-state + logout (the appMenu fixture)
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
│   ├── routes.ts             # Route patterns and traffic-shaping constants
│   ├── performance.ts        # Timing thresholds with rationale comments
│   └── products.ts           # Product slug constants (Products)
├── tests/                    # Test specs
│   ├── global.setup.ts       # storageState authentication setup
│   ├── login.test.ts
│   ├── products.test.ts
│   ├── checkout.test.ts
│   ├── accessibility.test.ts # WCAG scans of the journey pages
│   ├── network.test.ts       # Network interception and resilience tests
│   ├── visual.test.ts        # Full-page screenshot comparisons
│   ├── visual.test.ts-snapshots/ # CI-generated Linux baselines
│   └── performance.test.ts   # Navigation-timing checks
├── utils/
│   ├── a11y.ts               # axe-core scan helper with baseline filtering
│   ├── auth.ts               # Auth roles and storage-state file paths
│   ├── network.ts            # Route-interception helpers with intercept counters
│   └── performance.ts        # Navigation-timing measurement helpers
├── AGENTS.md                 # AI agent instructions (conventions, selectors, what not to do)
├── CLAUDE.md                 # Claude Code pointer to AGENTS.md
├── Dockerfile                # Containerised test run on the Playwright Linux base image
├── ROADMAP.md                # 20-PR improvement roadmap
└── playwright.config.ts
```

## Contributing

Pre-commit hooks run automatically on every `git commit` via Husky and lint-staged. Staged `.ts` files are linted (`eslint --fix`) and formatted (`prettier --write`) before the commit is created. No manual step required — hooks run transparently.

Dependencies are kept up to date automatically via [Dependabot](https://docs.github.com/en/code-security/dependabot), which raises weekly PRs for npm packages, GitHub Actions, and the Docker base image.

## CI/CD

Every push and pull request to `main` runs:

1. **Lint & type-check** — `typecheck`, `lint`, `format:check` must pass before tests run
2. **Test (matrix)** — Chromium, Firefox, and WebKit run in parallel; each uploads its own HTML report as an artifact (30-day retention) plus a blob report for merging
3. **Publish report** — on green `main` builds only, the three browsers' blob reports are merged into one HTML report and deployed to [GitHub Pages](https://qasimmahmood95.github.io/playwright-web-automation-ts/), so the latest results are viewable in-browser without downloading an artifact

Credentials are injected from GitHub Actions secrets. Per-run per-browser HTML reports are also available under **Actions → run → Artifacts**.

## AI agent support

This repo includes first-class support for AI coding assistants:

- [`AGENTS.md`](AGENTS.md) — the single source of truth for project conventions, run commands, selector strategy, and best practices. Readable by any AI assistant (Cursor, Copilot, Claude, etc.)
- [`CLAUDE.md`](CLAUDE.md) — a Claude Code-specific pointer to `AGENTS.md`
- [`.claude/PLAN.md`](.claude/PLAN.md) — full 20-PR implementation roadmap with per-PR file lists and rationale
