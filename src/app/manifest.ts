import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'AgentSight — AI agent system observability',
    short_name: 'AgentSight',
    description: site.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#f5f7fb',
    theme_color: '#07111f',
    categories: ['developer tools', 'productivity', 'security'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
    shortcuts: [
      {
        name: 'Recorded demo',
        short_name: 'Demo',
        description: 'Explore a recorded AgentSight session.',
        url: site.demo,
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Getting started',
        short_name: 'Start',
        description: 'Record and inspect your first agent run.',
        url: '/guides/getting-started/',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Run library',
        short_name: 'Runs',
        description: 'Browse evidence-oriented run workflows.',
        url: '/runs/',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
