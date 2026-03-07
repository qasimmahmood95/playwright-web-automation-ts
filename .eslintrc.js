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
  },
  env: {
    node: true,
    es2020: true,
  },
};
