import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ContentDetail } from '@/components/ContentPages';
import { McpServerAuditGuide } from '@/components/McpServerAuditGuide';
import { getPage, getPages } from '@/lib/public-content';
import { contentMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return getPages('landing').map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage('landing', slug);
  return page ? contentMetadata(page) : {};
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const page = getPage('landing', slug);
  if (!page) notFound();
  return slug === 'mcp-server-audit' ? <McpServerAuditGuide page={page} /> : <ContentDetail page={page} />;
}
