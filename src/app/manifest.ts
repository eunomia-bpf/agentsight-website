import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AgentSight — AI agent observability',
    short_name: 'AgentSight',
    description: 'Open-source, local-first observability for AI agents.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0b0b10',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
