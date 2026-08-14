import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { productCommit, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Product',
  description:
    'How AgentSight v1.0.21 moves from an organization-wide machine overview to one Node and one agent session, with source-reported usage, session analysis, and Linux system capture when needed.',
  alternates: { canonical: '/product/' },
};

const source = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;

const fleetSignals = [
  ['Machines and sessions', 'See reachable machines plus active and stopped agent sessions before choosing one Node.'],
  ['Observed usage', 'Compare reported Tokens, source-reported subscription windows, and Agent Plans without deriving provider quota from captured tokens.'],
  ['Machine resources', 'Keep CPU, RSS, process counts, and session state beside the agent work they describe.'],
] as const;

const sessionViews = [
  ['Conversation', 'Read the selected session’s user and assistant messages plus tool activity.'],
  ['Process Tree & AI Prompts', 'Connect the chosen session to its process family and captured model context.'],
  ['Analysis', 'Summarize duration, LLM turns, failures, models, tokens, tools, files, network targets, processes, resources, and an interactive event timeline.'],
] as const;

const productAreas = [
  ['Use cases', 'Start from the engineering question: slow runs, generated changes, closed-source agents, or extension audits.', '/use-cases/'],
  ['Architecture', 'Understand the Node, Direct, Controller, organization, browser aggregation, and capability boundaries.', '/architecture/'],
  ['Integrations', 'Choose the capture path that matches the agent and runtime you already use.', '/integrations/'],
  ['Compare', 'Compare AgentSight with application traces, OpenTelemetry, gateways, and hosted LLM tools.', '/compare/'],
] as const;

const sources = [
  ['AgentSight v1.0.21 release', site.releaseUrl],
  ['Agent usage, subscription metadata, and Analysis workspace (PR #179)', 'https://github.com/eunomia-bpf/agentsight/pull/179'],
  ['Multi-machine organization overview and browser-only aggregation (PR #180)', 'https://github.com/eunomia-bpf/agentsight/pull/180'],
  ['Google/GitHub provider-status visibility without hiding configuration errors (PR #184)', 'https://github.com/eunomia-bpf/agentsight/pull/184'],
  ['Current fleet overview implementation', `${source}/frontend/src/components/FleetOverview.tsx`],
  ['Current machine overview implementation', `${source}/frontend/src/components/NodeOverview.tsx`],
  ['Current session workspace implementation', `${source}/frontend/src/components/SessionWorkspace.tsx`],
  ['Portable and Linux-only command boundaries', `${source}/README.md`],
] as const;

export default function ProductPage() {
  return (
    <SiteShell>
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Product · AgentSight v{site.version}</Eyebrow>
          <h1>Start with the fleet or machine. Drill into one agent session when you need the details.</h1>
          <p className="hero-lede">
            AgentSight v{site.version} gives signed-in users an All machines organization view, while a
            Direct or local Node keeps its own machine overview. Select a Node and then a session to open
            Conversation, Process Tree &amp; AI Prompts, or Analysis. Portable agent-native history works on
            Windows, macOS, and Linux; Linux can add eBPF-backed system capture.
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
            <div><Eyebrow>All machines</Eyebrow><h2>The signed-in organization view aggregates reachable Nodes in the browser, not in a cloud telemetry database.</h2></div>
            <p>
              The current hosted app queries each reachable Node through Direct or Relay, then combines
              bounded machine overviews in browser memory. Filters and a machine selector let you move from
              the organization view to one Node without copying Node snapshots into Controller storage.
            </p>
          </div>
          <div className="card-grid">
            {fleetSignals.map(([title, description], index) => (
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
            <Eyebrow>One Node</Eyebrow>
            <h2>The machine overview stays bounded; transcript detail waits behind session selection.</h2>
            <p>
              A Node overview answers what is running, what stopped recently, how observed Tokens and
              source-reported capacity look, which Agent Plans are active, and what CPU/RSS/process shape
              the machine has. The frequent refresh path does not need to load every complete transcript.
            </p>
          </div>
          <ul className="workflow-list">
            <li><span>01</span><div><strong>Choose a machine</strong><p>Use All machines, Direct, or a local Node depending on how you connected.</p></div></li>
            <li><span>02</span><div><strong>Choose a session</strong><p>Select the task that actually needs debugging, review, or comparison.</p></div></li>
            <li><span>03</span><div><strong>Load detail</strong><p>Fetch conversation and session-scoped runtime data only for that session.</p></div></li>
          </ul>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <div className="section-heading">
            <div><Eyebrow>Session workspace</Eyebrow><h2>Three views share the same selected-session boundary.</h2></div>
            <p>
              v1.0.18 replaced separate Timeline and Detailed Events tabs with one Analysis workspace.
              Raw event detail is still available by selecting an event in the interactive timeline, while
              summary metrics stay tied to the same session rather than becoming another global dashboard.
            </p>
          </div>
          <div className="card-grid">
            {sessionViews.map(([title, description]) => (
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
            <Eyebrow>Observed Tokens versus subscription capacity</Eyebrow>
            <h2>AgentSight keeps measured usage separate from provider-reported limits.</h2>
            <p>
              The machine and fleet views can show observed token use beside source-reported subscription
              metadata when the local agent source provides it. For Codex, AgentSight allowlists fields such
              as plan type and rate-limit windows from local source-native metadata. It does not infer provider
              quota from captured token totals, and Controller does not persist these Node-provided usage details.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <p className="card-label">Keep the sources separate</p>
            <p><strong>Observed usage</strong></p><p>What AgentSight saw in the session.</p>
            <p><strong>Reported capacity</strong></p><p>What the local agent source reported about its own limit window.</p>
          </div>
        </div>
      </section>

      <section className="section section-white">
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
              Native Windows support does not add an ETW/eBPF capture backend or claim Linux tracing parity.
              The v{site.version} GitHub release publishes Linux x86_64 and aarch64 binaries; Windows builds are
              exercised by CI and can be built from source or obtained as CI artifacts rather than a release asset.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <p className="card-label">Choose by question</p>
            <p><strong>Session history</strong></p><p>Start with the portable agent-native source.</p>
            <p><strong>Host effects</strong></p><p>On Linux, add system capture when the transcript cannot answer the question.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell split-section">
          <div>
            <Eyebrow>Live Node versus saved capture</Eyebrow>
            <h2>A saved database is useful history, but it is not a live machine.</h2>
            <p>
              A live Node can provide current machine state, fresh session detail, and supported session
              messaging. A server opened over a saved SQLite capture remains read-only and cannot expose
              live state that was not present in the saved artifact.
            </p>
            <p>
              Unassigned saved, demo, or live runtime data remains useful through recorded-capture views,
              but negative claims should stay bounded by the source actually opened.
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
            <h2>Direct and Controller relay are transports to Nodes, not new session databases.</h2>
            <p>
              Direct requests travel browser to Node. Controller relay remains an optional managed path.
              The hosted app can aggregate bounded Node overviews in browser memory, while Controller keeps
              identity, organizations, machine directory, connectivity, and access policy. Architecture owns
              the exact data and trust boundary.
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
        <div className="shell split-section">
          <div>
            <Eyebrow>Hosted sign-in status</Eyebrow>
            <h2>Supported sign-in choices stay visible even when a provider is not configured.</h2>
            <p>
              v1.0.21 keeps GitHub and Google entries visible when hosted sign-in is available. If a provider
              is not configured on Controller, the UI disables it and explains the configuration state instead
              of silently removing it. A Controller provider-status failure is surfaced as an error. This does
              not claim that every deployment has both providers configured.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <a className="button button-accent" href={site.demo}>Open the hosted app</a>
            <a className="button button-outline" href="/architecture/">Read the architecture</a>
          </div>
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
            Reviewed on 14 August 2026 against AgentSight v{site.version} at <code>{productCommit}</code>.
            The fleet, usage, and session-analysis surfaces changed materially after v1.0.17, so use the
            exact release and source links below when a deployment or audit depends on a specific version.
          </p>
          <ul>{sources.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
        </div>
      </section>
    </SiteShell>
  );
}
