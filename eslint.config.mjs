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
  },

  // Node.js globals for CommonJS config files (e.g. .prettierrc.js, playwright.config.ts)
  {
    files: ['*.js', '*.cjs', '*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Global ignores
  {
    ignores: ['node_modules/', 'dist/', 'playwright-report/', 'test-results/'],
  }
);
