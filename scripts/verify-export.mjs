// SPDX-License-Identifier: MIT
// Copyright (c) 2026 eunomia-bpf org.

import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'out');
const contentSource = await readFile(path.join(root, 'src/lib/content.ts'), 'utf8');
const entryPattern = /\n  \{\r?\n    kind: '([^']+)',\r?\n    slug: '([^']+)',\r?\n    title: '([^']+)',\r?\n    description:\r?\n      '([^']+)'/g;
const entries = [...contentSource.matchAll(entryPattern)].map((match) => ({ kind: match[1], slug: match[2] }));
const routePrefix = { 'use-case': 'use-cases', comparison: 'compare', guide: 'guides', blog: 'blog', integration: 'integrations', landing: '' };
const routes = [
  '/',
  '/use-cases/',
  '/compare/',
  '/guides/',
  '/blog/',
  '/integrations/',
  '/security/',
  '/changelog/',
  '/releases/',
  '/runs/',
  '/runs/recorded-demo/',
  '/runs/review-artifact/',
  '/methodology/',
  '/about/',
  ...entries.map((entry) => `/${routePrefix[entry.kind] ? `${routePrefix[entry.kind]}/` : ''}${entry.slug}/`),
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function routeFile(route) {
  return route === '/' ? path.join(out, 'index.html') : path.join(out, ...route.split('/').filter(Boolean), 'index.html');
}

const titles = new Set();
const internalLinks = new Set();
for (const route of routes) {
  const file = routeFile(route);
  await access(file);
  const html = await readFile(file, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert(title, `Missing title in ${route}`);
  assert(!titles.has(title), `Duplicate exported title: ${title}`);
  titles.add(title);
  assert((html.match(/<h1(?:\s|>)/g) ?? []).length === 1, `Expected one H1 in ${route}`);
  assert(html.includes(`rel="canonical" href="https://agentsight.us${route}"`), `Missing canonical URL in ${route}`);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)) {
    if (!match[1].startsWith('/_next/')) internalLinks.add(match[1]);
  }
}

for (const target of internalLinks) {
  const clean = decodeURIComponent(target.split('?')[0]);
  const direct = path.join(out, ...clean.split('/').filter(Boolean));
  let found = false;
  for (const candidate of [direct, path.join(direct, 'index.html')]) {
    try {
      await access(candidate);
      found = true;
      break;
    } catch {
      // Try the route's directory index before reporting a broken link.
    }
  }
  assert(found, `Exported internal link has no file: ${target}`);
}

for (const required of [
  'robots.txt',
  'sitemap.xml',
  'manifest.webmanifest',
  'opengraph-image',
  'twitter-image',
  'llms.txt',
  '_headers',
  '_redirects',
  'favicon.ico',
  'icon-192.png',
  'icon-512.png',
  'brand/logo-mark.svg',
  'brand/logo-horizontal.svg',
]) {
  await access(path.join(out, required));
}

const sitemap = await readFile(path.join(out, 'sitemap.xml'), 'utf8');
for (const route of routes) {
  assert(sitemap.includes(`<loc>https://agentsight.us${route}</loc>`), `Sitemap is missing ${route}`);
}

const manifest = await readFile(path.join(out, 'manifest.webmanifest'), 'utf8');
assert(manifest.includes('/icon-192.png'), 'Manifest is missing the 192px icon');
assert(manifest.includes('/icon-512.png'), 'Manifest is missing the 512px icon');

const allFiles = await readdir(out, { recursive: true });
assert(allFiles.length >= routes.length, 'Static export contains fewer files than routes');
console.log(`Export verification passed: ${routes.length} HTML routes, ${titles.size} unique titles, ${internalLinks.size} internal targets, ${allFiles.length} generated files.`);
