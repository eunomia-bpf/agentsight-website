import type { SVGProps } from 'react';

export type IconName =
  | 'activity'
  | 'arrow'
  | 'check'
  | 'code'
  | 'eye'
  | 'file'
  | 'flame'
  | 'github'
  | 'globe'
  | 'layers'
  | 'network'
  | 'process'
  | 'search'
  | 'shield'
  | 'spark'
  | 'terminal'
  | 'time'
  | 'token'
  | 'trace';

export function Icon({
  name,
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  };

  switch (name) {
    case 'activity':
      return <svg {...common}><path d="M3 12h4l2.2-6 4.2 12 2.1-6H21" /></svg>;
    case 'arrow':
      return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'check':
      return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
    case 'code':
      return <svg {...common}><path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" /></svg>;
    case 'eye':
      return <svg {...common}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.7" /></svg>;
    case 'file':
      return <svg {...common}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>;
    case 'flame':
      return <svg {...common}><path d="M13.5 2.5c.4 3.1-1.8 4.3-1 6.5.6 1.5 2 1.7 2.8.8.9-1 .8-2.6.8-2.6 2.3 2 3.4 4.2 3.4 6.7A7.5 7.5 0 0 1 4.5 14c0-3.7 2.1-6.6 5.7-9.6-.3 2.2.3 3.6 1.4 4.1" /><path d="M9.2 16.3c0-1.6 1-2.9 2.8-4.3.1 1.3.8 1.9 1.7 2.6.7.5 1.1 1.2 1.1 2a2.8 2.8 0 0 1-5.6-.3Z" /></svg>;
    case 'github':
      return <svg {...common}><path d="M15 22v-3.9c0-1 .1-1.6-.5-2.2 2.8-.3 5.7-1.4 5.7-6.2 0-1.4-.5-2.5-1.3-3.4.1-.3.6-1.7-.1-3.4 0 0-1.1-.3-3.5 1.3a12 12 0 0 0-6.4 0C6.5 2.6 5.4 3 5.4 3c-.7 1.7-.2 3.1-.1 3.4A4.9 4.9 0 0 0 4 9.7c0 4.8 2.9 5.9 5.7 6.2-.4.4-.7.9-.8 1.7-.8.4-2.6 1-3.8-1.1-.7-1.1-2-1.2-2-1.2" /><path d="M9 22v-4.2" /></svg>;
    case 'globe':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z" /></svg>;
    case 'layers':
      return <svg {...common}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></svg>;
    case 'network':
      return <svg {...common}><circle cx="5" cy="12" r="2.5" /><circle cx="19" cy="5" r="2.5" /><circle cx="19" cy="19" r="2.5" /><path d="m7.3 10.8 9.3-4.6M7.3 13.2l9.3 4.6" /></svg>;
    case 'process':
      return <svg {...common}><rect x="3" y="4" width="8" height="6" rx="1.5" /><rect x="13" y="14" width="8" height="6" rx="1.5" /><path d="M7 10v3a3 3 0 0 0 3 3h3M17 14v-3a3 3 0 0 0-3-3h-3" /></svg>;
    case 'search':
      return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
    case 'shield':
      return <svg {...common}><path d="M12 3 20 6v5c0 5.2-3.2 8.5-8 10-4.8-1.5-8-4.8-8-10V6l8-3Z" /><path d="m9 12 2 2 4-5" /></svg>;
    case 'spark':
      return <svg {...common}><path d="m12 2 1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></svg>;
    case 'terminal':
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3M12 15h5" /></svg>;
    case 'time':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case 'token':
      return <svg {...common}><path d="m12 3 7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z" /><path d="m8.4 9 3.6-2 3.6 2v4L12 15l-3.6-2V9Z" /></svg>;
    case 'trace':
      return <svg {...common}><circle cx="5" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="M7 6h3a2 2 0 0 1 2 2v8a2 2 0 0 0 2 2h3M5 8v7a3 3 0 0 0 3 3h2" /></svg>;
    default:
      return null;
  }
}
