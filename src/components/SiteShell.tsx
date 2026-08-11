import Link from 'next/link';
import type { ReactNode } from 'react';
import { navigation, site } from '@/lib/site';

const eunomiaVisualFoundation = `
:root {
  --ink: #091627;
  --muted: #526174;
  --subtle: #7b8798;
  --line: #e2e8f0;
  --paper: #f8fafc;
  --white: #ffffff;
  --panel: #0b1220;
  --orange: #ff9f1c;
  --pink: #2f66ff;
  --purple: #00b894;
  --green: #00b894;
  --accent: #0e7490;
  --accent-dark: #155e75;
  --shadow: 0 18px 60px rgb(9 22 39 / 10%);
}
body {
  background: #f8fafc;
  color: #091627;
}
a:focus-visible,
button:focus-visible {
  outline-color: #0891b2;
}
::selection {
  background: #cffafe;
  color: #091627;
}
.site-header {
  border-color: rgb(226 232 240 / 92%);
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 1px 0 rgb(15 23 42 / 2%);
}
.logo strong { color: #091627; }
.logo small { color: #64748b; }
.primary-nav { color: #475569; }
.primary-nav a:hover,
.header-github:hover { color: #0e7490; }
.header-github { color: #64748b; }
.button { border-radius: 6px; }
.button-accent {
  background: #091627;
  color: #fff;
  box-shadow: 0 8px 22px rgb(9 22 39 / 14%);
}
.button-accent:hover {
  background: #17263a;
  box-shadow: 0 10px 28px rgb(9 22 39 / 18%);
}
.button-dark { background: #091627; }
.button-dark:hover { background: #17263a; }
.button-outline {
  border-color: #cbd5e1;
  background: #fff;
  color: #334155;
}
.button-outline:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}
.page-hero {
  border-color: #e2e8f0;
  background:
    linear-gradient(to bottom, rgb(207 250 254 / 62%), rgb(236 254 255 / 34%) 38%, #fff 82%),
    #fff;
}
.page-hero::after {
  background-image:
    linear-gradient(rgb(15 23 42 / 5%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(15 23 42 / 5%) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: linear-gradient(to bottom, #000, transparent 92%);
}
.page-hero h1,
.compact-hero h1,
.detail-hero h1 {
  color: #091627;
  font-family: Georgia, Cambria, "Times New Roman", serif;
  font-weight: 500;
  letter-spacing: -0.045em;
}
.eyebrow,
.card-label {
  color: #0e7490;
  letter-spacing: 0.14em;
}
.section-white { background: #fff; }
.content-card,
.feature-card,
.metric-card {
  border-color: #e2e8f0;
  border-radius: 10px;
  box-shadow: none;
}
.content-card { background: #fff; }
.content-card:hover {
  border-color: rgb(14 116 144 / 42%);
  background: #fbfdff;
  box-shadow: 0 16px 44px rgb(9 22 39 / 8%);
}
.content-card::before {
  height: 2px;
  background: linear-gradient(90deg, #0891b2, #2f66ff, #ff9f1c);
}
.content-card h2 a:hover,
.arrow-link,
.source-section a { color: #0e7490; }
.breadcrumbs { color: #64748b; }
.breadcrumbs a::after { color: #cbd5e1; }
.outcome-list li {
  border-color: #e2e8f0;
  border-radius: 8px;
  background: rgb(255 255 255 / 90%);
  color: #475569;
}
.outcome-list span { color: #0e7490; }
.detail-section { background: #f8fafc; }
.article-body {
  border-color: #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 14px 46px rgb(9 22 39 / 6%);
}
.article-body > section + section { border-color: #edf2f7; }
.article-body h2 { color: #091627; }
.article-body p { color: #526174; }
.detail-aside {
  border-color: #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 12px 36px rgb(9 22 39 / 6%);
}
.detail-aside .arrow-link {
  border-color: #edf2f7;
  color: #475569;
}
.detail-aside .arrow-link:hover { color: #0e7490; }
.detail-aside hr { border-color: #edf2f7; }
.command-block {
  border-color: #1e293b;
  border-radius: 8px;
  background: #0b1220;
  color: #e2e8f0;
  box-shadow: 0 18px 48px rgb(9 22 39 / 14%);
}
.command-title { border-color: #1e293b; color: #94a3b8; }
.command-title span { color: #34d399; }
.dark-section { background: #091627; }
.dark-section .eyebrow { color: #67e8f9; }
.dark-grid > div > p { color: #cbd5e1; }
.workflow-list li {
  border-color: #26364a;
  border-radius: 8px;
  background: #101d2d;
}
.workflow-list li > span {
  border-radius: 6px;
  background: #0e7490;
}
.workflow-list p { color: #aebed0; }
.timeline article { border-color: #cbd5e1; }
.timeline article::before {
  background: #0891b2;
  box-shadow: 0 0 0 1px #67e8f9;
}
.site-footer {
  border-top-color: #dbe3ec;
  background: #091627;
  color: #e2e8f0;
}
.site-footer .logo strong { color: #f8fafc; }
.site-footer .logo small { color: #94a3b8; }
.site-footer h2 { color: #f8fafc; }
.site-footer a { color: #cbd5e1; }
.site-footer a:hover { color: #67e8f9; }
.footer-copy { color: #aebed0; }
.footer-bottom {
  border-top-color: #223247;
  color: #94a3b8;
}
@media (max-width: 820px) {
  .site-header { backdrop-filter: blur(14px); }
}
`;

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="AgentSight home">
      <svg viewBox="0 0 36 36" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="agentsight-mark" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff9f1c" />
            <stop offset="0.5" stopColor="#2f66ff" />
            <stop offset="1" stopColor="#00b894" />
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="9" fill="#091627" />
        <path d="M7 18c2.9-5.1 6.6-7.6 11-7.6S26.1 12.9 29 18c-2.9 5.1-6.6 7.6-11 7.6S9.9 23.1 7 18Z" fill="none" stroke="url(#agentsight-mark)" strokeWidth="2.7" />
        <circle cx="18" cy="18" r="4.2" fill="url(#agentsight-mark)" />
        <circle cx="18" cy="18" r="1.5" fill="#091627" />
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
          <a className="button button-accent header-cta" href={site.demo}>Open app</a>
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
          <a href={site.demo}>Hosted app</a>
          <Link href="/use-cases/">Use cases</Link>
          <Link href="/architecture/">Architecture</Link>
          <Link href="/integrations/">Integrations</Link>
          <Link href="/compare/">Compare</Link>
          <Link href="/pricing/">Pricing</Link>
        </div>
        <div>
          <h2>Resources</h2>
          <a href={site.docs}>Documentation</a>
          <Link href="/guides/">Guides</Link>
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
      <style>{eunomiaVisualFoundation}</style>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
