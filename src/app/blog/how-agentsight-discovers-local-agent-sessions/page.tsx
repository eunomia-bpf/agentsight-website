import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = 'bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const articlePath = '/blog/how-agentsight-discovers-local-agent-sessions/';

export const metadata: Metadata = {
  title: 'How AgentSight discovers local Claude, Codex, Gemini, and Cursor sessions',
  description:
    'A source-level map of AgentSight v1.0.31 local session discovery: provider roots, bounded indexing, Codex and Cursor SQLite enrichment, lazy hydration, detail limits, and missing-session diagnostics.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight discovers local Claude, Codex, Gemini, and Cursor sessions',
    description:
      'Follow AgentSight v1.0.31 from provider-native files through bounded indexing, Codex and Cursor read-only SQLite enrichment, and on-demand transcript hydration.',
    url: articlePath,
  },
};

const sources = [
  [
    'AgentSight v1.0.31 session parser: discovery roots, path classification, Cursor deduplication, and provider file formats',
    `${productSource}/ext/session/src/parser.rs`,
  ],
  [
    'AgentSight v1.0.31 native analysis source: Codex indexing, Cursor state enrichment, bounded ID lookup, caching, and hydration',
    `${productSource}/ext/analysis/src/sources/agent_native.rs`,
  ],
  [
    'AgentSight v1.0.31 README: native-session workflows and current platform boundary',
    `${productSource}/README.md`,
  ],
  [
    'AgentSight v1.0.31 usage guide: top, bind, report, and vis behavior',
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
    dateModified: '2026-09-22',
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
          <Eyebrow>Implementation map · refreshed 22 September 2026 · AgentSight v1.0.31</Eyebrow>
          <h1>How AgentSight discovers local Claude, Codex, Gemini, and Cursor sessions</h1>
          <p className="hero-lede">
            AgentSight does not depend on a universal coding-agent session API. It discovers provider-owned local state,
            builds a bounded recent-session index, enriches lightweight rows from provider databases when available, and
            hydrates the matching transcript only when detailed prompts, responses, or tool events are requested.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer</h2>
              <p>
                AgentSight v1.0.31 scans four provider-owned roots: Claude Code under <code>~/.claude/projects</code>, Codex
                under <code>$CODEX_HOME/sessions</code> or <code>~/.codex/sessions</code>, Gemini CLI under
                <code>~/.gemini/tmp</code>, and Cursor under <code>~/.cursor/projects</code>. It recognizes provider-specific
                transcript formats, orders candidates by update time, deduplicates the visible session list, and clamps the
                ordinary list path to at most 25 sessions.
              </p>
              <p>
                Two providers also have read-only database paths that avoid treating every list operation as a full transcript
                parse. Codex can use <code>state_5.sqlite</code> as a thread index. Cursor can use its local
                <code>state.vscdb</code> to enrich an already-discovered transcript with composer timestamps, model,
                workspace, and token counts. Those databases are optimizations and enrichment sources, not replacements for
                provider-owned transcript files.
              </p>
            </section>

            <section>
              <h2>What AgentSight scans before it parses anything</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '900px', fontSize: '0.92rem' }}>
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
                      <td style={cell}><code>$CODEX_HOME/sessions</code> when <code>CODEX_HOME</code> is absolute; otherwise <code>~/.codex/sessions</code></td>
                      <td style={cell}>JSONL beneath <code>.codex</code>; <code>state_5.sqlite</code> can provide the recent-thread index.</td>
                      <td style={cell}>The scanner extracts <code>session_meta.id</code> from a bounded header; the SQLite path already supplies the thread ID.</td>
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
                      <td style={cell}>JSONL under <code>agent-transcripts</code>, plus sibling subagent JSONL files</td>
                      <td style={cell}>The parent transcript file stem is the composer/session ID; duplicate candidates are collapsed.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Path ownership and format are part of classification. AgentSight does not recursively treat every JSON or
                JSONL file in the home directory as agent history. That reduces false positives, but it also means an upstream
                storage-layout change can make a real provider session temporarily undiscoverable until the parser is updated.
              </p>
            </section>

            <section>
              <h2>Discovery is an index first, transcript parsing second</h2>
              <p>
                The list path is intentionally bounded. The native analysis layer asks the session cache for recent candidates,
                optionally substitutes the Codex SQLite index, sorts by update time, truncates to <code>limit.clamp(1, 25)</code>,
                removes duplicate display IDs, enriches Cursor rows, and only then applies optional PID or text filters.
              </p>
              <p>
                Direct detail lookup follows a different path so the 25-row list cap does not make an older known session
                impossible to open. AgentSight keeps an ID-to-path candidate index. If the ID is missing or its path vanished,
                it rebuilds that index from discovered session files, refreshes only the matching candidate, parses it through
                the shared cache, verifies that the parsed <code>session_id</code> still matches, and then hydrates detail.
              </p>
              <p>
                For Codex and Gemini, the ID index reads only the first 64 KiB when it needs the provider-native session ID.
                Claude and Cursor can use the file stem directly. This is a useful troubleshooting distinction: list discovery,
                ID resolution, and full transcript parsing are separate failure points.
              </p>
            </section>

            <section>
              <h2>Codex uses a read-only SQLite fast path</h2>
              <p>
                When <code>state_5.sqlite</code> is readable, AgentSight opens it with SQLite read-only flags and selects recent
                rows from <code>threads</code> ordered by <code>updated_at_ms</code>. The query reads the thread ID, rollout path,
                model, token total, preview, working directory, and created/updated timestamps. That is enough to construct a
                useful recent-session row without first parsing the whole rollout.
              </p>
              <p>
                The implementation still consults the rollout for summary fields that are not reliably represented by the
                thread row. It reads at most the final 1 MiB, extracts the latest token usage and plan information, and caches
                that summary by path, file length, and modification time. The summary cache is bounded to 64 entries and is
                cleared before accepting a new path when already full.
              </p>
              <p>
                If the Codex database is absent or cannot be opened, discovery falls back to cached transcript scanning rather
                than failing all native-session discovery. Likewise, <code>CODEX_HOME</code> is honored only when it resolves to
                an absolute path; otherwise AgentSight falls back to <code>~/.codex</code>.
              </p>
            </section>

            <section>
              <h2>Cursor has two layers: transcript discovery and state-database enrichment</h2>
              <p>
                Cursor discovery starts from <code>~/.cursor/projects</code>. A parent transcript's freshness includes the
                newest sibling <code>subagents/*.jsonl</code> modification time, so delegated work can keep the parent session
                recent. If more than one Cursor candidate has the same file stem, AgentSight prefers a candidate outside the
                special <code>empty-window</code> tree and otherwise keeps the newer candidate.
              </p>
              <p>
                After discovery, AgentSight looks for Cursor's <code>state.vscdb</code> in the standard macOS, Linux, or Windows
                application-data locations and opens the database read-only. For the matching composer ID it can use
                <code>composerHeaders</code> for created/updated timestamps and <code>cursorDiskKV</code> composer data for the
                selected model and workspace path. If those records are missing, the transcript-derived row remains usable.
              </p>
              <p>
                Token enrichment also comes from Cursor's local key-value records. AgentSight sums input and output tokens for
                the parent composer's <code>bubbleId</code> records, then rolls up the same counters for discovered subagent IDs.
                That detail matters for delegated Cursor runs: reading only the parent transcript or only the parent composer
                counters can under-report the session that delegated the work.
              </p>
            </section>

            <section>
              <h2>Hydrated detail is intentionally bounded</h2>
              <p>
                A matching transcript can still be very large, so AgentSight bounds the detail payload after hydration. v1.0.31
                retains at most 1,000 prompts, 2,000 LLM responses, and 2,000 tool events. Prompt and response text each share a
                2 MiB budget; tool command text gets 1 MiB. Per-tool process chains are capped at 16 entries, while path groups,
                paths, and domains are capped at 32 each.
              </p>
              <p>
                The truncation logic keeps the newest events and spends text budgets from newest to oldest. That makes the
                returned detail a bounded recent representation, not proof that every byte of an arbitrarily large provider
                transcript was returned. Keep the provider-native artifact when an investigation requires the complete source.
              </p>
            </section>

            <section>
              <h2>Why a local session can be missing or look incomplete</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '860px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Symptom</th>
                      <th style={header}>Implementation-level check</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>An old session is not in the normal list.</td>
                      <td style={cell}>List discovery is bounded to the requested limit and never more than 25 rows; callers can also supply a maximum-age window.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Codex sessions disappeared after moving its home.</td>
                      <td style={cell}>Verify that <code>CODEX_HOME</code> is an absolute path and that its <code>sessions</code> tree or <code>state_5.sqlite</code> remains readable.</td>
                    </tr>
                    <tr>
                      <td style={cell}>A transcript-shaped file is ignored.</td>
                      <td style={cell}>Provider path ownership and expected extension matter; an arbitrary JSON/JSONL file is not admitted as native session state.</td>
                    </tr>
                    <tr>
                      <td style={cell}>A Cursor session has no model/workspace/token enrichment.</td>
                      <td style={cell}>Transcript discovery can succeed even when <code>state.vscdb</code> is absent, unreadable, or lacks the matching composer records.</td>
                    </tr>
                    <tr>
                      <td style={cell}>A delegated Cursor run looks smaller than expected.</td>
                      <td style={cell}>Check that the sibling subagent transcripts are still present; AgentSight discovers their IDs and rolls their bubble-token counts into the parent when state records exist.</td>
                    </tr>
                    <tr>
                      <td style={cell}>A direct detail lookup returns no session.</td>
                      <td style={cell}>The indexed path must still exist, the candidate must parse, and the parsed provider session ID must exactly match the requested ID.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Start with the provider's native state and discovery root before assuming an eBPF or network problem. Local
                session discovery is a provider-state path; system capture is a separate sensor. The
                {' '}<Link href="/blog/when-agentsight-works-without-ebpf/">no-eBPF evidence guide</Link> explains when each
                boundary is useful.
              </p>
            </section>

            <section>
              <h2>Provider state is useful evidence, but it is not an independent system trace</h2>
              <p>
                Native state can be the strongest source for provider session IDs, prompts, model metadata, tool semantics,
                token fields, and plan information. It is not independent proof of every process, file, or network effect.
                A missing native row can mean a discovery/layout/parser boundary; a missing system row can mean a sampling,
                privilege, process-family, or runtime-coverage boundary. Neither absence should be promoted into a universal
                claim that an action never happened.
              </p>
              <p>
                For the normalization step after discovery, read
                {' '}<Link href="/blog/how-agentsight-normalizes-agent-session-data/">how AgentSight maps provider transcripts into one session model</Link>.
                For independent runtime evidence, see the
                {' '}<Link href="/ebpf-ai-agent-monitoring/">eBPF agent monitoring boundary map</Link>.
              </p>
            </section>

            <section>
              <h2>Primary sources and research scope</h2>
              <ul>
                {sources.map(([label, href]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
              <p>
                Research scope: AgentSight v1.0.31 at commit <code>{productCommit.slice(0, 12)}</code>, inspected on
                22 September 2026. The session-discovery implementation itself is unchanged from the v1.0.30 snapshot this
                article previously cited; this refresh re-verifies that implementation against the current release and adds
                the previously undocumented Cursor state-database enrichment and delegated-token rollup path. Provider storage
                formats can change independently, so validate newer releases against current source.
              </p>
            </section>
          </article>

          <aside className="detail-sidebar">
            <div className="sidebar-card">
              <p className="card-label">Reader decision</p>
              <h2>Debug the discovery path before the capture path.</h2>
              <p>
                If a native Claude, Codex, Gemini, or Cursor session is missing, first verify where the provider wrote state,
                whether AgentSight recognizes that format, and whether the session falls inside the bounded recent index.
              </p>
            </div>
            <div className="sidebar-card">
              <p className="card-label">New in this refresh</p>
              <h2>Cursor's transcript is only half of the index story.</h2>
              <p>
                v1.0.31 can enrich discovered Cursor sessions from a read-only local state database and include delegated
                subagent token counts when those records are available.
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
