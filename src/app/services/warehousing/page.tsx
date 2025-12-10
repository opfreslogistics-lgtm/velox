import React from 'react';
import PageHero from '@/components/PageHero';

export default function WarehousingPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen">
      <PageHero title="Warehousing" subtitle="Strategic storage, fulfillment, and value-added services." />
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12 space-y-6">
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Optimize inventory with secure, tech-enabled facilities and value-added services that accelerate your fulfillment and returns flows.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            'WMS with real-time visibility',
            'Pick/pack/kitting and labeling',
            'Cross-docking and transload',
            'Returns management and QA',
            'Bonded and temperature-controlled options',
            'Integration with major marketplaces',
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


