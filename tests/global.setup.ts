import { test as setup } from '@playwright/test';
import LoginPage from '@/pages/loginPage';
import config from '@/config/env';
import { authFile, authRoles, roleUsernames } from '@/utils/auth';

// Keyed on the browserName fixture so the file name always matches what the
// storageState fixture in fixtures/index.ts resolves at test time.
for (const role of authRoles) {
  setup(`authenticate as ${role} user`, async ({ page, browserName }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await loginPage.login(roleUsernames[role], config.password);
    await page.waitForURL('**/inventory.html');

    await page.context().storageState({ path: authFile(browserName, role) });
  });
}
