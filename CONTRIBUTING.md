# Contributing

Thanks for your interest in this project. It is a Senior/Lead SDET portfolio suite, and production-grade standards apply throughout. This guide covers the workflow; [`AGENTS.md`](AGENTS.md) is the authoritative reference for conventions (selector strategy, page objects, fixtures, tags, and what not to do). Read it before making changes.

## Getting started

1. Fork and clone the repository.
2. Follow the [Setup steps in the README](README.md#setup): `npm ci`, then `npx playwright install --with-deps`. The suite ships with the public demo-site logins as defaults, so it runs with no secrets to fill in.
3. Create a branch for your change.

## Before you open a pull request

Run the same checks CI runs, all of which must pass:

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
```

Pre-commit hooks (Husky + lint-staged) auto-fix and format staged `.ts` files on every commit. Do not bypass them with `--no-verify`.

## Conventions

- Import `{ test, expect }` from `@/fixtures`, never from `@playwright/test` directly.
- Page objects own all locators; test files never call `page.locator()` or `getBy*` directly.
- Tag functional tests `@regression` (critical journeys also `@smoke`); non-functional suites carry their own tag (`@a11y`, `@visual`, `@performance`). Apply tags through the `{ tag: [...] }` option, never in test titles.
- Never use `page.waitForTimeout()`; rely on web-first assertions.
- Never hardcode credentials or commit `.env`, `.auth/`, or generated visual baselines.

The full rationale for each of these lives in [`AGENTS.md`](AGENTS.md). When adding a page object, test, or component, follow the step-by-step guides there.

## Pull requests

- Keep each PR focused on a single concern.
- Fill in the [pull request template](.github/pull_request_template.md); it captures the layer affected, the suites touched, and the pre-merge checklist.
- CI (lint, type-check, format, and the three-browser test matrix) must be green before merge.

## Reporting issues

Use the [issue templates](.github/ISSUE_TEMPLATE) to file a bug or request a feature. Please include enough detail to reproduce a bug: the affected browser, the steps, and what you expected.
