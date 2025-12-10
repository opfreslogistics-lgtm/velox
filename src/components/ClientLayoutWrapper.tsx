'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPage = pathname?.startsWith('/admin');
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If an admin session exists, keep them inside the dashboard
  useEffect(() => {
    let mounted = true;
    const enforceAdminContext = async () => {
      const demoFlag = typeof window !== 'undefined' ? localStorage.getItem('demo_admin') === 'true' : false;
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if ((data.session || demoFlag || isDemoMode) && !isAdminPage) {
        router.replace('/admin/dashboard');
      }
    };
    enforceAdminContext();
    return () => {
      mounted = false;
    };
  }, [isAdminPage, router]);

  return (
    <>
      {!isAdminPage && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </>
  );
}


