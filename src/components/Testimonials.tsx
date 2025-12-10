'use client';

import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Testimonial } from '@/types';

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Jonathan Steele",
    role: "Logistics Director",
    company: "AutoParts Global",
    content: "Velox has revolutionized our supply chain. The dashboard is intuitive, and the speed of delivery is unmatched in the industry. Highly recommended for enterprise needs.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    role: "CEO",
    company: "Luxe Fashion",
    content: "Shipping high-value fashion items requires trust. Velox provides that along with speed. Our customer satisfaction scores went up 20% since switching.",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "Marcus Thorne",
    role: "Operations VP",
    company: "TechNexus",
    content: "The API integration was seamless. We now have automated shipping generation directly from our ERP. It saved us hundreds of man-hours this quarter.",
    image: "https://randomuser.me/api/portraits/men/85.jpg"
  }
];

const LOGOS = [
  "AMAZONIA", "TESLA_MOTORS", "DHL_PARTNER", "FEDEX_GROUP", "MAERSK", "MSC"
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="py-24 bg-brand-black text-white overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red opacity-5 rounded-full blur-[100px]"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Heading & Controls */}
            <div>
                <h4 className="text-brand-yellow font-bold uppercase tracking-widest mb-4">Testimonials</h4>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-8">What Our Partners <br/> Say About Us.</h2>
                <div className="flex gap-4 mb-12">
                    <button onClick={prev} className="p-4 rounded-full border border-gray-700 hover:bg-brand-red hover:border-brand-red transition-all">
                        <ChevronLeft />
                    </button>
                    <button onClick={next} className="p-4 rounded-full border border-gray-700 hover:bg-brand-red hover:border-brand-red transition-all">
                        <ChevronRight />
                    </button>
                </div>

                <div className="border-t border-gray-800 pt-8">
                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-6 font-bold">Trusted by</p>
                    <div className="flex flex-wrap gap-8 opacity-40">
                        {LOGOS.slice(0, 4).map((logo, i) => (
                            <span key={i} className="text-lg font-black font-mono tracking-tighter">{logo}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Card */}
            <div className="bg-brand-gray/5 backdrop-blur-sm border border-white/10 p-8 md:p-12 rounded-2xl relative">
                <Quote className="text-brand-red w-16 h-16 mb-6 opacity-80" />
                
                <div className="flex gap-1 mb-6 text-brand-yellow">
                    {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                </div>

                <p className="text-xl md:text-2xl leading-relaxed font-light text-gray-200 mb-8 italic">
                    "{TESTIMONIALS[currentIndex].content}"
                </p>

                <div className="flex items-center gap-4">
                    <img 
                        src={TESTIMONIALS[currentIndex].image} 
                        alt={TESTIMONIALS[currentIndex].name}
                        className="w-14 h-14 rounded-full border-2 border-brand-red object-cover"
                    />
                    <div>
                        <h4 className="font-bold text-white text-lg">{TESTIMONIALS[currentIndex].name}</h4>
                        <p className="text-brand-red text-sm">{TESTIMONIALS[currentIndex].role}, {TESTIMONIALS[currentIndex].company}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;