
import React from 'react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, className = "" }) => {
  return (
    <div className={`relative bg-brand-red text-white py-24 px-6 text-center overflow-hidden shadow-xl ${className}`}>
      {/* Background Gradient & Texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-red to-brand-redDark"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
         <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-white">Velox Global</span>
         </div>
         <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-md leading-tight">{title}</h1>
         {subtitle && <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  );
};

export default PageHero;
