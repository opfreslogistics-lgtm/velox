'use client';

import React, { useState, useEffect } from 'react';
import { Shield, KeyRound, Server, MapPin, Globe2, Save, Loader2, CheckCircle } from 'lucide-react';
import { clearMapProviderCache } from '@/lib/mapProvider';

const envStatus = (val?: string) =>
  val ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20';

type MapProvider = 'google' | 'openstreetmap' | 'mapbox';

export default function SettingsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapboxKey = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const [mapProvider, setMapProvider] = useState<MapProvider>('google');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Fetch current map provider
    fetch('/api/map-provider')
      .then((res) => res.json())
      .then((data) => {
        setMapProvider(data.provider || 'google');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch map provider:', err);
        setLoading(false);
      });
  }, []);

  const handleSaveMapProvider = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/map-provider', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: mapProvider }),
      });

      if (!response.ok) {
        throw new Error('Failed to update map provider');
      }

      clearMapProviderCache(); // Clear cache so all components reload
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save map provider:', err);
      alert('Failed to save map provider. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
    {
      title: 'Mapbox Token',
      value: mapboxKey ? 'Configured' : 'Missing',
      helper: 'NEXT_PUBLIC_MAPBOX_TOKEN',
      icon: MapPin,
      ok: !!mapboxKey,
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

      {/* Map Provider Settings */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-brand-black dark:text-white flex items-center gap-2">
              <MapPin size={18} /> Map Provider Settings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Select the map provider used throughout the platform
            </p>
          </div>
          {saveSuccess && (
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle size={18} />
              <span className="text-sm font-semibold">Saved!</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-brand-red" size={24} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-brand-red/50">
                <input
                  type="radio"
                  name="mapProvider"
                  value="google"
                  checked={mapProvider === 'google'}
                  onChange={(e) => setMapProvider(e.target.value as MapProvider)}
                  className="sr-only"
                />
                <div className={`flex-1 ${mapProvider === 'google' ? 'text-brand-red' : 'text-gray-600 dark:text-gray-400'}`}>
                  <div className="font-bold text-lg mb-1">Google Maps</div>
                  <div className="text-xs">Requires API key</div>
                </div>
                {mapProvider === 'google' && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-brand-red rounded-full"></div>
                )}
              </label>

              <label className="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-brand-red/50">
                <input
                  type="radio"
                  name="mapProvider"
                  value="openstreetmap"
                  checked={mapProvider === 'openstreetmap'}
                  onChange={(e) => setMapProvider(e.target.value as MapProvider)}
                  className="sr-only"
                />
                <div className={`flex-1 ${mapProvider === 'openstreetmap' ? 'text-brand-red' : 'text-gray-600 dark:text-gray-400'}`}>
                  <div className="font-bold text-lg mb-1">OpenStreetMap</div>
                  <div className="text-xs">Free, requires coordinates</div>
                </div>
                {mapProvider === 'openstreetmap' && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-brand-red rounded-full"></div>
                )}
              </label>

              <label className="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-brand-red/50">
                <input
                  type="radio"
                  name="mapProvider"
                  value="mapbox"
                  checked={mapProvider === 'mapbox'}
                  onChange={(e) => setMapProvider(e.target.value as MapProvider)}
                  className="sr-only"
                />
                <div className={`flex-1 ${mapProvider === 'mapbox' ? 'text-brand-red' : 'text-gray-600 dark:text-gray-400'}`}>
                  <div className="font-bold text-lg mb-1">Mapbox GL</div>
                  <div className="text-xs">Requires access token</div>
                </div>
                {mapProvider === 'mapbox' && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-brand-red rounded-full"></div>
                )}
              </label>
            </div>

            <button
              onClick={handleSaveMapProvider}
              disabled={saving}
              className="w-full md:w-auto px-6 py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-brand-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Map Provider
                </>
              )}
            </button>

            <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="font-semibold mb-1">Note:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Changing the map provider affects all maps across the platform</li>
                <li>OpenStreetMap requires manual coordinate input when creating shipments</li>
                <li>Google Maps and Mapbox use address geocoding automatically</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-brand-black dark:text-white flex items-center gap-2">
          <Globe2 size={18} /> About this Admin
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
          <li>Shipments use Supabase tables `shipments` and `tracking_events`.</li>
          <li>Maps can use Google Maps, OpenStreetMap, or Mapbox GL based on admin selection.</li>
          <li>Authentication is handled via Supabase auth; log out via the profile menu.</li>
        </ul>
      </div>
    </div>
  );
}


