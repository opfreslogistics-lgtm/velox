'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Copy, QrCode, Loader2, CheckCircle2, MapPin, Clock3, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import Tracking from '@/components/Tracking';

export default function ShipmentResultPage() {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // The Tracking component will handle fetching and displaying
    setLoading(false);
  }, [shipmentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-red" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <Tracking mode="page" initialId={shipmentId as string} />
    </div>
  );
}


