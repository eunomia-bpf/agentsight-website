import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/how-agentsight-correlates-http-exchanges/';
const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;

export const metadata: Metadata = {
  title: 'How AgentSight matches HTTP requests to responses in TLS captures',
  description:
    'A source-level guide to AgentSight v1.0.35 HTTP/1.1 and HTTP/2 exchange correlation, TLS connection identity, inferred matches, truncation, capture loss, and evidence limits.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight matches HTTP requests to responses in TLS captures',
    description:
      'Inspect the v1.0.35 HTTP correlation design: TLS handles, HTTP/1.1 queues, HTTP/2 stream IDs, loss handling, and the difference between exact and inferred evidence.',
    url: articlePath,
  },
};

const cell = {
  border: '1px solid #d8dee8',
  padding: '0.75rem',
  verticalAlign: 'top' as const,
};
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

const sources = [
  ['HTTP exchange correlation design, fields, and loss semantics', sourceRoot + '/ext/analysis/docs/http-correlation.md'],
  ['HTTP/1.1 and HTTP/2 parser and regression cases', sourceRoot + '/ext/analysis/src/analyzers/http_parser.rs'],
  ['TLS fragment provenance and consistency aggregation', sourceRoot + '/ext/analysis/src/analyzers/capture_metadata.rs'],
  ['Plaintext byte fidelity and HTTP/1.1 truncation contract', sourceRoot + '/docs/ssl-capture.md'],
  ['v1.0.35 release and linked implementation pull requests', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
  ['Current record/report CLI and runtime coverage', sourceRoot + '/README.md'],
] as const;

export default function HttpExchangeCorrelationArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight matches HTTP requests to responses in TLS captures',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-10-23',
    dateModified: '2026-10-23',
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
            <span aria-current="page">HTTP exchange correlation</span>
          </nav>
          <Eyebrow>Capture implementation · AgentSight v1.0.35 · 23 October 2026</Eyebrow>
          <h1>How AgentSight matches HTTP requests to responses in TLS captures</h1>
          <p className="hero-lede">
            One process can send overlapping requests through several TLS connections, and HTTP/2 multiplexes
            streams inside one connection. Joining records only by PID or thread can attach the wrong response
            to an agent request. AgentSight v1.0.35 reconstructs <strong>connection-scoped HTTP exchanges</strong>
            where capture identity is available, labels weaker fallback evidence, and preserves partial or
            lost captures rather than silently promoting them to complete calls.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Direct answer: identify the transport first, then apply the protocol</h2>
              <p>
                The HTTP analyzer is downstream of TLS plaintext capture. For known transport identity, it derives
                an opaque connection ID from the process, its start time, the TLS implementation, and the captured
                transport handle. It then pairs HTTP/1.1 requests with final responses in connection-local order,
                or matches HTTP/2 requests and responses by connection and stream ID. The event records say how
                each pair was constructed. This is <strong>protocol correlation</strong>, not proof that every byte
                of a request or response was observed.
              </p>
              <p>
                This article reviews the public v1.0.35 source at <code>{productCommit}</code>. It is a
                source-level explanation, <em>not</em> a new performance benchmark or a claim that every
                agent/runtime exposes usable TLS identities. For the broader decision about which observation
                plane to use, see <Link href="/ebpf-ai-agent-monitoring/">eBPF monitoring boundaries</Link>.
              </p>
            </section>

            <section>
              <h2>What makes a connection identity stronger than a PID/TID?</h2>
              <p>
                For a capture that reports a nonzero <code>transport_handle</code> and
                <code>process_start_ns</code> together with a recognized <code>tls_library</code>, the parser
                resolves the tuple <code>(pid, process_start_ns, tls_library, transport_handle)</code> into an
                opaque, capture-local <code>connection_id</code>. The process start value distinguishes PID
                reuse; the TLS handle distinguishes connections used by the same process. Thread ID remains
                provenance: it may change between a request write and a response read and therefore should not
                be treated as the connection key.
              </p>
              <p>
                A supported TLS close, ten-minute idle expiry, or bounded-state eviction retires this identity.
                Reusing a raw handle later receives another capture-local identity. A new opaque ID does not
                establish a new physical TCP connection, and missing lifecycle events still limit certainty.
                The analyzer does not persist raw TLS pointer addresses in SQLite or OTel call identity.
              </p>
            </section>

            <section>
              <h2>HTTP/1.1, HTTP/2, and legacy traces need different matching rules</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Evidence path</th>
                      <th style={header}>How exchange identity is assigned</th>
                      <th style={header}>Boundary to remember</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>HTTP/1.1 with known TLS connection</td>
                      <td style={cell}>Requests receive sequential exchange IDs; final responses consume that connection&apos;s pending-request FIFO.</td>
                      <td style={cell}>Informational 1xx responses do not consume the request; server-side capture uses the HTTP start line, not read/write direction, to classify messages.</td>
                    </tr>
                    <tr>
                      <td style={cell}>HTTP/2 with known TLS connection</td>
                      <td style={cell}>The exchange key includes the connection and HTTP/2 stream ID; directional HPACK and CONTINUATION state stay connection-local.</td>
                      <td style={cell}>A response completes at END_STREAM. RST_STREAM and GOAWAY may end a stream with terminal evidence rather than a complete response.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Incomplete/unknown TLS identity</td>
                      <td style={cell}>Legacy HTTP/1 reassembly retains the older PID/TID-scoped path; matches are explicitly labeled inferred.</td>
                      <td style={cell}>This includes older traces and captures without supported identity, such as documented rustls paths. Inference is not the same as an exact connection match.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                HTTP/1.1 handles declared Content-Length, chunked bodies and trailers, and close-delimited
                responses. HEAD, 204, and 304 do not require a body. Conflicting length declarations or
                malformed chunking are protocol errors, not permission to pair the next convenient response.
                The parser keeps request and response buffers separate for each connection and direction.
              </p>
            </section>

            <section>
              <h2>Read the correlation fields as evidence labels, not success badges</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Field</th>
                      <th style={header}>Interpretation</th>
                      <th style={header}>Do not infer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}><code>http_exchange_id</code></td>
                      <td style={cell}>Shared request/response key constructed by this capture&apos;s analyzer.</td>
                      <td style={cell}>A provider request ID, globally stable ID, or independently verified application trace.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>correlation_method</code></td>
                      <td style={cell}><code>h1_connection_fifo</code>, <code>h2_stream</code>, or a labeled legacy method.</td>
                      <td style={cell}>That different protocols or fallbacks have the same evidence strength.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>correlation_status</code></td>
                      <td style={cell}><code>exact</code> for protocol matching with known identity; <code>inferred</code> for legacy evidence; <code>unlinked</code> for unmatched/terminated calls.</td>
                      <td style={cell}>That &quot;exact&quot; means lossless capture, validated model semantics, or complete body.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>completion_reason</code></td>
                      <td style={cell}>How a message or pending exchange finished, including loss, timeout, close, reset, GOAWAY, eviction or capture end.</td>
                      <td style={cell}>That capture end implies a clean TLS close.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>stream_id</code>, <code>correlation_version</code></td>
                      <td style={cell}>HTTP/2 stream where applicable; version 2 for known identity, 1 for legacy correlation.</td>
                      <td style={cell}>That a null stream on HTTP/1.1 is an error.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The additional <code>confidence</code> value ranks a matching method inside this implementation;
                it is not a calibrated probability. Fragment provenance is also not traffic accounting: one
                TLS call can contribute bytes to more than one decoded HTTP message, so summing each message&apos;s
                provenance bytes can double-count transport volume.
              </p>
            </section>

            <section>
              <h2>A truncated request is not an absent request</h2>
              <p>
                Two independent budgets can cut an HTTP/1.1 message short. The TLS capture retains at most
                256 KiB per SSL operation, and the HTTP/1 parser retains at most 1 MiB of message prefix.
                When a readable HTTP start line and prefix survive, the parser emits a partial HTTP event
                instead of dropping it. It sets <code>body_truncated: true</code> with a reason of
                <code>capture_truncated</code> or <code>body_limit</code>, and reports
                <code>body_captured_bytes</code>. When the peer declared Content-Length, the original
                <code>content_length</code> can be compared with the retained prefix.
              </p>
              <p>
                These fields make an important operational difference. A truncated body is <em>not</em> a
                complete JSON document or safe decompression input. If enough framing is known to skip
                precisely the lost Content-Length bytes, later HTTP/1.1 messages may still be matched.
                If framing cannot be resynchronized—for example, a cut chunked or close-delimited body—the
                analyzer stops pairing that connection until retirement. A similar truncation in HTTP/2
                invalidates protocol state instead of trusting a damaged frame or HPACK dictionary.
              </p>
            </section>

            <section>
              <h2>What happens when collection loses data?</h2>
              <p>
                The ring-buffer loss counter applies to the tracer, not just one HTTP stream. A change in
                that counter, including a final <code>CAPTURE_LOSS</code> event, invalidates pending matches
                across active connections. The raw captured input remains available, but the analyzer emits
                terminal or unlinked evidence rather than guessing where the next byte belongs. Likewise,
                a known exchange ID without a pending request does not fall back to a different thread&apos;s
                request. Legacy events without explicit HTTP identity retain their separate fallback rules.
              </p>
              <p>
                An unfinished exchange at end of input receives <code>capture_end</code>; this is not
                proof of TLS close. Source-level finalization requires a drained event stream, and abrupt
                cancellation cannot guarantee it. Partial terminal events with
                <code>source=&quot;http_correlation&quot;</code> are diagnostics, not normal HTTP responses.
              </p>
            </section>

            <section>
              <h2>SSE and OpenTelemetry preserve the boundary rather than repair it</h2>
              <p>
                For identified TLS transports, the analyzer runs HTTP parsing, decompression, and SSE
                processing before materialization. A complete SSE body can preserve HTTP exchange evidence
                when converted into an aggregate. This v1.0.35 stage does <strong>not</strong> promise
                early incremental SSE response chunks: long streaming responses may remain pending or
                unlinked until a terminal event. The source explicitly defers incremental streaming.
              </p>
              <p>
                SQLite call rows store nullable connection, protocol, stream, exchange and evidence
                columns; legacy read-only databases synthesize nulls rather than retroactively
                re-correlating historical events. Where present, OTel exports add corresponding evidence
                attributes. That makes protocol matching complementary to
                <Link href="/compare/opentelemetry/"> application-level and OpenTelemetry tracing</Link>,
                not a replacement for application span context.
              </p>
            </section>

            <section>
              <h2>Bounded state changes what &quot;no match&quot; means</h2>
              <p>
                The parser bounds active connections to 1,024, HTTP/2 streams and pending header blocks to
                1,024 per connection, header blocks to 64 KiB, HTTP/1 prefixes and HTTP/2 bodies to
                1 MiB, and fragment provenance to 4,096 entries per direction. Pending HTTP/1 requests
                are capped at 1,024, and the materialized pending-exchange view holds at most 16,384
                entries with a five-minute expiry. Reaching a limit produces terminal evidence instead
                of a fabricated successful request/response pair.
              </p>
              <p>
                Other failure cases include capture beginning in the middle of a connection, TLS-library
                coverage gaps, unobserved close events, missed fragments, and parsing of plaintext that
                arrived out of protocol order. These are reasons to preserve the raw provenance and
                native agent trace where available; none turns absence of a reconstructed call into proof
                that no outbound request occurred.
              </p>
            </section>

            <section>
              <h2>How to investigate one suspicious match</h2>
              <p>
                Reproduce the workload on a Linux host with supported eBPF/TLS capture, retain the
                original saved database, and inspect the available reconstructed call evidence before
                attributing cost or latency to a specific provider request. The supported command
                entry point is shown below; consult the version-matched
                <a href={sourceRoot + '/README.md'}> product README</a> for platform and runtime setup.
                A saved run is sensitive and must not be uploaded unredacted merely to debug matching.
              </p>
              <pre><code>{'sudo agentsight record -- <agent-command>\n# Then inspect the saved session with the supported report workflow:\nagentsight report --db path/to/agentsight-run.db'}</code></pre>
              <p>
                For a source-level investigation, ask these questions in order: Does a record contain
                supported TLS identity? Is its correlation method connection FIFO, HTTP/2 stream, or
                legacy inference? Do the request and response share an exchange ID? Are
                <code>completion_reason</code>, <code>body_truncated</code>, and capture-loss counters
                consistent with the bytes actually retained? Does the native agent record supply a
                separate request timeline? This procedure is an interpretation checklist, not a
                claim that every field appears in the default human-readable report.
              </p>
              <p>
                The implementation references below provide a reproducible source audit. The parser
                regression cases include same-connection requests using different TIDs and overlapping
                HTTP/1.1 exchanges—precisely where a PID/TID-only join can mislead.
                Also read <Link href="/blog/why-ai-agent-tls-traffic-is-hard-to-trace/">why AI agent TLS
                traffic is difficult to capture</Link> before inferring that a missing payload was
                never sent.
              </p>
            </section>

            <section>
              <h2>Primary sources and reviewed scope</h2>
              <p>
                All product statements above are pinned to AgentSight v1.0.35 source commit
                <code> {productCommit}</code>, released 23 October 2026. The analysis separates the
                documented parser contract from any unperformed production measurement. A valid
                future benchmark would need its own workload, runtime identity, TLS library, capture
                loss accounting, and ground-truth HTTP exchanges.
              </p>
              <ul>
                {sources.map(([label, href]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
              <p>
                Next: read the <Link href="/security/">local telemetry and data-handling limits</Link>,
                or compare the distinct
                <Link href="/blog/how-agentsight-exports-opentelemetry-genai-spans/"> GenAI span export path</Link>.
              </p>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
