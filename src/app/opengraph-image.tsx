import { ImageResponse } from 'next/og';

export const alt = 'FlightDev — Plataformas SaaS y software empresarial en Colombia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Default social card for every page that does not define its own. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: 'linear-gradient(135deg,#0C2340 0%,#0A1428 70%)', color: '#EEF2F7', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 100 100"><polygon points="4,50 96,8 40,64" fill="#7DB8FF" /><polygon points="40,64 96,8 54,94" fill="#2F8CFF" /></svg>
          <span style={{ fontSize: 40, fontWeight: 700 }}>flightdev</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>Construimos tecnología que transforma operaciones empresariales.</span>
          <span style={{ fontSize: 28, color: '#93A4BD' }}>Vendra POS · FleetTrack Pro · Software a la medida · Colombia</span>
        </div>
        <div style={{ display: 'flex', height: 6, width: 220, background: '#B4E854', borderRadius: 3 }} />
      </div>
    ),
    size,
  );
}
