import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/what-agentsight-filesystem-mutation-summaries-mean/';
const title = 'What AgentSight filesystem mutation summaries prove—and what they cannot';
const productCommit = 'fbc6d91a025b561970f6e526a5c77bb07754f30a';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;

export const metadata: Metadata = {
  title,
  description: 'An exact-source audit of AgentSight Linux filesystem SUMMARY events: syscall-entry evidence, path grouping, rename destinations, unreadable arguments and loss boundaries.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title,
    description: 'A filesystem mutation SUMMARY is evidence of an observed attempt, not proof that a file was deleted, renamed or created.',
    url: articlePath,
  },
};

const matrix = [
  ['FILE_DELETE', 'unlink / unlinkat entry', 'User-supplied target pathname', 'Not proof the unlink succeeded or that the file disappeared'],
  ['FILE_RENAME', 'rename / renameat / renameat2 entry', 'New/destination pathname only', 'Does not preserve the old pathname or prove a completed rename'],
  ['DIR_CREATE', 'mkdir / mkdirat entry', 'User-supplied directory pathname', 'Not proof the directory was created'],
  ['FILE_TRUNCATE', 'ftruncate entry', 'File descriptor, not a resolved target path', 'Not a confirmed truncation or a count of bytes removed'],
  ['WRITE', 'write-family tracing', 'File descriptor and captured byte accounting', 'Not necessarily a persistent on-disk change; fd resolution is best effort'],
] as const;

const evidence = [
  ['Observed syscall entry', 'The tracer saw a process enter a supported syscall while filesystem tracing and its process filter were active.', 'A successful return value, filesystem state afterwards, or a durable mutation.'],
  ['SUMMARY count', 'The aggregate count for one map key and flush interval.', 'One distinct file per count, an ordered audit trail, or complete event delivery.'],
  ['SUMMARY detail', 'The grouping string derived from the user pathname; usually a directory prefix when a slash occurs after the initial character.', 'An authoritative canonical/absolute path, or the pathname of every grouped event.'],
  ['SUMMARY extra', 'The most recently stored pathname for that key, or an explicit unreadable-path marker.', 'A list of every path represented by count, or proof that this path was actually changed.'],
  ['SUMMARY timestamp', 'The aggregate last-observed timestamp, printed from last_ts.', 'A first-event time, per-attempt latency, or syscall completion time.'],
] as const;

const sources = [
  ['Kernel-side path selection, read-failure handling and aggregation', sourceRoot + '/bpf/process_ext/bpf_fs.h'],
  ['Map key and aggregate value fields', sourceRoot + '/bpf/process_ext/types.h'],
  ['JSON SUMMARY serialization and batched flushing', sourceRoot + '/bpf/process_ext/map_flush.h'],
  ['Optional --trace-fs configuration and probe output', sourceRoot + '/bpf/process.c'],
  ['Root-only filesystem runtime fixture and its exact assertions', sourceRoot + '/bpf/tests/test_process_runtime.py'],
  ['Implementation change introducing raw syscall path dispatch', 'https://github.com/eunomia-bpf/agentsight/commit/' + productCommit],
  ['Current stable release: v1.0.35', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function FilesystemMutationSummariesArticle() {
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-11-21',
    dateModified: '2026-11-21',
    author: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
    publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
  };

  return (
    <SiteShell>
      <JsonLd value={structured} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><Link href="/blog/">Blog</Link>
            <span aria-current="page">Filesystem mutation evidence</span>
          </nav>
          <Eyebrow>Linux capture source audit · master commit fbc6d91 · 21 November 2026</Eyebrow>
          <h1>{title}</h1>
          <p className="hero-lede">
            Seeing <code>FILE_DELETE</code>, <code>FILE_RENAME</code> or <code>DIR_CREATE</code>
            in a Linux AgentSight <code>SUMMARY</code> means the tracer observed a
            <strong> syscall entry</strong>. It does not establish that the call succeeded.
            The summary may merge several attempted paths under one key, retain only
            the latest path as <code>extra</code>, and omit the original name of a rename.
            Interpret these as bounded system-activity evidence, not a complete
            filesystem change log.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Version boundary: master is ahead of v1.0.35</h2>
              <p>
                This analysis pins <strong>product master</strong> to <code>{productCommit}</code>,
                including the 21 November 2026 filesystem tracing change. The latest
                stable release at review time is still <strong>v1.0.35</strong> (23 October).
                In v1.0.35, mkdir, unlink and rename used separate per-syscall
                entry tracepoints and an unreadable user path caused an early return.
                The newer master source replaces those path hooks with one
                <code> raw_syscalls:sys_enter</code> dispatcher and retains an explicit
                unreadable-path marker. Do not attribute that unreleased behavior to
                an installed v1.0.35 binary.
              </p>
              <p>
                The change follows a source-described CI/kernel case in which the
                path-specific hooks were not firing while file-descriptor-based
                hooks were aggregating. The repository also contains temporary
                diagnostic probes. This page inspects code and fixture assertions;
                it is <strong>not</strong> a new reproducible runtime measurement or a
                claim that every supported kernel now captures every mutation.
              </p>
            </section>

            <section>
              <h2>Which syscall observation produces which summary?</h2>
              <div style={{ overflowX: 'auto', margin: '1.25rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '850px', fontSize: '0.9rem' }}>
                  <thead><tr>
                    <th style={header}>Type</th><th style={header}>Entry evidence</th>
                    <th style={header}>Argument used</th><th style={header}>Missing conclusion</th>
                  </tr></thead>
                  <tbody>{matrix.map(([kind, event, arg, limit]) => (
                    <tr key={kind}>
                      <td style={cell}><code>{kind}</code></td>
                      <td style={cell}>{event}</td><td style={cell}>{arg}</td><td style={cell}>{limit}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <p>
                The raw path dispatcher branches by architecture-specific syscall ID
                (x86-64 and arm64 tables) and reads the relevant argument pointer.
                For <code>renameat</code> and <code>renameat2</code>, that is argument 3,
                the destination name; for plain x86 <code>rename</code>, it is
                argument 1. The source name is not stored in this path summary.
                Calls outside the selected IDs are not covered by that dispatcher.
              </p>
              <p>
                These are <code>sys_enter</code> hooks, not success-checked return
                hooks. A failed permission check, an absent source file or a target
                that already exists can still produce an attempt record. Conversely,
                a missing summary is not proof that no filesystem activity occurred:
                probe attachment, filter configuration, read failures, map capacity
                and flush behavior all matter.
              </p>
            </section>

            <section>
              <h2>Why count=3 does not mean three files changed</h2>
              <p>
                The path aggregate key contains <code>pid</code>, event type,
                process-start identity and a short <code>detail</code> string
                constructed by <code>extract_dir_prefix</code>. With an ordinary
                absolute pathname containing a non-root parent slash, this is
                the parent directory, not a unique filename. Relative single-component
                names and root-level paths have different corner cases because
                the helper only truncates when its last slash index is greater than zero.
                The directory-like value is also size bounded.
              </p>
              <p>
                The value contains a count, first/last observed timestamps,
                process command, and <code>extra</code>. Each later event with
                the same key increments count and overwrites <code>extra</code>
                with the latest readable full path (or a read-failure marker).
                For example, attempted renames to <code>/work/a.txt</code> and
                <code>/work/b.txt</code> can share one <code>FILE_RENAME</code>
                aggregate for the same process. Its count may be two while
                <code>extra</code> shows only <code>/work/b.txt</code>.
                This is a source-derived illustration, not a captured sample.
              </p>
              <p>
                The JSON printer emits <code>timestamp</code> from the last
                observed timestamp, plus <code>type</code>, <code>detail</code>,
                <code>count</code>, optional <code>extra</code>, and process
                identity. It does not serialize every attempt separately.
                The normal flush walks and deletes map keys in bounded batches;
                a later flush starts a new aggregate interval. Count is scoped
                to that key and flush, not to an entire session.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.25rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.9rem' }}>
                  <thead><tr><th style={header}>Field or signal</th><th style={header}>What it supports</th><th style={header}>What it does not support</th></tr></thead>
                  <tbody>{evidence.map(([field, yes, no]) => (
                    <tr key={field}><td style={cell}>{field}</td><td style={cell}>{yes}</td><td style={cell}>{no}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>An unreadable user pathname is a separate failure mode</h2>
              <p>
                The master implementation calls <code>bpf_probe_read_user_str</code>
                against the syscall argument pointer. If that read fails, it no
                longer discards the entire path operation merely because the path
                is unavailable. Instead the key uses an empty pathname-derived
                detail and <code>extra</code> contains a bounded
                <code> &lt;user path unreadable: ...</code> marker with the helper
                error number. That preserves evidence of a matched syscall type
                and process, but the failed read gives no reliable target path.
              </p>
              <p>
                There is another implementation-level distinction: stack-to-stack
                strings are copied with a bounded direct copy rather than
                <code> bpf_probe_read_kernel_str</code>, which expects a kernel
                address. The prior code could fail to populate the extra
                pathname even when the original user read succeeded. Both
                behaviors matter for interpretation of old and new builds.
              </p>
            </section>

            <section>
              <h2>How to inspect the exact evidence contract</h2>
              <p>
                The source and fixture can be inspected without attaching probes.
                The root-only runtime test on Linux invokes
                <code> ./process -m 0 --trace-fs</code>, performs mkdir,
                write, rename and unlink operations, and checks that the expected
                summary <em>types</em> appear. That assertion is not a check
                of syscall success attribution, per-path completeness or
                generalization to other kernels.
              </p>
              <pre style={{ overflowX: 'auto' }}><code>{[
                'git clone https://github.com/eunomia-bpf/agentsight.git',
                'cd agentsight',
                'git checkout fbc6d91a025b561970f6e526a5c77bb07754f30a',
                'rg -n "trace_raw_path|agg_path_event|extract_dir_prefix" bpf/process_ext/bpf_fs.h',
                'rg -n "print_summary_json|flush_agg_map" bpf/process_ext/map_flush.h',
                'rg -n "test_trace_fs_summary_events" bpf/tests/test_process_runtime.py',
              ].join('\n')}</code></pre>
              <p>
                If you repeat capture on a disposable local workload, first
                confirm attachment, filter scope, target architecture and
                summary loss/overflow signals, then compare the resulting
                events with independent filesystem state and command exit results.
                Treat all paths and captured session data as potentially sensitive.
                The separate <Link href="/blog/how-agentsight-reports-capture-loss/">
                capture loss analysis</Link> explains why a tracer output can
                be incomplete.
              </p>
            </section>

            <section>
              <h2>Which source should you trust for a file change?</h2>
              <p>
                For <em>observed file opens</em>, read the
                <Link href="/blog/what-agentsight-file-open-events-prove/">
                FILE_OPEN evidence boundary</Link>: an open is not a write.
                For <em>replayed agent intentions</em>, read
                <Link href="/blog/replay-coding-agent-repository-changes/">
                repository replay provenance</Link>: native Tool logs are not
                independent kernel file mutations. This page is about a third
                layer, Linux syscall-entry summaries. None alone reconstructs
                a complete, independently verified final filesystem diff.
              </p>
              <p>
                To establish that a destructive operation really took effect,
                combine the attempted syscall evidence with a trustworthy
                return status and a before/after filesystem observation for the
                particular path. A process exit code alone does not identify
                which syscall failed. The <Link href="https://eunomia.dev/agentsight/">
                canonical documentation</Link> owns installation and supported
                command configuration.
              </p>
            </section>

            <section>
              <h2>Pinned first-party sources</h2>
              <ul>{sources.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
              <p>
                Limitations: this is an implementation review of an unreleased
                master revision, with an upstream fixture rather than independent
                runtime reproduction. It does not establish perfect attachment
                or loss-free delivery on Linux kernels, exact per-operation
                result codes, or capture of file changes made outside the observed
                process/filter scope. The separate stable version remains v1.0.35.
              </p>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
