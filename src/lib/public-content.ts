import {
  contentPath,
  getPage as getSourcePage,
  getPages as getSourcePages,
  type ContentKind,
  type ContentPage,
} from './content';

export { contentPath };
export type { ContentKind, ContentPage };

const productCommit = '07a83a32257b8c8dcba911bd9db23f77e71dc085';
const productBase = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const agentsightReadme = `${productBase}/README.md`;
const agentsightAgents = `${productBase}/docs/agents.md`;
const agentpprof = `${productBase}/docs/agentpprof.md`;
const otelExport = `${productBase}/docs/otel.md`;
const mcpFixture = `${productBase}/docs/experiment/mcp-test/README.md`;
const openclawExperiment = `${productBase}/docs/experiment/openclaw.md`;
const sslsniffSource = `${productBase}/bpf/sslsniff.c`;
const codexOffsets = `${productBase}/bpf/codex_offsets.h`;
const claudeMonitoring = 'https://code.claude.com/docs/en/monitoring-usage';
const geminiTelemetry = 'https://geminicli.com/docs/cli/telemetry/';
const codexOtel = 'https://github.com/openai/codex/blob/646f7c0a91b8e327d263335da68ae8ef212895ce/codex-rs/otel/README.md';
const otelInstrumentation = 'https://opentelemetry.io/docs/concepts/instrumentation/';
const otelSemanticConventions = 'https://opentelemetry.io/docs/concepts/semantic-conventions/';
const cloudflareGateway = 'https://developers.cloudflare.com/ai-gateway/';
const cloudflareGatewayLogging = 'https://developers.cloudflare.com/ai-gateway/observability/logging/';
const cloudflareGatewayAnalytics = 'https://developers.cloudflare.com/ai-gateway/observability/analytics/';
const langfuseObservability = 'https://langfuse.com/docs/observability/overview';
const langfuseEvaluation = 'https://langfuse.com/docs/evaluation/overview';
const langfuseTracePractices = 'https://langfuse.com/docs/observability/best-practices';
const langsmithConcepts = 'https://docs.langchain.com/langsmith/observability-concepts';
const langsmithEvaluation = 'https://docs.langchain.com/langsmith/evaluation-concepts';
const mcpTools = 'https://modelcontextprotocol.io/specification/2025-11-25/server/tools';
const mcpSpec = 'https://modelcontextprotocol.io/specification/2025-11-25';
const kernelUprobes = 'https://docs.kernel.org/trace/uprobetracer.html';

const tlsTracingDeepDive: ContentPage = {
  kind: 'blog',
  slug: 'why-ai-agent-tls-traffic-is-hard-to-trace',
  title: 'Why AI agent TLS traffic is hard to trace',
  description:
    'A source-level guide to OpenSSL, BoringSSL, rustls, stripped binaries, uprobes, and the plaintext hook points behind modern AI agent CLI traffic.',
  eyebrow: 'Systems deep dive · August 2026',
  lede:
    'Tracing HTTPS in a coding agent is no longer as simple as attaching SSL_read and SSL_write to libssl.so. Node.js can carry OpenSSL inside the executable, Bun uses BoringSSL, Rust clients can use rustls, release binaries may be stripped, and containers may start through an init process that never handles TLS. The result is a binary-discovery problem as much as a network-observability problem.',
  outcomes: [
    'Diagnose why a normal libssl uprobe sees no plaintext.',
    'Choose the real executable and plaintext boundary for OpenSSL, BoringSSL, or rustls.',
    'Understand which AgentSight fallbacks are version-sensitive and how to verify them.',
  ],
  sections: [
    {
      title: 'The first trap: HTTPS traffic is not necessarily in libssl.so',
      body: 'Classic SSL tracing tutorials assume the process dynamically loads a shared OpenSSL library and calls exported functions such as SSL_read and SSL_write. That is a convenient case because a uprobe can target a shared-library path and a named function. Modern coding-agent CLIs break this assumption in several ways. Node.js documentation describes OpenSSL among the libraries linked into Node itself, so the plaintext call site can live in the node executable rather than a separately mapped libssl.so. Bun uses BoringSSL, not OpenSSL. Rust applications can use rustls and never call the OpenSSL ABI at all. The first debugging question therefore should not be “is the socket using TLS?” but “which executable or library owns the plaintext-to-TLS transition in this exact process?”',
    },
    {
      title: 'Why uprobes make binary identity part of the tracing contract',
      body: 'Linux uprobes attach to a user-space object by path and a function or file offset. The kernel uprobe tracer documentation explicitly describes the interface as PATH:OFFSET, and libbpf exposes the same binary-path plus offset model. That is important because a socket address, PID, or process name does not tell a tracer where the plaintext function lives. If a command is a shell wrapper, a symlink, a JavaScript entry point with a node shebang, or a container init process, attaching to the visible command can target the wrong object. AgentSight record therefore resolves PATH entries, follows symlinks, and chases shebang interpreters so a wrapper such as a Node-based CLI ends at the actual ELF executable that contains the TLS implementation.',
    },
    {
      title: 'Node.js: the OpenSSL ABI can live inside the node executable',
      body: 'For Node-based agents such as Gemini CLI, looking only for a system libssl mapping can produce a perfectly clean trace with no model traffic. AgentSight v1.0.3 treats Node as an embedded-OpenSSL case: record can discover the Node binary automatically, and an explicit binary path can pin a particular NVM or system installation when several versions are present. This also explains why an HTTPS proxy does not automatically make the problem easier. With a normal CONNECT tunnel, TLS encryption and decryption still happen inside the Node process; the proxy transports the encrypted stream. The useful plaintext point remains inside the runtime before encryption or after decryption. Distribution builds can differ, so the operational rule is to inspect the binary actually running rather than infer linkage from the command name.',
    },
    {
      title: 'Bun and stripped BoringSSL remove the easy symbol lookup',
      body: 'The next failure mode is harder. Bun documents BoringSSL as its TLS implementation, and AgentSight found that the Bun-based Claude Code binary it targets statically links BoringSSL with the relevant symbols stripped. In that case, pointing a uprobe at the correct executable is necessary but still insufficient: there may be no usable dynamic symbol named SSL_read or SSL_write. AgentSight v1.0.3 falls back to byte-pattern discovery. Its sslsniff source searches the binary for machine-code prologues derived from Bun 1.3.x builds: a 19-byte SSL_read pattern, a 24-byte handshake pattern, and a 26-byte SSL_write pattern. It also checks expected relative placement where available rather than trusting a single short byte sequence.',
    },
    {
      title: 'The offsets are an implementation fingerprint, not a stable ABI',
      body: 'The BoringSSL fallback is deliberately defensive because compiler output is not an API. In the v1.0.3 source, AgentSight first locates the SSL_read pattern, checks whether SSL_do_handshake is 0x6f0 bytes earlier, and checks whether SSL_write is 0xca0 bytes later. If the write function is not at that expected location, it searches within roughly 64 KiB on either side of SSL_read for the longer write pattern. These numbers are useful because they expose what a real tracer has to do after symbols disappear, but they are not promises about future Bun releases. A compiler update, BoringSSL change, link-order change, architecture change, or different optimization profile can move or rewrite these functions. A production tracer must validate patterns against the exact binary and fail visibly when the fingerprint no longer matches.',
    },
    {
      title: 'rustls is a different boundary, not another OpenSSL variant',
      body: 'A Rust TLS stack requires a different mental model. rustls exposes plaintext through its own Writer and connection APIs; its documentation says Writer accepts plaintext, encrypts and authenticates it, and later emits TLS records through write_tls. There is no reason for a rustls client to call SSL_write. AgentSight therefore has separate stripped-binary detection for rustls-based agent clients. The v1.0.3 codex_offsets source scans for machine-code prefixes associated with rustls 0.23 PlaintextSink write paths, including write_vectored, and validates additional instruction blocks because branch displacements can vary across compiler releases. The same source contains a separate pattern for a Grok rustls plaintext-buffer path and validates multiple surrounding field-access sequences before accepting the offset. This is a useful general lesson: “trace TLS” means finding the library-specific plaintext API, not searching every process for OpenSSL names.',
    },
    {
      title: 'Process names can be wrong even after the binary is right',
      body: 'Filtering only by comm or the main thread can create another silent blind spot. AgentSight documents that Claude Code TLS traffic flows through an internal HTTP Client thread rather than the main claude thread. When an explicit binary path is used, AgentSight skips the comm filter for SSL monitoring while keeping it for process monitoring, so the TLS uprobe can observe the runtime thread that actually performs the call. This is a subtle but important distinction: process-family attribution and TLS-function filtering solve different problems. A tracer should attribute captured plaintext back to the agent session, but it should not assume that every relevant library call executes on a thread whose short kernel comm name equals the CLI command the user typed.',
    },
    {
      title: 'Containers add one more layer of executable discovery',
      body: 'Container metadata can point at the wrong executable too. Docker inspect commonly returns the container init process, which may be tini or another launcher with no TLS implementation. AgentSight handles its docker:// path by walking the descendant process tree and selecting a process whose binary actually embeds the TLS stack. The same idea applies to Kubernetes after resolving the pod and container to a host PID. This is why “attach to the container PID” is not a complete tracing recipe: the useful probe target is the descendant binary that owns plaintext, and the target can change as an agent spawns runtimes, MCP servers, browsers, package managers, or helper processes.',
    },
    {
      title: 'A practical diagnostic sequence before blaming eBPF',
      body: 'When a TLS trace is empty, first resolve the command to the executable that will really run, including symlinks and shebang interpreters. Inspect the file type and dynamic dependencies. If a shared libssl is mapped and the expected symbols are exported, shared-library uprobes are the simplest path. If the runtime embeds OpenSSL, attach to the executable and verify that the needed symbols or offsets are available. If the binary is Bun-based and stripped, a validated BoringSSL signature may be required. If markers or dependencies indicate rustls, stop looking for SSL_read and identify the rustls plaintext writer instead. In a container, repeat the test for the descendant that owns the connection. This sequence separates attachment mistakes from parser bugs, privilege failures, and genuinely unsupported runtime versions.',
    },
    {
      title: 'Plaintext capture has security and correctness costs',
      body: 'Hooking before encryption is powerful precisely because it can expose data that packet capture cannot: prompts, completions, authorization headers, tool payloads, model identifiers, and other application content. That data should be treated as sensitive development telemetry. Capture also has mechanical limits. AgentSight sslsniff bounds the per-event buffer and documents that oversized reads can be truncated, while streamed protocols require higher-level request and response reconstruction after bytes are collected. A successful uprobe therefore proves that a plaintext boundary was observed; it does not by itself guarantee complete HTTP semantics, complete session coverage, or absence of traffic on another runtime path.',
    },
    {
      title: 'What this means for portable agent observability',
      body: 'The durable design lesson is that TLS observability for agents needs a resolver, not just a probe. The resolver has to map a user-facing command to the real runtime, determine whether TLS is in a shared library or the executable, identify the TLS implementation, survive wrappers and containers, select a plaintext hook point, and record enough version information to know when an offset fingerprint is stale. eBPF provides a useful outside-the-process attachment mechanism, but the hard compatibility work sits above it. AgentSight automates several cases today—shared OpenSSL, embedded Node OpenSSL, stripped Bun/BoringSSL, selected rustls binaries, container descendants—but its byte patterns are intentionally version-scoped. Treat automatic discovery as a tested compatibility layer, not as proof that every future agent binary will have the same hook points.',
    },
  ],
  command: [
    'command -v <agent> && readlink -f "$(command -v <agent>)"',
    'file <resolved-binary>',
    "ldd <resolved-binary> | grep -E 'ssl|crypto' || true",
    "nm -D <resolved-binary> 2>/dev/null | grep -E 'SSL_(read|write)' || true",
    'sudo agentsight record -- <agent-command>',
    'sudo agentsight debug ssl --binary-path <resolved-binary> --verbose',
  ],
  sources: [
    { label: 'AgentSight v1.0.3 supported-agent and binary-discovery notes', href: agentsightAgents },
    { label: 'AgentSight v1.0.3 sslsniff BoringSSL and uprobe implementation', href: sslsniffSource },
    { label: 'AgentSight v1.0.3 rustls stripped-binary offset detection', href: codexOffsets },
    { label: 'Linux kernel uprobe tracer: path and offset attachment model', href: kernelUprobes },
    {
      label: 'Node.js documentation: libraries included with Node.js',
      href: 'https://nodejs.org/api/addons.html#linking-to-libraries-included-with-nodejs',
    },
    { label: 'Bun API reference: BoringSSL-backed TLS implementation', href: 'https://bun.sh/reference/bun' },
    { label: 'rustls Writer documentation: plaintext before TLS records', href: 'https://docs.rs/rustls/latest/rustls/struct.Writer.html' },
  ],
  related: [
    { label: 'System-boundary observability', href: '/blog/system-boundary-observability/' },
    { label: 'Trace closed-source agent CLIs', href: '/use-cases/trace-closed-source-agent-clis/' },
    { label: 'Claude Code integration', href: '/integrations/claude-code/' },
  ],
};

type PageUpgrade = Partial<
  Pick<ContentPage, 'lede' | 'outcomes' | 'sections' | 'command' | 'sources' | 'related'>
>;

const pageUpgrades: Record<string, PageUpgrade> = {
  'use-case:profile-slow-expensive-agent-runs': {
    lede: `A slow or expensive run has several independent budgets: model latency and tokens, tool permission and orchestration time, child-process execution, file and network activity, and local CPU or memory pressure. AgentSight is useful when you need to line those budgets up on the same saved run instead of guessing from a final wall-clock number.`,
    outcomes: [
      'Separate model time, tool time, and child-process time before optimizing.',
      'Find repeated work such as retries, scans, rebuilds, and duplicate network paths.',
      'Use a saved run and semantic flamegraphs to choose the next experiment.',
    ],
    sections: [
      {
        title: 'Start with a phase budget, not a single latency number',
        body: `The Overview and timeline are useful because they let you ask where the run spent time before deciding why. Record one representative task, note total duration and token use, then locate long model calls, tool phases, subprocesses, and idle-looking gaps. A large model span suggests a different optimization path from a long compiler, test runner, package manager, or shell command. The first goal is attribution: identify which phase owns the budget.`,
      },
      {
        title: 'Distinguish semantic latency from system latency',
        body: `Native agent telemetry can already describe model requests, tool choices, and permission delays for some agents. System observation answers a different question: what executed after the tool decision and how long that execution lasted. Correlating the two prevents a common mistake where a slow tool is blamed on the model even though most wall time sits in a child process, or where a fast command hides a model retry loop that consumed most tokens.`,
      },
      {
        title: 'Repeated work is often more actionable than the single slowest span',
        body: `Look for repeated repository scans, identical commands, failed retries, repeated dependency checks, or model calls that revisit the same task phase. One 20-second command may be necessary; twenty 2-second scans may be the real avoidable cost. The process tree and timeline make repetition visible, while the tokens and time projections in agentpprof aggregate similar semantic paths so repeated work becomes wide rather than disappearing into a long event list.`,
      },
      {
        title: 'Use CPU, memory, and I/O shape to classify child-process phases',
        body: `A busy compiler or test runner has a different resource signature from an agent waiting on a remote API. Compare the resource view with the same timestamps in the timeline. Sustained CPU with a stable process tree points toward local compute. Memory growth can indicate a large build, browser, language server, or data-processing child. Low CPU during a long network-associated phase suggests waiting rather than local execution. These are hypotheses to test, not automatic diagnoses.`,
      },
      {
        title: 'Use semantic flamegraphs when the question spans many sessions',
        body: `A single timeline is best for one run. Agent Flamegraphs become useful when the question is aggregate: which task categories consumed tokens, where wall-clock time accumulated, which paths were touched, or which domains were contacted across many sessions. The current agentpprof stack is task → skill → phase → action → object → repeat → result → outcome, with width selected by tokens, time, operation count, files, or network effects.`,
      },
      {
        title: 'Turn each observation into a falsifiable next experiment',
        body: `If the profile is model-heavy, change prompt, context, model, or tool policy and re-run the same task. If repeated scans dominate, narrow retrieval or working-set scope. If a child command dominates, profile or optimize that command directly. If network waits dominate, inspect the destination and retry pattern. Keep the task and environment stable enough that the before/after comparison means something; AgentSight shows observed activity, not proof of causality by itself.`,
      },
    ],
    command: [
      'sudo agentsight record -- claude',
      'agentsight report serve',
      'agentsight report token',
      'agentpprof --view time -o time.svg',
    ],
    sources: [
      { label: 'AgentSight v1.0.3 README and report workflow', href: agentsightReadme },
      { label: 'agentpprof semantic flamegraph design and views', href: agentpprof },
    ],
    related: [
      { label: 'Build an Agent Flamegraph', href: '/guides/agent-flamegraph/' },
      { label: 'System-boundary observability', href: '/blog/system-boundary-observability/' },
      { label: 'Open the recorded demo', href: 'https://app.agentsight.us/' },
    ],
  },

  'use-case:review-ai-generated-prs': {
    lede: `A source diff is the right place to review the final code, but it cannot show the execution history that produced that code. A run profile adds the commands, failed attempts, tests, file scope, process tree, and external activity that help a reviewer decide where the diff deserves extra attention.`,
    outcomes: [
      'Keep the source diff authoritative while adding execution context.',
      'Verify which validation commands actually ran and how they exited.',
      'Turn a large run into a bounded review artifact with explicit uncertainty.',
    ],
    sections: [
      {
        title: 'Separate the final tree from the generating process',
        body: `The pull request tells you what changed. The recorded run tells you how the change was produced. Review both without treating either as a substitute for the other. Use the run to identify the commands that edited or generated files, the validation steps that followed, and unexpected side effects; use the diff and repository history to decide whether the resulting code is correct.`,
      },
      {
        title: 'Reconstruct the validation chain, including failures',
        body: `A final “tests passed” statement is less useful than the actual command sequence. Check which test or build commands ran, whether an earlier attempt failed, whether the agent changed code after the last successful validation, and whether the command exited cleanly. Retaining failures is valuable because they explain why the agent changed direction and can reveal coverage gaps that a final green command hides.`,
      },
      {
        title: 'Review file scope as reads, writes, creates, renames, and deletes',
        body: `Compare the task scope with the observed paths. Repository reads are normal for exploration, while writes and deletes deserve closer attribution to the command or tool phase that caused them. Pay special attention to paths outside the repository, generated files, home-directory configuration, temporary directories, and caches. External-path activity is not automatically wrong, but it should be explainable.`,
      },
      {
        title: 'Record external services that influenced the patch',
        body: `Model providers are only one network dependency. Package registries, Git hosting, documentation sites, local development servers, and MCP services can all influence the run. If the review question involves provenance or reproducibility, note which remote destinations were contacted and which command or phase initiated them. A network destination is context for review, not a claim that the returned content was malicious or correct.`,
      },
      {
        title: 'Reduce the run into a decision-oriented artifact',
        body: `A reviewer rarely needs every captured event. Keep the task and version, important commands and exit status, relevant file effects, remote destinations that affected the decision, major retries, and unresolved questions. Preserve timestamps or stable run identifiers so another engineer can return to the original session. Redact prompts, responses, headers, path contents, and other sensitive material before sharing.`,
      },
      {
        title: 'Keep negative claims bounded by the capture',
        body: `A recorded run can show that an observed command executed or an observed path was touched. It cannot prove that activity outside the recording scope never occurred. Process and file capture can also be incomplete when the environment, privileges, runtime, or probe coverage changes. Phrase review findings as observed behavior in a specific run and reproduce surprising behavior before escalating it.`,
      },
    ],
    command: [
      'sudo agentsight record -- codex',
      'agentsight report audit --json',
      'agentsight report export -o review-run.json',
    ],
    sources: [
      { label: 'AgentSight v1.0.3 reporting and audit workflow', href: agentsightReadme },
      { label: 'agentpprof file, network, time, and token projections', href: agentpprof },
    ],
    related: [
      { label: 'From an agent trace to a review artifact', href: '/blog/from-agent-trace-to-review-artifact/' },
      { label: 'AI agent file-access monitoring', href: '/ai-agent-file-access-monitoring/' },
      { label: 'Codex observability', href: '/codex-observability/' },
    ],
  },

  'use-case:trace-closed-source-agent-clis': {
    lede: `Closed source does not mean unobservable, but it changes the questions you can answer. AgentSight starts from the command and process boundary, resolves the executable that really runs, and then observes supported process, file, network, resource, and TLS activity without requiring the agent vendor to expose an SDK.`,
    outcomes: [
      'Resolve wrappers, symlinks, runtimes, and containers to the executable that actually runs.',
      'Choose the right TLS plaintext boundary instead of assuming every agent uses libssl.so.',
      'State clearly which intent remains visible only through native agent telemetry.',
    ],
    sections: [
      {
        title: 'The command name is not necessarily the executable',
        body: `A CLI entry point can be a symlink, shell wrapper, JavaScript file with a Node shebang, or container launcher. AgentSight record follows PATH resolution, symlinks, and shebang interpreters so the capture can target the runtime that actually owns the process and TLS code. This matters before any eBPF detail: attaching perfectly to the wrong binary still produces an empty or misleading trace.`,
      },
      {
        title: 'Follow the process family instead of one PID',
        body: `Coding agents routinely spawn shells, package managers, compilers, tests, language servers, browsers, and MCP servers. The parent CLI is therefore only the root of the investigation. Use process-family context to attribute descendant activity back to the selected run while keeping the recording bounded enough that unrelated workstation activity does not dominate the result.`,
      },
      {
        title: 'TLS compatibility depends on the runtime and binary build',
        body: `The easy case is a dynamically linked OpenSSL client with usable SSL_read and SSL_write symbols. Modern CLIs can instead embed OpenSSL in Node, statically link stripped BoringSSL through Bun, or use rustls. AgentSight v1.0.3 has compatibility paths for several of these cases, including byte-pattern and offset discovery, but those fingerprints are version-sensitive. Empty TLS capture should trigger binary and TLS-stack diagnosis, not a blanket conclusion that eBPF failed.`,
      },
      {
        title: 'Thread filters can silently hide the traffic you wanted',
        body: `The kernel comm name of the thread doing TLS work can differ from the CLI name. AgentSight documents Claude Code as a concrete example: model traffic is handled by an internal HTTP Client thread. When an explicit binary path is used, AgentSight avoids applying the process-name filter to SSL monitoring so the relevant worker thread is not discarded, while process monitoring can remain scoped to the agent command.`,
      },
      {
        title: 'Containers require descendant executable discovery',
        body: `Container metadata often identifies an init process such as tini rather than the Node or other runtime that owns TLS. AgentSight docker:// and k8s:// resolution walks from the container host PID toward descendants and selects an SSL-embedding executable when supported. This is a compatibility layer, not proof that every container topology or runtime will resolve identically; verify the resolved binary on a representative run.`,
      },
      {
        title: 'System observation does not reconstruct private intent',
        body: `A process tracer can show that a child command ran, a path was touched, or a destination was contacted. It does not automatically know why the model chose that action, which internal policy allowed it, or how the agent labeled the tool call. When native telemetry exists, keep it for intent and policy semantics and add AgentSight when the investigation crosses into uninstrumented descendants or host effects.`,
      },
    ],
    command: [
      'command -v <agent> && readlink -f "$(command -v <agent>)"',
      'sudo agentsight record -- <agent-command>',
      'sudo agentsight debug ssl --binary-path <resolved-binary> --verbose',
    ],
    sources: [
      { label: 'AgentSight v1.0.3 supported-agent and binary-discovery notes', href: agentsightAgents },
      { label: 'AgentSight TLS deep dive', href: '/blog/why-ai-agent-tls-traffic-is-hard-to-trace/' },
      { label: 'Linux kernel uprobe path and offset model', href: kernelUprobes },
    ],
    related: [
      { label: 'TLS tracing deep dive', href: '/blog/why-ai-agent-tls-traffic-is-hard-to-trace/' },
      { label: 'Claude Code integration', href: '/integrations/claude-code/' },
      { label: 'Gemini CLI integration', href: '/integrations/gemini-cli/' },
    ],
  },

  'use-case:audit-mcp-servers-skills-plugins': {
    lede: `An extension schema, skill description, or MCP tool annotation describes an interface; it does not enumerate every process, file, network, or resource effect produced by the implementation. A useful audit correlates protocol-level intent with a bounded system-level run and keeps both sides of that boundary visible.`,
    outcomes: [
      'Compare the declared tool call with the server process family and host effects.',
      'Exercise one representative capability with the smallest necessary authority.',
      'Separate surprising behavior from malicious behavior and reproduce before escalating.',
    ],
    sections: [
      {
        title: 'Start with the protocol contract, not a generic malware scan',
        body: `For MCP, record the server and tool name, input schema, arguments, and returned result. The current MCP specification treats tools as code-execution capabilities and explicitly warns that tool annotations are not trustworthy unless the server is trusted. The audit question is whether the observed implementation behavior is consistent with the capability the user authorized, not whether every file or socket event is inherently suspicious.`,
      },
      {
        title: 'Design one bounded task that exercises the capability',
        body: `Use a prompt or direct test that invokes one target capability and avoid unrelated permissions. Pin the server or extension version, working directory, configuration, and transport. A narrow task makes attribution possible: when a process starts or a path is touched, you can connect it to a concrete tool call rather than a long interactive session containing unrelated work.`,
      },
      {
        title: 'Correlate the tool result with the process family',
        body: `A successful tools/call result tells you what the server returned to the host. System observation can add which executable handled the request, which children it spawned, and when those processes exited. This matters for wrappers and helpers: the server process may delegate the actual work to git, curl, a package manager, a browser, or another runtime whose behavior never appears as a separate MCP protocol event.`,
      },
      {
        title: 'Inspect file and network scope in context',
        body: `Group paths into project, expected runtime/configuration, temporary/cache, and unexplained external locations. Group network destinations by model provider, package or source host, localhost service, and unexplained remote service. A database tool contacting its database or a GitHub tool contacting GitHub can be expected; a destination unrelated to the requested capability deserves reproduction and source review.`,
      },
      {
        title: 'Use both stdio and network fixtures when transport matters',
        body: `AgentSight ships a minimal MCP test fixture with predictable echo, sum, and file-read tools over stdio and HTTP. That fixture is useful for validating your capture path before auditing a third-party server: stdio exercises local pipe communication and process attribution, while HTTP provides a simple network baseline. Establishing that the tracer works on a known fixture reduces false conclusions when a production server uses a different transport.`,
      },
      {
        title: 'Report scope and uncertainty explicitly',
        body: `A single run is a sample of one server version, configuration, task, and approval path. Record what was exercised, what probes were active, and which effects were observed. Do not claim that unobserved capabilities are safe, and do not label a normal cache write or network connection malicious without tying it to an authorization or implementation concern. Reproduce unexplained effects before making a security claim.`,
      },
    ],
    command: [
      'sudo agentsight record -- <agent-command>',
      'agentsight report audit --json',
      'python3 docs/mcp-test/test_mcp_cli.py --transport stdio',
    ],
    sources: [
      { label: 'Current MCP tool specification and safety guidance', href: mcpTools },
      { label: 'Current MCP security and trust principles', href: mcpSpec },
      { label: 'AgentSight v1.0.3 MCP test fixture', href: mcpFixture },
      { label: 'AgentSight v1.0.3 audit workflow', href: agentsightReadme },
    ],
    related: [
      { label: 'MCP server audit method', href: '/mcp-server-audit/' },
      { label: 'Security and local data handling', href: '/security/' },
      { label: 'System-boundary observability', href: '/blog/system-boundary-observability/' },
    ],
  },

  'comparison:application-tracing': {
    lede: `Application tracing and system profiling describe different parts of the same run. Application spans are strongest where code is instrumented and semantic context is available; AgentSight is strongest where execution crosses into local processes, files, network clients, resource use, or closed components that do not emit the parent trace.`,
    outcomes: [
      'Choose application traces for internal control flow, tool semantics, and domain context.',
      'Choose AgentSight for independent process-family and host-level activity.',
      'Correlate both when a single investigation crosses the instrumentation boundary.',
    ],
    sections: [
      {
        title: 'Application instrumentation owns semantics',
        body: `An instrumented agent can record the model call, tool name, arguments, policy decision, retrieval step, evaluator result, and application-specific identifiers because the code already knows those concepts. Modern agent CLIs demonstrate how rich this can be: Claude Code and Gemini CLI expose detailed OpenTelemetry events for tool calls, decisions, API activity, and selected file operations. A system profiler should not pretend those semantics are inferior.`,
      },
      {
        title: 'System observation owns independent execution facts',
        body: `Once a tool launches a shell, compiler, test runner, package manager, MCP server, browser, or other child, the parent trace contains only what it or the child chooses to emit. AgentSight can add the process family, observed file activity, network destinations, and local resources around that execution. This is especially useful for closed-source CLIs or descendants with no tracing configuration.`,
      },
      {
        title: 'The same word can hide different measurement sources',
        body: `A “file operation” in application telemetry can mean an event emitted by a tool implementation; a system file event means an operating-system-visible operation attributed to a process. A “tool duration” may include approval wait, orchestration, and execution; a child-process duration measures the actual process lifetime. These are complementary measurements, not interchangeable fields.`,
      },
      {
        title: 'Use correlation instead of forcing one universal trace',
        body: `Keep the application trace as the semantic spine when it exists. Add a system profile for questions about descendants and host effects, and correlate by time, command, session, provider request, or another stable run identifier. AgentSight can also export captured model calls as OpenTelemetry GenAI spans, but its own documentation is explicit that tool/workflow spans are not emitted yet, so the two sources should remain distinguishable.`,
      },
      {
        title: 'Choose by the question, not by the logo',
        body: `For prompt quality, evaluation, agent graph, or application business logic, start with application tracing. For “what executable ran?”, “what path was touched?”, “where did this process connect?”, or “what happened in an uninstrumented child?”, start with system observation. Use both when the answer requires intent and effect. The useful architecture is layered rather than winner-take-all.`,
      },
    ],
    sources: [
      { label: 'OpenTelemetry instrumentation concepts', href: otelInstrumentation },
      { label: 'Claude Code current OpenTelemetry monitoring reference', href: claudeMonitoring },
      { label: 'Gemini CLI current OpenTelemetry telemetry reference', href: geminiTelemetry },
      { label: 'AgentSight v1.0.3 OpenTelemetry export scope and limitations', href: otelExport },
    ],
  },

  'comparison:opentelemetry': {
    lede: `OpenTelemetry is a standard and instrumentation ecosystem; AgentSight is a concrete local profiler that can produce some OpenTelemetry-compatible output. The useful comparison is not “AgentSight versus OTel” but which measurements AgentSight adds, how those measurements are exported, and which AgentSight-specific data remains outside an OTel trace.`,
    outcomes: [
      'Keep OpenTelemetry as the common signal and collector ecosystem.',
      'Use AgentSight as an additional source for supported agent/system measurements.',
      'Understand exactly what AgentSight exports today and what remains AgentSight-specific.',
    ],
    sections: [
      {
        title: 'OpenTelemetry defines how telemetry is produced and named',
        body: `OpenTelemetry provides APIs, SDKs, instrumentation, collectors, exporters, resources, and semantic conventions across traces, metrics, logs, and profiles. Semantic conventions standardize field names and meaning; they do not create an observation in code that was never instrumented. That distinction is important when an agent launches descendants whose behavior is not represented by the parent application trace.`,
      },
      {
        title: 'AgentSight is a data source with its own capture boundary',
        body: `AgentSight collects a local run through eBPF, runtime/TLS attachment, and agent-session parsing. Its saved session can contain process, file, network, resource, and reconstructed model-call information that does not originate from an OpenTelemetry SDK inside the agent. This is why AgentSight can work with some closed-source CLIs without asking them to link an OTel library.`,
      },
      {
        title: 'The current OTel export is intentionally narrower than the full AgentSight session',
        body: `AgentSight v1.0.3 can export captured LLM request/response pairs as GenAI-style spans over OTLP/HTTP. The exporter maps provider, model, conversation identifiers when available, token usage, finish reasons, HTTP status, and server address. Prompt/completion content is opt-in. The same documentation states that tool/workflow spans such as execute_tool or invoke_agent are not emitted yet, and AgentSight-specific provenance remains in AgentSight rows.`,
      },
      {
        title: 'Correlation should preserve source provenance',
        body: `If a model request is exported to your OTel backend, keep enough metadata to know that the span came from AgentSight capture rather than native SDK instrumentation. Native agent traces may have richer tool or policy semantics; AgentSight may have richer process/file/network context. A shared backend can display both while still preserving which measurement mechanism produced each field.`,
      },
      {
        title: 'Privacy settings differ by measurement source',
        body: `AgentSight content export is off by default for its OTel path because model payloads can be sensitive. Native agent OTel exporters have their own content and redaction controls. Treat the collector as a new data boundary: exporting a local run to a remote backend changes the storage and access model even if the same fields were originally captured locally.`,
      },
      {
        title: 'Use OTel to connect tools, not to erase their differences',
        body: `Choose OpenTelemetry when you need interoperable transport, naming, collection, and backend integration. Choose AgentSight when you need the local system and closed-component measurements it can provide. The strongest combination is AgentSight feeding selected standard spans into the same OTel environment while the full local session remains available for deeper process-level analysis.`,
      },
    ],
    sources: [
      { label: 'OpenTelemetry instrumentation concepts', href: otelInstrumentation },
      { label: 'OpenTelemetry semantic conventions', href: otelSemanticConventions },
      { label: 'AgentSight v1.0.3 OpenTelemetry GenAI export', href: otelExport },
    ],
  },

  'comparison:ai-gateways': {
    lede: `An AI gateway observes and controls model traffic that is deliberately routed through it. AgentSight observes a local agent run around the process boundary, including system activity that may never traverse the model gateway. The two views overlap on provider requests but differ sharply for local execution and control.`,
    outcomes: [
      'Use a gateway for centralized routed-model analytics, policy, retries, and provider controls.',
      'Use AgentSight for local commands, descendants, files, network destinations, and resources.',
      'Correlate gateway request identifiers with the local run when both boundaries matter.',
    ],
    sections: [
      {
        title: 'A gateway only sees traffic that passes through the gateway',
        body: `Cloudflare AI Gateway is a useful concrete example: its current documentation centers analytics, logging, caching, rate limiting, retries, fallback, and guardrails for AI provider requests sent through the gateway. Those features are valuable because the gateway is on the request path. A child process that edits a file, runs tests, or contacts a non-gateway service is outside that traffic boundary.`,
      },
      {
        title: 'Gateway logs are rich provider records, not host execution records',
        body: `Current gateway analytics can summarize traffic patterns and token consumption, while logging can store request/response information according to configuration. That tells you what the routed request did at the gateway. It does not identify every local subprocess, repository path, temporary file, or package-registry connection that occurred before or after the provider request.`,
      },
      {
        title: 'AgentSight starts from the workstation or host instead',
        body: `AgentSight can record the selected agent process family and correlate supported model activity with commands, files, network destinations, and resource use. This makes it useful for questions about tool execution and local side effects. It does not replace gateway controls such as centralized routing, rate limits, fallback, or provider policy because it is not the traffic enforcement point.`,
      },
      {
        title: 'The privacy boundary is different',
        body: `Gateway logging can place model payloads in a centralized service; current Cloudflare docs expose per-request controls over whether raw payloads are collected. AgentSight stores detailed run data locally by default, but its session can also contain sensitive prompts, responses, headers, paths, and network targets. Teams should decide separately which data belongs in a central gateway log and which should remain in a local profiling artifact.`,
      },
      {
        title: 'Use shared identifiers when debugging across both layers',
        body: `When the model request traverses a gateway, a useful investigation links the gateway request to the local agent session by timestamp, provider/model information, request identifiers where available, and the surrounding tool phase. The gateway can explain routing and provider behavior; AgentSight can explain which local action triggered the request and what happened on the machine around it.`,
      },
      {
        title: 'Do not route traffic through a gateway solely to obtain host visibility',
        body: `If your main question is model routing, centralized analytics, or policy, a gateway is the natural tool. If your question is what a closed-source local CLI or its child process did, adding a gateway does not make the host effects visible. Use the two layers for their own control points rather than forcing all observability through one path.`,
      },
    ],
    sources: [
      { label: 'Cloudflare AI Gateway overview and controls', href: cloudflareGateway },
      { label: 'Cloudflare AI Gateway logging and payload controls', href: cloudflareGatewayLogging },
      { label: 'Cloudflare AI Gateway analytics', href: cloudflareGatewayAnalytics },
      { label: 'AgentSight v1.0.3 README', href: agentsightReadme },
    ],
  },

  'comparison:langfuse': {
    lede: `Langfuse and AgentSight start from different data models. Langfuse is an LLM application observability and evaluation platform built around traces and observations; AgentSight is a local system-level profiler built around a recorded agent run. The overlap is useful, but the products should not be reduced to a feature checklist.`,
    outcomes: [
      'Use Langfuse for instrumented LLM traces, evaluation, prompt/version workflows, and application analytics.',
      'Use AgentSight for local process-family, file, network, resource, and closed-CLI investigation.',
      'Combine them when an application trace needs host execution context.',
    ],
    sections: [
      {
        title: 'Langfuse is organized around application traces and observations',
        body: `Current Langfuse documentation describes tracing as the core observability primitive for prompts, responses, tool calls, latency, token usage, costs, and the relationships among them. Langfuse also connects those traces to prompt management, scores, datasets, and evaluation workflows. That is a strong fit when you own or can instrument the LLM application.`,
      },
      {
        title: 'AgentSight is organized around the local run and process family',
        body: `AgentSight begins with a command or agent session and records supported model activity alongside processes, files, network destinations, and resources. It can therefore add useful information when a local CLI is closed source or when an instrumented tool launches descendants that do not report back as detailed application observations.`,
      },
      {
        title: 'A Langfuse tool observation and a child process are not the same object',
        body: `A tool observation can preserve the tool name, inputs, outputs, timing, and application context. A child process has an executable, parent/child relationship, exit status, paths, sockets, and local resource behavior. For debugging a tool implementation, these views often need to be correlated rather than translated into one another.`,
      },
      {
        title: 'Evaluation and quality workflows remain application-layer concerns',
        body: `Langfuse provides evaluation concepts, scores, datasets, and experiments that AgentSight does not attempt to replace. AgentSight can help explain execution context behind an output or failure, but it is not an LLM quality-evaluation platform. If the question is whether the answer is good, use evaluation tooling; if the question is what the local run actually executed, use system profiling.`,
      },
      {
        title: 'Local-first and hosted workflows create different data decisions',
        body: `A local AgentSight database can contain sensitive prompts, responses, paths, headers, and network targets. Langfuse deployments have their own ingestion, hosting, and retention model. When combining them, decide which fields actually need to leave the workstation and export only the information required for the central workflow rather than copying every local system event by default.`,
      },
      {
        title: 'A practical combined architecture keeps both traces',
        body: `Use Langfuse as the application trace and evaluation system when it is already instrumented. Run AgentSight around selected local or CI agent tasks when you need process/file/network context, then correlate the relevant run or model requests by timestamps and stable identifiers. This preserves Langfuse semantics and AgentSight system provenance instead of flattening both into a thin comparison table.`,
      },
    ],
    sources: [
      { label: 'Langfuse observability and application tracing', href: langfuseObservability },
      { label: 'Langfuse evaluation concepts and workflows', href: langfuseEvaluation },
      { label: 'Langfuse trace best practices', href: langfuseTracePractices },
      { label: 'AgentSight v1.0.3 README', href: agentsightReadme },
    ],
  },

  'comparison:langsmith': {
    lede: `LangSmith models an instrumented LLM application as projects, traces, runs, and threads, with monitoring and evaluation workflows layered on top. AgentSight models a bounded local agent execution as model activity plus process, file, network, and resource behavior. The decision is which boundary owns the question you are debugging.`,
    outcomes: [
      'Use LangSmith for application traces, agent-framework semantics, monitoring, feedback, and evaluation.',
      'Use AgentSight for local execution outside application spans and closed-source CLI behavior.',
      'Keep both when you need to explain how an application-level run became host-level effects.',
    ],
    sections: [
      {
        title: 'LangSmith runs are application units, not operating-system processes',
        body: `LangSmith documentation defines a trace as a collection of runs for one application operation, and a run as a span-like unit such as an LLM call, prompt-formatting step, or retrieval call. That structure is intentionally semantic. An operating-system process has a different lifecycle and can outlive, overlap, or contain multiple application-level operations.`,
      },
      {
        title: 'Instrumentation gives LangSmith richer application context',
        body: `Current LangSmith integrations can trace supported LLM providers and agent frameworks automatically, while manual instrumentation can wrap arbitrary functions or code blocks. That makes LangSmith a strong source for the agent graph, intermediate values, metadata, tags, and application-defined steps when you control the tracing boundary.`,
      },
      {
        title: 'AgentSight adds execution below or beside the application trace',
        body: `A shell tool can start tests, compilers, browsers, package managers, or MCP servers whose detailed host behavior is not represented as LangSmith runs unless those components are instrumented. AgentSight can add child-process relationships, file paths, network destinations, and resource activity around the selected task without requiring those descendants to emit LangSmith data.`,
      },
      {
        title: 'Evaluation is not a system-profiler feature',
        body: `LangSmith evaluation spans offline datasets, pre-deployment experiments, and online evaluation of production traces and threads. AgentSight does not provide an equivalent quality-scoring workflow. Use LangSmith or another evaluation system to decide whether outputs meet quality goals; use AgentSight when the diagnosis requires machine-level execution context.`,
      },
      {
        title: 'Correlation works best when neither side pretends to be complete',
        body: `Keep the LangSmith trace ID and application run structure intact. Record the corresponding AgentSight session for selected tasks and correlate by time, command, model/provider request, repository version, or another stable identifier. When the two disagree, inspect the measurement boundary: the application trace may omit a descendant, while the system trace may lack the internal semantic reason for a tool choice.`,
      },
      {
        title: 'Choose the smallest layer that answers the question',
        body: `For framework debugging, prompt/output inspection, feedback, or evaluation, LangSmith is usually the direct tool. For a closed-source CLI, unexplained child process, external path, network destination, or local resource phase, AgentSight is the direct tool. Use both only when the investigation genuinely crosses those layers rather than duplicating every trace by default.`,
      },
    ],
    sources: [
      { label: 'LangSmith observability concepts: projects, traces, runs, and threads', href: langsmithConcepts },
      { label: 'LangSmith evaluation concepts', href: langsmithEvaluation },
      { label: 'AgentSight v1.0.3 README', href: agentsightReadme },
    ],
  },

  'guide:getting-started': {
    lede: `The product website should help you choose a first useful run, not duplicate the installation manual. Use the canonical documentation for installation and platform details, then record one bounded task and learn the four questions the saved session can answer: what the agent requested, what processes ran, what the run touched, and where time or tokens went.`,
    outcomes: [
      'Choose one representative task with a clear start and end.',
      'Confirm the saved run is readable before collecting broader data.',
      'Know which raw fields are sensitive before exporting or sharing.',
    ],
    sections: [
      {
        title: 'Use the canonical docs for installation and platform prerequisites',
        body: `AgentSight is a Linux/eBPF tool and current installation, privilege, build, Docker, and troubleshooting details change with releases. Keep those operational instructions on eunomia.dev and the product repository rather than copying them into a marketing page. Once the released CLI is available, the useful product workflow begins with one selected command.`,
      },
      {
        title: 'Pick a task you can recognize in the resulting timeline',
        body: `A good first run is short enough to inspect manually and concrete enough that you know what should happen: review one commit, run one coding task, or invoke one tool. Broad background capture makes it harder to tell which process or path belongs to the agent. Start bounded, then expand scope only when the first session answers the expected questions.`,
      },
      {
        title: 'Open the saved run before exporting anything',
        body: `Use the saved-session report or web UI to confirm that the model/tool phases, process tree, file activity, network activity, and resource view are present for the task you recorded. If an expected signal is missing, fix the capture boundary first. Exporting an incomplete run simply turns missing visibility into a portable artifact.`,
      },
      {
        title: 'Treat the local session as sensitive development telemetry',
        body: `Depending on capture mode, a session can contain prompts, responses, commands, paths, headers, network targets, and other execution context. Keep the raw SQLite/session artifacts local unless you intentionally need to share them. Redact or reduce exports to the review question rather than attaching an entire database to an issue.`,
      },
      {
        title: 'Move to the specialized workflow after the first successful run',
        body: `Use the slow-run page when the problem is performance or cost, the review workflow when the problem is an AI-generated patch, the Agent Flamegraph guide when the question spans many sessions, and the agent-specific integration pages when runtime packaging or TLS compatibility matters. The first run is a baseline, not the whole operating model.`,
      },
    ],
    command: [
      'cargo install agentsight',
      'sudo agentsight record -- claude',
      'agentsight report serve',
      'agentsight report export -o snapshot.json',
    ],
    sources: [
      { label: 'Canonical AgentSight documentation', href: 'https://eunomia.dev/agentsight/' },
      { label: 'AgentSight v1.0.3 README and Quick Start', href: agentsightReadme },
      { label: 'Security and local data handling', href: '/security/' },
    ],
  },

  'guide:claude-code-profiling': {
    lede: `Claude Code now has rich native OpenTelemetry for model, tool, permission, MCP, and usage questions. AgentSight is most useful when the investigation crosses from those semantic events into child processes, file/network effects, resource phases, or the Bun/BoringSSL runtime boundary. Profile the two layers together instead of treating either as a complete replacement.`,
    outcomes: [
      'Use Claude native telemetry for tool and policy semantics when it is available.',
      'Use AgentSight for process-family and supported host/TLS activity around the same task.',
      'Recognize Bun/BoringSSL and worker-thread compatibility boundaries before debugging empty capture.',
    ],
    sections: [
      {
        title: 'Start from one Claude Code task and keep the task identifier stable',
        body: `Choose a bounded repository task and record the Claude command you would normally run. Keep the repository revision, Claude version, and task prompt available for the investigation. This makes the resulting process tree and file scope easier to interpret and gives you something reproducible if a runtime or tracing change affects capture.`,
      },
      {
        title: 'Use Claude Code telemetry for the semantics it already exposes',
        body: `Current Claude Code OpenTelemetry can report API requests, tool result events, permission decisions, MCP activity, skills, cost and token metrics, and optional traces. Detailed flags can include Bash commands, MCP server/tool names, and tool arguments. Those events are usually the best source for why Claude selected a tool or whether a permission was accepted.`,
      },
      {
        title: 'Use AgentSight when execution leaves the native telemetry boundary',
        body: `A Bash tool can start package managers, compilers, tests, browsers, language servers, or other descendants. AgentSight adds process, path, network, and resource observations around that execution. Claude's own docs explicitly note that its OTEL_* variables are not passed to Bash subprocesses, hooks, MCP servers, or language servers, which is a concrete reason the parent trace does not automatically become a full distributed trace of every child.`,
      },
      {
        title: 'Know the current Claude TLS compatibility path',
        body: `AgentSight v1.0.3 documents Claude Code as a Bun-based application with statically linked, stripped BoringSSL. The TLS tracer therefore cannot rely on a system libssl path and exported SSL_read/SSL_write symbols. AgentSight uses validated byte-pattern discovery for supported builds and also avoids a comm filter on the SSL side because traffic can execute on an internal HTTP Client thread rather than the main claude thread.`,
      },
      {
        title: 'Investigate the same time range in semantic and system views',
        body: `When a tool looks slow, compare the Claude tool event duration with the child process and resource timeline. When a file or network effect looks unexpected, return to the corresponding Claude tool call and permission decision. The goal is a joined explanation: the native trace supplies intent and policy; the system trace supplies independently observed execution.`,
      },
      {
        title: 'Treat detailed telemetry and plaintext capture as sensitive',
        body: `Claude's optional telemetry flags can include prompts, tool inputs, tool content, or raw API bodies, while AgentSight TLS/session capture can contain similarly sensitive material. Enabling both can duplicate secrets and source content into different storage systems. Use the minimum content flags needed for the investigation and keep raw local AgentSight sessions under the same handling rules as other sensitive developer telemetry.`,
      },
    ],
    command: [
      'sudo agentsight record -- claude',
      'agentsight report serve',
      'sudo agentsight debug ssl --binary-path <claude-binary> --verbose',
    ],
    sources: [
      { label: 'Claude Code current OpenTelemetry monitoring reference', href: claudeMonitoring },
      { label: 'AgentSight v1.0.3 Claude/Bun recording notes', href: agentsightAgents },
      { label: 'AgentSight TLS tracing deep dive', href: '/blog/why-ai-agent-tls-traffic-is-hard-to-trace/' },
    ],
  },

  'guide:agent-flamegraph': {
    lede: `Agent Flamegraphs are useful when a timeline has become too large to answer aggregate questions. agentpprof maps free-form agent activity into stable semantic stacks, then uses flamegraph width for tokens, elapsed time, operation count, file effects, or network effects so repeated behavior merges instead of remaining thousands of isolated spans.`,
    outcomes: [
      'Understand what every stack level and width metric represents.',
      'Build reproducible semantic tags instead of exposing raw prompt text.',
      'Choose tokens, time, operations, files, or network based on the question.',
    ],
    sections: [
      {
        title: 'A semantic flamegraph is an aggregation model, not a timeline',
        body: `Traditional flamegraphs merge identical call stacks and use width for CPU time. agentpprof applies the same visual idea to agent work. The default operation stack is task → skill → phase → action → object → repeat → result → outcome, with an additional token frame in the tokens view. Repeated paths merge, so a wide bar means a large share of the selected metric rather than a long chronological interval.`,
      },
      {
        title: 'Choose the width metric before interpreting the chart',
        body: `The operations view counts prompt/tool/LLM steps, tokens weights samples by reported token use, time weights by duration, files counts path effects, and network counts domain effects. The same semantic path can look wide in tokens and narrow in time, or wide in files and narrow in network. That is expected: each view answers a different question over the same sessions.`,
      },
      {
        title: 'Keep project, agent, and session as labels unless you need them as frames',
        body: `Current agentpprof keeps project, agent, and session as pprof sample labels rather than default stack frames. This keeps the visual stack focused on causal/semantic structure while still allowing filtering and grouping with pprof tooling. Add or remove stack fields with --stack when the analysis question requires a different hierarchy.`,
      },
      {
        title: 'Semantic tagging is part of the analysis and must be reproducible',
        body: `Free-form prompts cannot be merged reliably by raw text. agentpprof supports deterministic regex rules, an LLM tagger, and an experimental clustering backend. The documented production workflow iterates regex rules over real prompt samples until unmatched coverage and category distribution are acceptable. Save the rules or tag cache with any published analysis; otherwise another reviewer cannot reproduce the category boundaries.`,
      },
      {
        title: 'Use the chart to compare categories, then return to the source sessions',
        body: `A flamegraph is good at showing that review, debugging, a path family, or a network destination dominates the selected metric. It is not a substitute for the underlying session when you need the exact command or message. Drill from a wide semantic category back to the relevant runs, then use the timeline, report, process tree, or source trace to explain the specific behavior.`,
      },
      {
        title: 'Do not over-read semantic categories',
        body: `Tagging can misclassify vague prompts, multilingual fragments, or continuation messages. Time samples can overlap; token accounting depends on what the source agent reports; file/network views count observed effects rather than importance. Treat the chart as a profiling projection and validate surprising categories against raw samples before making budget, security, or productivity claims.`,
      },
      {
        title: 'Use first-party examples as a format reference, not as your benchmark',
        body: `The AgentSight repository includes token, time, file, network, benchmark, and OSWorld-Human example flamegraphs. They demonstrate how stacks merge and how different width metrics change the picture. They are not evidence that your workload has the same distribution. Build a chart from your own bounded sessions and state the source set, tagger, rules, stack, filters, and weighting mode.`,
      },
    ],
    command: [
      'cargo install agentpprof',
      'agentpprof --view tokens -o tokens.svg',
      'agentpprof --view time -o time.svg',
      "agentpprof --tagger regex --tag-rule prompt:review='(?i)review|diff|regression' -o review.svg",
    ],
    sources: [
      { label: 'agentpprof semantic flamegraph design, views, examples, and tagging', href: agentpprof },
      { label: 'AgentSight v1.0.3 release', href: 'https://github.com/eunomia-bpf/agentsight/releases/tag/v1.0.3' },
    ],
  },

  'blog:from-agent-trace-to-review-artifact': {
    lede: `A raw trace is optimized for investigation, not for another engineer's decision. A review artifact should preserve the small set of commands, effects, timings, and uncertainties that support a specific conclusion while keeping a path back to the original local run and removing sensitive material that the reviewer does not need.`,
    outcomes: [
      'Define the review decision before selecting events.',
      'Separate observed facts, derived summaries, and reviewer inference.',
      'Publish the smallest artifact that another engineer can reproduce or challenge.',
    ],
    sections: [
      {
        title: 'Begin with one question that can change the review outcome',
        body: `“Summarize this run” is too broad. Better questions are “did the agent validate the changed code after its last edit?”, “did this MCP tool access paths outside the declared scope?”, or “which phase explains the latency regression?” The question determines which commands, file effects, network destinations, token/time summaries, and process relationships belong in the artifact.`,
      },
      {
        title: 'Keep the raw session immutable while you reduce it',
        body: `Treat the saved AgentSight database or source trace as the reference record and derive a smaller artifact from it. Record the AgentSight version, product/source commit when relevant, repository revision, task boundary, and time window. Reduction should never rewrite the original run because a reviewer may need to verify a summarized claim against the underlying event sequence.`,
      },
      {
        title: 'Use three layers: observed, derived, inferred',
        body: `Observed facts are direct records such as a process start, exit code, path operation, network destination, or captured model request. Derived facts are deterministic summaries such as total tokens, grouped file paths, or semantic flamegraph categories. Inference is the human conclusion that a retry caused a delay or a path access was unnecessary. Label these layers instead of presenting every sentence as equally certain.`,
      },
      {
        title: 'For code review, preserve the validation chain',
        body: `Keep the commands that changed or generated the patch, failed validation that caused retries, the final successful validation, and any edits made after that validation. Include the relevant file scope and unexplained external activity. The artifact should make it possible to answer whether the final tree was actually tested without forcing the reviewer to inspect thousands of unrelated events.`,
      },
      {
        title: 'For security review, preserve authority and side effects',
        body: `Keep the tool or extension identity, the authorized task, child processes, external paths, remote destinations, and privilege-relevant actions. A normal cache write can be omitted or grouped once understood; an unexplained credential path or remote service should remain visible. The purpose is not to maximize event count but to preserve the chain from authority to effect.`,
      },
      {
        title: 'Redact content without erasing the structure needed for review',
        body: `Prompts, responses, headers, source snippets, home paths, user identifiers, and network payloads may be sensitive. Replace unnecessary values with stable placeholders while preserving timestamps, event type, process relationship, path class, domain class, sizes, exit status, and other structure needed to support the decision. Do not publish raw AgentSight databases by default.`,
      },
      {
        title: 'Preserve negative uncertainty explicitly',
        body: `“No event was observed” is not the same as “the event did not happen.” State the recording scope and relevant capture limitations, especially for runtime/TLS compatibility and activity outside the selected process family. If a finding depends on absence, rerun with a targeted probe or another data source before turning the absence into a strong claim.`,
      },
      {
        title: 'A good artifact ends with unresolved questions and a reproduction path',
        body: `List what the artifact establishes, what remains inferred, and what a reviewer should run next if they disagree. Include the command used to record the task, the report or query that produced the summary, and stable identifiers or timestamps for the original session. The artifact is successful when it makes review faster without preventing a skeptical engineer from going back to the source.`,
      },
    ],
    command: [
      'sudo agentsight record -- codex',
      'agentsight report audit --json > audit.json',
      'agentsight report export -o review-run.json',
      'agentpprof --view files -o files.svg',
    ],
    sources: [
      { label: 'AgentSight v1.0.3 report and audit commands', href: agentsightReadme },
      { label: 'agentpprof file/network/time/token projections and reproducibility', href: agentpprof },
      { label: 'AgentSight security and local data handling', href: '/security/' },
    ],
  },

  'integration:claude-code': {
    lede: `The Claude Code integration page is about current compatibility, not a generic observability pitch. AgentSight records Claude as a process family and, for supported builds, handles the Bun/BoringSSL TLS path that differs from ordinary libssl-based tooling. Claude's own OpenTelemetry remains the better source for internal tool and permission semantics.`,
    outcomes: [
      'Know which Claude behaviors come from native telemetry and which come from AgentSight.',
      'Understand the Bun/BoringSSL and HTTP Client thread compatibility path.',
      'Keep sensitive native and AgentSight content controls separate.',
    ],
    sections: [
      {
        title: 'The normal path is still the command you already use',
        body: `Run Claude Code normally under agentsight record. The record path resolves the user-local executable even under sudo, follows symlinks, and creates a bounded session around the selected command. Use an explicit binary path for debugging or when the maintained compatibility guide says automatic resolution is insufficient.`,
      },
      {
        title: 'Claude Code already exposes rich native OpenTelemetry',
        body: `Current Claude Code telemetry can report model/API activity, token and cost metrics, tool result and decision events, MCP connections and calls, hooks, skills, and optional traces. Detailed logging flags can include Bash commands and tool arguments. Use that data for internal tool identity, policy decisions, and application semantics instead of trying to infer them from syscalls.`,
      },
      {
        title: 'AgentSight adds the child-process and host boundary',
        body: `Use AgentSight when the question is which process actually ran, which descendant launched next, which paths were observed, which remote destinations were contacted, or where local resource time accumulated. Claude's documentation explicitly says its OTEL_* configuration is not propagated into Bash subprocesses, hooks, MCP servers, or language servers, so the parent exporter does not automatically instrument every descendant.`,
      },
      {
        title: 'Claude TLS capture is a Bun/BoringSSL compatibility case',
        body: `AgentSight v1.0.3 documents the supported Claude binary as Bun-based with statically linked, stripped BoringSSL. sslsniff therefore includes validated byte-pattern discovery instead of assuming exported OpenSSL symbols. The TLS deep dive documents the version-sensitive fingerprint logic; if a future Claude/Bun build changes compiler output, verify the binary rather than assuming the old offsets still apply.`,
      },
      {
        title: 'TLS can run on a worker thread with a different comm name',
        body: `AgentSight documents Claude model traffic flowing through an internal HTTP Client thread. When a binary path is specified, the SSL capture path avoids the comm filter so that worker-thread traffic is not dropped, while process monitoring can remain scoped to the Claude process family. This explains an otherwise confusing failure mode where the correct binary is attached but a name filter still yields no TLS events.`,
      },
      {
        title: 'Choose content capture deliberately',
        body: `Claude native telemetry can be configured to log prompts, tool inputs, tool content, and even raw API bodies; AgentSight plaintext/session capture can contain similarly sensitive values. These are independent data paths. Enable only the content needed for the investigation, keep raw local sessions private, and configure redaction/filtering in any remote telemetry backend separately.`,
      },
    ],
    command: [
      'sudo agentsight record -- claude',
      'agentsight report serve',
      'sudo agentsight debug ssl --binary-path <claude-binary> --verbose',
    ],
    sources: [
      { label: 'AgentSight v1.0.3 Claude recording and runtime notes', href: agentsightAgents },
      { label: 'Claude Code current OpenTelemetry monitoring reference', href: claudeMonitoring },
      { label: 'AgentSight v1.0.3 BoringSSL tracing implementation', href: sslsniffSource },
    ],
  },

  'integration:codex': {
    lede: `The Codex integration combines two independently useful sources: Codex's own open-source OpenTelemetry implementation for session/business semantics, and AgentSight's process/TLS/system view for the local execution around a coding task. Current AgentSight also contains a separate stripped-rustls compatibility path rather than treating Codex as an OpenSSL client.`,
    outcomes: [
      'Keep Codex native OTel events for application and session semantics.',
      'Use AgentSight for child processes, files, network destinations, resources, and supported plaintext capture.',
      'Treat rustls machine-code fingerprints as version-scoped compatibility data.',
    ],
    sections: [
      {
        title: 'Record one bounded Codex task around a known repository revision',
        body: `Use the Codex command you normally run and keep the task, repository SHA, and Codex version available. A bounded task makes process and file attribution tractable and lets the final diff remain the primary code-review surface while the AgentSight run explains the execution history that produced it.`,
      },
      {
        title: 'Codex has a first-party OpenTelemetry implementation',
        body: `The current open-source codex-otel crate provides provider wiring for log, trace, and metric exporters, SessionTelemetry for session-scoped business events, metrics APIs, and W3C trace-context helpers. That native data is the best source for Codex-specific application events because it is emitted where those semantics are known.`,
      },
      {
        title: 'AgentSight adds host behavior that native events do not automatically enumerate',
        body: `A Codex tool or shell step can launch tests, compilers, package managers, Git commands, or other helpers. AgentSight can add the process family, observed path operations, network destinations, and resource behavior around those descendants. Use it to answer “what actually ran on this machine?” rather than duplicating Codex's own semantic fields.`,
      },
      {
        title: 'Codex plaintext capture is not an OpenSSL assumption',
        body: `AgentSight v1.0.3 includes stripped-binary rustls detection for supported Codex builds. The codex_offsets implementation scans for machine-code prefixes associated with rustls plaintext write paths, including vectored writes, and validates surrounding instruction blocks. These fingerprints depend on the compiler and rustls build and should be verified against the exact binary rather than treated as a stable ABI.`,
      },
      {
        title: 'Use the run to review validation and retries behind the final patch',
        body: `Check which test/build commands ran, which failed, what edits followed failures, and whether validation occurred after the last material change. Use file and network context to identify external influences that are not visible in the final diff. Keep conclusions bounded to the recorded task and source revision.`,
      },
      {
        title: 'Preserve provenance when exporting into a shared telemetry stack',
        body: `If Codex native OTel and AgentSight-exported GenAI spans land in the same backend, retain source/service attributes so the two measurement paths remain distinguishable. Codex can provide richer session semantics, while AgentSight can provide independent system context. Merging them conceptually is useful; pretending they were produced by the same instrumentation is not.`,
      },
    ],
    command: [
      'sudo agentsight record -- codex',
      'agentsight report audit --json',
      'agentsight report serve',
    ],
    sources: [
      { label: 'Current Codex OpenTelemetry crate README at reviewed source commit', href: codexOtel },
      { label: 'AgentSight v1.0.3 supported-agent notes', href: agentsightAgents },
      { label: 'AgentSight v1.0.3 Codex/rustls offset detection', href: codexOffsets },
    ],
  },

  'integration:gemini-cli': {
    lede: `Gemini CLI already exports detailed OpenTelemetry logs, metrics, and traces for model, tool, approval, selected file, token, and runtime questions. AgentSight complements that semantic stream with process-family and host activity, while its Node-specific TLS path matters because the relevant OpenSSL code can live in the node executable rather than a system libssl.`,
    outcomes: [
      'Use Gemini telemetry for tool decisions, API fields, token metrics, and instrumented file operations.',
      'Use AgentSight for descendants and independent host-level activity around the same task.',
      'Understand why Node binary discovery matters for plaintext TLS capture.',
    ],
    sections: [
      {
        title: 'Start with Gemini CLI native telemetry for semantic questions',
        body: `Current Gemini CLI telemetry includes gemini_cli.tool_call with function name, arguments, duration, success, decision, and MCP metadata; file-operation events for tool-performed creates, reads, and updates; API request/response signals; token metrics; and detailed GenAI spans when tracing is enabled. That makes native telemetry the direct source for tool identity and approval semantics.`,
      },
      {
        title: 'File operations emitted by tools are not a full descendant-process inventory',
        body: `Gemini's documented file events describe operations performed by tools. A shell tool can still launch compilers, package managers, or helpers that open many more files below the tool implementation. AgentSight is useful when you need to compare the semantic tool event with the observed process and path activity generated by that tool.`,
      },
      {
        title: 'Node.js changes where the TLS plaintext hook lives',
        body: `AgentSight documents Gemini CLI as a Node-based workflow and treats Node as an embedded-OpenSSL case for supported builds. The record path resolves the Node executable behind the CLI and can attach there instead of assuming a system libssl.so mapping. If multiple NVM or system Node installations exist, an explicit binary path can pin the runtime actually used.`,
      },
      {
        title: 'Use system views for non-model network and resource questions',
        body: `Gemini native telemetry is strong for Gemini API activity and the CLI's own metrics. A coding task can also contact package registries, Git hosting, local services, or remote tool endpoints. AgentSight's network and process views can help attribute those destinations to child commands and line them up with CPU/memory phases in the same run.`,
      },
      {
        title: 'Correlate by prompt or tool phase rather than duplicating every field',
        body: `When a native tool_call is slow, inspect the matching child process and resource interval. When a system path or destination is surprising, return to the corresponding Gemini tool call and decision. The combined workflow is strongest when the semantic event answers “what did Gemini choose?” and the system profile answers “what did that execution do?”`,
      },
      {
        title: 'Review content logging settings before central export',
        body: `Gemini telemetry can include prompts and, with detailed traces, large attributes such as tool outputs and file reads depending on configuration. AgentSight local capture can also contain sensitive prompts, responses, headers, paths, and network targets. Keep those data paths independently controlled and avoid exporting duplicate raw content unless the investigation requires it.`,
      },
    ],
    command: [
      'sudo agentsight record -- gemini',
      'agentsight report serve',
      'sudo agentsight record -c node',
    ],
    sources: [
      { label: 'Gemini CLI current OpenTelemetry telemetry reference', href: geminiTelemetry },
      { label: 'AgentSight v1.0.3 Node/Gemini recording notes', href: agentsightAgents },
      { label: 'AgentSight TLS tracing deep dive', href: '/blog/why-ai-agent-tls-traffic-is-hard-to-trace/' },
    ],
  },

  'integration:opencode-openclaw': {
    lede: `OpenCode and OpenClaw are grouped here because the AgentSight attachment boundary differs by deployment, not because the agents are identical. A local CLI is recorded from its command; a containerized Node service requires resolving the container to the descendant executable that actually owns TLS and the work.`,
    outcomes: [
      'Use the normal command boundary for a local OpenCode run.',
      'Use docker:// or k8s:// resolution for supported containerized Node deployments.',
      'Verify the resolved runtime before treating automatic capture as portable.',
    ],
    sections: [
      {
        title: 'Keep the local CLI path simple',
        body: `For a local OpenCode-style CLI, start with agentsight record around the command you already run. This preserves the terminal workflow and bounds the process family to one task. Do not add container-specific options or runtime assumptions unless the actual deployment requires them.`,
      },
      {
        title: 'A container name resolves to an init process before it resolves to TLS',
        body: `AgentSight's OpenClaw experiment documents a real Docker topology in which docker inspect returns tini as the container init while the Node descendant owns the TLS stack. Attaching to tini would capture no model plaintext. The docker:// resolver walks descendants and chooses the SSL-embedding executable for the supported case.`,
      },
      {
        title: 'Node-based services can embed OpenSSL in the executable',
        body: `The same OpenClaw walkthrough explains why a system libssl path is not enough: the Node executable contains the relevant OpenSSL code in the tested deployment. AgentSight therefore attaches its SSL uprobe to /proc/<pid>/exe for the resolved Node process. This is the same binary-identity problem described in the TLS deep dive, now combined with container process discovery.`,
      },
      {
        title: 'Kubernetes adds control-plane resolution before host PID resolution',
        body: `For supported k8s:// references, AgentSight first resolves the pod/container to a container ID, then uses Docker or CRI tooling to find the host PID before walking the process tree. That means cluster permissions, kubeconfig, CRI availability, and node placement are part of the attachment contract. Run AgentSight on the node that actually hosts the pod and verify the resolved executable.`,
      },
      {
        title: 'Do not equate successful model capture with full container coverage',
        body: `Capturing the LLM request proves that one plaintext path was observed. The container can still contain other processes, local IPC, plain HTTP, or runtime paths outside the selected probe. Use process/file/network views and the workload's own logs when the audit question extends beyond the model client.`,
      },
      {
        title: 'Pin the deployment shape when publishing a result',
        body: `Container images, Node versions, init processes, and agent versions change. Record the image or source version, container runtime, resolved PID/executable, and AgentSight version with any published investigation. This turns an automatic resolver from a black box into a reproducible compatibility claim.`,
      },
    ],
    command: [
      'sudo agentsight record -- opencode',
      'sudo agentsight record -c node --binary-path docker://openclaw',
      'sudo agentsight debug trace --binary-path k8s://namespace/pod/container --server',
    ],
    sources: [
      { label: 'AgentSight v1.0.3 OpenCode/OpenClaw/container recording notes', href: agentsightAgents },
      { label: 'AgentSight OpenClaw Docker experiment and descendant resolution', href: openclawExperiment },
      { label: 'AgentSight TLS tracing deep dive', href: '/blog/why-ai-agent-tls-traffic-is-hard-to-trace/' },
    ],
  },

  'landing:claude-code-observability': {
    lede: `Claude Code observability now spans several independent layers: Claude's native OpenTelemetry for model/tool/policy semantics, AgentSight for the local process family and supported system/TLS activity, and your existing backend or SIEM for aggregation and alerting. The important design choice is which layer produced each fact.`,
    outcomes: [
      'Map Claude native telemetry and AgentSight to different questions instead of duplicating them.',
      'Correlate tool and permission events with descendant execution and host effects.',
      'Choose content/redaction settings separately for each telemetry path.',
    ],
    sections: [
      {
        title: 'Layer one: Claude Code already emits rich native telemetry',
        body: `Claude Code can export metrics, events, and optional traces through OpenTelemetry. Current documentation includes model/API activity, token and cost usage, tool result and tool decision events, MCP connections/calls, hooks, skills, commits, pull requests, and security-oriented events. Use this layer for internal intent, policy, and tool semantics.`,
      },
      {
        title: 'Layer two: AgentSight observes the selected local run',
        body: `AgentSight can record Claude's process family and supported process, file, network, resource, and model/TLS activity without adding a Claude-specific SDK. This layer becomes most useful when a Bash tool or extension starts descendants whose detailed host behavior is not represented by the parent application's own events.`,
      },
      {
        title: 'The boundary is concrete: Claude does not propagate its OTel exporter settings to every child',
        body: `Claude's monitoring reference states that OTEL_* variables are not passed to Bash subprocesses, hooks, MCP servers, or language servers. That does not make those children unobservable; it means they do not automatically join the same OTel export path. AgentSight can provide an independent host view without requiring each child to be separately instrumented.`,
      },
      {
        title: 'Provider traffic is another measurement layer',
        body: `Claude native API events know the semantic request and retry context. AgentSight can reconstruct supported model traffic from the TLS boundary for compatible binaries, and can export captured request/response pairs as GenAI-style spans. These two records may overlap but are produced differently. Preserve source provenance instead of assuming one is a duplicate of the other.`,
      },
      {
        title: 'Use the combined stack for concrete investigations',
        body: `For cost and tool adoption, start with Claude native metrics. For a permission or policy question, start with tool decision events. For a slow shell step, unexpected child process, repo-external path, or non-model destination, add the AgentSight run. For fleet-wide alerts, export the selected signals to your existing OTel/SIEM backend rather than turning AgentSight into the central policy plane.`,
      },
      {
        title: 'Content controls are a security decision, not a debugging convenience',
        body: `Claude telemetry redacts many content fields by default and exposes explicit flags for prompts, tool details, tool content, and raw API bodies. AgentSight sessions can also contain sensitive prompts, responses, commands, headers, paths, and network targets. Decide what must be collected before enabling content-rich modes and avoid copying the same sensitive payload into multiple remote systems unnecessarily.`,
      },
    ],
    sources: [
      { label: 'Claude Code current monitoring and audit telemetry reference', href: claudeMonitoring },
      { label: 'AgentSight v1.0.3 Claude compatibility notes', href: agentsightAgents },
      { label: 'AgentSight v1.0.3 OpenTelemetry export', href: otelExport },
      { label: 'System-boundary observability deep dive', href: '/blog/system-boundary-observability/' },
    ],
    related: [
      { label: 'Claude Code integration details', href: '/integrations/claude-code/' },
      { label: 'Profile Claude Code with AgentSight', href: '/guides/claude-code-profiling/' },
      { label: 'TLS tracing in modern agent CLIs', href: '/blog/why-ai-agent-tls-traffic-is-hard-to-trace/' },
    ],
  },

  'landing:codex-observability': {
    lede: `Codex observability can combine first-party OpenTelemetry from the open-source Codex implementation with AgentSight's independent local run profile. The native layer is best for session and application semantics; the system layer is best for validating the processes, paths, network activity, resources, and supported TLS behavior behind the coding task.`,
    outcomes: [
      'Use Codex OTel for session/business events and trace context.',
      'Use AgentSight to inspect the execution history behind the final diff.',
      'Keep source revision and binary compatibility explicit when interpreting rustls capture.',
    ],
    sections: [
      {
        title: 'Codex exposes its telemetry implementation in source',
        body: `The current codex-otel crate documents provider wiring for logs, traces, and metrics, SessionTelemetry for session-scoped events, metrics APIs, and W3C trace-context helpers. That makes the application layer directly inspectable and gives you a strong semantic source without reverse engineering the CLI.`,
      },
      {
        title: 'The final patch still needs execution context for some reviews',
        body: `A diff does not show which tests failed, what commands retried, which external paths were read, or which remote services influenced the task. Record the generating Codex run and preserve the command sequence, validation timing, file scope, and relevant network activity as context for the source review rather than as a replacement for it.`,
      },
      {
        title: 'AgentSight adds a separate system and TLS boundary',
        body: `AgentSight follows the Codex process family and records supported host activity. For the currently supported stripped rustls path, v1.0.3 uses validated machine-code fingerprints instead of searching for OpenSSL functions. That compatibility layer is tied to binary/compiler output and should be treated as version-specific rather than a permanent Codex ABI.`,
      },
      {
        title: 'Correlate native and system timelines around the same tool phase',
        body: `When a native Codex event identifies a tool or model phase, inspect the same interval in the process tree and file/network views. When the system trace shows a surprising process or destination, return to the native session context to understand which tool or user action led to it. This avoids the two most common errors: inferring intent from syscalls and inferring low-level effects from tool labels.`,
      },
      {
        title: 'Use aggregate profiling when one run is no longer enough',
        body: `agentpprof can aggregate supported local Codex sessions into token, time, operation, file, and network flamegraphs. That is useful for questions such as which task categories consume model budget or which paths dominate across many runs. Keep the semantic tag rules and source session set with any published chart so the result is reproducible.`,
      },
      {
        title: 'State capture limits next to any negative conclusion',
        body: `A bounded AgentSight session shows observed activity in its configured scope; it does not prove that unrecorded behavior never occurred. A native OTel event similarly represents what Codex instrumented. If a security or provenance conclusion depends on absence, reproduce with a targeted second source before treating that absence as proof.`,
      },
    ],
    sources: [
      { label: 'Current Codex OpenTelemetry crate README at reviewed source commit', href: codexOtel },
      { label: 'AgentSight v1.0.3 Codex/rustls compatibility source', href: codexOffsets },
      { label: 'agentpprof semantic flamegraph design', href: agentpprof },
    ],
  },

  'landing:mcp-server-audit': {
    lede: `This page is the concrete audit method: establish a known-good capture path with the AgentSight MCP fixture, run one bounded MCP capability, compare the protocol call/result with the server process family and host effects, then document mismatches without treating every side effect as malicious.`,
    outcomes: [
      'Validate the tracer first with predictable stdio or HTTP MCP traffic.',
      'Compare tools/call inputs and results with process, file, and network behavior.',
      'Produce a versioned audit result that states scope, uncertainty, and reproduction steps.',
    ],
    sections: [
      {
        title: '1. Validate your capture path with the built-in fixture',
        body: `AgentSight v1.0.3 includes a minimal Python MCP fixture with echo, sum_numbers, and read_fixture tools over stdio and HTTP. The outputs are intentionally predictable. Run the fixture before a third-party audit so you know whether process attribution, stdio/network visibility, and the report path work in your environment. A broken baseline should be fixed before interpreting an empty production trace.`,
      },
      {
        title: '2. Record the protocol contract for the target tool',
        body: `Capture the server/version, tool name, description, input schema, arguments, and returned tool result. The current MCP specification defines these protocol objects but also warns that tool annotations should be considered untrusted unless the server is trusted. The contract is the starting point for the audit, not proof of implementation behavior.`,
      },
      {
        title: '3. Exercise the smallest task that requires the target capability',
        body: `Use one representative call with the minimum authority needed. Avoid a long interactive session that invokes multiple unrelated tools. Pin working directory, environment, configuration, and server version. A narrow task is what makes a child process, path, or destination attributable to the capability under review.`,
      },
      {
        title: '4. Compare the returned result with the process family',
        body: `Inspect which executable handled the call and whether it delegated work to shell commands, Git, curl, package managers, interpreters, browsers, or other helpers. A server can return a small JSON result while performing substantial local work. Those descendants are not necessarily protocol violations; they are implementation facts the reviewer can compare with the expected capability.`,
      },
      {
        title: '5. Classify file and network effects before judging them',
        body: `Separate expected project paths, runtime/configuration paths, caches/temp files, and unexplained external paths. Separate expected service endpoints, localhost, provider/package/source hosts, and unexplained destinations. Mark what is necessary for the task, what is surprising but plausible, and what requires reproduction or source review.`,
      },
      {
        title: '6. Repeat surprising effects and change one variable at a time',
        body: `Re-run the same tool call to distinguish deterministic implementation behavior from unrelated background activity. Then change one input, permission, or configuration to test the hypothesis. A repeated unexplained effect tied to the same tool call is much stronger audit material than one event seen once in a busy workstation trace.`,
      },
      {
        title: '7. Publish the audit as a scoped compatibility/security result',
        body: `Record the exact server and AgentSight versions, transport, task, relevant process/file/network findings, known capture limits, and commands needed to reproduce. Do not claim the entire server is safe because one capability behaved as expected, and do not claim a vulnerability merely because an implementation used a helper or cache that was not mentioned in its schema.`,
      },
    ],
    command: [
      'python3 docs/mcp-test/test_mcp_cli.py --transport stdio',
      'python3 docs/mcp-test/test_mcp_server.py --transport http --host 127.0.0.1 --port 8765',
      'sudo agentsight record -- <agent-command>',
      'agentsight report audit --json',
    ],
    sources: [
      { label: 'AgentSight v1.0.3 MCP test fixture', href: mcpFixture },
      { label: 'Current MCP tool specification', href: mcpTools },
      { label: 'Current MCP security and trust principles', href: mcpSpec },
      { label: 'AgentSight v1.0.3 audit workflow', href: agentsightReadme },
    ],
  },

  'landing:ebpf-ai-agent-monitoring': {
    lede: `eBPF gives AgentSight an observation mechanism below the agent application, but “eBPF monitoring” is not one magic hook. A useful agent profile combines process-family events with file and resource signals, user-space TLS/plaintext attachment where supported, and agent/session parsing above the kernel layer.`,
    outcomes: [
      'Understand which parts of AgentSight are kernel/system probes and which are higher-level correlation.',
      'Know why user-space binary identity matters even in an eBPF-based product.',
      'Keep privilege, runtime, capture scope, and version-sensitive limitations visible.',
    ],
    sections: [
      {
        title: 'Process-family observation is the stable backbone',
        body: `The useful unit for an agent task is usually not one PID. The selected CLI launches descendants and those descendants can perform the build, test, file, network, or tool work that matters. AgentSight uses system observation to keep those relationships tied to the recorded session so the user can move from an agent/tool phase to the executable that actually ran.`,
      },
      {
        title: 'File and resource events answer different questions from model traces',
        body: `A model or tool trace can explain the semantic request; system events can show observed path activity and local resource phases. Combining them lets you ask whether a slow tool was CPU-heavy, whether a patch touched files outside the intended scope, or whether a child process contacted services beyond the model provider. These signals should remain attributable rather than flattened into a generic “agent event.”`,
      },
      {
        title: 'TLS plaintext capture uses uprobes, so the target binary still matters',
        body: `eBPF does not remove the need to understand user-space runtime packaging. Linux uprobes attach to a specific object path and function/offset. Modern agent CLIs can use shared OpenSSL, OpenSSL embedded in Node, stripped Bun/BoringSSL, or rustls. AgentSight's compatibility code resolves wrappers and binaries and uses implementation-specific discovery where necessary. The hard part is often choosing the correct plaintext function, not loading the BPF program.`,
      },
      {
        title: 'Correlation above the probes is what turns events into an agent profile',
        body: `Raw process, file, and TLS events are not enough to explain a coding task. AgentSight's collector and session layer align them with model/tool activity and store a reusable local run. The product views then expose Overview, timeline, process tree, metrics, reports, and semantic flamegraphs. The eBPF mechanism is one part of the system, not the whole user-facing abstraction.`,
      },
      {
        title: 'Privileges and platform support are part of the deployment model',
        body: `Kernel and uprobe tracing require Linux features and sufficient privilege. Containers and Kubernetes add host-PID and runtime resolution. Binary packaging can change TLS compatibility. Use the maintained product documentation for the current supported environment rather than treating “uses eBPF” as a promise that every operating system, runtime, or binary build is observable in the same way.`,
      },
      {
        title: 'Capture is observational, not an enforcement guarantee',
        body: `AgentSight is designed to profile and inspect observed activity. A recorded run can be valuable for debugging, performance work, or audit, but it does not automatically block an operation or prove the absence of unobserved behavior. If your requirement is policy enforcement, combine observation with an enforcement mechanism designed for that control point.`,
      },
    ],
    command: [
      'sudo agentsight record -- claude',
      'sudo agentsight debug trace --server',
      'sudo agentsight debug ssl --binary-path <resolved-binary> --verbose',
    ],
    sources: [
      { label: 'AgentSight v1.0.3 architecture and CLI workflow', href: agentsightReadme },
      { label: 'Linux kernel uprobe tracer path/offset model', href: kernelUprobes },
      { label: 'AgentSight v1.0.3 TLS attachment implementation', href: sslsniffSource },
      { label: 'AgentSight TLS tracing deep dive', href: '/blog/why-ai-agent-tls-traffic-is-hard-to-trace/' },
    ],
  },

  'landing:ai-agent-file-access-monitoring': {
    lede: `File-access monitoring is useful only when it preserves direction and cause. A path should be interpreted as a read, write, create, rename, or delete associated with a process and agent phase—not as a context-free “touched file” alert. The same run should also distinguish repository paths from caches, temporary data, home configuration, and other external locations.`,
    outcomes: [
      'Separate read/inspect behavior from modification and deletion.',
      'Attribute important paths to the command/process and agent phase that caused them.',
      'Use aggregate file flamegraphs without treating every external path as suspicious.',
    ],
    sections: [
      {
        title: 'Start by classifying operation direction',
        body: `Reads answer a different review question from writes, creates, renames, and deletes. A coding agent may read thousands of source and dependency files while changing only a handful. Preserve the operation type so a large read working set does not look like a large modification scope and so deletes or renames remain visible instead of being collapsed into a generic file count.`,
      },
      {
        title: 'Keep the process and agent phase attached to the path',
        body: `A file operation is easier to interpret when you know whether it came from the agent runtime, git, a compiler, a test runner, a package manager, an MCP server, or another descendant. Correlate important paths with the process tree and timeline. That attribution often explains apparently surprising activity without requiring access to the child application's source code.`,
      },
      {
        title: 'Separate project paths from expected external runtime paths',
        body: `Home-directory configuration, language/package caches, temporary directories, Git metadata, compiler output, and agent session stores are common in developer workflows. Group these separately from repository source paths and from truly unexplained external locations. “Outside the repository” is a useful review filter, not an automatic security verdict.`,
      },
      {
        title: 'Use the final diff to validate modification scope',
        body: `For an AI-generated patch, compare observed writes/renames/deletes with the actual Git diff and generated artifacts. A write that does not appear in the final diff may have been reverted, temporary, or outside version control. A file in the diff without a clear generating step can indicate missing capture or a workflow you need to investigate further.`,
      },
      {
        title: 'Use the files flamegraph for cross-session patterns',
        body: `agentpprof's files view weights semantic paths by observed file-effect count. This is useful for questions such as which tasks repeatedly touch external/home paths or which parts of a repository dominate agent activity. The chart is an aggregate projection; return to the underlying sessions before treating a wide category as a problem.`,
      },
      {
        title: 'State the capture boundary next to any absence claim',
        body: `File monitoring depends on the selected process family, privilege, platform, and current probes. A missing path event is not proof that the path was never accessed. If the conclusion depends on absence, reproduce with a smaller task, verify the process was inside the recording scope, and use another source such as the application trace or filesystem audit mechanism when necessary.`,
      },
    ],
    command: [
      'sudo agentsight record -- codex',
      'agentsight report audit --json',
      'agentpprof --view files -o files.svg',
    ],
    sources: [
      { label: 'AgentSight v1.0.3 README and audit workflow', href: agentsightReadme },
      { label: 'agentpprof files view and file-effect examples', href: agentpprof },
      { label: 'Review AI-generated pull requests', href: '/use-cases/review-ai-generated-prs/' },
    ],
  },
};

const directReplacements: Array<[RegExp, string]> = [
  [/Export evidence that another engineer can inspect\./gi, 'Export a shareable run report.'],
  [/Review AI-generated pull requests with run evidence/gi, 'Review AI-generated pull requests with execution history'],
  [/Treat the trace as review evidence/gi, 'Use the trace during code review'],
  [/Each answer should point to recorded evidence\./gi, 'Each answer should point to a recorded command, path, process, or network event.'],
  [/Compare agents through a shared evidence model/gi, 'Compare agents through the same process, file, and network views.'],
  [/Review evidence, not just alerts/gi, 'Review recorded activity, not just alerts'],
  [/requires evidence about/gi, 'requires details about'],
  [/agent-specific system evidence/gi, 'agent-specific system activity'],
  [/add evidence that normal instrumentation misses/gi, 'add local activity that normal instrumentation misses'],
  [/AgentSight evidence from the local agent process/gi, 'AgentSight activity from the local agent process'],
  [/System evidence fills a different gap/gi, 'Local system activity covers a different gap'],
  [/closed-source and system-effect evidence/gi, 'closed-source and system-activity visibility'],
  [/is a different kind of evidence/gi, 'is a different kind of runtime data'],
  [/Export only the evidence needed for review\./gi, 'Export only the run details needed for review.'],
  [/Each view projects the same session evidence differently\./gi, 'Each view groups the same recorded sessions differently.'],
  [/system evidence shows/gi, 'system activity shows'],
  [/Process and file evidence says/gi, 'Process and file activity shows'],
  [/System evidence does not replace application context/gi, 'System activity does not replace application context'],
  [/Raw traces are evidence stores/gi, 'Raw traces are data sources'],
  [/return to the original evidence/gi, 'return to the original trace'],
  [/Export evidence for code review\./gi, 'Export a run report for code review.'],
  [/This keeps the evidence easier to attribute/gi, 'This keeps the recorded activity easier to attribute'],
  [/Compare effects through one evidence model/gi, 'Compare agents through the same process, file, and network views.'],
  [/Use evidence for debugging and review/gi, 'Use the run profile for debugging and review'],
  [/Export evidence for review\./gi, 'Export a run report for review.'],
  [/test and file evidence/gi, 'test and file activity'],
  [/run evidence/gi, 'execution history'],
  [/review evidence/gi, 'recorded activity'],
  [/system evidence/gi, 'system activity'],
  [/source evidence/gi, 'source data'],
  [/process and file evidence/gi, 'process and file activity'],
  [/recorded evidence/gi, 'recorded activity'],
  [/missing evidence/gi, 'missing data'],
  [/evidence gaps/gi, 'missing data'],
  [/evidence gap/gi, 'visibility gap'],
  [/evidence model/gi, 'process, file, and network views'],
  [/evidence stores/gi, 'data sources'],
  [/evidence workflow/gi, 'review workflow'],
  [/evidence artifact/gi, 'run report'],
  [/evidence boundary/gi, 'capture scope'],
  [/evidence about/gi, 'details about'],
  [/evidence that/gi, 'recorded data that'],
  [/evidence for/gi, 'run details for'],
  [/evidence from/gi, 'activity from'],
];

function rewriteText(text: string) {
  let result = text;
  for (const [pattern, replacement] of directReplacements) {
    result = result.replace(pattern, replacement);
  }
  return result.replace(/\bevidence\b/gi, (match) =>
    match[0] === match[0].toUpperCase() ? 'Recorded data' : 'recorded data',
  );
}

function mergeUpgrade(page: ContentPage): ContentPage {
  const upgrade = pageUpgrades[`${page.kind}:${page.slug}`];
  return upgrade ? { ...page, ...upgrade } : page;
}

export function publicPage(page: ContentPage): ContentPage {
  const upgraded = mergeUpgrade(page);
  return {
    ...upgraded,
    title: rewriteText(upgraded.title),
    description: rewriteText(upgraded.description),
    eyebrow: rewriteText(upgraded.eyebrow),
    lede: rewriteText(upgraded.lede),
    outcomes: upgraded.outcomes.map(rewriteText),
    sections: upgraded.sections.map((section) => ({
      title: rewriteText(section.title),
      body: rewriteText(section.body),
    })),
    related: upgraded.related.map((item) => ({ ...item, label: rewriteText(item.label) })),
  };
}

export function getPages(kind: ContentKind) {
  const pages = getSourcePages(kind).map(publicPage);
  return kind === 'blog' ? [...pages, publicPage(tlsTracingDeepDive)] : pages;
}

export function getPage(kind: ContentKind, slug: string) {
  if (kind === 'blog' && slug === tlsTracingDeepDive.slug) return publicPage(tlsTracingDeepDive);
  const page = getSourcePage(kind, slug);
  return page ? publicPage(page) : undefined;
}
