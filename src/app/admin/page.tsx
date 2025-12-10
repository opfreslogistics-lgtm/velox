'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Keep authenticated users away from the login screen
  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data.session) {
        router.replace('/admin/dashboard');
      }
    };
    checkSession();
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHint(null);

    try {
      // Demo/local fallback: if Supabase creds are missing, bypass and allow dashboard locally.
      if (isDemoMode) {
        localStorage.setItem('demo_admin', 'true');
        router.push('/admin/dashboard');
        return;
      }

      // Add a timeout so we never hang indefinitely (e.g., quota/expired key)
      const timeout = new Promise((_resolve, reject) =>
        setTimeout(
          () => reject(new Error('Login timed out. Please retry or contact support.')),
          20000
        )
      );

      const signIn = supabase.auth.signInWithPassword({ email, password });
      const { error } = (await Promise.race([signIn, timeout])) as Awaited<
        ReturnType<typeof supabase.auth.signInWithPassword>
      >;

      if (error) {
        throw error;
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      const msg = err?.message || '';
      // Hide noisy storage quota errors from the UI; show a generic message instead.
      const isStorageQuotaError = msg.toLowerCase().includes('quota') || msg.includes('sb-');
      setError(isStorageQuotaError ? 'Unable to sign in right now. Please try again.' : (msg || 'Unable to sign in right now.'));
      setHint(
        isStorageQuotaError
          ? null
          : 'If this keeps happening: (1) confirm NEXT_PUBLIC_SUPABASE_URL/ANON_KEY are set, (2) check Supabase project auth settings/allowed URLs, (3) verify quota/status in Supabase dashboard.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-brand-red to-amber-400 text-white shadow-lg">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-brand-red">Velox Admin</p>
            <h1 className="text-2xl font-extrabold text-brand-black dark:text-white">Secure Sign In</h1>
          </div>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded p-3">{error}</div>}
        {hint && <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded p-3">{hint}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:border-brand-red outline-none"
              placeholder="admin@velox.com"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:border-brand-red outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-brand-red to-amber-400 text-white font-bold shadow-lg hover:shadow-xl transition disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}


