import Link from 'next/link';
import type { ReactNode } from 'react';
import { navigation, site } from '@/lib/site';

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="AgentSight home">
      <svg viewBox="0 0 36 36" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="agentsight-mark" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff7a3d" />
            <stop offset="0.52" stopColor="#e848b1" />
            <stop offset="1" stopColor="#7b61ff" />
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="10" fill="#17171f" />
        <path d="M7 18c2.9-5.1 6.6-7.6 11-7.6S26.1 12.9 29 18c-2.9 5.1-6.6 7.6-11 7.6S9.9 23.1 7 18Z" fill="none" stroke="url(#agentsight-mark)" strokeWidth="2.7" />
        <circle cx="18" cy="18" r="4.2" fill="url(#agentsight-mark)" />
        <circle cx="18" cy="18" r="1.5" fill="#17171f" />
      </svg>
      <span>
        <strong>AgentSight</strong>
        <small>by Eunomia</small>
      </span>
    </Link>
  );
}

function MobileNavigation() {
  return (
    <details className="mobile-menu">
      <summary aria-label="Open site navigation">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </summary>
      <nav aria-label="Mobile navigation">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <a href={site.docs}>Documentation ↗</a>
        <a href={site.repository}>GitHub ↗</a>
      </nav>
    </details>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />
        <nav className="primary-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileNavigation />
        <div className="header-actions">
          <a className="header-github" href={site.repository}>GitHub ↗</a>
          <a className="button button-accent header-cta" href={site.demo}>View demo</a>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Logo />
          <p className="footer-copy">
            Open-source, local-first observability for AI agents. Connect model activity to commands,
            files, processes, network activity, and resource use.
          </p>
        </div>
        <div>
          <h2>Product</h2>
          <a href={site.demo}>Live demo</a>
          <Link href="/use-cases/">Use cases</Link>
          <Link href="/compare/">Compare</Link>
          <Link href="/integrations/">Integrations</Link>
        </div>
        <div>
          <h2>Resources</h2>
          <a href={site.docs}>Documentation</a>
          <a href={site.repository}>Source code</a>
          <Link href="/releases/">Releases</Link>
          <Link href="/security/">Security</Link>
        </div>
        <div>
          <h2>Site</h2>
          <Link href="/blog/">Engineering notes</Link>
          <a href="/sitemap.xml">Sitemap</a>
          <a href="/llms.txt">llms.txt</a>
          <a href="/manifest.webmanifest">Web manifest</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>AgentSight v{site.version} · MIT licensed · Built by the Eunomia community</span>
        <a href={site.websiteRepository}>Website source ↗</a>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
