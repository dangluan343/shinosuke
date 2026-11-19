import type { Metadata } from 'next';
import Link from 'next/link';
import RigA from '@/components/rig/RigA';

export const metadata: Metadata = { title: 'Rig A – lắc hông (bản dựng thử)' };

export default function RigAPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#EAE8FD',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 16,
      }}
    >
      <RigA className="rig-a-stage" />
      <p style={{ font: '500 14px/1.4 system-ui, sans-serif', color: '#4b3f7a', textAlign: 'center', margin: 0 }}>
        Di chuột để nghiêng theo · rê lên quần để đỏ mặt · bấm (hoặc Tab + Enter) để chọc ·{' '}
        <Link href="/rig-lab?rig=a" style={{ textDecoration: 'underline' }}>
          trang lab
        </Link>
      </p>
      <style>{`.rig-a-stage { height: min(82vh, 760px); width: auto; max-width: 100%; }`}</style>
    </main>
  );
}
