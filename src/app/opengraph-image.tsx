import { ImageResponse } from 'next/og';

export const alt = 'AgentSight — profile AI agents like programs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

function BrandMark() {
  return (
    <div
      style={{
        width: 88,
        height: 88,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        background: '#07111f',
        border: '1px solid #263852',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: 58,
          height: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid #9bb7ff',
          borderRadius: '50%',
        }}
      >
        <div style={{ width: 15, height: 15, borderRadius: 999, background: '#62e2b6' }} />
      </div>
      <div style={{ position: 'absolute', width: 22, height: 4, right: 8, bottom: 13, borderRadius: 8, background: '#f7c65d', transform: 'rotate(45deg)' }} />
    </div>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '62px 68px',
        background: '#07111f',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', width: 620, height: 620, right: -180, top: -270, borderRadius: 999, background: 'radial-gradient(circle, rgba(74,125,255,.28) 0%, rgba(7,17,31,0) 68%)' }} />
      <div style={{ position: 'absolute', width: 420, height: 420, left: -180, bottom: -250, borderRadius: 999, background: 'radial-gradient(circle, rgba(98,226,182,.17) 0%, rgba(7,17,31,0) 70%)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <BrandMark />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1 }}>AgentSight</span>
          <span style={{ marginTop: 5, color: '#a9b6ca', fontSize: 20 }}>System evidence for AI agents</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 15px', border: '1px solid #30415c', borderRadius: 999, color: '#cbd5e1', fontSize: 18 }}>
          <span style={{ width: 9, height: 9, borderRadius: 999, background: '#62e2b6' }} />
          Open source · v0.2.67
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 930 }}>
        <div style={{ color: '#9bb7ff', fontSize: 22, fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase' }}>
          Intent → model → process → effects
        </div>
        <div style={{ marginTop: 22, fontSize: 72, fontWeight: 800, letterSpacing: -4.2, lineHeight: 1.02 }}>
          Profile AI agents like programs.
        </div>
        <div style={{ marginTop: 24, color: '#cbd5e1', fontSize: 26, lineHeight: 1.4 }}>
          Connect prompts and model calls to commands, files, processes, network activity, and resource use.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {['Local-first', 'Zero SDK', 'Causal run profiles', 'Reviewable artifacts'].map((label) => (
          <span key={label} style={{ padding: '9px 14px', border: '1px solid #30415c', borderRadius: 999, color: '#b8c5d8', fontSize: 17 }}>
            {label}
          </span>
        ))}
      </div>
    </div>,
    size,
  );
}
