import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from './Icons';
import { navigation, site } from '@/lib/site';

export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`brand-mark-svg ${className}`.trim()}
      viewBox="0 0 64 64"
      role="img"
      aria-label="AgentSight trace lens"
    >
      <rect width="64" height="64" rx="16" fill="currentColor" />
      <path
        d="M11 32c5.2-9.2 12.2-13.8 21-13.8S47.8 22.8 53 32c-5.2 9.2-12.2 13.8-21 13.8S16.2 41.2 11 32Z"
        fill="none"
        stroke="var(--brand-blue, #9BB7FF)"
        strokeWidth="4"
      />
      <circle cx="32" cy="32" r="7.2" fill="var(--brand-mint, #62E2B6)" />
      <circle cx="32" cy="32" r="2.8" fill="#07111f" />
      <path d="M39.2 39.2 48 48" stroke="var(--brand-amber, #F7C65D)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="50" r="3" fill="var(--brand-amber, #F7C65D)" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="AgentSight home">
      <span className="logo-mark" aria-hidden="true">
        <BrandMark />
      </span>
      <span className="logo-copy">
        <strong>AgentSight</strong>
        <small>System evidence for AI agents</small>
      </span>
    </Link>
  );
}

function NavigationLinks() {
  return (
    <>
      {navigation.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />
        <nav className="primary-nav" aria-label="Primary navigation">
          <NavigationLinks />
        </nav>
        <a className="release-chip" href={site.releaseUrl} aria-label={`AgentSight release ${site.version}`}>
          <span className="release-dot" aria-hidden="true" />
          v{site.version}
        </a>
        <a className="button button-dark header-cta" href={site.repository}>
          <Icon name="github" size={17} />
          GitHub
        </a>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">
            <span />
            <span />
            <span />
          </summary>
          <nav className="mobile-menu-panel" aria-label="Mobile navigation">
            <NavigationLinks />
            <Link href="/about/">About</Link>
            <a href={site.demo}>Recorded demo</a>
            <a href={site.repository}>GitHub</a>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-lead">
        <div>
          <p className="footer-kicker">Observe what the machine did.</p>
          <h2>Turn an opaque agent run into reviewable system evidence.</h2>
        </div>
        <div className="footer-actions">
          <a className="button button-light" href={site.demo}>Explore the recorded demo</a>
          <Link className="button button-ghost" href="/guides/getting-started/">Start recording</Link>
        </div>
      </div>
      <div className="shell footer-grid">
        <div>
          <Logo />
          <p className="footer-copy">
            Open-source, local-first observability for AI agents at the boundary where intent becomes system effects.
          </p>
          <div className="footer-status">
            <span className="release-dot" aria-hidden="true" />
            Current release v{site.version}
          </div>
        </div>
        <div>
          <h2>Evidence</h2>
          <Link href="/runs/">Run library</Link>
          <Link href="/use-cases/">Use cases</Link>
          <Link href="/methodology/">Methodology</Link>
          <Link href="/security/">Security</Link>
        </div>
        <div>
          <h2>Learn</h2>
          <Link href="/guides/">Guides</Link>
          <Link href="/compare/">Compare</Link>
          <Link href="/integrations/">Integrations</Link>
          <Link href="/blog/">Engineering notes</Link>
        </div>
        <div>
          <h2>Project</h2>
          <a href={site.docs}>Documentation</a>
          <a href={site.repository}>Source code</a>
          <Link href="/changelog/">Changelog</Link>
          <Link href="/about/">About</Link>
        </div>
        <div>
          <h2>Machine readable</h2>
          <a href="/sitemap.xml">Sitemap</a>
          <a href="/llms.txt">llms.txt</a>
          <a href="/manifest.webmanifest">Web manifest</a>
          <a href="/brand/logo-mark.svg">Logo asset</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>MIT licensed · Built by the Eunomia community</span>
        <span>
          <a href={site.websiteRepository}>Website source</a>
          <span aria-hidden="true"> · </span>
          <a href={site.organization.url}>Eunomia</a>
        </span>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}
