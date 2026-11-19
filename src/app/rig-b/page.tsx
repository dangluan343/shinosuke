import type { Metadata } from 'next';
import Link from 'next/link';
import RigB from '@/components/rig/RigB';

export const metadata: Metadata = { title: 'Rig B – chổng mông đi (bản dựng thử)' };

export default function RigBPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#C6ADEF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 16,
        padding: '16px 0',
        overflow: 'hidden',
      }}
    >
      <RigB roam />
      <p style={{ font: '500 14px/1.4 system-ui, sans-serif', color: '#3b2f6b', textAlign: 'center', margin: 0, padding: '0 16px' }}>
        Tự chạy qua lại và lật khi chạm mép · đưa chuột chặn trước mặt để đuổi quay lại ·
        bấm (hoặc Tab + Enter) để cười rồi quay đầu ·{' '}
        <Link href="/rig-lab?rig=b" style={{ textDecoration: 'underline' }}>trang lab</Link> ·{' '}
        <Link href="/rig-a" style={{ textDecoration: 'underline' }}>Rig A</Link>
      </p>
    </main>
  );
}
