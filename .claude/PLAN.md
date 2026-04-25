# Plan: Repo Improvements — PR Breakdown

## Context

Playwright + TypeScript test suite for saucedemo.com, targeting a Senior/Lead SDET portfolio. 20 focused PRs split into two phases: **Phase 1** (highest signal, mergeable immediately) and **Phase 2** (enhancements). Conventional commit prefixes throughout. No Claude/Anthropic attribution.

---

## Phase 1 — Foundation & High-Signal PRs

### Infrastructure & Tooling (PRs 1–8)

#### PR 1 — `docs: add AGENTS.md and CLAUDE.md`

**Branch:** `docs/agent-instructions`

- **`AGENTS.md`** (< 200 lines) — agent-agnostic: project purpose, folder structure, how to run, conventions (`getByTestId`, fixture pattern, test tagging, selector strategy), what not to do, how to add a new page/test
- **`CLAUDE.md`** — single paragraph pointing to `AGENTS.md`
- **`ROADMAP.md`** — high-level summary of all 20 PRs grouped by phase; committed to the repo as a public project roadmap (no implementation detail, PR titles and one-line descriptions only)
- **`.claude/PLAN.md`** — the full detailed implementation plan, committed to the repo; lives in `.claude/` to signal it's AI tooling context rather than source code. Provides full implementation context for future agents and shows depth of planning to anyone browsing the repo
- **`README.md`** — add one-liner noting `AGENTS.md` contains AI agent instructions and link to `ROADMAP.md`

**Files:** `AGENTS.md` (new), `CLAUDE.md` (new), `ROADMAP.md` (new), `.claude/PLAN.md` (new, committed), `README.md`

---

#### PR 2 — `chore: add tsconfig, npm scripts, and commit lockfile`

**Branch:** `chore/tsconfig-and-scripts`

- Create `tsconfig.json` (`strict: true`, `ES2022`, `commonjs`, includes all source dirs)
- Add TypeScript path aliases: `@/pages`, `@/fixtures`, `@/test-data`, `@/utils`, `@/config` — eliminates deep relative imports. Note: Playwright Test v1.34+ supports tsconfig path aliases at runtime; verify they resolve correctly before updating imports across the codebase
- Add base scripts: `test`, `test:headed`, `test:ui`, `test:report`
- Clean up `package.json`: remove `"main"` and `"keywords"`, add `"description"` and `"author"`
- Fix `.prettierrc.js` duplicate `endOfLine` key (line 2)
- Remove `package-lock.json` from `.gitignore` and commit it — required for `npm ci`
- Create `.nvmrc` with `24` for Node version pinning
- Delete empty `tests-examples/` directory
- **README** — add Prerequisites and Commands sections

**Files:** `tsconfig.json` (new), `.nvmrc` (new), `package.json`, `.prettierrc.js`, `.gitignore`, `package-lock.json`, `README.md`

---

#### PR 3 — `chore: add ESLint with TypeScript and Playwright plugins`

**Branch:** `chore/eslint`

- Install: `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-playwright`, `prettier`
- Create `eslint.config.js` (ESLint 10 flat config, `typescript-eslint` v8 unified package, `eslint-plugin-playwright` scoped to `tests/**`)
- Add scripts: `lint`, `lint:fix`, `format`, `format:check`, `typecheck`
- **README** — add lint/format/typecheck to Commands table
- **AGENTS.md** — add ESLint/Prettier to "how to run" section

**Files:** `eslint.config.js` (new), `package.json`, `README.md`, `AGENTS.md`

---

#### PR 4 — `chore: move credentials to environment variables`

**Branch:** `chore/dotenv`

- Install: `dotenv`
- Use `SAUCEDEMO_USERNAME`, `SAUCEDEMO_PASSWORD`, `SAUCEDEMO_LOCKED_USERNAME` — avoids collision with reserved `$USERNAME` shell variable on macOS/Linux
- Create `.env` (gitignored) and `.env.example` (committed)
- Update `config/env.ts` to read from `process.env` with fallbacks
- Uncomment dotenv import in `playwright.config.ts`
- Add `.env` and `.auth/` to `.gitignore`
- **README** — add Environment Setup section
- **AGENTS.md** — never hardcode credentials, use `.env`

**Files:** `config/env.ts`, `.env` (new), `.env.example` (new), `.gitignore`, `playwright.config.ts`, `README.md`, `AGENTS.md`

---

#### PR 5 — `chore: add pre-commit hooks with Husky and lint-staged`

**Branch:** `chore/husky`

- Install: `husky`, `lint-staged`
- `npx husky init` — creates `.husky/pre-commit`
- Configure `lint-staged` in `package.json`: run `eslint --fix` + `prettier --write` on staged `.ts` files
- Add `prepare` script: `husky`
- **README** — Contributing section: pre-commit hooks run automatically
- **AGENTS.md** — hooks run on commit; `--no-verify` should never be used

**Files:** `.husky/pre-commit` (new), `package.json`, `README.md`, `AGENTS.md`

---

#### PR 6 — `chore: add Dependabot, PR template, and CODEOWNERS`

**Branch:** `chore/github-config`

- Create `.github/dependabot.yml` — weekly npm + GitHub Actions updates targeting `main`
- Create `.github/pull_request_template.md` — checklist: tests pass, lint clean, new tests added, README updated if relevant
- Create `.github/CODEOWNERS` — assigns ownership of `pages/`, `tests/`, `fixtures/`, `.github/` to repo owner; signals Lead-level thinking about code ownership
- **README** — mention automated dependency updates

**Files:** `.github/dependabot.yml` (new), `.github/pull_request_template.md` (new), `.github/CODEOWNERS` (new), `README.md`

---

#### PR 7 — `ci: improve GitHub Actions pipeline`

**Branch:** `ci/pipeline-improvements`

- Add `lint` job (`typecheck`, `lint`, `format:check`) that gates the `test` job
- Change `npm i` → `npm ci`
- Use `strategy.matrix` to run browsers in parallel with separate named artifacts per browser
- Pass credentials as GitHub Actions secrets (`${{ secrets.SAUCEDEMO_USERNAME }}` etc.)
- Pin Node version to `.nvmrc` via `node-version-file: '.nvmrc'`
- Increase artifact retention to 30 days
- Switch `reporter` in `playwright.config.ts` to `[['github'], ['html']]` in CI and `[['list'], ['html']]` locally — `github` reporter shows `[chromium] ✓ test name` per line and adds inline PR annotations for failures
- **README** — fix broken clone URL, update CI badge, add CI section

**Files:** `.github/workflows/playwright.yml`, `playwright.config.ts`, `README.md`

---

#### PR 8 — `feat: add Monocart reporting`

**Branch:** `feat/monocart-reporter`

- Install: `monocart-reporter` — pure JavaScript, no Java dependency, visually rich alternative to Allure
- Add `monocart-reporter` to `playwright.config.ts` reporters array alongside existing `html` and `junit` reporters
- Add `monocart-report/` to `.gitignore`
- Update CI to upload Monocart report as an artifact
- Add `test:report:monocart` script
- **README** — add Reporting section explaining the three report types and when to use each

**Files:** `playwright.config.ts`, `package.json`, `.gitignore`, `.github/workflows/playwright.yml`, `README.md`

---

### Framework Patterns (PRs 9–13)

#### PR 9 — `fix: code quality and Playwright config improvements`

**Branch:** `fix/code-quality`

- `pages/productsPage.ts:83` — `==` → `===`
- `pages/productsPage.ts:80-81` and `pages/loginPage.ts` — remove redundant double `waitForLoadState`
- `tests/products.test.ts` / `tests/checkout.test.ts` — remove unused `expect` and `locked_username` imports
- `playwright.config.ts` — enable `baseURL`, set `testIdAttribute: 'data-test'`, add `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`
- Migrate all `page.locator('[data-test="..."]')` → `page.getByTestId('...')`. Keep `getByRole` / `getByText` where no `data-test` attribute exists
- Update all `page.goto(url)` → `page.goto('/')`
- **AGENTS.md** — add selector strategy: `getByTestId` for `data-test` attrs, `getByRole`/`getByText` otherwise

**Files:** `pages/productsPage.ts`, `pages/loginPage.ts`, `pages/checkoutPage.ts`, `tests/products.test.ts`, `tests/checkout.test.ts`, `playwright.config.ts`, `AGENTS.md`

---

#### PR 10 — `feat: add Playwright fixtures`

**Branch:** `feat/fixtures`

- Create `fixtures/index.ts` — extends `base.test` with `loginPage`, `productsPage`, `checkoutPage` fixture props
- Update all 3 test files to import from `@/fixtures` and use injected page objects; remove manual `new *Page(page)` boilerplate
- **README** — add Architecture section: POM + fixtures pattern and rationale
- **AGENTS.md** — update "how to add a test" to use fixtures import

**Files:** `fixtures/index.ts` (new), `tests/login.test.ts`, `tests/products.test.ts`, `tests/checkout.test.ts`, `README.md`, `AGENTS.md`

---

#### PR 11 — `feat: add storageState authentication`

**Branch:** `feat/storage-state`

- Create `global-setup.ts` — logs in as `standard_user`, saves `.auth/user.json`
- Update `playwright.config.ts` — add `globalSetup`, set `storageState: '.auth/user.json'` in `use`
- Add `test.use({ storageState: { cookies: [], origins: [] } })` to login tests needing unauthenticated state
- **README** — add storageState to Architecture section
- **AGENTS.md** — unauthenticated tests need `test.use` override

**Files:** `global-setup.ts` (new), `playwright.config.ts`, `tests/login.test.ts`, `README.md`, `AGENTS.md`

---

#### PR 12 — `feat: externalise test data and add dynamic locators`

**Branch:** `feat/test-data`

- Create `test-data/users.ts` — typed `Users` const covering all 6 SauceDemo user types
- Create `test-data/checkout.ts` — `CheckoutData` with valid + 3 invalid form scenarios
- Create `utils/helpers.ts` — `Products` const with product slugs
- Refactor `pages/productsPage.ts` — replace 8 product-specific locators with `addToCartButton(slug)` / `removeButton(slug)` generic methods
- Update tests to reference `Users.*`, `CheckoutData.*`, `Products.*`
- **README** — update folder structure in Architecture section

**Files:** `test-data/users.ts` (new), `test-data/checkout.ts` (new), `utils/helpers.ts` (new), `pages/productsPage.ts`, `tests/products.test.ts`, `tests/checkout.test.ts`, `README.md`

---

#### PR 13 — `feat: multi-role authentication with storageState`

**Branch:** `feat/multi-role-storage-state`

- Update `global-setup.ts` to generate separate auth state: `.auth/standard-user.json`, `.auth/problem-user.json`
- Extend `fixtures/index.ts` with an `authenticatedAs` fixture for role-based storageState switching
- Add `problem_user` tests (broken images, wrong product names) using the role fixture
- **README** / **AGENTS.md** — update auth section to explain multi-role pattern

**Files:** `global-setup.ts`, `fixtures/index.ts`, `tests/products.test.ts`, `README.md`, `AGENTS.md`

---

### Test Coverage (PRs 14–16)

#### PR 14 — `test: improve test coverage, tagging, and structure`

**Branch:** `test/coverage-improvements`

- Tag tests `@smoke` / `@regression` via `{ tag: '@smoke' }` option
- Add `test:smoke` and `test:regression` scripts
- Split monolithic 30-step products test into 3–4 focused tests
- Add negative checkout form tests using `CheckoutData` constants
- Add `afterEach` to `tests/login.test.ts` for consistency
- **README** — add Test Strategy section

**Files:** `tests/login.test.ts`, `tests/products.test.ts`, `tests/checkout.test.ts`, `package.json`, `README.md`

---

#### PR 15 — `test: add accessibility tests`

**Branch:** `test/accessibility`

- Install: `@axe-core/playwright`
- Create `tests/accessibility.test.ts`: login (unauthenticated), products, cart, checkout
- `AxeBuilder.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])`
- Login page uses `test.use({ storageState: { cookies: [], origins: [] } })`
- Tag all `@a11y`
- **README** — add a11y to Test Strategy

**Files:** `tests/accessibility.test.ts` (new), `package.json`, `README.md`

---

#### PR 16 — `test: add network interception tests`

**Branch:** `test/network-interception`

- Create `tests/network.test.ts` using `page.route()`:
  - 500 on login → verify error message
  - Slow network on products page → verify loading state
- Tag `@regression`
- **README** / **AGENTS.md** — add network interception pattern

**Files:** `tests/network.test.ts` (new), `README.md`, `AGENTS.md`

---

## Phase 2 — Enhancements

### Enhancements (PRs 17–20)

#### PR 17 — `test: add visual regression tests`

**Branch:** `test/visual-regression`

- Create `tests/visual.test.ts` using `toHaveScreenshot()` for key pages under `standard_user` and `problem_user`
- Commit baseline snapshots under `tests/visual.test.ts-snapshots/`
- Add `test:visual` and `test:visual:update` scripts
- Create `.gitattributes` to mark snapshot files as binary
- **README** — add Visual Regression section

**Files:** `tests/visual.test.ts` (new), `package.json`, `.gitattributes` (new), `README.md`

---

#### PR 18 — `test: add performance tests`

**Branch:** `test/performance`

- Create `tests/performance.test.ts` using `page.evaluate(() => window.performance.getEntriesByType('navigation')[0])` — uses standard Web Performance API, works across Chromium, Firefox, and WebKit (unlike `page.metrics()` which is Chromium/CDP only)
- Assert products page DOM content loaded time is within threshold for `standard_user`
- Assert `performance_glitch_user` load time measurably exceeds `standard_user` (documents known slow behaviour)
- Tag `@performance`; add `test:performance` script
- **README** — add Performance Testing to Test Strategy

**Files:** `tests/performance.test.ts` (new), `package.json`, `README.md`

---

#### PR 19 — `chore: add Dockerfile for containerised test execution`

**Branch:** `chore/docker`

- Create `Dockerfile` — extends `mcr.microsoft.com/playwright` base image, runs `npm ci`, default `CMD ["npm", "test"]`
- Create `.dockerignore`
- Add `test:docker` script
- **README** — add Docker section
- **AGENTS.md** — note tests can be run via Docker

**Files:** `Dockerfile` (new), `.dockerignore` (new), `package.json`, `README.md`, `AGENTS.md`

---

#### PR 20 — `refactor: extract shared page components`

**Branch:** `refactor/page-components`

- Create `components/HeaderComponent.ts` — cart icon badge, burger menu (currently duplicated across page objects)
- Create `components/NavigationComponent.ts` — sidebar menu reset/logout actions (currently duplicated across page objects)
- Update page objects to compose from these components; test files remain unchanged
- **README** / **AGENTS.md** — update Architecture section; shared UI goes in `components/`, page-specific in `pages/`

**Files:** `components/HeaderComponent.ts` (new), `components/NavigationComponent.ts` (new), `pages/loginPage.ts`, `pages/productsPage.ts`, `pages/checkoutPage.ts`, `README.md`, `AGENTS.md`

---

## Execution Order

**Phase 1:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16

**Phase 2:** 17 → 18 → 19 → 20

Phase 1 PRs 1–8 are pure infrastructure and can be reviewed/merged in parallel once ready. PRs 9–16 depend on 1–8. Phase 2 can begin after Phase 1 is complete.

---

## Workflow

Each PR will be created, then paused for review and approval before the next one begins. Each PR will be assigned to @qasimmahmood95.

## PR Description Format

Each PR description follows this structure — concise, scannable, no padding:

```text
Brief one-line context sentence explaining the motivation for this change.

## Changes
- `file.ts` — one-line rationale
- `file2.ts` — one-line rationale

## Layer affected
_Test coverage / Page objects / Fixtures / Config / CI/CD / Documentation_

## Affected test suites
_@smoke / @regression / @a11y / @visual / @performance / N/A_

## Checklist
- [x] `npm test` passes
- [x] `npm run lint` passes
- [x] No `waitForTimeout` introduced
- [x] No hardcoded credentials or inline test data

## Dependencies
_Depends on: #N_ (omit if none)
```

## Merge Strategy

Use **Squash and merge** for all PRs. This collapses each PR into a single commit on `main` using the PR title as the message — resulting in a clean, linear `git log` that reads like a professional changelog. Configure in GitHub: **Settings → General → Pull Requests → allow squash merging only**, default message set to "Pull request title and description."
