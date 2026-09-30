---
name: heal
description: Diagnose and fix failing or flaky Playwright tests in an existing suite using the executor → healer loop with root-cause classification, without weakening assertions. Use when the user says tests are failing, broken after a UI change, flaky, timing out, or asks to "fix", "stabilize" or "self-heal" Playwright tests.
argument-hint: "[spec file, grep pattern, or path to results.json]"
---

# Heal failing tests

Scope: **$ARGUMENTS** (empty = whole suite, chromium only)

1. `pw-state init "heal: $ARGUMENTS"` then `pw-state advance PLAN && pw-state advance GENERATE && pw-state advance EXECUTE` (heal-only runs skip authoring phases).
2. Delegate to **pw-executor** for the scope. If the user provided a CI `results.json`, run `pw-results <file>` instead of re-running.
3. For **flaky** reports: ask the executor to run `--repeat-each=5 --retries=0` on the suspect tests to reproduce first.
4. Loop: `pw-state advance HEAL` → `pw-state heal-attempt` → **pw-healer** → `pw-state advance EXECUTE` → **pw-executor**. Re-explore via **pw-explorer** when the healer returns `needsExplore`.
5. Stop when green, budget exhausted, or only APP_BUG / ENVIRONMENT failures remain.
6. Report: per failure → root cause, fix (file:line), verified?, and any app bugs with expected vs actual. Log each decision with `pw-state reason`.
