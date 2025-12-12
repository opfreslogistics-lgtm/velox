import React from 'react';
import PageHero from '@/components/PageHero';

export default function PrivacyPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen">
      <PageHero title="Privacy Policy" subtitle="How we collect, use, and protect your data." />
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-12 space-y-6 text-gray-700 dark:text-gray-300">
        <p>We only collect the data necessary to operate our logistics platform, including account details, shipment data, and contact information.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>We never sell your data.</li>
          <li>Data is encrypted in transit and at rest.</li>
          <li>Access is restricted to authorized personnel.</li>
        </ul>
        <p>For deletion or access requests, contact: privacy@sandgloexpress.com.</p>
      </div>
    </div>
  );
}


