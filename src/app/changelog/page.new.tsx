import type { Metadata } from 'next';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'Follow AgentSight releases, supported agent runtimes, local reports, repository replay, and Agent Flamegraph updates.',
  alternates: { canonical: '/changelog/' },
};

const updates = [
  {
    label: 'Current release',
    title: `AgentSight ${site.version}`,
    description:
      'Adds documentation for the report snapshot schema and broader TLS target support for native agent CLIs. GitHub Releases remains the source for binaries and per-tag changes.',
    href: site.releaseUrl,
  },
  {
    label: 'Profiling',
    title: 'Agent Flamegraphs',
    description:
      'agentpprof aggregates local agent sessions into token, time, operation, file, and network profiles with stable categories for comparison.',
    href: `${site.repository}/blob/master/docs/agentpprof.md`,
  },
  {
    label: 'Product',
    title: 'Local session replay and reports',
    description:
      'AgentSight can inspect Claude, Codex, and Gemini session history, replay repository changes, serve recorded sessions, and export portable report snapshots.',
    href: site.docs,
  },
];

export default function ChangelogPage() {
  return (
    <SiteShell>
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Changelog</Eyebrow>
          <h1>Product updates and release highlights.</h1>
          <p className="hero-lede">
            This page summarizes major user-facing changes. GitHub Releases and the AgentSight
            repository remain authoritative for a specific version.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="shell timeline">
          {updates.map((update) => (
            <article key={update.title}>
              <p className="card-label">{update.label}</p>
              <h2>{update.title}</h2>
              <p>{update.description}</p>
              <a className="arrow-link" href={update.href}>Read the source <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
