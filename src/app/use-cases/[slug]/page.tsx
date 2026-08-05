import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ContentDetail } from '@/components/ContentPages';
import { getPage, getPages } from '@/lib/public-content';
import { contentMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPages('use-case').map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage('use-case', slug);
  return page ? contentMetadata(page) : {};
}

export default async function UseCaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getPage('use-case', slug);
  if (!page) notFound();
  return <ContentDetail page={page} />;
}
