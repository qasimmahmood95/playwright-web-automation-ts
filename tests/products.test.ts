import { test, expect } from '@playwright/test';
import config from '../config/env';
import LoginPage from '../pages/loginPage';
import ProductsPage from '../pages/productsPage';

const { url, password, username, locked_username } = config;

test.beforeEach(async ({ page }, testInfo) => {
  const login = new LoginPage(page);

  console.log(`Running ${testInfo.title}`);

  await page.goto(url);
  await login.checkSwagLabsLogo();
});

test.afterEach(async ({ page }) => {
  const login = new LoginPage(page);

  await login.clickOpenSidebarMenuButton();
  await login.clickResetAppStateButton();
  await login.clickLogoutButton();
});

test('Standard user can add items to the basket and remove them', async ({ page }) => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);
  await login.login(username, password);

  await products.clickBikeLightTitle();
  await products.clickAddToCartButton();
  await products.checkShoppingCartHasItems(1);
  await products.clickRemoveButton();
  await products.checkShoppingCartHasItems(0);
  await products.clickBackToProductsButton();

  await products.clickOnesieAddToCartButton();
  await products.checkOnesieRemoveButton();
  await products.checkShoppingCartHasItems(1);
  await products.clickBikeLightAddToCartButton();
  await products.checkBikeLightRemoveButton();

  await products.clickShoppingCartButton();
  await products.checkTitle('Your Cart');

  await products.clickOnesieRemoveButton();
  await products.checkShoppingCartHasItems(1);
  await products.clickBikeLightRemoveButton();
  await products.checkShoppingCartHasItems(0);
});
