---
name: api-testing
description: Write Playwright API tests and hybrid UI+API tests using the request fixture — REST/GraphQL calls, schema checks, auth tokens, network mocking with page.route, and API seeding for UI tests. Use when the user wants API tests, contract checks, backend verification after a UI action, or to mock/stub network responses in Playwright.
argument-hint: "<endpoint, OpenAPI file, or scenario>"
---

# API & network testing with Playwright

1. If an OpenAPI/Swagger file or URL is given, read it and derive scenarios per endpoint: success, validation error (4xx), auth failure (401/403), not found, and one boundary case. Run through **pw-planner** for large specs.
2. Configure a dedicated project in `playwright.config`:
   ```ts
   { name: 'api', testMatch: /.*\.api\.spec\.ts/, use: { baseURL: process.env.API_URL,
     extraHTTPHeaders: { Authorization: `Bearer ${process.env.API_TOKEN}` } } }
   ```
3. Patterns:
```ts
test('TC-API-001 create order', { tag: ['@api'] }, async ({ request }) => {
  const res = await request.post('/orders', { data: { sku: 'A1', qty: 2 } });
  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body).toMatchObject({ sku: 'A1', qty: 2, status: 'PENDING' });
  expect(body.id).toEqual(expect.any(String));
});

// Hybrid: act in UI, verify backend
const respPromise = page.waitForResponse(r => r.url().includes('/api/orders') && r.request().method() === 'POST');
await page.getByRole('button', { name: 'Place order' }).click();
expect((await respPromise).status()).toBe(201);

// Mock
await page.route('**/api/recommendations', route => route.fulfill({ json: [] }));
await expect(page.getByText('No recommendations yet')).toBeVisible();
```
4. Schema validation: if the repo already uses `zod` or `ajv`, validate response bodies with it; otherwise use `toMatchObject` + `expect.any`.
5. Hand off to **pw-executor** with `--project=api`, heal with **pw-healer** as usual.
