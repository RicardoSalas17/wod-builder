import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: 'linear-gradient(135deg, #08140f 0%, #173223 100%)',
        color: '#4CAD38',
        display: 'flex',
        fontSize: 20,
        fontWeight: 800,
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      WB
    </div>,
    size,
  );
}
