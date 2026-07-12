import { Page, expect, Locator } from '@playwright/test';
import { ProductId } from '@/utils/helpers';

export default class ProductsPage {
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartButton: Locator;
  readonly bikeLightTitle: Locator;
  readonly title: Locator;
  readonly productImages: Locator;

  constructor(public page: Page) {
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.removeButton = page.getByTestId('remove');
    this.backToProductsButton = page.getByTestId('back-to-products');
    this.shoppingCartButton = page.getByTestId('shopping-cart-link');
    this.shoppingCartBadge = page.getByTestId('shopping-cart-badge');
    this.bikeLightTitle = page.getByTestId('item-0-title-link');
    this.title = page.getByTestId('title');
    // Anchored on the per-item img-link wrappers — same data-test pattern as item-0-title-link
    this.productImages = page.getByTestId(/^item-\d+-img-link$/).locator('img');
  }

  // Dynamic locators — build the data-test selector from a product productId
  addToCartButtonFor(productId: ProductId): Locator {
    return this.page.getByTestId(`add-to-cart-${productId}`);
  }

  removeButtonFor(productId: ProductId): Locator {
    return this.page.getByTestId(`remove-${productId}`);
  }

  async clickShoppingCartButton() {
    await this.shoppingCartButton.click();
  }

  async clickAddToCartButton() {
    await this.addToCartButton.click();
  }

  async clickRemoveButton() {
    await this.removeButton.click();
  }

  async clickBackToProductsButton() {
    await this.backToProductsButton.click();
  }

  async clickBikeLightTitle() {
    await this.bikeLightTitle.click();
  }

  async clickAddToCart(productId: ProductId) {
    await this.addToCartButtonFor(productId).click();
  }

  async clickRemove(productId: ProductId) {
    await this.removeButtonFor(productId).click();
  }

  async checkRemoveButton(productId: ProductId) {
    await expect(this.removeButtonFor(productId)).toBeVisible();
  }

  async checkTitle(title: string) {
    await expect(this.title).toBeVisible();
    await expect(this.title).toContainText(title);
  }

  async getProductImageSources(): Promise<string[]> {
    // evaluateAll does not auto-wait, so wait for the grid to render first
    await this.productImages.first().waitFor();
    return this.productImages.evaluateAll((images) =>
      images.map((img) => img.getAttribute('src') ?? '')
    );
  }

  async checkShoppingCartHasItems(itemAmount: number) {
    if (itemAmount === 0) {
      await expect(this.shoppingCartBadge).not.toBeVisible();
    } else {
      const string = itemAmount.toString();
      await expect(this.shoppingCartBadge).toBeVisible();
      await expect(this.shoppingCartBadge).toContainText(string);
    }
  }
}
