import Link from 'next/link';
import type { ReactNode } from 'react';
import { navigation, site } from '@/lib/site';

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="AgentSight home">
      <span className="logo-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>
        <strong>AgentSight</strong>
        <small>by Eunomia</small>
      </span>
    </Link>
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
        <a className="button button-dark header-cta" href={site.repository}>
          GitHub <span aria-hidden="true">↗</span>
        </a>
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
            Open-source, local-first observability for AI agents at the boundary where intent becomes system effects.
          </p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/use-cases/">Use cases</Link>
          <Link href="/compare/">Compare</Link>
          <Link href="/guides/">Guides</Link>
          <Link href="/integrations/">Integrations</Link>
        </div>
        <div>
          <h2>Project</h2>
          <a href={site.docs}>Documentation</a>
          <a href={site.repository}>Source code</a>
          <Link href="/releases/">Releases</Link>
          <Link href="/security/">Security</Link>
        </div>
        <div>
          <h2>Machine readable</h2>
          <a href="/sitemap.xml">Sitemap</a>
          <a href="/llms.txt">llms.txt</a>
          <a href="/manifest.webmanifest">Web manifest</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>MIT licensed · Built by the Eunomia community</span>
        <a href={site.websiteRepository}>Website source</a>
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
