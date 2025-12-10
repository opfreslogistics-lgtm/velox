
import React from 'react';
import { Plane, Ship, Truck, Box, Anchor, Shield, Cpu, BarChart, Globe, Zap, Database, ArrowRight } from 'lucide-react';
import QuoteCalculator from '../QuoteCalculator';
import PageHero from '../PageHero';

const ServicesPage: React.FC = () => {
  const categories = [
    {
      id: "air",
      title: "Air Freight",
      icon: Plane,
      desc: "When time is critical, our air freight services deliver. We offer Next Flight Out, Consolidated Air, and Charter services globally.",
      features: ["Door-to-Door Delivery", "Customs Clearance", "Temp. Controlled", "Charter Services"],
      image: "https://lasenhevaefulhabxqar.supabase.co/storage/v1/object/public/website-images/airfreightnew.jpg"
    },
    {
      id: "ocean",
      title: "Ocean Freight",
      icon: Anchor,
      desc: "Cost-effective solutions for large volume shipments. We connect major global ports with reliable scheduling.",
      features: ["FCL & LCL", "Break Bulk", "Port-to-Port", "Hazardous Cargo"],
      image: "https://lasenhevaefulhabxqar.supabase.co/storage/v1/object/public/website-images/oceanfreightnew.jpg"
    },
    {
      id: "road",
      title: "Road Transport",
      icon: Truck,
      desc: "Flexible and reliable ground transportation across continents. From parcel delivery to heavy haulage.",
      features: ["FTL & LTL", "Express Van", "GPS Tracking", "Cross-border"],
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "warehouse",
      title: "Warehousing",
      icon: Box,
      desc: "Strategic storage solutions to optimize your inventory management and fulfillment processes.",
      features: ["Inventory System", "Pick & Pack", "Cross-docking", "Returns Mgmt"],
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const industries = [
    { name: "Automotive", icon: Zap, desc: "Just-in-time delivery for production lines." },
    { name: "Healthcare", icon: Shield, desc: "Temperature sensitive cold-chain solutions." },
    { name: "Retail & E-comm", icon: Box, desc: "Omnichannel fulfillment and fast returns." },
    { name: "Technology", icon: Cpu, desc: "Secure transport for high-value electronics." },
  ];

  return (
    <div className="animate-fade-in-up bg-white dark:bg-brand-black transition-colors duration-300">
      <PageHero 
        title="Our Logistics Solutions" 
        subtitle="End-to-end supply chain services tailored to your business needs."
      />

      {/* Intro Stats */}
      <section className="py-16 border-b border-gray-100 dark:border-gray-800">
         <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
               { icon: Globe, title: "Global Network", desc: "Access to 220+ countries and territories." },
               { icon: BarChart, title: "Data Driven", desc: "Analytics to optimize your supply chain costs." },
               { icon: Shield, title: "Secure Cargo", desc: "Advanced security protocols for every shipment." }
            ].map((item, i) => (
               <div key={i} className="flex items-start gap-4">
                  <div className="p-3 bg-brand-red/10 text-brand-red rounded-lg">
                     <item.icon size={24} />
                  </div>
                  <div>
                     <h3 className="font-bold text-xl text-brand-black dark:text-white mb-2">{item.title}</h3>
                     <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Main Services Grid - Dope Layout */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-extrabold text-brand-black dark:text-white mb-4">Core Services</h2>
             <p className="text-gray-500 max-w-2xl mx-auto">We offer a comprehensive suite of logistics services designed to keep your business moving.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat, idx) => (
              <div key={idx} className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                {/* Image Area */}
                <div className="h-64 overflow-hidden relative">
                   <img 
                     src={cat.image} 
                     alt={cat.title} 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent"></div>
                   <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                      <div className="bg-brand-red p-2 rounded-lg">
                         <cat.icon size={20} />
                      </div>
                      <span className="font-bold text-xl">{cat.title}</span>
                   </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex-1 flex flex-col">
                   <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-1">
                      {cat.desc}
                   </p>
                   
                   <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-8">
                      {cat.features.map((feat, i) => (
                         <div key={i} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full"></div>
                            {feat}
                         </div>
                      ))}
                   </div>

                   <a href={`/services/${cat.id}`} className="w-full py-3 border border-brand-black dark:border-white text-brand-black dark:text-white font-bold rounded hover:bg-brand-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2 group-hover:bg-brand-red group-hover:border-brand-red group-hover:text-white dark:group-hover:text-white">
                      View Details <ArrowRight size={16} />
                   </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-24 bg-brand-black text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
               <div>
                  <h2 className="text-3xl font-bold mb-2">Industries We Serve</h2>
                  <p className="text-gray-400">Specialized solutions for unique sector requirements.</p>
               </div>
               <button className="text-brand-yellow font-bold uppercase text-sm tracking-wider hover:text-white transition-colors">See All Industries &rarr;</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {industries.map((ind, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer">
                     <div className="text-brand-red mb-4 group-hover:scale-110 transition-transform duration-300">
                        <ind.icon size={32} />
                     </div>
                     <h3 className="text-xl font-bold mb-2">{ind.name}</h3>
                     <p className="text-sm text-gray-400">{ind.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24 bg-white dark:bg-brand-black transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="lg:w-1/2">
                  <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2 block">Our Technology</span>
                  <h2 className="text-4xl font-extrabold text-brand-black dark:text-white mb-6">Digital Logistics Platform</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                     We leverage AI, IoT, and Blockchain to provide unmatched visibility and efficiency. Our cloud-based platform integrates seamlessly with your ERP.
                  </p>
                  <ul className="space-y-4">
                     {[
                        { icon: Database, text: "Real-time API Integration" },
                        { icon: Zap, text: "Predictive Analytics for Delays" },
                        { icon: Shield, text: "Blockchain Documentation" }
                     ].map((t, i) => (
                        <li key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                           <div className="bg-brand-black dark:bg-white text-white dark:text-brand-black p-2 rounded">
                              <t.icon size={18} />
                           </div>
                           <span className="font-bold text-brand-black dark:text-white">{t.text}</span>
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="lg:w-1/2 relative">
                  <div className="bg-gradient-to-br from-brand-red to-brand-yellow rounded-2xl p-1 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                     <div className="bg-gray-900 rounded-xl p-8 h-[400px] flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-20"></div>
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Tech" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="text-center">
                              <Cpu size={64} className="text-white mx-auto mb-4 animate-pulse" />
                              <h3 className="text-2xl font-bold text-white">VeloxOS 2.0</h3>
                              <p className="text-brand-yellow font-mono text-sm mt-2">SYSTEM ACTIVE</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Calculator Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
         <QuoteCalculator />
      </section>
    </div>
  );
};

export default ServicesPage;
