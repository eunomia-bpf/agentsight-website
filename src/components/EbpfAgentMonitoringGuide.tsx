import Link from 'next/link';
import { ArrowLink, CommandBlock, Eyebrow, JsonLd, OutcomeList } from './PageParts';
import { SiteShell } from './SiteShell';
import { contentPath, type ContentPage } from '@/lib/public-content';
import { site } from '@/lib/site';

const productCommit = 'bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3';
const sourceBase = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const productReadme = `${sourceBase}/README.md`;
const agentGuide = `${sourceBase}/docs/agents.md`;
const monitorSource = `${sourceBase}/collector/src/cmd_monitor.rs`;
const bpfReadme = `${sourceBase}/bpf/README.md`;
const sslsniffSource = `${sourceBase}/bpf/sslsniff.c`;
const kernelUprobes = 'https://docs.kernel.org/trace/uprobetracer.html';

const cell = { border: '1px solid #d8dee8', padding: '0.72rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export function EbpfAgentMonitoringGuide({ page }: { page: ContentPage }) {
  const path = contentPath(page);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: page.title,
      description: page.description,
      url: `${site.url}${path}`,
      dateModified: '2026-09-20',
      author: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
      publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'AgentSight', item: site.url },
        { '@type': 'ListItem', position: 2, name: page.title, item: `${site.url}${path}` },
      ],
    },
  ];

  return (
    <SiteShell>
      <JsonLd value={jsonLd} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-current="page">{page.title}</span>
          </nav>
          <Eyebrow>Mechanism guide · refreshed 20 September 2026 · AgentSight v1.0.31</Eyebrow>
          <h1>{page.title}</h1>
          <p className="hero-lede">
            eBPF is one observation plane inside AgentSight, not a claim that every AgentSight signal comes from the kernel. The useful model is to separate Linux process/file capture, sampled background process evidence, user-space plaintext hooks, and agent-native session data, then correlate the sources that can actually answer the debugging question.
          </p>
          <OutcomeList
            items={[
              'Choose between record, monitor, native-session, and TLS evidence without treating them as equivalent.',
              'Interpret sampled file and network targets without turning an absence into proof that an event never happened.',
              'Know which AgentSight paths require Linux/eBPF and which remain useful on macOS and Windows.',
            ]}
          />
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short version: “eBPF monitoring” is a stack of evidence boundaries</h2>
              <p>
                AgentSight v1.0.31 describes itself as a local-first, <code>top</code>/<code>strace</code>-like observability tool for AI agents. The product can connect prompts, model calls, and tool decisions with process execution, file activity, resource use, and network-facing evidence, but those facts do not all arrive through one BPF program. Linux eBPF is the system-observation mechanism for recorded and debug capture. TLS plaintext uses user-space probes against the runtime that owns encryption. Background monitoring samples live process state. Native Claude, Codex, Gemini, and other supported session sources provide higher-level agent semantics.
              </p>
              <p>
                That distinction matters when a trace is incomplete. A missing native token field, a missed two-second process sample, an unsupported TLS binary, and an eBPF attachment failure are different failure modes. Treating them all as “eBPF missed it” produces bad debugging conclusions.
              </p>
            </section>

            <section>
              <h2>Choose the observation plane before you interpret the result</h2>
              <div style={{ overflowX: 'auto', margin: '1.25rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '840px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>AgentSight path</th>
                      <th style={header}>Primary evidence</th>
                      <th style={header}>Platform / privilege</th>
                      <th style={header}>Important limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}><code>sudo agentsight record -- &lt;command&gt;</code></td>
                      <td style={cell}>A bounded saved run that combines system capture with reconstructed model/tool activity where supported.</td>
                      <td style={cell}>Linux with eBPF support; probe setup is elevated while the monitored command remains the user workflow.</td>
                      <td style={cell}>Coverage depends on the selected process family, probe support, runtime packaging, and the plaintext/parser path used by that agent.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>agentsight monitor</code></td>
                      <td style={cell}>Periodic process/resource aggregates plus bounded samples of process, open-descriptor file targets, and network endpoints.</td>
                      <td style={cell}>Current background service path targets Linux process state.</td>
                      <td style={cell}>It is sampled state, not a complete syscall or network-event ledger.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>agentsight top</code>, <code>report --local</code>, <code>vis</code></td>
                      <td style={cell}>Supported agent-native sessions plus live process snapshots; <code>top</code> can add eBPF when privilege is available.</td>
                      <td style={cell}>Native-session paths work on Windows, macOS, and Linux without eBPF.</td>
                      <td style={cell}>Native records have strong agent semantics but only the fields the provider persists locally.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>agentsight debug ssl</code> / TLS path</td>
                      <td style={cell}>Plaintext bytes at a supported user-space TLS implementation before encryption or after decryption.</td>
                      <td style={cell}>Linux user-space probe path; executable and TLS implementation matter.</td>
                      <td style={cell}>A successful uprobe does not guarantee that the application protocol can be reconstructed as an LLM call.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>Process-family scope is more useful than one PID</h2>
              <p>
                Coding agents rarely do all work in the original CLI process. A tool call can launch a shell, compiler, test runner, package manager, browser helper, language server, or MCP server, which can launch more descendants. The meaningful system unit is therefore the process family tied to the run, not only the visible parent PID.
              </p>
              <p>
                This is where system observation adds information that an application trace may not contain. A native tool event can say that the agent chose a Bash command. A process-oriented view can show which executable actually ran underneath it, which descendants appeared, and where CPU or memory accumulated. Neither source should be stretched beyond its boundary: a process event cannot tell you why the model selected the tool, while a tool event is not automatically a complete ledger of descendant effects.
              </p>
            </section>

            <section>
              <h2>Background monitor data is sampled state, not a hidden event log</h2>
              <p>
                AgentSight v1.0.31 makes the sampling contract inspectable in <code>collector/src/cmd_monitor.rs</code>. The monitor refresh interval is two seconds and each refresh scans up to 25 matched live sessions. Every aggregate window can retain process/resource deltas and target counts. Detailed process, file, and network samples are intentionally bounded: detail is persisted when a sample crosses a 30-second bucket boundary, with edge lists capped to five entries per ranking side.
              </p>
              <p>
                File targets in this path come from the process family&apos;s current <code>/proc/&lt;pid&gt;/fd</code> descriptors, with PID start-time checks used to avoid confusing PID reuse. Network targets are sampled IP:port endpoints derived from the Linux process/socket state. This is different from saying “AgentSight recorded every open, close, connect, and send.” A path that opened and closed between samples can be absent from the detail table; an endpoint missing from a sample is not proof that the session never contacted it.
              </p>
              <p>
                The safe interpretation is positive and bounded: “this target was observed during this sampled window.” If a security or correctness conclusion depends on proving that no other path or endpoint was used, reproduce the task with a capture mode that observes the needed event boundary and state the remaining coverage assumptions.
              </p>
            </section>

            <section>
              <h2>Linux eBPF and portable native-session workflows complement each other</h2>
              <p>
                The v1.0.31 README draws a concrete platform line. <code>record</code> and the eBPF-backed debug commands require Linux with eBPF support. In contrast, <code>top</code>, <code>bind</code>, <code>vis</code>, and <code>report</code> can use agent-native session files on Windows, macOS, or Linux. On Linux, <code>top</code> can additionally enable eBPF capture when suitable sudo access is already available.
              </p>
              <p>
                This means “AgentSight works without eBPF” and “AgentSight uses eBPF for system observation” are both true, but they answer different questions. Native session data is often the better source for prompt identity, provider-specific response structure, model metadata, tool semantics, and token fields. eBPF-backed capture is useful when the question crosses into independent process or file effects that the agent itself did not persist.
              </p>
            </section>

            <section>
              <h2>TLS plaintext is a user-space attachment problem</h2>
              <p>
                The TLS path is the easiest place to over-generalize from the word eBPF. Linux uprobes attach to a user-space object path and a symbol or offset. Agent runtimes can use shared OpenSSL, OpenSSL embedded in Node, stripped Bun/BoringSSL, rustls, Electron helper processes, or a protocol that is not TLS at all. AgentSight therefore has to resolve the executable and select a runtime-specific plaintext boundary before BPF can observe useful bytes.
              </p>
              <p>
                The dedicated <Link href="/blog/why-ai-agent-tls-traffic-is-hard-to-trace/">TLS diagnostics guide</Link> owns those runtime-specific details. The top-level rule here is simpler: “uses eBPF” does not mean ciphertext can be generically decoded in the kernel. The product observes plaintext where the supported runtime exposes an attachable boundary, then higher-level parsing decides whether those bytes can become model-call evidence.
              </p>
            </section>

            <section>
              <h2>Correlation is the product layer above the probes</h2>
              <p>
                Raw process events, file targets, sampled sockets, and plaintext buffers are not yet an agent explanation. AgentSight stores recorded runs as local SQLite artifacts and exposes them through the overview, timeline, process tree, metrics, reports, and other views. The useful operation is correlation: line a model or tool phase up with the process family and machine effects that happened in the same run, while keeping the original evidence source visible.
              </p>
              <p>
                For an investigation, preserve provenance rather than flattening everything into one generic “agent event.” A provider-native prompt, an eBPF process event, a sampled monitor target, and a reconstructed TLS call have different completeness guarantees. Source identity is part of the result.
              </p>
            </section>

            <section>
              <h2>A practical verification sequence</h2>
              <p>
                Start with the least invasive source that can answer the question, then add a lower-level boundary only when the first source leaves an ambiguity. For a live agent, inspect <code>top</code>. For an existing local session, use <code>report --local</code> or <code>vis</code>. When you need a reproducible Linux system profile, record a bounded command and inspect the saved audit. Use the background monitor for longitudinal sampled state, not as a substitute for event-complete capture. Only move into TLS diagnostics when the investigation actually requires provider payload reconstruction.
              </p>
              <CommandBlock
                commands={[
                  'agentsight top',
                  'agentsight report --local',
                  'sudo agentsight record -- claude',
                  'agentsight report audit --json',
                  'agentsight monitor',
                  'sudo agentsight debug ssl --binary-path <resolved-binary> --verbose',
                ]}
              />
            </section>

            <section>
              <h2>Observation is not enforcement, and absence is the hardest claim</h2>
              <p>
                AgentSight is an observability and profiling system. Seeing a process, path, endpoint, or plaintext call is useful positive evidence. It does not by itself prove that the operation was authorized, and the absence of a row does not prove that no operation occurred outside the selected process family, sampling interval, probe coverage, runtime hook, or parser path.
              </p>
              <p>
                Keep the AgentSight version, task boundary, command, platform, privilege mode, relevant binary/runtime identity, and capture limitations with any audit result. If the requirement is prevention rather than observation, pair the evidence with an enforcement mechanism at the control point that must block the action.
              </p>
            </section>

            <section>
              <h2>Primary sources</h2>
              <ul>
                <li><a href={productReadme}>AgentSight v1.0.31 README: product model, commands, platform and privilege boundaries</a></li>
                <li><a href={monitorSource}>AgentSight v1.0.31 background monitor implementation: interval, scan limit, sampled target semantics</a></li>
                <li><a href={agentGuide}>AgentSight v1.0.31 supported-agent and runtime capture notes</a></li>
                <li><a href={bpfReadme}>AgentSight v1.0.31 eBPF tool reference</a></li>
                <li><a href={sslsniffSource}>AgentSight v1.0.31 TLS plaintext capture implementation</a></li>
                <li><a href={kernelUprobes}>Linux kernel uprobe tracer documentation</a></li>
              </ul>
            </section>
          </article>

          <aside className="detail-aside">
            <div className="sticky-card">
              <p className="card-label">Research scope</p>
              <p><strong>AgentSight:</strong> v1.0.31</p>
              <p><strong>Product commit:</strong> <code>bb99b66f</code></p>
              <p><strong>Verified:</strong> 20 September 2026</p>
              <hr />
              <ArrowLink href="/blog/system-boundary-observability/">System-boundary map</ArrowLink>
              <ArrowLink href="/blog/when-agentsight-works-without-ebpf/">When AgentSight works without eBPF</ArrowLink>
              <ArrowLink href="/blog/why-ai-agent-tls-traffic-is-hard-to-trace/">TLS tracing boundaries</ArrowLink>
              <ArrowLink href="/security/">Security and local data handling</ArrowLink>
              <hr />
              <a className="button button-accent" href={site.demo}>Open app</a>
              <a className="button button-outline" href={site.repository}>View source</a>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
