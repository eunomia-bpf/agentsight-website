// SPDX-License-Identifier: MIT
// Copyright (c) 2026 eunomia-bpf org.

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contentSource = await readFile(path.join(root, 'src/lib/content.ts'), 'utf8');
const publicContentSource = await readFile(path.join(root, 'src/lib/public-content.ts'), 'utf8');
const shellSource = await readFile(path.join(root, 'src/components/SiteShell.tsx'), 'utf8');
const securitySource = await readFile(path.join(root, 'src/app/security/page.tsx'), 'utf8');
const cursorSource = await readFile(path.join(root, 'src/app/integrations/cursor/page.tsx'), 'utf8');

const entryPattern = /\n  \{\r?\n    kind: '([^']+)',\r?\n    slug: '([^']+)',\r?\n    title: '([^']+)',\r?\n    description:\r?\n      '([^']+)'/g;
const entries = [...contentSource.matchAll(entryPattern)].map((match) => ({
  kind: match[1],
  slug: match[2],
  title: match[3],
  description: match[4],
}));

const supplementalEntryPattern = /const\s+\w+:\s*ContentPage\s*=\s*\{\r?\n\s+kind:\s*'([^']+)',\r?\n\s+slug:\s*'([^']+)',\r?\n\s+title:\s*'([^']+)',\r?\n\s+description:\r?\n\s+'([^']+)'/g;
const supplementalEntries = [...publicContentSource.matchAll(supplementalEntryPattern)].map((match) => ({
  kind: match[1],
  slug: match[2],
  title: match[3],
  description: match[4],
}));
const allEntries = [...entries, ...supplementalEntries];

const expectedByKind = {
  'use-case': 4,
  comparison: 5,
  guide: 3,
  blog: 3,
  integration: 4,
  landing: 5,
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(allEntries.length === 24, `Expected 24 content pages, found ${allEntries.length}`);
assert(new Set(allEntries.map((entry) => entry.title)).size === allEntries.length, 'Content titles must be unique');
assert(new Set(allEntries.map((entry) => entry.slug)).size === allEntries.length, 'Content slugs must be unique');

for (const [kind, expected] of Object.entries(expectedByKind)) {
  const actual = allEntries.filter((entry) => entry.kind === kind).length;
  assert(actual === expected, `Expected ${expected} ${kind} pages, found ${actual}`);
}

for (const entry of allEntries) {
  assert(entry.title.length >= 20 && entry.title.length <= 72, `Title length is outside 20-72 characters: ${entry.title}`);
  assert(entry.description.length >= 80 && entry.description.length <= 170, `Description length is outside 80-170 characters: ${entry.title}`);
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug), `Invalid slug: ${entry.slug}`);
}

const routePrefix = {
  'use-case': 'use-cases',
  comparison: 'compare',
  guide: 'guides',
  blog: 'blog',
  integration: 'integrations',
  landing: '',
};
const routes = new Set([
  '/',
  '/use-cases/',
  '/compare/',
  '/guides/',
  '/blog/',
  '/integrations/',
  '/integrations/cursor/',
  '/security/',
  '/changelog/',
  '/releases/',
  ...allEntries.map((entry) => `/${routePrefix[entry.kind] ? `${routePrefix[entry.kind]}/` : ''}${entry.slug}/`),
]);

const internalLinks = [...`${contentSource}\n${publicContentSource}\n${shellSource}\n${cursorSource}`.matchAll(/href:\s*['"](\/[^'"]+)['"]/g)].map((match) => match[1]);
for (const href of internalLinks) {
  assert(routes.has(href), `Internal content link has no route: ${href}`);
}

const comparisonSection = `${contentSource}\n${publicContentSource}`;
const primaryHosts = [
  'opentelemetry.io',
  'developers.cloudflare.com',
  'langfuse.com/docs',
  'docs.langchain.com/langsmith',
  'code.claude.com/docs',
  'geminicli.com/docs',
  'modelcontextprotocol.io/specification',
  'github.com/openai/codex',
  'agentsightReadme',
];
for (const host of primaryHosts) {
  assert(comparisonSection.includes(host), `Content sources are missing ${host}`);
}

// Every legacy content page that still uses the generic renderer must have an
// explicit deep-content override. The system-boundary article has its own
// dedicated long-form renderer, and the TLS deep dive is already authored as a
// standalone supplemental ContentPage.
const requiredUpgrades = [
  'use-case:profile-slow-expensive-agent-runs',
  'use-case:review-ai-generated-prs',
  'use-case:trace-closed-source-agent-clis',
  'use-case:audit-mcp-servers-skills-plugins',
  'comparison:application-tracing',
  'comparison:opentelemetry',
  'comparison:ai-gateways',
  'comparison:langfuse',
  'comparison:langsmith',
  'guide:getting-started',
  'guide:claude-code-profiling',
  'guide:agent-flamegraph',
  'blog:from-agent-trace-to-review-artifact',
  'integration:claude-code',
  'integration:codex',
  'integration:gemini-cli',
  'integration:opencode-openclaw',
  'landing:claude-code-observability',
  'landing:codex-observability',
  'landing:mcp-server-audit',
  'landing:ebpf-ai-agent-monitoring',
  'landing:ai-agent-file-access-monitoring',
];

const upgradeMarkers = requiredUpgrades.map((key) => ({
  key,
  marker: `  '${key}': {`,
  index: publicContentSource.indexOf(`  '${key}': {`),
}));
assert(upgradeMarkers.every(({ index }) => index >= 0), 'Every legacy page must have a deep-content upgrade');
assert(new Set(upgradeMarkers.map(({ index }) => index)).size === requiredUpgrades.length, 'Legacy content upgrades must be unique');

for (let i = 0; i < upgradeMarkers.length; i++) {
  const { key, index } = upgradeMarkers[i];
  const nextIndexes = upgradeMarkers.slice(i + 1).map((entry) => entry.index).filter((value) => value > index);
  const upgradeEnd = nextIndexes.length
    ? Math.min(...nextIndexes)
    : publicContentSource.indexOf('\n};\n\nconst directReplacements', index);
  assert(upgradeEnd > index, `Could not resolve content upgrade block: ${key}`);
  const block = publicContentSource.slice(index, upgradeEnd);
  const sectionBodies = [...block.matchAll(/\n\s+body:\s/g)].length;
  const sourceLabels = [...block.matchAll(/\n\s+\{ label:/g)].length;
  assert(sectionBodies >= 5, `Deep-content upgrade must contain at least five substantive sections: ${key}`);
  assert(sourceLabels >= 2, `Deep-content upgrade must cite at least two sources or supporting references: ${key}`);
}

assert(
  publicContentSource.includes("page.kind === 'blog' && page.slug === 'system-boundary-observability'") === false,
  'System-boundary custom rendering belongs in ContentPages.tsx, not public-content overrides',
);
assert(
  securitySource.includes('Local-first is a storage default, not a sensitivity claim.'),
  'Security page must retain the expanded local-data boundary guidance',
);
assert(
  securitySource.includes('Exports are a new data boundary'),
  'Security page must explain export-boundary handling',
);
assert(
  securitySource.includes('Does an empty AgentSight result prove that an action did not happen?'),
  'Security FAQ must preserve capture-limit uncertainty',
);

// Cursor is intentionally a standalone integration page rather than another
// generic CLI template: v1.0.4 observes it through agent-native local session
// artifacts instead of eBPF/TLS attachment. Keep the source/version boundary
// and the most important limitations explicit.
assert(cursorSource.includes("alternates: { canonical: '/integrations/cursor/' }"), 'Cursor page must own its canonical route');
assert(cursorSource.includes('AgentSight v1.0.4'), 'Cursor page must state the reviewed AgentSight release');
assert(cursorSource.includes('ac1e6cb7a8398c57c1ad0ba04ff032cd271d99c8'), 'Cursor page must pin the reviewed product source commit');
assert(cursorSource.includes('agentsight report --local'), 'Cursor page must retain the local-session workflow');
assert(cursorSource.includes('no live API-body capture'), 'Cursor page must retain the live-payload limitation');
assert(cursorSource.includes('recent Cursor sessions may show no token totals'), 'Cursor page must retain the current token-availability limitation');
assert(cursorSource.includes('github.com/eunomia-bpf/agentsight/pull/149'), 'Cursor page must cite the product implementation PR');
assert(cursorSource.includes('docs.cursor.com/en/agent/tools'), 'Cursor page must cite a Cursor primary source');
assert([...cursorSource.matchAll(/<h2/g)].length >= 6, 'Cursor integration must remain substantive, not a thin release page');

console.log(
  `Content check passed: ${allEntries.length} generic pages, ${routes.size} HTML routes, ` +
    `${internalLinks.length} checked internal links, ${requiredUpgrades.length} deep legacy upgrades, and the Cursor integration.`,
);
