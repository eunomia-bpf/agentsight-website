import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/what-agentsight-json-snapshot-exports-contain/';
const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;

export const metadata: Metadata = {
  title: 'What AgentSight JSON snapshots contain—and what they omit',
  description: 'A source-pinned AgentSight v1.0.35 snapshot export contract: schema 1, bounded audit rows, missing LLM row sets, null fields, safe consumers and sensitive data.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'What AgentSight JSON snapshots contain—and what they omit',
    description: 'Decide whether a saved AgentSight snapshot is complete enough, compatible enough and safe enough for a downstream integration.',
    url: articlePath,
  },
};

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

const decisions = [
  {
    input: 'schema_version is 1; unknown extra key appears',
    inference: 'Version 1 is the documented contract. Added fields within that version should be ignored by tolerant readers.',
    boundary: 'A new field is not a promise that existing readers must start using it. Reject unsupported schema versions.',
  },
  {
    input: 'summary.audit_events is 2,200; audit_events has 1,000 rows',
    inference: 'The summary is a pre-export-limit count; the array may contain only a bounded subset.',
    boundary: 'Those 1,000 entries cannot be treated as the complete process/file/API event history.',
  },
  {
    input: 'audit_limit=0 in a snapshot request',
    inference: 'The export path can produce an empty audit_events array even if the summary reports observed audits.',
    boundary: 'An empty audit array is not proof that no audited event occurred.',
  },
  {
    input: 'audit_limit requested above 100,000',
    inference: 'The materialized view clamps the emitted audit array to at most 100,000 rows.',
    boundary: 'summary.audit_limit records the requested value, not necessarily the effective cap.',
  },
  {
    input: 'summary.llm_calls is positive; no llm_calls array exists',
    inference: 'The snapshot publishes aggregate LLM counts and model-grouped token_summary, not the full LLM-call row set.',
    boundary: 'Do not use it as a lossless prompt/response archive or assume per-call trace completeness.',
  },
  {
    input: 'process_nodes[].exit_code is null',
    inference: 'The model has no value for that optional field in this row.',
    boundary: 'Null is not 0, a successful exit, or a signal classification.',
  },
  {
    input: 'audit_events[].view_source differs across related events',
    inference: 'Lineage is per row: direct view, SQLite reconstruction, agent-native, or legacy unknown.',
    boundary: 'Do not treat differing row sources as independent proof of two separate logical operations.',
  },
  {
    input: 'resource_samples is empty',
    inference: 'This view produced no resource-sample rows for export.',
    boundary: 'It does not prove zero CPU or memory use, or that the agent was idle.',
  },
  {
    input: 'tool_calls[].input and output are present',
    inference: 'The snapshot may include captured tool arguments and results rather than only categorical metadata.',
    boundary: 'Never treat a complete snapshot as sanitized or public-safe just because it is JSON.',
  },
] as const;

const references = [
  ['Snapshot schema 1 compatibility and sensitive-field contract', sourceRoot + '/docs/snapshot-schema.md'],
  ['MaterializedView snapshot assembly, counters, ordering and 100,000-row audit cap', sourceRoot + '/ext/analysis/src/view/mod.rs'],
  ['SnapshotOptions and strongly typed exported arrays', sourceRoot + '/ext/analysis/src/model.rs'],
  ['Report export source selection and JSON serialization', sourceRoot + '/collector/src/cli_db.rs'],
  ['CLI export flags and default audit limit', sourceRoot + '/collector/src/main.rs'],
  ['Live snapshot API and evidence.read capability check', sourceRoot + '/collector/src/server/web.rs'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function AgentSightSnapshotContractArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'What AgentSight JSON snapshots contain—and what they omit',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-11-01',
    dateModified: '2026-11-01',
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
            <span aria-current="page">JSON snapshot contracts</span>
          </nav>
          <Eyebrow>Snapshot integration boundary · AgentSight v1.0.35 · 1 November 2026</Eyebrow>
          <h1>What AgentSight JSON snapshots contain—and what they omit</h1>
          <p className="hero-lede">
            <code>agentsight report export</code> produces a versioned, useful summary of an observed
            agent run—not an exhaustive, sanitized event archive. Schema version 1 includes
            aggregate token counts, processes, audit events, network targets, resource samples,
            sessions and tool calls. The audit history is bounded, the full LLM-call row set is
            absent, and several fields may contain captured private content. Those three facts
            should shape any downstream parser, review pipeline or export policy.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Short answer: a versioned view snapshot, not a lossless trace</h2>
              <p>
                In AgentSight v1.0.35, <code>report export</code> loads an AgentSight materialized
                view and serializes <code>export_snapshot</code> to JSON. The documented shape is
                <code> schema_version: 1</code>. It is also the response shape of
                <code> GET /api/v1/snapshot</code>, though the live API uses its own source
                selection and, when Direct Node authorization is enabled, requires an
                <code> evidence.read</code> capability. An integration must not assume that a
                local export file and a live API response describe the same time window.
              </p>
              <p>
                The contract permits additive version-1 fields: ignore unknown fields, but
                reject a schema version you do not support. The documented writer emits
                nullable values as <code>null</code> and missing collections as empty arrays.
                Treat source-specific <code>null</code> as unknown rather than imputing zero or
                inferring success. These statements are pinned to product commit
                <code> {productCommit}</code>; they are source inspection, not a new live benchmark.
              </p>
            </section>

            <section>
              <h2>Which rows are exported, and which evidence is only summarized?</h2>
              <p>
                The snapshot includes <code>summary</code>, model-grouped
                <code> token_summary</code>, <code>network_targets</code>, <code>process_nodes</code>,
                <code> audit_events</code>, <code>resource_samples</code>, <code>sessions</code> and
                <code> tool_calls</code>. The <code>summary</code> also records covered timestamps,
                view source, event/call counts, token totals and the requested audit limit.
              </p>
              <p>
                Importantly, <strong>there is no top-level full <code>llm_calls</code> array and no
                full token-usage row set in schema 1</strong>. A positive
                <code> summary.llm_calls</code> count means the view counted calls; it does not
                make a per-call request, response or latency record available in this export.
                For downstream profiling, the model-grouped token summary is a rollup, not a
                substitute for the underlying per-call evidence.
              </p>
              <p>
                Network entries can contain a raw request path. Process entries may carry argv,
                command lines and working directories. Audit rows may include arbitrary details,
                while tool calls may include their inputs and outputs. Therefore an apparently
                technical snapshot may disclose repository names, secrets in arguments, prompts
                or tool results. Access control and field-level minimization must happen
                <strong> before</strong> distributing a derived artifact.
              </p>
            </section>

            <section>
              <h2>The audit-limit edge case that can break a compliance report</h2>
              <p>
                In <code>MaterializedView::export_snapshot</code>, the summary and the emitted
                audit array are built separately. <code>summary.audit_events</code> is a count
                reported by the view <em>before</em> export limiting. The array is sorted by
                timestamp (with event ID breaking ties) and only the most recent requested
                rows are retained. The implementation additionally caps the output at
                <strong> 100,000 rows</strong>, even if a caller requests more.
              </p>
              <p>
                By default, the CLI <code>--audit-limit</code> is 10,000; the snapshot API also
                defaults to 10,000. Passing zero produces no audit rows while the summary
                may still report events. A caller asking for 250,000 rows does not override
                the implementation cap. And because <code>summary.audit_limit</code> echoes
                the requested option, consumers must not mistake that field for proof
                that exactly that many rows were made available.
              </p>
              <p>
                A safe completeness annotation stores all three values:
                <code> summary.audit_events</code>, <code>summary.audit_limit</code> and
                <code> audit_events.length</code>. If the visible count is smaller than the
                reported total, investigate the effective limit and data lineage; do not
                report omitted rows as non-events. Even matching counts do not establish
                complete capture at the kernel or application boundary—event loss and
                source-specific reconstruction remain separate questions.
              </p>
            </section>

            <section>
              <h2>Nine integration decisions grounded in the current source</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '950px', fontSize: '0.92rem' }}>
                  <thead><tr>
                    <th style={header}>Consumer observation</th>
                    <th style={header}>Supported interpretation</th>
                    <th style={header}>Unsafe inference</th>
                  </tr></thead>
                  <tbody>
                    {decisions.map((item) => (
                      <tr key={item.input}>
                        <td style={cell}>{item.input}</td>
                        <td style={cell}>{item.inference}</td>
                        <td style={cell}>{item.boundary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>Reproduce the contract check without publishing raw evidence</h2>
              <p>
                The following is a local example for an already-recorded, authorized capture.
                It writes a <strong>sensitive</strong> JSON file and prints only coarse metadata.
                The commands are documented source-based procedures, not an executed test from
                this article. Use the canonical CLI documentation for installation and capture setup.
              </p>
              <pre><code>{'agentsight report export --db ./agentsight-run.db --audit-limit 1000 -o snapshot.json\n' +
                'jq -e \'.schema_version == 1 and (.audit_events | type == "array") and (.summary.audit_events | type == "number") and (.summary.audit_limit == 1000)\' snapshot.json\n' +
                'jq \'{schema_version, source: .summary.source, audit_total: .summary.audit_events, audit_included: (.audit_events | length), audit_requested: .summary.audit_limit, llm_calls: .summary.llm_calls}\' snapshot.json'}</code></pre>
              <p>
                To verify the 100,000-row cap and summary behavior directly from the pinned
                implementation without collecting private agent data, inspect these functions:
              </p>
              <pre><code>{'git checkout v1.0.35\n' +
                'rg -n "export_snapshot|snapshot_summary|fn audit_events" ext/analysis/src/view/mod.rs\n' +
                'rg -n "audit_limit|run_export" collector/src/main.rs collector/src/cli_db.rs collector/src/server/web.rs'}</code></pre>
              <p>
                This static inspection verifies code branches and schema structure; it does
                not demonstrate a real workload producing 100,000 rows. An operational
                integration should add its own fixture tests for unknown extra fields,
                unsupported schema versions, nullable values, limit zero, and incomplete
                audit arrays, without placing private snapshot samples in public CI logs.
              </p>
            </section>

            <section>
              <h2>Design a downstream evidence record that preserves limitations</h2>
              <p>
                For a dashboard or automated review, store the export source, timestamp,
                schema version, original window, requested limit, observed row count and
                a clear annotation that the snapshot is a selected view. Keep a separate
                decision for <em>task success</em>: a process exit row or agent completion
                state alone does not validate the generated patch, test run or external
                action. The <Link href="/blog/what-agentsight-process-exit-codes-mean/"> process
                EXIT evidence note</Link> explains that boundary.
              </p>
              <p>
                If your question is whether reconstructed or directly captured audit rows
                agree, use the <Link href="/blog/read-agentsight-audit-provenance/"> audit
                provenance reference</Link>. If the source stream lost observations, read
                <Link href="/blog/how-agentsight-reports-capture-loss/"> the capture-loss
                analysis</Link>. A JSON snapshot has different semantics from
                <Link href="/blog/how-agentsight-exports-opentelemetry-genai-spans/"> OpenTelemetry
                GenAI span export</Link>; neither format automatically grants the completeness
                or privacy properties of the other.
              </p>
            </section>

            <section>
              <h2>Primary sources, scope and open limits</h2>
              <ul>{references.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
              <p>
                Research scope: AgentSight v1.0.35, product commit
                <code> {productCommit}</code>, reviewed 1 November 2026.
                We inspected the documented schema, view implementation, CLI flags and API
                authorization path. No live capture, end-to-end privacy assessment,
                production API call, count-consistency benchmark or downstream consumer
                compatibility experiment was performed. Recheck the implementation for any
                newer release before treating this source-pinned behavior as current.
              </p>
            </section>
          </article>

          <aside className="detail-aside">
            <p className="card-label">Related evidence decisions</p>
            <Link href="/blog/read-agentsight-audit-provenance/">Read row provenance</Link>
            <Link href="/blog/how-agentsight-reports-capture-loss/">Diagnose missing capture evidence</Link>
            <Link href="/blog/how-agentsight-exports-opentelemetry-genai-spans/">Compare OpenTelemetry export</Link>
            <hr />
            <a className="button button-accent" href={site.repository}>Inspect AgentSight source</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
