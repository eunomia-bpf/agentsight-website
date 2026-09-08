import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = 'bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const articlePath = '/blog/how-agentsight-background-monitoring-works/';

export const metadata: Metadata = {
  title: 'How AgentSight background monitoring samples agent sessions',
  description:
    'A source-level guide to AgentSight v1.0.31 monitor: two-second aggregate windows, 30-second bounded detail samples, weekly SQLite files, process/file/network semantics, and the limits of sampled evidence.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight background monitoring samples agent sessions',
    description:
      'See exactly what agentsight monitor persists, how often it samples, what its file and network rows mean, and why a monitor DB is not a complete event trace.',
    url: articlePath,
  },
};

const sources = [
  [
    'AgentSight v1.0.31 monitor implementation and SQLite schema',
    `${productSource}/collector/src/cmd_monitor.rs`,
  ],
  [
    'AgentSight v1.0.31 installation guide: monitor/bind roles, service setup, and retained local data',
    `${productSource}/docs/installation.md`,
  ],
  [
    'AgentSight v1.0.31 README: monitor storage and local-data handling',
    `${productSource}/README.md`,
  ],
  [
    'AgentSight system-friction source guide: monitor DBs are sampled/windowed evidence rather than complete traces',
    `${productSource}/skills/agentsight-system-friction/references/agentsight-sources.md`,
  ],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function BackgroundMonitorArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight background monitoring samples agent sessions',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-09-08',
    dateModified: '2026-09-08',
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
            <span aria-current="page">Background monitor</span>
          </nav>
          <Eyebrow>Sampling internals · AgentSight v1.0.31 · 8 September 2026</Eyebrow>
          <h1>How AgentSight background monitoring samples agent sessions</h1>
          <p className="hero-lede">
            <code>agentsight monitor</code> is deliberately different from a full recording. It watches matched agent
            process families continuously and writes a compact local history: aggregate resource and target counts every two
            seconds, with bounded process, file, and network detail at 30-second boundaries. That makes the monitor database
            useful for long-running operational evidence, but it also creates limits that matter when you interpret it.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer</h2>
              <p>
                AgentSight v1.0.31 samples up to 25 matched live agent sessions on a two-second loop. Every sampled session
                gets a <code>monitor_windows</code> row with process count, CPU delta, resident memory, read/write byte
                deltas, and counts of visible file and network targets. Detailed process and target rows are not written on
                every loop: the implementation stores them only when a sample crosses a 30-second boundary.
              </p>
              <p>
                The result is a local SQLite database under <code>~/.agentsight/monitor</code>. The product itself describes
                these DBs as sampled, windowed evidence rather than a complete trace. If you need the exact sequence of
                process, file, or TLS events for one bounded run, use the durable <code>record</code> path instead of
                inferring missing events from a background monitor window.
              </p>
            </section>

            <section>
              <h2>One monitor loop has two resolutions</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '820px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Resolution</th>
                      <th style={header}>Persisted data</th>
                      <th style={header}>Useful question</th>
                      <th style={header}>Do not infer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>Every ~2 seconds</td>
                      <td style={cell}>Session identity, process count, CPU ms, RSS bytes, read/write byte deltas, file-target count, network-target count.</td>
                      <td style={cell}>When was this session active, resource-heavy, or associated with many visible targets?</td>
                      <td style={cell}>The exact process/file/network event sequence inside the window.</td>
                    </tr>
                    <tr>
                      <td style={cell}>At ~30-second boundaries</td>
                      <td style={cell}>Bounded process rows plus bounded file and network target rows for that window.</td>
                      <td style={cell}>Which concrete processes or targets are representative near this part of the run?</td>
                      <td style={cell}>That omitted rows never existed; detail is intentionally sampled and bounded.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The 30-second gate is implemented by comparing the integer 30-second bucket containing the start and end of
                the current two-second window. It is therefore a boundary sample, not a second independent timer that records
                an exhaustive 30 seconds of events.
              </p>
            </section>

            <section>
              <h2>The aggregate row is richer than a process count</h2>
              <p>
                For each matched session, the monitor walks the current process family. It computes CPU time as a delta from
                the previous process snapshot, reads current RSS, and derives read/write byte deltas from per-process I/O
                counters. The row also carries the root PID together with its process start-time ticks. That extra start-time
                identity matters because a PID can be reused after a process exits.
              </p>
              <p>
                The <code>tracked_sessions</code> table keeps first/last-seen timestamps, agent type, match evidence and
                confidence, optional native-session path, command, working directory, and a running status. Its key combines
                session ID, root PID, and root process start time rather than assuming the numeric PID is globally stable.
              </p>
            </section>

            <section>
              <h2>File targets are open-descriptor observations, not file-operation logs</h2>
              <p>
                The monitor&apos;s file view is built from <code>/proc/&lt;pid&gt;/fd</code>. For every process in the matched
                family, AgentSight scans current descriptor targets, keeps absolute paths, and excludes the common
                <code>/dev/null</code> and <code>/dev/zero</code> sinks. It re-checks the process start time around the scan so
                PID reuse does not silently attach another process&apos;s descriptors to the old session.
              </p>
              <p>
                This has an important interpretation boundary. A path appearing in a monitor DB means it was visible as an
                open descriptor at a sampling point. A path missing from the DB does not prove it was never opened, read,
                written, renamed, or deleted between samples. For a review that depends on exact low-level file events, use a
                recording source designed to capture those events.
              </p>
            </section>

            <section>
              <h2>Network targets are sampled IP endpoints, not HTTP requests</h2>
              <p>
                Socket descriptors are resolved through Linux <code>/proc</code> TCP tables. The implementation maps socket
                inodes to IPv4 or IPv6 endpoints and stores an address plus port. It does not turn that row into a DNS name,
                HTTP route, request body, or security verdict. A target such as <code>203.0.113.10:443</code> is an endpoint
                observation at that sampling boundary.
              </p>
              <p>
                This is intentionally different from AgentSight&apos;s TLS/model-call capture. Background network samples are
                useful for “which destinations were visible around the resource spike?” They are not a replacement for the
                content and protocol evidence needed to explain a specific API call.
              </p>
            </section>

            <section>
              <h2>Detailed rows are capped at the edges</h2>
              <p>
                A session can have many processes, paths, or sockets. To keep a long-running monitor database bounded,
                v1.0.31 uses a detail-edge limit of five. When there are more than ten candidate process rows, it stores up to
                five from the high end of a score ordered by CPU, then RSS, then I/O, and fills the remainder from the low
                end. File and network target details use the same five-plus-five shape, ranked primarily by observed count.
              </p>
              <p>
                The aggregate window still stores total process count and the number of distinct visible file/network targets.
                The detailed tables are therefore examples from the edges of the sampled set, not an exhaustive expansion of
                those totals. Treating the detail table row count as the real process or target count would be a measurement
                error.
              </p>
            </section>

            <section>
              <h2>The “weekly DB” name has a restart boundary in v1.0.31</h2>
              <p>
                AgentSight names the default database by the local ISO week, for example
                <code>~/.agentsight/monitor/monitor-2026-W25.db</code>. One implementation detail is easy to miss: the
                database path is chosen when <code>monitor</code> starts and the store is opened once before the sampling loop.
                The loop does not reopen the database when the calendar crosses into another ISO week.
              </p>
              <p>
                So in v1.0.31, a monitor process that runs continuously across a week boundary can continue writing to the
                file named for its start week until it restarts. The installation guide already recommends restarting the
                user service or scheduled task after replacing the binary; a restart also causes the next monitor process to
                select the then-current week filename. Do not assume filename alone proves every row belongs to that ISO week;
                use the stored window timestamps when analyzing boundaries.
              </p>
            </section>

            <section>
              <h2><code>monitor</code> and <code>bind</code> solve different background jobs</h2>
              <p>
                The installation guide separates the two explicitly. <code>monitor</code> samples active sessions and writes
                local weekly databases. <code>bind</code> serves the authenticated Node API and maintains the optional outbound
                Controller relay. Running the browser-facing Node does not mean the monitor is persisting a background history,
                and running the monitor does not expose a new browser API port.
              </p>
              <p>
                On Linux, <code>agentsight monitor install-service</code> installs a per-user systemd service with
                <code>Restart=on-failure</code>. The built-in service installer is Linux-specific; the current installation
                guide uses a per-user scheduled task for Windows. Both are operational wrappers around the same
                <code>agentsight monitor</code> subcommand.
              </p>
            </section>

            <section>
              <h2>The database is local, but the rows can still be sensitive</h2>
              <p>
                The monitor schema can persist commands, working directories, native-session paths, file paths, and network
                endpoints. The broader AgentSight README warns that saved logs and databases can contain sensitive prompts,
                responses, paths, headers, and network targets depending on the capture source. The installation guide also
                notes that removing startup units does not remove existing monitor databases.
              </p>
              <p>
                Operationally, treat <code>~/.agentsight/monitor</code> as retained evidence: set host-level permissions and
                retention according to the machine&apos;s data policy, and delete old databases separately only when their
                evidence is no longer needed. Do not commit them into a source repository as a convenient debugging artifact.
              </p>
            </section>

            <section>
              <h2>Use monitor evidence for trends; switch sources for exact causality</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Question</th>
                      <th style={header}>Best starting evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={cell}>Which agent sessions were active during a CPU/RSS spike?</td><td style={cell}>Monitor windows.</td></tr>
                    <tr><td style={cell}>Which file or endpoint was visible near a sampled spike?</td><td style={cell}>Monitor detail rows, with the sampling caveat preserved.</td></tr>
                    <tr><td style={cell}>Did a short-lived file open occur between samples?</td><td style={cell}>A full system recording, not absence from the monitor DB.</td></tr>
                    <tr><td style={cell}>Which exact plaintext model request produced an action?</td><td style={cell}>Recorded model/TLS evidence plus correlated system activity.</td></tr>
                    <tr><td style={cell}>What did the agent itself persist about models, tools, or tokens?</td><td style={cell}>Native agent-session evidence or the appropriate report path.</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>How to verify the behavior yourself</h2>
              <p>
                The reproducible source for this page is the v1.0.31 implementation. Start with{' '}
                <a href={`${productSource}/collector/src/cmd_monitor.rs`}><code>cmd_monitor.rs</code></a>: inspect the two-second
                loop, 30-second detail gate, process and descriptor scans, edge-bounding functions, weekly path function, and
                SQLite schema. Then read{' '}
                <a href={`${productSource}/docs/installation.md`}>the installation guide</a> for the service lifecycle and the
                monitor/bind boundary.
              </p>
              <p>
                If you are using a monitor DB for an investigation, keep the raw window timestamps and source version with
                your analysis. Those two fields are more reliable evidence than assuming the filename or a missing detail row
                means more than the implementation actually guarantees.
              </p>
            </section>

            <section>
              <h2>Primary sources</h2>
              <ul>
                {sources.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}
              </ul>
            </section>
          </article>

          <aside className="detail-aside">
            <p className="card-label">Continue exploring</p>
            <Link href="/blog/when-agentsight-works-without-ebpf/">Choose native-session vs system evidence</Link>
            <Link href="/blog/read-agentsight-audit-provenance/">Preserve audit provenance</Link>
            <Link href="/blog/how-agentsight-direct-node-credentials-work/">Understand the Direct Node boundary</Link>
            <hr />
            <a className="button button-accent" href={site.repo}>Inspect AgentSight source</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
