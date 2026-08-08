import Link from 'next/link';
import { ArrowLink, CommandBlock, Eyebrow, JsonLd, OutcomeList } from './PageParts';
import { SiteShell } from './SiteShell';
import {
  contentPath,
  getPages,
  publicPage,
  type ContentKind,
  type ContentPage,
} from '@/lib/public-content';
import { hubConfig, site } from '@/lib/site';

export function ContentCard({ page }: { page: ContentPage }) {
  const displayPage = publicPage(page);
  return (
    <article className="content-card">
      <p className="card-label">{displayPage.eyebrow}</p>
      <h2>
        <Link href={contentPath(displayPage)}>{displayPage.title}</Link>
      </h2>
      <p>{displayPage.description}</p>
      <ArrowLink href={contentPath(displayPage)}>Read the page</ArrowLink>
    </article>
  );
}

export function HubPage({ kind }: { kind: Exclude<ContentKind, 'landing'> }) {
  const config = hubConfig[kind];
  const pages = getPages(kind);
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.title,
    description: config.description,
    url: `${site.url}${config.path}`,
    hasPart: pages.map((page) => ({
      '@type': 'WebPage',
      name: page.title,
      url: `${site.url}${contentPath(page)}`,
    })),
  };

  return (
    <SiteShell>
      <JsonLd value={collection} />
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>{config.eyebrow}</Eyebrow>
          <h1>{config.title}</h1>
          <p className="hero-lede">{config.description}</p>
        </div>
      </section>
      <section className="section">
        <div className="shell card-grid">
          {pages.map((page) => (
            <ContentCard key={page.slug} page={page} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

function SystemBoundaryResearchArticle() {
  const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
  const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

  return (
    <>
      <section>
        <h2>The short version: native agent telemetry is better than the old argument assumes</h2>
        <p>
          The useful question in 2026 is no longer whether coding agents expose telemetry. Claude Code now exports
          OpenTelemetry metrics, events, and optional traces for sessions, API requests, tool results, permission
          decisions, MCP activity, hooks, skills, cost, and token use. Gemini CLI exports logs, metrics, and traces for
          prompts, API traffic, tools, selected file operations, agent runs, and its own CPU and memory behavior. The
          current open-source Codex tree contains a dedicated OpenTelemetry crate with session-scoped business events,
          API timing, metrics, trace-context propagation, and GenAI span fields.
        </p>
        <p>
          That changes the boundary debate. Native telemetry can describe a great deal of what an agent believes it is
          doing. The remaining blind spot begins when execution crosses into another process, runtime, script, package
          manager, MCP server, container, or network client whose low-level behavior is not represented by the parent
          agent&apos;s own events. A system profiler is valuable at that boundary, not because native telemetry is poor,
          but because the two sources answer different questions.
        </p>
        <p>
          This review was refreshed on 7 August 2026 against the current Claude Code monitoring reference, Gemini CLI
          commit <code>cf22ac7e86f3dcf528e3ae591fec1c03090a49f8</code>, Codex commit{' '}
          <code>3aae5d885bac39c1262491aa3fd100dfd8b3919f</code>, and AgentSight <code>v1.0.3</code>.
        </p>
      </section>

      <section>
        <h2>A boundary map for coding-agent observability</h2>
        <p>
          The table below separates six questions that are often collapsed into the word “observability.” “Native”
          means telemetry emitted by the agent itself. “System” means activity observed outside the application at the
          process, file, network, resource, or TLS boundary. The entries deliberately describe the documented scope;
          they do not imply that one source is universally better.
        </p>
        <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
            <thead>
              <tr>
                <th style={header}>Question</th>
                <th style={header}>Native agent telemetry</th>
                <th style={header}>Independent system observation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cell}>Which model request ran, how long did it take, and how many tokens did it use?</td>
                <td style={cell}>Strong. Claude, Gemini, and Codex all expose model/API-oriented telemetry.</td>
                <td style={cell}>Possible from captured traffic, but native fields usually provide richer model semantics.</td>
              </tr>
              <tr>
                <td style={cell}>Which tool did the agent choose, and was it accepted or rejected?</td>
                <td style={cell}>Strong when the agent emits tool and permission events.</td>
                <td style={cell}>A process tracer sees execution, not the internal policy decision that selected it.</td>
              </tr>
              <tr>
                <td style={cell}>What command or MCP call did the agent request?</td>
                <td style={cell}>Often strong; detailed fields may require explicit logging options.</td>
                <td style={cell}>Can identify spawned programs and connections, but may lack the tool&apos;s semantic name.</td>
              </tr>
              <tr>
                <td style={cell}>What did the resulting child process actually spawn, open, write, or connect to?</td>
                <td style={cell}>Only what the agent or child instrumentation reports.</td>
                <td style={cell}>This is the system boundary&apos;s strongest domain: process family, file, network, and resource activity.</td>
              </tr>
              <tr>
                <td style={cell}>Did a tool result faithfully summarize every low-level effect?</td>
                <td style={cell}>A tool result is an application-level record returned by the tool implementation.</td>
                <td style={cell}>Independent observation can compare the reported result with activity that occurred on the machine.</td>
              </tr>
              <tr>
                <td style={cell}>Why did the agent choose this action?</td>
                <td style={cell}>Native session, prompt, skill, subagent, and policy context is usually the best source.</td>
                <td style={cell}>System events alone cannot reconstruct intent reliably.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Claude Code gives us the cleanest proof of where the boundary sits</h2>
        <p>
          Anthropic&apos;s current monitoring reference is unusually detailed. Claude Code can emit a
          <code>claude_code.tool_result</code> event after a tool runs, including the tool name, success state,
          duration, error category, input and result sizes, and—when detailed tool logging is enabled—parameters such
          as the Bash command or MCP server/tool name. It separately records tool decisions, API requests, retries,
          skills, hooks, MCP activity, commits, pull requests, token use, and cost. That is enough for many fleet,
          cost, adoption, policy, and application-debugging questions.
        </p>
        <p>
          The same reference also documents a subtle implementation choice that matters for system investigations:
          Claude Code does not pass its <code>OTEL_*</code> environment variables to Bash subprocesses, hooks, MCP
          servers, or language servers. If a program launched through Bash should export its own telemetry, the
          exporter settings must be supplied to that program separately. This is a concrete example of an
          instrumentation boundary: the parent can record that it launched a command and received a result without
          automatically turning every child and grandchild operation into the same distributed trace.
        </p>
        <p>
          Consider <code>npm test</code>. Claude Code can record the Bash invocation and its result. The command can then
          start Node.js, a test runner, a browser, a compiler, and helper processes; those processes may read thousands
          of files, touch caches, or contact services. Some of that may be summarized by the tool result, but the parent
          event is not a syscall-by-syscall or connection-by-connection account of the process family. That distinction
          is the durable reason to correlate native agent events with process-level observation.
        </p>
      </section>

      <section>
        <h2>Gemini CLI shows how far application telemetry can extend into files and resources</h2>
        <p>
          Gemini CLI&apos;s telemetry is an important counterexample to simplistic claims about application tracing. Its
          documentation lists <code>gemini_cli.file_operation</code> events for file creation, reads, and updates
          performed by tools, tool-call counters with accept/reject/modify decisions, API request/response events,
          token metrics, agent-run metrics, and CLI memory/RSS and CPU metrics. With detailed tracing enabled it also
          emits GenAI-oriented spans for operations such as <code>tool_call</code>, <code>llm_call</code>,
          <code>agent_call</code>, and <code>schedule_tool_calls</code>.
        </p>
        <p>
          The exact wording matters: the file events are operations “performed by tools.” This is excellent semantic
          data because the CLI knows which tool owns the operation. It is still a different statement from “every file
          opened by every descendant process.” A shell tool can invoke a compiler or package manager whose internal
          reads happen below the tool implementation. The native event tells you what Gemini intended and instrumented;
          the system layer tells you which process touched which path when execution escaped that instrumented path.
        </p>
        <p>
          This also suggests a practical rule for debugging: start with the native trace because it has better semantic
          labels. Add a system profile when the question mentions an unexplained child process, an unexpected path,
          a non-model network destination, or resource use that cannot be attributed from the agent&apos;s own metrics.
        </p>
      </section>

      <section>
        <h2>Codex exposes another useful source: the implementation itself</h2>
        <p>
          Codex is open source, so its current telemetry surface can be inspected directly rather than inferred from a
          dashboard. The <code>codex-otel</code> crate wires log, trace, and metric exporters, provides
          <code>SessionTelemetry</code> for session-scoped business events, and exposes W3C trace-context helpers. The
          current session telemetry records conversation configuration, API request duration and status, WebSocket and
          SSE activity, token fields, startup phases, and other business events, while the metrics layer includes API
          and tool-call counters and duration instruments.
        </p>
        <p>
          Reading the source is useful for a second reason: telemetry evolves faster than many comparison pages. A
          static feature checklist ages quickly. For durable analysis, record the exact upstream commit you reviewed and
          describe the boundary rather than promising that a named event will exist forever. This article pins the Codex
          review to commit <code>3aae5d885bac39c1262491aa3fd100dfd8b3919f</code> for that reason.
        </p>
      </section>

      <section>
        <h2>OpenTelemetry standardizes meaning; it does not create observations by itself</h2>
        <p>
          OpenTelemetry&apos;s GenAI conventions define portable names for model, conversation, input/output messages,
          token use, tool names, tool-call arguments, and tool-call results. The CLI conventions similarly define how
          an instrumented command-line program can represent its execution and exit code. These conventions are highly
          valuable because Claude, Gemini, Codex, AgentSight, and downstream backends can converge on compatible field
          meanings.
        </p>
        <p>
          A semantic convention does not imply that a process was instrumented or that a field came from an independent
          operating-system source. For example, <code>gen_ai.tool.call.result</code> is the result available to the
          instrumentation. It is not defined as a proof that the result enumerates every process, file, or network
          effect produced while the tool ran. This is the most important conceptual distinction in the whole stack:
          standardizing a record and independently observing an effect solve different problems.
        </p>
      </section>

      <section>
        <h2>MCP makes the same distinction visible at the protocol layer</h2>
        <p>
          The Model Context Protocol defines tools that a model can discover and invoke. A server returns a tool result,
          and applications are responsible for validation, access control, confirmation, logging, and timeouts. The
          protocol deliberately leaves the server implementation free to perform the work however it chooses.
        </p>
        <p>
          That means an MCP transcript can answer “which tool was called with which arguments and what result came
          back?” while a host-level trace can answer “which executable handled it, which children appeared, which paths
          were opened, and which destinations were contacted?” For an audit, both are useful. Treating either record as
          a complete substitute for the other throws away information.
        </p>
      </section>

      <section>
        <h2>A four-layer model is more useful than “application versus eBPF”</h2>
        <p>
          A practical observability model for coding agents has four layers. First is <strong>intent and session</strong>:
          prompts, models, skills, subagents, approval policy, and tool selection. Second is <strong>tool protocol</strong>:
          the command or MCP invocation and the result returned to the agent. Third is <strong>system execution</strong>:
          processes, descendants, file operations, sockets, CPU, memory, and I/O. Fourth is <strong>provider traffic</strong>:
          the actual model request and response at the API or TLS boundary. Different products cover different subsets,
          and modern agent CLIs increasingly cover the first two very well.
        </p>
        <p>
          AgentSight is most useful when one investigation crosses those layers. Its <code>v1.0.3</code> release combines
          native/local agent session material with eBPF process and file monitoring, network activity, resource views,
          and TLS-based model traffic reconstruction. It can export captured model calls as OpenTelemetry GenAI spans.
          The export has an explicit limitation today: AgentSight does not yet emit standard tool/workflow spans for all
          of its internal provenance, so the richer system relationships remain in AgentSight&apos;s own rows and views.
          That limitation is important because it prevents the OTel export from being described as a lossless copy of the
          full AgentSight session.
        </p>
      </section>

      <section>
        <h2>When should you use native telemetry, a system profiler, or both?</h2>
        <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '720px', fontSize: '0.92rem' }}>
            <thead>
              <tr>
                <th style={header}>Investigation</th>
                <th style={header}>Best first source</th>
                <th style={header}>Add another boundary when…</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cell}>Token spend, model latency, tool acceptance, agent adoption</td>
                <td style={cell}>Native agent OTel</td>
                <td style={cell}>You need to attribute cost or latency to a child process or external system effect.</td>
              </tr>
              <tr>
                <td style={cell}>Why a build/test command took so long</td>
                <td style={cell}>Native tool timing + system process/resource profile</td>
                <td style={cell}>The tool&apos;s duration is large but its child-process breakdown is unknown.</td>
              </tr>
              <tr>
                <td style={cell}>Which files a coding task actually touched</td>
                <td style={cell}>Native file/tool events where available</td>
                <td style={cell}>A shell command, compiler, plugin, or MCP server may touch paths outside the agent&apos;s file tool.</td>
              </tr>
              <tr>
                <td style={cell}>MCP or plugin audit</td>
                <td style={cell}>Native MCP/tool record + system process/network record</td>
                <td style={cell}>The returned tool result does not explain its child processes or destinations.</td>
              </tr>
              <tr>
                <td style={cell}>Cross-agent comparison</td>
                <td style={cell}>OpenTelemetry-compatible semantic fields</td>
                <td style={cell}>Agent-specific event schemas make system behavior difficult to compare directly.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Privacy is also a boundary decision</h2>
        <p>
          Richer telemetry can expose sensitive content. Claude Code keeps prompt content out of its OTel events by
          default and requires an explicit option to include it. Gemini CLI documents separate controls for prompt
          logging and detailed traces, with full prompt and tool output attributes disabled by default for detailed
          tracing. OpenTelemetry&apos;s GenAI specification itself warns that input messages, system instructions, tool
          arguments, and tool results may contain sensitive information. AgentSight likewise exports model content only
          when <code>--otel-capture-content</code> is enabled, while its local session databases can contain prompts,
          responses, paths, headers, and network targets.
        </p>
        <p>
          The safest architecture is therefore not “collect everything.” Decide which layer answers the question, keep
          raw capture local when possible, export the minimum fields needed for shared analysis, and preserve the
          configuration that determines whether content was recorded. Observability quality and data minimization can be
          designed together.
        </p>
      </section>

      <section>
        <h2>The durable conclusion</h2>
        <p>
          Coding-agent observability is becoming a multi-source problem. Native telemetry is now rich enough to be the
          first place to look for model, tool, policy, and session questions. A system profiler becomes valuable when the
          investigation crosses the application boundary into descendants, files, network destinations, resource use,
          or closed components. OpenTelemetry provides the common vocabulary that lets the two sources meet; it does not
          erase the difference in how those observations were produced.
        </p>
        <p>
          That framing is more useful than claiming one universal tracing layer. It also gives a concrete test for every
          observability feature: state the question, identify the boundary that can actually observe the answer, and
          correlate another boundary only when the first one cannot close the causal chain.
        </p>
      </section>

      <section className="source-section">
        <h2>Primary sources and reproducibility</h2>
        <ul>
          <li><a href="https://code.claude.com/docs/en/monitoring-usage">Claude Code monitoring and OpenTelemetry reference</a> — metrics, events, traces, tool results, subprocess telemetry behavior, and privacy controls.</li>
          <li><a href="https://github.com/google-gemini/gemini-cli/blob/cf22ac7e86f3dcf528e3ae591fec1c03090a49f8/docs/cli/telemetry.md">Gemini CLI telemetry at commit cf22ac7</a> — file/tool/API events, resource metrics, and GenAI traces.</li>
          <li><a href="https://github.com/openai/codex/blob/3aae5d885bac39c1262491aa3fd100dfd8b3919f/codex-rs/otel/README.md">Codex OpenTelemetry crate at commit 3aae5d8</a> — exporter, session-event, metric, and trace-context architecture.</li>
          <li><a href="https://github.com/openai/codex/blob/3aae5d885bac39c1262491aa3fd100dfd8b3919f/codex-rs/otel/src/events/session_telemetry.rs">Codex SessionTelemetry implementation at commit 3aae5d8</a> — concrete API, token, timing, and session events.</li>
          <li><a href="https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/">OpenTelemetry GenAI semantic attributes</a> — model, conversation, tool-call, content, and privacy semantics.</li>
          <li><a href="https://opentelemetry.io/docs/specs/semconv/cli/cli-spans/">OpenTelemetry CLI span conventions</a> — execution and exit-code semantics for instrumented command-line programs.</li>
          <li><a href="https://modelcontextprotocol.io/specification/2025-06-18/server/tools">Model Context Protocol tool specification</a> — tool invocation, results, application responsibilities, and security guidance.</li>
          <li><a href="https://github.com/eunomia-bpf/agentsight/blob/v1.0.3/README.md">AgentSight v1.0.3 README</a> — process, file, network, resource, local-session, and supported-agent scope.</li>
          <li><a href="https://github.com/eunomia-bpf/agentsight/blob/v1.0.3/docs/otel.md">AgentSight v1.0.3 OpenTelemetry export</a> — wire-derived GenAI spans, content controls, and current tool/workflow-span limitation.</li>
          <li><a href="https://arxiv.org/abs/2508.02736">AgentSight paper</a> — system-level design and evaluation background.</li>
        </ul>
      </section>
    </>
  );
}

export function ContentDetail({ page }: { page: ContentPage }) {
  const path = contentPath(page);
  const hub = page.kind === 'landing' ? undefined : hubConfig[page.kind];
  const isSystemBoundaryArticle = page.kind === 'blog' && page.slug === 'system-boundary-observability';
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'AgentSight', item: site.url },
    ...(hub
      ? [{ '@type': 'ListItem', position: 2, name: hub.eyebrow, item: `${site.url}${hub.path}` }]
      : []),
    { '@type': 'ListItem', position: hub ? 3 : 2, name: page.title, item: `${site.url}${path}` },
  ];
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: page.title,
      description: page.description,
      url: `${site.url}${path}`,
      author: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
      publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
    },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbItems },
  ];

  return (
    <SiteShell>
      <JsonLd value={jsonLd} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {hub ? <Link href={hub.path}>{hub.eyebrow}</Link> : null}
            <span aria-current="page">{page.title}</span>
          </nav>
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <h1>{page.title}</h1>
          <p className="hero-lede">{page.lede}</p>
          <OutcomeList items={page.outcomes} />
        </div>
      </section>
      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            {isSystemBoundaryArticle ? (
              <SystemBoundaryResearchArticle />
            ) : (
              page.sections.map((section) => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </section>
              ))
            )}
            {page.command ? <CommandBlock commands={page.command} /> : null}
            {!isSystemBoundaryArticle && page.sources?.length ? (
              <section className="source-section">
                <h2>Primary sources</h2>
                <ul>
                  {page.sources.map((source) => (
                    <li key={source.href}>
                      <a href={source.href}>{source.label}</a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>
          <aside className="detail-aside">
            <p className="card-label">Continue exploring</p>
            {page.related.map((item) => (
              <ArrowLink key={item.href} href={item.href}>
                {item.label}
              </ArrowLink>
            ))}
            <hr />
            <a className="button button-accent" href={site.demo}>
              Open the recorded demo
            </a>
            <a className="button button-outline" href={site.repository}>
              View AgentSight on GitHub
            </a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
