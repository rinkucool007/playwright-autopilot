---
name: generate
description: Quickly write Playwright tests for a described scenario or recorded steps without the full lifecycle — plans inline, uses existing page maps if present, generates, then runs once and fixes compile errors. Use for fast requests like "write a playwright test that logs in and adds an item to cart", converting manual test cases/Gherkin/Selenium to Playwright, or extending an existing spec.
argument-hint: "<scenario, Gherkin, manual steps, or file to convert>"
---

# Fast generation

Request: **$ARGUMENTS**

1. `pw-detect` → learn language, layout, fixtures. Read one existing spec to copy style.
2. Look for page maps in `.pw-autopilot/runs/*/pagemap/`. If the UI is unknown and a URL is reachable, delegate a quick **pw-explorer** pass for just the pages involved.
3. **Converting** from Selenium/Cypress/manual cases? Read `references/conversion.md`.
4. Delegate to **pw-generator** with an inline mini-plan (IDs `TC-Q01…`, steps, expected results).
5. Delegate to **pw-executor** once. If red and the failure is not APP_BUG/ENVIRONMENT, delegate to **pw-healer** (max 2 attempts).
6. Report files + run command. Suggest `/playwright-autopilot:review` for a quality gate.
