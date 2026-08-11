import type { Metadata } from 'next';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';
import styles from './pricing.module.css';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'AgentSight pricing: free local-first observability, $5/month Personal Cloud early access, and $10/user/month Team early access without per-trace or token metering.',
  alternates: { canonical: '/pricing/' },
};

const plans = [
  {
    name: 'Open Source',
    price: '$0',
    period: 'forever',
    status: 'Available now',
    description:
      'Run AgentSight locally and keep the detailed runtime evidence on machines you control.',
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
    name: 'Personal Cloud',
    price: '$5',
    period: '/ month',
    annual: '$49 / year',
    status: 'Early access',
    description:
      'A lightweight hosted coordination layer for one person using AgentSight across multiple machines.',
    features: [
      'Everything in Open Source',
      'GitHub or Google sign-in',
      'Hosted Node directory',
      'Use app.agentsight.us with Direct Nodes',
      'Managed connectivity on the early-access roadmap',
    ],
    cta: 'Open AgentSight',
    href: site.demo,
    featured: true,
  },
  {
    name: 'Team',
    price: '$10',
    period: '/ user / month',
    status: 'Early access target',
    description:
      'Shared coordination for teams that want one place to reach, review, and govern their AgentSight fleet.',
    features: [
      'Planned shared Node fleet and team access',
      'Planned session sharing and remote workflows',
      'Planned basic policy and audit controls',
      'No per-trace or token usage meter',
      'Business and enterprise upgrades later',
    ],
    cta: 'Follow product releases',
    href: '/releases/',
    featured: false,
  },
] as const;

export default function PricingPage() {
  return (
    <SiteShell>
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>Pricing</Eyebrow>
          <h1>Simple pricing for a local-first architecture.</h1>
          <p className="hero-lede">
            AgentSight keeps detailed agent runtime evidence on your Nodes instead of requiring a
            central telemetry warehouse. The hosted layer coordinates identity, machines, access,
            and collaboration, so pricing does not need a trace, token, or telemetry-storage meter.
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
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
          <p className={styles.availabilityNote}>
            Personal Cloud and Team are announced early-access prices, not a claim that every managed
            feature is generally available today. The current hosted app already supports sign-in,
            owner-scoped Node registration, and Direct Node workflows; managed relay, shared team
            governance, and enterprise lifecycle features are still being built.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>Why it can stay inexpensive</Eyebrow>
              <h2>Pay for coordination, not a second copy of your telemetry.</h2>
            </div>
            <p>
              The AgentSight Node remains the authoritative data plane. Cloud features can stay thin
              because prompts, responses, process activity, file evidence, network evidence, and the
              full session database do not need to become a hosted ingestion pipeline by default.
            </p>
          </div>
          <div className={styles.principles}>
            <article>
              <span>01</span>
              <h3>Local data plane</h3>
              <p>Capture, materialization, and detailed session storage stay on the Node you control.</p>
            </article>
            <article>
              <span>02</span>
              <h3>No telemetry tax</h3>
              <p>Personal and Team pricing is not based on trace count, model tokens, or stored telemetry volume.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Value-based enterprise</h3>
              <p>Organizations pay for governance, fleet coordination, private deployment, identity lifecycle, and support.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="dark-section section">
        <div className="shell dark-grid">
          <div>
            <Eyebrow>Business and enterprise</Eyebrow>
            <h2>Govern larger fleets without turning AgentSight into a telemetry warehouse.</h2>
            <p>
              The enterprise path adds organization identity, RBAC, policy, audit, Site Gateway,
              private connectivity, deployment controls, and support on top of the same customer-owned
              data plane.
            </p>
          </div>
          <div className={styles.enterpriseCard}>
            <span>Business / Enterprise</span>
            <strong>Custom</strong>
            <p>Pricing follows fleet scope, governance requirements, private deployment, and support rather than raw trace volume.</p>
            <a className="button button-ghost" href="https://eunomia.dev/">Work with Eunomia</a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
