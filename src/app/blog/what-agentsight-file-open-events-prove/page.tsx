import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/what-agentsight-file-open-events-prove/';
const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;

export const metadata: Metadata = {
  title: 'What AgentSight FILE_OPEN events prove—and what they miss',
  description:
    'Read AgentSight v1.0.35 file-open evidence correctly: resolved-path fexit tracing versus syscall fallback, access bits, deduplication, overlay layers, path errors, and event loss.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'What AgentSight FILE_OPEN events prove—and what they miss',
    description:
      'A source-pinned guide to successful file-open events, fallback limitations, access classifications, deduplication, and missing evidence.',
    url: articlePath,
  },
};

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };
const cases = [
  {
    observation: 'Successful open of a regular file, first matching access in the process',
    modern: 'A resolved-path FILE_OPEN event is eligible after security_file_open returns success.',
    implication: 'The file was opened with the reported access; this is not a record of bytes read or written.',
  },
  {
    observation: 'Second open of the same inode, mount/dentry, access, process execution and overlay layer',
    modern: 'Usually suppressed by the BPF LRU deduplication map.',
    implication: 'One row does not mean the file was opened only once; LRU eviction can also cause another row.',
  },
  {
    observation: 'A read followed by a write-capable open of the same file',
    modern: 'Different access bits produce a different deduplication key.',
    implication: 'A write-capable open is evidence of access mode, not proof that content changed.',
  },
  {
    observation: 'Open denied before security_file_open succeeds, or a path that does not exist',
    modern: 'No successful regular-file-open event from the modern fexit hook.',
    implication: 'The syscall-entry fallback may still show attempts; do not mix the two semantics.',
  },
  {
    observation: 'Executable file and its ELF interpreter',
    modern: 'Executable opens are eligible and marked using mode/flag checks.',
    implication: 'An executable open alone does not establish what the program subsequently did.',
  },
  {
    observation: 'Overlay backing-layer access',
    modern: 'Layer identity contributes to the key; some runtime-origin layer opens are suppressed.',
    implication: 'A layer row and logical file row must not be naively counted as two user actions.',
  },
  {
    observation: 'A path with invalid UTF-8, a long path, or bpf_d_path failure',
    modern: 'The display path may be replaced/truncated, or blank with path_error.',
    implication: 'Use filepath_hex where present and preserve path_error; do not treat an empty path as root.',
  },
  {
    observation: 'Ring-buffer reservation failure or BPF recursion miss',
    modern: 'A FILE_OPEN_LOST counter records missing events.',
    implication: 'The count is a loss signal, not a way to reconstruct the missing paths.',
  },
] as const;

const references = [
  ['AgentSight v1.0.35 process probe reference', sourceRoot + '/bpf/README.md'],
  ['Resolved file-open hook, access bits, LRU key and ring-buffer behavior', sourceRoot + '/bpf/process.bpf.c'],
  ['Probe loader, fallback selection and output formatting', sourceRoot + '/bpf/process.c'],
  ['Process runtime regression test harness', sourceRoot + '/bpf/tests/test_process_runtime.py'],
  ['Current command and report usage', sourceRoot + '/docs/usage.md'],
  ['Implementation PR #227, including bounded test evidence and environment limitations', 'https://github.com/eunomia-bpf/agentsight/pull/227'],
  ['Follow-up PR #234: invalid-byte paths, length and device fields', 'https://github.com/eunomia-bpf/agentsight/pull/234'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function FileOpenEvidenceArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'What AgentSight FILE_OPEN events prove—and what they miss',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-10-26',
    dateModified: '2026-10-26',
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
            <span aria-current="page">File-open evidence</span>
          </nav>
          <Eyebrow>Linux file tracing methods · AgentSight v1.0.35 · 26 October 2026</Eyebrow>
          <h1>What AgentSight FILE_OPEN events prove—and what they miss</h1>
          <p className="hero-lede">
            A <code>FILE_OPEN</code> row is evidence about an observed file open, not a complete
            file-operation history. On a kernel supporting AgentSight&apos;s resolved-path probe,
            the event represents an eligible successful regular-file open with access and inode
            information. On the older syscall-entry fallback, paths and success semantics are weaker.
            The distinction matters when investigating what an AI agent read, wrote, or attempted.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Direct answer: establish the capture path before interpreting a file row</h2>
              <p>
                AgentSight v1.0.35 has two materially different file-open collection paths.
                The modern Linux probe attaches an fexit handler to <code>security_file_open</code>,
                uses <code>bpf_d_path</code> to resolve the file path, and ignores rejected opens and
                non-regular files at that hook. If the required hook or helper is unavailable, the
                loader falls back to syscall-entry observation and reports a fallback notice on stderr.
                That older path can report failed attempts, relative filenames, and 60-second
                userspace aggregation.
              </p>
              <p>
                Therefore a modern <code>FILE_OPEN</code> with write access establishes that the
                process successfully opened a regular file for a write-capable operation. It does
                <strong> not</strong> establish that the process wrote bytes, changed the file&apos;s
                contents, or was the only process that touched the path. Conversely, an absent event
                is not proof of absent access.
              </p>
              <p>
                This is a source-level examination of product release <strong>v1.0.35</strong> at
                commit <code>{productCommit}</code>, not a new measurement of the current kernel
                or a claim of complete file-system coverage.
              </p>
            </section>

            <section>
              <h2>The fexit hook filters on success and file type</h2>
              <p>
                The BPF function <code>trace_file_open_exit</code> first checks the hook return
                value and the configured tracking scope. It rejects kernel threads and inodes that
                are not regular files, and suppresses special namespace-related file systems.
                An allowed open then receives the PID, command, monotonic timestamp, access
                classification, file identity, and resolved-path attempt.
              </p>
              <p>
                The path is resolved in the opener&apos;s mount namespace. That is valuable for
                container debugging, but it is not a guarantee that a path with the same spelling
                identifies the same inode in a different namespace. Stable file identity needs
                device/inode and layer context in addition to a display string.
              </p>
              <p>
                Access flags are derived from <code>FMODE_READ</code>, <code>FMODE_WRITE</code>,
                and executable-mode or executable-flag cases. The code handles newer
                <code> __FMODE_EXEC</code>-style flags and older encodings. These classify an
                <em> open</em>, not a complete sequence of reads, writes, or execution outcomes.
              </p>
            </section>

            <section>
              <h2>Evidence matrix: eight cases that change the interpretation</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '800px', fontSize: '0.9rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Scenario</th>
                      <th style={header}>Modern probe behavior</th>
                      <th style={header}>Safe inference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((item) => (
                      <tr key={item.observation}>
                        <td style={cell}>{item.observation}</td>
                        <td style={cell}>{item.modern}</td>
                        <td style={cell}>{item.implication}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                These entries describe the implemented capture contract, not a statistical
                probability that any particular file will appear in a future run.
              </p>
            </section>

            <section>
              <h2>Why duplicate suppression changes counts</h2>
              <p>
                The kernel map <code>file_opens_seen</code> is an LRU hash with 65,536 entries.
                Its key combines process identity and execution lifetime, the mount and dentry,
                inode, access bits, and overlay-layer status. If a matching key is already present,
                the hook suppresses the next event. Different access bits or a changed process
                execution identity can create a new entry; capacity pressure may evict an entry and
                allow the same file to be emitted again.
              </p>
              <p>
                This is why counting <code>FILE_OPEN</code> rows as exact open syscall frequency
                is incorrect. The output is intentionally de-duplicated evidence. The syscall-entry
                fallback applies a different, 60-second userspace aggregation contract, so the
                row counts from two hosts are not directly interchangeable.
              </p>
            </section>

            <section>
              <h2>Paths, overlays, and loss: preserve the uncertainty fields</h2>
              <p>
                The modern path buffer holds up to 4,095 bytes of resolved path text. Invalid UTF-8
                is rendered with replacement characters while <code>filepath_hex</code> preserves
                original captured bytes; <code>path_error</code> identifies a failed resolution.
                Consumers must not silently normalize replacement characters into a definitive
                filesystem path, and a blank <code>filepath</code> with <code>path_error</code>
                is a failed lookup, not evidence that the process opened a file named <code>/</code>.
              </p>
              <p>
                The event also reports <code>layer</code>, <code>dev</code>, and <code>ino</code>.
                Overlay backing-layer accesses may have different identity than their logical
                paths. The hook deliberately suppresses some overlay-layer opens performed with
                initial-namespace mount credentials to avoid attributing runtime implementation
                effects to the observed workload.
              </p>
              <p>
                Ring-buffer allocation failure and BPF recursion misses can produce
                <code> FILE_OPEN_LOST</code> counters. Those counters establish that observation
                was incomplete; they cannot recover which paths were missed. Together with
                filtering, timing, and deduplication, this makes a blank audit an
                <em> absence of observed evidence</em>, not evidence of absence.
              </p>
            </section>

            <section>
              <h2>Reproduce the interpretation with a bounded local task</h2>
              <p>
                On a Linux test machine with an appropriately built AgentSight process probe
                and authorization to load eBPF, run the process tracer and deliberately open
                one controlled regular file with read access and then write-capable access.
                Repeat the read, attempt to open a nonexistent name, and execute a simple ELF
                program. Compare event access flags, file identity, duplicates, and stderr
                before drawing conclusions. The following invokes the documented debug wrapper:
              </p>
              <pre><code>{`# Terminal A: scope intentionally broad for a disposable test machine
sudo ./agentsight debug process -- -m 0

# Terminal B: use a unique scratch directory, without private data
tmpdir=$(mktemp -d)
printf 'seed\\n' > "$tmpdir/sample"
cat "$tmpdir/sample" >/dev/null
cat "$tmpdir/sample" >/dev/null
printf 'change\\n' >> "$tmpdir/sample"
cat "$tmpdir/does-not-exist" >/dev/null 2>&1 || true
/usr/bin/true
rm -rf -- "$tmpdir"`}</code></pre>
              <p>
                Inspect the JSONL stream for <code>FILE_OPEN</code>,
                <code> FILE_OPEN_LOST</code>, <code>filepath</code>,
                <code> path_error</code>, <code>access</code>,
                <code> layer</code>, <code>dev</code>, and <code>ino</code>.
                Check stderr for a syscall fallback announcement. A broad
                <code> -m 0</code> trace can include unrelated system processes:
                use only a disposable environment and narrow the scope for real work.
                No result from this proposed reproduction was collected in this article.
              </p>
            </section>

            <section>
              <h2>What has actually been tested in public?</h2>
              <p>
                The implementation record in product PR #227 reports a focused live hook
                harness on Linux 7.3.0 release-candidate kernel. It saw one controlled write,
                one deduplicated read, suppressed a failed open, and captured executable and
                interpreter file opens. That is the author&apos;s bounded validation, not
                an independent retest here.
              </p>
              <p>
                The same PR explicitly states that the full process runtime suite could not
                attach on that workspace because the required process tracefs event was
                unavailable; a separate network tracing test encountered an existing verifier
                rejection. These qualifications matter more than claiming the resolved-path
                hook works on every supported Linux machine. The current product repository
                retains a process runtime regression harness for environments able to attach
                the BPF programs.
              </p>
            </section>

            <section>
              <h2>Use file evidence with the other observation layers</h2>
              <p>
                Agent-native session history may explain the agent&apos;s declared tool step,
                but it does not independently confirm each kernel file effect. Conversely, a
                process file-open record cannot identify why a particular prompt caused a tool
                call without additional correlation. Use the
                {' '}<Link href="/blog/read-agentsight-audit-provenance/">audit provenance reference</Link>
                {' '}to distinguish live events from reconstructed rows, and the
                {' '}<Link href="/blog/pid-namespace-scoping-for-agent-sidecars/">PID namespace scope analysis</Link>
                {' '}when deciding which container tasks were eligible to be observed.
              </p>
              <p>
                If you are deciding whether to use eBPF rather than native session files,
                start with <Link href="/blog/when-agentsight-works-without-ebpf/">the evidence-mode guide</Link>.
                For installation and supported command flags, use the
                {' '}<a href="https://eunomia.dev/agentsight/">canonical AgentSight documentation</a>.
                Recorded captures may contain sensitive file paths, command lines, prompts,
                or network evidence; keep raw reports out of public issue descriptions.
              </p>
            </section>

            <section>
              <h2>Primary sources and scope</h2>
              <p>
                This reference pins implementation claims to AgentSight v1.0.35
                rather than generalizing from an undated current build. Confirm the
                configured capture hook, effective filters, kernel capabilities, and
                event-loss counters on the machine whose audit you are reviewing.
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
