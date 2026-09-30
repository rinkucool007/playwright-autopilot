---
name: status
description: Show the current or a past playwright-autopilot run — phase, heal budget, artifacts and the reasoning trail. Use when the user asks where the run is, what the agents decided, why something was done, or to resume an interrupted run.
argument-hint: "[runId]"
---

1. `pw-state status $ARGUMENTS` and read `$(pw-state dir $ARGUMENTS)/reasoning.md`.
2. Summarize: goal, phase, next allowed phases, artifacts, last 3 decisions with confidence.
3. To **resume**, continue the **e2e** skill procedure from the current phase using existing artifacts (don't re-plan or re-explore what's already verified).
