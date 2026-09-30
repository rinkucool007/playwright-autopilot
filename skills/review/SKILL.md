---
name: review
description: Audit an existing Playwright test suite (or specific specs) for coverage, locator quality, assertion strength, isolation, flakiness risk and hard-coded secrets, producing a scored report with file:line fixes. Use when the user asks to review, audit, grade, or improve the quality of Playwright tests or a PR containing them.
argument-hint: "[files/dir] [path to plan or requirements]"
---

# Review a suite

1. Resolve files from `$ARGUMENTS` (default: all specs from `pw-detect`). If no plan exists, tell the reviewer to judge traceability against test titles and any requirement doc given.
2. `pw-state init "review: $ARGUMENTS"`; pass `runDir` to **pw-reviewer**.
3. Present the scorecard and top 5 required changes. Offer to apply them via **pw-generator** (for rewrites) or **pw-healer** (for failing tests).
