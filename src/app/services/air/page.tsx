import React from 'react';
import PageHero from '@/components/PageHero';

export default function AirFreightPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen">
      <PageHero title="Air Freight" subtitle="Time-critical global air solutions." />
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12 space-y-6">
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Rapid, reliable air freight with Next Flight Out, consolidated, and charter options. Real-time tracking, customs brokerage, and temperature-controlled capabilities keep your sensitive cargo on schedule.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            'Door-to-door and airport-to-airport service',
            '24-48h delivery to major capitals',
            'Dangerous goods handling',
            'On-board courier for urgent shipments',
            'e-AWB and digital documentation',
            'Customs pre-clearance support',
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


