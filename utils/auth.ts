import config from '@/config/env';

/**
 * Roles with pre-authenticated storage state. `tests/global.setup.ts` logs in
 * once per browser + role pair and saves the session to `authFile(browser, role)`.
 * Tests select a role with `test.use({ role: 'problem' })` — see `fixtures/index.ts`.
 *
 * To add a role: add its username below, then wire the env var through
 * `config/env.ts`, `.env.example`, and the CI workflow `env` block.
 */
export const roleUsernames = {
  standard: config.username,
  problem: config.problem_username,
} as const;

export type AuthRole = keyof typeof roleUsernames;

export const authRoles = Object.keys(roleUsernames) as AuthRole[];

export const authFile = (browser: string, role: AuthRole): string =>
  `.auth/${browser}-${role}.json`;
