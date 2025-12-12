'use client';

import React from 'react';
import { Package, Facebook, Twitter, Linkedin, Instagram, MapPin, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageType } from '@/types';

const pageToHref: Partial<Record<PageType, string>> = {
  home: '/',
  services: '/services',
  tracking: '/tracking',
  pricing: '/pricing',
  about: '/about',
  contact: '/contact',
  careers: '/careers',
  sustainability: '/about',
  privacy: '/privacy',
  terms: '/terms',
  news: '/blog',
  partners: '/about',
  'admin-login': '/admin',
  'admin-dashboard': '/admin/dashboard',
  'admin-shipments': '/admin/shipments',
  'admin-users': '/admin/users',
  'admin-settings': '/admin/settings',
  'admin-blog': '/admin/blog',
  cookies: '/cookies',
};

const Footer: React.FC = () => {
  const router = useRouter();

  const go = (page: PageType) => {
    router.push(pageToHref[page] || '/');
  };
  return (
    <footer className="bg-[#050505] text-white pt-24 pb-8 font-sans border-t border-gray-900 relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Info */}
          <div>
            <div 
              className="flex items-center gap-3 mb-8 cursor-pointer group"
              onClick={() => go('home')}
            >
              <div className="bg-brand-red text-white p-2 rounded transform -skew-x-12 group-hover:scale-110 transition-transform">
                <Package size={24} className="transform skew-x-12" />
              </div>
              <span className="text-3xl font-extrabold text-white tracking-tighter italic">SAND</span>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed text-sm">
              Global express partner for the modern age. We deliver reliability, speed, and innovation to every corner of the world.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded bg-gray-900 flex items-center justify-center hover:bg-brand-red hover:text-white text-gray-400 transition-all duration-300 hover:-translate-y-1">
                    <Icon size={18} />
                  </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-8 text-lg border-b-2 border-brand-red inline-block pb-1">Services</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              {[
                { label: 'Air Freight', id: 'services' }, 
                { label: 'Ocean Cargo', id: 'services' }, 
                { label: 'Road Transport', id: 'services' }, 
                { label: 'Warehousing', id: 'services' }, 
                { label: 'Supply Chain', id: 'services' }
              ].map((item, i) => (
                  <li key={i}>
                    <button 
                      onClick={() => go(item.id as PageType)} 
                      className="hover:text-brand-red transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-brand-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item.label}
                    </button>
                  </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-8 text-lg border-b-2 border-brand-red inline-block pb-1">Company</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              {[
                { label: 'About Us', id: 'about' }, 
                { label: 'Careers', id: 'careers' }, 
                { label: 'Sustainability', id: 'sustainability' }, 
                { label: 'Newsroom', id: 'news' }, 
                { label: 'Contact', id: 'contact' }
              ].map((item, i) => (
                  <li key={i}>
                    <button 
                      onClick={() => go(item.id as PageType)} 
                      className="hover:text-brand-red transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-brand-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item.label}
                    </button>
                  </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-8 text-lg border-b-2 border-brand-red inline-block pb-1">Newsletter</h4>
            <p className="text-gray-400 mb-6 text-sm">Subscribe to get the latest logistics news and market trends.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-gray-900 border border-gray-800 text-white px-5 py-4 rounded focus:ring-1 focus:ring-brand-red focus:border-brand-red outline-none pr-12 text-sm transition-all focus:bg-gray-800"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-red rounded flex items-center justify-center hover:bg-brand-redDark transition-colors shadow-lg">
                <ArrowRight size={18} />
              </button>
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
               <MapPin size={16} className="text-brand-red" />
               <span>Headquarters: Coldbath Square, London, United Kingdom</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Sand Global Express Inc. All rights reserved.
          </div>
          <div className="flex gap-8">
            <button onClick={() => go('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => go('terms')} className="hover:text-white transition-colors">Terms & Conditions</button>
            <button onClick={() => go('cookies')} className="hover:text-white transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;