import type { Metadata } from 'next';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { Footer } from '@/components/layout/Footer';
import RigLab from '@/components/rig/lab/RigLab';

export const metadata: Metadata = {
  title: 'Rig Lab – SHIN-CHAN! Fan Hub',
  description: 'So rig với ảnh gốc, chạy thử animation và chỉnh từng thông số của Rig A (lắc hông) và Rig B (chổng mông đi).',
};

export default async function RigLabPage({ searchParams }: { searchParams: Promise<{ rig?: string }> }) {
  const { rig } = await searchParams;
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between">
      <TopNavBar />
      <RigLab initialRig={rig === 'b' ? 'b' : 'a'} />
      <Footer />
    </div>
  );
}
