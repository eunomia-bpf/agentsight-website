import { hubConfig } from './site';

export type ContentKind = keyof typeof hubConfig | 'landing';

export type Source = {
  label: string;
  href: string;
};

export type ContentPage = {
  kind: ContentKind;
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  lede: string;
  outcomes: string[];
  sections: Array<{ title: string; body: string }>;
  command?: string[];
  sources?: Source[];
  related: Array<{ label: string; href: string }>;
};

const agentsightReadme = 'https://github.com/eunomia-bpf/agentsight#readme';
const agentsightAgents = 'https://github.com/eunomia-bpf/agentsight/blob/master/docs/agents.md';
const agentpprof = 'https://github.com/eunomia-bpf/agentsight/blob/master/docs/agentpprof.md';
const otelExport = 'https://github.com/eunomia-bpf/agentsight/blob/master/docs/otel.md';

export const contentPages: ContentPage[] = [
  {
    kind: 'use-case',
    slug: 'profile-slow-expensive-agent-runs',
    title: 'Profile slow or expensive AI agent runs',
    description:
      'Find where an AI agent run spent time and tokens by connecting model calls to commands, files, waits, and process activity.',
    eyebrow: 'Performance use case',
    lede:
      'A long wall-clock time or a large token bill does not tell you which decisions, retries, scans, or subprocesses caused it. AgentSight builds a run profile from the model and system layers together.',
    outcomes: [
      'Separate model, shell, and wait-heavy phases.',
      'Locate repeated commands, file scans, and failed retries.',
      'Export evidence that another engineer can inspect.',
    ],
    sections: [
      {
        title: 'Start from the expensive phase, not the dashboard',
        body: 'Record the real command, then inspect the process family and saved session. The goal is a short list of causal paths that explain the delay, not another collection of unrelated counters.',
      },
      {
        title: 'Use the profile to choose the next experiment',
        body: 'A model-heavy loop suggests prompt or tool-policy work. Repeated repository scans suggest a retrieval or context problem. Long child-process phases point to the build, test, or network path that should be measured next.',
      },
    ],
    command: ['sudo agentsight record -- claude', 'agentsight report export -o snapshot.json'],
    sources: [{ label: 'AgentSight README and CLI examples', href: agentsightReadme }],
    related: [
      { label: 'Getting started', href: '/guides/getting-started/' },
      { label: 'Agent Flamegraph guide', href: '/guides/agent-flamegraph/' },
    ],
  },
  {
    kind: 'use-case',
    slug: 'review-ai-generated-prs',
    title: 'Review AI-generated pull requests with run evidence',
    description:
      'Review an AI-generated change with the commands, tests, retries, file effects, and network activity that produced it.',
    eyebrow: 'Code review use case',
    lede:
      'A source diff shows the final tree. It does not show which tests failed first, which files were read outside the repository, or which remote services influenced the result.',
    outcomes: [
      'Pair the diff with the generating run.',
      'See commands, exits, retries, and touched paths.',
      'Focus human review on unexplained effects and missing validation.',
    ],
    sections: [
      {
        title: 'Treat the trace as review evidence',
        body: 'Use the run profile to reconstruct how the agent reached the patch. Keep the source diff authoritative for code review and use AgentSight to expose the execution context the diff cannot contain.',
      },
      {
        title: 'Ask bounded questions',
        body: 'Did the agent run the relevant test? Did it retry after a failure? Did it read or write outside the stated scope? Did a network response or generated artifact affect the final patch? Each answer should point to recorded evidence.',
      },
    ],
    command: ['sudo agentsight record -- codex', 'agentsight report audit --json'],
    sources: [{ label: 'AgentSight reports and audit commands', href: agentsightReadme }],
    related: [
      { label: 'From trace to review artifact', href: '/blog/from-agent-trace-to-review-artifact/' },
      { label: 'AI agent file-access monitoring', href: '/ai-agent-file-access-monitoring/' },
    ],
  },
  {
    kind: 'use-case',
    slug: 'trace-closed-source-agent-clis',
    title: 'Trace closed-source AI agent CLIs',
    description:
      'Observe local AI agent commands and child processes without requiring an SDK, source change, proxy, or vendor-specific callback.',
    eyebrow: 'Compatibility use case',
    lede:
      'When an agent CLI is closed source or changes its internal framework, application instrumentation may be unavailable or incomplete. AgentSight attaches at stable operating-system boundaries instead.',
    outcomes: [
      'Keep using the original CLI and workflow.',
      'Attribute subprocess, file, and network effects to the run.',
      'Compare agents through a shared evidence model.',
    ],
    sections: [
      {
        title: 'Observe the process family',
        body: 'Recording begins from the command you select and follows the execution paths needed to explain what the agent did. This is especially useful when the application exposes no tracing SDK or only summarizes tool activity.',
      },
      {
        title: 'Expect runtime-specific limits',
        body: 'TLS libraries, containers, and runtime packaging affect what can be captured. Use the current AgentSight agent guide for binary discovery and supported command forms instead of assuming every CLI has the same attachment path.',
      },
    ],
    command: ['sudo agentsight record -- claude', 'sudo agentsight record -- gemini'],
    sources: [{ label: 'Recording supported agent CLIs', href: agentsightAgents }],
    related: [
      { label: 'Claude Code integration', href: '/integrations/claude-code/' },
      { label: 'Gemini CLI integration', href: '/integrations/gemini-cli/' },
    ],
  },
  {
    kind: 'use-case',
    slug: 'audit-mcp-servers-skills-plugins',
    title: 'Audit MCP servers, skills, and agent plugins',
    description:
      'Run an agent extension under system-level tracing to inspect its subprocesses, file changes, remote calls, and resource cost.',
    eyebrow: 'Extension audit use case',
    lede:
      'An extension manifest describes intended capability. A traced run shows the effects that actually occurred when an agent selected and executed the extension.',
    outcomes: [
      'Inventory child processes and external destinations.',
      'Separate declared access from observed access.',
      'Retain a review artifact for a specific version and task.',
    ],
    sections: [
      {
        title: 'Use a representative task',
        body: 'Choose a bounded prompt that exercises the extension without granting unrelated authority. Record the agent and extension process family, then compare observed effects with the manifest and the task you authorized.',
      },
      {
        title: 'Review evidence, not just alerts',
        body: 'A network connection or file write is not automatically malicious. Attribute each effect to a task step, verify whether it was necessary, and flag unexplained or over-broad behavior for a second run or code review.',
      },
    ],
    command: ['sudo agentsight record -- <agent-command>', 'agentsight report audit --json'],
    sources: [{ label: 'AgentSight record and audit workflow', href: agentsightReadme }],
    related: [
      { label: 'MCP server audit', href: '/mcp-server-audit/' },
      { label: 'Security and data handling', href: '/security/' },
    ],
  },
  {
    kind: 'comparison',
    slug: 'application-tracing',
    title: 'AgentSight and application-level tracing',
    description:
      'Compare system-boundary AgentSight profiles with application traces that instrument agent code, frameworks, and business logic.',
    eyebrow: 'Boundary comparison',
    lede:
      'Application instrumentation gives rich semantic detail when you own the code. AgentSight records the processes and effects that still matter when code is closed, hooks are incomplete, or child tools escape the application trace.',
    outcomes: [
      'Use application traces for internal spans and domain context.',
      'Use AgentSight for process, file, network, and resource effects.',
      'Correlate both when one boundary cannot explain the run.',
    ],
    sections: [
      {
        title: 'The tools answer different questions',
        body: 'Application spans explain instrumented control flow. A system profile explains what executed and what the process family touched. Neither boundary automatically reconstructs the other.',
      },
      {
        title: 'Combine them around a shared run',
        body: 'Keep framework spans when they already exist. Add AgentSight when review requires evidence about commands, files, network destinations, resource use, or closed-source components that application callbacks do not cover.',
      },
    ],
    sources: [
      { label: 'OpenTelemetry instrumentation concepts', href: 'https://opentelemetry.io/docs/concepts/instrumentation/' },
      { label: 'AgentSight system-level recording', href: agentsightReadme },
    ],
    related: [
      { label: 'OpenTelemetry comparison', href: '/compare/opentelemetry/' },
      { label: 'System-boundary observability', href: '/blog/system-boundary-observability/' },
    ],
  },
  {
    kind: 'comparison',
    slug: 'opentelemetry',
    title: 'AgentSight and OpenTelemetry',
    description:
      'Understand how AgentSight system profiles relate to OpenTelemetry instrumentation, traces, semantic conventions, and backends.',
    eyebrow: 'Standards comparison',
    lede:
      'OpenTelemetry is a vendor-neutral toolkit for generating, collecting, and exporting telemetry. AgentSight is a profiler for agent intent and system effects that can also export captured LLM calls as OTel GenAI spans.',
    outcomes: [
      'Keep OTel as the shared telemetry pipeline.',
      'Use AgentSight to collect agent-specific system evidence.',
      'Export compatible spans where correlation helps.',
    ],
    sections: [
      {
        title: 'OpenTelemetry is broader infrastructure',
        body: 'OTel defines APIs, SDKs, collectors, signals, and semantic conventions. It is not itself an observability backend. AgentSight is a concrete profiling product with a narrower agent-run workflow.',
      },
      {
        title: 'AgentSight can feed an existing OTel environment',
        body: 'Use AgentSight where eBPF and local session parsing add evidence that normal instrumentation misses, then export supported LLM activity into the OTel pipeline rather than replacing it.',
      },
    ],
    sources: [
      { label: 'What is OpenTelemetry?', href: 'https://opentelemetry.io/docs/what-is-opentelemetry/' },
      { label: 'OpenTelemetry traces', href: 'https://opentelemetry.io/docs/concepts/signals/traces/' },
      { label: 'AgentSight OTel export', href: otelExport },
    ],
    related: [
      { label: 'Application tracing comparison', href: '/compare/application-tracing/' },
      { label: 'Getting started', href: '/guides/getting-started/' },
    ],
  },
  {
    kind: 'comparison',
    slug: 'ai-gateways',
    title: 'AgentSight and AI gateway observability',
    description:
      'Compare an AI gateway view of routed model traffic with AgentSight evidence from the local agent process and its system effects.',
    eyebrow: 'Traffic-path comparison',
    lede:
      'A gateway can observe and control requests that pass through it. AgentSight begins at the agent process, including commands, local files, child processes, and network destinations beyond the model provider.',
    outcomes: [
      'Use gateways for routed model analytics and controls.',
      'Use AgentSight for local execution and side effects.',
      'Correlate both when the run crosses both boundaries.',
    ],
    sections: [
      {
        title: 'A gateway sees its traffic path',
        body: 'Gateway logs can include provider requests, tokens, cost, duration, status, and configured controls. They do not automatically describe an agent subprocess or a file rewrite that never traversed the gateway.',
      },
      {
        title: 'System evidence fills a different gap',
        body: 'AgentSight is useful when a team needs to connect model activity to the shell, repository, local runtime, and remote services contacted by tools. Keep the gateway for routing policy and centralized model operations.',
      },
    ],
    sources: [
      { label: 'Cloudflare AI Gateway overview', href: 'https://developers.cloudflare.com/ai-gateway/' },
      { label: 'Cloudflare AI Gateway logging', href: 'https://developers.cloudflare.com/ai-gateway/observability/logging/' },
      { label: 'AgentSight README', href: agentsightReadme },
    ],
    related: [
      { label: 'Network-aware agent monitoring', href: '/ebpf-ai-agent-monitoring/' },
      { label: 'Closed-source CLI tracing', href: '/use-cases/trace-closed-source-agent-clis/' },
    ],
  },
  {
    kind: 'comparison',
    slug: 'langfuse',
    title: 'AgentSight and Langfuse',
    description:
      'Compare Langfuse LLM application tracing and evaluation workflows with AgentSight system-level profiles of local agent runs.',
    eyebrow: 'LLM observability comparison',
    lede:
      'Langfuse centers LLM application traces, observations, scores, and related platform workflows. AgentSight centers the local process boundary and can work when the agent CLI does not expose an integration.',
    outcomes: [
      'Use Langfuse for instrumented LLM application telemetry.',
      'Use AgentSight for closed-source and system-effect evidence.',
      'Combine the two when both application and host context matter.',
    ],
    sections: [
      {
        title: 'Instrumented observations and system effects are complementary',
        body: 'A Langfuse trace can organize LLM observations and application context. An AgentSight profile adds commands, processes, file access, network activity, and local resource behavior around the run.',
      },
      {
        title: 'Choose by the boundary you control',
        body: 'If you own the LLM application and need evaluation or prompt workflows, use application instrumentation. If you need to inspect an existing CLI or verify low-level effects, add AgentSight at the operating-system boundary.',
      },
    ],
    sources: [
      { label: 'Langfuse observability documentation', href: 'https://langfuse.com/docs/observability/overview' },
      { label: 'AgentSight README', href: agentsightReadme },
    ],
    related: [
      { label: 'Application tracing comparison', href: '/compare/application-tracing/' },
      { label: 'AI gateway comparison', href: '/compare/ai-gateways/' },
    ],
  },
  {
    kind: 'comparison',
    slug: 'langsmith',
    title: 'AgentSight and LangSmith',
    description:
      'Compare LangSmith traces, runs, threads, and evaluations with AgentSight profiles of agent processes and operating-system effects.',
    eyebrow: 'Agent observability comparison',
    lede:
      'LangSmith records instrumented application operations as traces and runs. AgentSight observes the local agent and child-process boundary, including components that do not emit LangSmith telemetry.',
    outcomes: [
      'Use LangSmith for application traces and evaluation workflows.',
      'Use AgentSight to inspect execution outside application spans.',
      'Correlate both for a fuller run narrative.',
    ],
    sections: [
      {
        title: 'Runs are not operating-system processes',
        body: 'A LangSmith run is an instrumented unit of application work. A process, command, file effect, or network connection is a different kind of evidence. AgentSight focuses on those system-level relationships.',
      },
      {
        title: 'Keep semantic and execution views connected',
        body: 'Use LangSmith where its integrations capture the agent graph and application context. Add AgentSight when investigation requires the actual shell commands, process tree, local files, or closed-source CLI behavior.',
      },
    ],
    sources: [
      { label: 'LangSmith observability concepts', href: 'https://docs.langchain.com/langsmith/observability-concepts' },
      { label: 'AgentSight README', href: agentsightReadme },
    ],
    related: [
      { label: 'Application tracing comparison', href: '/compare/application-tracing/' },
      { label: 'Review AI-generated PRs', href: '/use-cases/review-ai-generated-prs/' },
    ],
  },
  {
    kind: 'guide',
    slug: 'getting-started',
    title: 'Getting started with AgentSight',
    description:
      'Install AgentSight, record a local agent command, and export a first run artifact for inspection or sharing.',
    eyebrow: 'Quick start guide',
    lede:
      'Begin with one representative local run. Keep the raw database private, export only what you intend to review, and use the current AgentSight README when command behavior changes.',
    outcomes: [
      'Install the released CLI.',
      'Record one selected command.',
      'Open or export the resulting profile.',
    ],
    sections: [
      {
        title: 'Record the smallest useful run',
        body: 'Choose a task with a clear start and end. Run AgentSight around the agent command instead of enabling broad background capture, then confirm the session database and report can be read.',
      },
      {
        title: 'Handle the result as sensitive data',
        body: 'A captured session can include prompts, responses, paths, headers, and network targets. Review and redact before attaching an export to an issue or pull request.',
      },
    ],
    command: [
      'cargo install agentsight',
      'sudo agentsight record -- claude',
      'agentsight report export -o snapshot.json',
    ],
    sources: [{ label: 'AgentSight Quick Start', href: agentsightReadme }],
    related: [
      { label: 'Security and data handling', href: '/security/' },
      { label: 'Profile a slow run', href: '/use-cases/profile-slow-expensive-agent-runs/' },
    ],
  },
  {
    kind: 'guide',
    slug: 'claude-code-profiling',
    title: 'Profile Claude Code with AgentSight',
    description:
      'Record a Claude Code session and inspect the model, process, file, network, and resource paths that shaped the run.',
    eyebrow: 'Agent guide',
    lede:
      'AgentSight can record Claude Code from the process boundary. Current packaging and TLS behavior matter, so follow the maintained agent guide for binary discovery and attachment details.',
    outcomes: [
      'Record a bounded Claude Code command.',
      'Inspect child commands and system effects.',
      'Export only the evidence needed for review.',
    ],
    sections: [
      {
        title: 'Use record for the normal path',
        body: 'The record command discovers the selected executable and creates a session around the run. Use explicit binary options only when the current agent guide calls for them.',
      },
      {
        title: 'Connect effects back to intent',
        body: 'Review the prompt and tool phases alongside commands, repository writes, external path access, and network destinations. The useful result is a causal explanation, not a raw event dump.',
      },
    ],
    command: ['sudo agentsight record -- claude', 'agentsight report'],
    sources: [{ label: 'Claude Code recording guide', href: agentsightAgents }],
    related: [
      { label: 'Claude Code integration', href: '/integrations/claude-code/' },
      { label: 'Claude Code observability', href: '/claude-code-observability/' },
    ],
  },
  {
    kind: 'guide',
    slug: 'agent-flamegraph',
    title: 'Build an Agent Flamegraph',
    description:
      'Aggregate agent sessions into semantic flamegraphs for tokens, time, operations, files, and network activity.',
    eyebrow: 'Analysis guide',
    lede:
      'Agent Flamegraphs group free-form agent activity into stable semantic stacks. Width represents the selected weight, while the stack connects project, agent, intent, tool, process, and effect context.',
    outcomes: [
      'Choose a tokens, time, operations, files, or network view.',
      'Keep intent tagging reproducible.',
      'Compare related paths without exposing raw prompt text.',
    ],
    sections: [
      {
        title: 'Select the question before the view',
        body: 'Use tokens to investigate budget, time to find latency, operations to count behavior, files to inspect repository effects, and network to attribute destinations. Each view projects the same session evidence differently.',
      },
      {
        title: 'Treat semantic labels as analysis inputs',
        body: 'Stable intent labels make sessions comparable and reduce accidental prompt disclosure. Retain the tagging rules or cache used to build a published flamegraph so another reviewer can reproduce it.',
      },
    ],
    command: ['cargo install agentpprof', 'agentpprof --view tokens -o tokens.svg'],
    sources: [{ label: 'AgentSight agentpprof guide', href: agentpprof }],
    related: [
      { label: 'Profile slow runs', href: '/use-cases/profile-slow-expensive-agent-runs/' },
      { label: 'System-boundary observability', href: '/blog/system-boundary-observability/' },
    ],
  },
  {
    kind: 'blog',
    slug: 'system-boundary-observability',
    title: 'Why AI agent observability needs a system boundary',
    description:
      'Application logs explain declared agent steps; system evidence shows the commands, files, processes, and network effects that actually ran.',
    eyebrow: 'Engineering note',
    lede:
      'Agent behavior crosses model APIs, orchestration code, shells, package managers, repositories, containers, and remote services. A single application callback rarely owns that whole path.',
    outcomes: [
      'Separate intent from observed effect.',
      'Identify gaps left by one instrumentation boundary.',
      'Choose complementary telemetry instead of one universal tool.',
    ],
    sections: [
      {
        title: 'The semantic gap is the investigation target',
        body: 'A tool-call record says what the agent requested. Process and file evidence says what executed. Connecting the two lets a reviewer distinguish a declared action from the low-level effects it produced.',
      },
      {
        title: 'System evidence does not replace application context',
        body: 'Framework spans, gateway logs, and evaluation platforms remain useful. AgentSight adds another boundary for closed components and host effects, and can export supported model activity into standard telemetry paths.',
      },
    ],
    sources: [
      { label: 'AgentSight README', href: agentsightReadme },
      { label: 'OpenTelemetry instrumentation', href: 'https://opentelemetry.io/docs/concepts/instrumentation/' },
    ],
    related: [
      { label: 'Application tracing comparison', href: '/compare/application-tracing/' },
      { label: 'eBPF AI agent monitoring', href: '/ebpf-ai-agent-monitoring/' },
    ],
  },
  {
    kind: 'blog',
    slug: 'from-agent-trace-to-review-artifact',
    title: 'From an agent trace to a review artifact',
    description:
      'Turn a large agent event stream into a bounded artifact that explains decisions, validation, side effects, and open questions.',
    eyebrow: 'Workflow note',
    lede:
      'Raw traces are evidence stores, not review documents. A useful artifact selects the paths relevant to a decision and preserves links back to the underlying run.',
    outcomes: [
      'Define the review question before summarizing.',
      'Keep claims traceable to commands and effects.',
      'Redact sensitive session material before sharing.',
    ],
    sections: [
      {
        title: 'Reduce by decision relevance',
        body: 'For a pull request, keep commands, test outcomes, retries, and file scope. For an extension audit, keep child processes, external paths, remote destinations, and unexplained privileges. Do not summarize every event equally.',
      },
      {
        title: 'Preserve uncertainty and provenance',
        body: 'Mark effects whose purpose is inferred, distinguish missing capture from confirmed absence, and retain enough session identifiers or timestamps for a trusted reviewer to return to the original evidence.',
      },
    ],
    sources: [{ label: 'AgentSight reporting commands', href: agentsightReadme }],
    related: [
      { label: 'Review AI-generated PRs', href: '/use-cases/review-ai-generated-prs/' },
      { label: 'Security and data handling', href: '/security/' },
    ],
  },
  {
    kind: 'integration',
    slug: 'claude-code',
    title: 'AgentSight for Claude Code',
    description:
      'Record Claude Code from the system boundary and connect model activity to commands, files, processes, network calls, and resources.',
    eyebrow: 'Claude Code integration',
    lede:
      'Use Claude Code normally while AgentSight records the selected process family. No Claude-specific SDK or model proxy is required for the core system profile.',
    outcomes: ['Keep the native Claude Code workflow.', 'Inspect process and file effects.', 'Create a local review artifact.'],
    sections: [
      { title: 'Start with the maintained record command', body: 'Agent runtimes and packaging change. Use the current AgentSight agent guide for the supported discovery and binary-path behavior rather than copying an old attachment recipe.' },
      { title: 'Review local data carefully', body: 'Claude sessions and AgentSight databases may contain prompts, responses, repository paths, headers, and network targets. Keep raw data local unless you intentionally export it.' },
    ],
    command: ['sudo agentsight record -- claude'],
    sources: [{ label: 'Claude Code recording guide', href: agentsightAgents }],
    related: [{ label: 'Claude Code profiling guide', href: '/guides/claude-code-profiling/' }, { label: 'Claude Code observability', href: '/claude-code-observability/' }],
  },
  {
    kind: 'integration',
    slug: 'codex',
    title: 'AgentSight for Codex CLI',
    description:
      'Profile a Codex CLI run and connect its prompts and tool decisions to commands, files, processes, network calls, and validation.',
    eyebrow: 'Codex integration',
    lede:
      'Record the Codex command you already use, then inspect the local run as a process family and a saved agent session without adding an SDK to the repository.',
    outcomes: ['Record a bounded Codex task.', 'Inspect commands, retries, and touched paths.', 'Export evidence for code review.'],
    sections: [
      { title: 'Profile the task, not the whole workstation', body: 'Begin recording at the selected Codex command and stop with the task. This keeps the evidence easier to attribute and reduces unrelated local activity.' },
      { title: 'Pair the profile with the final diff', body: 'The diff remains the code-review surface. The AgentSight profile adds how the patch was produced, which tests actually ran, and which side effects deserve follow-up.' },
    ],
    command: ['sudo agentsight record -- codex', 'agentsight report audit --json'],
    sources: [{ label: 'AgentSight supported agents', href: agentsightReadme }],
    related: [{ label: 'Review AI-generated PRs', href: '/use-cases/review-ai-generated-prs/' }, { label: 'Codex observability', href: '/codex-observability/' }],
  },
  {
    kind: 'integration',
    slug: 'gemini-cli',
    title: 'AgentSight for Gemini CLI',
    description:
      'Record Gemini CLI and its Node.js process family to inspect model traffic, commands, file effects, network activity, and resources.',
    eyebrow: 'Gemini CLI integration',
    lede:
      'Gemini CLI runs on Node.js. AgentSight supports recording the command and documents runtime-specific binary discovery for Node-based tools.',
    outcomes: ['Use the normal Gemini CLI entrypoint.', 'Follow child processes and system effects.', 'Inspect a saved local run.'],
    sections: [
      { title: 'Use automatic discovery first', body: 'The maintained record path discovers the selected command and relevant runtime binary. Reach for explicit Node binary options only when the current guide says the automatic path is insufficient.' },
      { title: 'Separate provider traffic from tool traffic', body: 'A model call is only one part of an agent run. Review local commands and other remote destinations alongside captured model activity to understand the whole task.' },
    ],
    command: ['sudo agentsight record -- gemini'],
    sources: [{ label: 'Node.js and Gemini CLI recording', href: agentsightAgents }],
    related: [{ label: 'Closed-source CLI tracing', href: '/use-cases/trace-closed-source-agent-clis/' }, { label: 'AI gateway comparison', href: '/compare/ai-gateways/' }],
  },
  {
    kind: 'integration',
    slug: 'opencode-openclaw',
    title: 'AgentSight for OpenCode and OpenClaw',
    description:
      'Trace OpenCode as a local command or attach to an OpenClaw Node.js process in a container with current AgentSight runtime guidance.',
    eyebrow: 'Open agent integration',
    lede:
      'AgentSight can record a local command such as OpenCode and can target Node.js processes in containers for OpenClaw-style deployments. The exact command depends on the runtime boundary.',
    outcomes: ['Profile a local OpenCode run.', 'Target an OpenClaw container process.', 'Compare effects through one evidence model.'],
    sections: [
      { title: 'Choose the real execution boundary', body: 'Use the normal command wrapper for a local CLI. For a containerized Node.js agent, use the documented container binary path so the profiler attaches where the process actually runs.' },
      { title: 'Verify current support before automating', body: 'Container names, runtimes, and deployment topology vary. Test one bounded run and confirm capture before turning the command into a repeated audit workflow.' },
    ],
    command: ['sudo agentsight record -- opencode', 'sudo agentsight record -c node --binary-path docker://openclaw'],
    sources: [{ label: 'OpenCode and OpenClaw recording examples', href: agentsightAgents }],
    related: [{ label: 'Closed-source CLI tracing', href: '/use-cases/trace-closed-source-agent-clis/' }, { label: 'Audit MCP servers and plugins', href: '/use-cases/audit-mcp-servers-skills-plugins/' }],
  },
  {
    kind: 'landing',
    slug: 'claude-code-observability',
    title: 'Claude Code observability from the system boundary',
    description:
      'Connect a Claude Code run to its commands, files, processes, network activity, model calls, and resource use without an SDK.',
    eyebrow: 'Claude Code observability',
    lede:
      'Claude Code logs can describe conversation state. AgentSight adds a process-centered view of what executed on the machine during the selected run.',
    outcomes: ['See child commands and exit status.', 'Attribute file and network effects.', 'Keep capture local by default.'],
    sections: [
      { title: 'Observe what the agent caused', body: 'Record the Claude command, then connect prompt and tool phases to the process tree, repository activity, network destinations, and resource samples available in the run.' },
      { title: 'Use evidence for debugging and review', body: 'A bounded profile helps explain a slow session, a failing tool loop, an unexpected path access, or the execution history behind an AI-generated patch.' },
    ],
    command: ['sudo agentsight record -- claude'],
    sources: [{ label: 'Claude Code recording guide', href: agentsightAgents }],
    related: [{ label: 'Claude Code integration', href: '/integrations/claude-code/' }, { label: 'Claude Code profiling guide', href: '/guides/claude-code-profiling/' }],
  },
  {
    kind: 'landing',
    slug: 'codex-observability',
    title: 'Codex CLI observability for real coding runs',
    description:
      'Profile Codex CLI commands, tests, file effects, model activity, network destinations, and resources around a bounded task.',
    eyebrow: 'Codex observability',
    lede:
      'A final patch is easier to trust when reviewers can also see the commands, failures, retries, file scope, and external activity that produced it.',
    outcomes: ['Attach recording to the selected Codex task.', 'Inspect validation and retries.', 'Export evidence for review.'],
    sections: [
      { title: 'Add execution context to the diff', body: 'Record the generating run, then compare its test and file evidence with the final source change. This exposes missing validation and unexplained side effects without changing Codex itself.' },
      { title: 'Keep claims bounded by capture', body: 'A trace can show observed activity in the recorded scope. It cannot prove that unrecorded activity never occurred, and it does not replace source review.' },
    ],
    command: ['sudo agentsight record -- codex', 'agentsight report audit --json'],
    sources: [{ label: 'AgentSight README', href: agentsightReadme }],
    related: [{ label: 'Codex integration', href: '/integrations/codex/' }, { label: 'Review AI-generated PRs', href: '/use-cases/review-ai-generated-prs/' }],
  },
  {
    kind: 'landing',
    slug: 'mcp-server-audit',
    title: 'Audit MCP server effects during an agent run',
    description:
      'Inspect the subprocesses, files, network destinations, and resource use observed while an agent invokes an MCP server.',
    eyebrow: 'MCP server audit',
    lede:
      'An MCP schema tells an agent how to call a tool. A system-level run profile helps a reviewer inspect what the server and its child processes did for one representative task.',
    outcomes: ['Trace the agent and server process family.', 'Compare declared and observed access.', 'Retain an evidence artifact for review.'],
    sections: [
      { title: 'Design a bounded audit task', body: 'Select one task that exercises the server capability without unrelated permissions. Record the invoking agent and inspect the resulting child processes, path access, and remote destinations.' },
      { title: 'Interpret effects in context', body: 'A connection or file write may be required for the task. Flag effects that exceed the manifest, requested operation, or expected runtime path, then reproduce them before drawing a security conclusion.' },
    ],
    command: ['sudo agentsight record -- <agent-command>', 'agentsight report audit --json'],
    sources: [{ label: 'AgentSight audit workflow', href: agentsightReadme }],
    related: [{ label: 'Audit extensions use case', href: '/use-cases/audit-mcp-servers-skills-plugins/' }, { label: 'Security and data handling', href: '/security/' }],
  },
  {
    kind: 'landing',
    slug: 'ebpf-ai-agent-monitoring',
    title: 'eBPF monitoring for AI agent processes',
    description:
      'Use AgentSight to connect AI agent intent and model activity with process, file, network, and resource evidence collected via eBPF.',
    eyebrow: 'eBPF agent monitoring',
    lede:
      'eBPF provides a stable system observation boundary for local and containerized processes. AgentSight turns that low-level evidence into agent-run profiles and analysis artifacts.',
    outcomes: ['Observe without adding an application SDK.', 'Follow process-family effects.', 'Connect low-level activity to agent context.'],
    sections: [
      { title: 'Use eBPF where application hooks stop', body: 'System probes can observe execution across closed-source CLIs, child commands, and runtime boundaries. AgentSight combines those signals with agent session and model context instead of exposing only kernel events.' },
      { title: 'Keep the profiler boundary explicit', body: 'Capture depends on operating system, privilege, binary packaging, and selected probes. Verify the supported platform and current AgentSight guide before promising coverage.' },
    ],
    sources: [{ label: 'AgentSight architecture and support', href: agentsightReadme }],
    related: [{ label: 'Closed-source CLI tracing', href: '/use-cases/trace-closed-source-agent-clis/' }, { label: 'System-boundary observability', href: '/blog/system-boundary-observability/' }],
  },
  {
    kind: 'landing',
    slug: 'ai-agent-file-access-monitoring',
    title: 'Monitor AI agent file access and repository effects',
    description:
      'Inspect file reads, writes, deletes, external paths, and the commands that caused them during a recorded AI agent run.',
    eyebrow: 'File-access monitoring',
    lede:
      'A tool-call transcript may summarize a file edit. AgentSight adds observed path and process evidence so reviewers can compare actual file scope with the task they authorized.',
    outcomes: ['Inventory observed file effects.', 'Attribute paths to commands and agent phases.', 'Flag repo-external access for review.'],
    sections: [
      { title: 'Review scope, direction, and cause', body: 'Separate reads from writes and deletes, group project paths from external paths, and trace each important effect back to the process and agent phase that caused it.' },
      { title: 'Avoid turning path access into an automatic verdict', body: 'Build tools and agents legitimately use caches, temporary directories, and home configuration. Review whether each path was necessary and authorized, then reproduce suspicious behavior in a bounded run.' },
    ],
    command: ['sudo agentsight record -- codex', 'agentpprof --view files -o files.svg'],
    sources: [{ label: 'AgentSight file-view documentation', href: agentpprof }],
    related: [{ label: 'Review AI-generated PRs', href: '/use-cases/review-ai-generated-prs/' }, { label: 'Agent Flamegraph guide', href: '/guides/agent-flamegraph/' }],
  },
];

export function getPages(kind: ContentKind) {
  return contentPages.filter((page) => page.kind === kind);
}

export function getPage(kind: ContentKind, slug: string) {
  return contentPages.find((page) => page.kind === kind && page.slug === slug);
}

export function contentPath(page: ContentPage) {
  if (page.kind === 'landing') return `/${page.slug}/`;
  return `${hubConfig[page.kind].path}${page.slug}/`;
}
