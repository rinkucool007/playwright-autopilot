import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const baseURL = process.env.BASE_URL ?? 'http://localhost:3000';
const needsAuth = !!process.env.E2E_USER;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: process.env.TEST_ID_ATTR ?? 'data-testid',
  },
  projects: [
    ...(needsAuth ? [{ name: 'setup', testMatch: /auth\.setup\.ts/ }] : []),
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], ...(needsAuth ? { storageState: 'playwright/.auth/user.json' } : {}) },
      dependencies: needsAuth ? ['setup'] : [],
      testIgnore: /auth\.setup\.ts/,
    },
    // Enable when the suite is stable:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari'] } },
    // { name: 'mobile',  use: { ...devices['Pixel 7'] } },
  ],
  // webServer: { command: 'npm run dev', url: baseURL, reuseExistingServer: !process.env.CI },
});
