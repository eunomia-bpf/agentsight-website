import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/what-agentsight-network-target-counts-mean/';
const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;

export const metadata: Metadata = {
  title: 'What AgentSight network target counts actually measure',
  description: 'A source-level v1.0.35 guide to PID/host/path grouping, event counts, HTTP errors, timestamps, missing connections, and safe interpretation of network targets.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'What AgentSight network target counts actually measure',
    description: 'Why a destination row is not a unique TCP connection, a request count, proof of exfiltration, or evidence of zero network activity elsewhere.',
    url: articlePath,
  },
};

const cell = { border: '1px solid #d8dee8', padding: '0.7rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

const cases = [
  {
    observation: 'Two normalized events share pid, host and path',
    supported: 'The materialized view adds both count values to one network target.',
    notSupported: 'Two distinct TCP connections, or even two unique HTTP requests.',
  },
  {
    observation: 'A request and its response both carry the same host and path',
    supported: 'Both can enter the aggregation because the projector checks every normalized event with a nonempty host.',
    notSupported: 'A one-to-one relationship between a row count and completed request/response pairs.',
  },
  {
    observation: 'An event has HTTP status 429',
    supported: 'That event contributes one to error_count because status is at least 400.',
    notSupported: 'A socket error, TLS handshake failure, or confirmed failed connection.',
  },
  {
    observation: 'The event kind is LlmError without a status code',
    supported: 'It contributes one to error_count if it has a nonempty host.',
    notSupported: 'A specific HTTP status or known root cause.',
  },
  {
    observation: 'A network event has no host value',
    supported: 'The network-target projection skips it.',
    notSupported: 'No packet, connection, DNS lookup, or network side effect occurred.',
  },
  {
    observation: 'pid is null in two otherwise identical rows',
    supported: 'The aggregation uses a fallback zero in its key; these rows can combine.',
    notSupported: 'A real process with PID 0, or independently attributable agent processes.',
  },
  {
    observation: 'The command name changes but pid, host and path do not',
    supported: 'comm is not part of the aggregation key; the existing row retains its previous comm.',
    notSupported: 'The displayed command necessarily names every process observed in that aggregate.',
  },
  {
    observation: 'count is 12 and error_count is 3',
    supported: 'The view summed 12 event contributions and classified 3 of those contributions as errors.',
    notSupported: 'A 25% failure rate for individual user requests, sockets, or agent tasks.',
  },
  {
    observation: 'first and last timestamps are one minute apart',
    supported: 'They are the minimum and maximum observed event timestamps in that group.',
    notSupported: 'A minute-long network session or a measurement of connection latency.',
  },
  {
    observation: 'path contains a URL token or private identifier',
    supported: 'The field may preserve a raw observed request path.',
    notSupported: 'That exporting or publishing network target rows is automatically safe.',
  },
] as const;

const references = [
  ['Normalized-event projection and error classification', sourceRoot + '/ext/analysis/src/view/projection.rs'],
  ['In-memory grouping key, accumulation and sorting', sourceRoot + '/ext/analysis/src/view/mod.rs'],
  ['Snapshot network target type and nullable fields', sourceRoot + '/ext/analysis/src/model.rs'],
  ['SQLite network target upsert and stable grouping ID', sourceRoot + '/ext/analysis/src/sinks/sqlite.rs'],
  ['Documented snapshot schema and sensitive path handling', sourceRoot + '/docs/snapshot-schema.md'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function NetworkTargetEvidenceArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'What AgentSight network target counts actually measure',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-11-03',
    dateModified: '2026-11-03',
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
            <span aria-current="page">Network target evidence</span>
          </nav>
          <Eyebrow>Network evidence semantics · AgentSight v1.0.35 · 3 November 2026</Eyebrow>
          <h1>What AgentSight network target counts actually measure</h1>
          <p className="hero-lede">
            An AgentSight <code>network_targets</code> row groups observed events by process ID,
            host and request path. Its <code>count</code> is an event-aggregation counter—not
            a count of unique sockets, network connections, completed HTTP requests, transmitted
            bytes, or confirmed data exfiltration. The current implementation can aggregate
            both sides of one HTTP exchange, and its <code>error_count</code> follows an
            event-level classification. This distinction matters when auditing an AI agent.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Short answer: a destination summary over normalized events</h2>
              <p>
                The v1.0.35 projection calls <code>network_target_from_event</code> for each
                canonical event. An event without a nonempty <code>host</code> yields no target;
                an event with a host contributes one row with <code>count = 1</code>, optional
                process ID and command, optional path, and its observation timestamp.
                This step runs before the more specific LLM request/response correlation.
                Consequently, a captured request and a captured response can both contribute
                to the same destination summary. One row is not a packet trace or a flow record.
              </p>
              <p>
                This is a source-level interpretation of the published AgentSight
                <code> v1.0.35</code> tree at commit <code>{productCommit}</code>, not a new
                measured dataset or a promise about every runtime and capture mode.
              </p>
            </section>

            <section>
              <h2>The exact grouping rule and what it discards</h2>
              <p>
                The materialized-view key is <code>(pid.unwrap_or_default(), host, path.unwrap_or_default())</code>.
                Rows with that key share a counter even if their command names differ.
                For an existing key, the view adds <code>count</code> and <code>error_count</code>,
                keeps the earliest first timestamp and latest last timestamp, and leaves
                the original command name in place. The SQLite sink independently implements
                the same PID, host and path grouping with a stable length-delimited ID.
              </p>
              <p>
                <strong>Important null boundary:</strong> a missing PID uses zero for grouping,
                but a missing PID in the exported row still means unknown identity. A missing
                path and an empty path likewise share the key. Host text is taken from
                normalized capture evidence; the grouping key does not include TCP port,
                transport protocol, HTTP method, request ID, connection ID or stream ID.
                Do not retrofit those dimensions into the count.
              </p>
              <p>
                A live snapshot sorts target rows by descending count, then host and path.
                A large count therefore brings a destination to the top of the list; it
                is not a bandwidth ranking or an indication of relative risk.
              </p>
            </section>

            <section>
              <h2>What does the error counter mean?</h2>
              <p>
                The projector sets <code>error_count = 1</code> when the normalized event
                kind is <code>LlmError</code> or the event has an HTTP status code of at
                least <code>400</code>. Otherwise it contributes zero. That logic is applied
                independently for each event that has a host. It does not inspect socket
                return codes, verify whether a TLS connection completed, or determine if an
                agent task failed. For a correlated HTTP exchange, refer to the
                <Link href="/blog/how-agentsight-correlates-http-exchanges/"> HTTP request/response pairing analysis</Link>
                before interpreting any per-call failure.
              </p>
              <p>
                For example, an aggregate of 12 contributions with 3 classified errors is
                <em> not</em> sufficient evidence of a 25% HTTP request failure rate. To
                calculate that rate, first establish a denominator of unique requests,
                define the failure outcome, and account for missing or duplicated observations.
              </p>
            </section>

            <section>
              <h2>Ten evidence decisions for a security or reliability review</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '940px', fontSize: '0.92rem' }}>
                  <thead><tr>
                    <th style={header}>Observation</th>
                    <th style={header}>Supported conclusion</th>
                    <th style={header}>Not established</th>
                  </tr></thead>
                  <tbody>
                    {cases.map((row) => (
                      <tr key={row.observation}>
                        <td style={cell}>{row.observation}</td>
                        <td style={cell}>{row.supported}</td>
                        <td style={cell}>{row.notSupported}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>Inspect a saved snapshot without leaking observed paths</h2>
              <p>
                A reproducible review starts with an authorized, already-recorded local
                session. Export and inspect only numeric fields; do not paste raw hosts,
                paths or captured HTTP payloads into a public issue or CI log. These commands
                are a proposed source-backed inspection procedure, <strong>not an executed
                capture experiment</strong>.
              </p>
              <pre><code>{'agentsight report export --db ./agentsight-run.db -o snapshot.json\n' +
                'jq \'{schema: .schema_version, groups: (.network_targets | length), counts: ([.network_targets[] | .count] | add // 0), classified_errors: ([.network_targets[] | .error_count] | add // 0)}\' snapshot.json\n' +
                'jq \'[.network_targets[] | {pid_known: (.pid != null), path_present: (.path != null), count, error_count, first_timestamp_ms, last_timestamp_ms}][:10]\' snapshot.json'}</code></pre>
              <p>
                To validate the implementation without private trace data, check out the
                release and inspect the exact projection, grouping key, and SQLite upsert:
              </p>
              <pre><code>{'git checkout v1.0.35\n' +
                'rg -n "network_target_from_event|error_count" ext/analysis/src/view/projection.rs\n' +
                'rg -n "upsert_network_target|network_target_key" ext/analysis/src/view/mod.rs\n' +
                'rg -n "network_target_id|INSERT INTO network_targets" ext/analysis/src/sinks/sqlite.rs'}</code></pre>
              <p>
                The next step for a real investigation is to cross-check any suspicious
                destination against independently attributable process events and
                exchange-level evidence. Neither a host name nor a raw request path by
                itself demonstrates what data was transmitted, who initiated it, or whether
                the destination received it. See the
                <Link href="/blog/what-agentsight-file-open-events-prove/"> file-open evidence guide</Link>
                for a separate filesystem boundary.
              </p>
            </section>

            <section>
              <h2>Absence, sensitivity and limits</h2>
              <p>
                A zero-length target array means the selected view has no projected rows
                with nonempty hosts. It does not prove absence of network activity:
                uninstrumented transports, incomplete captures, missing host extraction
                and lost events remain possible. The
                <Link href="/blog/how-agentsight-reports-capture-loss/"> capture-loss guide</Link>
                covers those evidence limits; the
                <Link href="/blog/what-agentsight-json-snapshot-exports-contain/"> snapshot contract</Link>
                covers export completeness and source selection.
              </p>
              <p>
                Destination names and especially paths can contain sensitive project names,
                request identifiers or tokens. AgentSight documents raw paths as not generally
                normalized or redacted. Keep raw session databases and JSON snapshots local
                or apply a deliberate sanitization and access-control policy before sharing.
                Network summaries aid triage; they do not replace endpoint enforcement,
                packet-level forensics, or application-authenticated audit trails.
              </p>
            </section>

            <section>
              <h2>First-party references</h2>
              <p>The semantics above are pinned to the product source, not inferred from a screenshot.</p>
              <ul>
                {references.map(([label, href]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
              <p>
                Need command syntax and capture setup?
                {' '}<a href="https://eunomia.dev/agentsight/">Read the canonical AgentSight documentation</a>.
                {' '}<Link href="/security/">Review the site&apos;s data-handling guidance</Link>.
              </p>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
