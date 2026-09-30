# Converting other formats to Playwright

## Selenium (Java/Python/JS) → Playwright
| Selenium | Playwright |
|---|---|
| `driver.get(url)` | `await page.goto(url)` |
| `findElement(By.id("x"))` | prefer `getByRole/getByLabel`; fallback `page.locator('#x')` |
| `WebDriverWait(...).until(visible)` | delete — use `await expect(loc).toBeVisible()` |
| `Thread.sleep / time.sleep` | delete — rely on auto-wait |
| `Select(el).selectByVisibleText("A")` | `await loc.selectOption({ label: 'A' })` |
| `switchTo().frame(f)` | `page.frameLocator(sel)` |
| `switchTo().window(h)` | `const p = await context.waitForEvent('page')` |
| `Actions.moveToElement` | `await loc.hover()` |
| `assertEquals(el.getText(), "x")` | `await expect(loc).toHaveText('x')` |

## Cypress → Playwright
| Cypress | Playwright |
|---|---|
| `cy.visit` | `page.goto` |
| `cy.get('[data-cy=x]')` | `page.getByTestId('x')` (set `testIdAttribute: 'data-cy'`) |
| `cy.contains('Save')` | `page.getByText('Save')` / `getByRole('button',{name:'Save'})` |
| `.should('be.visible')` | `await expect(loc).toBeVisible()` |
| `cy.intercept` | `await page.route(...)` |
| `cy.request` | `request` fixture |
| `beforeEach(cy.login)` | auth `storageState` setup project |

## Gherkin / manual cases
- Scenario → `test('TC-xxx <title>')`; each Given/When/Then → `test.step()`.
- Background → `test.beforeEach` or a fixture.
- Scenario Outline + Examples → loop over a typed data array generating one `test()` per row.
