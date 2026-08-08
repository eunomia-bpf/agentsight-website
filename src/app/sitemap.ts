import type { MetadataRoute } from 'next';
import { contentPath, getPages, type ContentKind } from '@/lib/public-content';
import { hubConfig, site } from '@/lib/site';

export const dynamic = 'force-static';

const contentKinds: ContentKind[] = [
  'use-case',
  'comparison',
  'guide',
  'blog',
  'integration',
  'landing',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date('2026-08-08T00:00:00Z');
  const fixed = [
    '/',
    ...Object.values(hubConfig).map(({ path }) => path),
    '/security/',
    '/changelog/',
    '/releases/',
  ];
  const pages = contentKinds.flatMap((kind) => getPages(kind));

  return [
    ...fixed.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: updated,
      changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '/' ? 1 : 0.8,
    })),
    ...pages.map((page) => ({
      url: `${site.url}${contentPath(page)}`,
      lastModified: updated,
      changeFrequency: 'monthly' as const,
      priority: page.kind === 'landing' ? 0.7 : 0.75,
    })),
  ];
}
