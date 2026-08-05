import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon, type IconName } from '@/components/Icons';
import { Eyebrow, JsonLd, PageMeta, SectionHeading } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Agent run evidence library',
  description:
    'Browse AgentSight recorded-demo analysis and reproducible run workflows for performance profiling, generated-code review, and extension auditing.',
  path: '/runs/',
});

const runs: Array<{
  href: string;
  icon: IconName;
  status: string;
  title: string;
  description: string;
  question: string;
}> = [
  {
    href: '/runs/recorded-demo/',
    icon: 'activity',
    status: 'Public recorded session',
    title: 'Recorded demo: inspect one causal run profile',
    description: 'A guided inspection of the public AgentSight session view, evidence layers, and the questions each view can support.',
    question: 'What can a reviewer learn from the saved run without assuming more than the record proves?',
  },
  {
    href: '/runs/review-artifact/',
    icon: 'code',
    status: 'Reproducible workflow',
    title: 'Generated PR: build an execution review artifact',
    description: 'A bounded workflow for pairing a Codex- or Claude-generated diff with commands, tests, retries, touched paths, and evidence gaps.',
    question: 'How did the agent reach this patch, and which validation steps are still missing?',
  },
  {
    href: '/use-cases/profile-slow-expensive-agent-runs/',
    icon: 'flame',
    status: 'Profiling playbook',
    title: 'Slow run: isolate model, shell, scan, and wait-heavy paths',
    description: 'Use semantic Agent Flamegraphs and process evidence to select the next performance experiment.',
    question: 'Which causal path explains wall-clock time or token cost?',
  },
];

export default function RunsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Agent run evidence library',
    description: 'AgentSight run artifacts and reproducible evidence workflows.',
    url: `${site.url}/runs/`,
    hasPart: runs.map((run) => ({ '@type': 'TechArticle', name: run.title, url: `${site.url}${run.href}` })),
  };

  return (
    <SiteShell>
      <JsonLd value={jsonLd} />
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Run library</Eyebrow>
          <h1>Evidence-oriented examples, not keyword-swapped case studies.</h1>
          <p className="hero-lede">
            Each run starts from a concrete engineering question, states whether the material is a recorded artifact or a reproducible workflow, and preserves the limits of the available evidence.
          </p>
          <PageMeta version={site.version} reviewed="August 2026" author="Eunomia" />
        </div>
      </section>

      <section className="section">
        <div className="shell run-grid">
          {runs.map((run) => (
            <article className="run-card" key={run.href}>
              <div className="run-card-head">
                <span className="icon-badge"><Icon name={run.icon} size={21} /></span>
                <span className="status-badge">{run.status}</span>
              </div>
              <h2><Link href={run.href}>{run.title}</Link></h2>
              <p>{run.description}</p>
              <div className="run-question">
                <span>Question</span>
                <strong>{run.question}</strong>
              </div>
              <Link className="arrow-link" href={run.href}>Open the evidence page <Icon name="arrow" size={17} /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <SectionHeading
            eyebrow="Contribution standard"
            title="A run page must be reproducible, versioned, and safe to publish."
            description="The library grows through real artifacts and bounded workflows, not daily content quotas."
          />
          <div className="principle-grid compact-principles">
            {[
              ['terminal', 'Exact command', 'Record the command and task boundary that produced the evidence.'],
              ['layers', 'Environment', 'State AgentSight, agent, operating-system, and relevant runtime versions.'],
              ['eye', 'Observed findings', 'Point to the artifact or event supporting each public claim.'],
              ['shield', 'Limits and redaction', 'Document unavailable evidence and review every artifact before sharing.'],
            ].map(([icon, title, text]) => (
              <article key={title}>
                <span className="icon-badge"><Icon name={icon as IconName} size={20} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
