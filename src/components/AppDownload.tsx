import React from 'react';
import { Smartphone } from 'lucide-react';

const AppDownload: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-brand-black relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-12">
         <div className="w-full md:w-1/2">
             <span className="text-brand-red font-bold uppercase tracking-wider text-sm mb-2 block">Mobile App</span>
             <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white mb-6">Track Your Cargo <br/> On The Go.</h2>
             <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                 Download the Sand Global Express app for real-time notifications, barcode scanning, and instant quotes. Manage your logistics from the palm of your hand.
             </p>
             <div className="flex gap-4">
                 <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded flex items-center gap-3 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                    <Smartphone size={24} />
                    <div className="text-left">
                        <div className="text-[10px] uppercase">Download on the</div>
                        <div className="text-sm font-bold leading-none">App Store</div>
                    </div>
                 </button>
                 <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded flex items-center gap-3 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                    <div className="text-left">
                        <div className="text-[10px] uppercase">Get it on</div>
                        <div className="text-sm font-bold leading-none">Google Play</div>
                    </div>
                 </button>
             </div>
         </div>
         <div className="w-full md:w-1/2 flex justify-center relative">
             <div className="w-64 h-[500px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-xl z-20"></div>
                <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="App Screen" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-brand-red text-white p-4 rounded-full shadow-lg">
                        <Smartphone size={32} />
                    </div>
                </div>
             </div>
             {/* Decorative blob */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-yellow/20 rounded-full blur-3xl -z-10"></div>
         </div>
      </div>
    </section>
  );
};

export default AppDownload;