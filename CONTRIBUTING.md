# Contributing

1. Fork, then run locally: `claude --plugin-dir .`
2. Skills: `skills/<kebab-name>/SKILL.md` with `name` + a specific, trigger-rich `description`. Keep bodies < 500 lines; move long material to `references/`.
3. Agents: `agents/<name>.md` with `name`, `description`, `tools`, `model`, and a JSON handoff contract ending the prompt.
4. Scripts in `bin/` must be dependency-free Node (≥18) and cross-platform.
5. `node tests/validate.mjs` must pass. Bump `version` in both `.claude-plugin/*.json` for releases.
