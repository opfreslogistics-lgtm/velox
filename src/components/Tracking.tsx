
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Package, ArrowRight, MapPin, CheckCircle, Truck, AlertTriangle, 
  Clock, Share2, Printer, Smartphone, X, Box, Plane, ZoomIn, 
  Phone, MessageSquare, Cloud, Leaf, Star, Calendar, User, Info, Mail, TrendingUp, 
  Scale, Hash, Receipt
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import dynamic from 'next/dynamic';
import Barcode from '@/components/shipment/Barcode';
import Stamp from '@/components/shipment/Stamp';

// Master status-to-percentage map
const STATUS_PROGRESS: Record<string, number> = {
  'Pending': 5,
  'Awaiting Payment': 10,
  'Payment Confirmed': 20,
  'Processing': 30,
  'Ready for Pickup': 35,
  'Driver En Route': 40,
  'Picked Up': 45,
  'At Warehouse': 50,
  'In Transit': 60,
  'Departed Facility': 65,
  'Arrived at Facility': 70,
  'Out for Delivery': 85,
  'Delivered': 100,
  'Returned to Sender': 0,
  'Cancelled': 0,
  'On Hold': 15,
  'Delayed': 25,
  'Weather Delay': 25,
  'Address Issue': 25,
  'Customs Hold': 35,
  'Inspection Required': 45,
  'Payment Verification Required': 15,
  'Lost Package': 0,
  'Damaged Package': 0,
};

// Dynamically import Google Maps component to avoid SSR issues
const LeafletMap = dynamic(() => import('@/components/shipment/GoogleMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] bg-gray-100 dark:bg-gray-800 rounded-xl">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  ),
});

interface TrackingProps {
  mode?: 'widget' | 'page';
  initialId?: string;
  onSearch?: (id: string) => void;
}

const Tracking: React.FC<TrackingProps> = ({ mode = 'widget', initialId = '', onSearch }) => {
  const [inputVal, setInputVal] = useState(initialId);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Shipment | null>(null);
  const [rawShipment, setRawShipment] = useState<any>(null); // Store raw shipment data for additional fields
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState('');

  // Auto-search logic
  useEffect(() => {
    if (mode === 'page' && initialId && !data) {
       handleTrack(new Event('submit') as any, initialId);
    }
  }, [initialId, mode]);

  useEffect(() => {
    if (!data?.eta) {
      setTimeLeft('');
      return;
    }

    const target = new Date(data.eta).getTime();
    if (Number.isNaN(target)) {
      setTimeLeft('');
      return;
    }

    const tick = () => {
      const now = Date.now();
      const diffMs = target - now;
      if (diffMs <= 0) {
        setTimeLeft('Arrived');
        return;
      }
      const totalMinutes = Math.floor(diffMs / 60000);
      const days = Math.floor(totalMinutes / 1440);
      const hours = Math.floor((totalMinutes % 1440) / 60);
      const minutes = totalMinutes % 60;
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    };

    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [data?.eta]);

  const handleTrack = async (e: React.FormEvent, overrideId?: string) => {
    e.preventDefault();
    const idToSearch = (overrideId ?? inputVal).trim();

    if (!idToSearch) {
      setError('Invalid tracking number');
      return;
    }

    if (mode === 'widget') {
        // Redirect to result page for widget mode
        window.location.href = `/shipment/${idToSearch}`;
        return;
    }
    
    setIsLoading(true);
    setError('');
    setData(null);
    setRawShipment(null);

    try {
      // Ensure Supabase is configured before querying
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError('Live tracking is unavailable: Supabase is not configured.');
        return;
      }

      // Try lookup by tracking_number (case-insensitive), then reference_code
      const { data: byTracking, error: trackingErr } = await supabase
        .from('shipments')
        .select('*')
        .ilike('tracking_number', idToSearch)
        .maybeSingle();

      const { data: byReference, error: referenceErr } = byTracking
        ? { data: null, error: null }
        : await supabase
            .from('shipments')
            .select('*')
            .ilike('reference_code', idToSearch)
            .maybeSingle();

      const shipment = byTracking || byReference;
      const lookupError = trackingErr || referenceErr;

      if (lookupError && lookupError.code !== 'PGRST116') {
        setError(lookupError.message || 'Failed to fetch shipment data.');
        return;
      }

      if (!shipment) {
        setError('Shipment not found. Please check your tracking number.');
        return;
      }

      // Extract current location from data field (can be name only or with coordinates)
      const locationData = (shipment.data as any)?.currentLocation;
      const currentLocation = locationData
        ? {
            name: locationData.name || 'In Transit',
            // Coordinates are optional - will be geocoded if not provided
            lat: locationData.lat,
            lng: locationData.lng,
          }
        : undefined;

      // Merge agent data: prioritize column fields, fall back to JSON data, then generate
      const agentDataRaw = (shipment.data as any)?.agent || {};
      const mergedAgent = (shipment.agent_name || agentDataRaw.name || shipment.agent_id || agentDataRaw.id)
        ? {
            name: shipment.agent_name || agentDataRaw.name || '',
            phone: shipment.agent_phone || agentDataRaw.phone || '',
            email: shipment.agent_email || agentDataRaw.email || '',
            rating: shipment.agent_rating || agentDataRaw.rating || 5.0,
            photo: shipment.agent_profile_picture || agentDataRaw.photo || '',
            id:
              shipment.agent_id ||
              agentDataRaw.id ||
              (shipment.agent_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() + '-' + shipment.tracking_number?.slice(-4)) ||
              'AGT-' + (shipment.tracking_number?.slice(-4) || 'N/A'),
            vehicle: agentDataRaw.vehicle || (shipment.data as any)?.agent_vehicle || '',
          }
        : undefined;

      // Transform Supabase data to match Shipment interface
      const transformedData: Shipment = {
        id: shipment.id,
        trackingNumber: shipment.tracking_number,
        sender: shipment.sender_name,
        senderAddress: `${shipment.sender_address_line1}${shipment.sender_address_line2 ? ', ' + shipment.sender_address_line2 : ''}, ${shipment.sender_city}, ${shipment.sender_state} ${shipment.sender_postal_code}, ${shipment.sender_country}`,
        senderEmail: shipment.sender_email,
        senderPhone: shipment.sender_phone,
        recipient: shipment.recipient_name,
        recipientAddress: `${shipment.recipient_address_line1}${shipment.recipient_address_line2 ? ', ' + shipment.recipient_address_line2 : ''}, ${shipment.recipient_city}, ${shipment.recipient_state} ${shipment.recipient_postal_code}, ${shipment.recipient_country}`,
        recipientEmail: shipment.recipient_email || '',
        recipientPhone: shipment.recipient_phone,
        origin: `${shipment.sender_city}, ${shipment.sender_country}`,
        destination: `${shipment.recipient_city}, ${shipment.recipient_country}`,
        status: shipment.status as ShipmentStatus,
        dateCreated: shipment.created_at || new Date().toISOString(),
        eta: shipment.estimated_delivery_date || shipment.preferred_delivery_date || '',
        weight: `${shipment.weight} kg`,
        dimensions: `${shipment.length}x${shipment.width}x${shipment.height} cm`,
        type: shipment.shipment_type,
        serviceType: shipment.delivery_speed,
        progress: shipment.status === 'Delivered' ? 100 : shipment.status === 'In Transit' ? 50 : 25,
        currentLocation,
        agent: mergedAgent,
        history: [],
        images: (shipment.package_images as any[]) || [],
        signature: (shipment.data as any)?.signature || '',
      };

      // Fetch tracking events in parallel after getting shipment
      const { data: events } = await supabase
        .from('tracking_events')
        .select('*')
        .eq('shipment_id', shipment.id)
        .order('timestamp', { ascending: true });

      if (events && events.length > 0) {
        transformedData.history = events.map((event, idx) => ({
          id: event.id,
          status: event.status,
          description: event.description || event.status,
          location: (event as any).location || shipment.current_location_name || shipment.recipient_city || 'In Transit',
          timestamp: new Date(event.timestamp).toLocaleString(),
          completed: idx < events.length - 1,
          isCurrent: idx === events.length - 1,
          handler: (event as any).handler || (event as any).agent_name || '',
          progress: STATUS_PROGRESS[event.status] ?? ((idx + 1) / events.length) * 100,
        }));
      } else {
        // If no events, create initial event from shipment
        transformedData.history = [{
          id: shipment.id,
          status: shipment.status as ShipmentStatus,
          description: `Shipment ${shipment.status}`,
          location: shipment.current_location_name || shipment.sender_city || 'Origin',
          timestamp: new Date(shipment.created_at || new Date()).toLocaleString(),
          completed: false,
          isCurrent: true,
          handler: shipment.agent_name || '',
          progress: STATUS_PROGRESS[shipment.status] ?? (shipment.status === 'Delivered' ? 100 : shipment.status === 'In Transit' ? 50 : 25),
        }];
      }

      setData(transformedData);
      setRawShipment(shipment); // Store raw shipment for additional fields
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes('fetch')) {
        setError('Unable to reach tracking service. Please check your connection and try again.');
      } else {
        setError(err.message || 'Failed to fetch shipment data.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: ShipmentStatus | string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'In Transit': 
      case 'Out for Delivery':
      case 'Picked Up':
      case 'Arrived at Hub':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Pending': 
      case 'Processing':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
      case 'Exception': 
      case 'Cancelled':
      case 'Lost/Damaged':
      case 'Returned to Sender':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'Customs Clearance': 
      case 'Customs Hold':
      case 'On Hold':
      case 'Payment Required':
      case 'Address Issue':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // --- WIDGET MODE (Homepage) ---
  if (mode === 'widget') {
    return (
        <div className="relative z-10 -mt-24 pb-12 mx-4 md:mx-auto max-w-7xl animate-fade-in-up">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[400px]">
                <div className="lg:w-5/12 p-8 md:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700 relative">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red to-brand-yellow"></div>
                     <div className="mb-8">
                         <div className="flex items-center gap-2 mb-2 text-brand-red font-bold uppercase text-xs tracking-wider">
                            <Package size={14} /> Real-Time Tracking
                         </div>
                         <h2 className="text-3xl font-extrabold text-brand-black dark:text-white mb-2">Track Your Shipment</h2>
                         <p className="text-gray-500 text-sm">Enter your ID to see exactly where your package is right now.</p>
                     </div>
                     <form onSubmit={handleTrack} className="space-y-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                placeholder="Enter tracking number..."
                                className="w-full pl-5 pr-12 py-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 focus:border-brand-red outline-none font-bold text-lg dark:text-white transition-all"
                            />
                            {inputVal && (
                                <button type="button" onClick={() => setInputVal('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-red">
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                        <button className="w-full py-4 bg-brand-red text-white font-bold text-lg rounded-xl hover:bg-brand-redDark transition-all shadow-lg flex items-center justify-center gap-2 group">
                            Track Shipment <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                     </form>
                </div>
                <div className="lg:w-7/12 relative bg-gray-100 dark:bg-gray-900 group cursor-pointer overflow-hidden" onClick={(e) => handleTrack(e as any)}>
                    <img 
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
                        alt="Global Map" 
                        className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
                        <span className="bg-brand-black text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 mx-auto w-fit">
                            <ZoomIn size={14} /> Click to View Full Map
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  // --- PAGE MODE (Advanced Dashboard) ---
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 pt-8 relative z-10">
      
      {/* 1. Header & Input Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700 animate-fade-in-up">
           <div className="flex flex-col md:flex-row gap-6 items-center">
               <div className="flex-1 w-full relative">
                   <input 
                      type="text" 
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder="Enter your tracking number (e.g. 1234567890)"
                      className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} focus:border-brand-red outline-none font-medium dark:text-white text-lg transition-all`}
                   />
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
               </div>
               <button 
                 onClick={(e) => handleTrack(e)}
                 disabled={isLoading}
                 className="w-full md:w-auto px-8 py-4 bg-brand-red text-white font-bold text-lg rounded-xl hover:bg-brand-redDark transition-all shadow-lg hover:-translate-y-1 whitespace-nowrap"
               >
                 {isLoading ? 'Searching...' : 'Track Package'}
               </button>
           </div>
           {error && <p className="text-red-500 text-sm font-bold mt-2 ml-2 flex items-center gap-2"><AlertTriangle size={14}/> {error}</p>}
      </div>

      {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 min-h-[60vh]">
             <div className="relative mb-8">
               <div className="w-24 h-24 border-4 border-brand-red/20 rounded-full"></div>
               <div className="w-24 h-24 border-4 border-brand-red border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Package className="text-brand-red animate-pulse" size={32} />
               </div>
             </div>
             <h3 className="text-2xl font-bold text-brand-black dark:text-white mb-2">Retrieving Shipment Details</h3>
             <p className="text-gray-500 dark:text-gray-400 mb-6">Please wait while we fetch your package information...</p>
             <div className="flex gap-2">
               <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
          </div>
      )}

      {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-32 min-h-[60vh]">
             <div className="relative mb-8">
               <div className="w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                 <AlertTriangle className="text-red-500 dark:text-red-400" size={64} />
               </div>
             </div>
             <h3 className="text-3xl font-bold text-brand-black dark:text-white mb-2">Shipment Not Found</h3>
             <p className="text-gray-500 dark:text-gray-400 mb-2 text-center max-w-md">{error}</p>
             <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Please verify your tracking number and try again.</p>
             <div className="flex flex-col sm:flex-row gap-4">
               <button 
                 onClick={() => { setError(''); setInputVal(''); }}
                 className="px-6 py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-brand-redDark transition-all shadow-lg"
               >
                 Try Again
               </button>
               <button 
                 onClick={() => window.location.href = '/'}
                 className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-brand-black dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
               >
                 Go Home
               </button>
             </div>
          </div>
      )}

      {data && !isLoading && (
        <div className="animate-fade-in-up space-y-8">
            
            {/* 2. Top Header Section with Barcode and Stamp */}
            <div className="bg-gradient-to-r from-brand-black to-gray-900 dark:from-gray-900 dark:to-brand-black rounded-2xl shadow-xl overflow-hidden border-2 border-brand-red/20">
              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  {/* Left: Tracking Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase mb-1">Tracking Number</p>
                        <span className="font-mono text-2xl md:text-3xl font-bold text-white tracking-widest">{data.trackingNumber}</span>
                      </div>
                      <div className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide border-2 ${getStatusColor(data.status)}`}>
                        {data.status}
                      </div>
                    </div>
                    {rawShipment?.reference_code && (
                      <p className="text-sm text-gray-300 dark:text-gray-400">
                        <span className="font-bold">Reference:</span> <span className="font-mono">{rawShipment.reference_code}</span>
                      </p>
                    )}
                  </div>
                  
                  {/* Right: Barcode and Stamp - Side by Side */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
                    <div className="hidden md:block">
                      <Barcode value={data.trackingNumber} width={160} height={60} />
                    </div>
                    <div className="hidden md:block">
                      <Stamp status={data.status} date={data.dateCreated} />
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors backdrop-blur-sm bg-gradient-to-r from-indigo-500 to-blue-600 hover:to-blue-700 shadow-md">
                    <Printer size={16}/> Print Invoice
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors backdrop-blur-sm bg-gradient-to-r from-emerald-500 to-green-600 hover:to-green-700 shadow-md">
                    <Share2 size={16}/> Share Tracking
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors backdrop-blur-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:to-orange-600 shadow-md">
                    <Smartphone size={16}/> Get Updates
                  </button>
                </div>
                </div>
            </div>

            {/* 3. Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Sender & Recipient (standalone top) */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-red">Parties</p>
                            <h3 className="text-2xl font-extrabold text-brand-black dark:text-white">Sender & Recipient</h3>
                          </div>
                          <span className="text-xs font-semibold text-gray-500">Verified contact details</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                            <p className="text-[11px] uppercase font-bold text-gray-500 mb-1">Sender</p>
                            <h4 className="text-xl font-bold text-brand-black dark:text-white">{data.sender}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 mt-2">
                              <MapPin size={14} className="mt-0.5" /> {data.senderAddress}
                            </p>
                            <div className="mt-3 flex flex-col gap-1 text-xs text-gray-500">
                              {data.senderEmail && <span className="flex items-center gap-2 font-semibold"><Mail size={12}/> {data.senderEmail}</span>}
                              {data.senderPhone && <span className="flex items-center gap-2 font-semibold"><Phone size={12}/> {data.senderPhone}</span>}
                            </div>
                          </div>
                          <div className="p-4 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 shadow-inner">
                            <p className="text-[11px] uppercase font-bold text-gray-500 mb-1">Recipient</p>
                            <h4 className="text-xl font-bold text-brand-black dark:text-white">{data.recipient}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 mt-2">
                              <MapPin size={14} className="mt-0.5 text-brand-red" /> {data.recipientAddress}
                            </p>
                            <div className="mt-3 flex flex-col gap-1 text-xs text-gray-500">
                              {data.recipientEmail && <span className="flex items-center gap-2 font-semibold"><Mail size={12}/> {data.recipientEmail}</span>}
                              {data.recipientPhone && <span className="flex items-center gap-2 font-semibold"><Phone size={12}/> {data.recipientPhone}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Core Shipment Details (4-col grid) */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                            <Plane size={18} className="text-brand-red" />
                            <div>
                              <p className="text-[11px] uppercase font-bold text-gray-500">Method</p>
                              <p className="font-bold text-sm dark:text-white">{data.serviceType || 'Not provided'}</p>
                            </div>
                          </div>
                          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                            <Scale size={18} className="text-emerald-500" />
                            <div>
                              <p className="text-[11px] uppercase font-bold text-gray-500">Weight</p>
                              <p className="font-bold text-sm dark:text-white">{data.weight}</p>
                            </div>
                          </div>
                          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                            <Box size={18} className="text-indigo-500" />
                            <div>
                              <p className="text-[11px] uppercase font-bold text-gray-500">Type</p>
                              <p className="font-bold text-sm dark:text-white">{data.type}</p>
                            </div>
                          </div>
                          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
                            <Clock size={18} className="text-amber-600" />
                            <div>
                              <p className="text-[11px] uppercase font-bold text-gray-500">Est. Delivery</p>
                              <p className="font-bold text-sm text-brand-red">{data.eta ? new Date(data.eta).toLocaleDateString() : 'TBD'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Codes & Values */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                              <p className="text-[11px] uppercase font-bold text-gray-500 flex items-center gap-2"><Hash size={14}/> Reference Code</p>
                              <p className="font-mono font-bold text-sm dark:text-white">{rawShipment?.reference_code || 'Not provided'}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                              <p className="text-[11px] uppercase font-bold text-gray-500 flex items-center gap-2"><Package size={14}/> Package Count</p>
                              <p className="font-bold text-sm dark:text-white">{rawShipment?.package_count || 1}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                              <p className="text-[11px] uppercase font-bold text-gray-500 flex items-center gap-2"><Hash size={14}/> HS Code</p>
                              <p className="font-mono font-bold text-sm dark:text-white">{rawShipment?.hs_code || 'Not provided'}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                              <p className="text-[11px] uppercase font-bold text-gray-500 flex items-center gap-2"><TrendingUp size={14}/> Declared Value</p>
                              <p className="font-bold text-sm dark:text-white">{rawShipment?.declared_value ? `$${parseFloat(rawShipment.declared_value).toLocaleString()}` : 'Not provided'}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                              <p className="text-[11px] uppercase font-bold text-gray-500 flex items-center gap-2"><Receipt size={14}/> Invoice Number</p>
                              <p className="font-mono font-bold text-sm dark:text-white">{rawShipment?.invoice_number || 'Not provided'}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                              <p className="text-[11px] uppercase font-bold text-gray-500 flex items-center gap-2"><Box size={14}/> Commodity Type</p>
                              <p className="font-bold text-sm dark:text-white">{rawShipment?.commodity_type || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-red">Special Instructions</p>
                          <span className="text-xs text-gray-500">Compliance ready</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {rawShipment?.fragile && (
                            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold">Fragile</span>
                          )}
                          {rawShipment?.signature_required && (
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold">Signature Required</span>
                          )}
                          {rawShipment?.cod && (
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                              COD: {rawShipment?.cod_amount ? `$${parseFloat(rawShipment.cod_amount).toLocaleString()}` : 'Enabled'}
                            </span>
                          )}
                          {!rawShipment?.fragile && !rawShipment?.signature_required && !rawShipment?.cod && (
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold">No special badges</span>
                          )}
                        </div>
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
                          {rawShipment?.special_instructions || 'No additional handling notes for this shipment.'}
                        </p>
                      </div>
                    </div>

                    {/* Progress - dedicated section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm font-bold text-brand-black dark:text-white">
                            <TrendingUp size={16}/> Progress
                          </div>
                          <span className="text-sm font-extrabold text-brand-red">{data.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-brand-red to-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${data.progress}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Map Section - OpenStreetMap */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden relative border border-gray-200 dark:border-gray-700">
                      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin size={18} /> 
                          <h3 className="font-bold text-lg dark:text-white">Route</h3>
                        </div>
                        <span className="text-xs font-semibold text-gray-500">Real-time positioning</span>
                      </div>
                      <LeafletMap
                        originAddress={data.senderAddress || `${data.origin}`}
                        destinationAddress={data.recipientAddress || `${data.destination}`}
                        currentLocation={data.currentLocation && data.currentLocation.lat && data.currentLocation.lng ? {
                          lat: data.currentLocation.lat,
                          lng: data.currentLocation.lng,
                          name: data.currentLocation.name,
                        } : undefined}
                        height="320px"
                      />
                    </div>

                    {/* Shipment Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Package className="text-blue-100" size={24} />
                                <span className="text-xs font-bold opacity-80">PACKAGES</span>
                              </div>
                              <div className="text-3xl font-bold">{rawShipment?.package_count || 1}</div>
                              <div className="text-xs opacity-90 mt-1">{rawShipment?.shipment_type || data.type}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Box className="text-purple-100" size={24} />
                                <span className="text-xs font-bold opacity-80">WEIGHT</span>
                              </div>
                              <div className="text-3xl font-bold">{data.weight}</div>
                              <div className="text-xs opacity-90 mt-1">{data.dimensions}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <TrendingUp className="text-green-100" size={24} />
                                <span className="text-xs font-bold opacity-80">VALUE</span>
                              </div>
                              <div className="text-3xl font-bold">${rawShipment?.declared_value ? parseFloat(rawShipment.declared_value).toLocaleString() : '0'}</div>
                              <div className="text-xs opacity-90 mt-1">Declared Value</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Calendar className="text-orange-100" size={24} />
                                <span className="text-xs font-bold opacity-80">CREATED</span>
                              </div>
                              <div className="text-xl font-bold">{new Date(data.dateCreated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                              <div className="text-xs opacity-90 mt-1">{new Date(data.dateCreated).toLocaleDateString('en-US', { year: 'numeric' })}</div>
                        </div>
                    </div>

                    {/* Payment & Billing Information Card */}
                    {rawShipment && (rawShipment.payment_method || rawShipment.billing_address || rawShipment.promo_code) && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                                <TrendingUp size={18}/> Payment & Billing Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {rawShipment.payment_method && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Payment Method</p>
                                        <p className="font-bold text-sm dark:text-white">{rawShipment.payment_method}</p>
                                    </div>
                                )}
                                {rawShipment.billing_address && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Billing Address</p>
                                        <p className="font-medium text-sm dark:text-white">{rawShipment.billing_address}</p>
                                    </div>
                                )}
                                {rawShipment.promo_code && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Promo Code</p>
                                        <p className="font-bold text-sm dark:text-white font-mono">{rawShipment.promo_code}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Customs Information Card */}
                    {rawShipment && (rawShipment.hs_code || rawShipment.commodity_type || rawShipment.country_of_origin || rawShipment.export_reason) && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                                <Box size={18}/> Customs & Export Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {rawShipment.hs_code && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">HS Code</p>
                                        <p className="font-bold text-sm dark:text-white font-mono">{rawShipment.hs_code}</p>
                                    </div>
                                )}
                                {rawShipment.commodity_type && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Commodity Type</p>
                                        <p className="font-bold text-sm dark:text-white">{rawShipment.commodity_type}</p>
                                    </div>
                                )}
                                {rawShipment.country_of_origin && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Country of Origin</p>
                                        <p className="font-bold text-sm dark:text-white">{rawShipment.country_of_origin}</p>
                                    </div>
                                )}
                                {rawShipment.export_reason && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Export Reason</p>
                                        <p className="font-bold text-sm dark:text-white">{rawShipment.export_reason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Horizontal/Vertical Responsive Timeline */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2"><Clock size={18}/> Shipment Timeline</h3>
                        <div className="relative">
                             {/* Desktop Horizontal Line */}
                             <div className="hidden lg:block absolute top-4 left-0 w-full h-1 bg-gray-100 dark:bg-gray-700 -z-0"></div>
                             
                             <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-0">
                                {(() => {
                                    // Show first item and last 3 items only
                                    const history = data.history;
                                    if (history.length <= 4) {
                                        // If 4 or fewer items, show all
                                        return history;
                                    }
                                    // Show first item and last 3 items (no duplicates since length > 4)
                                    const first = history[0];
                                    const lastThree = history.slice(-3);
                                    return [first, ...lastThree];
                                })().map((step, idx, filteredArray) => {
                                    // Find original index in full history for proper styling
                                    const originalIdx = data.history.findIndex(h => h.id === step.id);
                                    const isLastInFiltered = idx === filteredArray.length - 1;
                                    const isLastInHistory = originalIdx === data.history.length - 1;
                                    const isCurrent = step.isCurrent || (isLastInFiltered && isLastInHistory);
                                    const completed = originalIdx < data.history.length - 1;
                                    
                                    return (
                                        <div key={step.id || idx} className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-2 z-10 flex-1">
                                             {/* Status Dot */}
                                             <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                                                 completed ? 'bg-brand-black border-brand-black dark:bg-white dark:border-white text-white dark:text-black' : 
                                                 isCurrent ? 'bg-brand-red border-white dark:border-gray-800 text-white shadow-lg scale-110' : 
                                                 'bg-gray-100 dark:bg-gray-700 border-white dark:border-gray-800 text-gray-400'
                                             }`}>
                                                {completed ? <CheckCircle size={14} /> : isCurrent ? <Truck size={14} /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
                                             </div>
                                             
                                             {/* Content */}
                                             <div className="lg:text-center pt-1 lg:pt-2">
                                                 <p className={`text-xs font-bold uppercase mb-0.5 ${isCurrent ? 'text-brand-red' : 'text-gray-500'}`}>{step.status}</p>
                                                 <p className="font-bold text-sm dark:text-white">{step.location}</p>
                                                 <p className="text-xs text-gray-400 mt-1">{step.timestamp}</p>
                                             </div>
                                        </div>
                                    );
                                })}
                             </div>
                        </div>
                    </div>

                    {/* History Data Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg dark:text-white flex items-center gap-2"><Clock size={18}/> Full History Log</h3>
                            <button className="text-brand-red text-xs font-bold hover:underline">Download CSV</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="p-4 font-bold text-gray-500">Date/Time</th>
                                        <th className="p-4 font-bold text-gray-500">Location</th>
                                        <th className="p-4 font-bold text-gray-500">Status</th>
                                        <th className="p-4 font-bold text-gray-500">Handler</th>
                                        <th className="p-4 font-bold text-gray-500 text-right">Completion</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {data.history.map((row, i) => (
                                        <tr 
                                          key={i} 
                                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <td className="p-4 font-medium text-gray-800 dark:text-white">{row.timestamp}</td>
                                            <td className="p-4 text-gray-700 dark:text-gray-300">{row.location}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap ${
                                                  row.completed 
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200' 
                                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200'
                                                }`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-500 dark:text-gray-300">{row.handler}</td>
                                            <td className="p-4 text-right font-mono text-gray-800 dark:text-gray-100">{row.progress}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (Widgets) */}
                <div className="space-y-6">
                    
                    {/* Agent / Driver Card */}
                    {data.agent && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-brand-red relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                 <Truck size={120} />
                             </div>
                             <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-4">Your Delivery Partner</h3>
                             <div className="flex items-center gap-4 mb-6 relative z-10">
                                 <div className="relative">
                                    <img src={data.agent.photo} alt={data.agent.name} className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover" />
                                    <div className="absolute -bottom-1 -right-1 bg-brand-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <Star size={8} className="text-brand-yellow fill-current"/> {data.agent.rating}
                                    </div>
                                 </div>
                                 <div className="flex-1">
                                     <h4 className="font-bold text-lg dark:text-white mb-1">{data.agent.name}</h4>
                                     {data.agent.vehicle && <p className="text-xs text-gray-500 mb-1">{data.agent.vehicle}</p>}
                                     <p className="text-xs text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block">
                                       ID: {data.agent.id}
                                     </p>
                                 </div>
                             </div>
                             <div className="grid grid-cols-2 gap-3">
                                 <a
                                   href={data.agent.phone ? `tel:${data.agent.phone}` : undefined}
                                   className={`flex items-center justify-center gap-2 py-2 rounded text-xs font-bold transition-colors shadow ${
                                     data.agent.phone ? 'bg-brand-red text-white hover:bg-brand-redDark' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                   }`}
                                 >
                                     <Phone size={14}/> Call Agent
                                 </a>
                                 <a
                                   href={
                                     data.agent.email
                                       ? `mailto:${data.agent.email}?subject=Shipment%20${data.trackingNumber}`
                                       : undefined
                                   }
                                   className={`flex items-center justify-center gap-2 py-2 rounded text-xs font-bold transition-colors ${
                                     data.agent.email ? 'bg-gray-100 dark:bg-gray-700 text-brand-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                   }`}
                                 >
                                     <MessageSquare size={14}/> Message / Email
                                 </a>
                             </div>
                        </div>
                    )}

                    {/* Countdown / Alerts */}
                    <div className="bg-brand-black text-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="text-brand-red" size={24} />
                            <div>
                                <h4 className="font-bold">Estimated Arrival</h4>
                                <p className="text-xs text-gray-400">Countdown to delivery</p>
                            </div>
                        </div>
                        <div className="text-3xl md:text-4xl font-mono font-bold text-center tracking-widest my-4">
                            {timeLeft || 'TBD'}
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 text-xs text-center">
                            Target: {data.eta ? new Date(data.eta).toLocaleString() : 'Not set'}
                        </div>
                    </div>

                    {/* Environment Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        {data.weather && (
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <Cloud size={20} className="text-blue-100" />
                                    <span className="text-[10px] uppercase font-bold opacity-80">Dest.</span>
                                </div>
                                <div className="text-2xl font-bold">{data.weather.temp}</div>
                                <div className="text-xs opacity-90">{data.weather.condition}</div>
                            </div>
                        )}
                        {data.carbon && (
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <Leaf size={20} className="text-green-100" />
                                    <span className="text-[10px] uppercase font-bold opacity-80">CO2</span>
                                </div>
                                <div className="text-2xl font-bold">{data.carbon.saved}</div>
                                <div className="text-xs opacity-90">{data.carbon.method}</div>
                            </div>
                        )}
                    </div>

                    {/* Gallery Preview */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold mb-4 dark:text-white flex items-center gap-2"><Package size={16}/> Proof of Delivery</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {data.images?.slice(0, 4).map((img, i) => (
                                <div key={i} className="aspect-square rounded-lg overflow-hidden cursor-pointer relative group" onClick={() => setSelectedImage(img.url)}>
                                    <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ZoomIn className="text-white" size={20} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Digital Text Signature Display */}
                        {data.signature && (
                             <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Recipient Signature</p>
                                <div className="font-signature text-4xl text-brand-black dark:text-white p-4">
                                    {data.signature}
                                </div>
                             </div>
                        )}
                    </div>

                    {/* Support Box */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700">
                         <Info size={32} className="mx-auto text-brand-red mb-3" />
                         <h4 className="font-bold dark:text-white mb-1">Need Assistance?</h4>
                         <p className="text-xs text-gray-500 mb-4">Our team is ready to help you.</p>
                         <a
                           href="/contact"
                           className="w-full block py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-bold text-sm hover:border-brand-red transition-colors dark:text-white text-center"
                         >
                            Contact Support
                         </a>
                    </div>

                </div>
            </div>
            
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up" onClick={() => setSelectedImage(null)}>
           <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white hover:text-brand-red transition-colors p-2 bg-white/10 rounded-full">
              <X size={32} />
           </button>
           <img src={selectedImage} alt="Full view" className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

    </div>
  );
};

export default Tracking;