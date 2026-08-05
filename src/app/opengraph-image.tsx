import { ImageResponse } from 'next/og';

export const alt = 'AgentSight — system-level observability for AI agents';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 78px',
        background: 'linear-gradient(135deg, #101828 0%, #1d2939 58%, #143b75 100%)',
        color: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <div
          style={{
            width: 74,
            height: 74,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #84adff',
            borderRadius: 18,
            color: '#b2ccff',
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          AS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: 2 }}>AGENTSIGHT</span>
          <span style={{ marginTop: 4, color: '#98a2b3', fontSize: 20 }}>by Eunomia</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 940 }}>
        <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04 }}>
          Profile AI agents like programs.
        </div>
        <div style={{ marginTop: 28, color: '#d0d5dd', fontSize: 27, lineHeight: 1.45 }}>
          Connect intent and model calls to commands, files, processes, network activity, and resource use.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 15, color: '#b2ccff', fontSize: 18 }}>
        <span>Local-first</span><span>·</span><span>Zero SDK</span><span>·</span><span>Open source</span>
      </div>
    </div>,
    size,
  );
}
