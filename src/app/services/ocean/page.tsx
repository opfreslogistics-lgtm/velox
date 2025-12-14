import React from 'react';
import PageHero from '@/components/PageHero';
import { Ship, Anchor, Globe, Package, CheckCircle, ArrowRight, Container } from 'lucide-react';
import Link from 'next/link';

export default function OceanFreightPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen">
      <PageHero title="Ocean Freight" subtitle="Flexible FCL & LCL across global trade lanes." />
      
      {/* Hero Image Section */}
      <section className="relative h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop"
          alt="Ocean freight container ship"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-4">Reliable Ocean Shipping</h2>
            <p className="text-xl opacity-90">Cost-effective solutions for large volume shipments across global ports.</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2 block">Overview</span>
              <h2 className="text-4xl font-extrabold text-brand-black dark:text-white mb-6">Comprehensive Ocean Freight</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Cost-effective, dependable ocean solutions with visibility from port to door. We orchestrate schedules, carrier selection, and customs to keep your supply chain predictable.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                With access to major shipping lines and ports worldwide, we ensure your cargo reaches its destination efficiently and on time. Our expertise in FCL and LCL shipping makes us the ideal partner for businesses of all sizes.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=2070&auto=format&fit=crop"
                alt="Container ship at port"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              'FCL & LCL with weekly departures',
              'Break bulk and project cargo',
              'Port-to-port and door-to-door options',
              'Carrier diversification for resilience',
              'Trade compliance & customs filing',
              'Warehousing and deconsolidation at destination',
            ].map((item) => (
              <div key={item} className="flex items-start gap-4 p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-red transition-colors">
                <CheckCircle className="text-brand-green flex-shrink-0 mt-1" size={24} />
                <span className="text-gray-700 dark:text-gray-200 font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* Service Types */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Full Container Load (FCL)",
                description: "Dedicated containers for your exclusive use",
                image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=2070&auto=format&fit=crop",
                icon: Container
              },
              {
                title: "Less than Container (LCL)",
                description: "Share container space for smaller shipments",
                image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop",
                icon: Package
              },
              {
                title: "Break Bulk",
                description: "Specialized handling for oversized cargo",
                image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=2070&auto=format&fit=crop",
                icon: Ship
              }
            ].map((service, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 bg-white dark:bg-gray-900">
                  <service.icon className="text-brand-red mb-4" size={32} />
                  <h3 className="text-xl font-bold text-brand-black dark:text-white mb-2">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Port Network */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-brand-black dark:text-white mb-4">Global Port Network</h2>
              <p className="text-gray-600 dark:text-gray-400">We connect major ports across all continents</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: "Rotterdam", country: "Netherlands" },
                { name: "Shanghai", country: "China" },
                { name: "Los Angeles", country: "USA" },
                { name: "Singapore", country: "Singapore" },
                { name: "Hamburg", country: "Germany" },
                { name: "Dubai", country: "UAE" },
                { name: "Hong Kong", country: "China" },
                { name: "Busan", country: "South Korea" }
              ].map((port, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                  <Anchor className="text-brand-red mx-auto mb-2" size={24} />
                  <h3 className="font-bold text-brand-black dark:text-white">{port.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{port.country}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Globe, title: "Worldwide Coverage", desc: "Access to 200+ ports globally" },
              { icon: Ship, title: "Reliable Carriers", desc: "Partnerships with top shipping lines" },
              { icon: Package, title: "Flexible Options", desc: "FCL, LCL, and break bulk solutions" }
            ].map((benefit, i) => (
              <div key={i} className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="bg-brand-red/10 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-brand-red" size={32} />
                </div>
                <h3 className="text-xl font-bold text-brand-black dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center bg-brand-red text-white rounded-2xl p-12">
            <h2 className="text-3xl font-extrabold mb-4">Ready to Ship by Ocean?</h2>
            <p className="text-lg mb-8 opacity-90">Get a competitive quote for your ocean freight needs.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/pricing" className="px-8 py-4 bg-white text-brand-red font-bold rounded-lg hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2">
                Get Quote <ArrowRight size={20} />
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


