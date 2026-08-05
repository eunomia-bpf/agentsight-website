import type { Metadata } from 'next';
import { HubPage } from '@/components/ContentPages';
import { hubConfig } from '@/lib/site';

const config = hubConfig.blog;
export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  alternates: { canonical: config.path },
};

export default function BlogPage() {
  return <HubPage kind="blog" />;
}
