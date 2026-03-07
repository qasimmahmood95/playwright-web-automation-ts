import { test, expect } from '../fixtures';
import AxeBuilder from '@axe-core/playwright';
import { Products } from '../utils/helpers';
import { CheckoutData } from '../test-data/checkout';

/**
 * Accessibility tests scan each page of the application for WCAG 2.1 AA violations
 * using axe-core. Tests use the authenticated session from storageState.
 *
 * Each test navigates to a distinct page in the user journey so that the full
 * application surface area is covered.
 */

test.describe('Accessibility @a11y', () => {
  test('products (inventory) page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/inventory.html');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('product detail page has no critical accessibility violations', async ({
    page,
    productsPage,
  }) => {
    await page.goto('/inventory.html');
    await productsPage.productTitleLink(0).click();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('cart page has no critical accessibility violations', async ({ page, productsPage }) => {
    await page.goto('/inventory.html');
    await productsPage.addToCart(Products.ONESIE).click();
    await productsPage.clickShoppingCartButton();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('checkout step one (shipping details) has no critical accessibility violations', async ({
    page,
    productsPage,
    checkoutPage,
  }) => {
    await page.goto('/inventory.html');
    await productsPage.addToCart(Products.ONESIE).click();
    await productsPage.clickShoppingCartButton();
    await checkoutPage.clickCheckoutButton();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('checkout step two (order summary) has no critical accessibility violations', async ({
    page,
    productsPage,
    checkoutPage,
  }) => {
    const { firstName, lastName, postalCode } = CheckoutData.VALID;

    await page.goto('/inventory.html');
    await productsPage.addToCart(Products.ONESIE).click();
    await productsPage.clickShoppingCartButton();
    await checkoutPage.clickCheckoutButton();
    await checkoutPage.fillShippingDetails(firstName, lastName, postalCode);
    await checkoutPage.clickContinueButton();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('order confirmation page has no critical accessibility violations', async ({
    page,
    productsPage,
    checkoutPage,
  }) => {
    const { firstName, lastName, postalCode } = CheckoutData.VALID;

    await page.goto('/inventory.html');
    await productsPage.addToCart(Products.ONESIE).click();
    await productsPage.clickShoppingCartButton();
    await checkoutPage.clickCheckoutButton();
    await checkoutPage.fillShippingDetails(firstName, lastName, postalCode);
    await checkoutPage.clickContinueButton();
    await checkoutPage.clickFinishButton();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

});

/**
 * Login page a11y test runs in an unauthenticated context.
 * test.use() here clears both cookies AND localStorage (origins), which is
 * required because SauceDemo stores its session in localStorage, not cookies.
 */
test.describe('Accessibility — login page (unauthenticated) @a11y', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('login page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
