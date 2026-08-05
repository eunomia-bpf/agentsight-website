import type { Metadata } from 'next';
import { contentPath, type ContentPage } from './content';

export function contentMetadata(page: ContentPage): Metadata {
  const path = contentPath(page);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: path,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
    },
  };
}
