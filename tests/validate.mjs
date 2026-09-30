#!/usr/bin/env node
// Structural validation for the plugin: manifests, skill/agent frontmatter, hook script, bin scripts.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const errors = [];
const ok = (m) => console.log(`✔ ${m}`);
const fail = (m) => errors.push(m);

const json = (p) => { try { return JSON.parse(fs.readFileSync(path.join(root, p), 'utf8')); } catch (e) { fail(`${p}: ${e.message}`); return null; } };
const plugin = json('.claude-plugin/plugin.json');
const market = json('.claude-plugin/marketplace.json');
json('.mcp.json'); json('hooks/hooks.json');
if (plugin && !/^[a-z0-9-]+$/.test(plugin.name)) fail('plugin name must be kebab-case');
if (plugin && market && market.plugins?.[0]?.version !== plugin.version) fail('version mismatch between plugin.json and marketplace.json');
ok('manifests parse');

const front = (file) => {
  const t = fs.readFileSync(file, 'utf8');
  const m = t.match(/^---\n([\s\S]*?)\n---/);
  if (!m) { fail(`${file}: missing frontmatter`); return {}; }
  return Object.fromEntries(m[1].split('\n').filter((l) => /^\w[\w-]*:/.test(l)).map((l) => [l.split(':')[0], l.slice(l.indexOf(':') + 1).trim()]));
};
for (const d of fs.readdirSync(path.join(root, 'skills'))) {
  const f = path.join(root, 'skills', d, 'SKILL.md');
  if (!fs.existsSync(f)) { fail(`skills/${d}: missing SKILL.md`); continue; }
  const fm = front(f);
  if (fm.name !== d) fail(`skills/${d}: name "${fm.name}" must equal folder`);
  if (!fm.description || fm.description.length < 40) fail(`skills/${d}: description too short`);
}
ok('skills frontmatter');
for (const f of fs.readdirSync(path.join(root, 'agents'))) {
  const fm = front(path.join(root, 'agents', f));
  if (fm.name !== f.replace(/\.md$/, '')) fail(`agents/${f}: name mismatch`);
  if (!fm.description) fail(`agents/${f}: missing description`);
}
ok('agents frontmatter');

for (const f of [...fs.readdirSync(path.join(root, 'bin')).map((b) => `bin/${b}`), 'hooks/spec-guard.mjs']) {
  try { execFileSync(process.execPath, ['--check', path.join(root, f)]); } catch (e) { fail(`${f}: syntax error`); }
}
ok('scripts syntax');

if (errors.length) { console.error('\n' + errors.map((e) => `✖ ${e}`).join('\n')); process.exit(1); }
console.log('\nAll checks passed.');
