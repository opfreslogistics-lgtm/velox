import React from 'react';
import PageHero from '@/components/PageHero';
import QuoteCalculator from '@/components/QuoteCalculator';
import Stats from '@/components/Stats';
import AppDownload from '@/components/AppDownload';

export default function Pricing() {
  return (
    <div className="bg-white dark:bg-brand-black transition-colors duration-300">
      <PageHero
        title="Transparent Pricing, Instant Quotes"
        subtitle="Get a tailored quote in seconds, compare modes, and lock in guaranteed rates for your next shipment."
      />

      {/* Transportation Modes Visual */}
      <section className="py-16 bg-white dark:bg-brand-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                mode: "Air Freight",
                image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
                speed: "12-72h",
                price: "from $9/kg"
              },
              {
                mode: "Ocean Freight",
                image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop",
                speed: "6-28 days",
                price: "Live schedules"
              },
              {
                mode: "Road Transport",
                image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop",
                speed: "Same-day/Next-day",
                price: "Flexible rates"
              }
            ].map((item, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.mode}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent"></div>
                </div>
                <div className="p-6 bg-white dark:bg-gray-900">
                  <h3 className="text-xl font-bold text-brand-black dark:text-white mb-2">{item.mode}</h3>
                  <p className="text-brand-red font-semibold mb-1">{item.speed}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-extrabold text-brand-black dark:text-white">Built for every shipment size</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Air, ocean, and road options with bundled customs, insurance, and white-glove delivery. See live ETAs and carbon impact before you book.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Air Express', value: '12-72h · from $9/kg', accent: 'bg-brand-red/10 text-brand-red' },
                  { label: 'Ocean FCL/LCL', value: '6-28 days · live schedules', accent: 'bg-brand-yellow/10 text-brand-yellowDark' },
                  { label: 'Road Freight', value: 'Same-day / next-day', accent: 'bg-brand-green/10 text-brand-green' },
                  { label: 'Warehousing', value: 'Pay-as-you-store', accent: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${item.accent}`}>{item.label}</div>
                    <div className="mt-3 text-lg font-semibold text-brand-black dark:text-white">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Fuel-inclusive', desc: 'All-in rates with bunker & fuel surcharges included.' },
                  { title: 'Live capacity', desc: 'See daily capacity on lanes before you book.' },
                  { title: 'Customs-ready', desc: 'Brokerage docs bundled for frictionless borders.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="text-sm font-bold text-brand-red uppercase">{item.title}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white light-panel dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 sticky top-24">
              <QuoteCalculator variant="card" />
            </div>
          </div>
        </div>
      </section>

      <Stats />

      <section className="py-20 bg-brand-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10 text-center space-y-6">
          <h3 className="text-3xl font-extrabold">Scale with enterprise contracts</h3>
          <p className="text-lg text-gray-300">
            Dedicated account managers, volume discounts, priority capacity, and SLA-backed delivery windows for high-volume shippers.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-white text-brand-black rounded-full text-sm font-semibold">Carbon-neutral options</span>
            <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold">Real-time API</span>
            <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold">24/7 Ops Desk</span>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-brand-black">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-10">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-extrabold text-brand-black dark:text-white">What’s included in every quote</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">No hidden fees—everything itemized before you confirm.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Regulatory & compliance', desc: 'Customs docs, HS code validation, export controls screening.' },
              { title: 'Risk & insurance', desc: 'Optional cargo insurance, loss/damage coverage, claim assistance.' },
              { title: 'Visibility & updates', desc: 'Live milestone tracking, SMS/email status, exception alerts.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                <div className="text-sm font-bold text-brand-red uppercase tracking-wide">{item.title}</div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-brand-red text-white shadow-xl">
              <div className="text-sm font-bold uppercase tracking-wide">Surcharges made simple</div>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                <li>• Fuel & bunker adjustments</li>
                <li>• Peak season & congestion</li>
                <li>• Accessorials (liftgate, residential, appointment)</li>
                <li>• Security & screening (air cargo)</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="text-sm font-bold text-brand-red uppercase tracking-wide">Payment options</div>
              <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <li>• Credit card or ACH with instant confirmation</li>
                <li>• Flexible net terms for approved accounts</li>
                <li>• Multi-currency billing for global offices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <AppDownload />
    </div>
  );
}

