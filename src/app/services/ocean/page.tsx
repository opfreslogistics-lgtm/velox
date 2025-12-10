import React from 'react';
import PageHero from '@/components/PageHero';

export default function OceanFreightPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen">
      <PageHero title="Ocean Freight" subtitle="Flexible FCL & LCL across global trade lanes." />
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12 space-y-6">
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Cost-effective, dependable ocean solutions with visibility from port to door. We orchestrate schedules, carrier selection, and customs to keep your supply chain predictable.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            'FCL & LCL with weekly departures',
            'Break bulk and project cargo',
            'Port-to-port and door-to-door options',
            'Carrier diversification for resilience',
            'Trade compliance & customs filing',
            'Warehousing and deconsolidation at destination',
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


