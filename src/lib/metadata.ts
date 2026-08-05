import type { Metadata } from 'next';
import { contentPath, type ContentPage } from './content';
import { site } from './site';

const socialImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'AgentSight — system-level observability for AI agents',
};

export function contentMetadata(page: ContentPage): Metadata {
  const path = contentPath(page);
  return {
    title: page.title,
    description: page.description,
    authors: [{ name: site.maintainer.name, url: site.maintainer.url }],
    creator: site.maintainer.name,
    publisher: site.organization.name,
    alternates: { canonical: path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: path,
      type: 'article',
      siteName: site.name,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: ['/opengraph-image'],
    },
  };
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    authors: [{ name: site.maintainer.name, url: site.maintainer.url }],
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      siteName: site.name,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
  };
}
