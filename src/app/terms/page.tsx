import React from 'react';
import PageHero from '@/components/PageHero';

export default function TermsPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen">
      <PageHero title="Terms & Conditions" subtitle="The rules that govern use of our services." />
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-12 space-y-6 text-gray-700 dark:text-gray-300">
        <p>By using Sand Global Express services you agree to our service terms, liability limits, and acceptable use policies.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Shipments must comply with local and international regulations.</li>
          <li>Service-level commitments are subject to carrier and customs constraints.</li>
          <li>Claims must be submitted within the timelines defined per service level.</li>
        </ul>
        <p>For full legal language, reach out to legal@sandglobalexpress.com.</p>
      </div>
    </div>
  );
}


