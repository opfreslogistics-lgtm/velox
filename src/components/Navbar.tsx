'use client';

import React, { useState, useEffect } from 'react';
import { 
  Phone, Mail, Search, User, Menu, X, ChevronDown, 
  Package, Sun, Moon
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { NavItem, PageType } from '@/types';

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
  news: '/news',
  partners: '/about',
  'admin-login': '/admin',
  'admin-dashboard': '/admin/dashboard',
  'admin-users': '/admin/users',
  'admin-settings': '/admin/settings',
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { 
    label: 'Services', 
    href: '/services',
    children: [
      { label: 'Air Freight', href: '/services/air' },
      { label: 'Ocean Freight', href: '/services/ocean' },
      { label: 'Road Transport', href: '/services/road' },
      { label: 'Warehousing', href: '/services/warehousing' }
    ]
  },
  { label: 'Tracking', href: '/tracking' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleNavClick = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header className="w-full relative z-50 bg-white dark:bg-brand-black font-sans sticky top-0 shadow-md transition-colors duration-300">
      {/* Tier 1: Top Bar (Black) */}
      <div className="hidden md:flex justify-between items-center bg-brand-black text-white text-xs py-2 px-6 lg:px-12 border-b border-gray-800">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 hover:text-brand-red transition-colors cursor-pointer font-medium">
            <Phone size={14} className="text-brand-yellow" /> 1-800-VELOX-SHIP
          </span>
          <span className="flex items-center gap-2 hover:text-brand-red transition-colors cursor-pointer font-medium">
            <Mail size={14} className="text-brand-yellow" /> support@veloxlogistics.com
          </span>
        </div>
        <div className="flex items-center gap-6 font-medium">
          <button onClick={() => handleNavClick('contact')} className="hover:text-brand-yellow transition-colors">Help Center</button>
          <button onClick={() => handleNavClick('careers')} className="hover:text-brand-yellow transition-colors">Careers</button>
          <button onClick={() => handleNavClick('partners')} className="hover:text-brand-yellow transition-colors">Partners</button>
        </div>
      </div>

      {/* Tier 2: Middle Bar (Branding & Search) */}
      <div className="flex justify-between items-center py-5 px-6 lg:px-12 bg-white dark:bg-brand-black transition-colors duration-300">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => handleNavClick('home')}
        >
          <div className="bg-brand-red text-white p-2 rounded transform -skew-x-12">
            <Package size={28} className="transform skew-x-12" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-brand-black dark:text-white leading-none tracking-tighter italic">VELOX</span>
            <span className="text-[0.6rem] font-bold text-brand-red uppercase tracking-widest">Global Logistics</span>
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-12 relative group">
          <input 
            type="text" 
            placeholder="Track ID, Service, or Keyword..." 
            className="w-full pl-5 pr-12 py-3 rounded-full bg-brand-gray dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-brand-red dark:focus:border-brand-red focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-sm font-medium"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-red text-white p-2 rounded-full hover:bg-brand-redDark transition-colors shadow-sm">
            <Search size={16} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-brand-black dark:text-white transition-colors"
            title="Toggle Dark Mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={() => handleNavClick('admin-login')}
            className="hidden md:flex items-center gap-2 text-sm font-bold text-brand-black dark:text-white hover:text-brand-red dark:hover:text-brand-red transition-colors"
          >
            <User size={20} />
            <span>Login</span>
          </button>
          <button 
            onClick={() => handleNavClick('admin-login')}
            className="hidden md:block bg-brand-yellow text-brand-black px-6 py-2.5 rounded font-bold text-sm hover:bg-brand-yellowDark transition-colors shadow-sm transform hover:-translate-y-0.5"
          >
            Sign Up
          </button>
          
          <button className="md:hidden text-brand-black dark:text-white" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Tier 3: Main Navigation (Red Bar) */}
      <div className="hidden md:block bg-brand-red text-white px-6 lg:px-12 shadow-lg">
        <nav className="flex items-center justify-between">
          <div className="flex">
            {NAV_ITEMS.map((item) => (
              <div 
                key={item.href}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.href)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center gap-1 py-4 px-6 text-sm font-bold uppercase tracking-wide transition-colors ${
                    isActive(item.href) ? 'bg-brand-redDark text-brand-yellow' : 'hover:bg-brand-redDark'
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                </button>

                {/* Dropdown */}
                {item.children && (
                  <div 
                    className={`absolute top-full left-0 w-64 bg-white dark:bg-gray-900 text-brand-black dark:text-white shadow-2xl rounded-b-lg overflow-hidden transition-all duration-200 origin-top z-50 border-t-4 border-brand-yellow ${
                      activeDropdown === item.href ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                    }`}
                  >
                    {item.children.map((child, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleNavClick(child.href)}
                        className="block w-full text-left px-6 py-3 text-sm font-medium hover:bg-brand-gray dark:hover:bg-gray-800 hover:text-brand-red border-l-4 border-transparent hover:border-brand-red transition-all"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="py-2">
             <button 
                onClick={() => handleNavClick('/pricing')}
                className="flex items-center gap-2 text-xs font-bold text-white bg-black/20 px-4 py-2 rounded hover:bg-black/30 transition-colors uppercase"
             >
                <Package size={14} /> Get A Quote
             </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-2xl overflow-hidden transition-all duration-300 z-50 ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 space-y-2">
            <div className="relative mb-6">
                <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-4 pr-10 py-3 rounded bg-gray-100 dark:bg-gray-800 text-brand-black dark:text-white border-none focus:ring-2 focus:ring-brand-red"
                />
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {NAV_ITEMS.map((item) => (
                <div key={item.href} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <button 
                      onClick={() => handleNavClick(item.href)} 
                      className={`block w-full text-left py-3 font-bold text-lg ${isActive(item.href) ? 'text-brand-red' : 'text-brand-black dark:text-white'}`}
                    >
                      {item.label}
                    </button>
                    {item.children && (
                        <div className="pl-4 pb-4 space-y-3 bg-gray-50 dark:bg-gray-800 rounded mb-2">
                            {item.children.map(child => (
                                <button 
                                  key={child.label} 
                                  onClick={() => handleNavClick(child.href)}
                                  className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-red"
                                >
                                  {child.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <div className="pt-6 flex flex-col gap-3">
                <button onClick={() => handleNavClick('admin-login')} className="w-full py-4 border-2 border-brand-black dark:border-white text-brand-black dark:text-white rounded font-bold uppercase hover:bg-brand-black hover:text-white dark:hover:bg-white dark:hover:text-brand-black transition-colors">Login Access</button>
                <button onClick={() => handleNavClick('pricing')} className="w-full py-4 bg-brand-red text-white rounded font-bold uppercase hover:bg-brand-redDark transition-colors shadow-lg">Get a Quote</button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;