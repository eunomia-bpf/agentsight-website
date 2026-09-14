import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = 'bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const articlePath = '/blog/how-agentsight-normalizes-agent-session-data/';

export const metadata: Metadata = {
  title: 'How AgentSight normalizes local agent transcripts into one session model',
  description:
    'A source-level guide to AgentSight v1.0.31 agent-session normalization: prompts, tool effects, files, model responses, token usage, plans, provider identity, and the fields the IR refuses to invent.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight normalizes local agent transcripts into one session model',
    description:
      'Follow Claude Code, Codex, Gemini CLI, and Cursor transcript data into AgentSight’s vendor-neutral AgentSession and SessionEvents IR without flattening away source identity.',
    url: articlePath,
  },
};

const sources = [
  ['AgentSight v1.0.31 agent-session responsibilities and non-goals', `${productSource}/docs/agent-session.md`],
  ['AgentSight v1.0.31 portable session model overview', `${productSource}/ext/session/README.md`],
  ['AgentSight v1.0.31 AgentSession, SessionEvents, ToolEvent, and LlmResponse types', `${productSource}/ext/session/src/types.rs`],
  ['AgentSight v1.0.31 provider discovery and parser dispatch', `${productSource}/ext/session/src/parser.rs`],
  ['AgentSight v1.0.31 process-tree-to-session matching', `${productSource}/ext/session/src/process_match.rs`],
  ['agentpprof reuse of agent-session prompt, tool, and response types', `${productSource}/ext/pprof/src/session.rs`],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function AgentSessionNormalizationArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight normalizes local agent transcripts into one session model',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-09-14',
    dateModified: '2026-09-14',
    author: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
    publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
  };

  return (
    <SiteShell>
      <JsonLd value={jsonLd} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <Link href="/blog/">Blog</Link>
            <span aria-current="page">Agent session normalization</span>
          </nav>
          <Eyebrow>Native session internals · AgentSight v1.0.31 · 14 September 2026</Eyebrow>
          <h1>How AgentSight normalizes local agent transcripts into one session model</h1>
          <p className="hero-lede">
            Claude Code, Codex, Gemini CLI, and Cursor do not write the same transcript format. AgentSight’s
            <code> agent-session </code> library converts supported local records into one Rust intermediate representation so
            reports, flamegraphs, the web UI, and other consumers can reason about prompts, model responses, tool effects,
            paths, tokens, plans, and session identity without each consumer reimplementing every provider parser. The useful
            part is not just the common schema: v1.0.31 also keeps source identity and leaves fields empty when the native log
            does not establish them.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer</h2>
              <p>
                The native-session path has two separate jobs. Discovery locates provider-owned transcript files. Parsing then
                turns a selected file into <code>AgentSession</code>: session metadata plus normalized <code>SessionEvents</code>.
                In v1.0.31, the parser dispatches Gemini to its JSON parser, Cursor to a JSONL parser that can include subagent
                transcripts, and Claude/Codex through the JSONL path. Provider-specific syntax stays inside the parser; the
                consumer receives one model.
              </p>
              <p>
                This is intentionally not an OpenTelemetry data model and not an eBPF event model. The crate documentation
                calls <code>agent-session</code> a local IR and explicitly excludes OTLP export, UI rendering, database schema,
                and eBPF capture. Consuming applications can map the IR into SQLite, OpenTelemetry, reports, or other outputs;
                the parser itself does not pretend a provider transcript already contains host-level evidence it never recorded.
              </p>
            </section>

            <section>
              <h2>What the common IR actually preserves</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '850px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr><th style={header}>IR object</th><th style={header}>Examples of preserved fields</th><th style={header}>Why it matters</th></tr>
                  </thead>
                  <tbody>
                    <tr><td style={cell}><code>AgentSession</code></td><td style={cell}>agent type, session/display/conversation IDs, source path, start/end time, model, aggregate usage, cwd, duration, last-message time</td><td style={cell}>Keeps provider identity and session provenance around the normalized events.</td></tr>
                    <tr><td style={cell}><code>UserPrompt</code></td><td style={cell}>prompt index, timestamp, text hash, full authorized text, preview, semantic tag, task path</td><td style={cell}>Lets consumers refer to one user turn without reducing it to a display string.</td></tr>
                    <tr><td style={cell}><code>ToolEvent</code></td><td style={cell}>tool name/category, command/effect, process chain, status, paths, domains, call ID, active skill and task path</td><td style={cell}>Separates a tool invocation from the files or destinations the native record attributes to it.</td></tr>
                    <tr><td style={cell}><code>LlmResponse</code></td><td style={cell}>prompt index, model, source completion ID, text/hash/preview, token components, response phase, skill and task path</td><td style={cell}>Preserves response identity and source lifecycle information when the provider records it.</td></tr>
                    <tr><td style={cell}><code>PlanStep</code></td><td style={cell}>step text and status</td><td style={cell}>Carries the latest source-recorded coding plan without inferring an unseen planner state.</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>Normalization is not the same as erasing provider identity</h2>
              <p>
                <code>AgentSession.agent_type</code> remains part of every parsed session, and the object retains the native
                source path plus provider-derived session and conversation identifiers. That is important because two fields
                with the same normalized name can have different source semantics. A real Codex thread ID, for example, is
                stronger conversation evidence than a value guessed from a filename or response identifier.
              </p>
              <p>
                The crate’s OTel-alignment note makes this rule explicit: names such as <code>agent_type</code>,
                <code>conversation_id</code>, and aggregate <code>usage</code> are chosen when they fit, but
                <code>conversation_id</code> is left unset when the native log has no real session/thread identifier. A common
                schema is useful only if “missing” still means “the source did not establish this,” rather than “the parser
                invented a plausible value.”
              </p>
            </section>

            <section>
              <h2>Prompt indexes are the local join key for interaction events</h2>
              <p>
                Prompts, tool events, and model responses all carry a prompt index. That gives downstream analysis a bounded
                way to group activity around the user turn that was active when the source recorded it. The prompt object also
                has a stable <code>prompt_key()</code> built from the index and text hash, so a consumer can identify a prompt
                without using raw prompt text as the key.
              </p>
              <p>
                This is different from claiming perfect causal tracing. A native transcript records the relationships its agent
                exposes. The IR can preserve those relationships and make them comparable, but it cannot reconstruct an
                unrecorded scheduler decision or prove that every child process and filesystem effect belongs to a tool call.
                Independent system capture remains a separate evidence source for those questions.
              </p>
            </section>

            <section>
              <h2>Tool paths carry access semantics instead of becoming a flat filename list</h2>
              <p>
                The common <code>ToolPath</code> object stores the path together with an access operation. v1.0.31 documents
                normalized values including <code>read</code>, <code>write</code>, <code>create</code>, <code>delete</code>,
                <code>rename_from</code>, and <code>rename</code>. A rename can also carry its source path on the destination
                record. This avoids a common normalization mistake where “the session mentioned file X” is treated as if it
                proved a read or a write.
              </p>
              <p>
                <code>ToolEvent</code> separately preserves path groups, domains, command information, status, and a call ID
                when available. Consumers can therefore ask narrow questions—what a tool reported touching, whether it
                succeeded, or which domain it named—without collapsing those fields into one generic activity string. These
                are still native-agent observations; they are not substitutes for host-level file or socket events.
              </p>
            </section>

            <section>
              <h2>Response identity exists so split source records can be merged without guessing</h2>
              <p>
                <code>LlmResponse.source_id</code> is explicitly described as the source-native completion identity used to
                merge split JSONL records. The normalized response can also carry <code>response_phase</code> values such as
                commentary, final answer, or assistant message when the source records a lifecycle. Those details matter for
                agents that emit one logical response across several native records.
              </p>
              <p>
                Token fields stay decomposed as input, output, cache, and total counts. The helper used by profiling consumers
                drops zero or out-of-range components, uses the surviving validated components when any remain, and falls back
                to a bounded total estimate when none survives. If no usable component or total evidence exists, the profiling
                layer can mark the weight as unknown instead of turning missing usage into a fabricated zero-cost response.
              </p>
            </section>

            <section>
              <h2>One IR lets multiple consumers share parser semantics</h2>
              <p>
                The payoff is visible in <code>agentpprof</code>: its session layer aliases the shared
                <code>UserPrompt</code>, <code>ToolEvent</code>, and <code>LlmResponse</code> types from
                <code>agent-session</code> instead of defining another provider-normalization schema. The product can then build
                different projections—session listings, semantic flamegraphs, reports, or UI analysis—on top of the same native
                parsing contract.
              </p>
              <p>
                That boundary also makes parser fixes more reusable. If a provider changes how it records a tool path or model
                response, the compatibility work belongs in the provider parser and common IR mapping. A consumer should not
                need four copies of “what does this Codex/Claude/Gemini/Cursor record mean for a file write?” just to render
                four different views.
              </p>
            </section>

            <section>
              <h2>Live process matching is adjacent to the IR, not embedded in transcript parsing</h2>
              <p>
                The library also exposes process-tree-to-session matching and PID-to-session lookup. Its documentation describes
                matching with real path evidence, sticky bindings, and a recent-working-directory fallback. Keeping this beside
                the transcript parser is useful because AgentSight can associate a live process with a native session without
                changing the session schema into a process-tracing schema.
              </p>
              <p>
                The distinction is important for evidence interpretation. A parsed transcript answers “what did the native
                agent record?” Process matching answers “which live process tree most plausibly belongs to this session?” eBPF
                and other host sensors answer yet another question: “what did that process tree do at the operating-system
                boundary?” AgentSight can correlate those layers, but the common IR does not make them interchangeable.
              </p>
            </section>

            <section>
              <h2>What the session IR deliberately does not promise</h2>
              <p>
                A normalized transcript is not a packet capture, a complete syscall trace, a billing ledger, or a proof of
                policy compliance. Provider logs can omit token details, tool effects, conversation identifiers, or lifecycle
                events. A parser can faithfully preserve what exists and leave gaps explicit; it cannot recover information the
                source never wrote.
              </p>
              <p>
                This is why AgentSight benefits from keeping native-session and independent system evidence as separate layers.
                Use the normalized IR for provider-visible intent, prompts, responses, tool records, plans, and usage. Add
                system capture when the investigation needs child processes, host file operations, network destinations, or
                other effects outside the transcript boundary.
              </p>
            </section>

            <section>
              <h2>Where to go next</h2>
              <p>
                For the step before normalization—where AgentSight looks for local session files and how it bounds discovery—see
                <Link href="/blog/how-agentsight-discovers-local-agent-sessions/"> how AgentSight discovers local agent sessions</Link>.
                For the step after native usage enters reporting, see
                <Link href="/blog/how-agentsight-reconciles-token-usage/"> how overlapping token observations are reconciled</Link>.
                And for the independent host-observation boundary, read
                <Link href="/blog/system-boundary-observability/"> system-boundary observability</Link>.
              </p>
            </section>
          </article>

          <aside className="detail-aside">
            <div className="aside-card">
              <h2>Research scope</h2>
              <p>
                Source checked against AgentSight v1.0.31 commit <code>{productCommit.slice(0, 12)}</code> on 14 September
                2026. This page describes the local <code>agent-session</code> IR and parser boundary, not a guarantee that every
                provider exposes every normalized field.
              </p>
            </div>
            <div className="aside-card">
              <h2>Primary sources</h2>
              <ul className="source-list">
                {sources.map(([label, href]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </div>
            <div className="aside-card">
              <h2>Related guides</h2>
              <p><Link className="arrow-link" href="/blog/how-agentsight-discovers-local-agent-sessions/">Session discovery</Link></p>
              <p><Link className="arrow-link" href="/guides/agent-flamegraph/">Agent Flamegraph</Link></p>
              <p><Link className="arrow-link" href="/blog/system-boundary-observability/">System boundary</Link></p>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
