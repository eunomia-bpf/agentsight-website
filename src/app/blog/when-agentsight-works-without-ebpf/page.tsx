import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = '934f441eff8ca210807333633f47b2efcb8cd020';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const articlePath = '/blog/when-agentsight-works-without-ebpf/';

export const metadata: Metadata = {
  title: 'When AgentSight works without eBPF—and when it does not',
  description:
    'A source-level guide to AgentSight v1.0.30 native-session mode: which top, bind, vis, and report workflows work without sudo or eBPF, what evidence they contain, and when record or eBPF debug is still required.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'When AgentSight works without eBPF—and when it does not',
    description:
      'Choose between native agent-session evidence and independent eBPF system observation without treating one source as stronger evidence than it is.',
    url: articlePath,
  },
};

const sources = [
  [
    'AgentSight v1.0.30 README: platform prerequisites, no-eBPF commands, record workflow, native-session report, and repository replay',
    `${productSource}/README.md`,
  ],
  [
    'AgentSight v1.0.30 usage guide: top fallback, record boundary, bind behavior, local session index, and vis without sudo',
    `${productSource}/docs/usage.md`,
  ],
  [
    'AgentSight v1.0.30 native analysis source',
    `${productSource}/ext/analysis/src/sources/agent_native.rs`,
  ],
  [
    'AgentSight v1.0.30 native session parser',
    `${productSource}/ext/session/src/parser.rs`,
  ],
  [
    'AgentSight v1.0.30 bind implementation: live-host and local-session Node path',
    `${productSource}/collector/src/cmd_bind.rs`,
  ],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function NoEbpfArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'When AgentSight works without eBPF—and when it does not',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-08-29',
    dateModified: '2026-08-29',
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
            <span aria-current="page">Without eBPF</span>
          </nav>
          <Eyebrow>Evidence modes · AgentSight v1.0.30 · 29 August 2026</Eyebrow>
          <h1>When AgentSight works without eBPF—and when it does not</h1>
          <p className="hero-lede">
            AgentSight is often described as an eBPF observability tool, but several everyday workflows do not need eBPF
            at all. <code>top</code>, <code>bind</code>, <code>vis</code>, and <code>report</code> can use agent-native
            session files on Windows, macOS, or Linux. The important distinction is not just privilege or platform: native
            sessions and an eBPF recording answer different evidence questions.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer</h2>
              <p>
                Use the no-eBPF path when the question can be answered from local agent state: which sessions exist,
                what model and token information the agent recorded, which native Tool actions are present, how coding
                activity moved through a repository, or which local session you want to open in the hosted app. AgentSight
                v1.0.30 explicitly documents native-session support for <code>top</code>, <code>bind</code>,
                <code>vis</code>, and <code>report</code> without requiring eBPF.
              </p>
              <p>
                Use <code>record</code> or an eBPF-backed debug command when the question is independent system behavior:
                what processes actually executed, which files were opened at the kernel boundary, what resource activity
                happened, or which TLS/plaintext traffic crossed the instrumented runtime boundary. On Linux, those
                capture paths require the privileges needed to load the probes.
              </p>
            </section>

            <section>
              <h2>What works without eBPF</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '820px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Workflow</th>
                      <th style={header}>No-eBPF input</th>
                      <th style={header}>Useful for</th>
                      <th style={header}>Important limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}><code>agentsight top</code></td>
                      <td style={cell}>Local agent sessions plus process snapshots.</td>
                      <td style={cell}>Live session inventory, model/token state, process CPU/RSS, and a quick machine view.</td>
                      <td style={cell}>Without eBPF privilege, it does not become an independent kernel event trace.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>agentsight bind</code></td>
                      <td style={cell}>Live host processes and the local agent-session index, or an explicit saved DB.</td>
                      <td style={cell}>Opening local AgentSight data in the hosted or self-hosted browser UI.</td>
                      <td style={cell}>The browser sees the evidence available to the Node; binding does not create missing system evidence.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>agentsight vis</code></td>
                      <td style={cell}>Matching local Claude, Codex, and Gemini sessions.</td>
                      <td style={cell}>Repository replay and portable Agent Nebula artifacts.</td>
                      <td style={cell}>Native Tool/file actions are not proof of every low-level filesystem effect.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>agentsight report</code></td>
                      <td style={cell}>Saved AgentSight DBs or supported local agent sessions, depending on the report.</td>
                      <td style={cell}>Structured summaries, token analysis, native-session inspection, or saved-record queries.</td>
                      <td style={cell}>The evidence lineage depends on whether the row came from a recording, reconstruction, or native session.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2><code>top</code> is intentionally hybrid</h2>
              <p>
                The usage guide describes <code>top</code> as the normal live view and makes sudo optional. Without eBPF
                privileges, it falls back to process snapshots and agent-native sessions. If sudo is already available on
                Linux, AgentSight can enable the richer eBPF-backed live capture automatically. This makes
                <code>agentsight top</code> a useful first command on a laptop because the command remains useful even when
                the kernel tracing path is unavailable.
              </p>
              <p>
                That convenience should not erase the source boundary. A native session can tell AgentSight about model,
                token, tool, and session facts that the agent persisted. A process snapshot can tell it what is running and
                expose current CPU/RSS. Neither source, by itself, proves the complete sequence of file and process events
                that an independent eBPF recording can observe.
              </p>
            </section>

            <section>
              <h2><code>bind</code> is a presentation path, not a recording mode</h2>
              <p>
                Running <code>agentsight bind</code> starts a local Node and lets the browser query it. With no
                <code>--db</code>, v1.0.30 builds the Node around a live host view and the local session index. With
                <code>--db</code>, it serves a saved capture. The command is unprivileged because its job is to expose
                evidence AgentSight can already read; it does not silently start eBPF recording just because the hosted
                app is open.
              </p>
              <p>
                This distinction is useful operationally. You can inspect native Claude, Codex, or Gemini history from a
                browser on macOS or Windows, or on a Linux machine where you do not want to grant probe-loading privilege.
                If the investigation later needs independent system events, reproduce the workload under
                <code>record</code> on a supported Linux host rather than interpreting a browser connection as stronger
                capture.
              </p>
            </section>

            <section>
              <h2>Repository replay is native-session evidence by design</h2>
              <p>
                <code>agentsight vis</code> is the clearest example of why “no eBPF” does not mean “no useful evidence.”
                It scans matching local Claude, Codex, and Gemini sessions and reconstructs an ordered repository
                trajectory. That is enough to show where an agent moved through a worktree, which native file actions it
                recorded, and how activity changed over time. It is particularly useful when the run already happened and
                no recorder was active.
              </p>
              <p>
                The evidence model is deliberately bounded. A native Tool action describes what the agent recorded it
                invoked; optional system observations can independently describe low-level effects; only session semantic
                content can answer why an action was chosen. For a deeper treatment of that boundary, see
                {' '}<Link href="/blog/replay-coding-agent-repository-changes/">the Agent Nebula replay methods guide</Link>.
              </p>
            </section>

            <section>
              <h2><code>report</code> can mix evidence classes, so provenance matters</h2>
              <p>
                Some reports operate on an AgentSight SQLite recording, while others can summarize local agent sessions.
                The README exposes <code>agentsight report --local</code> for native Claude/Codex/Gemini history and lets
                token reporting fall back to local agent sessions when appropriate. A saved <code>record</code> database,
                by contrast, can contain system capture and reconstructed model activity.
              </p>
              <p>
                Do not collapse those sources into one trust level. AgentSight carries provenance such as native-session,
                direct-view, SQLite reconstruction, and legacy/unknown lineage in its audit model. If you are comparing or
                exporting evidence, preserve that source rather than treating every row as if it came from a kernel probe.
                The <Link href="/blog/read-agentsight-audit-provenance/">audit provenance guide</Link> explains the current
                confidence and lineage semantics.
              </p>
            </section>

            <section>
              <h2>What requires eBPF today</h2>
              <p>
                The documented boundary is straightforward: <code>record</code> and the eBPF-backed debug commands are
                Linux capture workflows. The usage guide says commands that load eBPF probes should run with sudo, with
                <code>top</code> as the notable command that can remain useful without it. <code>record</code> starts the
                normal durable capture path with SSL, process, system, and web-view collection and saves an AgentSight
                SQLite session for later reporting.
              </p>
              <pre><code>{`# No eBPF required for the native-session path
agentsight top
agentsight report --local
agentsight vis
agentsight bind

# Linux system-boundary recording
sudo agentsight record -- claude

# Advanced eBPF-backed debug capture
sudo agentsight debug trace --server -c claude
sudo agentsight debug ssl --http-parser`}</code></pre>
            </section>

            <section>
              <h2>Use the evidence question to choose the mode</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '780px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Question</th>
                      <th style={header}>Start with</th>
                      <th style={header}>Why</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>Which local agent sessions exist and what tokens/models did they report?</td>
                      <td style={cell}>Native <code>top</code> or <code>report --local</code></td>
                      <td style={cell}>The agent already persisted the relevant session facts.</td>
                    </tr>
                    <tr>
                      <td style={cell}>How did an existing coding run move through this repository?</td>
                      <td style={cell}><code>vis</code></td>
                      <td style={cell}>Repository replay is designed around ordered native Tool/file actions.</td>
                    </tr>
                    <tr>
                      <td style={cell}>I want to browse native history from another browser.</td>
                      <td style={cell}><code>bind</code></td>
                      <td style={cell}>Binding presents local evidence; it does not require probe loading.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Which child processes and low-level file effects actually occurred during this run?</td>
                      <td style={cell}><code>record</code></td>
                      <td style={cell}>Independent system-boundary evidence is the point of the Linux capture path.</td>
                    </tr>
                    <tr>
                      <td style={cell}>What plaintext model traffic crossed a supported TLS/runtime boundary?</td>
                      <td style={cell}><code>record</code> or <code>debug ssl</code></td>
                      <td style={cell}>That evidence comes from runtime/system instrumentation rather than native transcript files.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>No-eBPF mode is not a weaker version of the same dataset</h2>
              <p>
                The most common mistake is to think of native mode as “eBPF mode with fewer events.” It is better to see
                the two paths as different sensors. Native sessions are close to agent semantics and often contain model,
                tool, token, and conversation context that a system tracer would have to reconstruct. eBPF observation is
                independent of those agent logs and is better at real process, file, network, and runtime effects. Each
                source can be stronger for a different question.
              </p>
              <p>
                That is the same system-boundary principle behind AgentSight more broadly: use native telemetry where it is
                authoritative, use independent observation where the run crosses process or system boundaries, and keep the
                lineage visible when the two are correlated. The broader comparison is in
                {' '}<Link href="/blog/system-boundary-observability/">Why AI agent observability needs a system boundary</Link>.
              </p>
            </section>

            <section>
              <h2>Practical platform guidance</h2>
              <p>
                On macOS and Windows, start with the native-session commands because the README explicitly supports
                <code>top</code>, <code>bind</code>, <code>vis</code>, and <code>report</code> from agent-native files. On
                Linux, the same commands work without granting eBPF privilege, while <code>top</code> can take advantage of
                richer capture when sudo is already available. Move to <code>record</code> when your question requires
                independent system evidence and the host can safely grant the required Linux tracing privilege.
              </p>
              <p>
                If the data will leave the machine, review the evidence first. Native session history can include prompts,
                responses, repository paths, tool results, and other sensitive development context; recorded system data can
                include paths, network targets, headers, or payload material. The <Link href="/security/">security and data
                handling page</Link> is the right boundary before sharing either form.
              </p>
            </section>

            <section>
              <h2>Primary sources</h2>
              <ul>
                {sources.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}
              </ul>
            </section>
          </article>

          <aside className="article-aside">
            <div className="aside-card">
              <Eyebrow>Decision</Eyebrow>
              <h2>Native first when the agent log owns the fact. Record when the machine must own the fact.</h2>
              <p>
                Platform support and sudo are practical constraints, but the stronger rule is evidentiary: choose the sensor
                that can actually establish the claim you need.
              </p>
            </div>
            <div className="aside-card">
              <Eyebrow>Related</Eyebrow>
              <ul>
                <li><Link href="/blog/system-boundary-observability/">System-boundary observability</Link></li>
                <li><Link href="/blog/replay-coding-agent-repository-changes/">Repository replay methods</Link></li>
                <li><Link href="/blog/read-agentsight-audit-provenance/">Audit provenance and confidence</Link></li>
                <li><Link href="/security/">Security and data handling</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
