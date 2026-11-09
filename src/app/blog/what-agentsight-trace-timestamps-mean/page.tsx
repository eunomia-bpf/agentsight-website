import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/what-agentsight-trace-timestamps-mean/';
const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;

export const metadata: Metadata = {
  title: 'What AgentSight trace timestamps and SSE durations really mean',
  description:
    'A source-level AgentSight v1.0.35 audit: eBPF boot-time nanoseconds, normalized epoch milliseconds, SSE merge timestamps, and a duration_ns unit mismatch.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'What AgentSight trace timestamps and SSE durations really mean',
    description:
      'Understand which AgentSight event times can be compared and why an SSE duration_ns field is not nanoseconds in the v1.0.35 tracing pipeline.',
    url: articlePath,
  },
};

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

const cases = [
  {
    observation: 'A raw TLS probe timestamp is 1,500,000,000 ns after boot.',
    sourceBehavior: 'sslsniff.bpf.c records bpf_ktime_get_ns(); the converter divides by 1,000,000.',
    interpretation: 'The normalized offset is 1,500 ms. Add the cached boot-time epoch milliseconds; do not read the raw number as an epoch timestamp.',
  },
  {
    observation: 'Two raw events differ by 1,500,000 ns.',
    sourceBehavior: 'Integer division happens independently on both timestamps.',
    interpretation: 'A millisecond-level event timeline may show a 1 or 2 ms difference depending on boundaries. Sub-millisecond detail is not preserved.',
  },
  {
    observation: 'SSE fragments arrive at normalized times 1,000 and 2,000 ms.',
    sourceBehavior: 'The accumulator stores event.timestamp as start_time and end_time.',
    interpretation: 'The interval between the first and last observed fragments is 1,000 ms; it is not necessarily model latency or wall time of the full request.',
  },
  {
    observation: 'The same two fragments produce duration_ns = 1,000.',
    sourceBehavior: 'v1.0.35 computes end_time.saturating_sub(start_time) after timestamp normalization.',
    interpretation: 'On the traced SSL pipeline, the numeric difference is milliseconds despite the duration_ns field name. Treat that field as a version-specific unit mismatch.',
  },
  {
    observation: 'An SSE accumulator has only one observed event.',
    sourceBehavior: 'The start and end timestamps are identical; the emitted event preserves original_event.timestamp.',
    interpretation: 'A zero difference measures the observation window, not necessarily a zero-duration model call.',
  },
  {
    observation: 'An SSE response merges multiple observed fragments.',
    sourceBehavior: 'SSEProcessorEvent::to_event uses end_time as the aggregate event timestamp.',
    interpretation: 'Place the merged event at its last observed fragment, not automatically at request start or first token.',
  },
  {
    observation: 'An HTTP parser event is generated from a captured event.',
    sourceBehavior: 'HTTPEvent::to_event preserves original_event.timestamp.',
    interpretation: 'HTTP and SSE event timestamps represent different stages. A naive cross-source subtraction is not a guaranteed request latency.',
  },
  {
    observation: 'An accumulator goes idle for more than 30,000 normalized milliseconds.',
    sourceBehavior: 'The tracing pipeline configures SSEProcessor::new_with_timeout(30000) and compares event timestamps to last_update.',
    interpretation: 'Pending assembly state can be evicted. A later fragment may no longer belong to the same accumulated observation.',
  },
  {
    observation: 'The SSE processor reaches its 1,024-buffer cap.',
    sourceBehavior: 'It evicts the entry with the oldest last_update.',
    interpretation: 'Observed span continuity can be limited by capacity, not only by a true protocol boundary.',
  },
  {
    observation: 'A trace combines native agent records and Linux system probes.',
    sourceBehavior: 'The Linux pipeline normalizes eBPF timestamps; provider-native session data has independent provenance.',
    interpretation: 'Verify clock origin and field units before comparing layers. Similar-looking timestamps do not establish complete end-to-end causality.',
  },
] as const;

const references = [
  ['Linux SSL probe timestamp source', sourceRoot + '/bpf/sslsniff.bpf.c'],
  ['Boot-time to Unix-epoch millisecond conversion and tests', sourceRoot + '/agentsight-capture/src/time.rs'],
  ['TimestampNormalizer and its tests', sourceRoot + '/ext/analysis/src/analyzers/timestamp_normalizer.rs'],
  ['Actual SSL, HTTP and SSE analyzer ordering', sourceRoot + '/collector/src/cmd_trace.rs'],
  ['SSE accumulator lifecycle, timeout, buffer cap, and duration calculation', sourceRoot + '/ext/analysis/src/analyzers/sse_processor.rs'],
  ['Serialized SSE/HTTP event fields and output timestamps', sourceRoot + '/ext/analysis/src/analyzers/protocol_events.rs'],
  ['Canonical view timestamp_ms assignment', sourceRoot + '/ext/analysis/src/view/canonical.rs'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function TraceTimestampSemanticsArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'What AgentSight trace timestamps and SSE durations really mean',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-11-09',
    dateModified: '2026-11-09',
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
            <span aria-current="page">Trace timestamp semantics</span>
          </nav>
          <Eyebrow>Trace timing semantics · AgentSight v1.0.35 · 9 November 2026</Eyebrow>
          <h1>What AgentSight trace timestamps and SSE durations really mean</h1>
          <p className="hero-lede">
            A displayed agent event timestamp is not interchangeable with a raw eBPF timestamp,
            an SSE fragment window, or full model latency. In the v1.0.35 Linux TLS pipeline,
            <strong> raw boot-time nanoseconds become Unix-epoch milliseconds before SSE
            aggregation</strong>. One resulting field, <code>duration_ns</code>, is calculated
            from those milliseconds without converting the units back.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Direct answer: identify the timebase before computing latency</h2>
              <p>
                The SSL eBPF probes capture <code>bpf_ktime_get_ns()</code> timestamps.
                <code> TimestampNormalizer</code> replaces an event&apos;s timestamp with
                <code> boot_time_seconds × 1000 + floor(boot_nanoseconds / 1,000,000)</code>.
                Downstream HTTP and SSE analyzers in <code>collector/src/cmd_trace.rs</code>
                therefore receive epoch-based <em>milliseconds</em>, not boot-time nanoseconds.
                The canonical view also names its resulting field <code>timestamp_ms</code>.
              </p>
              <p>
                A source-level audit of the released <strong>AgentSight v1.0.35</strong> at
                <code> {productCommit}</code> finds that <code>SSEProcessor</code> subtracts its
                normalized <code>end_time</code> and <code>start_time</code> directly, but serializes
                the answer as <code>duration_ns</code>. In this traced path, the number is an
                <strong> interval in milliseconds despite the nanosecond-looking name</strong>.
                That is a unit-contract discrepancy in the inspected implementation, not a new
                benchmark or a claim that every AgentSight export uses the same calculation.
              </p>
              <p>
                For a different question—how AgentSight decides which request and response belong
                together—see <Link href="/blog/how-agentsight-correlates-http-exchanges/">
                HTTP exchange correlation</Link>. For missing fragments and unreliable completeness,
                see <Link href="/blog/how-agentsight-reports-capture-loss/">capture-loss evidence</Link>.
                Neither page is a substitute for checking the time unit of a derived duration.
              </p>
            </section>

            <section>
              <h2>Follow the timestamp through four implementation layers</h2>
              <ol>
                <li>
                  <strong>Probe:</strong> the Linux TLS instrumentation records a boot-relative
                  <code> timestamp_ns</code> from <code>bpf_ktime_get_ns()</code>. This is not
                  Unix epoch time.
                </li>
                <li>
                  <strong>Conversion:</strong> <code>boot_ns_to_epoch_ms()</code> obtains boot time
                  in whole epoch seconds (cached via <code>OnceLock</code>), then adds the
                  integer millisecond offset. This drops sub-millisecond precision. It uses a
                  fallback based on current epoch time and system uptime if direct boot-time
                  discovery does not yield a positive value.
                </li>
                <li>
                  <strong>Analyzer ordering:</strong> <code>configure_ssl_runner()</code> attaches
                  <code> TimestampNormalizer</code> before the two SSE passes, HTTP parsing,
                  decompression and filtering. Its process and stdio runner paths also attach
                  the normalizer, but native agent transcript fields have their own source semantics.
                </li>
                <li>
                  <strong>Derived event:</strong> <code>SSEProcessor</code> records its first and
                  latest observed fragment timestamps and emits an SSE event. Multiple-fragment
                  output is timestamped at the last fragment; its numeric <code>duration_ns</code>
                  is the nonnegative difference of normalized timestamps. The HTTP event path
                  preserves the timestamp of its original triggering event.
                </li>
              </ol>
              <p>
                These steps are tied to the specific Linux SSL trace analyzer path in the inspected
                commit. They are <strong>not</strong> a promise of synchronized clocks across
                machines, agents, containers or different native-log providers. Normalization gives
                an epoch-like coordinate for a stream; it does not create missing observations.
              </p>
            </section>

            <section>
              <h2>Ten interpretation cases from the implementation</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '840px', fontSize: '0.91rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Observed or synthetic input</th>
                      <th style={header}>Source behavior</th>
                      <th style={header}>Safe inference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((row) => (
                      <tr key={row.observation}>
                        <td style={cell}>{row.observation}</td>
                        <td style={cell}>{row.sourceBehavior}</td>
                        <td style={cell}>{row.interpretation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                The numerical examples are <strong>synthetic arithmetic inputs</strong>, not
                measurements from a real agent or evidence of a particular user&apos;s latency.
                The source documents unit conversion and assembler behavior; the table separates
                that behavior from broader performance conclusions.
              </p>
            </section>

            <section>
              <h2>Worked example: a thousand milliseconds labeled as nanoseconds</h2>
              <p>
                Suppose an SSE processor receives two normalized event timestamps:
                <code> 1,780,000,000,000 ms</code> and <code>1,780,000,001,000 ms</code>.
                The accumulator sets <code>start_time</code> to the first and
                <code> end_time</code> to the second. The calculation currently written in
                <code> sse_processor.rs</code> is
                <code> end_time.saturating_sub(start_time)</code>, producing
                <code> 1000</code>. The serialized name is <code>duration_ns</code>.
              </p>
              <p>
                The correct physical interpretation of that numeric difference in this pipeline
                is <strong>1,000 milliseconds (one second)</strong>; were it actually expressed in
                nanoseconds, the corresponding value would be <code>1,000,000,000</code>.
                Treating the field name as a unit contract would make the interval appear
                a million times shorter. The example demonstrates the source arithmetic only,
                not the time between an agent&apos;s prompt and its final response.
              </p>
              <p>
                This mismatch is an implementation finding for v1.0.35. It should be corrected or
                explicitly normalized by downstream consumers before they compute cross-source
                latency. Do not silently rename the number without checking which AgentSight
                version and analyzer produced it.
              </p>
            </section>

            <section>
              <h2>Why an SSE interval is not a model-latency measurement</h2>
              <p>
                The SSE accumulator&apos;s <code>start_time</code> is the first <em>captured fragment
                that entered this accumulator</em>, not necessarily the point at which the user
                submitted a prompt, the client sent its request, or the provider began generating.
                Its <code>end_time</code> is the last observed fragment before the derived event is
                emitted. A single observed fragment can yield a zero interval despite nonzero
                network, queueing and inference time.
              </p>
              <p>
                The inspected trace path sets <code>new_with_timeout(30000)</code> and evicts
                stale accumulators by comparing normalized event timestamps to
                <code> last_update</code>. It also caps concurrent accumulator entries at 1,024
                and drops the least recently updated one when over capacity. Missing capture
                events, fragmented HTTP, altered TLS support, process attachment limits and
                incomplete protocol reconstruction can all change the observed window.
                A final timestamp is not proof of a provider-side finish reason.
              </p>
              <p>
                To estimate actual request latency, prefer an instrumented request/response
                pair with a defined start and end, or correlate independently captured HTTP events
                while honoring the <Link href="/blog/how-agentsight-correlates-http-exchanges/">
                connection and stream matching rules</Link>. AgentSight&apos;s system boundary data
                can supply useful independent evidence, but it cannot reconstruct unobserved time
                segments simply from a merged SSE record.
              </p>
            </section>

            <section>
              <h2>Reproduce the source audit without private traces</h2>
              <p>
                Check out the exact product commit, then inspect the definitions and call ordering
                below. These commands read public source and print code locations; they do not
                attach probes, require elevated privileges or collect personal agent traffic.
              </p>
              <pre style={{ overflowX: 'auto' }}><code>{'git clone https://github.com/eunomia-bpf/agentsight.git\ncd agentsight\ngit checkout c1574366122a90c451bca6a84713e28813ab95e2\n\nrg -n "bpf_ktime_get_ns|timestamp_ns" bpf/sslsniff.bpf.c\nrg -n "boot_ns_to_epoch_ms|1_000_000|BOOT_TIME_SECS" agentsight-capture/src/time.rs\nrg -n "boot_ns_to_epoch_ms|event.timestamp" ext/analysis/src/analyzers/timestamp_normalizer.rs\nrg -n "TimestampNormalizer|new_with_timeout\\(30000\\)|add_http_analyzers" collector/src/cmd_trace.rs\nrg -n "start_time: event.timestamp|end_time: event.timestamp|duration_ns:|timeout_ms|MAX_BUFFERS" ext/analysis/src/analyzers/sse_processor.rs\nrg -n "event_count > 1|original_event.timestamp|self.end_time" ext/analysis/src/analyzers/protocol_events.rs'}</code></pre>
              <p>
                Then perform the unit calculation yourself: convert raw boot-relative nanoseconds
                to epoch milliseconds as in <code>time.rs</code>; subtract two resulting integer
                timestamps; compare that number with the value assigned to <code>duration_ns</code>.
                The code contains unit tests for timestamp conversion, but this article does not
                claim to have run a complete live TLS-capture integration test.
              </p>
            </section>

            <section>
              <h2>Limits and practical review checklist</h2>
              <p>
                The result depends on the inspected v1.0.35 commit and analyzer ordering.
                A different producer may emit different time fields, and the same word
                <code> duration</code> may refer to a span, session, process lifetime or
                reconstruction window. The boot-time conversion uses whole-second boot-time
                estimates and integer milliseconds; do not assume microsecond fidelity or exact
                behavior through wall-clock corrections. A mixed stream may also contain native
                provider records without a shared timing contract.
              </p>
              <p>
                When investigating an apparently impossible duration: identify the emitting
                event <code>source</code>; inspect the producer&apos;s timestamp origin; confirm
                the normalization step that ran before aggregation; compare start/end field units;
                check capture-loss and correlation markers; and only then plot or aggregate the
                interval. A unit label is an interface claim worth testing, not stronger evidence
                than the source calculation.
              </p>
              <p>
                Do not upload captured prompts, headers, credentials or private paths when reporting
                a timing discrepancy. A small synthetic pair of timestamps and an exact source
                revision are sufficient to reproduce this particular arithmetic observation.
              </p>
            </section>

            <section>
              <h2>Primary sources</h2>
              <p>
                All implementation statements are pinned to AgentSight product commit
                <code> {productCommit}</code> for the v1.0.35 release, reviewed
                9 November 2026. This page contains source-derived arithmetic and analysis, not
                a newly measured latency benchmark or a claim about every agent runtime.
              </p>
              <ul>{references.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
              <p>
                For the complementary evidence path, read
                <Link href="/blog/how-agentsight-correlates-http-exchanges/"> HTTP exchange matching</Link>,
                <Link href="/blog/how-agentsight-reports-capture-loss/"> capture reliability</Link>,
                and <Link href="/security/"> local telemetry handling</Link>. Setup and CLI
                flags are maintained in the
                <a href="https://eunomia.dev/agentsight/"> canonical AgentSight documentation</a>.
              </p>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
