import type { Metadata } from 'next';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Security and local data handling',
  description:
    'Understand AgentSight local capture, sensitive session data, targeted recording, export boundaries, privileges, redaction, and vulnerability reporting.',
  alternates: { canonical: '/security/' },
};

const points = [
  [
    'Local-first storage',
    'Recorded sessions stay on the machine unless you explicitly serve, export, copy, upload, or forward their contents. Local-first changes the default data path; it does not make the captured data non-sensitive.',
  ],
  [
    'Sensitive session contents',
    'Depending on capture mode, sessions can include prompts, responses, commands, paths, headers, model/provider data, process activity, and network targets. Treat raw databases and exports like other sensitive development telemetry.',
  ],
  [
    'Privileged observation',
    'Linux eBPF and user-space probe attachment can require elevated privileges. That privilege lets the operator observe supported system activity; it is not an authorization model for the agent and does not grant permission to share captured content.',
  ],
  [
    'Targeted recording',
    'Prefer one selected agent command, process family, or bounded experiment over broad workstation capture. Narrow scope improves attribution and reduces unrelated data collected from the host.',
  ],
  [
    'Exports are a new data boundary',
    'A local session can remain local while an exported report, OTLP stream, screenshot, or copied database leaves the machine. Apply redaction, retention, and access controls at each export destination separately.',
  ],
  [
    'Observed activity needs context',
    'A file access, process spawn, or network connection is not automatically malicious. Compare the activity with the authorized task and runtime, and reproduce surprising behavior before drawing a security conclusion.',
  ],
];

const reviewQuestions = [
  [
    'What can enter a run?',
    'The exact fields depend on the enabled capture paths. Model/TLS capture can expose request or response content and headers; process and file monitoring can expose commands and paths; network analysis can expose destinations. Inspect the recorded artifact before sharing it.',
  ],
  [
    'What should be redacted?',
    'Remove or replace secrets, authorization values, private prompt/response content, proprietary source snippets, personal identifiers, and path details that are unnecessary for the review question. Preserve enough timestamps, event types, process relationships, and summarized scope for another engineer to verify the conclusion.',
  ],
  [
    'What does absence mean?',
    'No observed event is not proof that an event never happened. Capture depends on the selected process family, privileges, runtime packaging, probe support, and recording interval. Re-run with a narrower experiment or a second data source when a conclusion depends on absence.',
  ],
  [
    'When is remote telemetry appropriate?',
    'AgentSight can export supported model calls through OpenTelemetry, and reports can be copied to other systems. Send only the fields needed by the remote workflow. Content-rich local sessions do not need to become content-rich centralized traces by default.',
  ],
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
          text: 'Recorded sessions are local unless the operator explicitly serves, exports, copies, uploads, or forwards their contents.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can an AgentSight session contain sensitive data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Depending on capture mode, sessions can include prompts, responses, commands, paths, headers, model or provider data, process activity, and network targets.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does an empty AgentSight result prove that an action did not happen?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. A result describes activity observed inside the selected recording and supported capture boundary; missing activity can also reflect scope, privilege, runtime, or probe limitations.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does exporting AgentSight data change the security boundary?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Exporting a report, database, screenshot, or OpenTelemetry data moves selected information into another storage and access boundary that should have its own redaction, retention, and access controls.',
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
          <h1>Keep recorded sessions local and under your control.</h1>
          <p className="hero-lede">
            AgentSight can capture sensitive execution context from a privileged system boundary. The
            operator remains responsible for recording scope, storage, redaction, retention, export,
            and the conclusions drawn from observed activity.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>Data and capture boundaries</Eyebrow>
              <h2>Local-first is a storage default, not a sensitivity claim.</h2>
            </div>
            <p>
              Decide what to record before capture, inspect the resulting session before sharing it,
              and treat every export destination as a separate security boundary.
            </p>
          </div>
          <div className="card-grid security-grid">
            {points.map(([title, description], index) => (
              <article className="content-card" key={title}>
                <p className="card-label">0{index + 1}</p>
                <h2>{title}</h2>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>Before sharing a run</Eyebrow>
              <h2>Reduce the artifact to the question another engineer needs to answer.</h2>
            </div>
            <p>
              A useful review artifact can keep process relationships, event types, timings, path or
              destination classes, and exit status while removing raw content that is unnecessary for
              the decision.
            </p>
          </div>
          <div className="card-grid">
            {reviewQuestions.map(([title, description]) => (
              <article className="content-card" key={title}>
                <p className="card-label">Review boundary</p>
                <h2>{title}</h2>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dark-section section">
        <div className="shell dark-grid">
          <div>
            <Eyebrow>Operational rule</Eyebrow>
            <h2>Record narrowly, preserve provenance, and reproduce surprises.</h2>
            <p>
              Keep the AgentSight version, task boundary, repository or workload version, relevant
              recording options, and known capture limits with any security finding. A reproducible,
              scoped observation is more useful than a broad alert with no causal context.
            </p>
          </div>
          <ul className="workflow-list">
            <li>
              <span>01</span>
              <div><strong>Bound the task</strong><p>Record one selected command or representative capability.</p></div>
            </li>
            <li>
              <span>02</span>
              <div><strong>Inspect before export</strong><p>Identify sensitive content and keep only what the review needs.</p></div>
            </li>
            <li>
              <span>03</span>
              <div><strong>State capture limits</strong><p>Separate observed absence from proof that an action never happened.</p></div>
            </li>
            <li>
              <span>04</span>
              <div><strong>Reproduce the finding</strong><p>Repeat surprising behavior before escalating a security conclusion.</p></div>
            </li>
          </ul>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell split-section">
          <div>
            <Eyebrow>Security reports</Eyebrow>
            <h2>Share only what can be safely public.</h2>
            <p>
              AgentSight does not currently publish a private vulnerability-reporting channel. Do
              not place traces, credentials, tokens, sensitive path contents, or an unpatched
              vulnerability in a public issue. Use the public tracker only for a fully redacted,
              non-sensitive issue that is safe to disclose.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <a className="button button-accent" href={`${site.repository}/issues/new/choose`}>
              Report a non-sensitive issue
            </a>
            <a className="button button-outline" href={site.repository}>
              Review the source repository
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
