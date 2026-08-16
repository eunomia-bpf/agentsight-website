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
  const existingUpdated = new Date('2026-08-08T00:00:00Z');
  const cursorUpdated = new Date('2026-08-10T00:00:00Z');
  const productUpdated = new Date(`${site.releaseDate}T00:00:00Z`);
  const fixed = [
    ...Object.values(hubConfig).map(({ path }) => path),
    '/security/',
  ];
  const pages = contentKinds.flatMap((kind) => getPages(kind));

  return [
    {
      url: `${site.url}/`,
      lastModified: productUpdated,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...fixed.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: existingUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...['/changelog/', '/releases/'].map((path) => ({
      url: `${site.url}${path}`,
      lastModified: productUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${site.url}/product/`,
      lastModified: productUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.95,
    },
    {
      url: `${site.url}/architecture/`,
      lastModified: productUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${site.url}/pricing/`,
      lastModified: productUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${site.url}/integrations/cursor/`,
      lastModified: cursorUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    ...pages.map((page) => ({
      url: `${site.url}${contentPath(page)}`,
      lastModified: existingUpdated,
      changeFrequency: 'monthly' as const,
      priority: page.kind === 'landing' ? 0.7 : 0.75,
    })),
  ];
}
