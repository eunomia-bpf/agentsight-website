import type { Metadata } from 'next';
import { Eyebrow } from '@/components/PageParts';
import { SiteShell } from '@/components/SiteShell';
import { productCommit, site } from '@/lib/site';
import styles from './pricing.module.css';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'AgentSight plan catalog: Free, $5/month Pro, $10/user/month Team, and Enterprise, with all registered users currently receiving unlimited hosted-preview access.',
  alternates: { canonical: '/pricing/' },
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    status: 'Plan catalog',
    description: 'Open-source local and Direct use with detailed runtime data kept on machines you control.',
    features: [
      'Local AgentSight Node and CLI/TUI',
      'Local sessions and SQLite artifacts',
      'Direct Node access and BYO connectivity',
      'Local reports, profiling, and runtime data',
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
    status: 'Plan catalog',
    description: 'The planned personal tier for managed connectivity across multiple machines and networks.',
    features: [
      'Everything in Free',
      'Personal organization and hosted Node directory',
      'Managed connectivity entitlement',
      'Remote access through the hosted app',
      'Contributor Lifetime Pro remains a personal entitlement',
    ],
    cta: 'Open hosted preview',
    href: site.demo,
    featured: true,
  },
  {
    name: 'Team',
    price: '$10',
    period: '/ user / month',
    status: 'Plan catalog',
    description: 'The planned multi-member tier for a shared organization and distributed AgentSight fleet.',
    features: [
      'Shared organization and Node fleet',
      'Viewer, operator, admin, and owner roles',
      'Member invitations and organization configuration',
      'Capability-scoped Node access and remote workflows',
      'No per-trace, token, or telemetry-storage meter in the catalog',
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
          <Eyebrow>Pricing · AgentSight v{site.version}</Eyebrow>
          <h1>The plan catalog is published. Hosted preview access is currently unlimited.</h1>
          <p className="hero-lede">
            Controller defines Free, Pro, Team, and Enterprise plans, but v{site.version} does not yet
            enforce those billing gates in the hosted preview. Every registered user currently receives
            the implemented hosted feature set through an <code>unlimited</code> effective plan. The prices
            below are the product catalog, not a claim that hosted billing is already active.
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell">
          <div className={styles.pricingGrid}>
            {plans.map((plan) => (
              <article className={`${styles.plan} ${plan.featured ? styles.featured : ''}`} key={plan.name}>
                <div className={styles.planHeader}>
                  <span className={styles.status}>{plan.status}</span>
                  <h2>{plan.name}</h2>
                  <div className={styles.priceLine}><strong>{plan.price}</strong><span>{plan.period}</span></div>
                  {'annual' in plan ? <p className={styles.annual}>{plan.annual}</p> : null}
                  <p className={styles.description}>{plan.description}</p>
                </div>
                <ul className={styles.features}>
                  {plan.features.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}
                </ul>
                <a className={`button ${plan.featured ? 'button-accent' : 'button-outline'} ${styles.cta}`} href={plan.href}>{plan.cta}</a>
              </article>
            ))}
          </div>
          <p className={styles.annual} style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            Contributor Lifetime Pro is a durable personal entitlement for meaningful contributors. It does not waive future Team or Enterprise billing.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div><Eyebrow>Current hosted preview</Eyebrow><h2>Persisted billing state and effective preview access are separate.</h2></div>
            <p>
              The released Controller keeps organization plan and billing status truthful while
              <code>HOSTED_PREVIEW_UNLIMITED</code> grants registered users an <code>unlimited</code> effective
              plan. Managed-connectivity and multi-member gates are therefore bypassed during the preview
              without rewriting the organization’s stored future billing plan.
            </p>
          </div>
          <div className={styles.principles}>
            <article><span>01</span><h3>Local stays free</h3><p>Open-source local and Direct workflows do not require hosted billing.</p></article>
            <article><span>02</span><h3>Preview is broader today</h3><p>Registered users currently receive all implemented hosted-preview capabilities.</p></article>
            <article><span>03</span><h3>Catalog remains explicit</h3><p>Free, Pro, Team, and Enterprise semantics remain encoded separately for later billing enforcement.</p></article>
          </div>
        </div>
      </section>

      <section className="dark-section section">
        <div className="shell dark-grid">
          <div>
            <Eyebrow>Why the catalog can stay inexpensive</Eyebrow>
            <h2>Plans coordinate access rather than charging for a second copy of every session.</h2>
            <p>
              Detailed runtime data remains authoritative on AgentSight Nodes. Controller coordinates
              identity, organizations, discovery, connectivity, roles, entitlements, and relay, so the
              catalog is not based on trace count, model tokens, or hosted telemetry-storage volume.
            </p>
          </div>
          <div className={styles.enterpriseCard}>
            <span>Enterprise catalog</span><strong>Custom</strong>
            <p>Enterprise remains a custom catalog tier for broader fleet, governance, deployment, and support requirements.</p>
            <a className="button button-ghost" href="https://eunomia.dev/">Work with Eunomia</a>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="shell narrow source-section">
          <Eyebrow>Primary source</Eyebrow>
          <h2>Pricing state is pinned to the released Controller.</h2>
          <p>
            Reviewed on 13 August 2026 against AgentSight v{site.version} at <code>{productCommit}</code>.
            The current catalog and hosted-preview switch are defined in Controller source.
          </p>
          <ul>
            <li><a href={`https://github.com/eunomia-bpf/agentsight/blob/${productCommit}/controller/src/access.ts`}>v{site.version} plan catalog and hosted-preview access model</a></li>
            <li><a href={`https://github.com/eunomia-bpf/agentsight/blob/${productCommit}/controller/README.md`}>v{site.version} Controller architecture, plans, and deployment notes</a></li>
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
