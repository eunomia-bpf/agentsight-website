import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Product',
  description:
    'Explore AgentSight runtime evidence, distributed local-first architecture, supported agent integrations, and comparison with adjacent observability layers.',
  alternates: { canonical: '/product/' },
};

const productAreas = [
  {
    eyebrow: 'Use cases',
    title: 'Observe, diagnose, and improve real agent runs.',
    description:
      'Inspect model activity, processes, files, network effects, resources, repeated failures, and the evidence used to evaluate later improvements.',
    href: '/use-cases/',
    link: 'Explore use cases →',
  },
  {
    eyebrow: 'Architecture',
    title: 'A distributed, local-first data plane.',
    description:
      'Keep detailed runtime data authoritative on AgentSight Nodes while Direct access and the Controller coordinate identity, organizations, discovery, connectivity, roles, and authorization.',
    href: '/architecture/',
    link: 'See the architecture →',
  },
  {
    eyebrow: 'Integrations',
    title: 'Use the agents and runtimes you already have.',
    description:
      'Connect AgentSight to supported coding agents, local CLIs, process families, containers, and existing observability workflows without rebuilding the agent around an SDK.',
    href: '/integrations/',
    link: 'Browse integrations →',
  },
  {
    eyebrow: 'Compare',
    title: 'Understand where AgentSight sits in the stack.',
    description:
      'Compare system-boundary runtime evidence with application traces, OpenTelemetry, gateways, hosted LLM observability, and other adjacent approaches.',
    href: '/compare/',
    link: 'Compare approaches →',
  },
] as const;

export default function ProductPage() {
  return (
    <SiteShell>
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Product</Eyebrow>
          <h1>One product from local agent runs to distributed fleets.</h1>
          <p className="hero-lede">
            AgentSight combines runtime evidence, a distributed local-first data plane, supported agent
            integrations, and an optional coordination layer in one product. Start on one machine and
            keep the same Node protocol as the fleet grows.
          </p>
          <div className="hero-actions">
            <a className="button button-accent" href={site.demo}>Open AgentSight</a>
            <a className="button button-outline" href={site.docs}>Read the documentation</a>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>Product map</Eyebrow>
              <h2>Use one entry point for the product, then go deeper where needed.</h2>
            </div>
            <p>
              Use cases, architecture, integrations, and comparisons remain focused pages, but they now
              sit under one Product entry instead of competing as separate primary navigation items.
            </p>
          </div>
          <div className="card-grid">
            {productAreas.map((area) => (
              <article className="content-card" key={area.title}>
                <p className="card-label">{area.eyebrow}</p>
                <h2>{area.title}</h2>
                <p>{area.description}</p>
                <Link className="arrow-link" href={area.href}>{area.link}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dark-section section">
        <div className="shell dark-grid">
          <div>
            <Eyebrow>Distributed by architecture</Eyebrow>
            <h2>Keep execution data close to the agents that produced it.</h2>
            <p>
              AgentSight scales by coordinating customer-controlled Nodes rather than requiring every
              detailed session to become a second copy in a centralized telemetry warehouse.
            </p>
          </div>
          <ul className="workflow-list">
            <li><span>01</span><div><strong>Observe locally</strong><p>Capture and query detailed runtime data on the Node.</p></div></li>
            <li><span>02</span><div><strong>Connect directly</strong><p>Reach browser-visible Nodes by explicit HTTP(S) endpoints without requiring Controller Relay.</p></div></li>
            <li><span>03</span><div><strong>Coordinate organizations</strong><p>Add identity, discovery, roles, capabilities, entitlements, and relay connectivity through Controller when needed.</p></div></li>
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
