'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Users, Search, Loader2, AlertCircle, Mail, Phone, MapPin } from 'lucide-react';

interface Customer {
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  type: 'Sender' | 'Recipient';
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isDemoMode) {
          setCustomers([]);
          setError('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
          return;
        }

        const { data, error } = await supabase.from('shipments').select('*').limit(500);
        if (error) throw error;

        const rows = data || [];
        const mapped: Customer[] = [];

        rows.forEach((row: any) => {
          mapped.push({
            name: row.sender_name,
            email: row.sender_email,
            phone: row.sender_phone,
            city: row.sender_city,
            country: row.sender_country,
            type: 'Sender',
          });
          mapped.push({
            name: row.recipient_name,
            email: row.recipient_email,
            phone: row.recipient_phone,
            city: row.recipient_city,
            country: row.recipient_country,
            type: 'Recipient',
          });
        });

        // de-duplicate by name+type+email
        const key = (c: Customer) => `${c.type}-${(c.name || '').toLowerCase()}-${(c.email || '').toLowerCase()}`;
        const dedup = Array.from(new Map(mapped.map((c) => [key(c), c])).values());
        setCustomers(dedup);
      } catch (err: any) {
        setError(err.message || 'Failed to load customers.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isDemoMode]);

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-red">Admin</p>
          <h1 className="text-3xl font-extrabold text-brand-black dark:text-white flex items-center gap-2">
            <Users size={22} /> Customers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Derived from shipment sender/recipient records.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone"
          className="flex-1 bg-transparent outline-none text-sm dark:text-white"
        />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-red" size={28} />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="p-4 font-bold text-gray-500 uppercase text-xs">Name</th>
                  <th className="p-4 font-bold text-gray-500 uppercase text-xs">Type</th>
                  <th className="p-4 font-bold text-gray-500 uppercase text-xs">Contact</th>
                  <th className="p-4 font-bold text-gray-500 uppercase text-xs">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((c, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="p-4 font-bold text-brand-black dark:text-white">{c.name || '-'}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                        {c.type}
                      </span>
                    </td>
                    <td className="p-4 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                      {c.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" /> {c.email}
                        </div>
                      )}
                      {c.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" /> {c.phone}
                        </div>
                      )}
                      {!c.email && !c.phone && <span className="text-gray-400">No contact provided</span>}
                    </td>
                    <td className="p-4 text-xs text-gray-600 dark:text-gray-300">
                      {c.city || c.country ? (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" /> {c.city || '-'}, {c.country || '-'}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-400">No customers match your search.</div>
          )}
        </div>
      )}
    </div>
  );
}


