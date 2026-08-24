import type { Metadata } from 'next';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { productCommit, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Architecture',
  description:
    `How AgentSight v${site.version} separates native capture, bounded WebAssembly Components, Node-local runtime data, Docker-backed session sources, Direct access, Controller coordination, and browser-side fleet aggregation.`,
  alternates: { canonical: '/architecture/' },
};

const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;

const planes = [
  ['Node data plane', 'The AgentSight Node captures, stores, and serves detailed runtime data. Sessions, snapshots, prompts, process activity, source-reported usage metadata, and other detailed records remain authoritative on the Node.'],
  ['Controller coordination plane', 'Controller handles identity, organizations, memberships, plan and entitlement metadata, Node discovery, relay presence, optional encrypted Direct configuration, and authorization decisions. It is not the authoritative telemetry store.'],
  ['Client and presentation plane', 'The hosted app, local UI, and CLI reach Nodes locally, through Direct, or through Controller relay. The browser can aggregate bounded Node overviews without persisting that fleet snapshot in Controller.'],
] as const;

const extensionBoundaries = [
  ['Native capture substrate', 'agentsight-capture keeps platform capture such as eBPF, /proc, SSL, stdio, and system runners. Identity/capability enforcement and transport also remain native host responsibilities.'],
  ['Composable product extensions', 'The canonical ext/ tree now owns session parsing, analysis, semantic pprof, repository visualization, and web presentation boundaries without copying their algorithms into a new abstraction.'],
  ['One shipped Wasm Component today', 'Only ext/session currently exports and executes a wasm32-wasip2 Component. Analysis, pprof, vis, and web remain native or build-time boundaries in the current release.'],
] as const;

const modes = [
  ['01', 'Local', 'Run and query AgentSight on one machine. Local capture and saved-session analysis do not require Controller.'],
  ['02', 'Direct', 'A browser reaches a Node by an explicit HTTP(S) endpoint. Direct remains usable without Controller relay and is preferred when a saved Direct path is available.'],
  ['03', 'Controller-managed', 'Controller adds OAuth identity, organization-scoped discovery, plan state, relay connectivity, roles, and authorization before managed remote operations.'],
] as const;

const roles = [
  ['Viewer', 'Inspect organization metadata, Nodes, runtime data, sessions, configuration, and billing state.'],
  ['Operator', 'Viewer permissions plus the ability to send session messages.'],
  ['Admin', 'Operator permissions plus Node, member, and organization-configuration management.'],
  ['Owner', 'Admin permissions plus organization and billing management.'],
] as const;

const capabilities = [
  ['node.info', 'Read Node identity and protocol information.'],
  ['evidence.read', 'Read the Node snapshot/runtime surface.'],
  ['session.read', 'Read a session, optionally restricted to one session identifier.'],
  ['session.message', 'Send a message to a session, optionally restricted to one session identifier.'],
] as const;

const runtimeLimits = [
  ['64 MiB', 'Default Component memory limit'],
  ['10 million', 'Default execution fuel'],
  ['16 MiB', 'Maximum Component binary and transcript content size'],
  ['64 KiB', 'Maximum combined session metadata size'],
] as const;

const sources = [
  [`AgentSight v${site.version} Controller architecture and authorization model`, `${productSource}/controller/README.md`],
  [`AgentSight v${site.version} extension boundary`, `${productSource}/ext/README.md`],
  [`AgentSight v${site.version} bounded Component runtime`, `${productSource}/ext/runtime/src/lib.rs`],
  [`AgentSight v${site.version} Node capability implementation`, `${productSource}/collector/src/server/capability.rs`],
  [`AgentSight v${site.version} Direct connection implementation`, `${productSource}/frontend/src/lib/connection.ts`],
  [`AgentSight v${site.version} fleet aggregation implementation`, `${productSource}/frontend/src/lib/fleetData.ts`],
  [`AgentSight v${site.version} Docker session bridge implementation`, `${productSource}/collector/src/server/container_bridge.rs`],
  ['Docker-backed native session discovery and messaging (PR #195)', 'https://github.com/eunomia-bpf/agentsight/pull/195'],
  ['Component boundary and session Wasm runtime (PR #187)', 'https://github.com/eunomia-bpf/agentsight/pull/187'],
  ['Relay reconnect refreshes the running Node version (PR #192)', 'https://github.com/eunomia-bpf/agentsight/pull/192'],
  ['Multi-machine organization overview and browser-memory data boundary (PR #180)', 'https://github.com/eunomia-bpf/agentsight/pull/180'],
  ['Unified frontend and Controller Worker deployment (PR #175)', 'https://github.com/eunomia-bpf/agentsight/pull/175'],
  ['Direct Node access independent of Controller relay (PR #166)', 'https://github.com/eunomia-bpf/agentsight/pull/166'],
] as const;

export default function ArchitecturePage() {
  return (
    <SiteShell>
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Architecture · AgentSight v{site.version}</Eyebrow>
          <h1>Keep capture native, make product features composable, and keep runtime data on Nodes.</h1>
          <p className="hero-lede">
            AgentSight separates the machine-level capture substrate from independently composable product
            features, while keeping detailed runtime data authoritative on Nodes. The current Component Model
            boundary is deliberately narrow: one session parser runs as bounded Wasm today; Direct and Controller
            remain transports and coordination paths to the same Node protocol, and named Docker containers can
            contribute native sessions through a bounded Node-local bridge.
          </p>
          <div className="hero-actions">
            <a className="button button-accent" href={site.demo}>Open AgentSight</a>
            <a className="button button-outline" href="/pricing/">See plans and roles</a>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <div className="section-heading">
            <div><Eyebrow>The data boundary</Eyebrow><h2>Three planes, with Nodes authoritative for detailed runtime data.</h2></div>
            <p>
              This page describes the released v{site.version} implementation at <code>{productCommit.slice(0, 12)}</code>.
              It distinguishes shipped behavior from design ideas and explicit follow-up work in the repository.
            </p>
          </div>
          <div className="card-grid">
            {planes.map(([title, description], index) => (
              <article className="content-card" key={title}><p className="card-label">0{index + 1}</p><h2>{title}</h2><p>{description}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div><Eyebrow>Extension boundary</Eyebrow><h2>Composable does not mean that the capture substrate moved into plugins.</h2></div>
            <p>
              v1.0.23 reorganized independently composable product functionality under <code>ext/</code> while
              preserving the existing capture and protocol contracts. The distinction is architectural: platform
              capture stays native, while higher-level functionality gets an explicit boundary that can be native,
              build-time, frontend, or a WebAssembly Component depending on the feature.
            </p>
          </div>
          <div className="card-grid">
            {extensionBoundaries.map(([title, description], index) => (
              <article className="content-card" key={title}><p className="card-label">Boundary 0{index + 1}</p><h2>{title}</h2><p>{description}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="dark-section section">
        <div className="shell dark-grid">
          <div>
            <Eyebrow>What actually runs as Wasm?</Eyebrow>
            <h2>One host-supplied transcript enters one bounded session Component.</h2>
            <p>
              The released <code>ext/session</code> parser exports a <code>wasm32-wasip2</code> Component entrypoint.
              Native discovery reads the filesystem and handles Cursor subagent aggregation, then supplies one
              transcript plus bounded metadata to the Component. The production CLI does not dynamically discover
              arbitrary extensions or dispatch extension-defined commands in v{site.version}.
            </p>
            <p>
              The Wasmtime host links WASI Preview 2 for ABI compatibility but gives the default Component no
              inherited arguments, environment, stdio, directories, or network access; TCP and UDP are disabled.
              AgentSight-specific authority would have to arrive through an explicit capability-bearing host
              interface. The current host is for trusted Components shipped with AgentSight, not a user-uploaded
              arbitrary-Wasm execution boundary.
            </p>
          </div>
          <ul className="workflow-list">
            {runtimeLimits.map(([value, description], index) => (
              <li key={description}><span>0{index + 1}</span><div><strong>{value}</strong><p>{description}</p></div></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell split-section">
          <div>
            <Eyebrow>Current limitations</Eyebrow>
            <h2>The Component boundary is real, but a general runtime plugin system is not shipped yet.</h2>
            <p>
              Only session parsing currently crosses the Component Model execution boundary. Analysis,
              <code>pprof</code>, <code>vis</code>, and web presentation have explicit extension directories but
              execute natively or at build time. Dynamic extension discovery, extension-defined CLI commands, and
              opaque Controller-to-Node <code>/ext/*</code> routing are explicitly follow-up work rather than current
              capabilities.
            </p>
            <p>
              Existing Controller relay authorization remains route-specific and fail-closed. Published crate names,
              public <code>agentsight-capture</code> import paths, Node protocol behavior, CLI commands, and binary
              names remain compatible across the refactor.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <p className="card-label">Shipped in v{site.version}</p>
            <p><strong>Wasm</strong></p><p>Single-transcript session parsing through a bounded Component host.</p>
            <p><strong>Not shipped</strong></p><p>Arbitrary uploaded plugins, dynamic command discovery, or generic remote extension routing.</p>
          </div>
        </div>
      </section>

      <section className="dark-section section">
        <div className="shell dark-grid">
          <div>
            <Eyebrow>Current connection paths</Eyebrow>
            <h2>Local, Direct, and Controller-managed access share one Node protocol.</h2>
            <p>
              Direct is not merely a fallback for Controller relay. A browser-reachable Node can be used
              by explicit IP or URL even when relay is unavailable or not deployed. Controller adds
              coordination rather than replacing that path.
            </p>
          </div>
          <ul className="workflow-list">
            {modes.map(([number, title, description]) => <li key={title}><span>{number}</span><div><strong>{title}</strong><p>{description}</p></div></li>)}
          </ul>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell split-section">
          <div>
            <Eyebrow>Direct pairing</Eyebrow>
            <h2>Normal browser access uses a scoped Node capability.</h2>
            <p>
              A Direct binding link carries bootstrap authority long enough to identify the Node and mint
              a scoped capability. The browser stores the returned capability for normal Node requests;
              the persistent bootstrap authority is not used as the ordinary access token. Long-lived
              Direct capabilities are persisted locally by the Node with expiry so a restart does not
              necessarily force immediate re-pairing.
            </p>
            <p>
              Direct configuration stays in the current browser by default. A signed-in user may explicitly
              opt in to save a compact Direct endpoint and bootstrap configuration for another browser.
              Controller stores that optional account copy encrypted; its D1 database does not store the
              plaintext, and the account copy can be removed separately from the local browser capability.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <p className="card-label">Transport order</p>
            <p><strong>1. Saved Direct path</strong></p><p>Use a reachable Node endpoint when one is paired.</p>
            <p><strong>2. Controller relay</strong></p><p>Use relay when that transport is online and the operation is allowed.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell split-section">
          <div>
            <Eyebrow>Docker session sources</Eyebrow>
            <h2>A Node can bridge native agent sessions from named containers without moving provider credentials to the host.</h2>
            <p>
              v1.0.27 added repeatable <code>agentsight bind --docker-container NAME</code> sources. The host Node
              starts AgentSight’s hidden JSONL bridge through <code>docker exec</code> inside each named container and
              reuses the same native discovery, exact-session lookup, and provider messaging paths as local sessions.
              Provider credentials and provider-native state remain inside the container rather than being serialized
              across the bridge.
            </p>
            <p>
              Exact routing is fail-closed: local/container and cross-container session-ID collisions return conflict,
              and if a peer container cannot be checked AgentSight does not guess a destination. The bridge bounds frames,
              operations, locks, and Docker commands. A saved <code>--db</code> source cannot be combined with Docker
              sessions because saved captures are read-only.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <p className="card-label">Trust boundary</p>
            <p><strong>AgentSight scope</strong></p><p>The named-container option constrains which container sources AgentSight uses.</p>
            <p><strong>Docker authority</strong></p><p>Docker socket access is normally daemon-wide and host-root equivalent; the option does not narrow Docker authorization itself.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div><Eyebrow>Controller data boundary</Eyebrow><h2>Controller coordinates access; it does not persist detailed Node payloads.</h2></div>
            <p>
              Controller stores OAuth identity, organizations and memberships, organization configuration,
              plan and entitlement metadata, Node registration, relay credentials and presence, optional
              encrypted Direct configuration, and the authorization decision used before a relayed operation.
            </p>
          </div>
          <p>
            v1.0.24 also makes the existing relay reconnect carry the running CLI version. After the relay token is
            authenticated, Controller refreshes the persisted Node version together with <code>last_seen_at</code>;
            older Nodes that omit the version header keep their previously stored value. This fixes stale fleet
            version labels after an upgrade without adding a polling path or requiring Direct re-pairing.
          </p>
          <div className="card-grid">
            <article className="content-card"><p className="card-label">Stored centrally</p><h2>Identity and coordination state</h2><p>Users, organizations, roles, plan state, Node discovery, relay state, and organization configuration live in Controller.</p></article>
            <article className="content-card"><p className="card-label">Authoritative on Node</p><h2>Detailed runtime data</h2><p>Snapshots, session transcripts, prompts, process data, source-reported subscription metadata, and detailed runtime records remain authoritative on Nodes.</p></article>
            <article className="content-card"><p className="card-label">Relay behavior</p><h2>Payloads are not stored as relay history</h2><p>Relay traffic exists in Controller runtime memory while a request is active; Controller does not persist relay response bodies.</p></article>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell split-section">
          <div>
            <Eyebrow>All machines</Eyebrow>
            <h2>Fleet aggregation happens in browser memory after reading reachable Nodes.</h2>
            <p>
              The signed-in organization landing view queries each reachable Node for a bounded overview
              through Direct or Relay. The browser combines machine state, active and stopped sessions,
              reported Tokens, CPU/RSS, Agent Plans, and source-reported subscription windows, then lets the
              user switch to one Node. Controller supplies the machine directory and access policy; it does
              not persist the fetched Node snapshots or the aggregate produced from them.
            </p>
            <p>
              This boundary matters for both privacy and failure semantics. A Node that is unreachable cannot
              contribute current detail to the fleet view, and the browser-side aggregate is not evidence that
              Controller has a durable copy of the underlying runtime data.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <p className="card-label">Fleet read path</p>
            <p><strong>Directory</strong></p><p>Controller identifies Nodes the user may reach.</p>
            <p><strong>Data</strong></p><p>The browser reads each reachable Node and combines the bounded results locally.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div><Eyebrow>Authorization</Eyebrow><h2>Human roles become semantic actions, then Node-local capabilities.</h2></div>
            <p>
              OAuth authenticates a person. Controller resolves organization membership and the requested
              semantic action. The Node does not need user, billing, or organization RBAC records; it
              enforces the scoped capability presented to its protocol surface.
            </p>
          </div>
          <div className="card-grid">
            {capabilities.map(([name, description]) => <article className="content-card" key={name}><p className="card-label">Node capability</p><h2><code>{name}</code></h2><p>{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <div className="section-heading">
            <div><Eyebrow>Organization roles</Eyebrow><h2>Four built-in roles keep fleet authorization small and inspectable.</h2></div>
            <p>
              Nodes are registered into an organization namespace rather than owned directly by one user.
              Every account receives a personal organization; team organizations use the same membership model.
            </p>
          </div>
          <div className="card-grid">
            {roles.map(([name, description]) => <article className="content-card" key={name}><p className="card-label">Role</p><h2>{name}</h2><p>{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="dark-section section">
        <div className="shell dark-grid">
          <div>
            <Eyebrow>Hosted deployment</Eyebrow>
            <h2>The app and Controller deploy from one repository revision in one Worker.</h2>
            <p>
              The hosted frontend at app.agentsight.us and Controller API/relay at control.agentsight.us
              are served by one production Cloudflare Worker revision. D1 stores Controller metadata and
              a Durable Object carries live relay traffic. This deployment unification does not change the
              Node-authoritative runtime-data boundary.
            </p>
          </div>
          <ul className="workflow-list">
            <li><span>01</span><div><strong>One revision</strong><p>Frontend and Controller production surfaces move together.</p></div></li>
            <li><span>02</span><div><strong>Direct remains independent</strong><p>A browser can still reach a paired Node without using Controller relay.</p></div></li>
            <li><span>03</span><div><strong>Preview stays isolated</strong><p>Non-production builds use separate hosted resources from production.</p></div></li>
          </ul>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell split-section">
          <div>
            <Eyebrow>Plans and hosted preview</Eyebrow>
            <h2>The plan catalog exists, but billing gates are not currently enforced in the hosted preview.</h2>
            <p>
              Controller exposes the Free, Pro, Team, and Enterprise catalog and keeps persisted billing
              state separate from effective access. In the current hosted preview, registered users receive
              an <code>unlimited</code> effective plan, so implemented managed-connectivity and multi-member
              gates are bypassed without rewriting the stored plan. Pricing documents the catalog separately
              from today’s preview access.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <a className="button button-accent" href="/pricing/">See the plan catalog</a>
            <a className="button button-outline" href="/security/">Review data handling</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell narrow source-section">
          <Eyebrow>Primary sources</Eyebrow>
          <h2>Architecture claims are pinned to the released implementation.</h2>
          <p>Reviewed on 24 August 2026 against AgentSight v{site.version} at <code>{productCommit}</code>.</p>
          <ul>{sources.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
        </div>
      </section>
    </SiteShell>
  );
}
