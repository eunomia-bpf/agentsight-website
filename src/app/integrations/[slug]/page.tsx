import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ContentDetail } from '@/components/ContentPages';
import { getPage, getPages } from '@/lib/public-content';
import { contentMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return getPages('integration').map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage('integration', slug);
  return page ? contentMetadata(page) : {};
}

export default async function IntegrationDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getPage('integration', slug);
  if (!page) notFound();
  return <ContentDetail page={page} />;
}
