import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = '934f441eff8ca210807333633f47b2efcb8cd020';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const articlePath = '/blog/how-agentsight-discovers-local-agent-sessions/';

export const metadata: Metadata = {
  title: 'How AgentSight discovers local Claude, Codex, Gemini, and Cursor sessions',
  description:
    'A source-level map of AgentSight v1.0.30 local session discovery: provider directories, Codex SQLite indexing, session IDs, caching, Cursor subagents, lazy hydration, and why a session can be missing.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight discovers local Claude, Codex, Gemini, and Cursor sessions',
    description:
      'Follow AgentSight v1.0.30 from provider-native files and Codex state_5.sqlite to a bounded local session index and on-demand transcript hydration.',
    url: articlePath,
  },
};

const sources = [
  [
    'AgentSight v1.0.30 session parser: discovery roots, path classification, Cursor deduplication, and session-file formats',
    `${productSource}/ext/session/src/parser.rs`,
  ],
  [
    'AgentSight v1.0.30 native analysis source: Codex SQLite preference, bounded indexing, ID resolution, caching, and lazy detail hydration',
    `${productSource}/ext/analysis/src/sources/agent_native.rs`,
  ],
  [
    'AgentSight v1.0.30 README: native-session workflows and current platform boundary',
    `${productSource}/README.md`,
  ],
  [
    'AgentSight v1.0.30 usage guide: top, bind, report, and vis behavior',
    `${productSource}/docs/usage.md`,
  ],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function LocalSessionDiscoveryArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight discovers local Claude, Codex, Gemini, and Cursor sessions',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-08-31',
    dateModified: '2026-08-31',
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
            <span aria-current="page">Local session discovery</span>
          </nav>
          <Eyebrow>Implementation map · AgentSight v1.0.30 · 31 August 2026</Eyebrow>
          <h1>How AgentSight discovers local Claude, Codex, Gemini, and Cursor sessions</h1>
          <p className="hero-lede">
            AgentSight does not ask each coding agent for a universal session API. In v1.0.30 it discovers the local
            state each supported agent already writes, builds a bounded index, and only hydrates full transcript detail
            when a caller needs it. Codex has an extra fast path through its read-only <code>state_5.sqlite</code> index.
            The implementation details explain both why native-session workflows are fast and why a session can be absent.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer</h2>
              <p>
                AgentSight v1.0.30 scans four provider-owned roots: Claude Code under <code>~/.claude/projects</code>, Codex
                under <code>$CODEX_HOME/sessions</code> or <code>~/.codex/sessions</code>, Gemini CLI under
                <code>~/.gemini/tmp</code>, and Cursor under <code>~/.cursor/projects</code>. It recognizes provider-specific
                transcript formats, caches parsed candidates, deduplicates the visible session list, and limits ordinary
                discovery to the newest 25 sessions.
              </p>
              <p>
                Codex is different when <code>state_5.sqlite</code> exists. AgentSight opens that database read-only, queries
                the newest thread records, and uses the recorded rollout path, model, token count, preview, working
                directory, and timestamps as a lightweight index. Full rollout events remain lazy: AgentSight reads only a
                bounded tail for summary metadata and parses the complete matching transcript only when detail is requested.
              </p>
            </section>

            <section>
              <h2>What AgentSight scans</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '860px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Agent</th>
                      <th style={header}>Discovery root</th>
                      <th style={header}>Recognized transcript</th>
                      <th style={header}>Session-ID path</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>Claude Code</td>
                      <td style={cell}><code>~/.claude/projects</code></td>
                      <td style={cell}>JSONL beneath <code>.claude</code></td>
                      <td style={cell}>The transcript file stem is the session ID.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Codex</td>
                      <td style={cell}><code>$CODEX_HOME/sessions</code> when <code>CODEX_HOME</code> is an absolute path; otherwise <code>~/.codex/sessions</code></td>
                      <td style={cell}>JSONL beneath <code>.codex</code>; current Codex can also be indexed through <code>state_5.sqlite</code>.</td>
                      <td style={cell}>The scanner reads the bounded header and extracts the <code>session_meta.id</code>; the SQLite fast path already supplies the thread ID.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Gemini CLI</td>
                      <td style={cell}><code>~/.gemini/tmp</code></td>
                      <td style={cell}>JSON session files beneath <code>.gemini</code></td>
                      <td style={cell}>The bounded JSON header supplies <code>sessionId</code>.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Cursor</td>
                      <td style={cell}><code>~/.cursor/projects</code></td>
                      <td style={cell}>JSONL under an <code>agent-transcripts</code> path, including subagent activity</td>
                      <td style={cell}>The parent transcript file stem is the session ID; duplicate candidates are collapsed.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                These are implementation paths, not a compatibility promise for every future upstream release. AgentSight
                deliberately classifies files by both provider-owned path and expected format rather than treating every
                JSON or JSONL file in a home directory as a session.
              </p>
            </section>

            <section>
              <h2>Discovery is an index first, transcript parsing second</h2>
              <p>
                A naive implementation could fully parse every historical transcript on every <code>top</code> or browser
                request. v1.0.30 avoids that. The native analysis layer keeps a session cache and first builds a candidate
                list ordered by update time. Ordinary list discovery is clamped to at most 25 sessions. It then removes
                duplicate display IDs, enriches Cursor entries, applies optional PID/text filters, and returns the bounded
                list.
              </p>
              <p>
                Detail lookup uses a separate ID-to-path index. When a requested ID is not already present—or its stored
                path disappeared—the index is rebuilt from discovered session files. Only the matching candidate is
                refreshed and parsed. AgentSight checks that the parsed transcript still reports the requested session ID
                before returning it. This makes detail lookup an exact match rather than “the newest file that looks close.”
              </p>
            </section>

            <section>
              <h2>Why Codex gets a SQLite fast path</h2>
              <p>
                When <code>~/.codex/state_5.sqlite</code> is readable, AgentSight opens it with SQLite read-only flags and
                queries the <code>threads</code> table ordered by <code>updated_at_ms</code>. The selected fields include the
                thread ID, rollout path, model, source-reported token total, preview, working directory, and timestamps.
                That is enough to construct a useful session row without initially parsing the entire rollout file.
              </p>
              <p>
                For summary metadata that is not already in SQLite, the implementation reads at most the final 1 MiB of the
                rollout. A cache keyed by file path, length, and modification time avoids re-reading an unchanged tail. If
                callers later ask for prompts, LLM responses, or tool events, <code>hydrate_session</code> parses the matching
                rollout and merges the richer events back into the indexed record.
              </p>
              <p>
                If the Codex state database is absent or cannot be opened, discovery does not fail globally. AgentSight
                falls back to the same cached transcript discovery used for the other providers.
              </p>
            </section>

            <section>
              <h2>Cursor needs special handling for subagents and duplicate windows</h2>
              <p>
                Cursor's parent transcript is not always the only file whose modification time matters. For a Cursor
                candidate, AgentSight also inspects sibling <code>subagents/*.jsonl</code> files and treats the newest child
                modification as part of the parent session's update time. That keeps a parent session fresh when work
                continues in a subagent transcript.
              </p>
              <p>
                Cursor discovery can also produce more than one candidate with the same file stem. The deduplication pass
                prefers a candidate outside the special <code>empty-window</code> tree and otherwise chooses the newer
                candidate. This is provider-specific normalization, not a generic “same filename means same conversation”
                rule applied across agents.
              </p>
            </section>

            <section>
              <h2>Detail responses are bounded even after hydration</h2>
              <p>
                Lazy parsing prevents unnecessary work, but a single giant transcript can still be expensive to return.
                v1.0.30 therefore bounds hydrated detail. It retains at most 1,000 prompt events, 2,000 LLM responses, and
                2,000 tool events. Prompt and response text each get a 2 MiB budget; tool command text gets 1 MiB. Per-tool
                process chains and path/domain collections are also capped before a session detail leaves the analysis
                layer.
              </p>
              <p>
                These limits matter when using native sessions as evidence. A detail view is intentionally the bounded,
                recent representation AgentSight exposes—not an assertion that every byte of an arbitrarily large provider
                history was returned. Keep the provider-native file if an investigation requires the complete original
                transcript.
              </p>
            </section>

            <section>
              <h2>Why a local session can be missing</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '820px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Symptom</th>
                      <th style={header}>Implementation-level explanation to check</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>An old session is not in the normal list.</td>
                      <td style={cell}>List discovery is intentionally bounded to the newest 25 candidates and applies a maximum-age window supplied by the caller.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Codex sessions disappeared after moving its home.</td>
                      <td style={cell}>AgentSight honors <code>CODEX_HOME</code> only when it is an absolute path; otherwise it falls back to <code>~/.codex</code>.</td>
                    </tr>
                    <tr>
                      <td style={cell}>A transcript-shaped file is ignored.</td>
                      <td style={cell}>Path ownership and extension both matter: Claude/Codex expect JSONL, Gemini expects JSON, and Cursor expects JSONL under <code>agent-transcripts</code>.</td>
                    </tr>
                    <tr>
                      <td style={cell}>A Cursor duplicate is not shown twice.</td>
                      <td style={cell}>Cursor candidates with the same stem are intentionally deduplicated, preferring non-empty and newer windows.</td>
                    </tr>
                    <tr>
                      <td style={cell}>A direct detail lookup returns no session.</td>
                      <td style={cell}>The indexed path must still exist, the candidate must parse, and the parsed session ID must exactly match the requested ID.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The first troubleshooting step is therefore to check the provider's native state and the exact discovery
                root before assuming an eBPF or network problem. Local-session discovery is a filesystem/provider-state
                path; eBPF recording is a separate sensor. The
                {' '}<Link href="/blog/when-agentsight-works-without-ebpf/">no-eBPF evidence guide</Link> explains when to
                use each mode.
              </p>
            </section>

            <section>
              <h2>Discovery does not make provider state an independent system trace</h2>
              <p>
                This index is useful because provider-native state can be authoritative for session IDs, prompts, token
                fields, model metadata, and native tool records. It is not independent proof of every process, file, or
                network effect produced by the run. When that distinction matters, preserve the row provenance and combine
                the right sensors rather than promoting native transcript data into kernel evidence.
              </p>
              <p>
                For row-level lineage and confidence semantics, see the
                {' '}<Link href="/blog/read-agentsight-audit-provenance/">audit provenance guide</Link>. For Docker-backed
                native discovery, where the same local logic runs inside a named container through a bounded bridge, see
                {' '}<Link href="/blog/observe-ai-agent-sessions-in-docker/">the Docker session architecture guide</Link>.
              </p>
            </section>

            <section>
              <h2>Primary sources</h2>
              <ul>
                {sources.map(([label, href]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
              <p>
                Research scope: AgentSight v1.0.30 at commit <code>{productCommit.slice(0, 12)}</code>, inspected on
                31 August 2026. Provider storage formats can change independently; use the current AgentSight repository
                when validating a newer release.
              </p>
            </section>
          </article>

          <aside className="detail-sidebar">
            <div className="sidebar-card">
              <p className="card-label">Reader decision</p>
              <h2>Debug the discovery path before the capture path.</h2>
              <p>
                If a native Claude, Codex, Gemini, or Cursor session is missing, first verify where that provider wrote its
                state, whether AgentSight recognizes that format, and whether the session falls inside the bounded index.
              </p>
            </div>
            <div className="sidebar-card">
              <p className="card-label">Related boundary</p>
              <h2>Need independent system evidence?</h2>
              <p>Native-session discovery and eBPF recording are complementary sensors, not two strengths of the same trace.</p>
              <Link className="arrow-link" href="/blog/when-agentsight-works-without-ebpf/">Choose the evidence mode</Link>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
