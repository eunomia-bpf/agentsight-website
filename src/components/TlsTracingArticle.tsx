import { ContentDetail } from './ContentPages';
import type { ContentPage } from '@/lib/content';

const productCommit = 'bb99b66f8f98e4b9f8b1769a3da0a8fbbe26b6c3';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;

export const tlsTracingPage: ContentPage = {
  kind: 'blog',
  slug: 'why-ai-agent-tls-traffic-is-hard-to-trace',
  title: 'Why AI agent TLS traffic is hard to trace',
  description:
    'A source-level guide to finding the real plaintext boundary across shared OpenSSL, Node.js, stripped Bun/BoringSSL, rustls, containers, Electron agents, browsers, and local MCP.',
  eyebrow: 'Systems deep dive · refreshed September 2026 · AgentSight v1.0.31',
  lede:
    'An empty TLS trace does not immediately mean that eBPF failed. Modern agent software can put plaintext in a shared library, a statically linked runtime, a stripped BoringSSL or rustls function, a helper process, a container descendant, or a protocol path that is not TLS at all. The useful diagnostic is to separate attachment, plaintext capture, and application parsing, then choose the boundary that actually exists in the running program.',
  outcomes: [
    'Separate a wrong probe target from a missing plaintext hook and a parser mismatch.',
    'Choose the right capture path for Node, Bun/BoringSSL, rustls, containers, browsers, and local MCP.',
    'Know when AgentSight native session evidence is more reliable than forcing a TLS path.',
  ],
  sections: [
    {
      title: 'Start with three different failure classes',
      body: '“No model calls appeared” compresses several different failures into one symptom. Attachment can be wrong because the visible command is a wrapper, the TLS implementation lives in another executable, or the network work happens in a helper process. Plaintext capture can be wrong because the runtime uses stripped BoringSSL or rustls instead of an exported OpenSSL ABI. Parsing can be wrong even after bytes were captured because the application protocol is not the JSON request shape AgentSight reconstructs as an LLM event. AgentSight v1.0.31 makes these distinctions visible in its supported-agent documentation; diagnosing them separately avoids treating every empty timeline as an eBPF problem.',
    },
    {
      title: 'Resolve the command to the executable that actually owns TLS',
      body: 'Linux uprobes attach to a user-space object by path and function or file offset, so executable identity is part of the measurement. AgentSight record resolves the command through PATH, follows symlinks, and chases shebang interpreters. That matters for JavaScript CLIs because the file a user invokes may only be a launcher while the OpenSSL implementation lives in the Node executable. Under sudo, record also looks up the invoking user and preserves user-local locations such as ~/.local/bin, ~/bin, and ~/.nvm. The first evidence to collect is therefore the resolved executable and its linkage, not just the process name or remote socket.',
    },
    {
      title: 'Node.js is an embedded-OpenSSL case, not a normal libssl.so case',
      body: 'AgentSight v1.0.31 documents Node.js, including common NVM and system installs, as statically linking OpenSSL into the node binary. A tracer that only searches for a mapped system libssl.so can therefore be attached correctly to the process and still miss the plaintext API. record -- <command> discovers the interpreter from wrappers automatically, and record -c node now has a Node-specific auto-discovery path; --binary-path remains the escape hatch when several Node installations exist and the automatic choice is not the one executing the agent. An HTTP CONNECT proxy does not change this boundary: TLS still encrypts and decrypts inside Node before the tunnel carries the ciphertext.',
    },
    {
      title: 'Stripped Bun/BoringSSL needs a validated binary fingerprint',
      body: 'Claude Code is harder because its Bun-based executable statically links BoringSSL and strips the useful SSL symbols. The current sslsniff implementation first tries symbol resolution and then falls back to byte-pattern detection when a binary path is supplied. Its Bun compatibility path still validates known relative placement from the supported Bun 1.3.x build family, including the 0x6f0 read-to-handshake and 0xca0 write-to-read deltas, rather than trusting a short byte match alone. Those offsets are compiler-output fingerprints, not an ABI. A new Bun, BoringSSL, compiler, architecture, or optimization profile can invalidate them, so verbose detection failure should be treated as a compatibility signal instead of silently reusing an old offset.',
    },
    {
      title: 'rustls requires a different plaintext function entirely',
      body: 'A rustls client has no reason to call SSL_write. AgentSight v1.0.31 keeps a separate stripped-binary detector for rustls plaintext paths: the current codex_offsets.h scans for rustls 0.23 PlaintextSink write and write_vectored instruction sequences and validates stable surrounding instruction blocks where compiler branch displacements can vary. It also contains a separate validated CommonState::buffer_plaintext pattern for supported Grok binaries. This is the broader rule for TLS tracing: identify the runtime-specific plaintext API first. Searching harder for OpenSSL symbols does not fix a client whose TLS stack is not OpenSSL.',
    },
    {
      title: 'The process or thread name can still hide a correct hook',
      body: 'Binary identity is not the same thing as execution identity. AgentSight documents that Claude Code TLS calls run on an internal “HTTP Client” thread rather than the main claude thread. sslsniff command filtering uses bpf_get_current_comm(), which is the current thread name, so a -c claude filter can remove the traffic even when the uprobe offset is correct. When record is given an explicit binary path for this case, it avoids applying the command filter to SSL monitoring while retaining process filtering where useful. A clean attach plus zero events should therefore trigger a thread/filter check before the hook point is discarded.',
    },
    {
      title: 'Electron agents show why capture success and LLM-event success are different',
      body: 'Cursor, Antigravity, and Windsurf expose a different three-part boundary in the v1.0.31 agent guide. First, most desktop installs run on macOS or Windows, where AgentSight’s Linux eBPF capture path cannot attach. Second, Electron can place BoringSSL in a large stripped framework binary and perform networking in a helper process rather than the small application launcher. Third, even a correctly captured stream may use a protocol that the LLM parser does not understand. The current Cursor example uses Connect over HTTP/2 with protobuf bodies: AgentSight can handle HTTP/2 framing, but its LLM reconstruction recognizes JSON-shaped model calls, so the timeline can remain empty after transport capture succeeds. That is a parser-boundary failure, not proof that no network traffic was captured.',
    },
    {
      title: 'For Cursor, native session files are the supported evidence path',
      body: 'Because forcing TLS capture through Electron does not solve the platform, attach, and protobuf boundaries together, AgentSight supports Cursor through its local session path instead. top, report --local, and vis read Cursor transcripts and state metadata without eBPF or sudo. Those records can provide prompts, assistant output, tool calls, file activity, timestamps, and session context, but they do not become raw live request/response bodies. Current Cursor versions also often lack local per-turn token usage. The important operational decision is to use the source that can answer the question rather than treating TLS interception as the only legitimate form of observability.',
    },
    {
      title: 'Containers and Kubernetes add runtime-to-host executable resolution',
      body: 'Container metadata frequently points at an init process such as tini instead of the runtime that owns TLS. With docker://, AgentSight walks descendants from the container process tree and chooses a process whose executable contains the relevant SSL implementation. The k8s:// path extends that resolution: it reads the selected Pod container ID, resolves the container through Docker or CRI tooling to a host PID, then scans the container process tree. Supported forms include k8s://pod, k8s://namespace/pod, and k8s://namespace/pod/container. The measurement still ends at a concrete host executable and uprobe offset; the container reference is a resolver for reaching it, not a new tracing primitive.',
    },
    {
      title: 'Browsers and local MCP are separate capture paths',
      body: 'Two common agent-adjacent cases should not be forced through sslsniff. AgentSight’s BPF tools use browsertrace for browser-specific plaintext capture in Chrome/Chromium and Firefox, because browser packaging and TLS boundaries differ from ordinary CLI processes. Local MCP over stdio is not TLS traffic at all; the current stdiocap tool captures read/write payloads from the target process and can expand from stdin/stdout/stderr to all file descriptors. If an MCP server communicates locally through pipes, an empty TLS trace is the expected result. The protocol transport determines the capture boundary.',
    },
    {
      title: 'Use a binary-first diagnostic sequence',
      body: 'For a reproducible diagnosis, first resolve the user-facing command to its real executable, including symlinks and shebangs. Inspect the binary type and dynamic dependencies. If a shared libssl with exported SSL_read/SSL_write exists, shared-library uprobes are the simplest case. If Node embeds OpenSSL, target the node executable. If a stripped Bun binary is involved, run verbose binary-path detection and require the BoringSSL fingerprint to validate. If rustls markers are present, inspect the rustls-specific path rather than OpenSSL symbols. In a container or Pod, resolve the descendant executable on the host. If the stream is captured but AgentSight still emits no model events, inspect the application protocol and parser expectations. If the communication is browser-specific or stdio, switch capture tools instead of adding more TLS probes.',
    },
    {
      title: 'Plaintext capture is both sensitive and bounded',
      body: 'A pre-encryption hook can expose prompts, completions, authorization headers, tool payloads, model identifiers, and other application content that packet capture cannot read. Treat that output as sensitive development telemetry. The sslsniff event buffer is bounded, oversized reads can be marked truncated, and higher-level HTTP or streaming reconstruction happens after byte capture. A uprobe event proves that some plaintext crossed the selected function; it does not prove complete request semantics, complete session coverage, or absence of traffic through another runtime path. Negative claims should stay scoped to the exact binary, filters, hook, and parser that were verified.',
    },
    {
      title: 'The portable abstraction is a resolver plus evidence boundaries',
      body: 'The durable design is not “attach SSL_read everywhere.” A useful agent tracer needs a resolver that maps the command to the runtime, identifies shared versus embedded TLS, recognizes the TLS implementation, survives wrappers and containers, selects a plaintext function, validates version-sensitive fingerprints, and then hands captured bytes to a protocol parser. It also needs to know when a different evidence source is better: native session files for Cursor, browsertrace for browsers, stdiocap for local MCP, or system/process evidence when payload reconstruction is unnecessary. eBPF is the attachment mechanism for several of these paths; compatibility and evidence selection are the layer above it.',
    },
  ],
  command: [
    'command -v <agent> && readlink -f "$(command -v <agent>)"',
    'file <resolved-binary>',
    "ldd <resolved-binary> | grep -E 'ssl|crypto' || true",
    "nm -D <resolved-binary> 2>/dev/null | grep -E 'SSL_(read|write)' || true",
    'sudo agentsight record -- <agent-command>',
    'sudo agentsight debug ssl --binary-path <resolved-binary> --verbose',
    'sudo agentsight record --binary-path docker://<container> -c node',
    'sudo agentsight record --binary-path k8s://<namespace>/<pod>/<container> -c node',
  ],
  sources: [
    {
      label: 'AgentSight v1.0.31 supported-agent, runtime, container, browser, and MCP capture notes',
      href: `${productSource}/docs/agents.md`,
    },
    {
      label: 'AgentSight v1.0.31 sslsniff implementation and BoringSSL fallback',
      href: `${productSource}/bpf/sslsniff.c`,
    },
    {
      label: 'AgentSight v1.0.31 eBPF tool reference for sslsniff and stdiocap',
      href: `${productSource}/bpf/README.md`,
    },
    {
      label: 'AgentSight v1.0.31 stripped rustls plaintext offset detection',
      href: `${productSource}/bpf/codex_offsets.h`,
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
    { label: 'When AgentSight works without eBPF', href: '/blog/when-agentsight-works-without-ebpf/' },
    { label: 'Discover local agent sessions', href: '/blog/how-agentsight-discovers-local-agent-sessions/' },
    { label: 'Trace closed-source agent CLIs', href: '/use-cases/trace-closed-source-agent-clis/' },
    { label: 'Observe agent sessions in Docker', href: '/blog/observe-ai-agent-sessions-in-docker/' },
  ],
};

export function TlsTracingArticle() {
  return <ContentDetail page={tlsTracingPage} />;
}
