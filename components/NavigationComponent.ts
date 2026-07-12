import { Page, Locator } from '@playwright/test';
import HeaderComponent from '@/components/HeaderComponent';

/**
 * The sidebar navigation drawer opened by the header burger button: reset app
 * state and logout. Opening is the header's affordance, so this component takes
 * the header to drive the open-then-act teardown flow as a single call.
 */
export default class NavigationComponent {
  readonly resetAppStateLink: Locator;
  readonly logoutLink: Locator;

  constructor(
    public page: Page,
    private header: HeaderComponent
  ) {
    this.resetAppStateLink = page.getByTestId('reset-sidebar-link');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async resetAppState() {
    await this.resetAppStateLink.click();
  }

  async logout() {
    await this.logoutLink.click();
  }

  /** Teardown helper: open the drawer, reset app state, then log out. */
  async resetAppStateAndLogout() {
    await this.header.openMenu();
    await this.resetAppState();
    await this.logout();
  }
}
