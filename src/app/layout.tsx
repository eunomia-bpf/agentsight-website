import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import './globals.css';
import { site } from '@/lib/site';

const googleAnalyticsId = 'G-VVRNSCMWBX';

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
