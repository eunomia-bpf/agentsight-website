import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ContentDetail } from '@/components/ContentPages';
import { SystemBoundaryArticle } from '@/components/SystemBoundaryArticle';
import { getPage, getPages } from '@/lib/public-content';
import { contentMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return getPages('blog').map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage('blog', slug);
  if (!page) return {};
  if (slug === 'system-boundary-observability') {
    return {
      ...contentMetadata(page),
      description:
        'A primary-source boundary map for native agent telemetry, tool protocols, system execution, provider traffic, and AgentSight v1.0.30 OpenTelemetry export limits.',
      openGraph: {
        type: 'article',
        title: page.title,
        description:
          'Choose the evidence boundary that can answer the question, then see exactly what AgentSight v1.0.30 exports to OpenTelemetry and what remains in system-native provenance.',
        url: '/blog/system-boundary-observability/',
      },
      twitter: {
        card: 'summary_large_image',
        title: page.title,
        description:
          'Native agent telemetry is increasingly rich. This refreshed boundary map shows when system evidence is still needed and what AgentSight v1.0.30 actually exports to OTel.',
      },
    };
  }
  return contentMetadata(page);
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getPage('blog', slug);
  if (!page) notFound();
  if (slug === 'system-boundary-observability') return <SystemBoundaryArticle />;
  return <ContentDetail page={page} />;
}
