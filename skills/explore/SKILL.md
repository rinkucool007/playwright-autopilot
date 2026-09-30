---
name: explore
description: Explore a live web page or flow with a real browser and produce a verified page map of resilient Playwright locators, without writing tests. Use when the user asks to "inspect", "map", "find locators/selectors for", or "crawl" a page, or before writing tests against an unfamiliar UI.
argument-hint: "<url or flow description>"
---

# Explore a page

Target: **$ARGUMENTS**

1. `pw-state init "explore: $ARGUMENTS"` (reuse the latest run if the user is mid-lifecycle: `pw-state status`).
2. Delegate to the **pw-explorer** subagent with the URL(s), credential env var names, and `runDir` from `pw-state dir`. For several independent pages, launch explorers in parallel.
3. Present a compact table per page: element → locator → verified ✔/✖, plus blockers (captcha, iframes, shadow DOM, MFA).
4. Offer the next step: `/playwright-autopilot:generate` or the full `/playwright-autopilot:e2e`.
