# Architecture

## Design principles
1. **Main agent owns control flow.** Claude Code subagents cannot spawn subagents, so the `e2e` skill turns the main session into the orchestrator. Subagents are leaf workers with narrow tools and fresh context windows — this keeps the main context small on long runs.
2. **Structured handoffs.** Every subagent ends with a JSON block (`status`, artifacts, `reasoning`). The orchestrator validates artifacts on disk before advancing — it never trusts prose.
3. **Enforced lifecycle.** `pw-state` rejects illegal transitions (exit 4) and exhausted heal budgets (exit 3), so the loop can't spin forever or skip review.
4. **Evidence-first.** Locators come from a live accessibility snapshot (explorer), failures from the JSON reporter (executor), fixes are verified by a targeted re-run (healer).
5. **Honesty gate.** Healer rules forbid weakening tests; reviewer scores assertion strength and traceability. A real app bug is reported, not masked.
6. **Repo-adaptive.** `pw-detect` + reading existing specs drives language, layout and style choices.

## Reasoning record
```json
{"phase":"HEAL","observation":"TC-004 fails: strict mode violation, 2 'Save' buttons",
 "hypothesis":"Second button is in the hidden draft panel","decision":"Scope locator to dialog 'Edit profile'",
 "confidence":0.85,"evidence":"pagemap/profile.json notes; error-context.md"}
```

## Parallelism
- EXPLORE fans out one explorer per page/flow (≤4).
- GENERATE may fan out per feature with disjoint file ownership; one generator owns shared fixtures.
- EXECUTE/HEAL are sequential per failure cluster to avoid edit conflicts.

## Failure taxonomy
`LOCATOR_NOT_FOUND · LOCATOR_AMBIGUOUS · ASSERTION_MISMATCH · TIMEOUT · ENVIRONMENT · CODE_ERROR · APP_BUG · UNKNOWN`
`pw-results` pre-classifies with regex; the executor confirms using evidence; the healer maps category → fix strategy.

## Extending
- New framework knowledge → reference skill (like `locators`).
- New workflow → task skill that reuses existing subagents.
- New specialist (e.g. `pw-a11y` using `@axe-core/playwright`, `pw-visual` for `toHaveScreenshot`) → add `agents/<name>.md` with a JSON handoff and wire it into the `e2e` phase map.
