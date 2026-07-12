import { Page, expect, Locator } from '@playwright/test';
import { ProductId } from '@/utils/helpers';
import HeaderComponent from '@/components/HeaderComponent';

export default class ProductsPage {
  readonly header: HeaderComponent;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;
  readonly bikeLightTitle: Locator;
  readonly title: Locator;
  readonly productImages: Locator;

  constructor(public page: Page) {
    this.header = new HeaderComponent(page);
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.removeButton = page.getByTestId('remove');
    this.backToProductsButton = page.getByTestId('back-to-products');
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
    await this.header.openCart();
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

  async checkAddToCartButton(productId: ProductId) {
    await expect(this.addToCartButtonFor(productId)).toBeVisible();
  }

  async checkTitle(title: string) {
    await expect(this.title).toBeVisible();
    await expect(this.title).toContainText(title);
  }

  // Anchored on attachment, not visibility — WebKit collapses a failed <img>
  // to a zero-size box, and toHaveJSProperty only needs the element attached
  async checkAllProductImagesBroken() {
    await this.productImages.first().waitFor({ state: 'attached' });
    for (const image of await this.productImages.all()) {
      await expect(image).toHaveJSProperty('naturalWidth', 0);
    }
  }

  async checkAllProductImagesRendered() {
    await this.productImages.first().waitFor({ state: 'attached' });
    for (const image of await this.productImages.all()) {
      await expect(image).not.toHaveJSProperty('naturalWidth', 0);
    }
  }

  async getProductImageSources(): Promise<string[]> {
    // evaluateAll does not auto-wait, so wait for the grid to render first
    await this.productImages.first().waitFor();
    return this.productImages.evaluateAll((images) =>
      images.map((img) => img.getAttribute('src') ?? '')
    );
  }

  async checkShoppingCartHasItems(itemAmount: number) {
    await this.header.checkCartCount(itemAmount);
  }
}
