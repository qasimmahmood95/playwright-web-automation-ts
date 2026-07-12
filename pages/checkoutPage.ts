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
  readonly errorMessage: Locator;

  constructor(public page: Page) {
    this.checkoutButton = page.getByTestId('checkout');
    this.firstNameTextField = page.getByTestId('firstName');
    this.lastNameTextField = page.getByTestId('lastName');
    this.postalCodeTextField = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.paymentInfo = page.getByTestId('payment-info-label');
    this.shippingInfo = page.getByTestId('shipping-info-label');
    this.totalInfo = page.getByTestId('total-info-label');
    this.finishButton = page.getByTestId('finish');
    this.orderConfirmation = page.getByTestId('complete-header');
    this.errorMessage = page.getByTestId('error');
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

  async fillInformation(info: { firstName: string; lastName: string; postalCode: string }) {
    await this.enterFirstName(info.firstName);
    await this.enterLastName(info.lastName);
    await this.enterPostalCode(info.postalCode);
  }

  async clickContinueButton() {
    await this.continueButton.click();
  }

  /** Tab from the first-name field should land on last name, then postal code. */
  async checkInformationFormTabOrder() {
    await this.firstNameTextField.focus();
    await expect(this.firstNameTextField).toBeFocused();

    await this.page.keyboard.press('Tab');
    await expect(this.lastNameTextField).toBeFocused();

    await this.page.keyboard.press('Tab');
    await expect(this.postalCodeTextField).toBeFocused();
  }

  /**
   * Fill the form, then submit from the keyboard by focusing the Continue
   * control and pressing Enter (no mouse click). Activating the focused button
   * works whether Continue submits a native form or fires a click handler, so
   * this stays robust across SauceDemo markup changes.
   */
  async submitInformationWithKeyboard(info: {
    firstName: string;
    lastName: string;
    postalCode: string;
  }) {
    await this.fillInformation(info);
    await this.continueButton.focus();
    await expect(this.continueButton).toBeFocused();
    await this.page.keyboard.press('Enter');
  }

  async checkError(expected: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expected);
  }

  async checkInformationForm() {
    await expect(this.firstNameTextField).toBeVisible();
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
