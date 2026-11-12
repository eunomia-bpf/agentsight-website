import { ImageResponse } from 'next/og';

export const alt = 'AgentSight — observe and evolve AI agents with AI agents';
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
        padding: '64px 72px',
        background:
          'radial-gradient(circle at 82% 18%, rgba(232,72,177,.35), transparent 31%), radial-gradient(circle at 92% 72%, rgba(255,122,61,.26), transparent 25%), linear-gradient(135deg, #0b0b10 0%, #15151f 72%, #231420 100%)',
        color: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          style={{
            width: 62,
            height: 62,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #e848b1',
            borderRadius: 17,
            background: '#17171f',
          }}
        >
          <div
            style={{
              width: 28,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #ff8b4b',
              borderRadius: '50%',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e848b1' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>AgentSight</span>
          <span style={{ marginTop: 2, color: '#aaaab7', fontSize: 17 }}>by Eunomia · open source</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1000 }}>
        <div style={{ fontSize: 60, fontWeight: 850, letterSpacing: -3.6, lineHeight: 1 }}>
          Observe and evolve your AI agents — with AI agents.
        </div>
        <div style={{ marginTop: 26, color: '#c7c7d2', fontSize: 25, lineHeight: 1.42 }}>
          Runtime evidence → diagnosis → skill evolution → evaluation and rollback.
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#d8d8e1', fontSize: 17 }}>
        <span>Local first</span><span style={{ color: '#ff8b4b' }}>•</span><span>Linux + eBPF</span>
        <span style={{ color: '#e848b1' }}>•</span><span>Evidence-gated evolution</span>
      </div>
    </div>,
    size,
  );
}