import { test } from '@/fixtures';

test.beforeEach(async ({ page, loginPage }, testInfo) => {
  console.log(`Running ${testInfo.title}`);

  await page.goto('/');
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

  await productsPage.clickOnesieAddToCartButton();
  await productsPage.checkOnesieRemoveButton();
  await productsPage.checkShoppingCartHasItems(1);
  await productsPage.clickBikeLightAddToCartButton();
  await productsPage.checkBikeLightRemoveButton();

  await productsPage.clickShoppingCartButton();
  await productsPage.checkTitle('Your Cart');

  await productsPage.clickOnesieRemoveButton();
  await productsPage.checkShoppingCartHasItems(1);
  await productsPage.clickBikeLightRemoveButton();
  await productsPage.checkShoppingCartHasItems(0);
});
