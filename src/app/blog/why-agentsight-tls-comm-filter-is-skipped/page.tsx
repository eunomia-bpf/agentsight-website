import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/why-agentsight-tls-comm-filter-is-skipped/';
const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;

export const metadata: Metadata = {
  title: 'Why AgentSight sometimes skips the TLS command filter',
  description: 'A source-pinned v1.0.35 explanation of thread names, static TLS ELF attachment, process-versus-SSL filters, Node discovery and the privacy limits of broader TLS capture.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'Why AgentSight sometimes skips the TLS command filter',
    description: 'Why a filtered agent process can still need an unfiltered TLS probe, with a reproducible argument matrix and safe checks.',
    url: articlePath,
  },
};

const cell = { border: '1px solid #d8dee8', padding: '0.7rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

const cases = [
  {
    config: 'comm=python; no pinned SSL ELF',
    ssl: '-c python is passed to sslsniff',
    process: '-c python is passed to the process probe',
    caution: 'The actual TLS runtime still determines whether a matching SSL call is visible.',
  },
  {
    config: 'comm=claude, binary_path=/path/to/claude',
    ssl: '--binary-path is passed, while -c is omitted',
    process: '-c claude is still passed to the process probe',
    caution: 'A TLS callback may execute on a worker whose kernel comm is HTTP Client.',
  },
  {
    config: 'comm=codex, binary_path=/opt/codex, session_id=4242',
    ssl: 'Only --binary-path from these fields; no --session or -c',
    process: '-c codex and --session 4242 are forwarded',
    caution: 'An ELF uprobe is not equivalent to a PID- or session-scoped data-access guarantee.',
  },
  {
    config: 'comm=codebuddy; no pinned SSL ELF',
    ssl: '-c is omitted by an explicit CodeBuddy exception',
    process: '-c codebuddy is still passed',
    caution: 'A shebang-based CLI may actually execute under the kernel command name node.',
  },
  {
    config: 'comm=node; no binary path, resolver finds embedded SSL',
    ssl: 'The discovered executable is pinned and -c is omitted',
    process: '-c node is still passed',
    caution: 'This is a conditional runtime detection, not a guarantee it finds every Node layout.',
  },
  {
    config: 'comm=python; resolver finds no embedded SSL',
    ssl: 'The normal system-library path retains -c python',
    process: '-c python is still passed',
    caution: 'Dynamic-library instrumentation is a different attachment mode.',
  },
  {
    config: 'comm=claude; no binary path; no resolved embedded SSL',
    ssl: '-c claude can remain, which may miss differently named worker threads',
    process: '-c claude is passed',
    caution: 'Do not interpret an empty TLS result as proof the agent made no request.',
  },
  {
    config: 'binary_path=/opt/codex and ssl_uid=1000',
    ssl: '--binary-path and -u 1000 are passed',
    process: 'Process filters are built independently',
    caution: 'Pinning an ELF does not silently discard the explicit SSL UID filter.',
  },
  {
    config: 'pid=123, session_id absent, no binary path',
    ssl: '-p 123 is forwarded',
    process: '-p 123 is forwarded',
    caution: 'PID-based scope differs from the binary-pinned mode.',
  },
  {
    config: 'pid=123, binary_path=/opt/codex',
    ssl: 'The PID filter is omitted in favor of --binary-path',
    process: '-p 123 remains a process-probe argument',
    caution: 'Do not infer that SSL bytes are limited to just PID 123.',
  },
] as const;

const references = [
  ['v1.0.35 Rust SSL and process argument builders plus regression tests', sourceRoot + '/collector/src/cmd_trace.rs'],
  ['v1.0.35 SSL tracer CLI and static-library attachment limitations', sourceRoot + '/bpf/README.md'],
  ['v1.0.35 product agent runtime and tracer architecture notes', sourceRoot + '/AGENTS.md'],
  ['v1.0.35 binary-path resolution and embedded SSL discovery', sourceRoot + '/collector/src/binary_resolver.rs'],
  ['AgentSight v1.0.35 stable release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function TlsCommFilterArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Why AgentSight sometimes skips the TLS command filter',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-11-05',
    dateModified: '2026-11-05',
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
            <span aria-current="page">TLS command filtering</span>
          </nav>
          <Eyebrow>Linux TLS tracing internals · AgentSight v1.0.35 · 5 November 2026</Eyebrow>
          <h1>Why AgentSight sometimes skips the TLS command filter</h1>
          <p className="hero-lede">
            The process name used to locate an AI agent is not necessarily the Linux thread name executing
            its TLS calls. In AgentSight v1.0.35, a pinned <code>--binary-path</code> causes the
            TLS probe to omit the <code>--comm</code> filter, while the process probe keeps its
            command filter. This avoids losing traffic on worker threads, but it also changes
            what a trace can claim about capture scope.
          </p>
        </div>
      </section>
      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Short answer: the two tracers intentionally use different filters</h2>
              <p>
                AgentSight constructs arguments independently for the <code>sslsniff</code> TLS
                runner and the <code>process</code> runner. A human-readable agent command can
                identify the process family, but <code>bpf_get_current_comm()</code> names the
                current task or worker thread. Claude&apos;s TLS calls can run on an
                <code> HTTP Client</code> thread; filtering TLS events using only
                <code> claude</code> can silently discard the very calls being sought.
              </p>
              <p>
                This article examines <strong>v1.0.35 source at commit <code>{productCommit}</code></strong>.
                It is a static interpretation of executable argument-building and first-party unit
                tests, not a live capture, measured coverage rate, or guarantee for another runtime.
                The question here is <em>which filters are actually sent to each tracer?</em>
                The separate <Link href="/blog/docker-agent-tls-process-discovery/">Docker TLS discovery analysis</Link>
                addresses <em>which binary the container resolver finds</em>.
              </p>
            </section>
            <section>
              <h2>Three mechanisms that explain an apparently inconsistent trace</h2>
              <p>
                <strong>Thread-name mismatch.</strong> A TLS function can execute in a thread
                with a different <code>comm</code> value from the user-visible CLI. That makes
                kernel-task-name filtering dangerous for some threaded or wrapped agent binaries.
                A CodeBuddy launcher is a second example: the CLI may be named CodeBuddy but the
                underlying program may have the task name <code>node</code>.
              </p>
              <p>
                <strong>Executable attachment.</strong> A pinned <code>--binary-path</code> tells
                the TLS tracer which executable should provide the SSL symbols or static-library
                offsets. The Rust builder consequently omits <code>-c</code> and session filtering
                on that SSL runner. It also omits its PID filter in this mode. This is a choice
                about what receives TLS probe events, <strong>not</strong> a promise of per-agent
                exclusivity. The process runner can still receive its own PID, session and command
                filters independently.
              </p>
              <p>
                <strong>Conditional discovery.</strong> Without a pinned ELF, the trace command
                may resolve a single requested command to an executable embedding SSL. When that
                succeeds it sets <code>binary_path</code> before constructing the TLS arguments;
                when it fails, the dynamic-library path retains applicable <code>-c</code>
                filtering. This explains why otherwise similar commands may produce different
                low-level SSL arguments after runtime discovery.
              </p>
            </section>
            <section>
              <h2>Ten concrete source-level cases</h2>
              <p>
                These are derived from <code>build_ssl_args</code>, <code>build_process_args</code>
                and the conditional resolver. They show argument-selection behavior, not a claim
                that a particular run captured plaintext successfully.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '940px', fontSize: '0.92rem' }}>
                  <thead><tr>
                    <th style={header}>Input condition</th><th style={header}>TLS runner</th>
                    <th style={header}>Process runner</th><th style={header}>Interpretation limit</th>
                  </tr></thead>
                  <tbody>{cases.map((item) => (
                    <tr key={item.config}>
                      <td style={cell}>{item.config}</td><td style={cell}>{item.ssl}</td>
                      <td style={cell}>{item.process}</td><td style={cell}>{item.caution}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </section>
            <section>
              <h2>The code and regression tests make the distinction explicit</h2>
              <p>
                The TLS builder first computes whether a binary path is pinned, then gates its
                <code> -p</code>, <code>--session</code> and <code>-c</code> additions
                differently. A UID filter remains eligible even for a pinned binary. The
                CodeBuddy command-name exception is separate from binary pinning and is
                case-insensitive. The process builder, by contrast, forwards the configured
                PID, session and command selectors without the same binary-path gate.
              </p>
              <pre><code>{`// Simplified decision structure, not a copy of the full implementation
if (!pin_binary && session_id.is_none()) { /* optional -p */ }
if (!pin_binary) { /* optional --session and non-misleading -c */ }
if (ssl_uid.is_some()) { /* optional -u */ }
if (binary_path.is_some()) { /* --binary-path <ELF> */ }`}</code></pre>
              <p>
                The repository includes focused tests:
                <code> ssl_args_skip_codebuddy_comm_filter</code> checks that CodeBuddy loses
                <code> -c</code> while <code>node</code> keeps it; and
                <code> ssl_args_skip_session_filter_when_binary_path_is_pinned</code> checks
                that an explicit Codex ELF path suppresses both <code>--session</code> and
                <code>-c</code> on SSL argument construction. These are regression assertions
                for the builder—not integration tests of observed network requests.
              </p>
            </section>
            <section>
              <h2>Reproduce the argument decision without collecting private traffic</h2>
              <p>
                Check out the matching release and inspect the exact implementation and tests.
                This read-only procedure needs no root privileges, eBPF probe, real prompt,
                response body, or outgoing network capture:
              </p>
              <pre><code>{`git clone https://github.com/eunomia-bpf/agentsight.git
cd agentsight
git checkout v1.0.35
grep -n 'fn build_ssl_args\|fn ssl_comm_is_misleading\|fn build_process_args' collector/src/cmd_trace.rs
grep -n 'ssl_args_skip_codebuddy_comm_filter\|ssl_args_skip_session_filter' collector/src/cmd_trace.rs
sed -n '262,330p' collector/src/cmd_trace.rs
sed -n '705,740p' collector/src/cmd_trace.rs`}</code></pre>
              <p>
                To additionally execute the tests on a suitable development machine, use the
                Rust collector test target for those names. This page has <strong>not</strong>
                run them and does not report any observed success rate or numeric overhead.
                The source checks establish the intended configuration logic only.
              </p>
            </section>
            <section>
              <h2>Scope and privacy: avoiding false negatives can widen what is observed</h2>
              <p>
                Pinning an ELF is a probe-attachment selection; do not describe it as
                a strict per-process authorization boundary. If more than one process loads
                and calls that executable, an SSL probe without a PID, session or command
                selector may include activity outside the agent run being investigated.
                A missing TLS event still cannot prove the agent did not contact a model:
                an unsupported SSL library, wrong executable, short-lived process,
                filtering mismatch, dropped event or truncated capture may explain it.
              </p>
              <p>
                TLS plaintext can include prompts, responses, authentication headers,
                API payloads and network destinations. Limit collection to an authorized
                test environment, keep sensitive trace files local, and independently
                verify the actual process and destination identity before drawing an
                audit conclusion. For evidence-loss diagnosis, read the
                <Link href="/blog/how-agentsight-reports-capture-loss/"> capture-loss guide</Link>.
                For the limits of network target aggregates, see the
                <Link href="/blog/what-agentsight-network-target-counts-mean/"> network counts reference</Link>.
              </p>
            </section>
            <section>
              <h2>Primary implementation references and version limits</h2>
              <ul>{references.map(([label, href]) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}</ul>
              <p>
                The conditional branches and regression tests above describe the
                v1.0.35 implementation as inspected on 5 November 2026. Actual attachment
                depends on binary packaging, kernel support, access permissions and probe
                health. Process tracing and TLS capture have different filtering contracts;
                never infer a complete causal, security or task-success verdict merely
                because one event category contains a record.
              </p>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
