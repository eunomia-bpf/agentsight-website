import type { Metadata } from 'next';
import { Icon, type IconName } from '@/components/Icons';
import { CommandBlock, Eyebrow, JsonLd, PageMeta, SectionHeading } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Build an execution artifact for an AI-generated pull request',
  description:
    'A reproducible AgentSight workflow for pairing an AI-generated code diff with commands, tests, failures, retries, touched paths, network evidence, and unresolved review gaps.',
  path: '/runs/review-artifact/',
});

const artifact = [
  ['Scope', 'Repository, requested change, agent command, version, and the authority granted to the run.'],
  ['Execution', 'Commands, child processes, test attempts, exit status, retries, and long-running phases.'],
  ['Effects', 'Files read or changed, generated artifacts, network destinations, and activity outside the stated scope.'],
  ['Gaps', 'Relevant tests not observed, unavailable evidence, ambiguous attribution, and claims requiring another run.'],
];

export default function ReviewArtifactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Build an execution artifact for an AI-generated pull request',
    description: 'Use AgentSight to attach run evidence to an AI-generated code review.',
    totalTime: 'PT20M',
    step: artifact.map(([name, text]) => ({ '@type': 'HowToStep', name, text })),
    url: `${site.url}/runs/review-artifact/`,
  };

  return (
    <SiteShell>
      <JsonLd value={jsonLd} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <Eyebrow>Reproducible review workflow</Eyebrow>
          <h1>Pair the final diff with the execution path that produced it.</h1>
          <p className="hero-lede">
            Source review remains authoritative for the code. AgentSight adds the missing run context: what the agent executed, which tests failed or passed, what it touched, and where the evidence remains incomplete.
          </p>
          <PageMeta version={site.version} reviewed="August 5, 2026" author={site.maintainer.name} />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Artifact anatomy"
            title="Keep the review record compact enough to inspect."
            description="The goal is not to attach a raw trace to every PR. It is to reduce the run into four evidence groups that support specific review questions."
          />
          <div className="artifact-anatomy">
            {artifact.map(([title, text], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h2>{title}</h2>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell split-section">
          <div>
            <Eyebrow>Capture</Eyebrow>
            <h2>Record the same command that is allowed to edit the repository.</h2>
            <p>
              Use a bounded task and a clean worktree. Record the agent command, let the normal tests and review tools run, then export a sanitized report. Do not infer that a test ran from the final source tree; require execution evidence.
            </p>
            <div className="privacy-checks">
              <span><Icon name="check" size={16} />Clean repository baseline</span>
              <span><Icon name="check" size={16} />Explicit task and authority</span>
              <span><Icon name="check" size={16} />Sanitized export</span>
            </div>
          </div>
          <CommandBlock
            commands={[
              'git status --short',
              'sudo agentsight record -- codex',
              'agentsight report audit --json',
              'agentsight report export -o pr-evidence.json',
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="shell question-grid">
          {[
            ['terminal', 'Validation', 'Which exact test commands ran, in what order, with which exit status and retries?'],
            ['file', 'Scope', 'Which paths were read or written, including generated artifacts and activity outside the repository?'],
            ['network', 'Dependencies', 'Did a remote response, package source, model endpoint, or external service influence the patch?'],
            ['search', 'Evidence gaps', 'Which important review questions remain unsupported by the retained run?'],
          ].map(([icon, title, text]) => (
            <article className="question-card" key={title}>
              <span className="icon-badge"><Icon name={icon as IconName} size={21} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark-section">
        <div className="shell final-cta-inner">
          <div>
            <Eyebrow>Review standard</Eyebrow>
            <h2>A clean artifact can say “not observed” without pretending that means “did not happen.”</h2>
            <p>Preserve the distinction between the final diff, recorded execution evidence, and reviewer inference.</p>
          </div>
          <a className="button button-light" href="/methodology/">Read the methodology</a>
        </div>
      </section>
    </SiteShell>
  );
}
