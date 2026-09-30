---
name: setup
description: Bootstrap or repair a Playwright Test project (TypeScript or JavaScript) with best-practice config, fixtures, page-object folders, env handling and auth setup project. Use when a repo has no Playwright yet, when the user says "set up playwright", "init e2e", "scaffold tests", or when pw-detect shows playwrightInstalled=false.
argument-hint: "[ts|js] [baseURL]"
---

# Playwright project setup

1. Run `pw-detect`. If Playwright is already installed, only fill gaps (missing fixtures, env example, auth project) — never overwrite an existing `playwright.config.*` without showing a diff and asking.
2. Choose language: argument → existing `tsconfig.json` → default **TypeScript**.
3. Install (use the detected package manager; ask first if this is an existing app repo):
   ```bash
   npm i -D @playwright/test dotenv
   npx playwright install chromium   # add --with-deps on Linux CI images
   ```
4. Copy templates from this skill's `templates/` folder (read them, then Write into the project; adjust `.ts`→`.js` and strip types for JS):
   - `playwright.config.ts` → project root
   - `fixtures.ts` → `tests/fixtures.ts`
   - `auth.setup.ts` → `tests/auth.setup.ts` (only if the app needs login)
   - `BasePage.ts` → `tests/pages/BasePage.ts`
   - `env.example` → `.env.example`
5. Append to `.gitignore`: `test-results/`, `playwright-report/`, `playwright/.auth/`, `.env`, `.pw-autopilot/runs/*/traces/`.
6. Add scripts to package.json: `"test:e2e": "playwright test"`, `"test:e2e:ui": "playwright test --ui"`, `"test:e2e:report": "playwright show-report"`.
7. Verify: `npx playwright test --list`. Report what was created.
