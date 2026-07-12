import { expect, test } from '@/fixtures';
import { Products } from '@/utils/helpers';

test.beforeEach(async ({ page, loginPage }, testInfo) => {
  console.log(`Running ${testInfo.title}`);

  await page.goto('/inventory.html');
  await loginPage.checkSwagLabsLogo();
});

test.describe('Cart', () => {
  // Only cart tests mutate app state, so only they need the reset/logout teardown
  test.afterEach(async ({ loginPage }) => {
    await loginPage.clickOpenSidebarMenuButton();
    await loginPage.clickResetAppStateButton();
    await loginPage.clickLogoutButton();
  });

  test('Standard user can add items to the basket and remove them', async ({ productsPage }) => {
    await productsPage.clickBikeLightTitle();
    await productsPage.clickAddToCartButton();
    await productsPage.checkShoppingCartHasItems(1);
    await productsPage.clickRemoveButton();
    await productsPage.checkShoppingCartHasItems(0);
    await productsPage.clickBackToProductsButton();

    await productsPage.clickAddToCart(Products.onesie);
    await productsPage.checkRemoveButton(Products.onesie);
    await productsPage.checkShoppingCartHasItems(1);
    await productsPage.clickAddToCart(Products.bikeLight);
    await productsPage.checkRemoveButton(Products.bikeLight);

    await productsPage.clickShoppingCartButton();
    await productsPage.checkTitle('Your Cart');

    await productsPage.clickRemove(Products.onesie);
    await productsPage.checkShoppingCartHasItems(1);
    await productsPage.clickRemove(Products.bikeLight);
    await productsPage.checkShoppingCartHasItems(0);
  });
});

test(
  'Standard user sees a distinct image for each product',
  { tag: '@regression' },
  async ({ productsPage }) => {
    const sources = await productsPage.getProductImageSources();
    expect(sources.length).toBeGreaterThan(0);
    expect(new Set(sources).size).toBe(sources.length);
  }
);

test.describe('Problem user', () => {
  // Runs with the problem_user auth state saved by global.setup.ts
  test.use({ role: 'problem' });

  test(
    'Problem user sees the same broken image for every product',
    { tag: '@regression' },
    async ({ productsPage }) => {
      // Known seeded bug: every product renders the same broken placeholder image
      const sources = await productsPage.getProductImageSources();
      expect(sources.length).toBeGreaterThan(0);
      expect(new Set(sources).size).toBe(1);
    }
  );
});
