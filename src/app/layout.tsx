import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import './styles/base.css';
import './styles/home.css';
import './styles/content.css';
import './styles/responsive.css';
import { site } from '@/lib/site';

const googleAnalyticsId = 'G-VVRNSCMWBX';

const socialImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'AgentSight — system-level observability for AI agents',
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'AgentSight: System-level observability for AI agents',
    template: '%s | AgentSight',
  },
  description: site.description,
  applicationName: site.name,
  category: 'DeveloperApplication',
  authors: [{ name: site.maintainer.name, url: site.maintainer.url }],
  creator: site.maintainer.name,
  publisher: site.organization.name,
  keywords: [
    'AI agent observability',
    'AI agent profiling',
    'coding agent tracing',
    'system-level observability',
    'Agent Flamegraph',
    'eBPF',
    'Claude Code observability',
    'Codex observability',
  ],
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: 'AgentSight: System-level observability for AI agents',
    description: site.description,
    url: '/',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentSight: System-level observability for AI agents',
    description: site.description,
    images: ['/opengraph-image'],
  },
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
  appleWebApp: {
    capable: true,
    title: site.name,
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f7fb' },
    { media: '(prefers-color-scheme: dark)', color: '#07111f' },
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
