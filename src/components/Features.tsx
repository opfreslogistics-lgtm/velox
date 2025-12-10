import React from 'react';
import { Truck, Ship, Plane, Box, Globe, Shield, Clock, ArrowRight } from 'lucide-react';
import { ServiceItem } from '@/types';

const SERVICES: ServiceItem[] = [
  {
    title: 'Air Freight',
    description: 'Rapid global delivery for time-critical cargo. 24-48h delivery to major capitals.',
    icon: Plane,
    image: 'https://lasenhevaefulhabxqar.supabase.co/storage/v1/object/public/website-images/airfreight.jpg'
  },
  {
    title: 'Ocean Freight',
    description: 'Cost-effective FCL & LCL solutions for high-volume international shipping.',
    icon: Ship,
    image: 'https://lasenhevaefulhabxqar.supabase.co/storage/v1/object/public/website-images/oceanfright.jpg'
  },
  {
    title: 'Road Transport',
    description: 'Extensive trucking network across continents with door-to-door precision.',
    icon: Truck,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'Warehousing',
    description: 'Smart storage, fulfillment, and distribution from strategic global hubs.',
    icon: Box,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop'
  }
];

const Features: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white dark:bg-brand-black relative transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gray-50 dark:bg-gray-900 z-0 transition-colors duration-300"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <h4 className="text-brand-red font-bold uppercase tracking-widest mb-2">Our Services</h4>
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white mb-6">World-Class Logistics <br/> For Modern Business.</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">We don't just move boxes; we optimize your entire supply chain with cutting-edge technology and a global network.</p>
          </div>
          <div className="hidden md:block">
             <button className="px-6 py-3 border-2 border-brand-black dark:border-white text-brand-black dark:text-white font-bold hover:bg-brand-black dark:hover:bg-white hover:text-white dark:hover:text-brand-black transition-colors uppercase">
                View Full Catalog
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, idx) => (
            <div key={idx} className="group relative h-[400px] overflow-hidden rounded shadow-lg cursor-pointer">
               {/* Image Background */}
               <img 
                 src={service.image} 
                 alt={service.title} 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
               />
               
               {/* Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-transparent transition-opacity duration-300"></div>

               {/* Hover Color Flash */}
               <div className="absolute top-0 left-0 w-full h-1 bg-brand-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

               {/* Content */}
               <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-12 h-12 bg-brand-red text-white flex items-center justify-center rounded mb-4 shadow-lg">
                    <service.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-300 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
                    {service.description}
                  </p>
                  <span className="flex items-center gap-2 text-brand-yellow font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all delay-200">
                    Read More <ArrowRight size={16} />
                  </span>
               </div>
            </div>
          ))}
        </div>

        {/* Features Sub-section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { icon: Clock, title: 'On-Time Delivery', desc: '99.8% rate of on-time delivery across all services.' },
                { icon: Shield, title: 'Secure Handling', desc: 'Advanced monitoring and insurance for high-value cargo.' },
                { icon: Globe, title: 'Global Network', desc: 'Operating in 220+ countries and territories worldwide.' },
            ].map((feature, i) => (
                <div key={i} className="flex gap-4 p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-brand-red/30 hover:shadow-xl transition-all rounded-lg">
                    <div className="text-brand-red bg-brand-red/5 p-4 rounded h-fit">
                        <feature.icon size={28} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-brand-black dark:text-white mb-2">{feature.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Features;