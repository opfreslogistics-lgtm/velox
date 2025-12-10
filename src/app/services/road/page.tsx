import React from 'react';
import PageHero from '@/components/PageHero';

export default function RoadTransportPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen">
      <PageHero title="Road Transport" subtitle="Door-to-door precision across continents." />
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12 space-y-6">
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          From parcel to heavy haul, our trucking network provides predictable transit with proactive updates, cross-border expertise, and last-mile excellence.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            'FTL, LTL, and express vans',
            'GPS live tracking and status alerts',
            'Cross-border clearance support',
            'Temperature-controlled fleet',
            'Dedicated milk-runs and shuttle lanes',
            'Time-definite delivery windows',
          ].map((item) => (
            <div key={item} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


