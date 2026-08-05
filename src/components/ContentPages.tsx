import Link from 'next/link';
import { ArrowLink, CommandBlock, Eyebrow, IconBadge, JsonLd, OutcomeList, PageMeta } from './PageParts';
import { Icon, type IconName } from './Icons';
import { SiteShell } from './SiteShell';
import { contentPath, getPages, type ContentKind, type ContentPage } from '@/lib/content';
import { hubConfig, site } from '@/lib/site';

const kindIcon: Record<ContentKind, IconName> = {
  'use-case': 'activity',
  comparison: 'layers',
  guide: 'terminal',
  blog: 'trace',
  integration: 'process',
  landing: 'eye',
};

export function ContentCard({ page }: { page: ContentPage }) {
  return (
    <article className="content-card">
      <div className="card-topline">
        <IconBadge name={kindIcon[page.kind]} />
        <p className="card-label">{page.eyebrow}</p>
      </div>
      <h2>
        <Link href={contentPath(page)}>{page.title}</Link>
      </h2>
      <p>{page.description}</p>
      <div className="card-footer">
        <span>Verified for v{site.version}</span>
        <ArrowLink href={contentPath(page)}>Read the page</ArrowLink>
      </div>
    </article>
  );
}

export function HubPage({ kind }: { kind: Exclude<ContentKind, 'landing'> }) {
  const config = hubConfig[kind];
  const pages = getPages(kind);
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.title,
    description: config.description,
    url: `${site.url}${config.path}`,
    isPartOf: { '@type': 'WebSite', name: site.name, url: site.url },
    hasPart: pages.map((page) => ({
      '@type': 'TechArticle',
      name: page.title,
      description: page.description,
      url: `${site.url}${contentPath(page)}`,
    })),
  };

  return (
    <SiteShell>
      <JsonLd value={collection} />
      <section className="page-hero compact-hero">
        <div className="shell narrow">
          <Eyebrow>{config.eyebrow}</Eyebrow>
          <h1>{config.title}</h1>
          <p className="hero-lede">{config.description}</p>
          <PageMeta version={site.version} reviewed="August 2026" author="Eunomia" />
        </div>
      </section>
      <section className="section">
        <div className="shell card-grid">
          {pages.map((page) => (
            <ContentCard key={page.slug} page={page} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

export function ContentDetail({ page }: { page: ContentPage }) {
  const path = contentPath(page);
  const hub = page.kind === 'landing' ? undefined : hubConfig[page.kind];
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'AgentSight', item: site.url },
    ...(hub
      ? [{ '@type': 'ListItem', position: 2, name: hub.eyebrow, item: `${site.url}${hub.path}` }]
      : []),
    { '@type': 'ListItem', position: hub ? 3 : 2, name: page.title, item: `${site.url}${path}` },
  ];
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: page.title,
      description: page.description,
      url: `${site.url}${path}`,
      dateModified: site.updatedAt,
      author: {
        '@type': 'Person',
        name: site.maintainer.name,
        url: site.maintainer.url,
      },
      publisher: {
        '@type': 'Organization',
        name: site.organization.name,
        url: site.organization.url,
        logo: { '@type': 'ImageObject', url: `${site.url}/icon-512.png` },
      },
      about: {
        '@type': 'SoftwareApplication',
        name: site.name,
        softwareVersion: site.version,
        applicationCategory: 'DeveloperApplication',
      },
      image: `${site.url}/opengraph-image`,
    },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbItems },
  ];

  return (
    <SiteShell>
      <JsonLd value={jsonLd} />
      <section className="page-hero detail-hero">
        <div className="shell narrow">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {hub ? <Link href={hub.path}>{hub.eyebrow}</Link> : null}
            <span aria-current="page">{page.title}</span>
          </nav>
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <h1>{page.title}</h1>
          <p className="hero-lede">{page.lede}</p>
          <PageMeta version={site.version} reviewed="August 5, 2026" author={site.maintainer.name} />
          <OutcomeList items={page.outcomes} />
        </div>
      </section>
      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            <div className="evidence-boundary">
              <Icon name="shield" size={21} />
              <div>
                <strong>Evidence boundary</strong>
                <p>
                  Product claims on this page are checked against AgentSight v{site.version}. Observed system effects require a recorded run; absence of an event is not proof that an effect was impossible.
                </p>
              </div>
            </div>
            {page.sections.map((section, index) => (
              <section key={section.title}>
                <p className="section-index">0{index + 1}</p>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}
            {page.command ? <CommandBlock commands={page.command} /> : null}
            {page.sources?.length ? (
              <section className="source-section">
                <p className="section-index">Sources</p>
                <h2>Primary sources</h2>
                <ul>
                  {page.sources.map((source) => (
                    <li key={source.href}>
                      <a href={source.href}>{source.label}</a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <div className="author-card">
              <img
                src={site.maintainer.avatar}
                width="64"
                height="64"
                alt={`${site.maintainer.name} GitHub avatar`}
                loading="lazy"
              />
              <div>
                <p className="card-label">Maintained by</p>
                <strong>{site.maintainer.name}</strong>
                <p>
                  AgentSight and the Eunomia open-source community connect AI-agent behavior to operating-system evidence.
                </p>
              </div>
              <a href={site.maintainer.url} aria-label={`${site.maintainer.name} on GitHub`}>
                <Icon name="github" size={20} />
              </a>
            </div>
          </article>
          <aside className="detail-aside">
            <p className="card-label">Continue exploring</p>
            {page.related.map((item) => (
              <ArrowLink key={item.href} href={item.href}>
                {item.label}
              </ArrowLink>
            ))}
            <hr />
            <div className="aside-fact">
              <span>Current release</span>
              <strong>v{site.version}</strong>
            </div>
            <div className="aside-fact">
              <span>Data path</span>
              <strong>Local-first</strong>
            </div>
            <a className="button button-accent" href={site.demo}>
              Open the recorded demo
            </a>
            <a className="button button-outline" href={site.repository}>
              View AgentSight on GitHub
            </a>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
