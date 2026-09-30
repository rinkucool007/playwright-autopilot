import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const user = process.env.E2E_USER;
  const pass = process.env.E2E_PASSWORD;
  if (!user || !pass) throw new Error('Set E2E_USER and E2E_PASSWORD (see .env.example)');

  await page.goto('/login');
  await page.getByLabel(/user(name)?|email/i).fill(user);
  await page.getByLabel(/password/i).fill(pass);
  await page.getByRole('button', { name: /sign in|log in|login/i }).click();
  // Replace with a signal that only appears after a successful login:
  await expect(page).not.toHaveURL(/login/);

  await page.context().storageState({ path: authFile });
});
