import type { Metadata } from 'next';
import { Icon } from '@/components/Icons';
import { Eyebrow, JsonLd, PageMeta, SectionHeading } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'About AgentSight',
  description:
    'Meet the open-source maintainers behind AgentSight and understand the project’s system-observability thesis, governance, and evidence standards.',
  path: '/about/',
});

const milestones = [
  ['2023', 'bpftime demonstrated fast, unprivileged userspace eBPF instrumentation for production-style workloads.'],
  ['2024', 'Eunomia research explored natural-language-to-eBPF systems and safe runtime observability.'],
  ['2026', 'AgentSight unified model activity with process, file, network, and resource evidence for local AI agents.'],
];

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About AgentSight',
    url: `${site.url}/about/`,
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: site.name,
      softwareVersion: site.version,
      author: { '@type': 'Person', name: site.maintainer.name, url: site.maintainer.url },
      publisher: { '@type': 'Organization', name: site.organization.name, url: site.organization.url },
    },
  };

  return (
    <SiteShell>
      <JsonLd value={jsonLd} />
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>About the project</Eyebrow>
          <h1>Built by systems engineers who want agent behavior to be inspectable.</h1>
          <p className="hero-lede">
            AgentSight is an open-source Eunomia project. Its thesis is simple: an AI agent is not only a sequence of model calls. It is a program that launches processes, touches files, reaches networks, consumes resources, and changes an environment.
          </p>
          <PageMeta version={site.version} reviewed="August 2026" author={site.maintainer.name} />
        </div>
      </section>

      <section className="section section-white">
        <div className="shell about-grid">
          <article className="maintainer-card">
            <img src={site.maintainer.avatar} width="112" height="112" alt={`${site.maintainer.name} GitHub avatar`} />
            <div>
              <p className="card-label">Creator and maintainer</p>
              <h2>{site.maintainer.name}</h2>
              <p>
                Yusheng maintains AgentSight and the Eunomia eBPF ecosystem, including bpftime and tools that connect programmable observability with AI-assisted systems work.
              </p>
              <div className="profile-links">
                <a href={site.maintainer.url}><Icon name="github" size={18} />@{site.maintainer.handle}</a>
                <a href={site.organization.url}><Icon name="globe" size={18} />Eunomia</a>
              </div>
            </div>
          </article>
          <div className="about-copy">
            <Eyebrow>Project values</Eyebrow>
            <h2>Independent evidence over opaque summaries.</h2>
            <p>
              AgentSight is designed around a local-first evidence path, explicit uncertainty, primary-source technical claims, and a stable system boundary that remains useful across changing agent frameworks.
            </p>
            <ul className="value-list">
              <li><Icon name="shield" size={20} /><span><strong>Local first.</strong> Raw sessions can contain sensitive prompts, paths, headers, and destinations; data handling must be deliberate.</span></li>
              <li><Icon name="eye" size={20} /><span><strong>Observable claims.</strong> Product pages distinguish recorded effects from inferred intent and do not turn missing data into proof.</span></li>
              <li><Icon name="github" size={20} /><span><strong>Open development.</strong> Source, releases, issues, and website content are publicly reviewable under the MIT license.</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Technical lineage"
            title="A project built from eBPF, profiling, and safe runtime extensibility."
            description="AgentSight inherits years of work on observing systems below application frameworks and presenting low-level events as useful engineering evidence."
          />
          <div className="project-timeline">
            {milestones.map(([year, text]) => (
              <article key={year}>
                <strong>{year}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark-section">
        <div className="shell final-cta-inner">
          <div>
            <Eyebrow>Contribute</Eyebrow>
            <h2>Help define the evidence model for agentic systems.</h2>
            <p>Open an issue, test a real workload, improve a collector, or contribute a reproducible run artifact.</p>
          </div>
          <div className="hero-actions">
            <a className="button button-light" href={site.repository}>Open the repository</a>
            <a className="button button-ghost" href={`${site.repository}/issues`}>Browse issues</a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
