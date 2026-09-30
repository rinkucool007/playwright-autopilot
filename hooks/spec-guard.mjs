#!/usr/bin/env node
// PostToolUse guardrail: flags Playwright anti-patterns in freshly written test/page files.
// Exit 0 = fine. Exit 2 = feedback is sent back to Claude via stderr so it fixes the file.
import { readFileSync, existsSync } from 'node:fs';

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(raw || '{}'); } catch { process.exit(0); }
  const file = input?.tool_input?.file_path || input?.tool_input?.path;
  if (!file || !/\.(spec|test|page|fixture)s?\.(t|j)sx?$|[\\/](pages|fixtures)[\\/].+\.(t|j)s$/.test(file)) process.exit(0);
  if (!existsSync(file)) process.exit(0);

  const src = readFileSync(file, 'utf8');
  const rules = [
    [/\bwaitForTimeout\s*\(/, 'Avoid page.waitForTimeout(); rely on auto-waiting or web-first assertions (expect(...).toBeVisible()).'],
    [/\bpage\.\$\$?\(/, 'Avoid page.$ / page.$$ (ElementHandle API). Use page.locator() / getByRole().'],
    [/\bsetTimeout\s*\(/, 'Avoid setTimeout in tests; use expect.poll or web-first assertions.'],
    [/xpath=\/\/?\*?\[?\d|\/html\/body/, 'Avoid absolute/positional XPath. Prefer getByRole / getByLabel / getByTestId.'],
    [/\.nth-child\(|:nth-of-type\(/, 'Avoid positional CSS selectors; they are brittle. Use semantic locators.'],
    [/expect\(\s*await\s+[^)]*\.(isVisible|textContent|innerText|count)\(\)\s*\)/, 'Use web-first assertions: await expect(locator).toBeVisible()/toHaveText()/toHaveCount() instead of expect(await ...).'],
    [/\btest\.only\s*\(|\bdescribe\.only\s*\(/, 'Remove .only before committing.'],
    [/(password|secret|token)\s*[:=]\s*['"][^'"$]{4,}['"]/i, 'Hard-coded credential detected. Read it from process.env instead.'],
  ];
  const problems = rules.filter(([re]) => re.test(src)).map(([, msg]) => `- ${msg}`);
  if (problems.length === 0) process.exit(0);
  process.stderr.write(`[playwright-autopilot spec-guard] ${file}\n${problems.join('\n')}\nFix these before continuing.\n`);
  process.exit(2);
});
