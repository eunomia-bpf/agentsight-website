import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = 'bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const articlePath = '/blog/how-agentsight-reconciles-token-usage/';

export const metadata: Metadata = {
  title: 'How AgentSight reconciles overlapping token usage',
  description:
    'A source-level guide to AgentSight token accounting, adding a v1.0.35 Codex mixed-rollout study of cumulative versus per-response usage, live totals, cache attribution, and limitations.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight reconciles overlapping token usage',
    description:
      'Trace token reconciliation and the v1.0.35 Codex mixed-rollout fix with a reproducible case matrix: stale cumulative totals, response usage, cache accounting, and evidence limits.',
    url: articlePath,
  },
};

const sources = [
  ['AgentSight v1.0.31 report CLI and DB/native-session selection', `${productSource}/collector/src/main.rs`],
  ['AgentSight v1.0.31 report loader and token-query path', `${productSource}/collector/src/cli_db.rs`],
  ['AgentSight v1.0.31 effective-token reconciliation and grouping', `${productSource}/ext/analysis/src/view/mod.rs`],
  ['AgentSight v1.0.31 native-session discovery and Codex state database path', `${productSource}/ext/analysis/src/sources/agent_native.rs`],
  ['AgentSight v1.0.31 native-session parsers and Codex token-count extraction', `${productSource}/ext/session/src/parser.rs`],
  ['AgentSight v1.0.31 agent-session normalization contract', `${productSource}/docs/agent-session.md`],
  ['AgentSight v1.0.31 agent-specific notes, including Cursor token availability', `${productSource}/docs/agents.md`],
  ['AgentSight v1.0.31 user-facing report examples', `${productSource}/README.md`],
  ['AgentSight v1.0.35 Codex parser, reverse-tail usage selection and regression tests', 'https://github.com/eunomia-bpf/agentsight/blob/c1574366122a90c451bca6a84713e28813ab95e2/ext/session/src/parser.rs'],
  ['Codex cumulative-usage regression and first-party validation, PR #224', 'https://github.com/eunomia-bpf/agentsight/pull/224'],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function TokenReconciliationArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight reconciles overlapping token usage',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-09-11',
    dateModified: '2026-10-25',
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
            <span aria-current="page">Token reconciliation</span>
          </nav>
          <Eyebrow>Token accounting internals · v1.0.31 baseline, v1.0.35 Codex update · 25 October 2026</Eyebrow>
          <h1>How AgentSight reconciles overlapping token usage</h1>
          <p className="hero-lede">
            <code>agentsight report token</code> does not blindly sum every token-looking row that AgentSight has seen.
            A recorded run can contain network response usage, orphan response usage, CLI statistics, telemetry, and
            agent-native session data. AgentSight applies a keyed effective-token selection plus a separate Gemini
            aggregate rule before it groups report rows. Those rules remove several important overlap cases, but they are
            not a universal cross-source join—and that boundary matters when you interpret a total.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer</h2>
              <p>
                In v1.0.31, the token report is a projection over AgentSight&apos;s materialized view. If you point the report
                at a saved SQLite capture, it loads that run. With no explicit DB, AgentSight chooses the latest local
                <code>agentsight-*.db</code>; if none exists, it warns and falls back to recent agent-native sessions.
                <code>--local</code> forces the native-session path.
              </p>
              <p>
                The report then calls <code>effective_tokens()</code> before aggregation. That function performs two kinds of
                reconciliation: source precedence for rows that resolve to the same selection key, and a special Gemini
                network-versus-stdout aggregate rule. Only the resulting effective rows feed the
                model/provider/process/directory summaries.
              </p>
            </section>

            <section>
              <h2>Raw token rows and report totals are different objects</h2>
              <p>
                AgentSight can learn token usage at several boundaries. A captured model response can carry provider usage.
                An otherwise unpaired response can still expose usage. Gemini CLI can print aggregate statistics. Claude
                telemetry can contain usage. Local agent transcripts can contribute session-level usage. Keeping these as
                separate observations preserves provenance, while the report layer can reconcile overlap that it can identify
                safely.
              </p>
              <p>
                The materialized view therefore keeps raw token-usage rows and derives an effective set for reporting. The
                exported snapshot summary and <code>token_summary</code> both use that effective set, so the reconciliation
                rule is shared rather than being a formatting trick specific to the CLI table.
              </p>
            </section>

            <section>
              <h2>Source precedence is keyed, not a universal join</h2>
              <p>The v1.0.31 source priority used when two rows share the same selection key is explicit:</p>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead><tr><th style={header}>Priority</th><th style={header}>Source</th><th style={header}>Interpretation</th></tr></thead>
                  <tbody>
                    <tr><td style={cell}>1</td><td style={cell}><code>response_usage</code></td><td style={cell}>Usage attached to a network-observed model response.</td></tr>
                    <tr><td style={cell}>2</td><td style={cell}><code>orphan_response_usage</code></td><td style={cell}>Response usage observed even when the normal request/call correlation is incomplete.</td></tr>
                    <tr><td style={cell}>3</td><td style={cell}><code>gemini_cli_stdout_stats</code></td><td style={cell}>Gemini CLI aggregate statistics, also subject to the separate aggregate rule below.</td></tr>
                    <tr><td style={cell}>4</td><td style={cell}><code>claude_telemetry</code></td><td style={cell}>Usage from Claude telemetry.</td></tr>
                    <tr><td style={cell}>5</td><td style={cell}>agent-native session</td><td style={cell}>Usage imported from a provider-native session.</td></tr>
                    <tr><td style={cell}>6</td><td style={cell}>other / unrecognized source</td><td style={cell}>Any source not matched by the named cases above.</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                For non-Gemini-stdout rows, the selection key is <code>llm_call_id</code> when it is non-empty; otherwise the
                row ID is used. For Gemini stdout rows, AgentSight builds a synthetic key from PID and model. Within one key,
                the lower numeric source priority wins. Equal-priority rows are broken by higher confidence and then a stable
                ID ordering.
              </p>
              <p>
                The code comment says network-observed response usage is the primary fact source and native session logs are
                intended to enrich or backfill when no network call was captured. But v1.0.31 does not generally re-key a
                native session&apos;s <code>{'{session_id}-{model}'}</code> row to a live response&apos;s call ID. If the keys differ,
                both rows can survive <code>effective_tokens()</code>. Treat source precedence as keyed de-duplication, not as
                proof that every network/native copy has been correlated and removed.
              </p>
            </section>

            <section>
              <h2>Gemini needs an aggregate-level reconciliation step</h2>
              <p>
                Gemini exposes a harder case because the same process/model pair can have per-response network usage and a CLI
                stdout total. Those two shapes are not naturally keyed to the same call. AgentSight first computes, for each
                <code>(pid, model)</code>, the sum of network response totals and the maximum observed Gemini stdout total.
              </p>
              <p>
                If the network sum is at least as large as the stdout total, the stdout aggregate is dropped. If the stdout
                total is larger, the network rows for that process/model are dropped and the largest stdout total is retained.
                Smaller intermediate stdout totals are also discarded. This rule is deliberately separate from the call-key
                precedence above: it chooses one accounting path for this Gemini aggregate instead of adding both views.
              </p>
            </section>

            <section>
              <h2>Local-session fallback changes the evidence source, not the command</h2>
              <p>
                The report loader has one important branch. A DB path loads the saved SQLite view. Without a DB, native mode
                creates an agent-native materialized view and imports a bounded set of recent sessions—25 in the current
                implementation. That makes <code>agentsight report token</code> useful even when you did not run a live eBPF
                recording first.
              </p>
              <p>
                The reusable <code>agent-session</code> layer normalizes model usage and token totals from provider-native
                histories. That does not make every agent version equally observable. For example, the current Cursor notes
                state that Cursor stopped recording per-turn usage locally around March 2026: older sessions that contain
                usage events can show token totals, while newer sessions can legitimately show none. A missing total in that
                situation is not evidence that AgentSight lost a captured response.
              </p>
            </section>

            <section>
              <h2>Codex v1.0.31 baseline: cumulative-session and response-level paths</h2>
              <p>
                Codex session JSONL contains <code>token_count</code> events. For the native session&apos;s cumulative token
                summary, v1.0.31 <code>codex_total_token_usage()</code> walks the transcript from the end and returns the latest
                <code>info.total_token_usage</code> object it can parse. It does not add every token-count event as a new
                billable increment.
              </p>
              <p>
                There is a separate response-parsing path: when AgentSight constructs the latest parsed LLM response and that
                response does not already carry a total, the parser can use <code>last_token_usage</code> as a fallback. That
                fallback does not make <code>last_token_usage</code> the cumulative native-session total. Keeping the two paths
                distinct is important when a rollout contains one shape but not the other.
              </p>
              <p>
                Codex discovery can also use <code>~/.codex/state_5.sqlite</code>. The v1.0.31 native source queries the recent
                <code>threads</code> rows, takes the source-reported <code>tokens_used</code>, and prefers a rollout-derived
                cumulative usage when the rollout summary is available. That state database is a bounded discovery/index path,
                not another token total that should be added independently to the hydrated session.
              </p>
            </section>


            <section>
              <h2>v1.0.35 update: why a live Codex token total once lagged the rollout</h2>
              <p>
                This field study updates the earlier v1.0.31 accounting analysis using
                <a href="https://github.com/eunomia-bpf/agentsight/blob/c1574366122a90c451bca6a84713e28813ab95e2/ext/session/src/parser.rs"> the v1.0.35 session parser</a>
                and the source, regressions and first-party run evidence in
                <a href="https://github.com/eunomia-bpf/agentsight/pull/224"> AgentSight PR #224</a>.
                When Codex writes both legacy <code>event_msg/token_count</code> and newer
                <code>token_usage_record</code> entries, which number should a live session show?
                It should show the latest usable <em>cumulative thread total</em>: not the sum of all usage records,
                and not an older legacy total merely because it was encountered first.
              </p>
              <p>
                Codex 0.153+ can emit <code>token_usage_record</code> entries containing
                <code>thread_token_usage</code> (cumulative) and <code>usage</code> (per-response or per-turn).
                Legacy <code>event_msg/token_count</code> events may coexist in one rollout. AgentSight has a
                forward full-session parser and a reverse-tail summary for a changing rollout. Before the correction,
                a mixed-format regression could give the tail a stale 100-token value when the full parser reported 130.
                This was a precedence bug, not evidence of a second 30-token purchase.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '800px', fontSize: '0.92rem' }}>
                  <thead><tr>
                    <th style={header}>Rollout observation, in order</th>
                    <th style={header}>Meaning</th>
                    <th style={header}>v1.0.35 selection</th>
                  </tr></thead>
                  <tbody>
                    <tr><td style={cell}>Legacy <code>total_token_usage = 100</code></td>
                      <td style={cell}>Older cumulative snapshot.</td>
                      <td style={cell}>May be superseded by a newer cumulative record.</td></tr>
                    <tr><td style={cell}>Newer <code>thread_token_usage = 130</code></td>
                      <td style={cell}>Current thread total; its adjacent <code>usage</code> is separate.</td>
                      <td style={cell}>Choose 130 for the cumulative native-session total.</td></tr>
                    <tr><td style={cell}>Trailing legacy empty cumulative object and <code>last_token_usage = 30</code></td>
                      <td style={cell}>No new usable total, only a turn-level fallback.</td>
                      <td style={cell}>Do not overwrite 130 with 30 or zero.</td></tr>
                    <tr><td style={cell}>Null/empty thread counter with nonempty <code>usage</code> or <code>turn_token_usage</code></td>
                      <td style={cell}>Response/turn usage, not proven cumulative.</td>
                      <td style={cell}>Fallback only if no stronger cumulative total exists.</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                The reverse-tail helper <code>codex_total_token_usage()</code> scans JSONL backwards. It returns
                the first valid <code>thread_token_usage</code> or legacy <code>total_token_usage</code> it finds,
                and saves per-response/turn values as weaker fallbacks. A valid token object must have
                <code>total_tokens &gt; 0</code>. The forward parser updates cumulative state when it sees a
                newer valid record, but does not let response-only usage overwrite an established thread total.
                This is a format-aware selection rule, not simply taking the maximum integer from the file.
              </p>
            </section>

            <section>
              <h2>A public, testable mixed-format example</h2>
              <p>
                The checked-in regression test builds a synthetic rollout with a legacy 100-token counter, a later
                cumulative 130-token <code>thread_token_usage</code>, and a trailing empty total plus 30-token last-turn
                field. Both full parsing and reverse-tail parsing must return <strong>130</strong>. The same fixture
                proves cache accounting: a source input count of 100 includes 4 cached tokens, so AgentSight
                normalizes the aggregate as 96 noncached input + 4 cache read + 30 output = 130 total.
              </p>
              <p>
                A second test places cumulative thread records at 15 and then 30. The correct session total is 30,
                not 45: later cumulative observations replace earlier snapshots. A third fixture keeps two
                per-response values of 15 while the cumulative thread becomes 30. Response attribution remains
                attached to its own response; the session total is not redefined by summing or substituting one
                response record. Null and empty thread counters have separate fallback tests.
              </p>
              <pre><code>
                cargo test --manifest-path ext/session/Cargo.toml codex_newer_record_updates_totals_after_token_count
                {'\n'}
                cargo test --manifest-path ext/session/Cargo.toml codex_record_response_usage_does_not_replace_thread_total
                {'\n'}
                cargo test --manifest-path ext/session/Cargo.toml codex_record_without_thread_total_uses_nonempty_fallback
              </code></pre>
              <p>
                These are public parser tests pinned to the v1.0.35 product commit, not anonymized private user
                transcripts. The source fixture also checks that <code>codex_total_token_usage(content)</code> agrees
                with the full <code>parse_session_content()</code> projection. Re-run against the pinned commit and
                inspect the exact assertions before adapting the method to a new Codex rollout format.
              </p>
            </section>

            <section>
              <h2>Compare live, saved and browser totals without treating them as separate meters</h2>
              <p>
                PR #224 documents an isolated real Codex 0.160.0 run, distinct from the synthetic fixtures.
                Its final native rollout reported <strong>87,106 tokens</strong>: 86,904 input (including 79,616
                cached) and 202 output. The PR author reports identical source totals in the served snapshot,
                <code>report summary</code> and <code>report token --json</code>; the browser rounded that to 87.1k.
                This is first-party product validation recorded by that PR, not a benchmark repeated in this article.
              </p>
              <p>
                For a session you are authorized to inspect, pin the process or session identity and compare
                <code>agentsight top --plain --once -p &lt;codex-pid&gt; --limit 20</code> with
                <code>agentsight report summary</code> and
                <code>agentsight report --local token --json</code> over the same native-session source.
                Verify the cached-input breakdown as well as the total. A process summary, a recent-local-session
                report and a SQLite-recording report can select different runs; matching model names alone do not
                make them comparable.
              </p>
              <p>
                The views agree because they can share one provider-native transcript; their agreement is useful
                for detecting parsing/projection errors, but is not an independent provider invoice or proof of
                transcript completeness. A rotated or partial rollout, missing usage fields, runtime incompatibility,
                or an incomplete capture boundary can still leave a gap. No dollar amount, quota-window usage or
                complete BPF coverage is implied by these token totals.
              </p>
              <p>
                Keep three objects distinct: <strong>the running session cumulative total</strong>,
                <strong>per-response usage</strong>, and the <strong>effective report rows</strong> after wider
                key/Gemini reconciliation. The Codex v1.0.35 change repairs the first two across mixed formats; it
                does not turn all network and native observations into one perfectly joined billing ledger.
              </p>
            </section>

            <section>
              <h2>Grouping happens after reconciliation</h2>
              <p>
                Once effective rows are selected, the token report aggregates input, output, cache-creation, cache-read, and
                total-token fields. The default key is model. <code>--group-by provider</code> groups by provider,
                <code>comm</code> by process command, <code>pid</code> by process ID, and <code>dir</code> (also
                <code>cwd</code> or <code>directory</code>) by the best available session or process working directory.
              </p>
              <p>
                Session counts are de-duplicated separately from call counts. A group can therefore represent many calls from
                one session, and the number of token observations is not itself the number of sessions. Unknown grouping
                metadata is reported as <code>unknown</code> rather than silently reassigned.
              </p>
            </section>

            <section>
              <h2>Three totals that should not be conflated</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead><tr><th style={header}>Signal</th><th style={header}>What it means</th><th style={header}>What it does not prove</th></tr></thead>
                  <tbody>
                    <tr><td style={cell}>Observed/session token usage</td><td style={cell}>Token fields exposed by the selected model-response, telemetry, CLI, or native-session evidence.</td><td style={cell}>An invoice amount or provider subscription quota.</td></tr>
                    <tr><td style={cell}>Source-reported capacity window</td><td style={cell}>Provider/agent metadata about a usage or subscription window when a supported source exposes it.</td><td style={cell}>Usage inferred from AgentSight token totals.</td></tr>
                    <tr><td style={cell}>Agent Flamegraph token width</td><td style={cell}>Offline semantic aggregation of reported token counts, with bounded estimates only when that profiling path permits them.</td><td style={cell}>A replacement for the raw report or an exact currency cost.</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                Provider pricing, cache discounts, plan credits, and subscription windows change independently from the
                accounting rows above. If you need dollars, preserve the token-kind breakdown and join it to a dated pricing
                source separately. Do not relabel <code>total_tokens</code> as cost.
              </p>
            </section>

            <section>
              <h2>A reproducible token check takes three queries</h2>
              <p>
                Start from one explicit saved run when you are debugging a recorded workload. Compare the default model view
                with provider and working-directory views, and keep JSON output when another tool will consume the result.
              </p>
              <pre><code>{`agentsight report token --db ./agentsight-run.db --json
agentsight report token --db ./agentsight-run.db --group-by provider
agentsight report token --db ./agentsight-run.db --group-by dir

# Deliberately ignore saved DBs and use supported local agent histories
agentsight report --local token --group-by model --json`}</code></pre>
              <p>
                If a total looks surprising, inspect the run&apos;s source provenance before doing arithmetic by hand. Rows that
                share a selection key can replace one another according to source priority; rows with different keys can both
                survive. Separately, Gemini stdout can replace a smaller network aggregate for the same PID/model. The useful
                debugging questions are therefore “which rows shared a key?”, “which source won that key?”, and “did the
                Gemini aggregate rule apply?”
              </p>
            </section>

            <section>
              <h2>What a zero or missing number can actually mean</h2>
              <p>
                A missing usage field can mean the provider did not persist it, the local-session format no longer includes
                it, a live capture did not observe the response boundary, or the selected source genuinely reported no value.
                These cases are not interchangeable. The effective-token rules remove overlap in the cases they explicitly
                reconcile, but they do not manufacture missing accounting or provide a universal cross-source correlation.
              </p>
              <p>
                Keep negative claims scoped to the evidence source. “This report has no token total for the session” is
                defensible. “The agent used zero tokens” usually is not unless the source contract itself establishes that.
              </p>
            </section>

            <section>
              <h2>How to verify the implementation yourself</h2>
              <p>
                Read <a href={`${productSource}/collector/src/main.rs`}><code>collector/src/main.rs</code></a> for CLI and
                DB/native selection, then <a href={`${productSource}/collector/src/cli_db.rs`}><code>cli_db.rs</code></a> for
                materialized-view loading. The keyed and Gemini reconciliation rules are in{' '}
                <a href={`${productSource}/ext/analysis/src/view/mod.rs`}><code>effective_tokens()</code></a> and the adjacent
                source-priority function. Inspect{' '}
                <a href={`${productSource}/ext/analysis/src/sources/agent_native.rs`}><code>agent_native.rs</code></a> for
                native-session row construction and Codex <code>state_5.sqlite</code> discovery, then{' '}
                <a href={`${productSource}/ext/session/src/parser.rs`}><code>ext/session/src/parser.rs</code></a> for the
                provider-native token shapes and cumulative Codex helper.
              </p>
              <p>
                For an investigation, record the AgentSight version, whether the input was a DB or native sessions, the group
                key, and the JSON result. Those details are enough for another reviewer to distinguish source reconciliation
                from a real change in the underlying agent usage.
              </p>
            </section>

            <section>
              <h2>Primary sources</h2>
              <ul>{sources.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
            </section>
          </article>

          <aside className="detail-aside">
            <p className="card-label">Continue exploring</p>
            <Link href="/blog/how-agentsight-discovers-local-agent-sessions/">See how native sessions are discovered</Link>
            <Link href="/guides/agent-flamegraph/">Aggregate token usage with Agent Flamegraphs</Link>
            <Link href="/blog/read-agentsight-audit-provenance/">Interpret AgentSight evidence provenance</Link>
            <hr />
            <a className="button button-accent" href={site.repository}>Inspect AgentSight source</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
