import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;
const articlePath = '/blog/why-agentsight-compressed-http-responses-stay-encoded/';

export const metadata: Metadata = {
  title: 'Why a captured HTTP response can still look compressed in AgentSight',
  description:
    'Inspect v1.0.35 gzip, deflate, Brotli and Zstandard decoding, truncated-response safeguards, byte fidelity, SSE ordering, and a source-test diagnostic.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'Why a captured HTTP response can still look compressed in AgentSight',
    description:
      'A source-pinned guide to what AgentSight decodes, what it intentionally leaves untouched, and why missing readable model output is not proof of missing network activity.',
    url: articlePath,
  },
};

const cases = [
  {
    input: 'Complete gzip or x-gzip HTTP response',
    treatment: 'Decodes with the gzip reader and sets decompressed metadata on success.',
    interpretation: 'Readable body is a derived representation, not a replacement for TLS capture provenance.',
  },
  {
    input: 'Complete deflate response',
    treatment: 'Tries zlib-wrapped deflate first, then raw deflate.',
    interpretation: 'The same HTTP encoding label can cover two byte layouts in this decoder.',
  },
  {
    input: 'Complete br or brotli response',
    treatment: 'Uses the Brotli decompressor.',
    interpretation: 'Successful decoding depends on complete and valid input bytes.',
  },
  {
    input: 'Complete zstd or zstandard response',
    treatment: 'Decodes a Zstandard stream.',
    interpretation: 'The implementation recognizes both listed spellings.',
  },
  {
    input: 'body_truncated is true',
    treatment: 'Returns the HTTP event unchanged before attempting decoding.',
    interpretation: 'An encoded prefix is evidence of incomplete capture, not of a healthy full response.',
  },
  {
    input: 'Corrupt compressed input or unsupported encoding',
    treatment: 'Preserves the original event when decoding fails or the label is unrecognized.',
    interpretation: 'No decompressed flag is not, by itself, a missing-response verdict.',
  },
  {
    input: 'Chunked encoded body',
    treatment: 'Attempts chunked transfer decoding before decompression; falls back to original bytes if transfer decoding fails.',
    interpretation: 'Transfer framing and content compression are separate transformations.',
  },
  {
    input: 'Compressed bytes with non-UTF-8 octets',
    treatment: 'Prefers body_hex as the byte source; on success, writes new body_hex and a lossy text body.',
    interpretation: 'Inspect bytes rather than relying on rendered Unicode for binary fidelity.',
  },
  {
    input: 'Raw SSL event, request event, or non-HTTP-parser event',
    treatment: 'Does not run response-body decompression on the event.',
    interpretation: 'Probe success alone does not imply an HTTP response reached this analyzer.',
  },
  {
    input: 'Multiple Content-Encoding values',
    treatment: 'Reads only the first comma-separated token.',
    interpretation: 'Do not assume a layered encoding sequence was fully decoded.',
  },
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

const references = [
  ['HTTPDecompressor implementation and eight focused unit tests', sourceRoot + '/ext/analysis/src/analyzers/http_decompressor.rs'],
  ['Production analyzer ordering', sourceRoot + '/collector/src/cmd_trace.rs'],
  ['HTTP parser limits and truncation state', sourceRoot + '/ext/analysis/src/analyzers/http_parser.rs'],
  ['TLS plaintext byte fidelity and loss contract', sourceRoot + '/docs/ssl-capture.md'],
  ['HTTP connection and stream correlation design', sourceRoot + '/ext/analysis/docs/http-correlation.md'],
  ['SSE response parsing and identity deferral', sourceRoot + '/ext/analysis/src/analyzers/sse_processor.rs'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function CompressedHttpResponsesArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Why a captured HTTP response can still look compressed in AgentSight',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-10-29',
    dateModified: '2026-10-29',
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
            <span aria-current="page">Compressed HTTP evidence</span>
          </nav>
          <Eyebrow>HTTP decoding limits · AgentSight v1.0.35 · 29 October 2026</Eyebrow>
          <h1>Why a captured HTTP response can still look compressed in AgentSight</h1>
          <p className="hero-lede">
            TLS plaintext is not necessarily readable model text. An HTTP response may still carry
            gzip, deflate, Brotli or Zstandard compression, and the captured bytes may be
            incomplete. AgentSight has a dedicated response decompressor, but it deliberately
            preserves truncated or undecodable events. An encoded body is therefore a debugging
            signal—not proof that the agent made no model call.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Direct answer: separate capture, HTTP parsing, decompression and SSE interpretation</h2>
              <p>
                In the released <code>v1.0.35</code> collector, <code>add_http_analyzers</code>
                installs an identity-aware SSE pass, then <code>HTTPParser</code>,
                <code>HTTPDecompressor</code>, a second SSE pass, optional HTTP filters and
                authorization-header removal. The decompressor only modifies
                <code> source=&quot;http_parser&quot;</code> events whose
                <code> message_type=&quot;response&quot;</code>. It neither decrypts TLS
                nor reconstructs missing transport bytes.
              </p>
              <p>
                This is a source-level analysis pinned to product commit
                {' '}<code>{productCommit}</code>, reviewed 29 October 2026. It synthesizes
                first-party parser and decompressor tests; it does not claim that a new network
                experiment was performed for this article.
              </p>
            </section>

            <section>
              <h2>The codec matrix: exactly what is recognized</h2>
              <p>
                The <code>Content-Encoding</code> header is compared case-insensitively.
                The decoder normalizes its first comma-delimited value to lowercase, accepting
                <code> gzip</code>, <code>x-gzip</code>, <code>deflate</code>,
                <code> br</code>, <code>brotli</code>, <code>zstd</code> and
                <code> zstandard</code>. The source tests exercise gzip, both
                deflate wrappers, Brotli and Zstandard with constructed compressed bodies.
                An unrecognized or absent encoding leaves the event untouched.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '820px', fontSize: '0.9rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Observed input</th>
                      <th style={header}>Released implementation</th>
                      <th style={header}>Interpretation boundary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((item) => (
                      <tr key={item.input}>
                        <td style={cell}>{item.input}</td>
                        <td style={cell}>{item.treatment}</td>
                        <td style={cell}>{item.interpretation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                This is a ten-case implementation reference, not a compatibility benchmark.
                In particular, taking only the first encoding token is not equivalent to
                recursively decoding every layer of a stacked
                <code> Content-Encoding</code> header.
              </p>
            </section>

            <section>
              <h2>What changes on a successful decode—and what does not</h2>
              <p>
                The analyzer obtains compressed bytes from <code>body_hex</code> when it
                can decode that field; otherwise it falls back to <code>body</code>.
                If HTTP transfer framing is chunked, it first attempts to remove chunk
                framing. Successful content decoding writes a new <code>body_hex</code>,
                a UTF-8-lossy <code>body</code>, <code>has_body</code>,
                <code>decompressed=true</code>, <code>original_content_encoding</code>
                and <code>decompressed_body_size</code>. It also sets the event
                <code> content_length</code> to the decompressed byte length and removes
                the old content-encoding and content-length HTTP headers.
              </p>
              <p>
                That transformed <code>content_length</code> is an output-body size,
                not evidence that the server advertised that number on the wire.
                The test checks that transport metadata such as
                <code> transport_handle</code>, <code>capture_fragment_count</code>,
                <code>capture_original_len</code> and
                <code> capture_metadata_complete</code> survive decoding.
                The raw TLS data and the parsed/decoded HTTP response remain different
                evidence layers.
              </p>
            </section>

            <section>
              <h2>Why truncated compression is intentionally left untouched</h2>
              <p>
                AgentSight&apos;s HTTP/1.1 parser has a one-megabyte message-prefix limit,
                and its documented TLS record capture has a separate limit. When
                <code> body_truncated=true</code> is set, the response decoder returns
                immediately; decoding partial compressed bytes could misrepresent both
                data and length. Other failed decode attempts also preserve the event,
                without adding <code>decompressed=true</code>.
              </p>
              <p>
                A useful diagnostic order is: verify a TLS event with correct byte
                provenance; verify that the HTTP parser emitted a response; inspect
                <code> body_truncated</code> and
                <code> body_truncation_reason</code>; read the
                <code> content-encoding</code> value; then look for
                <code> decompressed</code> and <code>original_content_encoding</code>.
                If one of those steps fails, it is too early to conclude the model returned
                an empty answer. A body prefix may be preserved even when the remainder
                was not captured.
              </p>
            </section>

            <section>
              <h2>Why ordering matters for streaming model output</h2>
              <p>
                The later SSE processor receives the result of HTTP parsing and
                decompression. Thus a complete compressed <code>text/event-stream</code>
                response can become parseable SSE text before response-level extraction.
                For captures with exact transport identity, the earlier SSE pass defers
                interpretation to the HTTP parser so concurrent connections are not
                collapsed onto a legacy process/thread key. The presence of an SSE
                fragment alone does not prove a complete model exchange, reliable
                accounting, or absence of capture loss.
              </p>
              <p>
                Pairing and stream identity are separate questions handled by the
                {' '}<Link href="/blog/how-agentsight-correlates-http-exchanges/">HTTP exchange correlation reference</Link>.
                The present page answers the narrower question of <em>body decoding
                fidelity</em>, not which HTTP request a response belongs to.
              </p>
            </section>

            <section>
              <h2>A reproducible, data-free source check</h2>
              <p>
                To audit the released behavior without collecting anyone&apos;s model
                traffic, check out the pinned product source and run its existing
                decompressor unit tests. The tests construct gzip, zlib/raw-deflate,
                Brotli, Zstandard and truncated synthetic HTTP events; they also
                exercise request pass-through and byte-source priority.
              </p>
              <pre><code>{"git clone https://github.com/eunomia-bpf/agentsight.git\ncd agentsight\ngit checkout c1574366122a90c451bca6a84713e28813ab95e2\ncargo test --manifest-path ext/analysis/Cargo.toml http_decompressor::tests"}</code></pre>
              <p>
                This is a suggested reproducibility procedure, not a command execution
                performed for this publication. A passing unit test confirms these
                analyzer cases under its build environment; it does not establish
                end-to-end probe support for every runtime, kernel, agent or API server.
                The <a href="https://eunomia.dev/agentsight/">canonical documentation</a>
                owns installation and command reference details.
              </p>
            </section>

            <section>
              <h2>Evidence limits and safe handling</h2>
              <p>
                The decoder does not repair missing TLS data, guarantee arbitrary
                compression nesting, make binary response bodies lossless in text form,
                or infer agent intent from transport bytes. A missing decoded message
                may result from attachment, capture, HTTP parsing, compression, SSE
                parsing, or subsequent materialization; isolate the layer before
                deciding where failure occurred.
              </p>
              <p>
                Captures may include model prompts, responses, headers, file paths
                and remote endpoints. Reproduce with synthetic payloads or scrubbed
                local evidence; do not upload plaintext captures or secrets to
                a public issue. For TLS target selection in Docker, see the
                {' '}<Link href="/blog/docker-agent-tls-process-discovery/">container discovery study</Link>.
              </p>
            </section>

            <section>
              <h2>Primary references</h2>
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
