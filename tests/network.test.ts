import { expect, test } from '@/fixtures';
import { AppOrigin, NetworkConditions, RoutePatterns } from '@/test-data/routes';
import {
  blockCrossOrigin,
  blockRequests,
  delayRequests,
  fulfillWithPlaceholderImage,
} from '@/utils/network';
import { Products } from '@/utils/helpers';

// Routes must be registered before navigation, so page.goto() lives in each
// test body here rather than in a shared beforeEach like the other spec files.
test.beforeEach(async ({ browserName }, testInfo) => {
  console.log(`Running ${testInfo.title} [${browserName}]`);
});

test.describe('Product images blocked', () => {
  // Adds to the cart, so it gets the mutating-test teardown
  test.afterEach(async ({ appMenu }) => {
    await appMenu.resetAppStateAndLogout();
  });

  test(
    'Inventory remains functional when product images fail',
    { tag: '@regression' },
    async ({ page, productsPage }) => {
      const images = await blockRequests(page, RoutePatterns.productImages);

      await page.goto('/inventory.html');
      await productsPage.checkTitle('Products');
      await productsPage.checkAllProductImagesBroken();

      await productsPage.clickAddToCart(Products.onesie);
      await productsPage.checkShoppingCartHasItems(1);
      expect(images.count).toBeGreaterThan(0);
    }
  );
});

test(
  'Product images can be stubbed with a deterministic placeholder',
  { tag: '@regression' },
  async ({ page, productsPage }) => {
    const stubbed = await fulfillWithPlaceholderImage(page, RoutePatterns.productImages);

    await page.goto('/inventory.html');
    await productsPage.checkTitle('Products');
    await productsPage.checkAllProductImagesRendered();
    expect(stubbed.count).toBeGreaterThan(0);
  }
);

test(
  'Inventory works with all third-party requests blocked',
  { tag: '@regression' },
  async ({ page, productsPage }) => {
    const traffic = await blockCrossOrigin(page, AppOrigin);

    await page.goto('/inventory.html');
    await productsPage.checkTitle('Products');
    // Same-origin traffic is unaffected, so real product images still load
    await productsPage.checkAllProductImagesRendered();
    // Third-party requests aren't guaranteed per load, so the pass-through
    // counter is what proves the route engaged
    expect(traffic.passedThrough).toBeGreaterThan(0);
  }
);

test(
  'Inventory reaches a usable state under injected image latency',
  { tag: '@regression' },
  async ({ page, productsPage }) => {
    const delayed = await delayRequests(
      page,
      RoutePatterns.productImages,
      NetworkConditions.imageLatencyMs
    );

    await page.goto('/inventory.html');
    await productsPage.checkTitle('Products');
    await productsPage.checkAllProductImagesRendered();
    expect(delayed.count).toBeGreaterThan(0);
  }
);
