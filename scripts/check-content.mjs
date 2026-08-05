// SPDX-License-Identifier: MIT
// Copyright (c) 2026 eunomia-bpf org.

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contentSource = await readFile(path.join(root, 'src/lib/content.ts'), 'utf8');
const shellSource = await readFile(path.join(root, 'src/components/SiteShell.tsx'), 'utf8');

const entryPattern = /\n  \{\r?\n    kind: '([^']+)',\r?\n    slug: '([^']+)',\r?\n    title: '([^']+)',\r?\n    description:\r?\n      '([^']+)'/g;
const entries = [...contentSource.matchAll(entryPattern)].map((match) => ({
  kind: match[1],
  slug: match[2],
  title: match[3],
  description: match[4],
}));

const expectedByKind = {
  'use-case': 4,
  comparison: 5,
  guide: 3,
  blog: 2,
  integration: 4,
  landing: 5,
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(entries.length === 23, `Expected 23 content pages, found ${entries.length}`);
assert(new Set(entries.map((entry) => entry.title)).size === entries.length, 'Content titles must be unique');
assert(new Set(entries.map((entry) => entry.slug)).size === entries.length, 'Content slugs must be unique');

for (const [kind, expected] of Object.entries(expectedByKind)) {
  const actual = entries.filter((entry) => entry.kind === kind).length;
  assert(actual === expected, `Expected ${expected} ${kind} pages, found ${actual}`);
}

for (const entry of entries) {
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
  '/security/',
  '/changelog/',
  '/releases/',
  ...entries.map((entry) => `/${routePrefix[entry.kind] ? `${routePrefix[entry.kind]}/` : ''}${entry.slug}/`),
]);

const internalLinks = [...`${contentSource}\n${shellSource}`.matchAll(/href:\s*['"](\/[^'"]+)['"]/g)].map((match) => match[1]);
for (const href of internalLinks) {
  assert(routes.has(href), `Internal content link has no route: ${href}`);
}

const comparisonSection = contentSource.slice(contentSource.indexOf("kind: 'comparison'"), contentSource.indexOf("kind: 'guide'"));
const primaryHosts = [
  'opentelemetry.io',
  'developers.cloudflare.com',
  'langfuse.com/docs',
  'docs.langchain.com/langsmith',
  'agentsightReadme',
];
for (const host of primaryHosts) {
  assert(comparisonSection.includes(host), `Comparison sources are missing ${host}`);
}

console.log(`Content check passed: ${entries.length} unique pages, ${routes.size} HTML routes, ${internalLinks.length} checked internal links.`);
