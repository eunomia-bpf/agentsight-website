import type { Metadata } from 'next';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';
import styles from './pricing.module.css';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'AgentSight pricing and hosted preview: free open-source local use, a published future Pro/Team catalog, and unlimited hosted preview access for registered users today.',
  alternates: { canonical: '/pricing/' },
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    status: 'Open source',
    description:
      'Run open-source AgentSight locally and keep detailed runtime evidence on machines you control.',
    features: [
      'Local AgentSight Node and CLI/TUI',
      'Unlimited local sessions and SQLite artifacts',
      'Direct Node access and BYO connectivity',
      'Local reports, profiling, and runtime evidence',
      'No AgentSight cloud account required',
    ],
    cta: 'Read the documentation',
    href: site.docs,
    featured: false,
  },
  {
    name: 'Pro',
    price: '$5',
    period: '/ month',
    annual: '$49 / year',
    status: 'Future catalog',
    description:
      'Published future billing scope for hosted coordination and managed connectivity for one person across multiple machines and networks.',
    features: [
      'Everything in Free',
      'GitHub or Google sign-in',
      'Personal organization and hosted Node directory',
      'Managed Direct and Controller relay workflows',
      'Remote access through app.agentsight.us',
      'Meaningful contributors get personal Pro for life after billing enforcement',
    ],
    cta: 'Open hosted preview',
    href: site.demo,
    featured: true,
  },
  {
    name: 'Team',
    price: '$10',
    period: '/ user / month',
    status: 'Future catalog',
    description:
      'Published future billing scope for teams that want one place to reach, review, control, and govern a distributed AgentSight fleet.',
    features: [
      'Shared organization and Node fleet',
      'Viewer, operator, admin, and owner roles',
      'Member invitations and organization configuration',
      'Capability-scoped Node access and remote workflows',
      'No per-trace, token, or telemetry-storage meter',
    ],
    cta: 'Open hosted preview',
    href: site.demo,
    featured: false,
  },
] as const;

export default function PricingPage() {
  return (
    <SiteShell>
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Pricing</Eyebrow>
          <h1>Simple pricing for a distributed, local-first architecture.</h1>
          <p className="hero-lede">
            AgentSight keeps a Free/Pro/Team/Enterprise billing catalog separate from the current
            hosted preview. Today, every registered user's organization receives unlimited access to
            the implemented managed-connectivity and multi-member features; the persisted billing plan
            is not rewritten by that preview access.
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <article className="content-card" style={{ marginBottom: '1.5rem' }}>
            <p className="card-label">Hosted preview</p>
            <h2>Registered users currently receive unlimited hosted feature access.</h2>
            <p>
              AgentSight v{site.version} exposes <code>effectivePlan: "unlimited"</code> during the hosted
              preview. This bypasses managed-connectivity and multi-member plan gates without changing
              an organization's stored Free/Pro/Team/Enterprise plan or billing status. The prices below
              are the published future billing catalog, not a claim that paid-plan enforcement is active today.
            </p>
          </article>
          <div className={styles.pricingGrid}>
            {plans.map((plan) => (
              <article
                className={`${styles.plan} ${plan.featured ? styles.featured : ''}`}
                key={plan.name}
              >
                <div className={styles.planHeader}>
                  <span className={styles.status}>{plan.status}</span>
                  <h2>{plan.name}</h2>
                  <div className={styles.priceLine}>
                    <strong>{plan.price}</strong>
                    <span>{plan.period}</span>
                  </div>
                  {'annual' in plan ? <p className={styles.annual}>{plan.annual}</p> : null}
                  <p className={styles.description}>{plan.description}</p>
                </div>
                <ul className={styles.features}>
                  {plan.features.map((feature) => (
                    <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>
                  ))}
                </ul>
                <a
                  className={`button ${plan.featured ? 'button-accent' : 'button-outline'} ${styles.cta}`}
                  href={plan.href}
                >
                  {plan.cta}
                </a>
              </article>
            ))}
          </div>
          <p className={styles.annual} style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            Contributor Lifetime Pro is a durable personal benefit for the future billed catalog. It does not waive Team or Enterprise billing when billing enforcement is enabled.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>Why the catalog stays inexpensive</Eyebrow>
              <h2>Pay for coordination, not a second copy of your telemetry.</h2>
            </div>
            <p>
              AgentSight uses a distributed data plane, so prompts, responses, process activity,
              file evidence, network evidence, and full session databases do not need to become a
              hosted ingestion pipeline by default. The future paid catalog is designed around
              coordination, connectivity, and collaboration rather than raw telemetry volume.
            </p>
          </div>
          <div className={styles.principles}>
            <article>
              <span>01</span>
              <h3>Customer-owned data</h3>
              <p>Detailed capture and session storage stay on the Nodes you control.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Lightweight cloud</h3>
              <p>Hosted coordination handles identity, organizations, connectivity, authorization, and collaboration across the fleet.</p>
            </article>
            <article>
              <span>03</span>
              <h3>No telemetry tax</h3>
              <p>The published Pro and Team catalog is not based on trace count, model tokens, or stored telemetry volume.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="dark-section section">
        <div className="shell dark-grid">
          <div>
            <Eyebrow>Business and enterprise</Eyebrow>
            <h2>Govern distributed fleets without turning AgentSight into a telemetry warehouse.</h2>
            <p>
              Organization identity, built-in roles, capability-scoped Node authorization, private
              deployment requirements, and support build on the same Node-authoritative data plane.
              GitHub Releases and the Controller source remain authoritative for shipped behavior and
              the current preview/billing boundary.
            </p>
          </div>
          <div className={styles.enterpriseCard}>
            <span>Business / Enterprise</span>
            <strong>Custom</strong>
            <p>The future enterprise catalog follows fleet scope, governance requirements, private deployment, and support rather than raw trace volume.</p>
            <a className="button button-ghost" href="https://eunomia.dev/">Work with Eunomia</a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
