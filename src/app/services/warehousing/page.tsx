import React from 'react';
import PageHero from '@/components/PageHero';
import { Box, Package, Database, CheckCircle, ArrowRight, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function WarehousingPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen">
      <PageHero title="Warehousing" subtitle="Strategic storage, fulfillment, and value-added services." />
      
      {/* Hero Image Section */}
      <section className="relative h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
          alt="Modern warehouse facility"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-4">Smart Warehousing Solutions</h2>
            <p className="text-xl opacity-90">Optimize inventory with secure, tech-enabled facilities worldwide.</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2 block">Overview</span>
              <h2 className="text-4xl font-extrabold text-brand-black dark:text-white mb-6">Comprehensive Warehousing</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Optimize inventory with secure, tech-enabled facilities and value-added services that accelerate your fulfillment and returns flows.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our network of 850+ warehouses provides strategic storage locations across the globe. With advanced WMS technology and value-added services, we help streamline your supply chain operations.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=2070&auto=format&fit=crop"
                alt="Warehouse interior"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              'WMS with real-time visibility',
              'Pick/pack/kitting and labeling',
              'Cross-docking and transload',
              'Returns management and QA',
              'Bonded and temperature-controlled options',
              'Integration with major marketplaces',
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
                title: "Storage Solutions",
                description: "Secure storage for all types of inventory",
                image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
                icon: Box
              },
              {
                title: "Fulfillment Services",
                description: "Pick, pack, and ship orders efficiently",
                image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=2070&auto=format&fit=crop",
                icon: Package
              },
              {
                title: "Inventory Management",
                description: "Real-time visibility and control",
                image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
                icon: Database
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

          {/* Benefits Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-brand-black dark:text-white mb-4">Why Choose Our Warehousing</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Fast Fulfillment", desc: "Same-day and next-day shipping options" },
                { icon: Shield, title: "Secure Storage", desc: "24/7 security and climate control" },
                { icon: Database, title: "Real-Time Tracking", desc: "Complete visibility of your inventory" }
              ].map((benefit, i) => (
                <div key={i} className="text-center">
                  <div className="bg-brand-red/10 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="text-brand-red" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-black dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-brand-red text-white rounded-2xl p-12">
            <h2 className="text-3xl font-extrabold mb-4">Need Warehousing Solutions?</h2>
            <p className="text-lg mb-8 opacity-90">Get a quote for your storage and fulfillment needs.</p>
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


