import { test as base } from '@playwright/test';
import LoginPage from '@/pages/loginPage';
import ProductsPage from '@/pages/productsPage';
import CheckoutPage from '@/pages/checkoutPage';
import { authFile, type AuthRole } from '@/utils/auth';

type Fixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  checkoutPage: CheckoutPage;
};

type AuthOptions = {
  /** Stored-auth role for the test. Override per file or describe block with `test.use({ role: 'problem' })`. */
  role: AuthRole;
};

export const test = base.extend<Fixtures & AuthOptions>({
  role: ['standard', { option: true }],

  // Resolve the storage state file from the active browser + role pair.
  // The files are created by tests/global.setup.ts, which every test project
  // depends on (see playwright.config.ts). Tests that must start logged out
  // override with test.use({ storageState: { cookies: [], origins: [] } }).
  storageState: async ({ role, browserName }, use) => {
    await use(authFile(browserName, role));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from '@playwright/test';
