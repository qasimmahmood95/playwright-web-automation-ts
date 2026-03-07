/**
 * Centralised environment configuration.
 * Values are read from environment variables (set via .env locally, or CI secrets in GitHub Actions).
 * See .env.example for required variables.
 */
export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
  username: process.env.SAUCEDEMO_USERNAME ?? 'standard_user',
  password: process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce',
} as const;
