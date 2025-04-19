import { ImageResponse } from 'next/og';

export const alt = 'TabSort - Ordinal Judge Preferences for Debate';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to right, #fbbf24, #f97316, #d946ef)', /* amber-400, orange-500, fuchsia-600 */
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: '128px', fontWeight: 'bold', marginBottom: '20px' }}>TabSort</div>
        <div style={{ fontSize: '48px', maxWidth: '80%' }}>
          Ordinal Judge Preferences for Debate
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
