import React from 'react';
import PageHero from '@/components/PageHero';
import { Truck, MapPin, Clock, Shield, CheckCircle, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';

export default function RoadTransportPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen">
      <PageHero title="Road Transport" subtitle="Door-to-door precision across continents." />
      
      {/* Hero Image Section */}
      <section className="relative h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop"
          alt="Road transport truck fleet"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-4">Reliable Ground Transportation</h2>
            <p className="text-xl opacity-90">Extensive trucking network providing predictable transit across continents.</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2 block">Overview</span>
              <h2 className="text-4xl font-extrabold text-brand-black dark:text-white mb-6">Comprehensive Road Transport</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                From parcel to heavy haul, our trucking network provides predictable transit with proactive updates, cross-border expertise, and last-mile excellence.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our fleet of modern vehicles, combined with advanced tracking technology, ensures your cargo arrives safely and on time. We handle everything from small packages to oversized loads with precision and care.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop"
                alt="Modern truck fleet"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              'FTL, LTL, and express vans',
              'GPS live tracking and status alerts',
              'Cross-border clearance support',
              'Temperature-controlled fleet',
              'Dedicated milk-runs and shuttle lanes',
              'Time-definite delivery windows',
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
                title: "Full Truck Load (FTL)",
                description: "Dedicated truck for your exclusive shipment",
                image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop",
                icon: Truck
              },
              {
                title: "Less than Truck (LTL)",
                description: "Share truck space for smaller shipments",
                image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop",
                icon: Package
              },
              {
                title: "Express Delivery",
                description: "Fast same-day and next-day services",
                image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop",
                icon: Clock
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

          {/* Fleet Showcase */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-brand-black dark:text-white mb-4">Our Modern Fleet</h2>
              <p className="text-gray-600 dark:text-gray-400">State-of-the-art vehicles for every transport need</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: "Standard Trucks", count: "5,000+" },
                { name: "Refrigerated", count: "1,200+" },
                { name: "Flatbeds", count: "800+" },
                { name: "Express Vans", count: "3,000+" }
              ].map((vehicle, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                  <Truck className="text-brand-red mx-auto mb-2" size={32} />
                  <h3 className="font-bold text-brand-black dark:text-white mb-1">{vehicle.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.count} vehicles</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: MapPin, title: "Wide Coverage", desc: "Operating across 50+ countries" },
              { icon: Shield, title: "Secure Transport", desc: "Advanced security and insurance" },
              { icon: Clock, title: "On-Time Delivery", desc: "99.8% on-time delivery rate" }
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
            <h2 className="text-3xl font-extrabold mb-4">Ready to Ship by Road?</h2>
            <p className="text-lg mb-8 opacity-90">Get a quote for your road transport needs.</p>
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


