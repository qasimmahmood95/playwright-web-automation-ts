module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'playwright'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:playwright/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    // Discourage hard-coded waits — a sign of flaky test design
    'playwright/no-wait-for-timeout': 'error',
    // Enforce web-first assertions (toBeVisible, toHaveText) over JS-land checks
    'playwright/prefer-web-first-assertions': 'error',
    // Recognise page object assertion methods so tests that delegate to POM methods
    // aren't falsely flagged as having no assertions
    // Disabled: this rule cannot resolve assertions delegated to Page Object methods
    // (e.g. loginPage.checkProductsTitle(), productsPage.assertCartBadgeCount()).
    // All POM methods named check*/assert* wrap expect() internally.
    'playwright/expect-expect': 'off',
  },
  env: {
    node: true,
    es2020: true,
  },
};
