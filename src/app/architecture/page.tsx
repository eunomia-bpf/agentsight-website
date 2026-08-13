import type { Metadata } from 'next';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { productCommit, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Architecture',
  description:
    'How AgentSight v1.0.17 separates Node-local runtime data, Direct browser access, Controller coordination, organization roles, capability-scoped access, and the unified hosted Worker.',
  alternates: { canonical: '/architecture/' },
};

const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;

const planes = [
  ['Node data plane', 'The AgentSight Node captures, stores, and serves detailed runtime data. Sessions, snapshots, prompts, process activity, and other detailed records remain authoritative on the Node.'],
  ['Controller coordination plane', 'Controller handles identity, organizations, memberships, plan and entitlement metadata, Node discovery, relay presence, optional encrypted Direct configuration, and authorization decisions. It is not the authoritative telemetry store.'],
  ['Client and presentation plane', 'The hosted app, local UI, and CLI reach a Node locally or through Direct, or through Controller relay when that path is available and authorized.'],
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

const sources = [
  ['AgentSight v1.0.17 Controller architecture and authorization model', `${productSource}/controller/README.md`],
  ['AgentSight v1.0.17 Node capability implementation', `${productSource}/collector/src/server/capability.rs`],
  ['AgentSight v1.0.17 Direct connection implementation', `${productSource}/frontend/src/lib/connection.ts`],
  ['AgentSight v1.0.17 current plan and hosted-preview access model', `${productSource}/controller/src/access.ts`],
  ['Unified frontend and Controller Worker deployment (PR #175)', 'https://github.com/eunomia-bpf/agentsight/pull/175'],
  ['Direct Node access independent of Controller relay (PR #166)', 'https://github.com/eunomia-bpf/agentsight/pull/166'],
] as const;

export default function ArchitecturePage() {
  return (
    <SiteShell>
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Architecture · AgentSight v{site.version}</Eyebrow>
          <h1>Keep runtime data on Nodes. Add coordination without making the cloud the data plane.</h1>
          <p className="hero-lede">
            AgentSight separates the machine that owns detailed runtime data from the service that
            coordinates people, organizations, discovery, connectivity, and access. Direct Node access
            and Controller relay are transports to the same Node protocol, not separate telemetry stores.
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
            <div><Eyebrow>The boundary</Eyebrow><h2>Three planes, with the Node authoritative for detailed runtime data.</h2></div>
            <p>
              This page describes the released v{site.version} implementation at <code>{productCommit.slice(0, 12)}</code>.
              It distinguishes shipped behavior from design ideas elsewhere in the repository.
            </p>
          </div>
          <div className="card-grid">
            {planes.map(([title, description], index) => (
              <article className="content-card" key={title}><p className="card-label">0{index + 1}</p><h2>{title}</h2><p>{description}</p></article>
            ))}
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
              Direct configuration stays in the current browser by default. In v{site.version}, a signed-in
              user may explicitly opt in to save a compact Direct endpoint and bootstrap configuration for
              another browser. Controller stores that optional account copy encrypted; its D1 database does
              not store the plaintext, and the account copy can be removed separately from the local browser capability.
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
        <div className="shell">
          <div className="section-heading">
            <div><Eyebrow>Controller data boundary</Eyebrow><h2>Controller coordinates access; it does not persist detailed Node payloads.</h2></div>
            <p>
              Controller stores OAuth identity, organizations and memberships, organization configuration,
              plan and entitlement metadata, Node registration, relay credentials and presence, optional
              encrypted Direct configuration, and the authorization decision used before a relayed operation.
            </p>
          </div>
          <div className="card-grid">
            <article className="content-card"><p className="card-label">Stored centrally</p><h2>Identity and coordination state</h2><p>Users, organizations, roles, plan state, Node discovery, relay state, and organization configuration live in Controller.</p></article>
            <article className="content-card"><p className="card-label">Authoritative on Node</p><h2>Detailed runtime data</h2><p>Snapshots, session transcripts, prompts, process data, and detailed runtime records remain authoritative on Nodes.</p></article>
            <article className="content-card"><p className="card-label">Relay behavior</p><h2>Payloads are not stored as relay history</h2><p>Relay traffic exists in Controller runtime memory while a request is active; Controller does not persist relay response bodies.</p></article>
          </div>
        </div>
      </section>

      <section className="section section-white">
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

      <section className="section">
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
            <h2>The app and Controller now deploy from one repository revision in one Worker.</h2>
            <p>
              Since v1.0.16, the hosted frontend at app.agentsight.us and Controller API/relay at
              control.agentsight.us are served by one production Cloudflare Worker revision. D1 stores
              Controller metadata and a Durable Object carries live relay traffic. This deployment
              unification does not change the Node-authoritative runtime-data boundary.
            </p>
          </div>
          <ul className="workflow-list">
            <li><span>01</span><div><strong>One revision</strong><p>Frontend and Controller production surfaces move together.</p></div></li>
            <li><span>02</span><div><strong>Direct remains independent</strong><p>A browser can still reach a paired Node without using Controller relay.</p></div></li>
            <li><span>03</span><div><strong>Preview stays isolated</strong><p>Non-production builds use a separate Worker, D1 database, and relay resources.</p></div></li>
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
          <p>Reviewed on 13 August 2026 against AgentSight v{site.version} at <code>{productCommit}</code>.</p>
          <ul>{sources.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
        </div>
      </section>
    </SiteShell>
  );
}
