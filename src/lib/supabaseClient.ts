'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

// Resilient storage: fall back to in-memory if localStorage is unavailable or over quota
const safeStorage = (() => {
  const memory = new Map<string, string>();

  const memoryStorage: Storage = {
    getItem: (key: string) => (memory.has(key) ? memory.get(key)! : null),
    setItem: (key: string, value: string) => {
      memory.set(key, value);
    },
    removeItem: (key: string) => {
      memory.delete(key);
    },
    clear: () => memory.clear(),
    key: (index: number) => Array.from(memory.keys())[index] ?? null,
    get length() {
      return memory.size;
    },
  };

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const testKey = '__sb_quota_test__';
      window.localStorage.setItem(testKey, 'ok');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch (err) {
    console.warn('localStorage unavailable or over quota; falling back to in-memory auth storage.', err);
  }
  return memoryStorage;
})();

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'public-anon-key',
  {
    auth: {
      storage: safeStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);


