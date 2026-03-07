# SauceDemo — Playwright E2E Test Framework

[![Playwright Tests](https://github.com/qasimmahmood95/playwright-web-automation-ts/actions/workflows/playwright.yml/badge.svg)](https://github.com/qasimmahmood95/playwright-web-automation-ts/actions/workflows/playwright.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Playwright](https://img.shields.io/badge/Playwright-1.45-green)
![Browsers](https://img.shields.io/badge/browsers-Chromium%20%7C%20Firefox%20%7C%20WebKit-informational)

A production-grade end-to-end test automation framework for [SauceDemo](https://www.saucedemo.com), built with [Playwright](https://playwright.dev) and TypeScript.

---

## Architecture

```
├── .github/workflows/        # CI/CD pipeline (lint gate + parallel browser matrix)
├── config/
│   └── env.ts                # Environment variable config (reads from .env / CI secrets)
├── fixtures/
│   └── index.ts              # Custom Playwright fixtures — page object injection
├── pages/
│   ├── loginPage.ts          # Login, logout, sidebar interactions
│   ├── productsPage.ts       # Inventory, cart badge, dynamic product selectors
│   └── checkoutPage.ts       # Checkout form, order summary, confirmation
├── test-data/
│   ├── users.ts              # All 6 SauceDemo user types with documented behaviours
│   └── checkout.ts           # Checkout form data (valid + validation error scenarios)
├── tests/
│   ├── login.test.ts         # @smoke + @regression login scenarios
│   ├── products.test.ts      # @smoke + @regression cart and inventory scenarios
│   ├── checkout.test.ts      # @smoke + @regression checkout flow and form validation
│   └── accessibility.test.ts # @a11y — WCAG 2.1 AA scans across all key pages
├── utils/
│   └── helpers.ts            # Products const (maps human names to data-test slugs)
├── global-setup.ts           # Runs once — persists authenticated session to .auth/
├── playwright.config.ts      # Browsers, reporters, storageState, global setup
└── tsconfig.json             # Strict TypeScript configuration
```

---

## Test Strategy

### Authentication State (storageState)

Rather than logging in through the UI before every test, `global-setup.ts` runs once before the suite, logs in as the standard user, and saves the session to `.auth/standard-user.json`. All tests that require an authenticated session restore this state instantly — no UI login roundtrip.

Login tests clear the storage state explicitly via `test.use({ storageState: { cookies: [], origins: [] } })` because they are testing the login flow itself.

### Page Object Model (POM)

Each page of the application has a corresponding class in `pages/`. Locators are declared once in the constructor using `data-test` attributes — the most resilient selector strategy for apps that expose them. Methods are granular (one action per method) to maximise reuse and readability.

`ProductsPage` uses dynamic locator methods (`addToCart(productSlug)`, `removeFromCart(productSlug)`) combined with the `Products` const from `utils/helpers.ts`, so tests reference named products rather than brittle hardcoded strings:

```ts
await productsPage.addToCart(Products.ONESIE).click();
```

### Custom Fixtures

Tests import `{ test, expect }` from `../fixtures` rather than directly from `@playwright/test`. Page objects are injected as fixture arguments, removing boilerplate construction from every test body:

```ts
// Before fixtures:
const products = new ProductsPage(page);
await products.addToCart(Products.ONESIE).click();

// After fixtures:
test('...', async ({ productsPage }) => {
  await productsPage.addToCart(Products.ONESIE).click();
});
```

### Test Tagging

Tests are tagged for targeted execution in CI:

| Tag | Purpose |
|-----|---------|
| `@smoke` | Critical path — runs on every push |
| `@regression` | Full regression — runs on schedule or pre-release |
| `@a11y` | Accessibility scans — runs on schedule |

### SauceDemo Users

SauceDemo provides six user accounts, each exercising a different behaviour path:

| User | Behaviour |
|------|-----------|
| `standard_user` | Full happy-path access |
| `locked_out_user` | Login blocked — tests error state |
| `problem_user` | Broken images, sorting doesn't work |
| `performance_glitch_user` | Artificial latency on every action |
| `error_user` | Some actions throw errors mid-flow |
| `visual_user` | Altered visual presentation |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS)
- [npm](https://npmjs.com)

### Installation

```bash
git clone https://github.com/qasimmahmood95/playwright-web-automation-ts.git
cd playwright-web-automation-ts
npm ci
npx playwright install --with-deps
```

### Environment Variables

Copy the example env file and adjust if needed:

```bash
cp .env.example .env
```

The defaults in `.env.example` work against the public SauceDemo site. In CI, variables are set as GitHub Actions secrets/variables.

---

## Running Tests

```bash
# Full suite (all browsers)
npm test

# Smoke tests only
npm run test:smoke

# Regression tests only
npm run test:regression

# Accessibility tests only
npm run test:a11y

# Single browser (fast local iteration)
npm run test:chromium

# Headed mode (watch the browser)
npm run test:headed

# Playwright Inspector (step-through debugging)
npm run test:debug

# Open the HTML report after a run
npm run test:report
```

---

## Code Quality

```bash
# Type check (no emit)
npm run typecheck

# ESLint
npm run lint
npm run lint:fix

# Prettier
npm run format:check
npm run format
```

---

## CI/CD

The GitHub Actions pipeline runs on push and PR to `main`, and can be triggered manually.

```
push / PR
    │
    ▼
┌─────────────────────────────┐
│  lint job                   │
│  typecheck + lint + format  │
└────────────┬────────────────┘
             │ (passes)
    ┌────────┼────────┐
    ▼        ▼        ▼
chromium  firefox  webkit   (parallel)
    │        │        │
    └────────┴────────┘
             │
    named artifacts per browser
    (playwright-report-{browser})
```

Each browser job uploads its own HTML report and JUnit XML artifact, making it straightforward to identify whether a failure is browser-specific.
