import Link from 'next/link';
import { ArrowLink, CommandBlock, Eyebrow, JsonLd, OutcomeList } from './PageParts';
import { SiteShell } from './SiteShell';
import { contentPath, getPages, type ContentKind, type ContentPage } from '@/lib/content';
import { hubConfig, site } from '@/lib/site';

export function ContentCard({ page }: { page: ContentPage }) {
  return (
    <article className="content-card">
      <p className="card-label">{page.eyebrow}</p>
      <h2>
        <Link href={contentPath(page)}>{page.title}</Link>
      </h2>
      <p>{page.description}</p>
      <ArrowLink href={contentPath(page)}>Read the page</ArrowLink>
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
    hasPart: pages.map((page) => ({
      '@type': 'WebPage',
      name: page.title,
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
      author: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
      publisher: { '@type': 'Organization', name: 'Eunomia', url: 'https://eunomia.dev/' },
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
          <OutcomeList items={page.outcomes} />
        </div>
      </section>
      <section className="section detail-section">
        <div className="shell detail-grid">
          <article className="article-body">
            {page.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}
            {page.command ? <CommandBlock commands={page.command} /> : null}
            {page.sources?.length ? (
              <section className="source-section">
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
          </article>
          <aside className="detail-aside">
            <p className="card-label">Continue exploring</p>
            {page.related.map((item) => (
              <ArrowLink key={item.href} href={item.href}>
                {item.label}
              </ArrowLink>
            ))}
            <hr />
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
