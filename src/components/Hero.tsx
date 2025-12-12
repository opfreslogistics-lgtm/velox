
'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Globe, PlayCircle, Search, Calculator, Activity, Wifi } from 'lucide-react';

const Hero: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'track' | 'quote'>('track');
  const [recent, setRecent] = useState<string[]>([]);
  const [quoteResult, setQuoteResult] = useState<string>('');

  useEffect(() => {
    setLoaded(true);
    // load recent tracking searches
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recent_tracking');
      if (saved) {
        try {
          setRecent(JSON.parse(saved));
        } catch {
          setRecent([]);
        }
      }
    }
  }, []);

  return (
    <div className="relative w-full min-h-[900px] lg:h-[900px] bg-brand-black overflow-hidden group font-sans pb-10 lg:pb-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop" 
          alt="Logistics Operations" 
          className={`w-full h-full object-cover object-center transition-transform duration-[20s] ease-in-out scale-100 group-hover:scale-110 opacity-50`}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/70 to-brand-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent"></div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center lg:items-center justify-center gap-12 lg:gap-16 py-16 lg:py-0">
        
        {/* Left Content */}
        <div className={`lg:w-7/12 pt-10 lg:pt-0 transition-all duration-1000 transform ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
          
          <div className="flex items-center gap-2 mb-6 animate-fade-in-up">
            <span className="h-1 w-12 bg-brand-red block shadow-[0_0_10px_rgba(212,5,17,0.8)]"></span>
            <span className="text-brand-yellow font-bold uppercase tracking-[0.2em] text-xs">Global Supply Chain Solutions</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-8 drop-shadow-2xl">
            POWERING <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-yellow">COMMERCE</span> <br/>
            WORLDWIDE.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl leading-relaxed font-light border-l-4 border-brand-red pl-6 bg-gradient-to-r from-brand-red/10 to-transparent py-2">
            Seamless logistics for the digital age. From automated warehousing to last-mile delivery, we move the world forward.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <button className="group px-8 py-4 bg-brand-red text-white font-bold rounded flex items-center justify-center gap-3 hover:bg-brand-redDark transition-all shadow-[0_0_20px_rgba(212,5,17,0.4)] hover:shadow-[0_0_30px_rgba(212,5,17,0.6)]">
              Start Shipping <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold rounded flex items-center justify-center gap-3 hover:bg-white hover:text-brand-black transition-all">
              <PlayCircle size={20} /> Watch Video
            </button>
          </div>

          <div className="mt-16 flex items-center gap-8 text-sm font-medium text-gray-400">
             <div className="flex items-center gap-2">
                <Globe className="text-brand-red" size={18} />
                <span>Global Coverage</span>
             </div>
             <div className="flex items-center gap-2">
                <Activity className="text-brand-green" size={18} />
                <span>99.9% Uptime</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse"></div>
                <span>Live Operations</span>
             </div>
          </div>
        </div>

        {/* Right Bar / Widget Section */}
        <div className={`lg:w-5/12 w-full mt-12 lg:mt-0 flex justify-end transition-all duration-1000 delay-300 transform ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
           <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Widget Header */}
              <div className="flex border-b border-white/10">
                 <button 
                    onClick={() => setActiveTab('track')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${activeTab === 'track' ? 'bg-brand-red text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                 >
                    <Search size={16} /> Quick Track
                 </button>
                 <button 
                    onClick={() => setActiveTab('quote')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${activeTab === 'quote' ? 'bg-brand-red text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                 >
                    <Calculator size={16} /> Get Rate
                 </button>
              </div>

              {/* Widget Body */}
              <div className="p-8 h-[320px] flex flex-col justify-between relative">
                 {/* Live Network Status Indicator */}
                 <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] font-mono text-brand-green bg-brand-green/10 px-2 py-1 rounded border border-brand-green/20">
                    <Wifi size={10} /> NETWORK ONLINE
                 </div>

                 {activeTab === 'track' ? (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target as HTMLFormElement);
                      const trackingId = (formData.get('trackingId') as string)?.trim();
                      if (trackingId) {
                        const next = [trackingId, ...recent.filter(r => r !== trackingId)].slice(0, 5);
                        setRecent(next);
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('recent_tracking', JSON.stringify(next));
                        }
                        window.location.href = `/shipment/${trackingId}`;
                      }
                    }} className="animate-fade-in-up">
                       <h3 className="text-2xl font-bold text-white mb-2">Track Shipment</h3>
                       <p className="text-gray-400 text-sm mb-6">Enter tracking ID to see real-time status.</p>
                       <div className="space-y-4">
                          <input 
                            type="text" 
                            name="trackingId"
                            placeholder="e.g. SGE-882192" 
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-all"
                            required
                          />
                          <button type="submit" className="w-full py-3 bg-white text-brand-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                             Track Now <ArrowRight size={16} />
                          </button>
                       </div>
                       <div className="mt-6 pt-6 border-t border-white/10">
                          <p className="text-xs text-gray-500 uppercase font-bold mb-2">Recent Searches</p>
                          <div className="flex gap-2 flex-wrap">
                             {recent.length === 0 && <span className="text-xs text-gray-500">No recent searches</span>}
                             {recent.map((r) => (
                               <span key={r} className="text-xs text-brand-yellow bg-brand-yellow/10 px-2 py-1 rounded cursor-pointer hover:bg-brand-yellow/20" onClick={() => window.location.href = `/shipment/${r}`}>{r}</span>
                             ))}
                          </div>
                       </div>
                    </form>
                 ) : (
                    <form className="animate-fade-in-up" onSubmit={(e) => {
                      e.preventDefault();
                      const form = new FormData(e.currentTarget);
                      const from = (form.get('from') as string || '').trim();
                      const to = (form.get('to') as string || '').trim();
                      const type = (form.get('type') as string || 'Document');
                      if (!from || !to) {
                        setQuoteResult('Enter both cities to estimate.');
                        return;
                      }
                      const base = 49;
                      const multiplier = type === 'Document' ? 1 : type.includes('Pallet') ? 3 : 1.8;
                      const rand = Math.floor(Math.random() * 40) + 10;
                      const estimate = Math.round((base + rand) * multiplier);
                      setQuoteResult(`Estimated rate: $${estimate} - $${estimate + 40} (indicative)`);
                    }}>
                       <h3 className="text-2xl font-bold text-white mb-2">Quick Quote</h3>
                       <p className="text-gray-400 text-sm mb-6">Estimate shipping costs in seconds.</p>
                       <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                             <input name="from" type="text" placeholder="From (City)" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-red" />
                             <input name="to" type="text" placeholder="To (City)" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-red" />
                          </div>
                          <select name="type" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none focus:border-brand-red">
                             <option value="Document">Document</option>
                             <option value="Box (Small)">Box (Small)</option>
                             <option value="Box (Large)">Box (Large)</option>
                             <option value="Pallet">Pallet</option>
                          </select>
                          <button type="submit" className="w-full py-3 bg-brand-yellow text-brand-black font-bold rounded-lg hover:bg-brand-yellowDark transition-colors flex items-center justify-center gap-2 mt-2">
                             Calculate <Calculator size={16} />
                          </button>
                          {quoteResult && <p className="text-xs text-brand-yellow mt-2">{quoteResult}</p>}
                       </div>
                    </form>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
