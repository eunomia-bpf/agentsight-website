import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import './globals.css';
import { site } from '@/lib/site';

const googleAnalyticsId = 'G-VVRNSCMWBX';

const socialImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'AgentSight — open-source observability for AI agents',
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'AgentSight: Open-source observability for AI agents',
    template: '%s | AgentSight',
  },
  description: site.description,
  applicationName: site.name,
  category: 'DeveloperApplication',
  authors: [{ name: 'Eunomia', url: 'https://eunomia.dev/' }],
  creator: 'Eunomia',
  publisher: 'Eunomia',
  keywords: [
    'AI agent observability',
    'AI agent profiling',
    'coding agent monitoring',
    'eBPF observability',
    'Claude Code observability',
    'Codex observability',
    'Agent Flamegraph',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: 'AgentSight: See what AI agents actually do',
    description: site.description,
    url: '/',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentSight: See what AI agents actually do',
    description: site.description,
    images: ['/opengraph-image'],
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0b10' },
  ],
  colorScheme: 'light',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', {
                page_location: window.location.origin + window.location.pathname,
                page_path: window.location.pathname,
                page_title: document.title,
                allow_google_signals: false,
                allow_ad_personalization_signals: false
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
