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
    'A source-level guide to AgentSight v1.0.31 token accounting: DB versus native-session inputs, keyed source priority, Gemini reconciliation, grouping semantics, missing usage, and billing limits.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight reconciles overlapping token usage',
    description:
      'Trace agentsight report token from raw observations to effective token rows, including keyed source precedence, Gemini network/stdout reconciliation, native-session fallback, and interpretation limits.',
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
    dateModified: '2026-09-11',
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
          <Eyebrow>Token accounting internals · AgentSight v1.0.31 · 11 September 2026</Eyebrow>
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
              <h2>Codex has separate cumulative-session and response-level paths</h2>
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
