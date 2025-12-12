'use client';

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Users, Settings, LogOut, Package as PackageIcon } from 'lucide-react';

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Customers', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`bg-brand-black text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} z-20 shadow-xl min-h-screen`}>
      <div className="h-20 flex items-center justify-center border-b border-gray-800">
        <div className="flex items-center gap-2" onClick={() => setCollapsed(!collapsed)}>
          <div className="bg-brand-red p-1.5 rounded transform -skew-x-12 cursor-pointer">
             <PackageIcon size={20} className="transform skew-x-12" />
          </div>
          {!collapsed && <span className="font-extrabold text-xl tracking-tighter italic">SAND<span className="text-brand-red">.ADMIN</span></span>}
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-colors duration-200 group
              ${pathname === item.href ? 'bg-brand-red text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
              ${collapsed ? 'justify-center' : ''}
            `}
            title={collapsed ? item.label : ''}
          >
            <item.icon size={20} />
            {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
         <Link href="/" className={`w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-bold">Exit Dashboard</span>}
         </Link>
      </div>
    </aside>
  );
}