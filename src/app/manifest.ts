import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AgentSight',
    short_name: 'AgentSight',
    description: 'System-level observability for AI agents.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f7f9',
    theme_color: '#101828',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
