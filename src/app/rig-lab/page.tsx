'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { Footer } from '@/components/layout/Footer';
import RigLab from '@/components/rig/lab/RigLab';

function RigLabContent() {
  const searchParams = useSearchParams();
  const rig = searchParams.get('rig');
  return <RigLab initialRig={rig === 'b' ? 'b' : 'a'} />;
}

export default function RigLabPage() {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between">
      <TopNavBar />
      <Suspense fallback={<div className="p-12 text-center font-bold">Đang tải Rig Lab...</div>}>
        <RigLabContent />
      </Suspense>
      <Footer />
    </div>
  );
}
