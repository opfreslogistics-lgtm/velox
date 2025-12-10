'use client';

import React from 'react';
import { Shield, KeyRound, Server, MapPin, Globe2 } from 'lucide-react';

const envStatus = (val?: string) =>
  val ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20';

export default function SettingsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const settings = [
    {
      title: 'Supabase URL',
      value: supabaseUrl ? 'Configured' : 'Missing',
      helper: 'NEXT_PUBLIC_SUPABASE_URL',
      icon: Server,
      ok: !!supabaseUrl,
    },
    {
      title: 'Supabase Anon Key',
      value: supabaseAnon ? 'Configured' : 'Missing',
      helper: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      icon: KeyRound,
      ok: !!supabaseAnon,
    },
    {
      title: 'Google Maps API Key',
      value: googleKey ? 'Configured' : 'Missing',
      helper: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
      icon: MapPin,
      ok: !!googleKey,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-red">Admin</p>
        <h1 className="text-3xl font-extrabold text-brand-black dark:text-white flex items-center gap-2">
          <Shield size={22} /> Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Environment and platform configuration checks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {settings.map((item) => (
          <div
            key={item.title}
            className={`p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-3`}
          >
            <item.icon size={24} className={item.ok ? 'text-emerald-500' : 'text-red-500'} />
            <div className="flex-1">
              <p className="text-sm font-bold text-brand-black dark:text-white">{item.title}</p>
              <p className="text-xs text-gray-500">{item.helper}</p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full ${item.ok ? envStatus('x') : envStatus('')}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-brand-black dark:text-white flex items-center gap-2">
          <Globe2 size={18} /> About this Admin
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
          <li>Shipments use Supabase tables `shipments` and `tracking_events`.</li>
          <li>Maps use Google Maps JS API; set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.</li>
          <li>Authentication is handled via Supabase auth; log out via the profile menu.</li>
        </ul>
      </div>
    </div>
  );
}


