import { Page, expect, Locator } from '@playwright/test';

export default class CheckoutPage {
  readonly checkoutButton: Locator;
  readonly firstNameTextField: Locator;
  readonly lastNameTextField: Locator;
  readonly postalCodeTextField: Locator;
  readonly continueButton: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly totalInfo: Locator;
  readonly finishButton: Locator;
  readonly orderConfirmation: Locator;

  constructor(public page: Page) {
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.firstNameTextField = page.locator('[data-test="firstName"]');
    this.lastNameTextField = page.locator('[data-test="lastName"]');
    this.postalCodeTextField = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.paymentInfo = page.locator('[data-test="payment-info-label"]');
    this.shippingInfo = page.locator('[data-test="shipping-info-label"]');
    this.totalInfo = page.locator('[data-test="total-info-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.orderConfirmation = page.locator('[data-test="complete-header"]');
  }

  async clickCheckoutButton() {
    await this.checkoutButton.click();
  }

  async enterFirstName(firstName: string) {
    await this.firstNameTextField.fill(firstName);
  }

  async enterLastName(lastName: string) {
    await this.lastNameTextField.fill(lastName);
  }

  async enterPostalCode(postalCode: string) {
    await this.postalCodeTextField.fill(postalCode);
  }

  async clickContinueButton() {
    await this.continueButton.click();
  }

  async checkCheckoutInfoPage() {
    await expect(this.paymentInfo).toBeVisible();
    await expect(this.shippingInfo).toBeVisible();
    await expect(this.totalInfo).toBeVisible();
  }

  async clickFinishButton() {
    await this.finishButton.click();
  }

  async checkOrderConfirmation() {
    await expect(this.orderConfirmation).toBeVisible();
    await expect(this.orderConfirmation).toContainText('Thank you for your order!');
  }
}
