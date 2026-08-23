import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentCard } from '@/components/ContentPages';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { contentPath, getPages } from '@/lib/public-content';
import { hubConfig, site } from '@/lib/site';

const config = hubConfig.blog;
const repositoryReplayArticle = {
  title: 'What repository replay can tell you about a coding agent',
  description:
    'See how Agent Nebula reconstructs ordered repository evolution from local agent sessions, and where replay stops short of explaining intent or low-level system effects.',
  href: '/blog/replay-coding-agent-repository-changes/',
};
const overheadArticle = {
  title: 'How much overhead does AgentSight add?',
  description:
    'Read the published 2.9% average runtime-overhead result with the raw run variability, benchmark limits, and a method for measuring your own workload.',
  href: '/blog/how-much-overhead-does-agentsight-add/',
};

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  alternates: { canonical: config.path },
};

export default function BlogPage() {
  const pages = getPages('blog');
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.title,
    description: config.description,
    url: `${site.url}${config.path}`,
    hasPart: [
      ...pages.map((page) => ({ '@type': 'WebPage', name: page.title, url: `${site.url}${contentPath(page)}` })),
      { '@type': 'WebPage', name: repositoryReplayArticle.title, url: `${site.url}${repositoryReplayArticle.href}` },
      { '@type': 'WebPage', name: overheadArticle.title, url: `${site.url}${overheadArticle.href}` },
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
            <p className="card-label">Agent replay methods · August 2026</p>
            <h2><Link href={repositoryReplayArticle.href}>{repositoryReplayArticle.title}</Link></h2>
            <p>{repositoryReplayArticle.description}</p>
            <Link className="arrow-link" href={repositoryReplayArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Performance methods · August 2026</p>
            <h2><Link href={overheadArticle.href}>{overheadArticle.title}</Link></h2>
            <p>{overheadArticle.description}</p>
            <Link className="arrow-link" href={overheadArticle.href}>Read the page</Link>
          </article>
          {pages.map((page) => <ContentCard key={page.slug} page={page} />)}
        </div>
      </section>
    </SiteShell>
  );
}
