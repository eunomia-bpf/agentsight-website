import type { Metadata } from 'next';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Architecture',
  description:
    'How AgentSight v1.0.17 separates Node-local runtime data, Direct browser access, Controller coordination, hosted deployment, organization roles, and capability-scoped authorization.',
  alternates: { canonical: '/architecture/' },
};

const productCommit = '32228e0377eec52203c9531130b8e516d8946ecb';
const productSource = `https://github.com/eunomia-bpf/agentsight/blob/${productCommit}`;

const planes = [
  {
    title: 'Node data plane',
    description:
      'The AgentSight Node captures, stores, and serves detailed runtime data. Session databases, snapshots, prompts, process activity, live overview state, and other detailed records remain authoritative on the Node.',
  },
  {
    title: 'Controller coordination plane',
    description:
      'Controller handles identity, organizations, memberships, plan and entitlement metadata, Node discovery, relay presence, optional encrypted Direct connection configs, and authorization decisions. It is not the authoritative telemetry store.',
  },
  {
    title: 'Client and presentation plane',
    description:
      'The hosted app, local UI, and CLI reach a Node through a local or Direct connection, or through Controller relay when that transport is available and authorized. The hosted SPA remains presentation-only for detailed runtime data.',
  },
] as const;

const modes = [
  ['01', 'Local', 'Run and query AgentSight on one machine. No Controller account or relay is required for local capture and saved-session analysis.'],
  ['02', 'Direct', 'A browser reaches a Node by an explicit HTTP(S) endpoint. Direct remains usable without Controller Relay and is preferred when a saved Direct path is available.'],
  ['03', 'Controller-managed', 'Controller adds OAuth identity, organization-scoped Node discovery, relay connectivity, roles, and authorization before remote operations.'],
] as const;

const roles = [
  ['Viewer', 'Inspect organization metadata, Nodes, runtime evidence, sessions, configuration, and billing state.'],
  ['Operator', 'Viewer permissions plus the ability to send session messages.'],
  ['Admin', 'Operator permissions plus Node, member, and organization-configuration management.'],
  ['Owner', 'Admin permissions plus organization and billing management.'],
] as const;

const capabilities = [
  ['node.info', 'Read Node identity and protocol information.'],
  ['evidence.read', 'Read the Node snapshot/runtime evidence surface.'],
  ['session.read', 'Read a session, optionally restricted to one session identifier.'],
  ['session.message', 'Send a message to a session, optionally restricted to one session identifier.'],
] as const;

const sources = [
  {
    label: 'AgentSight v1.0.17 Controller architecture and authorization model',
    href: `${productSource}/controller/README.md`,
  },
  {
    label: 'AgentSight v1.0.17 Node capability implementation',
    href: `${productSource}/collector/src/server/capability.rs`,
  },
  {
    label: 'AgentSight v1.0.17 Direct, Relay, and overview client implementation',
    href: `${productSource}/frontend/src/lib/nodeClient.ts`,
  },
  {
    label: 'AgentSight v1.0.17 Controller plan and role implementation',
    href: `${productSource}/controller/src/access.ts`,
  },
  {
    label: 'Unified frontend and Controller Worker deployment (PR #175)',
    href: 'https://github.com/eunomia-bpf/agentsight/pull/175',
  },
  {
    label: 'Session-first machine overview and scoped session detail (PR #178)',
    href: 'https://github.com/eunomia-bpf/agentsight/pull/178',
  },
  {
    label: 'AgentSight v1.0.17 release',
    href: site.releaseUrl,
  },
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
            coordinates people, organizations, discovery, connectivity, and authorization. Direct Node
            access and Controller Relay are transports to the same Node protocol, not separate telemetry stores.
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
            <div>
              <Eyebrow>The boundary</Eyebrow>
              <h2>Three planes, with the Node authoritative for detailed runtime data.</h2>
            </div>
            <p>
              This page describes the released v{site.version} implementation, reviewed against product
              commit <code>{productCommit.slice(0, 12)}</code>. It intentionally separates shipped behavior
              from design ideas that may exist elsewhere in the repository.
            </p>
          </div>
          <div className="card-grid">
            {planes.map((plane, index) => (
              <article className="content-card" key={plane.title}>
                <p className="card-label">0{index + 1}</p>
                <h2>{plane.title}</h2>
                <p>{plane.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dark-section section">
        <div className="shell dark-grid">
          <div>
            <Eyebrow>Current access paths</Eyebrow>
            <h2>Local, Direct, and Controller-managed access share one Node protocol.</h2>
            <p>
              Direct is not merely a fallback for Controller Relay. A browser-reachable Node can be used
              by IP or URL even when Relay is unavailable or not deployed. Controller adds coordination
              rather than replacing that path.
            </p>
          </div>
          <ul className="workflow-list">
            {modes.map(([number, title, description]) => (
              <li key={title}>
                <span>{number}</span>
                <div><strong>{title}</strong><p>{description}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell split-section">
          <div>
            <Eyebrow>Direct pairing</Eyebrow>
            <h2>The bootstrap credential is not the normal browser credential.</h2>
            <p>
              In v{site.version}, a Direct binding link carries a bootstrap key long enough to identify
              the Node and mint a scoped capability. The browser then stores the returned capability for
              normal Node requests. The default Direct capability covers <code>node.info</code>,
              <code>evidence.read</code>, <code>session.read</code>, and <code>session.message</code> for up
              to twelve hours; the persistent bootstrap authority is not stored as the normal Direct access token.
            </p>
            <p>
              By default, Direct connection configuration stays in the current browser. A signed-in user
              can explicitly opt in to save a compact Direct endpoint and bootstrap key for another browser.
              Controller encrypts that account copy with AES-256-GCM using a per-user/per-Node derived key;
              D1 does not store the plaintext Direct configuration, and the account copy can be deleted
              independently of the browser's local capability.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <p className="card-label">Transport order</p>
            <p><strong>1. Saved Direct path</strong></p>
            <p>Use the browser-reachable Node endpoint when one has been paired.</p>
            <p><strong>2. Controller Relay</strong></p>
            <p>Use Relay when the managed transport is online and the operation is authorized.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>Controller data boundary</Eyebrow>
              <h2>Controller coordinates access; it does not persist the detailed Node payload.</h2>
            </div>
            <p>
              The released Controller stores OAuth identity, organizations and memberships, organization
              configuration, plan and entitlement metadata, Node registration, relay credentials and
              presence, optional encrypted Direct connection configs, and authorization state.
            </p>
          </div>
          <div className="card-grid">
            <article className="content-card">
              <p className="card-label">Stored centrally</p>
              <h2>Identity and coordination state</h2>
              <p>Users, organization membership, roles, plan state, Node discovery, relay state, organization configuration, and opt-in encrypted Direct connection configs live in Controller.</p>
            </article>
            <article className="content-card">
              <p className="card-label">Authoritative on Node</p>
              <h2>Detailed runtime data</h2>
              <p>Snapshots, session transcripts, prompts, process data, live overview state, and detailed runtime evidence remain authoritative on Nodes.</p>
            </article>
            <article className="content-card">
              <p className="card-label">Relay behavior</p>
              <h2>Payloads pass through memory</h2>
              <p>Controller does not persist relay response bodies; relay traffic exists in Controller runtime memory only while the request is active.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell split-section">
          <div>
            <Eyebrow>Hosted deployment</Eyebrow>
            <h2>The hosted SPA and Controller ship from one Worker revision.</h2>
            <p>
              The current hosted deployment uses one production Cloudflare Worker from the AgentSight
              repository. <code>app.agentsight.us</code> serves the frontend and static assets, while
              <code>control.agentsight.us</code> serves the Controller API and Relay. One D1 database holds
              Controller metadata and one Durable Object namespace carries live Relay traffic.
            </p>
            <p>
              Production and isolated staging builds are connected directly through Cloudflare Workers
              Builds. This deployment choice keeps the hosted UI and Controller on the same repository
              revision; it does not change the data-plane rule that Direct requests go browser-to-Node and
              detailed runtime data remains authoritative on the Node.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <p className="card-label">Hosted surfaces</p>
            <p><strong>app.agentsight.us</strong></p>
            <p>Presentation and Node selection.</p>
            <p><strong>control.agentsight.us</strong></p>
            <p>Identity, organizations, Relay, and coordination APIs.</p>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>Authorization</Eyebrow>
              <h2>Human roles become semantic actions, then Node-local capabilities.</h2>
            </div>
            <p>
              OAuth authenticates a human. Controller resolves organization membership and the requested
              semantic action. The Node does not need to understand users, billing, or organization RBAC;
              it enforces the scoped capability presented to its protocol surface.
            </p>
          </div>
          <div className="card-grid">
            {capabilities.map(([name, description]) => (
              <article className="content-card" key={name}>
                <p className="card-label">Node capability</p>
                <h2><code>{name}</code></h2>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>Organization roles</Eyebrow>
              <h2>Four built-in roles keep fleet authorization small and inspectable.</h2>
            </div>
            <p>
              Nodes are registered into an organization namespace rather than being owned directly by
              a user. Every account receives a personal organization; Team organizations use the same
              membership model and add multiple members.
            </p>
          </div>
          <div className="card-grid">
            {roles.map(([name, description]) => (
              <article className="content-card" key={name}>
                <p className="card-label">Role</p>
                <h2>{name}</h2>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dark-section section">
        <div className="shell dark-grid">
          <div>
            <Eyebrow>Failure and trust boundaries</Eyebrow>
            <h2>Cloud coordination can disappear without deleting the Node-local record.</h2>
            <p>
              Local capture and saved-session data do not depend on Controller persistence. A saved
              Direct path can continue to be the browser transport without Relay. Conversely, an
              organization-listed Node with neither a reachable Direct path nor an online Relay has no
              usable remote transport until one of those paths is restored.
            </p>
          </div>
          <ul className="workflow-list">
            <li><span>01</span><div><strong>Do not infer intent from transport</strong><p>Direct and Relay change how a request reaches the Node, not what the underlying runtime data means.</p></div></li>
            <li><span>02</span><div><strong>Do not treat Controller as a backup telemetry database</strong><p>Its coordination records are intentionally not a second copy of full session data.</p></div></li>
            <li><span>03</span><div><strong>Scope remote authority</strong><p>Use organization actions and Node capabilities rather than handing normal clients the persistent bootstrap credential.</p></div></li>
          </ul>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell split-section">
          <div>
            <Eyebrow>Choosing a mode</Eyebrow>
            <h2>Add only the coordination layer the deployment needs.</h2>
            <p>
              Use Local when one machine and local artifacts are enough. Use Direct when the browser can
              reach the Node through loopback, LAN, VPN, or an HTTPS endpoint and you do not need Relay.
              Use Controller-managed access when identity, organization membership, managed discovery,
              roles, and Relay connectivity are part of the operating model.
            </p>
            <p>
              During the current hosted preview, plan enforcement is intentionally bypassed for registered
              users while the published Free/Pro/Team/Enterprise catalog remains modeled separately. See
              Pricing for the current preview state instead of inferring active billing from the catalog alone.
            </p>
          </div>
          <div className="detail-aside static-aside">
            <a className="button button-accent" href="/pricing/">Compare plans</a>
            <a className="button button-outline" href="/security/">Review data handling</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell narrow source-section">
          <Eyebrow>Primary sources</Eyebrow>
          <h2>Architecture claims are pinned to the released implementation.</h2>
          <p>
            Reviewed on 13 August 2026 against AgentSight v{site.version} at
            <code> {productCommit}</code>. Product behavior changes quickly, so use the tagged release and
            exact source links below when a deployment or security decision depends on a specific version.
          </p>
          <ul>
            {sources.map((source) => (
              <li key={source.href}><a href={source.href}>{source.label}</a></li>
            ))}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
