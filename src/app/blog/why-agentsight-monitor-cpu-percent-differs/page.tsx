import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/why-agentsight-monitor-cpu-percent-differs/';
const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;

export const metadata: Metadata = {
  title: 'Why AgentSight monitor CPU% and CPU milliseconds can disagree',
  description:
    'A source-pinned AgentSight v1.0.35 audit of process CPU percentages, two-second CPU deltas, PID reuse, first samples, memory sums, and bounded monitor detail.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'Why AgentSight monitor CPU% and CPU milliseconds can disagree',
    description:
      'Understand process CPU rate versus sampled CPU time, the first-sample fallback, and a PID-identity inconsistency in v1.0.35.',
    url: articlePath,
  },
};

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

const cases = [
  {
    caseName: 'Stable PID accumulates 400 ms of CPU time across a 2-second snapshot interval.',
    sourceRule: 'CPU delta uses the change in accumulated ticks; CPU% divides the CPU-seconds delta by measured wall seconds.',
    interpretation: 'About 400 cpu_ms and 20% for that process, subject to tick rounding and actual sample interval.',
  },
  {
    caseName: 'Stable multithreaded process consumes 4 CPU-seconds during 2 wall seconds.',
    sourceRule: 'The CPU% expression multiplies CPU-seconds / wall-seconds by 100 without dividing by logical CPU count.',
    interpretation: 'A result around 200% is possible; it is not automatically a corrupt reading.',
  },
  {
    caseName: 'A process appears in the current snapshot but not the previous snapshot.',
    sourceRule: 'process_cpu_ms_delta returns zero; process_cpu_percent falls back to lifetime ticks divided by process age.',
    interpretation: 'The same first observation may have zero sampled CPU milliseconds and nonzero CPU%. They have different baselines.',
  },
  {
    caseName: 'A PID is reused between two snapshots with a different process start time.',
    sourceRule: 'CPU-ms delta checks starttime_ticks; CPU% matches the previous process only by PID.',
    interpretation: 'The rate path can compare unrelated accumulated counters. This is a source-level identity risk, not proof of a witnessed failure.',
  },
  {
    caseName: 'A reused PID has fewer accumulated ticks than its old occupant.',
    sourceRule: 'CPU% subtracts the older counter with saturating_sub, potentially producing zero.',
    interpretation: 'A zero rate in this edge case need not mean the new process did no work.',
  },
  {
    caseName: 'A process begins with no previous disk I/O baseline.',
    sourceRule: 'process_io_delta uses (pid, starttime_ticks) and returns zero when no prior key exists.',
    interpretation: 'Zero read/write delta on the first observation is not evidence of no earlier lifetime I/O.',
  },
  {
    caseName: 'Two related processes map some of the same physical pages.',
    sourceRule: 'Monitor session rss_bytes is the saturating sum of sampled per-process resident bytes.',
    interpretation: 'The family sum is not unique physical memory consumed by the session; shared pages may be counted more than once.',
  },
  {
    caseName: 'A 2-second monitor window has metrics but no process_samples rows.',
    sourceRule: 'Aggregate windows are inserted each tick; detailed process samples only cross 30-second boundaries.',
    interpretation: 'Missing detail is expected sampling policy, not necessarily a zero-process or lost-collection result.',
  },
  {
    caseName: 'A session contains more than ten processes at a detail boundary.',
    sourceRule: 'bounded_process_samples chooses up to five highest and five lowest by CPU-ms, then RSS and I/O.',
    interpretation: 'Detailed rows are a ranking sample, not an exhaustive process census or top ten by CPU%.',
  },
] as const;

const references = [
  ['Process snapshot CPU formula, first-sample fallback, PID and start-time behavior', sourceRoot + '/agentsight-capture/src/sources/proc.rs'],
  ['Monitor sampling, aggregation, I/O keys, ranking, and persisted SQLite fields', sourceRoot + '/collector/src/cmd_monitor.rs'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function MonitorCpuSemanticsArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Why AgentSight monitor CPU% and CPU milliseconds can disagree',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-11-11',
    dateModified: '2026-11-11',
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
            <span aria-current="page">Monitor CPU interpretation</span>
          </nav>
          <Eyebrow>Process resource semantics · AgentSight v1.0.35 · 11 November 2026</Eyebrow>
          <h1>Why AgentSight monitor CPU% and CPU milliseconds can disagree</h1>
          <p className="hero-lede">
            In the v1.0.35 background monitor, <code>cpu_ms</code> represents sampled CPU-time
            increments, while <code>cpu_percent</code> estimates a rate against wall time.
            <strong> They are not two units for the same number.</strong> Their first-sample behavior
            differs, and the percentage calculation does not apply the same process-start identity
            guard used by the CPU-millisecond delta.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Direct answer: compare CPU time and CPU rate only on a common interval</h2>
              <p>
                The monitor records a <code>monitor_windows.cpu_ms</code> aggregate by summing
                per-process <code>process_cpu_ms_delta</code> over the matched process family.
                The detailed <code>process_samples.cpu_percent</code> field instead calls
                <code> process_cpu_percent</code>, converting accumulated CPU ticks into a rate
                relative to elapsed monotonic wall time. Both depend on snapshots; neither is
                a kernel event ledger for every instruction executed by an agent.
              </p>
              <p>
                This is a source audit of <strong>AgentSight v1.0.35</strong> at commit
                <code> {productCommit}</code>, not a new runtime benchmark. The calculation is
                especially important when a new process enters a sampled family, a short-lived
                subprocess falls between samples, or process IDs are reused.
              </p>
              <p>
                The existing <Link href="/blog/how-agentsight-background-monitoring-works/">
                background monitoring guide</Link> owns the cadence and database architecture.
                This page covers the distinct engineering question of <em>how to interpret the
                numeric resource fields and detect incomparable baselines</em>.
              </p>
            </section>

            <section>
              <h2>Follow the two different CPU formulas</h2>
              <p>
                The process snapshot is built with <code>sysinfo</code> process data. Accumulated
                CPU milliseconds are converted to ticks using the platform clock-tick rate.
                For a process seen in both snapshots with matching <code>starttime_ticks</code>,
                <code> process_cpu_ms_delta</code> subtracts ticks, converts back to milliseconds,
                and rounds. When either the previous snapshot or matching process identity is
                missing, it returns <strong>zero</strong>.
              </p>
              <p>
                For CPU percentage, <code>process_cpu_percent</code> looks up the old process
                by PID and divides the nonnegative difference in CPU ticks by measured elapsed
                wall time, then multiplies by 100. It does <strong>not</strong> normalize by
                host CPU count. A multithreaded process can therefore exceed 100%.
              </p>
              <pre><code>{'cpu_ms ~= round(delta_cpu_ticks / clock_ticks_per_second * 1000)\n' +
                'cpu_percent ~= (delta_cpu_ticks / clock_ticks_per_second) / delta_wall_seconds * 100'}</code></pre>
              <p>
                The code paths diverge when no previous PID row exists. CPU milliseconds return
                zero, while CPU percentage falls back to <em>lifetime average CPU use</em>:
                accumulated ticks divided by elapsed process age (with a minimum age of
                0.001 seconds). That rate is not directly comparable with an adjacent two-second
                CPU-time delta. The precise measurement window also depends on the real snapshot
                timestamps, not just the configured loop interval.
              </p>
            </section>

            <section>
              <h2>A subtle identity mismatch: PID reuse</h2>
              <p>
                The v1.0.35 CPU-millisecond delta explicitly rejects a previous PID whose
                <code> starttime_ticks</code> differs from the current process. The read/write
                byte-delta path is even more explicit: its prior-state map uses a
                <code> ProcessKey</code> composed of PID and start time.
              </p>
              <p>
                The percentage function only checks that the previous snapshot contains the
                same numeric PID. If that PID was recycled for another process, its accumulated
                CPU ticks can be subtracted from the new occupant. A lower current counter is
                clamped to zero by <code>saturating_sub</code>; a higher current counter may
                produce a nonrepresentative rate. This is a <strong>code-level corner case</strong>
                demonstrated by the guard mismatch, not evidence that a particular production
                run was affected. A safe downstream comparison keys process observations by
                PID <em>and</em> start time.
              </p>
            </section>

            <section>
              <h2>Nine source-derived interpretation cases</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', minWidth: '850px', width: '100%', fontSize: '0.91rem' }}>
                  <thead><tr>
                    <th style={header}>Observation or synthetic input</th>
                    <th style={header}>Released source rule</th>
                    <th style={header}>Safe inference</th>
                  </tr></thead>
                  <tbody>{cases.map((row) => (
                    <tr key={row.caseName}>
                      <td style={cell}>{row.caseName}</td>
                      <td style={cell}>{row.sourceRule}</td>
                      <td style={cell}>{row.interpretation}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <p>
                The arithmetic inputs and PID-reuse cases are synthetic examples, not
                observed customer traces, field incidence estimates, or benchmark results.
                Tick conversion and scheduling can introduce rounding, while incomplete
                process observation can hide short-lived work.
              </p>
            </section>

            <section>
              <h2>Memory and I/O tell different stories again</h2>
              <p>
                The monitor converts each process RSS into bytes and adds those values across
                the matched process family. This is useful for locating a large family, but
                shared resident pages can be represented in multiple per-process RSS numbers.
                The summed <code>rss_bytes</code> is therefore not a precise unique-physical-
                memory measurement or a cgroup memory-usage counter.
              </p>
              <p>
                Monitor <code>read_bytes</code> and <code>write_bytes</code> come from sampled
                process disk-usage counters. The monitor stores saturating differences between
                consecutive observations keyed by PID and start time. A process first seen on
                the current tick gets zero delta; that does not establish no I/O since process
                launch. These fields also do not represent every file operation, read syscall,
                or network byte transferred.
              </p>
              <p>
                Per-session aggregate windows are written on the two-second monitor loop.
                Persisted process detail is selected only at 30-second crossings. If there are
                more than ten processes, the retained detail selects up to five highest and
                five lowest by a score ordered by CPU milliseconds, RSS, then I/O. It is not
                a complete inventory and is <strong>not sorted primarily by CPU%</strong>.
              </p>
            </section>

            <section>
              <h2>Reproduce the source inspection</h2>
              <p>
                These commands inspect the exact released implementation; they do not launch
                a monitor, read private session artifacts, or assume synthetic values were
                measured. Run them in a local checkout of the AgentSight product repository.
              </p>
              <pre><code>{'git checkout c1574366122a90c451bca6a84713e28813ab95e2\n' +
                'grep -n -E "fn process_cpu_percent|fn process_cpu_ms_delta|starttime_ticks|delta_wall" agentsight-capture/src/sources/proc.rs\n' +
                'grep -n -E "MONITOR_INTERVAL_SECS|DETAIL_SAMPLE_INTERVAL_SECS|fn aggregate_process_samples|fn process_io_delta|fn bounded_process_samples" collector/src/cmd_monitor.rs\n' +
                'grep -n -E "monitor_windows|process_samples|cpu_percent|rss_bytes" collector/src/cmd_monitor.rs'}</code></pre>
              <p>
                To evaluate an actual resource hotspot, compare consecutive complete snapshots
                for the same <code>(pid, starttime_ticks)</code>, inspect elapsed wall time,
                and distinguish short-lived descendants from the currently sampled family.
                Preserve a provider-native agent timeline if you need to attribute the
                workload to a prompt or tool decision. A high CPU% does not identify which
                agent instruction caused the load.
              </p>
            </section>

            <section>
              <h2>Sources, scope, and limits</h2>
              <ul>{references.map(([label, href]) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}</ul>
              <p>
                Reviewed 11 November 2026 against the tagged v1.0.35 source. The finding
                applies to the snapshot-backed monitor code paths described above, not
                every CPU metric in the AgentSight UI, a complete system-wide CPU usage
                accounting, or a guarantee of process lifetime coverage. Future versions
                may change identity guards or metric semantics; pin the observed version
                when exporting or comparing historical monitor databases.
              </p>
            </section>
          </article>
          <aside className="detail-aside">
            <p className="card-label">Related evidence</p>
            <Link href="/blog/how-agentsight-background-monitoring-works/">Monitor sampling and persistence</Link>
            <Link href="/blog/what-agentsight-process-exit-codes-mean/">Process EXIT evidence limits</Link>
            <Link href="/use-cases/profile-slow-expensive-agent-runs/">Profile a slow agent run</Link>
            <hr />
            <a className="button button-accent" href={site.repository}>Inspect AgentSight source</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
