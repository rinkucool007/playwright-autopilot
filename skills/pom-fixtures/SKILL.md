---
name: pom-fixtures
description: Conventions for Playwright Page Object Model classes, custom fixtures, test data factories, auth storageState and API-based setup. Use when creating or refactoring page objects, adding fixtures, sharing login across tests, or structuring a growing Playwright suite.
---

# Page Objects & Fixtures

## Page object rules
- One class per page or major component; extends `BasePage` (see setup templates) when present.
- Locators are `readonly` fields built in the constructor — no locator strings scattered in specs.
- Methods express **user intent** (`login(user)`, `addToCart(sku)`), not mechanics (`clickButton3`).
- Page objects may wait for their own ready signal but **do not assert business outcomes** — specs do.
- Return the next page object on navigation for fluent flows.

```ts
import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly path = '/login';
  readonly readySignal: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    super(page);
    this.readySignal = page.getByRole('heading', { name: 'Sign in' });
    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: 'Sign in' });
    this.error = page.getByRole('alert');
  }

  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }
}
```

## Fixtures
```ts
export const test = base.extend<{ loginPage: LoginPage; cart: CartPage }>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  cart: async ({ page }, use) => use(new CartPage(page)),
});
```
- Worker-scoped fixtures (`{ scope: 'worker' }`) for expensive shared resources (API client, seeded tenant).
- Seed data through the API in a fixture and clean it up after `use()` — faster and more reliable than UI setup.

## Spec shape
```ts
import { test, expect } from '../fixtures';

test.describe('Login', () => {
  test('TC-001 valid user reaches dashboard', { tag: ['@smoke'] }, async ({ loginPage, page }) => {
    await test.step('Open login page', () => loginPage.goto());
    await test.step('Submit valid credentials', () =>
      loginPage.login(process.env.E2E_USER!, process.env.E2E_PASSWORD!));
    await test.step('Dashboard is shown', async () => {
      await expect(page).toHaveURL(/dashboard/);
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });
  });
});
```

## Test data
- Unique per test: `const email = \`qa+${Date.now()}-${test.info().workerIndex}@example.com\`;`
- Keep static datasets typed in `tests/data/*.ts`; data-driven tests loop over arrays to create one `test()` per row.
