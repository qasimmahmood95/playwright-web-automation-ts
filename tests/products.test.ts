import { test } from '@/fixtures';
import { Products } from '@/utils/helpers';

test.beforeEach(async ({ page, loginPage }, testInfo) => {
  console.log(`Running ${testInfo.title}`);

  await page.goto('/inventory.html');
  await loginPage.checkSwagLabsLogo();
});

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
