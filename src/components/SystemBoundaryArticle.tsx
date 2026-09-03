import Link from 'next/link';
import { ArrowLink, Eyebrow, JsonLd } from './PageParts';
import { SiteShell } from './SiteShell';
import { site } from '@/lib/site';

const agentSightCommit = '934f441eff8ca210807333633f47b2efcb8cd020';
const agentSightSource = `https://github.com/eunomia-bpf/agentsight/blob/${agentSightCommit}`;
const articlePath = '/blog/system-boundary-observability/';

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export function SystemBoundaryArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Why AI agent observability needs a system boundary',
    description:
      'A primary-source boundary map for native agent telemetry, tool protocols, system execution, provider traffic, and AgentSight v1.0.30 OpenTelemetry export limits.',
    url: `${site.url}${articlePath}`,
    datePublished: '2026-08-07',
    dateModified: '2026-09-03',
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
            <span aria-current="page">System-boundary observability</span>
          </nav>
          <Eyebrow>Boundary reference · refreshed 3 September 2026 · AgentSight v1.0.30</Eyebrow>
          <h1>Why AI agent observability needs a system boundary</h1>
          <p className="hero-lede">
            Modern coding agents already expose useful native telemetry. The remaining observability gap is not “agents
            have no traces.” It appears when an investigation crosses from agent intent and tool records into child
            processes, files, sockets, resources, or provider traffic that the parent application did not independently
            observe. The practical design is to keep each source for the questions it can actually answer, then correlate
            boundaries only when one source cannot close the causal chain.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer</h2>
              <p>
                Native agent telemetry is usually the best first source for model calls, token use, tool selection,
                permission decisions, prompts, skills, subagents, and other application semantics. Independent system
                observation is strongest for what actually executed after that decision: process descendants, file and
                network effects, CPU or memory use, and runtime behavior outside the instrumented agent.
              </p>
              <p>
                OpenTelemetry can give both sources a common transport and vocabulary, but a semantic convention does
                not manufacture an observation that was never collected. A <code>gen_ai.tool.call.result</code> field can
                describe what instrumentation knows about a tool result; it is not proof that every descendant process,
                path, or connection produced by that tool was represented. That provenance distinction is the reason a
                system boundary remains useful even as native agent telemetry improves.
              </p>
            </section>

            <section>
              <h2>Four evidence layers are more useful than “application versus eBPF”</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '850px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Layer</th>
                      <th style={header}>What it can answer well</th>
                      <th style={header}>What it does not prove by itself</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}><strong>Intent and session</strong></td>
                      <td style={cell}>Prompt/model context, skills, subagents, approval policy, tool selection, application retries.</td>
                      <td style={cell}>The complete low-level behavior of every process or runtime launched afterward.</td>
                    </tr>
                    <tr>
                      <td style={cell}><strong>Tool protocol</strong></td>
                      <td style={cell}>Command or MCP invocation, arguments, declared tool identity, returned result.</td>
                      <td style={cell}>That the result enumerates every child process, file effect, or remote destination.</td>
                    </tr>
                    <tr>
                      <td style={cell}><strong>System execution</strong></td>
                      <td style={cell}>Processes, descendants, paths, sockets, CPU, memory, I/O, and other host-visible effects.</td>
                      <td style={cell}>Why the agent selected the action or what semantic policy caused it.</td>
                    </tr>
                    <tr>
                      <td style={cell}><strong>Provider traffic</strong></td>
                      <td style={cell}>Actual model request/response timing and wire-visible provider fields when the traffic can be reconstructed.</td>
                      <td style={cell}>All local tool behavior before or after the provider call.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>Native coding-agent telemetry now covers a lot of the first two layers</h2>
              <p>
                The upstream review behind this page remains pinned to exact sources rather than a generic feature
                checklist. Claude Code documents OpenTelemetry metrics, events, and optional traces for sessions, API
                requests, tool results, permission decisions, MCP activity, hooks, skills, cost, and token use. Gemini
                CLI documents logs, metrics, and traces for prompts, API traffic, tools, selected file operations, agent
                runs, and its own CPU and memory behavior. The open-source Codex telemetry implementation exposes
                session-scoped business events, API timing, metrics, trace-context propagation, and GenAI-oriented span
                fields.
              </p>
              <p>
                These are strong semantic sources. They are also application-defined sources. For example, a parent
                agent may record that it launched <code>npm test</code> and received a result. The command can then start
                Node.js, a test runner, browser workers, compilers, or helper processes whose internal file reads and
                network activity are not automatically equivalent to the parent tool event. The right question is not
                whether the native event exists; it is whether that event contains the evidence needed for the current
                investigation.
              </p>
              <p>
                Upstream agent facts in this article retain their 7 August 2026 research pins: Gemini CLI commit
                <code>cf22ac7e86f3dcf528e3ae591fec1c03090a49f8</code> and Codex commit
                <code>3aae5d885bac39c1262491aa3fd100dfd8b3919f</code>. The AgentSight-specific sections were revalidated
                on 3 September against release <code>v1.0.30</code>, commit <code>{agentSightCommit.slice(0, 8)}</code>.
              </p>
            </section>

            <section>
              <h2>What AgentSight v1.0.30 exports to OpenTelemetry—and what stays outside those spans</h2>
              <p>
                AgentSight can reconstruct captured LLM request/response pairs and export them as OpenTelemetry GenAI
                spans over OTLP/HTTP. The current product documentation is precise about the boundary: each pair becomes
                a <code>chat {'{model}'}</code> CLIENT span; request and response timestamps define the wire latency;
                provider, model, conversation, usage, finish reason, HTTP status, and server address are mapped when
                available. Prompt and completion content are excluded by default and require
                <code>--otel-capture-content</code>.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '860px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Evidence</th>
                      <th style={header}>v1.0.30 OTel export</th>
                      <th style={header}>Boundary / limitation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>LLM request/response pair</td>
                      <td style={cell}>One GenAI CLIENT span with request/response timing.</td>
                      <td style={cell}>Requires a captured pair; streamed bodies that cannot be reparsed still have reduced response detail.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Conversation grouping</td>
                      <td style={cell}>Real conversation ID when present, then session ID, then current recording as fallback grouping.</td>
                      <td style={cell}>Root/child span relationships are not inferred yet.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Prompt / completion content</td>
                      <td style={cell}>Opt-in only with <code>--otel-capture-content</code>.</td>
                      <td style={cell}>Metadata-only is the default because content may be sensitive.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Tool/workflow provenance</td>
                      <td style={cell}>Not emitted as standard <code>execute_tool</code>, <code>invoke_agent</code>, <code>invoke_workflow</code>, or <code>plan</code> spans today.</td>
                      <td style={cell}>Richer AgentSight-specific provenance remains in AgentSight rows and views.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Process/file/network/resource relationships</td>
                      <td style={cell}>Not a lossless projection of the full AgentSight evidence graph.</td>
                      <td style={cell}>Use AgentSight-native evidence when the investigation depends on those system relationships.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                This is a useful architecture rather than a missing-feature embarrassment. OTLP lets the model-call
                portion join an existing telemetry pipeline without pretending that a standards export preserves every
                source-specific relationship. The exact observation boundary remains inspectable instead of being hidden
                behind one blended “trace.”
              </p>
            </section>

            <section>
              <h2>A concrete example: a slow test command</h2>
              <p>
                Suppose the agent emits a native tool event for <code>npm test</code> and that event says the command took
                90 seconds. That is enough to attribute wall-clock time to the tool decision. It is not enough to answer
                why the command took 90 seconds if the delay lives in a browser worker, compiler, network fetch, cache
                miss, or a child process that the parent tool result summarizes only as final output.
              </p>
              <p>
                A useful investigation starts with the native event, because it names the tool and preserves agent
                context. Add a system profile only if the duration remains unexplained. Then correlate the tool interval
                with the process family, CPU/RSS, file and network activity. If the model call itself is the suspect,
                provider-traffic or native API telemetry is the better next boundary. The sequence avoids collecting
                every possible signal when one source already answers the question.
              </p>
            </section>

            <section>
              <h2>Choose the first source from the question</h2>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '780px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Question</th>
                      <th style={header}>Best first source</th>
                      <th style={header}>Add another source when…</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}>Which model call used the tokens and time?</td>
                      <td style={cell}>Native agent / provider telemetry.</td>
                      <td style={cell}>You need to connect model time to local execution before or after it.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Why did the agent choose this tool?</td>
                      <td style={cell}>Native session, policy, skill, and tool-decision records.</td>
                      <td style={cell}>You need to verify the effects after the decision.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Why was a build/test command slow?</td>
                      <td style={cell}>Native tool timing.</td>
                      <td style={cell}>The child-process or resource breakdown is missing.</td>
                    </tr>
                    <tr>
                      <td style={cell}>Which paths or destinations did an extension actually touch?</td>
                      <td style={cell}>System execution evidence plus the native MCP/plugin record.</td>
                      <td style={cell}>Either source lacks the semantic or low-level half of the causal chain.</td>
                    </tr>
                    <tr>
                      <td style={cell}>How do we feed captured model calls into an existing backend?</td>
                      <td style={cell}>AgentSight OTel export or native agent OTel.</td>
                      <td style={cell}>The backend also needs AgentSight-specific system provenance that is not projected into GenAI spans.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>Privacy follows the same boundary rule</h2>
              <p>
                More telemetry is not automatically better telemetry. Native agent events can contain prompts, tool
                arguments, results, paths, and identifiers. AgentSight local evidence can contain prompts, responses,
                paths, headers, and network targets. The v1.0.30 OTel exporter therefore keeps message content off by
                default. Decide which layer answers the question, export the minimum useful fields, and keep richer raw
                evidence local when shared analysis does not require it.
              </p>
              <p>
                Provenance helps here too: knowing whether a field came from the agent, the tool protocol, the host, or
                reconstructed provider traffic makes it easier to set different retention and sharing policies instead
                of treating every record as one homogeneous trace payload.
              </p>
            </section>

            <section>
              <h2>The durable conclusion</h2>
              <p>
                Coding-agent observability is a multi-source problem. Native telemetry is increasingly rich and should
                be the default for questions about intent, model behavior, policy, and tool semantics. System observation
                becomes useful when execution leaves that instrumented boundary. Provider traffic answers another class
                of questions. OpenTelemetry gives these systems a shared vocabulary and transport, but it does not erase
                where an observation came from.
              </p>
              <p>
                A good observability design therefore starts with one sentence: “What fact am I trying to prove?” Pick
                the source that can directly observe that fact, and correlate another boundary only when the first source
                cannot close the causal chain. AgentSight is useful in that design when the missing evidence lives at the
                machine boundary—or when captured model traffic needs to join an existing OTel pipeline without
                pretending that the export is a lossless copy of the full system profile.
              </p>
            </section>

            <section className="source-section">
              <h2>Primary sources and reproducibility</h2>
              <ul>
                <li><a href="https://code.claude.com/docs/en/monitoring-usage">Claude Code monitoring and OpenTelemetry reference</a> — native metrics/events/traces, tool records, subprocess behavior, and content controls.</li>
                <li><a href="https://github.com/google-gemini/gemini-cli/blob/cf22ac7e86f3dcf528e3ae591fec1c03090a49f8/docs/cli/telemetry.md">Gemini CLI telemetry at commit cf22ac7</a> — file/tool/API events, resource metrics, and GenAI traces.</li>
                <li><a href="https://github.com/openai/codex/blob/3aae5d885bac39c1262491aa3fd100dfd8b3919f/codex-rs/otel/README.md">Codex OpenTelemetry crate at commit 3aae5d8</a> — exporter, session-event, metric, and trace-context architecture.</li>
                <li><a href="https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/">OpenTelemetry GenAI semantic attributes</a> — standard model, conversation, tool-call, and content fields.</li>
                <li><a href="https://opentelemetry.io/docs/specs/semconv/cli/cli-spans/">OpenTelemetry CLI span conventions</a> — execution and exit-code semantics for instrumented CLI programs.</li>
                <li><a href={`${agentSightSource}/docs/otel.md`}>AgentSight v1.0.30 OpenTelemetry export</a> — exact GenAI mapping, grouping, content opt-in, wire timing, and tool/workflow-span limits.</li>
                <li><a href={`${agentSightSource}/README.md`}>AgentSight v1.0.30 README</a> — current system-observation and local-session product scope.</li>
                <li><a href={`${agentSightSource}/ext/analysis/src/sinks/otel.rs`}>AgentSight v1.0.30 OTel sink source</a> — OTLP/HTTP exporter implementation behind the documented mapping.</li>
                <li><a href="https://modelcontextprotocol.io/specification/2025-06-18/server/tools">Model Context Protocol tool specification</a> — protocol-level tool invocation and result semantics.</li>
                <li><a href="https://arxiv.org/abs/2508.02736">AgentSight paper</a> — system-level design and evaluation background.</li>
              </ul>
            </section>
          </article>

          <aside className="detail-aside">
            <p className="card-label">Continue exploring</p>
            <ArrowLink href="/compare/opentelemetry/">AgentSight and OpenTelemetry</ArrowLink>
            <ArrowLink href="/blog/when-agentsight-works-without-ebpf/">When AgentSight works without eBPF</ArrowLink>
            <ArrowLink href="/mcp-server-audit/">MCP server audit</ArrowLink>
            <hr />
            <a className="button button-accent" href={site.demo}>Open the recorded demo</a>
            <a className="button button-outline" href={site.repository}>View AgentSight on GitHub</a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
