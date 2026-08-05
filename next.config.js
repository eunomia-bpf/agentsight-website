// SPDX-License-Identifier: MIT
// Copyright (c) 2026 eunomia-bpf org.

const { createHash } = require('node:crypto');
const { lstatSync, readFileSync, readdirSync } = require('node:fs');
const path = require('node:path');

const siteBuildInputs = [
  '.nvmrc',
  'next-env.d.ts',
  'next.config.js',
  'package-lock.json',
  'package.json',
  'public',
  'src',
  'tsconfig.json',
];

function compareDirectoryEntries(left, right) {
  if (left.name < right.name) return -1;
  if (left.name > right.name) return 1;
  return 0;
}

function collectSiteBuildFiles(relativePath) {
  const absolutePath = path.join(__dirname, relativePath);
  const stat = lstatSync(absolutePath);

  if (stat.isSymbolicLink()) {
    throw new Error(`Refusing to hash symbolic link: ${relativePath}`);
  }
  if (stat.isFile()) return [absolutePath];
  if (!stat.isDirectory()) {
    throw new Error(`Unsupported build input: ${relativePath}`);
  }

  return readdirSync(absolutePath, { withFileTypes: true })
    .sort(compareDirectoryEntries)
    .flatMap((entry) =>
      collectSiteBuildFiles(path.join(relativePath, entry.name)),
    );
}

function generateSiteBuildId() {
  const hash = createHash('sha256');
  hash.update(`node:${process.version}\0`);

  for (const [name, value] of Object.entries(process.env)
    .filter(([name]) => name.startsWith('NEXT_PUBLIC_'))
    .sort(([left], [right]) => left.localeCompare(right))) {
    hash.update(`env:${name}\0${value}\0`);
  }

  for (const input of siteBuildInputs) {
    for (const file of collectSiteBuildFiles(input)) {
      const relativePath = path
        .relative(__dirname, file)
        .split(path.sep)
        .join('/');
      hash.update(relativePath);
      hash.update('\0');
      hash.update(readFileSync(file));
      hash.update('\0');
    }
  }

  return `agentsight-${hash.digest('hex').slice(0, 24)}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  generateBuildId: async () => generateSiteBuildId(),
};

module.exports = nextConfig;
