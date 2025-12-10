'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { PageType } from '@/types';
import { supabase } from '@/lib/supabaseClient';

const pathToPage: Record<string, PageType> = {
  '/admin': 'admin-login',
  '/admin/dashboard': 'admin-dashboard',
  '/admin/shipments': 'admin-shipments',
  '/admin/users': 'admin-users',
  '/admin/blog': 'admin-blog',
  '/admin/settings': 'admin-settings',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const activePage = (pathToPage[pathname] || 'admin-dashboard') as PageType;
  const isLoginPage = pathname === '/admin';
  const [isReady, setIsReady] = useState(isLoginPage);
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Gate admin routes and keep authenticated users off the login screen
  useEffect(() => {
    let mounted = true;

    const runChecks = async () => {
      const demoFlag = typeof window !== 'undefined' ? localStorage.getItem('demo_admin') === 'true' : false;
      const { data: sessionData } = await supabase.auth.getSession();
      if (!mounted) return;

      const hasSession = Boolean(sessionData.session) || demoFlag || isDemoMode;

      if (isLoginPage) {
        if (hasSession) {
          router.replace('/admin/dashboard');
          return;
        }
        setIsReady(true);
      } else {
        if (!hasSession) {
          router.replace('/admin');
          return;
        }
        setIsReady(true);
      }
    };

    runChecks();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('demo_admin');
        router.replace('/');
      }
      if (event === 'SIGNED_IN' && isLoginPage) {
        localStorage.removeItem('demo_admin'); // prioritize real session
        router.replace('/admin/dashboard');
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [isLoginPage, router, pathname]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Don't show sidebar/topbar on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminLayout activePage={activePage}>
      {children}
    </AdminLayout>
  );
}