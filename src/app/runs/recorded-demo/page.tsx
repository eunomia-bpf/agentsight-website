import type { Metadata } from 'next';
import Image from 'next/image';
import { Icon } from '@/components/Icons';
import { CommandBlock, Eyebrow, JsonLd, PageMeta } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Recorded AgentSight demo: evidence anatomy',
  description:
    'Inspect the public AgentSight recorded session as a causal run profile, including intent, model activity, processes, files, network targets, and evidence limits.',
  path: '/runs/recorded-demo/',
});

const layers = [
  ['Intent and turns', 'Identify the selected task, turn boundaries, and the model or tool decisions that frame later system activity.'],
  ['Model activity', 'Review call timing, token-related aggregates, and provider traffic as one layer rather than the entire explanation.'],
  ['Process family', 'Locate commands, child processes, status, waits, CPU, and memory phases associated with the recorded run.'],
  ['System effects', 'Inspect file activity and network destinations, then connect each effect to the task step that made it relevant.'],
];

export default function RecordedDemoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Recorded AgentSight demo: evidence anatomy',
    dateModified: site.updatedAt,
    url: `${site.url}/runs/recorded-demo/`,
    author: { '@type': 'Person', name: site.maintainer.name, url: site.maintainer.url },
    about: { '@type': 'SoftwareApplication', name: site.name, softwareVersion: site.version },
  };

  return (
    <SiteShell>
      <JsonLd value={jsonLd} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <Eyebrow>Public recorded session</Eyebrow>
          <h1>Inspect a causal run profile without turning the demo into a benchmark claim.</h1>
          <p className="hero-lede">
            The public demo shows how AgentSight organizes a saved session. This page explains what to inspect, how the layers relate, and what the interface alone does not prove.
          </p>
          <PageMeta version={site.version} reviewed="August 5, 2026" author={site.maintainer.name} />
        </div>
      </section>

      <section className="section section-white">
        <div className="shell demo-showcase">
          <div className="product-window">
            <div className="window-bar"><span><i /> AgentSight live sessions</span><b>public demo</b></div>
            <Image
              src="/images/top-mode-demo.png"
              alt="AgentSight recorded session interface"
              width={2266}
              height={1034}
              priority
              sizes="(max-width: 900px) 100vw, 1100px"
            />
            <div className="window-foot"><span>saved session</span><span>local analysis</span><span>multiple evidence views</span></div>
          </div>
          <div className="demo-actions">
            <a className="button button-accent" href={site.demo}>Open the interactive demo</a>
            <a className="button button-outline" href={site.repository}>Inspect the source</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell evidence-stack">
          {layers.map(([title, description], index) => (
            <article className="evidence-row" key={title}>
              <span>0{index + 1}</span>
              <div><h2>{title}</h2><p>{description}</p></div>
              <Icon name={(['spark', 'token', 'process', 'file'] as const)[index]} size={24} />
            </article>
          ))}
        </div>
      </section>

      <section className="section section-white">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <p className="section-index">Question</p>
              <h2>What can the saved session support?</h2>
              <p>
                It can support statements about the events and aggregates present in the selected record. It can help a reviewer reconstruct likely causal paths and choose a follow-up experiment. It does not automatically prove that an unobserved event never occurred, that a destination was malicious, or that one run represents every version and environment.
              </p>
            </section>
            <section>
              <p className="section-index">Review sequence</p>
              <h2>Move from the task to the effect, then back to the decision.</h2>
              <p>
                Begin with the run boundary and intended task. Identify an expensive, risky, or unexplained phase. Follow the process and effect evidence supporting that phase, then state the smallest conclusion and the next verification step.
              </p>
            </section>
            <CommandBlock
              commands={[
                'sudo agentsight record -- <agent-command>',
                'agentsight report audit --json',
                'agentsight report export -o review.json',
              ]}
            />
          </article>
          <aside className="detail-aside static-aside">
            <p className="card-label">Public evidence status</p>
            <div className="aside-fact"><span>Artifact</span><strong>Recorded demo</strong></div>
            <div className="aside-fact"><span>Verified against</span><strong>v{site.version}</strong></div>
            <div className="aside-fact"><span>Benchmark claim</span><strong>None</strong></div>
            <div className="aside-fact"><span>Raw session</span><strong>Not published</strong></div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
