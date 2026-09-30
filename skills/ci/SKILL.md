---
name: ci
description: Generate CI pipelines for Playwright — GitHub Actions (default), Azure DevOps, GitLab CI or Jenkins — with sharding, browser caching, HTML/JSON report artifacts, and secrets wiring. Use when the user wants to run Playwright tests in CI/CD, on pull requests, nightly, or in parallel shards.
argument-hint: "[github|azure|gitlab|jenkins] [shards]"
---

# CI for Playwright

1. `pw-detect` → package manager, existing workflows (don't duplicate; extend if one exists).
2. Default: GitHub Actions with 4 shards. Read `references/github-actions.yml` and write it to `.github/workflows/playwright.yml`, adapting package manager commands, Node version, and env/secrets names (`BASE_URL`, `E2E_USER`, `E2E_PASSWORD`).
3. For other CI systems, produce the equivalent: install deps → `npx playwright install --with-deps` → `npx playwright test --shard=i/n` → publish `playwright-report/` and `blob-report/` → merge reports.
4. Tell the user which repository secrets to create and how to trigger a run.
