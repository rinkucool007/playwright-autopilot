---
name: locators
description: Reference rules for choosing resilient Playwright locators — priority order, scoping, iframes, shadow DOM, dynamic lists, tables and strictness errors. Use whenever writing or fixing a Playwright locator/selector, when a test fails with "strict mode violation" or "element not found", or when converting brittle XPath/CSS selectors.
---

# Locator playbook

## Priority (highest first)
1. `page.getByRole('button', { name: 'Save' })` — mirrors how users & assistive tech see the page
2. `page.getByLabel('Email')` — form fields
3. `page.getByPlaceholder('Search')`
4. `page.getByText('Order confirmed')` — static, user-visible text; use `{ exact: true }` or regex when needed
5. `page.getByAltText` / `getByTitle`
6. `page.getByTestId('checkout-submit')` — when semantics are poor; set `testIdAttribute` in config if the app uses `data-qa`, `data-cy`, etc.
7. Scoped CSS: `page.locator('[data-section="billing"]').getByRole('textbox')` — last resort
**Never**: absolute XPath, `nth-child`, auto-generated classes (`css-1k9a`, `sc-bdVaJa`, `MuiBox-root-123`), text that includes dynamic numbers/dates.

## Scoping & filtering
```ts
const row = page.getByRole('row').filter({ hasText: 'INV-1042' });
await row.getByRole('button', { name: 'Pay' }).click();

const card = page.getByRole('listitem').filter({ has: page.getByRole('heading', { name: 'Pro plan' }) });
const dialog = page.getByRole('dialog', { name: 'Confirm delete' });
await dialog.getByRole('button', { name: 'Delete' }).click();
```

## Strict-mode violations
Cause: locator matches >1 element. Fix by scoping to a container, `filter({ hasText })`, `{ exact: true }`, or role + name. Use `.first()` only when order is semantically meaningful (e.g. "latest notification").

## Special surfaces
- **iframes**: `page.frameLocator('iframe[title="Payment"]').getByLabel('Card number')`
- **Shadow DOM**: Playwright CSS/role locators pierce open shadow roots automatically.
- **New tab**: `const [popup] = await Promise.all([page.waitForEvent('popup'), link.click()]);`
- **Downloads**: `const dl = page.waitForEvent('download'); await btn.click(); await (await dl).saveAs(path);`
- **File upload**: `await page.getByLabel('Upload').setInputFiles('fixtures/file.pdf');`
- **Native dialogs**: `page.once('dialog', d => d.accept());` before the triggering click.
- **Canvas / charts**: assert on the data source (API response via `page.waitForResponse`) or aria labels; screenshot comparisons only as a last resort.

## Assertions that auto-wait
`toBeVisible, toBeHidden, toBeEnabled, toBeChecked, toHaveText, toContainText, toHaveValue, toHaveURL, toHaveTitle, toHaveCount, toHaveAttribute, toHaveClass, toHaveScreenshot`, and `expect.poll(fn)` for non-DOM values. Use `expect.soft` to collect several checks in one step.
