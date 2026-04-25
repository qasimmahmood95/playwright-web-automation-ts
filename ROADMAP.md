# Roadmap

20-PR improvement plan to bring this repository to Senior/Lead SDET portfolio standard.

---

## Phase 1 — Foundation & High-Signal (PRs 1–16)

### Infrastructure & Tooling

| PR  | Branch                       | Title                                                      |
| --- | ---------------------------- | ---------------------------------------------------------- |
| 1   | `docs/agent-instructions`    | `docs: add AGENTS.md and CLAUDE.md`                        |
| 2   | `chore/tsconfig-and-scripts` | `chore: add tsconfig, npm scripts, and commit lockfile`    |
| 3   | `chore/eslint`               | `chore: add ESLint with TypeScript and Playwright plugins` |
| 4   | `chore/dotenv`               | `chore: move credentials to environment variables`         |
| 5   | `chore/husky`                | `chore: add pre-commit hooks with Husky and lint-staged`   |
| 6   | `chore/github-config`        | `chore: add Dependabot, PR template, and CODEOWNERS`       |
| 7   | `ci/pipeline-improvements`   | `ci: improve GitHub Actions pipeline`                      |
| 8   | `feat/monocart-reporter`     | `feat: add Monocart reporting`                             |

### Framework Patterns

| PR  | Branch                          | Title                                                  |
| --- | ------------------------------- | ------------------------------------------------------ |
| 9   | `fix/code-quality`              | `fix: code quality and Playwright config improvements` |
| 10  | `feat/fixtures`                 | `feat: add Playwright fixtures`                        |
| 11  | `feat/storage-state`            | `feat: add storageState authentication`                |
| 12  | `feat/test-data`                | `feat: externalise test data and add dynamic locators` |
| 13  | `feat/multi-role-storage-state` | `feat: multi-role authentication with storageState`    |

### Test Coverage

| PR  | Branch                       | Title                                                 |
| --- | ---------------------------- | ----------------------------------------------------- |
| 14  | `test/coverage-improvements` | `test: improve test coverage, tagging, and structure` |
| 15  | `test/accessibility`         | `test: add accessibility tests`                       |
| 16  | `test/network-interception`  | `test: add network interception tests`                |

---

## Phase 2 — Enhancements (PRs 17–20)

| PR  | Branch                     | Title                                                    |
| --- | -------------------------- | -------------------------------------------------------- |
| 17  | `test/visual-regression`   | `test: add visual regression tests`                      |
| 18  | `test/performance`         | `test: add performance tests`                            |
| 19  | `chore/docker`             | `chore: add Dockerfile for containerised test execution` |
| 20  | `refactor/page-components` | `refactor: extract shared page components`               |

---

Full implementation detail for each PR is in [`.claude/PLAN.md`](.claude/PLAN.md).
