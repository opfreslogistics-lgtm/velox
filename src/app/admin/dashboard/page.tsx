'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Package, TrendingUp, Clock3 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface DashboardStats {
  liveShipments: number;
  onTimePerformance: number;
  revenue: number;
  exceptions: number;
  recentExceptions: Array<{
    ref: string;
    issue: string;
    lane: string;
    eta: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    liveShipments: 0,
    onTimePerformance: 0,
    revenue: 0,
    exceptions: 0,
    recentExceptions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all shipments
      const { data: shipments, error: shipmentsError } = await supabase
        .from('shipments')
        .select('*');

      if (shipmentsError) throw shipmentsError;

      // Calculate stats
      const liveShipments = shipments?.filter(s => 
        ['In Transit', 'Out for Delivery', 'Picked Up', 'At Warehouse', 'Departed Facility', 'Arrived at Facility'].includes(s.status)
      ).length || 0;

      const delivered = shipments?.filter(s => s.status === 'Delivered').length || 0;
      const totalWithDelivery = shipments?.filter(s => s.delivered_at || s.status === 'Delivered').length || 0;
      const onTime = shipments?.filter(s => {
        if (!s.delivered_at || !s.estimated_delivery_date) return false;
        return new Date(s.delivered_at) <= new Date(s.estimated_delivery_date);
      }).length || 0;
      const onTimePerformance = totalWithDelivery > 0 ? Math.round((onTime / totalWithDelivery) * 100) : 0;

      const revenue = shipments?.reduce((sum, s) => {
        return sum + (parseFloat(s.declared_value || 0) * 0.1); // Example: 10% of declared value
      }, 0) || 0;

      const exceptions = shipments?.filter(s => 
        ['On Hold', 'Delayed', 'Weather Delay', 'Address Issue', 'Customs Hold', 'Inspection Required', 'Lost Package', 'Damaged Package'].includes(s.status)
      ).length || 0;

      // Get recent exceptions
      const exceptionShipments = shipments?.filter(s => 
        ['On Hold', 'Delayed', 'Weather Delay', 'Address Issue', 'Customs Hold', 'Inspection Required', 'Lost Package', 'Damaged Package'].includes(s.status)
      ).slice(0, 3) || [];

      const recentExceptions = exceptionShipments.map(s => ({
        ref: s.reference_code || s.tracking_number,
        issue: s.status,
        lane: `${s.sender_city} → ${s.recipient_city}`,
        eta: s.estimated_delivery_date 
          ? new Date(s.estimated_delivery_date).toLocaleDateString()
          : 'TBD',
      }));

      setStats({
        liveShipments,
        onTimePerformance,
        revenue,
        exceptions,
        recentExceptions,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cards = [
    { 
      title: 'Live Shipments', 
      value: stats.liveShipments.toString(), 
      change: '+12%', 
      icon: Package, 
      tone: 'from-brand-red to-orange-400' 
    },
    { 
      title: 'On-time Performance', 
      value: `${stats.onTimePerformance}%`, 
      change: '+1.4%', 
      icon: Clock3, 
      tone: 'from-emerald-400 to-cyan-500' 
    },
    { 
      title: 'Revenue (MTD)', 
      value: `$${(stats.revenue / 1000).toFixed(1)}K`, 
      change: '+8.2%', 
      icon: TrendingUp, 
      tone: 'from-indigo-400 to-blue-600' 
    },
    { 
      title: 'Exceptions', 
      value: stats.exceptions.toString(), 
      change: '-3', 
      icon: Activity, 
      tone: 'from-amber-400 to-rose-400' 
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-red">Control Tower</p>
        <h1 className="text-3xl font-extrabold text-brand-black dark:text-white">Operations Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor performance, exceptions, and service health.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.tone} text-white flex items-center justify-center shadow-lg`}>
                <Icon size={22} />
              </div>
              <div className="mt-4 text-sm font-bold text-gray-500 uppercase">{card.title}</div>
              <div className="text-2xl font-extrabold text-brand-black dark:text-white">{card.value}</div>
              <div className="text-xs font-semibold text-emerald-500 mt-1">{card.change} vs last week</div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-brand-black dark:text-white">Network Health</h3>
              <p className="text-sm text-gray-500">Lane-level reliability and capacity view.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Stable</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Air Priority', value: '98% on-time' },
              { label: 'Ocean FCL', value: '93% on-time' },
              { label: 'Road EU', value: '95% on-time' },
              { label: 'Warehousing', value: '99.2% accuracy' },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-bold text-gray-500 uppercase">{item.label}</div>
                <div className="text-lg font-bold text-brand-black dark:text-white mt-1">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-brand-black dark:text-white">Exceptions</h3>
              <p className="text-sm text-gray-500">Active cases needing attention.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">{stats.exceptions} open</span>
          </div>
          <div className="space-y-3">
            {stats.recentExceptions.length > 0 ? (
              stats.recentExceptions.map((item) => (
              <div key={item.ref} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-sm font-bold text-brand-black dark:text-white">
                  <span>{item.ref}</span>
                  <span className="text-amber-500">{item.issue}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{item.lane}</div>
                <div className="text-xs text-gray-500">{item.eta}</div>
              </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-center text-sm text-gray-500">
                No exceptions at this time
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}