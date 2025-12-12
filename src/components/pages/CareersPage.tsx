
import React from 'react';
import { Heart, Zap, Coffee, ArrowRight, Smile, Monitor, Briefcase, MapPin, Clock } from 'lucide-react';
import PageHero from '../PageHero';

const CareersPage: React.FC = () => {
  const jobs = [
    { title: "Senior Logistics Coordinator", dept: "Operations", loc: "New York, USA", type: "Full-time", posted: "2 days ago" },
    { title: "Supply Chain Analyst", dept: "Strategy", loc: "London, UK", type: "Full-time", posted: "1 week ago" },
    { title: "Fleet Manager", dept: "Transport", loc: "Berlin, DE", type: "Full-time", posted: "3 days ago" },
    { title: "Frontend Developer", dept: "Engineering", loc: "Remote", type: "Contract", posted: "Just now" },
    { title: "Customer Success Lead", dept: "Support", loc: "Singapore", type: "Full-time", posted: "1 day ago" },
  ];

  return (
    <div className="animate-fade-in-up">
       <PageHero 
         title="Join the Revolution" 
         subtitle="Build the future of global logistics with a passionate team." 
       />

      {/* Culture */}
      <section className="py-24 bg-white dark:bg-brand-black transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
               <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2 block">Our Culture</span>
               <h2 className="text-3xl font-extrabold text-brand-black dark:text-white">Why Work With Us?</h2>
               <p className="text-gray-500 max-w-2xl mx-auto mt-4">We believe in empowering our people to do their best work. Here's what you can expect when you join Sand Global Express.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { icon: Heart, title: "Health & Wellness", desc: "Comprehensive medical, dental, and vision coverage for you and your family." },
                  { icon: Zap, title: "Fast-Paced Growth", desc: "Clear career paths and continuous learning opportunities with budget for courses." },
                  { icon: Coffee, title: "Work-Life Balance", desc: "Inclusive environment, regular team events, and flexible remote work options." },
               ].map((item, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-brand-red transition-colors group">
                     <div className="bg-white dark:bg-gray-800 w-14 h-14 rounded-xl flex items-center justify-center text-brand-red mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <item.icon size={28} />
                     </div>
                     <h3 className="text-xl font-bold text-brand-black dark:text-white mb-3">{item.title}</h3>
                     <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Life at Sand Global Express Gallery */}
      <section className="py-24 bg-brand-black text-white overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
         <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
             <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                   <h2 className="text-3xl font-bold mb-2">Life at Sand Global Express</h2>
                   <p className="text-gray-400">See what our team is up to around the world.</p>
                </div>
                <button className="flex items-center gap-2 text-brand-yellow font-bold uppercase text-sm tracking-wider hover:text-white transition-colors">
                   Follow us on Instagram <ArrowRight size={16} />
                </button>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden h-96 relative group">
                   <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Team Meeting" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <p className="font-bold text-white">Brainstorming in NY</p>
                   </div>
                </div>
                {[
                   "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
                   "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop",
                   "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
                   "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=800&auto=format&fit=crop"
                ].map((img, i) => (
                   <div key={i} className="rounded-2xl overflow-hidden h-48 relative group">
                      <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Office Life" />
                   </div>
                ))}
             </div>
         </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
         <div className="max-w-5xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-extrabold text-brand-black dark:text-white">Open Positions</h2>
               <p className="text-gray-500 mt-2">Find your next role.</p>
            </div>

            <div className="space-y-4">
               {jobs.map((job, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-brand-red dark:hover:border-brand-red shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col md:flex-row justify-between items-center group">
                     <div>
                        <h3 className="text-lg font-bold text-brand-black dark:text-white group-hover:text-brand-red transition-colors">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                           <span className="flex items-center gap-1"><Briefcase size={14} /> {job.dept}</span>
                           <span className="flex items-center gap-1"><MapPin size={14} /> {job.loc}</span>
                           <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                        </div>
                     </div>
                     <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <span className="text-xs text-gray-400 font-medium">{job.posted}</span>
                        <button className="px-6 py-2 bg-brand-black dark:bg-white text-white dark:text-black font-bold rounded hover:opacity-80 transition-opacity">Apply</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default CareersPage;
