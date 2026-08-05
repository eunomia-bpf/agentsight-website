import type { Metadata } from 'next';
import { Icon } from '@/components/Icons';
import { Eyebrow, PageMeta } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Changelog',
  description:
    'Follow AgentSight releases, profiling improvements, semantic flamegraph work, supported agent paths, and official website updates.',
  path: '/changelog/',
});

const updates = [
  {
    label: 'August 5, 2026 · Current release',
    title: `AgentSight ${site.version}`,
    description:
      'The current stable release separated agentsight.us into its dedicated website repository and remains the authoritative binary line for the pages verified here.',
    href: site.releaseUrl,
    icon: 'spark' as const,
  },
  {
    label: 'Analysis',
    title: 'Semantic Agent Flamegraphs',
    description:
      'The agentpprof workflow aggregates local agent sessions into tokens, time, operations, files, and network views with stable semantic intent labels.',
    href: `${site.repository}/blob/master/docs/agentpprof.md`,
    icon: 'flame' as const,
  },
  {
    label: 'Experience',
    title: 'Local session replay and reports',
    description:
      'AgentSight can inspect native Claude, Codex, and Gemini session history and create local analysis artifacts without requiring a live eBPF recording for every workflow.',
    href: site.docs,
    icon: 'activity' as const,
  },
  {
    label: 'Website',
    title: 'Evidence library and verified product identity',
    description:
      'The official site now includes a run library, methodology, project authorship, versioned technical claims, complete brand assets, and improved social previews.',
    href: site.websiteRepository,
    icon: 'eye' as const,
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
            This page highlights major user-facing directions. GitHub Releases and the product repository remain authoritative for a specific tag.
          </p>
          <PageMeta version={site.version} reviewed="August 5, 2026" author="Eunomia" />
        </div>
      </section>
      <section className="section">
        <div className="shell timeline">
          {updates.map((update) => (
            <article key={update.title}>
              <span className="timeline-icon"><Icon name={update.icon} size={19} /></span>
              <p className="card-label">{update.label}</p>
              <h2>{update.title}</h2>
              <p>{update.description}</p>
              <a className="arrow-link" href={update.href}>Read the primary source <Icon name="arrow" size={17} /></a>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
