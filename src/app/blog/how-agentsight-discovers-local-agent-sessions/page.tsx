import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const articlePath = '/blog/how-agentsight-discovers-local-agent-sessions/';

export const metadata: Metadata = {
  title: 'How AgentSight discovers local Claude, Codex, Gemini, Cursor, and CodeBuddy sessions',
  description:
    'A v1.0.35 source-and-test-backed guide to five native agent session sources: CodeBuddy CLI transcript discovery, usage and tool-status parsing, Codex/Cursor indexing, and evidence limits.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight discovers local Claude, Codex, Gemini, Cursor, and CodeBuddy sessions',
    description:
      'Follow five agent-native session paths in v1.0.35, including CodeBuddy CLI project JSONL, optional storage overrides, token usage and tool results, and bounded details.',
    url: articlePath,
  },
};

const sources = [
  [
    'AgentSight v1.0.35 session parser and CodeBuddy regression fixtures: roots, path rules, usage and tool outcomes',
    `${productSource}/ext/session/src/parser.rs`,
  ],
  [
    'AgentSight v1.0.35 native analysis: Codex/Cursor indexing, bounded ID lookup, caching, and hydration',
    `${productSource}/ext/analysis/src/sources/agent_native.rs`,
  ],
  [
    'AgentSight v1.0.35 README: native-session workflows and current platform boundary',
    `${productSource}/README.md`,
  ],
  [
    'AgentSight v1.0.35 usage guide: top, bind, report, and vis behavior',
    `${productSource}/docs/usage.md`,
  ],
  [
    'AgentSight v1.0.35 CodeBuddy CLI: read-only native history versus separate Node process/TLS capture',
    `${productSource}/docs/agents.md`,
  ],
  [
    'AgentSight v1.0.35 release, confirming the pinned behavior is shipped',
    'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35',
  ],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function LocalSessionDiscoveryArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight discovers local Claude, Codex, Gemini, Cursor, and CodeBuddy sessions',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-08-31',
    dateModified: '2026-11-23',
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
          <Eyebrow>Implementation map · refreshed 23 November 2026 · AgentSight v1.0.35</Eyebrow>
          <h1>How AgentSight discovers local Claude, Codex, Gemini, Cursor, and CodeBuddy sessions</h1>
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
                AgentSight v1.0.35 scans five provider-owned roots: Claude Code under <code>~/.claude/projects</code>,
                Codex under <code>$CODEX_HOME/sessions</code> or <code>~/.codex/sessions</code>, Gemini CLI under
                <code>~/.gemini/tmp</code>, Cursor under <code>~/.cursor/projects</code>, and CodeBuddy CLI under
                <code>~/.codebuddy/projects</code> or an absolute <code>CODEBUDDY_CONFIG_DIR</code> override. Discovery
                recognizes provider-specific transcripts, orders candidates by freshness, and bounds the normal list to
                at most 25 sessions. It is not a generic recursive scanner of every JSONL file on disk.
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
                    <tr>
                      <td style={cell}>CodeBuddy CLI</td>
                      <td style={cell}><code>~/.codebuddy/projects</code> or an absolute <code>CODEBUDDY_CONFIG_DIR/projects</code></td>
                      <td style={cell}>Project <code>.jsonl</code> session transcripts; <code>history.jsonl</code> is not a session</td>
                      <td style={cell}>Project transcript file stem, checked against the parsed source session ID when hydrating detail.</td>
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
                Claude, Cursor, and CodeBuddy can use the transcript file stem directly. This is a useful troubleshooting distinction: list discovery,
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
              <h2>CodeBuddy CLI: why a fifth provider needs its own parser</h2>
              <p>
                CodeBuddy CLI is a Node.js command-line agent, not the CodeBuddy IDE plugin. In the pinned
                v1.0.35 <a href={productSource + '/ext/session/src/parser.rs'}>native session parser</a>, discovery walks
                <code> ~/.codebuddy/projects</code> by default and recognizes project <code>.jsonl</code> transcripts.
                <code> CODEBUDDY_CONFIG_DIR</code> substitutes a different home only when it is an absolute path.
                A relative value falls back to <code>~/.codebuddy</code>, as a source regression test confirms.
                The separate <code>~/.codebuddy/history.jsonl</code> is a prompt index, not a session transcript;
                counting its entries as agent sessions would inflate activity.
              </p>
              <p>
                A project JSONL file is only a <em>candidate</em>. The CodeBuddy-specific parser recognizes
                <code> message</code>, <code>ai-title</code>, <code>summary</code>, and
                <code> turn-metrics</code> records. It reads user turns, model messages, tool calls, tool results,
                timestamps and available token usage into the shared session representation.
                A file containing only <code>session-meta</code> is rejected as an empty session.
                This differs from simply displaying any file discovered beneath a provider directory.
              </p>
              <h3>Which CodeBuddy fields survive normalization?</h3>
              <div style={{ overflowX: 'auto', margin: '1.25rem 0' }}>
                <table style={{ width: '100%', minWidth: '820px', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr><th style={header}>Source record</th><th style={header}>AgentSight interpretation</th><th style={header}>Evidence boundary</th></tr>
                  </thead>
                  <tbody>
                    <tr><td style={cell}><code>sessionId</code>, numeric <code>timestamp</code>, <code>cwd</code></td><td style={cell}>Provider session identity, millisecond clock and working directory</td><td style={cell}>The file's existence does not prove the parsed transcript has a valid task</td></tr>
                    <tr><td style={cell}><code>providerData.rawUsage</code>, <code>providerData.usage</code>, message <code>usage</code></td><td style={cell}>Preferred token fields with fallbacks; separate cache creation/read counters when present</td><td style={cell}>Missing provider usage is not a measured zero-cost call; fields are provider-reported</td></tr>
                    <tr><td style={cell}>Assistant <code>tool_use</code> or <code>function_call</code></td><td style={cell}>Tool name, call ID, command/path hints and source timestamp</td><td style={cell}>An invocation is not independent proof of an executed file operation</td></tr>
                    <tr><td style={cell}>User <code>tool_result</code> linked by <code>tool_use_id</code></td><td style={cell}>A matching result changes tool status to <code>ok</code> or <code>fail</code> from <code>is_error</code></td><td style={cell}>Unmatched calls remain observed, not proven successful</td></tr>
                    <tr><td style={cell}><code>turn-metrics.durationMs</code>, <code>ai-title</code>, <code>summary</code></td><td style={cell}>Accumulated reported duration and optional human-readable preview</td><td style={cell}>These are transcript fields, not host CPU measurements</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                The implementation prefers <code>rawUsage.prompt_tokens</code> and
                <code>completion_tokens</code> when available, then checks camel-case provider usage and finally the
                message usage object. Cache creation and cache read counts remain separate in session aggregates.
                Tool-result status is applied only when its call ID matches an earlier Tool event.
                An empty assistant message after a completed tool sequence does not generate a fake LLM response.
              </p>
            </section>
            <section>
              <h2>Reproducibility: what the CodeBuddy tests establish</h2>
              <p>
                The <a href={productSource + '/ext/session/src/parser.rs'}>pinned Rust regression tests</a>
                <code> codebuddy_parser_reads_numeric_timestamps_usage_and_tools</code>,
                <code> codebuddy_session_meta_only_is_not_a_session</code>,
                <code> codebuddy_discovery_finds_project_jsonl_and_skips_history</code>, and
                <code> codebuddy_empty_assistant_after_tools_does_not_emit_blank_response</code>
                cover four different gates. The synthetic fixture has one user prompt, one assistant response and one
                Read invocation, with reported <code>36,149</code> input tokens, <code>18</code> output tokens,
                <code>31,864</code> cache-creation tokens and <code>4,277 ms</code> turn duration.
                Those are fixed test inputs and assertions, <strong>not customer usage, a runtime benchmark,
                or a real captured session</strong>.
              </p>
              <p>
                To audit a build, inspect the tag and its fixtures before running the session tests in a
                disposable environment. A source-level inspection requiring no private transcripts is:
              </p>
              <pre style={{ overflowX: 'auto' }}><code>{[
                'git clone https://github.com/eunomia-bpf/agentsight.git',
                'cd agentsight',
                'git checkout c1574366122a90c451bca6a84713e28813ab95e2',
                'rg -n "AGENT_CODEBUDDY|configured_codebuddy_home|parse_codebuddy_jsonl" ext/session/src/parser.rs',
                'rg -n "fn codebuddy_.*|fn relative_codebuddy_home" ext/session/src/parser.rs',
                'rg -n "CodeBuddy CLI|CODEBUDDY_CONFIG_DIR|history.jsonl" docs/agents.md',
              ].join('\n')}</code></pre>
              <p>
                If CodeBuddy appears in <code>agentsight top</code> but the session is incomplete, first confirm the
                CLI's project JSONL and provider schema. <code>agentsight report --local</code> is a native-history
                path, whereas <code>sudo agentsight record -c codebuddy</code> uses separate Linux process/TLS sensors.
                The CLI's Node process name need not be <code>codebuddy</code>; the source documents command-line
                process matching and an SSL filter exception. Neither mode proves that every file/network effect was
                captured, and the IDE plugin is out of scope. Sensitive prompts, file paths and tool arguments
                remain local evidence; do not post raw session transcripts publicly for debugging.
              </p>
            </section>

            <section>
              <h2>Hydrated detail is intentionally bounded</h2>
              <p>
                A matching transcript can still be very large, so AgentSight bounds the detail payload after hydration. v1.0.35
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
                      <td style={cell}>CodeBuddy CLI history seems empty or over-counted.</td>
                      <td style={cell}>Check the absolute <code>CODEBUDDY_CONFIG_DIR</code> override, <code>projects/*.jsonl</code>, and exclude the prompt-only <code>history.jsonl</code>. A metadata-only transcript does not make a parsed session.</td>
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
                Research scope: released AgentSight v1.0.35 at commit <code>{productCommit.slice(0, 12)}</code>,
                inspected on 23 November 2026. This is a major evergreen refresh of the existing discovery guide, adding
                CodeBuddy CLI source classification, parser evidence, field-level mapping, reproducible fixture assertions,
                and native-versus-system capture limits. Existing Codex/Cursor details remain implementation-scoped;
                provider storage formats can change independently. No new runtime measurement was performed.
              </p>
            </section>
          </article>

          <aside className="detail-sidebar">
            <div className="sidebar-card">
              <p className="card-label">Reader decision</p>
              <h2>Debug the discovery path before the capture path.</h2>
              <p>
                If a native Claude, Codex, Gemini, Cursor, or CodeBuddy CLI session is missing, first verify where the provider wrote state,
                whether AgentSight recognizes that format, and whether the session falls inside the bounded recent index.
              </p>
            </div>
            <div className="sidebar-card">
              <p className="card-label">New in this refresh</p>
              <h2>CodeBuddy CLI is an additional native-history source.</h2>
              <p>
                v1.0.35 reads CodeBuddy project JSONL, but filters prompt-only history and rejects metadata-only files.
                Tool results and token fields are provider-reported evidence, not independent system observations.
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
