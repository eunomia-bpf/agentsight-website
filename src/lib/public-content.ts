import {
  contentPath,
  getPage as getSourcePage,
  getPages as getSourcePages,
  type ContentKind,
  type ContentPage,
} from './content';

export { contentPath };
export type { ContentKind, ContentPage };

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
    {
      label: 'AgentSight v1.0.3 supported-agent and binary-discovery notes',
      href: 'https://github.com/eunomia-bpf/agentsight/blob/07a83a32257b8c8dcba911bd9db23f77e71dc085/docs/agents.md',
    },
    {
      label: 'AgentSight v1.0.3 sslsniff BoringSSL and uprobe implementation',
      href: 'https://github.com/eunomia-bpf/agentsight/blob/07a83a32257b8c8dcba911bd9db23f77e71dc085/bpf/sslsniff.c',
    },
    {
      label: 'AgentSight v1.0.3 rustls stripped-binary offset detection',
      href: 'https://github.com/eunomia-bpf/agentsight/blob/07a83a32257b8c8dcba911bd9db23f77e71dc085/bpf/codex_offsets.h',
    },
    {
      label: 'Linux kernel uprobe tracer: path and offset attachment model',
      href: 'https://docs.kernel.org/trace/uprobetracer.html',
    },
    {
      label: 'Node.js documentation: libraries included with Node.js',
      href: 'https://nodejs.org/api/addons.html#linking-to-libraries-included-with-nodejs',
    },
    {
      label: 'Bun API reference: BoringSSL-backed TLS implementation',
      href: 'https://bun.sh/reference/bun',
    },
    {
      label: 'rustls Writer documentation: plaintext before TLS records',
      href: 'https://docs.rs/rustls/latest/rustls/struct.Writer.html',
    },
  ],
  related: [
    { label: 'System-boundary observability', href: '/blog/system-boundary-observability/' },
    { label: 'Trace closed-source agent CLIs', href: '/use-cases/trace-closed-source-agent-clis/' },
    { label: 'Claude Code integration', href: '/integrations/claude-code/' },
  ],
};

const directReplacements: Array<[RegExp, string]> = [
  [/Export evidence that another engineer can inspect\./gi, 'Export a shareable run report.'],
  [/Review AI-generated pull requests with run evidence/gi, 'Review AI-generated pull requests with execution history'],
  [/Treat the trace as review evidence/gi, 'Use the trace during code review'],
  [/Each answer should point to recorded evidence\./gi, 'Each answer should point to a recorded command, path, process, or network event.'],
  [/Compare agents through a shared evidence model\./gi, 'Compare agents through the same process, file, and network views.'],
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
  [/Compare effects through one evidence model\./gi, 'Compare agents through the same process, file, and network views.'],
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

export function publicPage(page: ContentPage): ContentPage {
  return {
    ...page,
    title: rewriteText(page.title),
    description: rewriteText(page.description),
    eyebrow: rewriteText(page.eyebrow),
    lede: rewriteText(page.lede),
    outcomes: page.outcomes.map(rewriteText),
    sections: page.sections.map((section) => ({
      title: rewriteText(section.title),
      body: rewriteText(section.body),
    })),
    related: page.related.map((item) => ({ ...item, label: rewriteText(item.label) })),
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
