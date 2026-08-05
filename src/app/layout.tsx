import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'AgentSight: System-level observability for AI agents',
    template: '%s | AgentSight',
  },
  description: site.description,
  applicationName: site.name,
  category: 'DeveloperApplication',
  keywords: [
    'AI agent observability',
    'AI agent profiling',
    'eBPF',
    'Claude Code observability',
    'Codex observability',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: 'AgentSight: System-level observability for AI agents',
    description: site.description,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentSight: System-level observability for AI agents',
    description: site.description,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#101828',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
