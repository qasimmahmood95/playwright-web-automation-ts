import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import globals from 'globals';

export default tseslint.config(
  // Base JS recommended rules for all files
  js.configs.recommended,

  // TypeScript recommended rules for all TS source files
  ...tseslint.configs.recommended,

  // Playwright recommended rules scoped to test files only
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Hard-coded waits are a flakiness smell — force explicit assertions instead
      'playwright/no-wait-for-timeout': 'error',
      // Enforce web-first assertions (toBeVisible, toHaveText) over JS-land checks
      'playwright/prefer-web-first-assertions': 'error',
      // Disabled: cannot statically resolve assertions inside POM methods
      'playwright/expect-expect': 'off',
    },
  },

  // Node.js globals for CommonJS config files
  {
    files: ['*.js', '*.cjs', '*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Global ignores
  {
    ignores: ['node_modules/', 'dist/', 'playwright-report/', 'test-results/', '.auth/'],
  }
);
