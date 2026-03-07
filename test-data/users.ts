/**
 * SauceDemo user accounts.
 * Each user type exercises a different behaviour path through the application.
 * See https://www.saucedemo.com for the full list of test credentials.
 */
export const Users = {
  /** Standard user: full happy-path access */
  STANDARD: { username: 'standard_user', password: 'secret_sauce' },
  /** Locked out: login is blocked — used to test the error state */
  LOCKED: { username: 'locked_out_user', password: 'secret_sauce' },
  /** Problem user: broken images and sorting on the products page */
  PROBLEM: { username: 'problem_user', password: 'secret_sauce' },
  /** Performance glitch user: artificial latency on every action */
  PERFORMANCE_GLITCH: { username: 'performance_glitch_user', password: 'secret_sauce' },
  /** Error user: some actions throw errors mid-flow */
  ERROR: { username: 'error_user', password: 'secret_sauce' },
  /** Visual user: altered visual presentation for visual regression testing */
  VISUAL: { username: 'visual_user', password: 'secret_sauce' },
} as const;

export type User = (typeof Users)[keyof typeof Users];
