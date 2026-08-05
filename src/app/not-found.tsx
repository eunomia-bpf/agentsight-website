import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';

export default function NotFound() {
  return (
    <SiteShell>
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <p className="eyebrow">404</p>
          <h1>This profile path does not exist.</h1>
          <p className="hero-lede">Return to the product overview or browse the current guides and use cases.</p>
          <div className="hero-actions">
            <Link className="button button-accent" href="/">AgentSight home</Link>
            <Link className="button button-outline" href="/guides/">Browse guides</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
