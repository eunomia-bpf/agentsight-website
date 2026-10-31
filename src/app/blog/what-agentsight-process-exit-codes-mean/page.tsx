import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/what-agentsight-process-exit-codes-mean/';
const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;

export const metadata: Metadata = {
  title: 'What AgentSight process exit codes actually prove',
  description: 'Inspect AgentSight v1.0.35 Linux EXEC and EXIT probes: exit-status bit extraction, signal ambiguity, missing durations, filtering, and why EXIT 0 is not agent success.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'What AgentSight process exit codes actually prove',
    description: 'A source-pinned decision guide to process exit observations versus tool, command, and agent-task outcomes.',
    url: articlePath,
  },
};

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

const cases = [
  {
    observation: 'EXEC for PID 421; later EXIT has exit_code=0',
    supported: 'A scoped, emitted process EXIT row has a high status byte of zero.',
    notSupported: 'That the process exited normally, the command completed its task, or the agent succeeded.',
  },
  {
    observation: 'Normal exit(7), encoded wait-style status 0x0700',
    supported: 'The BPF expression (status >> 8) & 0xff yields 7.',
    notSupported: 'A cause for the nonzero application exit or which agent decision triggered it.',
  },
  {
    observation: 'Signal termination with low-byte status 0x000f',
    supported: 'The same high-byte extraction yields zero, despite the signal-oriented status.',
    notSupported: 'A normal exit(0). Signal identity is not preserved by this JSON exit_code field.',
  },
  {
    observation: 'EXIT has no duration_ms',
    supported: 'The emission path did not provide a nonzero duration_ns value.',
    notSupported: 'A zero-duration process. A missing exec-start entry can prevent computing the lifetime.',
  },
  {
    observation: 'Only EXIT appears for a PID',
    supported: 'The observed event belongs to that PID and passes the active scope/filter rules.',
    notSupported: 'That the tracer captured the original EXEC. With minimum duration, EXEC output is suppressed.',
  },
  {
    observation: 'No EXIT for a process',
    supported: 'No matching EXIT row was retained in this source/output.',
    notSupported: 'That the process never exited: scope, short-lifetime filtering and ring-buffer reservation matter.',
  },
  {
    observation: 'One multithreaded program exits',
    supported: 'The process-exit probe ignores non-leader thread exit notifications.',
    notSupported: 'A complete thread-by-thread lifecycle or individual worker outcomes.',
  },
  {
    observation: 'An EXIT row includes vm_hwm_kb',
    supported: 'The userspace tracer found a recorded peak-RSS value to attach.',
    notSupported: 'A comparable memory figure on all kernels, machines and processes; the field is conditional.',
  },
  {
    observation: 'An EXIT row includes ppid and comm',
    supported: 'Process and parent identifiers plus a bounded task command name at the probe observation.',
    notSupported: 'A uniquely stable agent task identity, full command history, or causal attribution.',
  },
] as const;

const references = [
  ['v1.0.35 process exec/exit BPF hooks, filtering, duration and status extraction', sourceRoot + '/bpf/process.bpf.c'],
  ['v1.0.35 userspace JSON serialization and tracked-process filtering', sourceRoot + '/bpf/process.c'],
  ['v1.0.35 process event schema and EXEC/EXIT examples', sourceRoot + '/bpf/README.md'],
  ['v1.0.35 record child-wait/stream shutdown behavior', sourceRoot + '/collector/src/cmd_exec.rs'],
  ['Linux wait(2) normal-exit and signal-exit status distinctions', 'https://man7.org/linux/man-pages/man2/wait.2.html'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function ProcessExitCodeArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'What AgentSight process exit codes actually prove',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-10-31',
    dateModified: '2026-10-31',
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
            <span aria-current="page">Process EXIT evidence</span>
          </nav>
          <Eyebrow>Linux process evidence · AgentSight v1.0.35 · 31 October 2026</Eyebrow>
          <h1>What AgentSight process exit codes actually prove</h1>
          <p className="hero-lede">
            An AgentSight <code>EXIT</code> row describes an observed Linux process event; it does not certify
            that an AI agent succeeded. In the v1.0.35 process tracer, the JSON <code>exit_code</code> comes
            from the <strong>high eight bits of the kernel task exit status</strong>. That is useful for
            ordinary exits, but it does not retain the information needed to distinguish normal exit
            from signal termination. Missing events and missing duration fields require separate analysis.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Short answer: treat EXIT as process evidence, not an agent verdict</h2>
              <p>
                AgentSight v1.0.35 listens to Linux <code>sched_process_exec</code> and
                <code> sched_process_exit</code>, subject to its tracing scope and output filters.
                The userspace tracer emits JSON <code>EXEC</code> and <code>EXIT</code> rows with process
                identifiers, a command name and event-specific fields. A process can exit normally
                while its work is semantically wrong; another can be terminated by a signal.
                Neither a zero high-byte value nor an absent row proves task success.
              </p>
              <p>
                This is a source-level analysis pinned to commit <code>{productCommit}</code>, not an
                executed AgentSight capture, a universal shell-status decoder, or a measured reliability
                result. When deciding whether a tool succeeded, retain its own command result, relevant
                output and task-level checks alongside any process trace.
              </p>
            </section>

            <section>
              <h2>Why an EXIT zero may not be a normal exit(0)</h2>
              <p>
                The BPF exit handler assigns the following expression to the recorded field:
              </p>
              <pre><code>{'e->exit_code = (BPF_CORE_READ(task, exit_code) >> 8) & 0xff;'}</code></pre>
              <p>
                Linux wait status distinguishes ordinary termination from signal termination with
                separate predicates, such as <code>WIFEXITED</code> and <code>WIFSIGNALED</code>.
                AgentSight&apos;s JSON <code>exit_code</code> stores neither predicate nor the original
                status word. For typical wait-style encodings, <code>0x0700</code> becomes 7, while
                a signal-oriented status whose low byte is <code>0x0f</code> becomes 0 after the
                same shift and mask. This is a bit-extraction example, <strong>not</strong> evidence
                that a particular recorded PID was terminated by SIGTERM.
              </p>
              <p>
                An investigator therefore cannot recover <code>WIFSIGNALED</code> or
                <code>WTERMSIG</code> from the displayed <code>exit_code</code> alone.
                A shell&apos;s familiar <code>128 + signal</code> convention is also not what this BPF
                assignment computes. For a robust failure verdict, pair the event with the
                launcher&apos;s complete wait status or other independent execution evidence.
              </p>
            </section>

            <section>
              <h2>Nine observations and the inference each permits</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '920px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Trace observation</th>
                      <th style={header}>What is supported</th>
                      <th style={header}>What is not supported</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((item) => (
                      <tr key={item.observation}>
                        <td style={cell}>{item.observation}</td>
                        <td style={cell}>{item.supported}</td>
                        <td style={cell}>{item.notSupported}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>EXEC and EXIT are deliberately not symmetric</h2>
              <p>
                The EXEC hook first stores a monotonic start timestamp keyed by PID. If a minimum
                lifetime is configured, it may then suppress the EXEC row entirely while retaining
                that timestamp for the later duration calculation. On exit, the hook ignores
                non-leader thread exits, looks up the start timestamp, applies its lifetime filter,
                and attempts to reserve a ring-buffer event. A failed reservation means there may
                be no emitted EXIT row at all.
              </p>
              <p>
                If no start timestamp exists, the optional duration can be absent; the userspace
                serializer prints <code>duration_ms</code> only when the source duration is nonzero.
                The handler also applies process-tracker scope at readout and can exclude an
                otherwise observed exit in filtered mode. Therefore an apparently unmatched EXEC
                or EXIT must be investigated against filtering and capture coverage before
                diagnosing a process-tree or agent failure.
              </p>
              <p>
                The emitted <code>comm</code> is a bounded task name, not a reliable substitute
                for the full command line. The EXEC row has a separate <code>full_command</code>
                field; its underlying collection is itself length-bounded. PID and PPID are useful
                local process evidence but must be interpreted with lifetime and process-tree
                context instead of being promoted to a global agent-run identifier.
              </p>
            </section>

            <section>
              <h2>A reproducible source-only status check</h2>
              <p>
                A safe way to verify the exact distinction without capturing prompts or commands
                is to inspect the pinned hook and serializer, then evaluate the extraction on
                synthetic integer examples:
              </p>
              <pre><code>{'git checkout v1.0.35\n' +
                'grep -n "exit_code" bpf/process.bpf.c bpf/process.c\n' +
                'python3 -c "for raw in (0x0000, 0x0700, 0x000f): print(hex(raw), (raw >> 8) & 0xff)"'}</code></pre>
              <p>
                The arithmetic yields 0, 7 and 0 for those respective inputs. The examples use
                illustrative wait-style words; they are <strong>not</strong> a live traced process,
                kernel conformance test, or demonstration that a particular signal is always
                represented identically on every architecture. For real evidence, inspect a
                complete launcher wait result alongside scoped AgentSight process events and
                the command&apos;s own pass/fail criteria. Do not put captured arguments, file
                paths or environment details from a private agent run into public reports.
              </p>
            </section>

            <section>
              <h2>Process status, tool outcome and task outcome are three levels</h2>
              <p>
                A process status tells you how one observed process ended. A tool outcome also
                needs the relevant stdout/stderr, protocol result or test artifact. An agent-task
                outcome further needs task acceptance: for example a patch can be generated by a
                zero-exit process yet fail compilation or review. Conversely, a transient failed
                process may be retried and recovered by the enclosing agent. Neither case can be
                decided from one <code>EXIT</code> event.
              </p>
              <p>
                AgentSight&apos;s <code>record</code> command separately waits for the launched child
                and reports that launcher status; that path should not be confused with the BPF
                <code> EXIT</code> JSON field for every process in a traced family. For file
                access rather than process lifetime, use the
                <Link href="/blog/what-agentsight-file-open-events-prove/"> FILE_OPEN evidence reference</Link>.
                For missing process or TLS observations, retain the
                <Link href="/blog/how-agentsight-reports-capture-loss/"> capture-loss qualifications</Link>.
                For combining evidence sources, read the
                <Link href="/blog/read-agentsight-audit-provenance/"> audit provenance guide</Link>.
              </p>
            </section>

            <section>
              <h2>Primary sources and interpretation limits</h2>
              <ul>{references.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
              <p>
                This page documents the current v1.0.35 source contract as reviewed on
                31 October 2026. It does not assert complete event delivery, signal-aware exit
                classification, unbounded command capture, or proof that an entire AI task was
                correct. A future tracer revision may expose richer raw wait-status evidence;
                interpret historical rows according to the version that produced them.
              </p>
            </section>
          </article>

          <aside className="detail-aside">
            <p className="card-label">Next diagnostic</p>
            <Link href="/blog/what-agentsight-file-open-events-prove/">What FILE_OPEN proves</Link>
            <Link href="/blog/how-agentsight-reports-capture-loss/">Capture gaps and loss counters</Link>
            <Link href="/use-cases/review-ai-generated-prs/">Review generated code with independent checks</Link>
            <hr />
            <a className="button button-accent" href={site.repository}>Inspect AgentSight source</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
