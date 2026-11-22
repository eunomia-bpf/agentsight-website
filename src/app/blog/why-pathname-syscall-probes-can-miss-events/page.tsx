import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/why-pathname-syscall-probes-can-miss-events/';
const title = 'Why pathname syscall probes can miss events even when they are attached';
const productCommit = 'fbc6d91a025b561970f6e526a5c77bb07754f30a';
const kernelCommit = '4843f6873f7c4835e62f2c73ba0fd538e57a2f22';
const productSource = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;
const kernelSource = 'https://github.com/torvalds/linux/blob/' + kernelCommit;

export const metadata: Metadata = {
  title,
  description: 'A first-party AgentSight failure analysis of attached-but-silent pathname probes: per-syscall versus raw tracepoints, architecture dispatch, BPF filtering, map flushes, and kernel-version limits.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title,
    description: 'An attached Linux syscall BPF link is not proof that a path mutation reached an AgentSight SUMMARY. Diagnose the gates separately.',
    url: articlePath,
  },
};

const stages = [
  ['Attachment', 'Expected BPF link exists; tracepoint enabled', 'Neither condition proves the hook ran for the target syscall'],
  ['Tracepoint delivery', 'Per-syscall or raw sys_enter callback executes', 'A syscall in strace is not evidence that this BPF callback ran'],
  ['Dispatcher and scope', 'Architecture-specific syscall ID is selected and PID passes tracking', 'An unsupported ID or unrelated process can be correctly discarded'],
  ['User path read', 'bpf_probe_read_user_str copies pathname or records read error', 'An unreadable argument does not identify the target path'],
  ['Aggregation and flush', 'Key reaches map and is emitted as SUMMARY', 'A missing output line alone does not locate which prior stage failed'],
] as const;
const syscallCases = [
  ['x86-64', 'mkdir / unlink / rename', '83 / 87 / 82', 'args[0] / args[0] / args[1]'],
  ['x86-64', 'mkdirat / unlinkat / renameat or renameat2', '258 / 263 / 264 or 316', 'args[1] / args[1] / args[3]'],
  ['arm64', 'mkdirat / unlinkat / renameat or renameat2', '34 / 35 / 38 or 276', 'args[1] / args[1] / args[3]'],
] as const;
const sources = [
  ['AgentSight raw syscall dispatcher and aggregate-path selection', productSource + '/bpf/process_ext/bpf_fs.h'],
  ['Optional filesystem probe attachment and FS_LINK_INFO diagnostics', productSource + '/bpf/process.c'],
  ['Root-only mutation runtime fixture and its assertions', productSource + '/bpf/tests/test_process_runtime.py'],
  ['AgentSight change record: per-syscall hooks to raw_syscalls', 'https://github.com/eunomia-bpf/agentsight/commit/' + productCommit],
  ['Linux syscall tracepoint implementation (exact inspected snapshot)', kernelSource + '/kernel/trace/trace_syscalls.c'],
  ['AgentSight v1.0.35 release (prior to this master change)', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;
const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function MissingPathnameTracepointsArticle() {
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-11-22',
    dateModified: '2026-11-22',
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
            <span aria-current="page">Silent syscall probes</span>
          </nav>
          <Eyebrow>Kernel and AgentSight implementation investigation · 22 November 2026</Eyebrow>
          <h1>{title}</h1>
          <p className="hero-lede">
            An attached BPF program is not the same as an observed syscall. A
            filesystem <code>SUMMARY</code> can be absent because the selected
            tracepoint did not invoke the program, the syscall or process was
            excluded, a user pathname was unreadable, or an aggregate never
            reached output. AgentSight master commit <code>{productCommit.slice(0, 8)}</code>
            changed pathname hooks from individual <code>syscalls:sys_enter_*</code>
            events to a <code>raw_syscalls:sys_enter</code> dispatcher after an
            observed CI case with silent path hooks. <strong>Diagnose each gate;
            do not infer a successful file mutation from either hook.</strong>
          </p>
        </div>
      </section>
      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>What failed, and what is actually established?</h2>
              <p>
                The November 21 product change describes CI runs in which the
                per-syscall pathname programs were entered zero times, while
                file-descriptor-oriented write and truncate tracing still produced
                summaries. That is a <strong>source-reported CI observation</strong>,
                not a benchmark repeated independently for this article. The change
                replaces seven pathname entry programs with one raw syscall entry
                program, while keeping separate non-path hooks such as
                <code> ftruncate</code>. The root-only regression fixture subsequently
                requires <code>DIR_CREATE</code>, <code>WRITE</code>,
                <code> FILE_RENAME</code>, and <code>FILE_DELETE</code> summary types.
              </p>
              <p>
                The implementation here is <strong>unreleased master</strong> at
                <code> {productCommit}</code>. The latest stable binary reviewed
                is <strong>v1.0.35</strong> from October 23, which predates the
                switch. Do not apply this source contract to a stable installation
                without checking its actual BPF object and build revision.
              </p>
            </section>
            <section>
              <h2>Five gates between syscall and SUMMARY</h2>
              <div style={{ overflowX: 'auto', margin: '1.25rem 0' }}>
                <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead><tr><th style={header}>Gate</th><th style={header}>Positive evidence</th><th style={header}>What remains unknown</th></tr></thead>
                  <tbody>{stages.map(([stage, positive, caveat]) => <tr key={stage}>
                    <td style={cell}>{stage}</td><td style={cell}>{positive}</td><td style={cell}>{caveat}</td>
                  </tr>)}</tbody>
                </table>
              </div>
              <p>
                This order matters. A live link ID tells you only that a link
                exists. A syscall observed by a separate tool tells you only that
                the workload issued it. Neither confirms the BPF entry program
                ran, its process filter accepted the event, or the aggregate was
                subsequently flushed. The master <code>FS_LINK_INFO</code>
                diagnostic prints link and tracepoint-enable information, not
                per-hook execution counts.
              </p>
            </section>
            <section>
              <h2>Why use the raw syscall tracepoint?</h2>
              <p>
                Per-syscall tracepoints carry syscall-specific formatting and
                can involve kernel-side user-argument handling before the event
                reaches some consumers. In the observed AgentSight test
                environment, the older pathname hooks were silent. The new
                <code> raw_syscalls:sys_enter</code> event exposes the syscall
                number and six raw arguments, permitting a single BPF program
                to dispatch without requiring the per-syscall pathname event.
                The BPF program still reads the user pathname itself; switching
                tracepoints does not make a bad pointer readable.
              </p>
              <p>
                <strong>Kernel-version caveat:</strong> the product change attributes
                the CI failure to kernel syscall tracing faultable user-copy
                handling. The independently inspected Linux
                <a href={kernelSource + '/kernel/trace/trace_syscalls.c'}> trace_syscalls.c
                snapshot</a> at <code>{kernelCommit.slice(0, 8)}</code> has
                <code> check_faultable_syscall</code> and user-argument buffering,
                but its <code>perf_syscall_enter</code> explicitly invokes the
                BPF callback before allocating or populating the perf event
                buffer. Consequently that code snapshot alone does <em>not</em>
                establish that a failed pathname copy prevents the BPF
                callback on every kernel. Preserve the original CI observation,
                record the running kernel revision, and avoid treating the
                proposed cause as a universal law.
              </p>
            </section>
            <section>
              <h2>What does the raw dispatcher actually recognize?</h2>
              <p>
                The BPF source uses compile-time architecture selection and
                literal syscall IDs. Paths are read from fixed argument
                offsets, because computed indexing into the tracepoint context
                ran into BPF verifier pointer constraints. Other IDs return
                immediately. This is a finite set of pathname operations, not
                a generic filesystem audit.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.25rem 0' }}>
                <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead><tr><th style={header}>Build target</th><th style={header}>Operations</th><th style={header}>Syscall IDs</th><th style={header}>Path pointer</th></tr></thead>
                  <tbody>{syscallCases.map(([arch, ops, ids, args]) => <tr key={arch + ops}>
                    <td style={cell}>{arch}</td><td style={cell}>{ops}</td><td style={cell}><code>{ids}</code></td><td style={cell}><code>{args}</code></td>
                  </tr>)}</tbody>
                </table>
              </div>
              <p>
                For rename calls the dispatcher captures the <em>destination</em>
                pathname, not the original one. It observes syscall entry,
                not completion or return status. The related
                <Link href="/blog/what-agentsight-filesystem-mutation-summaries-mean/">
                filesystem SUMMARY evidence guide</Link> covers the separate
                question of grouping, counts and whether a file really changed.
              </p>
            </section>
            <section>
              <h2>A reproducible debugging sequence</h2>
              <p>
                Start with a disposable Linux test directory and matching
                source revision. The commands below inspect the implementation
                and the kernel environment; the test itself requires root,
                a built <code>process</code> tracer, and an available eBPF kernel.
                Do not treat a passing upstream fixture on one CI kernel as
                a guarantee of coverage on other kernels.
              </p>
              <pre style={{ overflowX: 'auto' }}><code>{[
                'git clone https://github.com/eunomia-bpf/agentsight.git',
                'cd agentsight',
                'git checkout fbc6d91a025b561970f6e526a5c77bb07754f30a',
                'uname -r',
                'rg -n "trace_raw_path|__TARGET_ARCH" bpf/process_ext/bpf_fs.h',
                'rg -n "FS_LINK_INFO|AGG_MAP_COUNTS|flush_agg_map" bpf/process.c',
                'rg -n "test_trace_fs_summary_events|PROBE_ENV" bpf/tests/test_process_runtime.py',
                '# With a correctly built process tracer and test prerequisites:',
                'cd bpf',
                'sudo python3 tests/test_process_runtime.py',
              ].join('\n')}</code></pre>
              <p>
                Compare the actual syscall variant and target architecture with
                the selected IDs. Confirm <code>--trace-fs</code> and process
                tracking scope. Separately inspect BPF link presence,
                tracepoint enable state, map overflow and flush evidence, and
                the emitted <code>SUMMARY</code> types. The fixture exercises
                direct x86 syscall IDs and records kernel/glibc diagnostics;
                on another architecture its hard-coded direct calls require
                adaptation. Do not run tracing tests against private production
                sessions merely to validate a website claim.
              </p>
              <p>
                Another diagnostic caveat in this pinned master revision:
                <code>FS_LINK_INFO</code> rows marked <code>phase=&quot;exit&quot;</code>
                are printed in the same two-iteration loop immediately after
                attachment, before event polling. They are <em>not</em> exit-time
                link measurements. The source comment describes the intended
                behavior, but the control flow does not implement it. Rely on
                actual shutdown observations, not that label, when investigating
                link loss.
              </p>
            </section>
            <section>
              <h2>What a missing event cannot prove</h2>
              <p>
                Neither a silent tracepoint nor a missing aggregate establishes
                that no file change happened. An empty map can result from
                filtering or unsupported syscalls; a path read failure retains
                only partial evidence; map and transport limits can lose later
                output. Follow the separate
                <Link href="/blog/how-agentsight-reports-capture-loss/">
                capture-loss reference</Link> when the event is missing after
                an accepted BPF callback. For reliable after-the-fact outcomes,
                corroborate observed attempts with return status and the
                filesystem state rather than treating the presence or absence
                of a <code>SUMMARY</code> as a complete audit.
              </p>
            </section>
            <section>
              <h2>Pinned primary sources and limitations</h2>
              <ul>{sources.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
              <p>
                The findings are a code and fixture analysis, not an independent
                root-kernel runtime reproduction. The particular CI kernel
                version behind the source-reported missing callbacks was not
                established from this review. Linux tracepoint ordering can
                change, and no single current kernel snapshot explains all
                historical kernels. The master changes have not shipped in the
                latest reviewed stable release v1.0.35. Use the
                <a href="https://eunomia.dev/agentsight/"> canonical AgentSight docs</a>
                for installation and supported commands.
              </p>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
