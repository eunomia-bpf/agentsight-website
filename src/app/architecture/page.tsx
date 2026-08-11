import type { Metadata } from 'next';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Architecture',
  description:
    'AgentSight uses a distributed, local-first data plane with lightweight cloud coordination across Nodes, fleets, and enterprise Site Gateways.',
  alternates: { canonical: '/architecture/' },
};

const planes = [
  {
    title: 'Distributed data plane',
    description:
      'AgentSight Nodes capture, materialize, query, and retain detailed runtime evidence close to the agents they observe. Each Node remains authoritative for its own session data.',
  },
  {
    title: 'Coordination plane',
    description:
      'AgentSight Cloud coordinates identity, discovery, managed connectivity, policy, capabilities, audit, and collaboration without becoming the authoritative telemetry store.',
  },
  {
    title: 'Presentation plane',
    description:
      'The hosted app, CLI, and other clients query the same Node protocol across local, direct, managed, and enterprise deployments.',
  },
];

const modes = [
  ['01', 'Local', 'One Node, local evidence, local or hosted UI, no cloud dependency required.'],
  ['02', 'Direct Fleet', 'Multiple Nodes over LAN, VPN, Tailscale, WireGuard, SSH tunnels, or other direct connectivity.'],
  ['03', 'Managed Coordination', 'AgentSight Cloud provides identity, discovery, managed connectivity, collaboration, policy, and fleet access.'],
  ['04', 'Enterprise Site', 'Site Gateways federate large fleets while keeping detailed evidence inside customer-controlled Nodes and sites.'],
] as const;

export default function ArchitecturePage() {
  return (
    <SiteShell>
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Architecture</Eyebrow>
          <h1>A distributed, local-first data plane for AI agents.</h1>
          <p className="hero-lede">
            AgentSight separates runtime evidence from cloud coordination. Detailed agent data stays
            on customer-controlled Nodes and Site Gateways, while the hosted layer coordinates how
            people and machines discover, reach, govern, and collaborate across that distributed fleet.
          </p>
          <div className="hero-actions">
            <a className="button button-accent" href={site.demo}>Open AgentSight</a>
            <a className="button button-outline" href="/pricing/">See pricing</a>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>Three planes</Eyebrow>
              <h2>Keep evidence close to execution. Coordinate globally.</h2>
            </div>
            <p>
              The same architecture works from one laptop to a distributed enterprise fleet. Scaling
              adds coordination and federation instead of moving every trace into a central warehouse.
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
            <Eyebrow>One protocol, four deployment modes</Eyebrow>
            <h2>Start local. Grow into a distributed fleet without changing the data model.</h2>
            <p>
              Local, direct, managed, and enterprise modes share the same AgentSight Node, session
              model, query semantics, and presentation layer. The difference is how identity,
              connectivity, policy, and federation are provided.
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
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>Why distributed matters</Eyebrow>
              <h2>The architecture changes privacy, cost, availability, and scale together.</h2>
            </div>
            <p>
              AgentSight does not need a second authoritative copy of every prompt, response, process,
              file event, or resource sample in its cloud in order to provide a unified product.
            </p>
          </div>
          <div className="card-grid">
            <article className="content-card">
              <p className="card-label">Data ownership</p>
              <h2>Customer-controlled evidence</h2>
              <p>Detailed runtime evidence remains on the Node or customer-controlled Site Gateway by default.</p>
            </article>
            <article className="content-card">
              <p className="card-label">Economics</p>
              <h2>No telemetry warehouse tax</h2>
              <p>Cloud pricing can follow coordination and governance value instead of trace count, token volume, or hosted retention.</p>
            </article>
            <article className="content-card">
              <p className="card-label">Resilience</p>
              <h2>Capture does not depend on the cloud</h2>
              <p>Nodes continue local capture, materialization, retention, and query even when the coordination plane is unavailable.</p>
            </article>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
