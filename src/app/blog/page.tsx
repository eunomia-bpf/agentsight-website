import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentCard } from '@/components/ContentPages';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { contentPath, getPages } from '@/lib/public-content';
import { hubConfig, site } from '@/lib/site';

const config = hubConfig.blog;
const noEbpfArticle = {
  title: 'When AgentSight works without eBPF—and when it does not',
  description:
    'Choose between agent-native session evidence and independent system observation: see which top, bind, vis, and report workflows work without sudo or eBPF, and when record is still the right sensor.',
  href: '/blog/when-agentsight-works-without-ebpf/',
};
const directNodeCredentialsArticle = {
  title: 'How AgentSight Direct Node credentials work',
  description:
    'Follow the exact v1.0.30 credential path from agentsight bind through URL-fragment pairing, Direct browser capabilities, Controller relay capabilities, and optional encrypted cross-browser Direct sync.',
  href: '/blog/how-agentsight-direct-node-credentials-work/',
};
const auditProvenanceArticle = {
  title: 'How to read AgentSight audit provenance and confidence',
  description:
    'Understand direct capture, SQLite reconstruction, native agent sessions, correlation confidence, legacy fallbacks, and how to preserve evidence lineage in exported snapshots.',
  href: '/blog/read-agentsight-audit-provenance/',
};
const dockerSessionsArticle = {
  title: 'How AgentSight observes AI agent sessions inside Docker',
  description:
    'See how the Docker-backed native-session bridge keeps provider state in the container, routes exact sessions, bounds JSONL operations, and separates AgentSight scope from Docker daemon authority.',
  href: '/blog/observe-ai-agent-sessions-in-docker/',
};
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
      { '@type': 'WebPage', name: noEbpfArticle.title, url: `${site.url}${noEbpfArticle.href}` },
      { '@type': 'WebPage', name: directNodeCredentialsArticle.title, url: `${site.url}${directNodeCredentialsArticle.href}` },
      { '@type': 'WebPage', name: auditProvenanceArticle.title, url: `${site.url}${auditProvenanceArticle.href}` },
      { '@type': 'WebPage', name: dockerSessionsArticle.title, url: `${site.url}${dockerSessionsArticle.href}` },
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
            <p className="card-label">Evidence modes · August 2026</p>
            <h2><Link href={noEbpfArticle.href}>{noEbpfArticle.title}</Link></h2>
            <p>{noEbpfArticle.description}</p>
            <Link className="arrow-link" href={noEbpfArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Remote-access architecture · August 2026</p>
            <h2><Link href={directNodeCredentialsArticle.href}>{directNodeCredentialsArticle.title}</Link></h2>
            <p>{directNodeCredentialsArticle.description}</p>
            <Link className="arrow-link" href={directNodeCredentialsArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Evidence interpretation · August 2026</p>
            <h2><Link href={auditProvenanceArticle.href}>{auditProvenanceArticle.title}</Link></h2>
            <p>{auditProvenanceArticle.description}</p>
            <Link className="arrow-link" href={auditProvenanceArticle.href}>Read the page</Link>
          </article>
          <article className="content-card">
            <p className="card-label">Container session architecture · August 2026</p>
            <h2><Link href={dockerSessionsArticle.href}>{dockerSessionsArticle.title}</Link></h2>
            <p>{dockerSessionsArticle.description}</p>
            <Link className="arrow-link" href={dockerSessionsArticle.href}>Read the page</Link>
          </article>
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
