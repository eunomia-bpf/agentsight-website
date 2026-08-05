import type { Metadata } from 'next';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Security and local data handling',
  description:
    'Understand AgentSight local capture, sensitive session data, targeted recording, export boundaries, and vulnerability reporting.',
  alternates: { canonical: '/security/' },
};

const points = [
  ['Local-first data path', 'Recorded sessions stay on the machine unless you explicitly export, serve, copy, or upload them.'],
  ['Sensitive evidence', 'Sessions can include prompts, responses, paths, headers, commands, and network targets. Treat databases and exports as sensitive.'],
  ['Targeted recording', 'Prefer one selected agent command or bounded process family over broad capture. Review scope before sharing an artifact.'],
  ['System evidence, not a verdict', 'Observed access must be interpreted against the authorized task and runtime. Reproduce suspicious behavior before drawing a security conclusion.'],
];

export default function SecurityPage() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Does AgentSight upload recorded sessions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Recorded sessions are local unless the operator explicitly exports, serves, copies, or uploads them.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can an AgentSight session contain sensitive data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Sessions can include prompts, responses, paths, headers, commands, and network targets and should be handled as sensitive data.',
        },
      },
    ],
  };

  return (
    <SiteShell>
      <JsonLd value={faq} />
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Security</Eyebrow>
          <h1>Keep run evidence local, bounded, and reviewable.</h1>
          <p className="hero-lede">
            AgentSight is an observability tool. It can capture sensitive execution context, so the
            person operating it remains responsible for scope, storage, redaction, and sharing.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="shell card-grid security-grid">
          {points.map(([title, description], index) => (
            <article className="content-card" key={title}>
              <p className="card-label">0{index + 1}</p>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section section-white">
        <div className="shell split-section">
          <div>
            <Eyebrow>Report a vulnerability</Eyebrow>
            <h2>Use the AgentSight security policy.</h2>
            <p>
              Do not include private traces, credentials, tokens, or sensitive path contents in a
              public issue. Follow the repository policy for the current private reporting route.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <a className="button button-accent" href={`${site.repository}/security/policy`}>
              Open security policy
            </a>
            <a className="button button-outline" href={`${site.repository}/issues`}>
              Browse public issues
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
