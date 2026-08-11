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
      'Adds the unprivileged agentsight bind workflow for opening a local Direct Node in the hosted app. The default Node stays on loopback, uses a process-lifetime access key, and keeps detailed session data on the Node; the hosted control plane stores only optional identity, session, and Node metadata. GitHub Releases remains authoritative for per-tag changes.',
    href: site.releaseUrl,
  },
  {
    label: 'Release artifacts',
    title: 'Native Linux x86_64 and ARM64 binaries',
    description:
      'Current GitHub Releases publish agentsight and agentpprof binaries for x86_64 and aarch64 Linux. The unsuffixed compatibility assets remain x86_64; use the architecture-specific artifact when pinning a reproducible deployment.',
    href: `${site.repository}/releases/latest`,
  },
  {
    label: 'Profiling',
    title: 'Agent Flamegraphs',
    description:
      'agentpprof derives configurable task, skill, phase, action, object, repeat, result, outcome, and token stacks from local agent sessions, with pprof, folded, SVG, and JSON outputs.',
    href: `${site.repository}/blob/master/docs/agentpprof.md`,
  },
  {
    label: 'Product',
    title: 'Local session replay and reports',
    description:
      'AgentSight can inspect Claude, Codex, Gemini, and Cursor session history, replay repository changes, serve recorded sessions, and export portable report snapshots.',
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
