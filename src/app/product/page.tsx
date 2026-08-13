import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { productCommit, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Product',
  description:
    'How AgentSight v1.0.17 starts from a machine-level agent overview, drills into individual sessions, and combines portable agent-native history with Linux system capture.',
  alternates: { canonical: '/product/' },
};

const source = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;

const overview = [
  ['Agent state', 'See running, recent, and stopped sessions before opening one task.'],
  ['Tokens and plans', 'Use token totals and source-recorded coding plans to see what each agent is working on.'],
  ['CPU, RSS, processes', 'A live Node puts current resource shape beside session state instead of in a separate dashboard.'],
] as const;

const views = [
  ['Conversation', 'Load the selected session’s user and assistant messages and tools.'],
  ['Process Tree & AI Prompts', 'Connect the chosen session to its process family and captured model context.'],
  ['Timeline', 'Order model, tool, process, file, network, and resource activity by time.'],
  ['Detailed Events', 'Inspect lower-level recorded events without mixing unrelated sessions into the same detail view.'],
] as const;

const productAreas = [
  ['Use cases', 'Start from the engineering question: slow runs, generated changes, closed-source agents, or extension audits.', '/use-cases/'],
  ['Architecture', 'Understand the Node, Direct, Controller, organization, and capability boundaries.', '/architecture/'],
  ['Integrations', 'Choose the capture path that matches the agent and runtime you already use.', '/integrations/'],
  ['Compare', 'Compare AgentSight with application traces, OpenTelemetry, gateways, and hosted LLM tools.', '/compare/'],
] as const;

const sources = [
  ['AgentSight v1.0.17 release', site.releaseUrl],
  ['v1.0.17 session-first implementation and validation', 'https://github.com/eunomia-bpf/agentsight/pull/178'],
  ['Machine-level Node overview implementation', `${source}/frontend/src/components/NodeOverview.tsx`],
  ['Session-scoped workspace implementation', `${source}/frontend/src/components/SessionWorkspace.tsx`],
  ['Native Windows session-management scope', 'https://github.com/eunomia-bpf/agentsight/pull/167'],
  ['Current portable and Linux-only command boundaries', `${source}/README.md`],
] as const;

export default function ProductPage() {
  return (
    <SiteShell>
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Product · AgentSight v{site.version}</Eyebrow>
          <h1>Start with every agent on the machine. Drill into one session when you need the details.</h1>
          <p className="hero-lede">
            AgentSight v{site.version} makes the web app session-first. The first connected view is a
            machine-level agent overview; Conversation, Process Tree &amp; AI Prompts, Timeline, and Detailed
            Events open after you select a session. Portable agent-native history works on Windows, macOS,
            and Linux, while Linux can add eBPF-backed system capture.
          </p>
          <div className="hero-actions">
            <a className="button button-accent" href={site.demo}>Open AgentSight</a>
            <a className="button button-outline" href={site.docs}>Read the documentation</a>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <div className="section-heading">
            <div><Eyebrow>Machine overview</Eyebrow><h2>Answer “what is running?” before choosing what to inspect.</h2></div>
            <p>
              The current frontend replaces the old parallel dashboard with a bounded Node overview. It
              summarizes the machine without loading every transcript into the high-frequency refresh path.
              Full conversation detail stays behind the session boundary.
            </p>
          </div>
          <div className="card-grid">
            {overview.map(([title, description], index) => (
              <article className="content-card" key={title}>
                <p className="card-label">0{index + 1}</p><h2>{title}</h2><p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dark-section section">
        <div className="shell dark-grid">
          <div>
            <Eyebrow>Bounded refresh</Eyebrow>
            <h2>The overview stays small; session text is loaded when you open a session.</h2>
            <p>
              AgentSight separates the frequently refreshed machine overview from the larger snapshot and
              session index. A running session refreshes detail when its last-message marker changes or the
              user requests another load. This keeps machine monitoring responsive without making complete
              transcript text the default machine-level payload.
            </p>
          </div>
          <ul className="workflow-list">
            <li><span>01</span><div><strong>Observe the machine</strong><p>Agent state, token totals, current plans, CPU/RSS, and process counts.</p></div></li>
            <li><span>02</span><div><strong>Select one session</strong><p>Choose the task that actually needs debugging or review.</p></div></li>
            <li><span>03</span><div><strong>Load detail</strong><p>Fetch conversation and session-scoped runtime data on demand.</p></div></li>
          </ul>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <div className="section-heading">
            <div><Eyebrow>Session workspace</Eyebrow><h2>Four deep views share the same selected-session boundary.</h2></div>
            <p>
              The session header keeps current or peak CPU/RSS, token count, process count, workspace,
              current work, and coding-plan state next to the drill-down. The goal is attribution: a process,
              event, or resource spike should remain tied to the session that produced it.
            </p>
          </div>
          <div className="card-grid">
            {views.map(([title, description]) => (
              <article className="content-card" key={title}>
                <p className="card-label">Session view</p><h2>{title}</h2><p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell split-section">
          <div>
            <Eyebrow>Portable sessions versus system capture</Eyebrow>
            <h2>Cross-platform session management does not mean cross-platform eBPF tracing.</h2>
            <p>
              Agent-native session parsers support <code>top</code>, <code>bind</code>, <code>vis</code>,
              and <code>report</code> workflows on Windows, macOS, and Linux without eBPF. Linux adds the
              independent <code>record</code> and eBPF-backed debug path when an investigation needs process,
              file, resource, or TLS detail beyond the agent-native transcript.
            </p>
            <p>
              Native Windows support, introduced in v1.0.16, deliberately did not add an ETW/eBPF capture
              backend or claim Linux tracing parity. The current v1.0.17 GitHub release still publishes
              Linux x86_64 and aarch64 binaries; Windows is exercised by CI rather than shipped as a release asset.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <p className="card-label">Choose by question</p>
            <p><strong>Session history</strong></p><p>Start with the portable agent-native source.</p>
            <p><strong>Host effects</strong></p><p>On Linux, add system capture when the transcript cannot answer the question.</p>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell split-section">
          <div>
            <Eyebrow>Live Node versus saved capture</Eyebrow>
            <h2>A saved database is useful history, but it is not a live machine.</h2>
            <p>
              A live Node can provide the machine overview, current process/resource state, fresh session
              detail, and supported session messaging. A server opened over a saved SQLite capture remains
              read-only and cannot expose live overview, transcript, or message APIs that were not present
              in the saved artifact.
            </p>
            <p>
              Unassigned saved, demo, or live runtime data remains available through a neutral recorded
              capture drill-down instead of inflating running-session state or token totals. Negative claims
              should stay bounded by the source actually opened.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <a className="button button-accent" href="/guides/getting-started/">Record a bounded run</a>
            <a className="button button-outline" href="/security/">Review data handling</a>
          </div>
        </div>
      </section>

      <section className="dark-section section">
        <div className="shell dark-grid">
          <div>
            <Eyebrow>Distributed by transport, local-first by data</Eyebrow>
            <h2>Direct and Controller relay are transports to the Node, not new session databases.</h2>
            <p>
              Direct requests travel browser to Node. Controller relay remains an optional managed path.
              The hosted app presents runtime detail while Controller coordinates identity, organizations,
              discovery, connectivity, and access decisions. The Architecture page owns the exact data and
              trust boundary rather than duplicating it here.
            </p>
          </div>
          <ul className="workflow-list">
            <li><span>01</span><div><strong>Local</strong><p>Use AgentSight on one machine without a hosted account.</p></div></li>
            <li><span>02</span><div><strong>Direct</strong><p>Reach a browser-visible Node through its explicit endpoint.</p></div></li>
            <li><span>03</span><div><strong>Controller-managed</strong><p>Add identity, organizations, discovery, and optional relay when needed.</p></div></li>
          </ul>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <div className="section-heading">
            <div><Eyebrow>Product map</Eyebrow><h2>Go deeper without duplicating the same answer.</h2></div>
            <p>
              Product owns the end-to-end workflow. Architecture owns the data/control boundary,
              Integrations own runtime compatibility, Use cases own engineering decisions, and Compare
              pages own adjacent observability boundaries.
            </p>
          </div>
          <div className="card-grid">
            {productAreas.map(([title, description, href]) => (
              <article className="content-card" key={title}>
                <p className="card-label">{title}</p><h2>{title}</h2><p>{description}</p>
                <Link className="arrow-link" href={href}>Read more →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell narrow source-section">
          <Eyebrow>Primary sources</Eyebrow>
          <h2>This workflow is pinned to the released v{site.version} implementation.</h2>
          <p>
            Reviewed on 13 August 2026 against AgentSight v{site.version} at <code>{productCommit}</code>.
            The web app and portable-session boundary changed materially after v1.0.15, so use the exact
            release and source links below when a deployment or audit depends on a specific version.
          </p>
          <ul>{sources.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
        </div>
      </section>
    </SiteShell>
  );
}
