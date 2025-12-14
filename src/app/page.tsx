'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/components/Hero';
import Process from '@/components/Process';
import QuoteCalculator from '@/components/QuoteCalculator';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import BlogPreview from '@/components/BlogPreview';
import AppDownload from '@/components/AppDownload';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Hero />
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] items-center gap-10">
            <div className="space-y-4">
              <span className="text-sm uppercase tracking-[0.2em] font-bold text-brand-red">Global coverage</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-black dark:text-white">Move anything, anywhere—without the back-and-forth.</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Dedicated capacity across air, ocean, and road with live ETAs, bonded warehousing, and customs built in. Your ops team gets fewer emails; your customers get faster updates.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Guaranteed space', '24/7 control tower', 'Carbon-neutral options', 'API-first tracking'].map((pill) => (
                  <span key={pill} className="px-3 py-1 rounded-full text-sm font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-brand-black dark:text-white">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-red/10 rounded-full blur-3xl" />
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 light-panel">
                <img
                  src="https://lasenhevaefulhabxqar.supabase.co/storage/v1/object/public/website-images/Logistics-Side%20(1).jpg"
                  alt="Modern warehouse and logistics"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Process />
      <QuoteCalculator /> 
      <Features />
      <Stats />
      
      <div className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
                <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2 block">Why Choose Us</span>
                <h2 className="text-3xl font-extrabold mb-6 text-brand-black dark:text-white">Why Industry Leaders Choose Sand Global Express</h2>
                <ul className="space-y-4">
                    {['Transparent Pricing', 'Real-time Satellite Tracking', 'Dedicated Account Managers', 'Carbon Neutral Shipping Options', '24/7 Global Support', 'Customs Clearance Expertise'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-lg text-gray-700 dark:text-gray-300">
                            <CheckCircle className="text-brand-green flex-shrink-0" /> {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-full md:w-1/2 relative">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border-l-4 border-brand-red">
                    <h3 className="text-2xl font-bold mb-4 dark:text-white">Enterprise Solutions</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Need to move more than 500 containers a month? Get a tailored contract.</p>
                    <Link href="/contact" className="text-brand-red font-bold uppercase text-sm tracking-wider flex items-center gap-2 hover:gap-4 transition-all">Contact Sales Team <span className="text-xl">→</span></Link>
                </div>
            </div>
        </div>
      </div>

      {/* Transportation Modes Showcase */}
      <section className="py-24 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2 block">Our Fleet</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white mb-4">Multiple Transportation Modes</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">From air to ocean, road to rail, we have the right solution for every shipment.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Air Freight",
                description: "Fastest delivery for time-critical shipments",
                image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
                icon: "✈️",
                features: ["24-48h delivery", "Global coverage", "Temperature controlled"]
              },
              {
                title: "Ocean Freight",
                description: "Cost-effective shipping for large volumes",
                image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop",
                icon: "🚢",
                features: ["FCL & LCL", "Port-to-port", "Break bulk"]
              },
              {
                title: "Road Transport",
                description: "Reliable ground transportation network",
                image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop",
                icon: "🚛",
                features: ["FTL & LTL", "GPS tracking", "Cross-border"]
              }
            ].map((mode, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={mode.image} 
                    alt={mode.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-transparent"></div>
                </div>
                <div className="p-8 bg-white dark:bg-gray-900">
                  <div className="text-4xl mb-4">{mode.icon}</div>
                  <h3 className="text-2xl font-bold text-brand-black dark:text-white mb-2">{mode.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{mode.description}</p>
                  <ul className="space-y-2">
                    {mode.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <CheckCircle className="text-brand-green" size={16} /> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Network Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2 block">Global Reach</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white mb-6">Worldwide Logistics Network</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                With operations spanning 220+ countries and territories, we connect your business to markets across the globe. Our strategic hubs ensure fast transit times and reliable service.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Countries", value: "220+" },
                  { label: "Warehouses", value: "850+" },
                  { label: "Fleet Size", value: "15,000+" },
                  { label: "Daily Shipments", value: "500k+" }
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="text-3xl font-extrabold text-brand-red mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-red/10 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop"
                alt="Global network map"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partnership & Trust Section */}
      <section className="py-24 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2 block">Partnerships</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">We partner with the world's leading brands to deliver exceptional logistics solutions.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 opacity-60 grayscale hover:grayscale-0 transition-all">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center h-32">
                <div className="text-2xl font-bold text-gray-400">PARTNER {i}</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-brand-red to-brand-yellow p-12 rounded-2xl text-white text-center">
            <h3 className="text-3xl font-extrabold mb-4">Become Our Partner</h3>
            <p className="text-lg mb-8 opacity-90">Join thousands of businesses that trust us with their logistics needs.</p>
            <Link href="/contact" className="inline-block px-8 py-4 bg-white text-brand-black font-bold rounded-lg hover:bg-gray-100 transition-all">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      <BlogPreview />
      <AppDownload />
      <Testimonials />
      <FAQ />

      {/* CTA Section */}
      <section className="bg-brand-black text-white py-20 px-6 relative overflow-hidden border-t border-gray-900">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8">Ready to move your business?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/pricing" className="px-10 py-5 bg-brand-red text-white font-bold text-lg rounded shadow-lg hover:bg-brand-redDark transition-all hover:-translate-y-1">
              Get an Instant Quote
            </Link>
            <Link href="/contact" className="px-10 py-5 bg-white text-brand-black font-bold text-lg rounded shadow-lg hover:bg-gray-200 transition-all hover:-translate-y-1">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}