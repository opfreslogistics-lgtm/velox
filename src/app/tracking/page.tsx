'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHero from '@/components/PageHero';
import TrackingComponent from '@/components/Tracking';
import FAQ from '@/components/FAQ';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  return (
    <div className="animate-fade-in-up min-h-screen bg-gray-50 dark:bg-brand-black transition-colors duration-300 flex flex-col">
      <PageHero title="Track Shipment" subtitle="Real-time visibility from pickup to delivery." />
      <div className="flex-1">
          <TrackingComponent mode="page" initialId={initialId} />
      </div>
      <div className="max-w-4xl mx-auto px-6 pb-20">
          <FAQ />
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div>Loading tracking info...</div>}>
      <TrackingContent />
    </Suspense>
  );
}