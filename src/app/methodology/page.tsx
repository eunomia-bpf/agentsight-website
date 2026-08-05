import type { Metadata } from 'next';
import { Icon } from '@/components/Icons';
import { CommandBlock, Eyebrow, JsonLd, PageMeta, SectionHeading } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'AgentSight methodology',
  description:
    'How AgentSight scopes a run, collects system evidence, preserves uncertainty, reduces traces, and verifies technical claims without overstating what an observation proves.',
  path: '/methodology/',
});

const steps = [
  ['01', 'Choose a bounded question', 'Define the decision before collection: performance, generated-code review, compatibility, or extension audit.'],
  ['02', 'Record the actual command', 'Observe the selected process family and retain enough context to attribute model and system activity.'],
  ['03', 'Normalize the evidence', 'Connect turns, calls, commands, paths, destinations, resource phases, and exit status without erasing provenance.'],
  ['04', 'Reduce, do not decorate', 'Aggregate the trace into a causal profile or review artifact that answers the original question.'],
  ['05', 'State the limits', 'Separate observed effects, supported inferences, unavailable evidence, and questions that need another experiment.'],
];

export default function MethodologyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'AgentSight methodology',
    description: 'The evidence and verification method used by AgentSight.',
    dateModified: site.updatedAt,
    author: { '@type': 'Person', name: site.maintainer.name, url: site.maintainer.url },
    publisher: { '@type': 'Organization', name: site.organization.name, url: site.organization.url },
    url: `${site.url}/methodology/`,
  };

  return (
    <SiteShell>
      <JsonLd value={jsonLd} />
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Evidence methodology</Eyebrow>
          <h1>Start with a decision. Preserve the path from event to claim.</h1>
          <p className="hero-lede">
            AgentSight is not a promise that every low-level event explains itself. The method is to scope one question, collect the relevant system boundary, retain provenance, and make uncertainty visible.
          </p>
          <PageMeta version={site.version} reviewed="August 5, 2026" author={site.maintainer.name} />
        </div>
      </section>

      <section className="section">
        <div className="shell method-grid">
          {steps.map(([number, title, description]) => (
            <article className="method-step" key={number}>
              <span>{number}</span>
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <SectionHeading
            eyebrow="Evidence levels"
            title="Do not collapse observation, inference, and absence into one confidence level."
            description="A useful report tells the reviewer which statements came from a recorded event, which combine multiple events, and which remain hypotheses."
          />
          <div className="principle-grid">
            <article>
              <span className="icon-badge"><Icon name="eye" size={20} /></span>
              <h3>Observed</h3>
              <p>A command, process, file operation, network destination, model call, or resource phase exists in the selected record.</p>
            </article>
            <article>
              <span className="icon-badge"><Icon name="trace" size={20} /></span>
              <h3>Attributed</h3>
              <p>Multiple events are connected to a run, process family, turn, or bounded task through recorded identifiers and timing.</p>
            </article>
            <article>
              <span className="icon-badge"><Icon name="search" size={20} /></span>
              <h3>Inferred</h3>
              <p>A likely explanation is supported by evidence but still needs a follow-up run, source inspection, or controlled comparison.</p>
            </article>
            <article>
              <span className="icon-badge"><Icon name="shield" size={20} /></span>
              <h3>Unavailable</h3>
              <p>The collector, runtime packaging, encryption boundary, permissions, or retained data does not support a conclusion.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell split-section">
          <div>
            <Eyebrow>Privacy boundary</Eyebrow>
            <h2>Raw runs are sensitive until reviewed and reduced.</h2>
            <p>
              Agent sessions can contain prompts, responses, repository paths, headers, commands, and network targets. Keep raw databases and exports local, redact artifacts before sharing, and publish only the minimum evidence required for the decision.
            </p>
            <div className="privacy-checks">
              <span><Icon name="check" size={16} />No raw analytics in Git</span>
              <span><Icon name="check" size={16} />No credentials or identifiers</span>
              <span><Icon name="check" size={16} />Explicit redaction review</span>
            </div>
          </div>
          <CommandBlock
            title="Bounded capture"
            commands={[
              'sudo agentsight record -- claude',
              'agentsight report audit --json',
              'agentsight report export -o review.json',
            ]}
          />
        </div>
      </section>

      <section className="section dark-section">
        <div className="shell final-cta-inner">
          <div>
            <Eyebrow>Reproducibility</Eyebrow>
            <h2>A credible run page includes environment, command, evidence, limits, and a verification date.</h2>
            <p>Browse the run library to see how the methodology becomes a public-safe engineering artifact.</p>
          </div>
          <a className="button button-light" href="/runs/">Open the run library</a>
        </div>
      </section>
    </SiteShell>
  );
}
