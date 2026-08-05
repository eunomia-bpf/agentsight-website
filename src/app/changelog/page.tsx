import type { Metadata } from 'next';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'Follow AgentSight releases, profiling improvements, semantic flamegraph work, supported agent paths, and website updates.',
  alternates: { canonical: '/changelog/' },
};

const updates = [
  {
    label: 'Current release line',
    title: 'AgentSight 0.2.66',
    description:
      'The current product repository release when this independent website launched. Use GitHub Releases for binaries and the authoritative per-tag change history.',
    href: `${site.repository}/releases/tag/v0.2.66`,
  },
  {
    label: 'Analysis',
    title: 'Semantic Agent Flamegraphs',
    description:
      'The agentpprof workflow aggregates local agent sessions into tokens, time, operations, files, and network views with stable semantic intent labels.',
    href: `${site.repository}/blob/master/docs/agentpprof.md`,
  },
  {
    label: 'Experience',
    title: 'Local session replay and reports',
    description:
      'AgentSight can inspect native Claude, Codex, and Gemini session history and create local analysis artifacts without requiring a live eBPF recording for every workflow.',
    href: site.docs,
  },
];

export default function ChangelogPage() {
  return (
    <SiteShell>
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Changelog</Eyebrow>
          <h1>Follow the evidence model as AgentSight evolves.</h1>
          <p className="hero-lede">
            This page highlights major user-facing directions. GitHub Releases and the product
            repository remain the authoritative source for a specific version.
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
              <a className="arrow-link" href={update.href}>Read the primary source <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
