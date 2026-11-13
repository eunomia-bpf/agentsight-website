import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const articlePath = '/blog/how-agentsight-record-starts-a-target/';
const productCommit = 'c1574366122a90c451bca6a84713e28813ab95e2';
const sourceRoot = 'https://github.com/eunomia-bpf/agentsight/blob/' + productCommit;

export const metadata: Metadata = {
  title: 'How AgentSight record starts a target without missing its first actions',
  description: 'A v1.0.35 source audit of the SIGSTOP/SIGCONT launch barrier, process session identity, tracer startup, shutdown cleanup, and a pre-resume failure edge case.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight record starts a target without missing its first actions',
    description: 'Inspect the released launch synchronization and its early-failure limitations.',
    url: articlePath,
  },
};

const cell = { border: '1px solid #d8dee8', padding: '0.7rem', verticalAlign: 'top' as const };
const head = { ...cell, background: '#f4f7fa', fontWeight: 700 };

const stages = [
  ['Command and TLS target resolution', 'Resolve requested executable or SSL-embedding binary; perform visible sudo preflight if needed', 'No target shell exists yet; a failure here cannot leave the target suspended'],
  ['Spawn into a new session', 'Start /bin/sh -c with positional arguments; run setsid, and optionally restore SUDO_UID/SUDO_GID', 'The new shell PID becomes the trace PID and session attribution key'],
  ['Launch barrier', 'The shell invokes kill -STOP $$ before exec of the requested command', 'Target workload is held while tracer startup proceeds; this does not make all future captures lossless'],
  ['Configure and start sensors', 'Seed process tracking, create materialized view/optional SQLite sink, optionally start web server, then await agent.run()', 'Several fallible setup calls occur after spawn and before resume'],
  ['Release target', 'After a fixed 250 ms sleep, send SIGCONT to the shell PID', 'The shell then execs the requested program and normally retains its PID'],
  ['Run and wind down', 'Consume trace events or wait for child exit/shutdown; drain events for up to 5 s after exit', 'A bounded drain is not a guarantee that every buffered event was recorded'],
] as const;

const cases = [
  ['sudo authentication fails', 'Return before spawn', 'No launched target to clean up'],
  ['Executable or TLS attachment path cannot be resolved', 'Return before spawn', 'No suspended target'],
  ['Process snapshot/seed collection fails after spawn', 'Early ? return', 'Potentially stopped child; no explicit stop_child on that path'],
  ['Tracer/materialized-view setup fails after spawn', 'Early ? return', 'Potentially stopped child; cleanup is not called on this path'],
  ['Optional web-server startup fails', 'Early ? return', 'Potentially stopped child; cleanup is not called on this path'],
  ['agent.run() returns an error', 'Explicit stop_child then return error', 'Wait up to two seconds for child; then kill if still running'],
  ['SIGCONT fails', 'Explicit stop_child then return error', 'Unsuccessful resume does not silently proceed to normal monitoring'],
  ['Target exits normally', 'Record status, drain stream for up to five seconds', 'Exit does not imply a fully complete trace or successful agent task'],
  ['Shutdown event arrives before child exit', 'Break then stop_child', 'Recorder attempts cleanup, but does not promise graceful application shutdown'],
] as const;

const sources = [
  ['record spawn, SIGSTOP/SIGCONT, early returns, and shutdown', sourceRoot + '/collector/src/cmd_exec.rs'],
  ['record TraceConfig defaults, process/stdio/TLS runners and materialization', sourceRoot + '/collector/src/cmd_trace.rs'],
  ['Tokio Child drop does not kill by default', 'https://docs.rs/tokio/1.48.0/tokio/process/struct.Child.html'],
  ['AgentSight v1.0.35 release', 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.35'],
] as const;

export default function RecordStartupArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight record starts a target without missing its first actions',
    description: metadata.description,
    url: site.url + articlePath,
    datePublished: '2026-11-13',
    dateModified: '2026-11-13',
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
            <span aria-current="page">Record startup barrier</span>
          </nav>
          <Eyebrow>Tracing startup &amp; cleanup · AgentSight v1.0.35 · 13 November 2026</Eyebrow>
          <h1>How AgentSight record starts a target without missing its first actions</h1>
          <p className="hero-lede">
            The released Linux <code>agentsight record -- command</code> path creates a child
            shell that <strong>stops itself with SIGSTOP</strong>. AgentSight starts its
            tracing runners and only then sends <code>SIGCONT</code>, allowing the shell to
            <code> exec</code> the requested program. This reduces the startup race, but
            does not guarantee complete capture—and a few early setup failures have a
            distinct child-cleanup risk.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>Why use a stopped shell rather than start the command immediately?</h2>
              <p>
                A process tracer that attaches after a target begins can miss its early file
                opens, subprocess launches, or network activity. In the v1.0.35
                <code> run_exec</code> path, AgentSight prepares credentials and resolves
                the TLS attach executable first, but it does not start the real workload
                immediately. It launches a small shell with the argument-preserving sequence:
              </p>
              <pre><code>{'target=$1; shift; kill -STOP $$; exec "$target" "$@"'}</code></pre>
              <p>
                The shell raises <code>SIGSTOP</code> on itself, not on an already running
                agent. Its PID is used for <code>pid</code> and <code>session_id</code> in
                the trace configuration. After starting the sensors, the parent waits 250 ms,
                calls <code>kill(pid, SIGCONT)</code>, and the shell executes the requested
                command. The fixed delay is a startup sequencing choice, not a measured
                proof of zero loss.
              </p>
              <p>
                This is a source-level reconstruction of <strong>AgentSight v1.0.35</strong>
                at commit <code>{' ' + productCommit}</code>, not a measured tracer-startup
                latency experiment. It addresses launch ordering and cleanup; the existing
                <Link href="/blog/what-agentsight-process-exit-codes-mean/"> process exit article</Link>
                addresses event status interpretation, and the
                <Link href="/blog/why-agentsight-tls-comm-filter-is-skipped/"> TLS filter article</Link>
                addresses attachment scope.
              </p>
            </section>

            <section>
              <h2>The six-stage launch sequence</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '800px', fontSize: '0.9rem' }}>
                  <thead><tr><th style={head}>Stage</th><th style={head}>What the source does</th><th style={head}>What it establishes</th></tr></thead>
                  <tbody>{stages.map(([stage, behavior, meaning]) => (
                    <tr key={stage}><td style={cell}>{stage}</td><td style={cell}>{behavior}</td><td style={cell}>{meaning}</td></tr>
                  ))}</tbody>
                </table>
              </div>
              <p>
                The command is launched into a new session using <code>setsid()</code>;
                when invoked as root under sudo with valid original-user environment values,
                AgentSight restores the child's UID/GID before the shell begins. The tracer
                can still require elevated privileges. These two identities must not be
                confused: the target's effective user need not be the tracer's effective user.
              </p>
              <p>
                The default session database is named <code>agentsight-YYYYMMDD-HHMMSS.db</code>
                in the current directory. The record configuration enables TLS, process,
                network, stdio, and sampled system tracing, but their respective filters,
                permissions, buffer limits, and evidence boundaries still apply.
              </p>
            </section>

            <section>
              <h2>Failure-path audit: a possible suspended-child leak before resume</h2>
              <p>
                After <code>spawn()</code> and before <code>SIGCONT</code>, three
                fallible steps—<code>prepare_process_seeds()</code>,
                <code> build_trace_agent_with_view()</code>, and optional
                <code> start_web_server_if_enabled()</code>—can return using
                <code> ?</code> without an explicit <code>stop_child()</code>.
                The same function <em>does</em> call <code>stop_child()</code> for
                errors returned by <code>agent.run()</code> and <code>continue_child()</code>.
              </p>
              <p>
                The Tokio process handle does not terminate the child on drop by default,
                and this command builder does not set <code>kill_on_drop(true)</code>.
                The combination creates a <strong>source-supported risk</strong> that a
                stopped shell survives a recorder setup failure, requiring manual diagnosis
                by an operator. Whether the race is hit depends on the precise failure
                and scheduling order; no field incident or reproduction is claimed here.
              </p>
              <p>
                A robust implementation could scope child ownership with an explicit cleanup
                guard across all post-spawn setup errors and avoid relying on implicit drop
                behavior. This is a source-level engineering recommendation, not a claim that
                it is already fixed in v1.0.35.
              </p>
            </section>

            <section>
              <h2>Nine failure and lifecycle cases</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', minWidth: '800px', width: '100%', fontSize: '0.9rem' }}>
                  <thead><tr><th style={head}>Condition</th><th style={head}>Control flow</th><th style={head}>Safe inference</th></tr></thead>
                  <tbody>{cases.map(([condition, flow, meaning]) => (
                    <tr key={condition}><td style={cell}>{condition}</td><td style={cell}>{flow}</td><td style={cell}>{meaning}</td></tr>
                  ))}</tbody>
                </table>
              </div>
              <p>
                After a normal target exit, the recorder performs a bounded five-second stream
                drain and may print a SQLite-backed session summary. It does not guarantee
                that kernel buffers, TLS plaintext, child process work, or agent-native events
                form a complete causal history. A successful <code>exec</code> and observed
                process exit are distinct from successful task completion.
              </p>
            </section>

            <section>
              <h2>Reproduce the implementation inspection safely</h2>
              <p>
                Inspect the exact released code in a local product checkout; these commands
                only read source and do not launch a tracer, send signals to processes, or
                generate sensitive session artifacts:
              </p>
              <pre><code>{'git checkout c1574366122a90c451bca6a84713e28813ab95e2\n' +
                'grep -n -E "kill -STOP|setsid\(|prepare_process_seeds|build_trace_agent_with_view|start_web_server_if_enabled|agent.run|continue_child|stop_child|drain_stream_for" collector/src/cmd_exec.rs\n' +
                'grep -n -E "fn for_record|build_stdio_args|fn build_trace_agent_with_view" collector/src/cmd_trace.rs\n' +
                'grep -n -E "kill_on_drop" collector/src/cmd_exec.rs'}
              </code></pre>
              <p>
                The last grep is expected to find no <code>kill_on_drop</code> call in this
                source file. For a real failed launch, record the error phase first; before
                manually signaling any suspected stopped PID, independently confirm its
                executable, parent, owner, and session identity. Do not blindly resume or
                kill a PID inferred only from a stale error message.
              </p>
            </section>

            <section>
              <h2>Sources and limitations</h2>
              <ul>{sources.map(([label, href]) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}</ul>
              <p>
                Reviewed 13 November 2026. This audit covers the Linux
                <code> record -- command</code> path in tagged v1.0.35, not arbitrary
                <code> trace</code>, <code>top</code>, Windows/macOS native-session viewing,
                or all process supervisors. It infers potential failure behavior from
                the visible Rust control flow and documented Tokio drop semantics;
                it does not establish how frequently failures occur or prove a specific
                user process was left stopped.
              </p>
            </section>
          </article>
          <aside className="detail-aside">
            <p className="card-label">Related reading</p>
            <Link href="/blog/what-agentsight-process-exit-codes-mean/">Process exit evidence and limits</Link>
            <Link href="/blog/why-agentsight-tls-comm-filter-is-skipped/">TLS attach and filters</Link>
            <Link href="/blog/how-agentsight-reports-capture-loss/">Trace loss and partial evidence</Link>
            <hr />
            <a className="button button-accent" href={site.repository}>Inspect released source</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
