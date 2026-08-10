import Link from 'next/link';
import type { Metadata } from 'next';
import { ContentCard } from '@/components/ContentPages';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { getPages } from '@/lib/public-content';
import { hubConfig, site } from '@/lib/site';

const config = hubConfig.integration;
export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  alternates: { canonical: config.path },
};

export default function IntegrationsPage() {
  const pages = getPages('integration');
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.title,
    description: config.description,
    url: `${site.url}${config.path}`,
    hasPart: [
      {
        '@type': 'WebPage',
        name: 'AgentSight for Cursor IDE sessions',
        url: `${site.url}/integrations/cursor/`,
      },
      ...pages.map((page) => ({
        '@type': 'WebPage',
        name: page.title,
        url: `${site.url}${config.path}${page.slug}/`,
      })),
    ],
  };

  return (
    <SiteShell>
      <JsonLd value={collection} />
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>{config.eyebrow}</Eyebrow>
          <h1>{config.title}</h1>
          <p className="hero-lede">{config.description}</p>
        </div>
      </section>
      <section className="section">
        <div className="shell card-grid">
          <article className="content-card">
            <p className="card-label">Cursor IDE integration</p>
            <h2>
              <Link href="/integrations/cursor/">AgentSight for Cursor IDE sessions</Link>
            </h2>
            <p>
              Read Cursor&apos;s local agent transcripts and optional state metadata without eBPF,
              sudo, a proxy, or launching the IDE through AgentSight.
            </p>
            <Link href="/integrations/cursor/" className="arrow-link">
              Read the page <span aria-hidden="true">→</span>
            </Link>
          </article>
          {pages.map((page) => (
            <ContentCard key={page.slug} page={page} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
