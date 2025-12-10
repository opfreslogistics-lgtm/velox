import React from 'react';
import PageHero from '@/components/PageHero';

export default function CookiesPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen">
      <PageHero title="Cookies" subtitle="How we use cookies and similar technologies." />
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-12 space-y-6 text-gray-700 dark:text-gray-300">
        <p>We use cookies to improve site performance, remember your preferences, and measure engagement.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Essential cookies keep the site functional.</li>
          <li>Analytics cookies help us understand usage to improve features.</li>
          <li>You can control cookies in your browser settings.</li>
        </ul>
      </div>
    </div>
  );
}


