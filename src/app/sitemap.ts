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
  const overheadUpdated = new Date('2026-08-21T00:00:00Z');
  const repositoryReplayUpdated = new Date('2026-08-23T00:00:00Z');
  const dockerSessionsUpdated = new Date('2026-08-25T00:00:00Z');
  const auditProvenanceUpdated = new Date('2026-08-27T00:00:00Z');
  const directNodeCredentialsUpdated = new Date('2026-08-28T00:00:00Z');
  const noEbpfUpdated = new Date('2026-08-29T00:00:00Z');
  const localSessionDiscoveryUpdated = new Date('2026-08-31T00:00:00Z');
  const sharedSkillsUpdated = new Date('2026-09-02T00:00:00Z');
  const systemBoundaryUpdated = new Date('2026-09-03T00:00:00Z');
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
    {
      url: `${site.url}/blog/how-much-overhead-does-agentsight-add/`,
      lastModified: overheadUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${site.url}/blog/replay-coding-agent-repository-changes/`,
      lastModified: repositoryReplayUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${site.url}/blog/observe-ai-agent-sessions-in-docker/`,
      lastModified: dockerSessionsUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${site.url}/blog/read-agentsight-audit-provenance/`,
      lastModified: auditProvenanceUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${site.url}/blog/how-agentsight-direct-node-credentials-work/`,
      lastModified: directNodeCredentialsUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${site.url}/blog/when-agentsight-works-without-ebpf/`,
      lastModified: noEbpfUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${site.url}/blog/how-agentsight-discovers-local-agent-sessions/`,
      lastModified: localSessionDiscoveryUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${site.url}/blog/how-agentsight-shares-versioned-agent-skills/`,
      lastModified: sharedSkillsUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    ...pages.map((page) => ({
      url: `${site.url}${contentPath(page)}`,
      lastModified:
        page.kind === 'blog' && page.slug === 'system-boundary-observability'
          ? systemBoundaryUpdated
          : existingUpdated,
      changeFrequency: 'monthly' as const,
      priority: page.kind === 'landing' ? 0.7 : 0.75,
    })),
  ];
}
