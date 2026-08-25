import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, JsonLd } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

const productCommit = '934f441eff8ca210807333633f47b2efcb8cd020';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;
const articlePath = '/blog/observe-ai-agent-sessions-in-docker/';

export const metadata: Metadata = {
  title: 'How AgentSight observes AI agent sessions inside Docker',
  description:
    'A source-level guide to AgentSight Docker-backed native sessions: docker exec bridging, credential locality, session routing, fail-closed collisions, bounded JSONL, and the Docker socket trust boundary.',
  alternates: { canonical: articlePath },
  openGraph: {
    type: 'article',
    title: 'How AgentSight observes AI agent sessions inside Docker',
    description:
      'Trace the exact host/container boundary behind agentsight bind --docker-container, including what stays inside the container and what authority remains on the Docker host.',
    url: articlePath,
  },
};

const sources = [
  [
    'AgentSight v1.0.30 usage guide: Docker-backed session contract and operator boundary',
    `${productSource}/docs/usage.md`,
  ],
  [
    'AgentSight v1.0.30 container bridge: JSONL protocol, limits, fan-out, routing, and docker exec setup',
    `${productSource}/collector/src/server/container_bridge.rs`,
  ],
  [
    'AgentSight v1.0.30 bind command: Docker source configuration and saved-capture exclusion',
    `${productSource}/collector/src/cmd_bind.rs`,
  ],
  [
    'AgentSight product PR #195: implementation and validation record for Docker-backed native sessions',
    'https://github.com/eunomia-bpf/agentsight/pull/195',
  ],
  [
    'Docker documentation: docker exec behavior, user, workdir, and environment options',
    'https://docs.docker.com/reference/cli/docker/container/exec/',
  ],
  [
    'Docker documentation: daemon attack surface and control-socket authority',
    'https://docs.docker.com/engine/security/',
  ],
] as const;

const cell = { border: '1px solid #d8dee8', padding: '0.75rem', verticalAlign: 'top' as const };
const header = { ...cell, background: '#f4f7fa', fontWeight: 700 };

export default function DockerAgentSessionsArticle() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How AgentSight observes AI agent sessions inside Docker',
    description: metadata.description,
    url: `${site.url}${articlePath}`,
    datePublished: '2026-08-25',
    dateModified: '2026-08-25',
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
            <span aria-current="page">Docker agent sessions</span>
          </nav>
          <Eyebrow>Container session architecture · AgentSight v1.0.30 · 25 August 2026</Eyebrow>
          <h1>How AgentSight observes AI agent sessions inside Docker</h1>
          <p className="hero-lede">
            A development container often holds the agent&apos;s real session files, provider CLI state, and credentials,
            while the AgentSight UI runs from the host. AgentSight v1.0.30 bridges that boundary by executing the same
            AgentSight session runtime <strong>inside the named container</strong> and carrying bounded session operations
            over a private JSONL pipe. The design keeps provider state in the container, but it does not turn Docker
            control into a least-privilege API: access to the Docker daemon remains a separate host-level trust decision.
          </p>
        </div>
      </section>

      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <section>
              <h2>The short answer: move the session parser to the data, not the credentials to the host</h2>
              <p>
                The common container problem is simple to state. Claude Code, Codex, Gemini CLI, or Cursor may run in a
                dev container, so their native history and provider state live under that container&apos;s home directory.
                A host-side AgentSight Node cannot safely assume those files exist on the host, and copying provider
                credentials outward just to make a dashboard work would create a new secret-management path.
              </p>
              <p>
                <code>agentsight bind --docker-container NAME</code> takes a different approach. The host launches
                <code>agentsight bridge</code> with <code>docker exec -i</code> inside the selected running container. The
                bridge calls the existing native-session discovery and provider-message runtime there, then sends only
                structured list, get, and message results back to the host. The host merges those sessions into the same
                Node snapshot and session APIs used for local agent history.
              </p>
              <pre><code>{`# AgentSight must be available in both environments.
# Run the Node on the host and include one named container:
agentsight bind --docker-container ebpfos-dev

# More than one container is explicit and repeatable:
agentsight bind \\
  --docker-container frontend-dev \\
  --docker-container backend-dev`}</code></pre>
            </section>

            <section>
              <h2>The protocol has only three operations</h2>
              <p>
                The current bridge protocol is intentionally small. Its Rust enum has three methods:
                <code> sessions/list</code>, <code>session/get</code>, and <code>session/message</code>. List returns native
                agent sessions discovered in the container. Get resolves one exact session. Message resumes a supported
                provider session through the same runtime AgentSight uses locally. There is no separate Claude-specific,
                Codex-specific, or Gemini-specific Docker RPC layer.
              </p>
              <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px', fontSize: '0.92rem' }}>
                  <thead>
                    <tr>
                      <th style={header}>Bridge method</th>
                      <th style={header}>Runs inside the container</th>
                      <th style={header}>Host receives</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={cell}><code>sessions/list</code></td>
                      <td style={cell}>Normal AgentSight native-session discovery</td>
                      <td style={cell}>Bounded session metadata for the Node overview</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>session/get</code></td>
                      <td style={cell}>Exact native-session lookup</td>
                      <td style={cell}>One parsed session or a not-found/conflict/failure result</td>
                    </tr>
                    <tr>
                      <td style={cell}><code>session/message</code></td>
                      <td style={cell}>Existing provider resume/message runtime</td>
                      <td style={cell}>Submission result and transport identity</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                This boundary matters for maintenance. Adding a provider to AgentSight&apos;s native-session runtime can make
                its sessions discoverable through the container bridge without inventing another Docker-specific parser.
                As of v1.0.30, the product documentation lists Claude Code, Codex, Gemini CLI, and Cursor discovery;
                resumable messaging covers Claude Code, Codex, and Gemini CLI, while Cursor remains observation-only.
              </p>
            </section>

            <section>
              <h2>Provider credentials stay in the container, but session content still crosses the pipe</h2>
              <p>
                The bridge source states its goal directly: manage sessions in a Docker container without copying provider
                credentials to the host. Provider authentication remains where the provider CLI expects it, and the host
                does not need a second Claude, Codex, or Gemini credential store for this path. The protocol itself carries
                parsed session records and user-submitted continuation messages rather than provider login material.
              </p>
              <p>
                Credential locality is narrower than data locality. Session records can contain prompts, responses, model
                metadata, tool calls, paths, and other development evidence, and those parsed records are intentionally
                returned to the host Node so the browser can inspect them. Treat the host Node and browser access key as
                part of the trust path. “Credentials stay in the container” is a useful architecture property; it is not a
                claim that container session contents never leave the container.
              </p>
            </section>

            <section>
              <h2>The host reconstructs the container execution identity before starting the bridge</h2>
              <p>
                A dev container frequently runs its main process as root while the developer&apos;s agent state belongs to a
                non-root account such as <code>vscode</code>. Starting the bridge blindly as the image default user can
                therefore discover the wrong home directory or create files with the wrong ownership. AgentSight inspects
                the container and derives the bridge user, workdir, and home before it starts <code>docker exec</code>.
              </p>
              <p>
                The preferred inputs are <code>com.agentsight.user</code>, <code>com.agentsight.workspace</code>, and
                <code>com.agentsight.home</code> labels. Without those labels, the implementation falls back to the image
                configuration, absolute <code>HOME</code>, passwd data, or path ownership. Container paths are required to
                be absolute and normalized; parent-directory components are rejected. The resulting command uses Docker&apos;s
                normal <code>--user</code>, <code>--workdir</code>, and <code>--env HOME=...</code> exec options.
              </p>
            </section>

            <section>
              <h2>Bounded JSONL turns a long-lived exec process into a controlled transport</h2>
              <p>
                The implementation keeps one bridge process per configured container and exchanges newline-delimited JSON
                over its stdin/stdout. Several hard bounds keep this from becoming an unbounded in-process relay: a bridge
                frame is capped at 8 MiB, a bridge operation at 30 seconds, lock acquisition at one second, and Docker
                inspection/lookup commands at 10 seconds. A submitted message must contain 1 through 65,536 bytes.
              </p>
              <p>
                These constants are implementation limits rather than provider limits. They make failures explicit and
                give the host a way to discard a broken bridge process after a failed or timed-out operation. If a future
                release changes them, the version-pinned source remains the right contract for a reproducible audit.
              </p>
            </section>

            <section>
              <h2>Multi-container lookup deliberately prefers an error over an arbitrary session</h2>
              <p>
                Once more than one container is configured, a short session identifier is no longer globally unique by
                assumption. AgentSight fans out lookup across the configured bridges. If the same session ID appears in
                more than one container, the request returns a conflict. More subtly, exact lookup also fails when one peer
                is unavailable even if another peer returned a match. The helper that combines results treats any peer
                error as an error instead of silently accepting the first successful answer.
              </p>
              <p>
                That behavior is useful for provenance. A UI that guessed “first match wins” could resume the wrong coding
                agent after a container clone, restored workspace, or ID collision. Fail-closed lookup forces the operator
                to repair the ambiguous or unavailable source before a message is routed. After a session has been resolved,
                the message API includes the selected container and requires that container to remain configured.
              </p>
            </section>

            <section>
              <h2>A saved SQLite capture and a live Docker source are intentionally different modes</h2>
              <p>
                <code>agentsight bind --db capture.db</code> opens a saved, read-only capture. Docker-backed native sessions
                are live external sources that can support provider resume. The bind command rejects combining
                <code>--db</code> with <code>--docker-container</code> instead of presenting a mixed surface where some
                sessions are immutable artifacts and others accept messages. This keeps the session source model legible
                to both the operator and the UI.
              </p>
            </section>

            <section>
              <h2>For resumed Codex, the named container becomes the external sandbox boundary</h2>
              <p>
                The product documentation calls out one provider-specific consequence. When a Codex session is resumed
                through the Docker bridge, AgentSight treats the named container as the external sandbox boundary and
                disables Codex&apos;s nested command sandbox and interactive approvals for that turn. This avoids nested
                user-namespace failures common in locked-down development containers.
              </p>
              <p>
                The operational consequence is direct: configure only containers whose filesystem and network authority
                are acceptable for the resumed agent. The container is doing real security work in that path. Local
                non-container sessions keep their existing defaults, so this is a boundary attached to the Docker-backed
                resume mode rather than a global Codex setting.
              </p>
            </section>

            <section>
              <h2>The named-container flag narrows AgentSight behavior, not Docker authority</h2>
              <p>
                The most important security distinction sits one layer below AgentSight. The host bridge controls Docker
                through the Docker CLI and daemon. Docker&apos;s own security documentation warns that users or credentials
                able to control the daemon can effectively obtain root-level authority on a conventional host. Docker
                group membership and daemon credentials should therefore be protected like administrative access.
              </p>
              <p>
                Passing <code>--docker-container ebpfos-dev</code> tells AgentSight which container it is allowed to inspect
                and exec into; input validation also prevents names such as Docker options or path-like values from being
                interpreted as command-line control. That application-level allowlist does not reduce the underlying
                permissions already granted to the Docker client. If the host needs a narrower control plane, the product
                guide recommends a rootless per-user daemon or an allowlisting broker/socket proxy that exposes only the
                required inspect and exec operations.
              </p>
            </section>

            <section>
              <h2>Use this path for native agent history, not as a replacement for container system tracing</h2>
              <p>
                Docker-backed <code>bind</code> imports the agent&apos;s native session view. It answers questions such as
                which Claude/Codex/Gemini/Cursor sessions exist in the container, what their recorded conversation and
                tool history says, and whether a supported session can be resumed. It does not turn that native transcript
                into an independent record of every process, file, packet, or kernel event inside the container.
              </p>
              <p>
                When the question is “what did the agent actually execute at the system boundary?”, use AgentSight&apos;s
                Linux <code>record</code> and tracing paths with the appropriate container/process scope. When the question
                is “show me the existing session state inside my dev container in the hosted UI without moving provider
                credentials to the host”, the Docker-backed bind bridge is the purpose-built path.
              </p>
            </section>

            <section>
              <h2>A practical deployment checklist</h2>
              <p>
                Keep the host and container AgentSight binaries on the same version. Install AgentSight in the running
                container, verify the intended developer user and home, then start the host Node with one explicit
                <code>--docker-container</code> per source. Confirm that duplicate session IDs return conflict rather than
                silently routing. If messaging is enabled, test it first on a bounded disposable task and verify which
                provider supports resume. Finally, review Docker socket access separately from AgentSight configuration;
                the two controls solve different problems.
              </p>
              <pre><code>{`# Inside the container
agentsight --version

# On the host
agentsight --version
docker inspect ebpfos-dev
agentsight bind --docker-container ebpfos-dev

# For a stricter host boundary, evaluate rootless Docker or an allowlisted broker
# before exposing daemon access to another service or user.`}</code></pre>
            </section>

            <section>
              <h2>Source table and scope</h2>
              <p>
                This article is pinned to AgentSight v1.0.30 commit <code>{productCommit}</code>. Product behavior can move
                after this version, so source links below are fixed to the reviewed tree where possible. Docker behavior
                is described from Docker&apos;s own command and security documentation rather than inferred from AgentSight.
              </p>
              <ul>
                {sources.map(([label, href]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
              <p>
                For the broader Node trust model, continue with <Link href="/architecture/">AgentSight architecture</Link>
                {' '}and <Link href="/security/">security and data handling</Link>. For retrospective codebase activity
                from existing native sessions, see the <Link href="/blog/replay-coding-agent-repository-changes/">repository replay method</Link>.
              </p>
            </section>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
