import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = 'bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const articlePath = '/blog/how-agentsight-exports-opentelemetry-genai-spans/';

export const metadata: Metadata = {
  title: 'How AgentSight exports OpenTelemetry GenAI spans',
  description:
    'A source-level guide to AgentSight v1.0.31 OpenTelemetry export: eligible model calls, trace grouping, gen_ai attributes, OTLP/HTTP endpoint rules, content privacy, and export limits.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight exports OpenTelemetry GenAI spans',
    description:
      'Follow a completed AgentSight model call from the materialized view to an OTLP/HTTP GenAI CLIENT span, including trace IDs, attributes, privacy defaults, and evidence that stays local.',
    url: articlePath,
  },
};

const sources = [
  ['AgentSight v1.0.31 OTLP/HTTP GenAI exporter', `${productSource}/ext/analysis/src/sinks/otel.rs`],
  ['AgentSight v1.0.31 trace pipeline and sink wiring', `${productSource}/collector/src/cmd_trace.rs`],
  ['AgentSight v1.0.31 debug trace OTel flags', `${productSource}/collector/src/cmd_debug.rs`],
  ['AgentSight v1.0.31 record CLI surface', `${productSource}/collector/src/main.rs`],
  ['AgentSight v1.0.31 OpenTelemetry export documentation', `${productSource}/docs/otel.md`],
  ['OpenTelemetry GenAI semantic-convention attribute registry', 'https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/'],
  ['OpenTelemetry OTLP specification', 'https://opentelemetry.io/docs/specs/otlp/'],
  ['OpenTelemetry OTLP exporter endpoint rules', 'https://opentelemetry.io/docs/specs/otel/protocol/exporter/'],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function OpenTelemetryGenAiExportArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight exports OpenTelemetry GenAI spans',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-09-13',
    dateModified: '2026-09-13',
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
            <span aria-current="page">OpenTelemetry GenAI export</span>
          </nav>
          <Eyebrow>Telemetry export internals · AgentSight v1.0.31 · 13 September 2026</Eyebrow>
          <h1>How AgentSight exports OpenTelemetry GenAI spans</h1>
          <p className="hero-lede">
            AgentSight can turn model calls reconstructed by its capture pipeline into OpenTelemetry GenAI spans without
            adding an SDK to the observed agent. The important boundary is narrower than “export the AgentSight trace”:
            v1.0.31 exports completed materialized LLM calls as OTLP/HTTP JSON spans. Process trees, file activity, sampled
            system resources, AgentSight provenance, and tool/workflow rows do not automatically become OTel spans.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer</h2>
              <p>
                The current OTel path is exposed by <code>agentsight debug trace --otel</code>. The trace pipeline first
                normalizes and materializes captured evidence. When that materialized view emits a completed
                <code>llm_call</code>, the OTel sink maps the call onto one CLIENT span named <code>chat {'{model}'}</code> and
                POSTs an OTLP/HTTP JSON <code>ExportTraceServiceRequest</code> to the configured traces endpoint.
              </p>
              <p>
                This is a projection, not a second raw packet parser. Request/response correlation and token extraction happen
                before the OTel sink receives the row. In v1.0.31, an unfinished call with no end timestamp is skipped rather
                than emitted as a partial span.
              </p>
            </section>

            <section>
              <h2>What crosses the OTel boundary—and what stays in AgentSight</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead><tr><th style={header}>Evidence</th><th style={header}>OTel GenAI export in v1.0.31</th><th style={header}>Interpretation</th></tr></thead>
                  <tbody>
                    <tr><td style={cell}>Completed materialized LLM call</td><td style={cell}>Yes</td><td style={cell}>One CLIENT span with request/response metadata and timestamps.</td></tr>
                    <tr><td style={cell}>Prompt/completion content</td><td style={cell}>Opt-in</td><td style={cell}>Added only with <code>--otel-capture-content</code>.</td></tr>
                    <tr><td style={cell}>Process/file/network/resource evidence</td><td style={cell}>No automatic span mapping</td><td style={cell}>Remains AgentSight evidence unless another pipeline exports it separately.</td></tr>
                    <tr><td style={cell}>Tool/workflow rows</td><td style={cell}>Not emitted yet</td><td style={cell}>Current product docs explicitly list tool/workflow spans as a limitation.</td></tr>
                    <tr><td style={cell}>AgentSight row provenance/confidence</td><td style={cell}>Not mapped by this sink</td><td style={cell}>Keep the AgentSight artifact when evidence lineage matters.</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                That boundary is useful operationally: an existing OTel backend can receive standardized model-call spans,
                while AgentSight remains the richer local artifact for questions such as “which process wrote this file?” or
                “which system observation produced this reconstructed row?”.
              </p>
            </section>

            <section>
              <h2>The exporter starts from the materialized view, not raw TLS events</h2>
              <p>
                <code>cmd_trace.rs</code> builds one <code>MaterializingAnalyzer</code> and can attach both the SQLite sink and
                the OTel sink to it. The OTel exporter therefore sees normalized <code>LlmCallRow</code> values after AgentSight
                has already done the capture-specific work needed to construct a model call. The exporter source itself says
                that correlation and token extraction happen before the sink.
              </p>
              <p>
                This distinction also tightens the wording in the user documentation. The conceptual pipeline begins with
                SSL/plaintext capture and HTTP reconstruction, but the OTel sink is not the component that pairs raw
                <code>SSL_write</code>/<code>SSL_read</code> events by PID/TID. It consumes the completed call produced by the
                shared materialized-view pipeline.
              </p>
            </section>

            <section>
              <h2>Trace grouping uses explicit conversation identity, then session identity</h2>
              <p>
                Every exported call gets a fresh random span ID. Trace identity is reused more selectively. The exporter first
                looks for an explicit conversation or thread identifier in a bounded set of request/response JSON paths. If it
                finds one, calls with that identifier share a trace ID. Otherwise it uses the AgentSight session ID. If neither
                is available, calls share one recording-scoped fallback trace ID.
              </p>
              <p>
                A generic provider response ID is deliberately not treated as a conversation ID. That matters because a
                response identifier usually names one response, not the multi-turn conversation. v1.0.31 also does not infer a
                parent/child span tree for model calls; the product documentation explicitly notes that root and child spans
                are not inferred yet.
              </p>
            </section>

            <section>
              <h2>Which GenAI attributes are actually emitted?</h2>
              <p>
                The mapping is intentionally small enough to audit. The span is a CLIENT span; its operation name is
                <code>chat</code>, provider comes from the normalized call or API host, and <code>server.address</code> records
                that host. Model/request parameters are copied when available, while response metadata and token usage are
                derived from the completed response body.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '800px', fontSize: '0.92rem' }}>
                  <thead><tr><th style={header}>OTel field</th><th style={header}>AgentSight source</th><th style={header}>Important limit</th></tr></thead>
                  <tbody>
                    <tr><td style={cell}><code>gen_ai.operation.name</code></td><td style={cell}><code>chat</code></td><td style={cell}>Current exporter is model-call focused.</td></tr>
                    <tr><td style={cell}><code>gen_ai.provider.name</code></td><td style={cell}>Normalized provider or provider inferred from host.</td><td style={cell}>It is not an AgentSight process identity.</td></tr>
                    <tr><td style={cell}><code>gen_ai.conversation.id</code></td><td style={cell}>Explicit recognized conversation/thread field.</td><td style={cell}>Not synthesized from a generic response ID.</td></tr>
                    <tr><td style={cell}><code>gen_ai.request.model</code></td><td style={cell}>Normalized model or request <code>model</code>.</td><td style={cell}>Absent when the capture cannot establish it.</td></tr>
                    <tr><td style={cell}><code>gen_ai.usage.input_tokens</code></td><td style={cell}><code>input_tokens</code> or <code>prompt_tokens</code>.</td><td style={cell}>Only when response usage exposes a matching integer field.</td></tr>
                    <tr><td style={cell}><code>gen_ai.usage.output_tokens</code></td><td style={cell}><code>output_tokens</code> or <code>completion_tokens</code>.</td><td style={cell}>Observed response usage, not a billing calculation.</td></tr>
                    <tr><td style={cell}><code>gen_ai.response.finish_reasons</code></td><td style={cell}>OpenAI-style choice reasons or Anthropic-style <code>stop_reason</code>.</td><td style={cell}>Omitted when the response shape has no recognized reason.</td></tr>
                    <tr><td style={cell}><code>http.response.status_code</code></td><td style={cell}>Captured HTTP response status.</td><td style={cell}>Status 400 or above also marks the span ERROR.</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                Span start and end timestamps come from the materialized call&apos;s captured request/response times. The OTel
                resource uses <code>service.name</code>, defaulting to <code>agentsight</code>, and the instrumentation scope is
                named <code>agentsight</code> with the current package version.
              </p>
            </section>

            <section>
              <h2>Content export is off by default for a reason</h2>
              <p>
                Without <code>--otel-capture-content</code>, the exporter sends model-call metadata but does not add prompt or
                completion bodies. When content capture is enabled, v1.0.31 can attach request messages/input as
                <code>gen_ai.input.messages</code> and the response JSON as <code>gen_ai.output.messages</code>.
              </p>
              <p>
                OpenTelemetry itself warns that GenAI message attributes are likely to contain sensitive user or PII data.
                AgentSight recordings can also contain sensitive development context. Treat the flag as a data-export decision,
                not a display preference: once content enters a collector pipeline, its retention, access controls, and
                downstream exporters are properties of that telemetry system.
              </p>
            </section>

            <section>
              <h2>Endpoint precedence follows the OTel split between base and trace-specific URLs</h2>
              <p>
                AgentSight accepts <code>--otel-endpoint</code> as an OTLP/HTTP base URL. If that flag is absent, it checks
                <code>OTEL_EXPORTER_OTLP_ENDPOINT</code>, then falls back to <code>http://localhost:4318</code>. Those base forms
                get <code>/v1/traces</code> appended. If <code>OTEL_EXPORTER_OTLP_TRACES_ENDPOINT</code> is set, it takes
                precedence and is used as-is.
              </p>
              <p>
                That matches the OpenTelemetry exporter distinction: the general OTLP endpoint is a base from which the
                signal path is constructed, while the signal-specific trace endpoint is already the final URL. The current
                AgentSight sink sends OTLP/HTTP JSON, not OTLP/gRPC.
              </p>
            </section>

            <section>
              <h2>Export failure is not the same as capture failure</h2>
              <p>
                For each completed call, the sink spawns an asynchronous HTTP POST. A non-success collector response or
                transport failure is logged as an OTel exporter warning. The <code>llm_call()</code> sink method itself returns
                successfully after scheduling that work rather than synchronously turning collector delivery into a failure of
                the AgentSight materialization path.
              </p>
              <p>
                This is a useful failure-isolation property, but it also means that “the AgentSight run contains the call” and
                “the collector accepted the span” are separate facts. Verify the collector or downstream backend when export
                completeness matters; do not infer successful remote delivery only from the presence of a local AgentSight
                call.
              </p>
            </section>

            <section>
              <h2>The current public CLI surface is debug trace, not record</h2>
              <p>
                In v1.0.31, <code>--otel</code>, <code>--otel-endpoint</code>, and <code>--otel-capture-content</code> are flags
                on <code>agentsight debug trace</code>. The normal <code>agentsight record</code> command exposes command/PID,
                binary path, SQLite DB, and web-server controls, but does not expose those OTel flags. The two commands share
                trace infrastructure internally, but that does not make an unexposed flag part of the <code>record</code> CLI.
              </p>
              <pre><code>{`# Export metadata-only GenAI spans to an OTLP/HTTP collector
sudo agentsight debug trace --otel --otel-endpoint http://localhost:4318

# Opt in to prompt/completion content only when the collector policy permits it
sudo agentsight debug trace --otel --otel-capture-content`}</code></pre>
              <p>
                Installation and collector setup belong in the canonical AgentSight documentation. The important reproducible
                check for this article is narrower: run a collector that exposes its received spans, issue one bounded model
                request under <code>debug trace --otel</code>, and compare the emitted attributes with the local AgentSight call.
              </p>
            </section>

            <section>
              <h2>Use OTel for the model-call projection; keep AgentSight when system evidence matters</h2>
              <p>
                If your existing telemetry stack already speaks OTLP, AgentSight does not need to replace it. The current
                exporter is useful for feeding standardized GenAI call spans into that pipeline while preserving AgentSight as
                the independent local record of system behavior. The two views intentionally have different information.
              </p>
              <p>
                For a model-latency or provider-error question, the exported span can be enough. For a question about the child
                process that ran after the model call, the file a tool opened, the network endpoint a subprocess reached, or
                the provenance of a reconstructed row, inspect the AgentSight artifact as well. Exporting one boundary does not
                make the other boundary disappear.
              </p>
            </section>

            <section>
              <h2>How to verify the implementation yourself</h2>
              <p>
                Start with <a href={`${productSource}/collector/src/cmd_debug.rs`}><code>cmd_debug.rs</code></a> for the CLI
                flags and <a href={`${productSource}/collector/src/cmd_trace.rs`}><code>cmd_trace.rs</code></a> for where the
                OTel sink is attached to the shared materialized view. Then read{' '}
                <a href={`${productSource}/ext/analysis/src/sinks/otel.rs`}><code>otel.rs</code></a> for completion gating,
                trace-ID selection, attribute mapping, endpoint precedence, content opt-in, and asynchronous POST behavior.
                Finally compare <a href={`${productSource}/collector/src/main.rs`}><code>main.rs</code></a> to keep the public
                <code>record</code> and <code>debug trace</code> surfaces distinct.
              </p>
            </section>

            <section>
              <h2>Primary sources</h2>
              <ul>{sources.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
            </section>
          </article>

          <aside className="detail-aside">
            <p className="card-label">Continue exploring</p>
            <Link href="/compare/opentelemetry/">Choose between AgentSight and OpenTelemetry boundaries</Link>
            <Link href="/blog/system-boundary-observability/">Map native telemetry to system evidence</Link>
            <Link href="/blog/read-agentsight-audit-provenance/">Interpret AgentSight evidence provenance</Link>
            <hr />
            <a className="button button-accent" href="https://eunomia.dev/agentsight/">Open canonical documentation</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}