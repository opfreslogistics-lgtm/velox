import React from 'react';
import PageHero from '@/components/PageHero';
import { Plane, Clock, Shield, Globe, Package, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AirFreightPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen">
      <PageHero title="Air Freight" subtitle="Time-critical global air solutions." />
      
      {/* Hero Image Section */}
      <section className="relative h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
          alt="Air freight cargo plane"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-4">Fastest Global Delivery</h2>
            <p className="text-xl opacity-90">When time is critical, our air freight services deliver.</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2 block">Overview</span>
              <h2 className="text-4xl font-extrabold text-brand-black dark:text-white mb-6">Premium Air Freight Services</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Rapid, reliable air freight with Next Flight Out, consolidated, and charter options. Real-time tracking, customs brokerage, and temperature-controlled capabilities keep your sensitive cargo on schedule.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our extensive network of airline partners ensures your shipments reach their destination quickly and safely. We handle everything from small packages to oversized cargo with precision and care.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1540962351504-03065e78f6ff?q=80&w=2070&auto=format&fit=crop"
                alt="Cargo aircraft"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              'Door-to-door and airport-to-airport service',
              '24-48h delivery to major capitals',
              'Dangerous goods handling',
              'On-board courier for urgent shipments',
              'e-AWB and digital documentation',
              'Customs pre-clearance support',
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
                title: "Next Flight Out",
                description: "Urgent shipments on the next available flight",
                image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
                icon: Clock
              },
              {
                title: "Consolidated Air",
                description: "Cost-effective shipping for smaller shipments",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop",
                icon: Package
              },
              {
                title: "Charter Services",
                description: "Dedicated aircraft for large or specialized cargo",
                image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
                icon: Plane
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
              <h2 className="text-3xl font-extrabold text-brand-black dark:text-white mb-4">Why Choose Our Air Freight</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Globe, title: "Global Coverage", desc: "Access to 500+ airports worldwide" },
                { icon: Shield, title: "Secure Handling", desc: "Advanced security protocols for all cargo" },
                { icon: Clock, title: "Time Guarantee", desc: "On-time delivery with real-time tracking" }
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
            <h2 className="text-3xl font-extrabold mb-4">Ready to Ship by Air?</h2>
            <p className="text-lg mb-8 opacity-90">Get an instant quote for your air freight needs.</p>
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


