
import React from 'react';
import { Target, Award, Globe, Users, TrendingUp, Clock, MapPin } from 'lucide-react';
import PageHero from '../PageHero';

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in-up bg-white dark:bg-brand-black transition-colors duration-300">
      <PageHero 
        title="Driving Global Commerce" 
        subtitle="Since 1995, Sand Global Express has been the backbone of supply chains for the world's leading companies."
      />

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2 block">Who We Are</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-brand-black dark:text-white mb-6">We Move The World.</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                We are more than a shipping company. We are a technology-driven logistics partner dedicated to simplifying complex supply chains. With a presence in over 220 countries, we connect businesses to markets with speed, precision, and reliability.
              </p>
              <div className="space-y-6 mt-8">
                <div className="flex gap-4 group">
                  <div className="bg-brand-red/10 group-hover:bg-brand-red transition-colors p-4 rounded-xl h-fit text-brand-red group-hover:text-white"><Target size={24} /></div>
                  <div>
                    <h4 className="font-bold text-xl text-brand-black dark:text-white">Our Mission</h4>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">To accelerate global trade through innovative logistics solutions.</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="bg-brand-yellow/10 group-hover:bg-brand-yellow transition-colors p-4 rounded-xl h-fit text-brand-yellowDark group-hover:text-black"><Globe size={24} /></div>
                  <div>
                    <h4 className="font-bold text-xl text-brand-black dark:text-white">Our Vision</h4>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">To be the world's most trusted and sustainable supply chain partner.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
               <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-yellow opacity-20 rounded-full blur-2xl"></div>
               <img src="https://lasenhevaefulhabxqar.supabase.co/storage/v1/object/public/website-images/logisticsfreight.jpg" className="rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500 w-full" alt="Logistics" />
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
         <div className="max-w-5xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-extrabold text-brand-black dark:text-white">Our Journey</h2>
               <p className="text-gray-500 mt-2">A timeline of innovation and growth.</p>
            </div>
            
            <div className="relative border-l-4 border-gray-200 dark:border-gray-800 ml-6 md:ml-auto md:mr-auto space-y-12">
               {[
                  { year: "1995", title: "Founded in London", desc: "Started with 2 trucks and a small warehouse near Coldbath Square." },
                  { year: "2005", title: "European Expansion", desc: "Opened our first major hub in Hamburg, Germany." },
                  { year: "2012", title: "Sand Digital Launch", desc: "Released our first real-time tracking platform." },
                  { year: "2020", title: "Carbon Neutral Pledge", desc: "Committed to 100% electric last-mile delivery by 2030." },
                  { year: "2024", title: "Global AI Integration", desc: "Implementing predictive logistics across all routes." }
               ].map((item, i) => (
                  <div key={i} className="relative pl-8 md:pl-0">
                     {/* Dot */}
                     <div className="absolute top-0 left-[-10px] w-5 h-5 bg-brand-red rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>
                     
                     <div className={`md:flex items-start justify-between gap-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                        <div className="hidden md:block w-1/2"></div>
                        <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                           <span className="text-brand-red font-bold text-xl block mb-1">{item.year}</span>
                           <h3 className="text-xl font-bold text-brand-black dark:text-white mb-2">{item.title}</h3>
                           <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Stats Strip */}
      <section className="py-20 bg-brand-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {[
            { num: "28", label: "Years Experience", icon: Clock },
            { num: "4000+", label: "Employees", icon: Users },
            { num: "220", label: "Countries", icon: MapPin },
            { num: "50M", label: "Parcels/Year", icon: TrendingUp }
          ].map((stat, i) => (
            <div key={i} className="group p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
               <stat.icon className="mx-auto mb-4 text-brand-red group-hover:scale-110 transition-transform" size={32} />
              <div className="text-4xl font-extrabold mb-1 text-white">{stat.num}</div>
              <div className="text-xs uppercase tracking-widest opacity-60 font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-brand-black dark:text-white">Meet The Leadership</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">The experts behind our global operations.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Robert Chen", role: "CEO", img: "https://randomuser.me/api/portraits/men/32.jpg" },
              { name: "Sarah Miller", role: "Head of Operations", img: "https://randomuser.me/api/portraits/women/44.jpg" },
              { name: "James Wilson", role: "Tech Director", img: "https://randomuser.me/api/portraits/men/85.jpg" },
              { name: "Elena Rodriguez", role: "Global Sales", img: "https://randomuser.me/api/portraits/women/65.jpg" }
            ].map((member, i) => (
              <div key={i} className="group bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
                <div className="h-72 overflow-hidden relative">
                   <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/20 transition-colors z-10"></div>
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105" />
                </div>
                <div className="p-6 text-center relative z-20 bg-white dark:bg-gray-900">
                  <h3 className="font-bold text-brand-black dark:text-white text-lg">{member.name}</h3>
                  <p className="text-brand-red text-sm font-bold uppercase tracking-wide mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
         <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {["ISO 9001 Certified", "IATA Accredited Agent", "C-TPAT Secure", "Green Freight Asia"].map((cert, i) => (
                <div key={i} className="flex items-center gap-2 font-bold text-xl text-gray-400">
                   <Award size={24} /> {cert}
                </div>
             ))}
         </div>
      </section>
    </div>
  );
};

export default AboutPage;
