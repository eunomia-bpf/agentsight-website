import type { MetadataRoute } from 'next';
import { contentPages, contentPath } from '@/lib/content';
import { hubConfig, site } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(`${site.updatedAt}T00:00:00Z`);
  const fixed: Array<{ path: string; priority: number; frequency: 'weekly' | 'monthly' }> = [
    { path: '/', priority: 1, frequency: 'weekly' },
    { path: '/runs/', priority: 0.9, frequency: 'weekly' },
    { path: '/runs/recorded-demo/', priority: 0.86, frequency: 'monthly' },
    { path: '/runs/review-artifact/', priority: 0.84, frequency: 'monthly' },
    { path: '/methodology/', priority: 0.85, frequency: 'monthly' },
    { path: '/about/', priority: 0.7, frequency: 'monthly' },
    ...Object.values(hubConfig).map(({ path }) => ({ path, priority: 0.8, frequency: 'monthly' as const })),
    { path: '/security/', priority: 0.8, frequency: 'monthly' },
    { path: '/changelog/', priority: 0.72, frequency: 'weekly' },
    { path: '/releases/', priority: 0.75, frequency: 'weekly' },
  ];

  return [
    ...fixed.map(({ path, priority, frequency }) => ({
      url: `${site.url}${path}`,
      lastModified: updated,
      changeFrequency: frequency,
      priority,
    })),
    ...contentPages.map((page) => ({
      url: `${site.url}${contentPath(page)}`,
      changeFrequency: 'monthly' as const,
      priority: page.kind === 'landing' ? 0.7 : 0.75,
    })),
  ];
}
