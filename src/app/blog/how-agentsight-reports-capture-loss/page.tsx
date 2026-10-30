import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/how-agentsight-reports-capture-loss/';
const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;

export const metadata: Metadata = {
  title: 'When AgentSight traces go missing: truncation, event loss, and evidence limits',
  description:
    'Distinguish clipped TLS payloads from lost ring-buffer events in AgentSight v1.0.35. Read capture counters, nullable provenance, HTTP quarantine, and FILE_OPEN_LOST correctly.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'When AgentSight traces go missing: truncation, event loss, and evidence limits',
    description:
      'A source-pinned diagnostic reference for TLS capture loss, retained byte prefixes, and what incomplete agent traces can prove.',
    url: articlePath,
  },
};

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };
const cases = [
  {
    evidence: 'TLS event has len=600000, buf_size=262144 and truncated=true',
    mechanism: 'One SSL operation emitted a retained prefix bounded by the 256 KiB probe buffer.',
    conclusion: 'There are 337856 missing bytes from this operation, but an event was emitted.',
  },
  {
    evidence: 'A later TLS event raises ringbuf_reserve_failures from 2 to 5',
    mechanism: 'The tracer-wide cumulative ring-buffer reservation-failure counter increased.',
    conclusion: 'Three reservations failed in that interval; no per-connection payload attribution is possible.',
  },
  {
    evidence: 'CAPTURE_LOSS appears during graceful shutdown',
    mechanism: 'The tracer reports an increased cumulative counter after draining the ring buffer.',
    conclusion: 'Whole events were missed; the record does not identify their contents or connections.',
  },
  {
    evidence: 'No final CAPTURE_LOSS after SIGKILL or host failure',
    mechanism: 'Abrupt termination bypasses the graceful final-counter reporting path.',
    conclusion: 'Absence of a final record is not proof that the preceding capture was lossless.',
  },
  {
    evidence: 'capture_bytes_lost=10 and ringbuf_reserve_failures_delta=3',
    mechanism: 'The first value sums clipped bytes in observed fragments; the second compares tracer-wide snapshots.',
    conclusion: 'Different units and scopes: do not add them or call three missing HTTP responses.',
  },
  {
    evidence: 'capture_truncated=null or capture_metadata_complete=false',
    mechanism: 'Older or incomplete fragments lack required provenance or length fields.',
    conclusion: 'Unknown is not false. Do not advertise a complete transport observation.',
  },
  {
    evidence: 'capture_identity_consistent=false',
    mechanism: 'Contributing fragments disagree on transport/process/library identity.',
    conclusion: 'The derived identity fields are cleared; do not attribute the exchange to a single TLS handle.',
  },
  {
    evidence: 'capture_tids_truncated=true',
    mechanism: 'The analyzer lists at most 64 distinct contributing thread IDs.',
    conclusion: 'The thread list is not exhaustive even if capture_tid_count is greater than 64.',
  },
  {
    evidence: 'HTTP correlation terminates after loss-counter movement',
    mechanism: 'The parser invalidates pending state for all active connections rather than guessing byte order.',
    conclusion: 'An unlinked response can reflect defensive matching, not a confirmed missing model call.',
  },
  {
    evidence: 'FILE_OPEN_LOST with count=4',
    mechanism: 'The separate process tracer reports a delta of lost file-open probe events/recursion misses.',
    conclusion: 'This is not TLS CAPTURE_LOSS and reveals no missed paths or exact file-open frequencies.',
  },
] as const;

const references = [
  ['TLS JSONL, loss counters, aggregate field semantics, and shutdown limitations', sourceRoot + '/bpf/README.md'],
  ['Fixed-sized SSL record and ring-buffer design', sourceRoot + '/bpf/sslsniff.h'],
  ['BPF reservation-failure accounting', sourceRoot + '/bpf/sslsniff.bpf.c'],
  ['Raw tracer output, shutdown loss record, and output sequence semantics', sourceRoot + '/bpf/sslsniff.c'],
  ['Aggregate capture metadata and source-level regression cases', sourceRoot + '/ext/analysis/src/analyzers/capture_metadata.rs'],
  ['HTTP state invalidation after truncation or ring-buffer loss', sourceRoot + '/ext/analysis/docs/http-correlation.md'],
  ['Process tracer FILE_OPEN_LOST output and counter aggregation', sourceRoot + '/bpf/process.c'],
  ['Byte fidelity and HTTP/1.1 prefix limits', sourceRoot + '/docs/ssl-capture.md'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function CaptureLossEvidenceArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'When AgentSight traces go missing: truncation, event loss, and evidence limits',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-10-30',
    dateModified: '2026-10-30',
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
            <span aria-current="page">Capture-loss evidence</span>
          </nav>
          <Eyebrow>Trace reliability · AgentSight v1.0.35 · 30 October 2026</Eyebrow>
          <h1>When AgentSight traces go missing: truncation, event loss, and evidence limits</h1>
          <p className="hero-lede">
            Missing model text or a gap in a system audit does not have a single explanation.
            A TLS record may be emitted with fewer bytes than the SSL operation returned, a ring-buffer
            reservation may fail before any event exists, or older records may lack the metadata
            needed to evaluate completeness. AgentSight exposes different signals for each case.
            None of them proves that an unobserved action never happened.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Direct answer: distinguish missing bytes from missing events</h2>
              <p>
                In the released Linux TLS tracer, <code>len</code> records the length returned by
                an SSL read/write operation, while <code>buf_size</code> records the bytes copied into
                the BPF event. A positive difference sets <code>truncated=true</code> and
                <code> bytes_lost</code>: a prefix exists. By contrast, a failed
                <code> bpf_ringbuf_reserve</code> cannot create an event; it increments a
                tracer-wide <code>ringbuf_reserve_failures</code> counter instead.
              </p>
              <p>
                These are different failure domains. Per-operation truncation has a byte count
                but no missing event; a reservation failure has a failed-reservation count but
                no reconstructable payload or connection. A parser may also decline to correlate
                otherwise visible fragments when their framing or identity is no longer reliable.
              </p>
              <p>
                This analysis is pinned to AgentSight <strong>v1.0.35</strong>, product commit
                {' '}<code>{productCommit}</code>, reviewed 30 October 2026. It uses first-party
                source and synthetic unit tests, not a newly performed host-capture benchmark.
              </p>
            </section>

            <section>
              <h2>Why the two loss counters cannot be combined</h2>
              <p>
                The TLS probe reserves a fixed-size BPF event, with a 256 KiB plaintext buffer
                and a 16 MiB ring buffer in this version. An oversized SSL operation can emit
                its first 256 KiB with a truncation marker. If the reservation itself fails,
                however, the event never enters the ring. Successful events carry a snapshot of
                the cumulative failed-reservation counter. On graceful SIGINT or SIGTERM shutdown,
                the tracer reads that counter again and emits a minimal
                <code> CAPTURE_LOSS</code> record if failures occurred since the last reported
                snapshot. Abrupt termination cannot use that final reporting path.
              </p>
              <p>
                Importantly, <code>CAPTURE_LOSS</code> is a tracer-wide cumulative signal, not
                a missing HTTP-request counter. A rise from two to five means three additional
                failed reservations in the observed interval; it does not tell which TLS handle,
                model request, or agent thread generated them. The
                <code> capture_seq</code> field orders emitted JSONL records in userspace,
                not kernel execution, and should not be treated as a lost-event oracle.
              </p>
            </section>

            <section>
              <h2>Ten situations and the safest inference</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '840px', fontSize: '0.9rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>What you observe</th>
                      <th style={header}>What the implementation does</th>
                      <th style={header}>What you can conclude</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((item) => (
                      <tr key={item.evidence}>
                        <td style={cell}>{item.evidence}</td>
                        <td style={cell}>{item.mechanism}</td>
                        <td style={cell}>{item.conclusion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                The matrix is a versioned interpretation reference. It is not an empirical
                distribution of loss causes or a guarantee that every probe attachment succeeds.
              </p>
            </section>

            <section>
              <h2>A source-tested example: ten clipped bytes versus three failed reservations</h2>
              <p>
                The source-level <code>CaptureMetadataAccumulator</code> test deliberately combines
                two synthetic TLS fragments. The first has <code>len=100</code>,
                <code> buf_size=90</code>, <code>truncated=true</code>,
                <code> bytes_lost=10</code>, and a failure-counter snapshot of two. The
                second has <code>len=50</code>, <code>buf_size=50</code>, no truncation,
                and a failure-counter snapshot of five.
              </p>
              <p>
                Its asserted aggregate is <code>capture_fragment_count=2</code>,
                <code> capture_original_len=150</code>,
                <code> capture_captured_len=140</code>,
                <code> capture_bytes_lost=10</code>, and
                <code> ringbuf_reserve_failures_delta=3</code>. The 10 is clipped
                plaintext bytes in the two <em>observed</em> fragments. The three is a
                difference between tracer-wide cumulative reservation counts. Neither proves
                that three messages or three requests were missing from this particular exchange.
              </p>
              <p>
                The same source tests demonstrate two other defensive behaviors. Conflicting
                TLS identities clear the derived handle, process discriminator and library
                rather than silently choosing one. Missing lengths cause nullable aggregate
                totals and <code>capture_metadata_complete=false</code>; legacy fragments
                remain readable but do not gain invented completeness. A separate test supplies
                70 thread IDs and confirms the serialized list is capped at 64 while retaining
                the larger count and a truncation flag.
              </p>
            </section>

            <section>
              <h2>Why a captured HTTP response can still become unlinked</h2>
              <p>
                A truncated TLS record can leave AgentSight with a usable HTTP/1.1 header and body
                prefix but not the full declared body. The parser emits a marked record with
                <code> body_truncated</code>, <code>body_truncation_reason</code>, and
                <code> body_captured_bytes</code> rather than pretending it saw the entire response.
                When a declared Content-Length and the missing byte count permit exact skipping,
                the parser can attempt to resume at a later message. Unknown or chunked framing
                and some oversize losses make that realignment unsafe.
              </p>
              <p>
                A changed global ring-buffer failure counter invalidates pending parser state
                for all active HTTP connections, deliberately sacrificing matching coverage
                instead of guessing HTTP/1.1 FIFO position or HTTP/2 compression state.
                A resulting unlinked exchange is therefore not evidence that its peer failed
                to send a response. The separate
                {' '}<Link href="/blog/how-agentsight-correlates-http-exchanges/">HTTP correlation study</Link>
                {' '}explains connection identity and stream matching; this page explains how
                to assess whether the underlying observation is complete enough to rely on.
              </p>
            </section>

            <section>
              <h2>File-open drops are a third, independent signal</h2>
              <p>
                AgentSight&apos;s Linux process tracer reports <code>FILE_OPEN_LOST</code>
                from a per-CPU dropped-event counter and, where available, BPF program recursion
                misses. Its JSON <code>count</code> is the increase since the last report,
                not the cumulative TLS reservation counter. It contains no missing pathname.
                The ordinary <code>FILE_OPEN</code> stream is also deduplicated by process,
                file identity, access and overlay layer: fewer rows do not imply a matching number
                of missing open syscalls.
              </p>
              <p>
                Keep this distinction when comparing model traffic and file effects. A clean
                TLS capture does not certify complete file tracing, and a file-drop warning
                does not establish missing TLS content. See the
                {' '}<Link href="/blog/what-agentsight-file-open-events-prove/">file-open evidence reference</Link>
                {' '}for resolved-path hooks, older syscall fallbacks, and duplicate suppression.
              </p>
            </section>

            <section>
              <h2>Reproduce the counter interpretation without recording private traffic</h2>
              <p>
                The pinned repository contains synthetic Rust unit tests for fragment lengths,
                counter snapshots, conflicting identity, thread-list limits, and legacy fields.
                To inspect this behavior without live model prompts or packet capture, check out
                that exact product commit and run the relevant unit tests:
              </p>
              <pre><code>{[
                'git clone https://github.com/eunomia-bpf/agentsight.git',
                'cd agentsight',
                'git checkout c1574366122a90c451bca6a84713e28813ab95e2',
                'cargo test --manifest-path ext/analysis/Cargo.toml capture_metadata',
              ].join('\n')}</code></pre>
              <p>
                This is a proposed source-only reproduction, <strong>not</strong> a test run
                executed for this publication. Passing it would establish the tested analyzer
                contracts in that build environment, not event-capture completeness under
                a particular kernel, TLS implementation, ring-buffer load, or process scope.
              </p>
            </section>

            <section>
              <h2>A practical incident-review checklist and its limits</h2>
              <p>
                First identify the capture mode, target process scope and TLS attachment path;
                no capture counter detects a library that was never attached. Next inspect raw
                <code> len</code>, <code>buf_size</code>, and <code>truncated</code> on observed
                records; then examine cumulative <code>ringbuf_reserve_failures</code>
                snapshots and any final <code>CAPTURE_LOSS</code>. For derived records, preserve
                nullable <code>capture_truncated</code>, <code>capture_metadata_complete</code>,
                identity-consistency and fragment metadata. Finally, distinguish HTTP parser
                quarantine from an actual absent model call and independently check
                <code>FILE_OPEN_LOST</code> if file evidence matters.
              </p>
              <p>
                A zero observed loss delta does not establish that an entire session was recorded.
                Unsupported or unattached TLS paths, filters, process exits, missing legacy
                fields, abrupt termination, scheduling delays, and sampling can all leave gaps
                not reconstructed by these counters. Raw captures can contain prompts, responses,
                headers, paths, and endpoints; use synthetic examples or appropriately redacted
                internal evidence rather than uploading private traces publicly. For row-level
                lineage from native sessions versus live capture, consult the
                {' '}<Link href="/blog/read-agentsight-audit-provenance/">audit provenance reference</Link>.
              </p>
            </section>

            <section>
              <h2>Primary implementation references</h2>
              <p>
                Every asserted implementation detail above is pinned to the stated release.
                The <a href="https://eunomia.dev/agentsight/">canonical AgentSight documentation</a>
                owns current installation and command details; this article focuses on evidence
                interpretation and explicitly does not claim an end-to-end measurement.
              </p>
              <ul>
                {references.map(([label, href]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
