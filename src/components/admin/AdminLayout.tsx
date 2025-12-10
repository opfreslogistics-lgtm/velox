'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, Users, Settings, LogOut, 
  Menu, Bell, Search, Sun, Moon, MessageSquare, PenTool
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageType } from '@/types';
import AdminProfileMenu from './AdminProfileMenu';
import { supabase } from '@/lib/supabaseClient';

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
  'admin-shipments': '/admin/shipments',
  'admin-users': '/admin/users',
  'admin-blog': '/admin/blog',
  'admin-settings': '/admin/settings',
  cookies: '/cookies',
};

interface AdminLayoutProps {
  activePage: PageType;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ activePage, children }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  React.useEffect(() => {
    // Default to dark mode unless explicitly set to light
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const shouldBeDark = savedTheme !== 'light';
    if (shouldBeDark) {
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

  const handleExitDashboard = async () => {
    localStorage.removeItem('demo_admin');
    await supabase.auth.signOut();
    router.replace('/');
  };

  const navigate = (page: PageType) => {
    const href = pageToHref[page] || '/admin/dashboard';
    router.push(href as any);
  };

  const menuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-shipments', label: 'Shipments', icon: Package },
    { id: 'admin-users', label: 'Customers', icon: Users },
    { id: 'admin-blog', label: 'Blog', icon: PenTool },
    { id: 'admin-settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-brand-black dark:text-white font-sans overflow-hidden transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className={`bg-brand-black text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} z-20 shadow-xl`}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="bg-brand-red p-1.5 rounded transform -skew-x-12">
               <Package size={20} className="transform skew-x-12" />
            </div>
            {!collapsed && <span className="font-extrabold text-xl tracking-tighter italic">VELOX<span className="text-brand-red">.ADMIN</span></span>}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id as PageType)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-colors duration-200 group
                ${activePage === item.id ? 'bg-brand-red text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : ''}
            >
              <item.icon size={20} />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              {activePage === item.id && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
            </button>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-800">
           <button onClick={handleExitDashboard} className={`w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors ${collapsed ? 'justify-center' : ''}`}>
              <LogOut size={20} />
              {!collapsed && <span className="text-sm font-bold">Exit Dashboard</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - Admin Specific Design */}
        <header className="h-20 bg-gradient-to-r from-brand-black to-gray-900 dark:from-gray-900 dark:to-brand-black border-b-2 border-brand-red flex items-center justify-between px-8 shadow-lg transition-colors duration-300">
           <div className="flex items-center gap-4">
              <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded hover:bg-white/10 text-white">
                 <Menu size={20} />
              </button>
              <div className="hidden md:flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 w-64 border border-white/20 focus-within:border-brand-red transition-all">
                 <Search size={16} className="text-white/70" />
                 <input type="text" placeholder="Search shipments, customers..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder-white/50" />
              </div>
           </div>

           <div className="flex items-center gap-6">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10 text-white">
                 {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="relative cursor-pointer">
                 <Bell size={20} className="text-white" />
                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-brand-black"></span>
              </div>
              <AdminProfileMenu />
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 md:p-8 relative">
           {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;