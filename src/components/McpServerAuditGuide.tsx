import Link from 'next/link';
import { ArrowLink, CommandBlock, Eyebrow, JsonLd, OutcomeList } from './PageParts';
import { SiteShell } from './SiteShell';
import { contentPath, type ContentPage } from '@/lib/public-content';
import { site } from '@/lib/site';

const productCommit = '0080545f7c6b110ec2d4a4af5100b58f514c84d5';
const sourceBase = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const fixtureReadme = `${sourceBase}/docs/experiment/mcp-test/README.md`;
const fixtureClient = `${sourceBase}/docs/experiment/mcp-test/test_mcp_cli.py`;
const fixtureServer = `${sourceBase}/docs/experiment/mcp-test/test_mcp_server.py`;
const stdiocapSource = `${sourceBase}/bpf/stdiocap.bpf.c`;
const stdiocapHeader = `${sourceBase}/bpf/stdiocap.h`;
const agentGuide = `${sourceBase}/docs/agents.md`;
const mcpDesign = `${sourceBase}/docs/design/mcp/DESIGN.md`;
const currentMcpSpec = 'https://modelcontextprotocol.io/specification/2026-07-28';
const currentMcpTransports = 'https://modelcontextprotocol.io/specification/2026-07-28/basic/transports';
const currentMcpTools = 'https://modelcontextprotocol.io/specification/2026-07-28/server/tools';
const currentMcpRelease = 'https://blog.modelcontextprotocol.io/posts/2026-07-28/';

const cell = { border: '1px solid #d8dee8', padding: '0.72rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export function McpServerAuditGuide({ page }: { page: ContentPage }) {
  const path = contentPath(page);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: page.title,
      description: page.description,
      url: `${site.url}${path}`,
      dateModified: '2026-08-19',
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
          <Eyebrow>Audit guide · AgentSight v1.0.25 · MCP 2026-07-28 · 19 August 2026</Eyebrow>
          <h1>{page.title}</h1>
          <p className="hero-lede">
            An MCP transcript tells you which protocol method and tool result crossed the client/server boundary. A system audit asks a second question: which process handled the call, which descendants ran, which files were touched, and which destinations were contacted. Treat those as two records to correlate, and pin the MCP protocol revision because the protocol changed substantially in July 2026.
          </p>
          <OutcomeList
            items={[
              'Establish a known-good stdio or HTTP baseline before interpreting an empty or surprising production trace.',
              'Record the exact MCP revision, transport, server build, client, task, and AgentSight version with every audit.',
              'Separate protocol facts from observed host effects and from reviewer inference.',
            ]}
          />
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short version: an MCP result is not a system-effect ledger</h2>
              <p>
                MCP is the semantic boundary. It can tell the host that a <code>tools/call</code> request named a particular tool, supplied particular arguments, and returned a particular result. The operating system sees a different layer: the server executable, its standard streams or sockets, child processes, file operations, and network activity. Neither record automatically reconstructs the other.
              </p>
              <p>
                That is the useful audit model for AgentSight. Start with the protocol record because it has better semantic labels. Add independent process, file, network, and stdio/TLS observation when the question crosses into what the implementation actually did. A mismatch is a reason to investigate, not an automatic vulnerability verdict.
              </p>
            </section>

            <section>
              <h2>Freeze the protocol revision before you compare anything</h2>
              <p>
                The current MCP specification is <code>2026-07-28</code>. It moved the core protocol to stateless, self-contained requests and removed the connection-scoped <code>initialize</code>/<code>initialized</code> handshake and protocol-level session used by earlier revisions. Request metadata now travels with each request, while Streamable HTTP mirrors selected fields into headers for routing and inspection.
              </p>
              <p>
                This matters for audits because a trace from a legacy client and a trace from a current client can have different message sequences even when they call the same logical tool. Record the MCP revision, transport, client implementation/version, server build or commit, working directory, relevant authorization mode, and the exact test task before comparing observed effects.
              </p>
            </section>

            <section>
              <h2>The shipped AgentSight fixture is a capture baseline, not current MCP conformance</h2>
              <p>
                AgentSight v1.0.25 still ships a deliberately small Python fixture under <code>docs/experiment/mcp-test/</code>. It uses only the standard library and exposes three predictable tools: <code>echo</code>, <code>sum_numbers</code>, and <code>read_fixture</code>. The client exercises both stdio and HTTP modes and the file-read tool returns a fixed marker string from <code>fixture_note.txt</code>.
              </p>
              <p>
                The fixture client explicitly advertises protocol version <code>2025-03-26</code> and performs the legacy <code>initialize</code> then <code>notifications/initialized</code> exchange. The current <code>2026-07-28</code> specification removed that handshake. Use this fixture to prove that your capture path can see known traffic and effects; do not use it to claim that a server is conformant with the latest MCP revision.
              </p>
              <CommandBlock
                commands={[
                  'python3 docs/experiment/mcp-test/test_mcp_cli.py --transport stdio',
                  'python3 docs/experiment/mcp-test/test_mcp_server.py --transport http --host 127.0.0.1 --port 8765',
                  'python3 docs/experiment/mcp-test/test_mcp_cli.py --transport http --url http://127.0.0.1:8765/messages',
                ]}
              />
              <p>
                These commands use the actual v1.0.25 repository path. Older fixture prose still contains a shorter <code>docs/mcp-test/</code> path, but the files in the pinned release live under <code>docs/experiment/mcp-test/</code>.
              </p>
            </section>

            <section>
              <h2>Know exactly what the deterministic fixture should do</h2>
              <div style={{ overflowX: 'auto', margin: '1.25rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Fixture step</th>
                      <th style={header}>Protocol-level observation</th>
                      <th style={header}>Expected implementation effect</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}><code>tools/list</code></td>
                      <td style={cell}>Returns <code>echo</code>, <code>sum_numbers</code>, and <code>read_fixture</code>.</td>
                      <td style={cell}>No external service is required by the fixture implementation.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>echo</code></td>
                      <td style={cell}>Returns a stable <code>echo:&lt;transport&gt;-hello</code> text result.</td>
                      <td style={cell}>String handling occurs inside the Python server process.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>sum_numbers</code></td>
                      <td style={cell}>The client sends 1, 2, 3, and 4.5; the server returns <code>sum:10.5</code>.</td>
                      <td style={cell}>Numeric conversion and summation occur inside the server process.</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>read_fixture</code></td>
                      <td style={cell}>Returns the fixed AgentSight fixture payload as text.</td>
                      <td style={cell}>The server reads <code>fixture_note.txt</code> from its own fixture directory.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                This gives the audit a known positive control. If the protocol result is present but the expected file read is outside your configured observation scope, diagnose capture first. If a third-party server shows additional descendants or destinations, you then have a concrete difference to explain rather than a vague “MCP did something” alert.
              </p>
            </section>

            <section>
              <h2>stdio is plaintext, but the capture unit is a syscall, not an MCP message</h2>
              <p>
                In the current MCP stdio binding, the client launches the server as a subprocess, writes newline-delimited JSON-RPC messages to the server&apos;s stdin, and reads server messages from stdout. AgentSight&apos;s standalone <code>stdiocap</code> path observes Linux <code>read</code> and <code>write</code> syscalls and can scope capture to file descriptors 0, 1, and 2 and to a target process family.
              </p>
              <p>
                The v1.0.25 BPF program records PID, TID, UID, fd, direction, returned length, command name, and a bounded copy of the user buffer. The event buffer is capped at 8192 bytes. That means a stdio event is a syscall chunk, not proof that one event equals one complete JSON-RPC line. Large messages can be truncated, and application buffering can divide protocol messages across writes or reads. Reconstruct protocol semantics above the raw capture layer before making tool-level claims.
              </p>
              <CommandBlock commands={['sudo ./bpf/stdiocap -p <mcp-server-pid>']} />
            </section>

            <section>
              <h2>Streamable HTTP has a different observation surface in MCP 2026-07-28</h2>
              <p>
                Current Streamable HTTP uses a single MCP endpoint and a new POST for every request or notification. The July 2026 revision removed the old GET stream endpoint and protocol-level sessions. Modern requests carry <code>MCP-Protocol-Version</code> and mirror the JSON-RPC method into <code>Mcp-Method</code>; requests such as <code>tools/call</code> also carry <code>Mcp-Name</code>. The request body remains the source of truth.
              </p>
              <p>
                The AgentSight fixture&apos;s HTTP server is intentionally simpler and accepts <code>/messages</code> or <code>/mcp</code> with ordinary JSON bodies. It is useful as a local network baseline, but it does not implement all current Streamable HTTP requirements. When auditing a current remote server, preserve the protocol version and relevant routing headers alongside the JSON-RPC body, destination, TLS boundary, and process or service identity.
              </p>
            </section>

            <section>
              <h2>Compare three layers instead of flattening everything into one finding</h2>
              <div style={{ overflowX: 'auto', margin: '1.25rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Layer</th>
                      <th style={header}>Good examples</th>
                      <th style={header}>What it cannot prove alone</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>Protocol fact</td>
                      <td style={cell}>Tool name, arguments, protocol revision, returned result, error state.</td>
                      <td style={cell}>Every child process, file operation, or network effect produced by the implementation.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Observed system fact</td>
                      <td style={cell}>Server process, descendants, path activity, destinations, stdio or supported TLS traffic.</td>
                      <td style={cell}>Why the model selected the tool or whether an observed effect was authorized.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Reviewer inference</td>
                      <td style={cell}>“This destination was unnecessary” or “this helper explains the returned result.”</td>
                      <td style={cell}>Anything without a stated reasoning path and reproducible source facts.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Keeping these layers separate makes the audit easier to challenge. A reviewer can disagree with an inference without disputing that a process started or a tool returned a particular value.
              </p>
            </section>

            <section>
              <h2>Tool descriptions and annotations are claims, not independent verification</h2>
              <p>
                The current MCP tools specification treats tools as model-controlled capabilities and recommends clear user visibility and confirmation around invocation. It also says tool annotations should be considered untrusted unless they come from a trusted server. For an audit, record the advertised schema and description, but compare them with the bounded task and observed implementation behavior rather than treating metadata as an allowlist.
              </p>
              <p>
                The same rule applies in reverse: an observed cache file, helper process, or network connection is not automatically malicious because the tool description did not enumerate it. Classify expected project paths, runtime/configuration paths, temporary/cache activity, expected service endpoints, localhost, and unexplained external effects separately.
              </p>
            </section>

            <section>
              <h2>Repeat surprising effects with one variable changed at a time</h2>
              <p>
                Re-run the same call before escalating a one-off observation. If the same child process, path, or destination appears at the same tool phase, the attribution is stronger. Then change one input, permission, transport, or server configuration and repeat. This is especially useful on developer machines where language servers, package managers, background Git operations, and local services can otherwise contaminate a broad trace.
              </p>
              <p>
                Record positive observations more strongly than absences. “This process opened this path during the bounded run” is a direct observation. “The server never accessed any other path” requires confidence in process-family scope, probe coverage, buffering/truncation behavior, and the exact runtime path used by the server.
              </p>
            </section>

            <section>
              <h2>Plaintext MCP capture is sensitive by construction</h2>
              <p>
                stdio JSON-RPC can contain tool arguments, returned text, file contents, resource identifiers, credentials passed incorrectly as parameters, and application-specific data. HTTP/TLS capture can expose the same material once observed at a plaintext boundary. Keep raw captures local, redact before sharing, and preserve only the structure needed for the review question.
              </p>
              <p>
                The 8192-byte stdiocap event bound is also a correctness limit, not only a storage detail. A successful event proves that a syscall payload was observed; it does not guarantee a complete large MCP message. If the finding depends on exact content beyond the captured prefix, use the native protocol log or another bounded source to verify it.
              </p>
            </section>

            <section>
              <h2>Do not confuse the test fixture with an AgentSight MCP product server</h2>
              <p>
                The current AgentSight repository contains a separate MCP server design document, but that document explicitly marks the production MCP server as a design target. The runnable Python fixture is for testing MCP flows; it is not a shipped production AgentSight MCP service. This distinction matters when reviewing architecture diagrams or old implementation notes: audit what exists in the pinned release, not what a design document proposes.
              </p>
              <p>
                The same discipline applies to a third-party server. Pin the executable, container image, package version, or source commit you actually exercised. A server with the same tool name can change implementation behavior across releases even when the MCP-facing schema stays stable.
              </p>
            </section>

            <section>
              <h2>A publishable MCP audit should include the method and the uncertainty</h2>
              <p>
                Record the server and client versions, MCP revision, transport, task, authorization boundary, AgentSight version, capture commands, relevant process/file/network findings, and any truncation or unsupported-runtime limits. Include the protocol facts that justify each system-side comparison and list unresolved questions separately from confirmed observations.
              </p>
              <p>
                That produces a useful artifact even when nothing suspicious appears. The result is a scoped compatibility and behavior statement for one server build and one bounded capability, not a certificate that every tool and configuration of the server is safe.
              </p>
            </section>

            <section className="source-section">
              <h2>Primary sources</h2>
              <ul>
                <li><a href={currentMcpSpec}>MCP 2026-07-28 specification and security principles</a></li>
                <li><a href={currentMcpTransports}>MCP 2026-07-28 transport model</a></li>
                <li><a href={currentMcpTools}>MCP 2026-07-28 tools specification</a></li>
                <li><a href={currentMcpRelease}>MCP maintainers&apos; 2026-07-28 release notes</a></li>
                <li><a href={fixtureReadme}>AgentSight v1.0.25 MCP fixture README</a></li>
                <li><a href={fixtureClient}>AgentSight v1.0.25 fixture client source</a></li>
                <li><a href={fixtureServer}>AgentSight v1.0.25 fixture server source</a></li>
                <li><a href={stdiocapSource}>AgentSight v1.0.25 stdiocap BPF implementation</a></li>
                <li><a href={stdiocapHeader}>AgentSight v1.0.25 stdiocap event and buffer limits</a></li>
                <li><a href={agentGuide}>AgentSight v1.0.25 supported-agent and local MCP notes</a></li>
                <li><a href={mcpDesign}>AgentSight MCP design target and current-status note</a></li>
              </ul>
            </section>
          </article>

          <aside className="detail-aside">
            <p className="card-label">Continue exploring</p>
            <ArrowLink href="/use-cases/audit-mcp-servers-skills-plugins/">Audit extensions use case</ArrowLink>
            <ArrowLink href="/security/">Security and local data handling</ArrowLink>
            <ArrowLink href="/ebpf-ai-agent-monitoring/">eBPF agent monitoring</ArrowLink>
            <hr />
            <a className="button button-accent" href={site.demo}>Open app</a>
            <a className="button button-outline" href={site.repository}>View AgentSight on GitHub</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
