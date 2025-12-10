'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Plus, Search, Filter, Trash2, Edit, Save, X, 
  Package, Calendar, MapPin, User, Truck, Globe,
  Upload, Image as ImageIcon, FileText, CheckCircle,
  AlertCircle, Loader2, PenTool, Navigation
} from 'lucide-react';

// Status enum matching the schema
type ShipmentStatus = 
  | 'Pending' | 'Awaiting Payment' | 'Payment Confirmed' | 'Processing'
  | 'Ready for Pickup' | 'Driver En Route' | 'Picked Up' | 'At Warehouse'
  | 'In Transit' | 'Departed Facility' | 'Arrived at Facility' | 'Out for Delivery'
  | 'Delivered' | 'Returned to Sender' | 'Cancelled' | 'On Hold'
  | 'Delayed' | 'Weather Delay' | 'Address Issue' | 'Customs Hold'
  | 'Inspection Required' | 'Payment Verification Required' | 'Lost Package' | 'Damaged Package';

interface Shipment {
  id?: string;
  tracking_number: string;
  reference_code?: string;
  barcode_number?: string;
  qr_code?: string;
  status: ShipmentStatus;
  
  // Sender
  sender_name: string;
  sender_phone: string;
  sender_email: string;
  sender_address_line1: string;
  sender_address_line2?: string;
  sender_city: string;
  sender_state: string;
  sender_postal_code: string;
  sender_country: string;
  
  // Recipient
  recipient_name: string;
  recipient_phone: string;
  recipient_email?: string;
  recipient_address_line1: string;
  recipient_address_line2?: string;
  recipient_city: string;
  recipient_state: string;
  recipient_postal_code: string;
  recipient_country: string;
  
  // Shipment details
  shipment_type: string;
  package_count: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  shipment_description: string;
  declared_value: number;
  fragile: boolean;
  special_instructions?: string;
  
  // Pickup & delivery
  pickup_required: boolean;
  pickup_date?: string;
  pickup_time_window?: string;
  pickup_address?: string;
  pickup_at?: string;
  delivered_at?: string;
  delivery_speed: string;
  preferred_delivery_date?: string;
  signature_required: boolean;
  cod: boolean;
  cod_amount?: number;
  
  // Customs
  commodity_type?: string;
  hs_code?: string;
  country_of_origin?: string;
  export_reason?: string;
  invoice_number?: string;
  
  // Payment
  payment_method: string;
  billing_address?: string;
  promo_code?: string;
  
  // Attachments
  package_images?: any;
  customs_docs?: any;
  label_file?: any;
  
  // Location tracking (name only - will be geocoded by Google Maps)
  current_location_name?: string;
  
  // Assigned Agent
  agent_name?: string;
  agent_phone?: string;
  agent_email?: string;
  agent_rating?: number;
  agent_profile_picture?: string;
  agent_id?: string;
  
  estimated_delivery_date?: string;
  system_notes?: string;
  user_id?: string;
  data?: any;
  created_at?: string;
  updated_at?: string;
}

const STATUS_OPTIONS: ShipmentStatus[] = [
  'Pending', 'Awaiting Payment', 'Payment Confirmed', 'Processing',
  'Ready for Pickup', 'Driver En Route', 'Picked Up', 'At Warehouse',
  'In Transit', 'Departed Facility', 'Arrived at Facility', 'Out for Delivery',
  'Delivered', 'Returned to Sender', 'Cancelled', 'On Hold',
  'Delayed', 'Weather Delay', 'Address Issue', 'Customs Hold',
  'Inspection Required', 'Payment Verification Required', 'Lost Package', 'Damaged Package'
];

const EMPTY_SHIPMENT: Partial<Shipment> = {
  tracking_number: '',
  status: 'Pending',
  sender_name: '',
  sender_phone: '',
  sender_email: '',
  sender_address_line1: '',
  sender_city: '',
  sender_state: '',
  sender_postal_code: '',
  sender_country: '',
  recipient_name: '',
  recipient_phone: '',
  recipient_address_line1: '',
  recipient_city: '',
  recipient_state: '',
  recipient_postal_code: '',
  recipient_country: '',
  shipment_type: 'Standard',
  package_count: 1,
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  shipment_description: '',
  declared_value: 0,
  fragile: false,
  pickup_required: false,
  delivery_speed: 'Standard',
  signature_required: false,
  cod: false,
  payment_method: 'Credit Card',
};

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentShipment, setCurrentShipment] = useState<Partial<Shipment>>(EMPTY_SHIPMENT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDemoMode = false; // Force live data; no mock/demo mode

  // Load shipments from Supabase
  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
        setShipments([]);
        return;
      }

      const { data, error } = await supabase.from('shipments').select('*').order('created_at', { ascending: false });

      if (error) throw error;
      setShipments(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateTrackingNumber = () => {
    return 'VLX-' + Math.floor(100000 + Math.random() * 900000);
  };

  const generateReferenceCode = () => {
    const prefix = 'REF';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  };

  const generateHSCode = () => {
    // Generate a random 6-digit HS code (Harmonized System code format)
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const generateInvoiceNumber = () => {
    const prefix = 'INV';
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${year}${month}-${random}`;
  };

  const handleCreateNew = () => {
    setCurrentShipment({
      ...EMPTY_SHIPMENT,
      tracking_number: generateTrackingNumber(),
      reference_code: generateReferenceCode(),
      hs_code: generateHSCode(),
      invoice_number: generateInvoiceNumber(),
    });
    setIsEditing(false);
    setIsModalOpen(true);
    setError(null);
  };

  const handleEdit = (shipment: Shipment) => {
    // Extract agent data from data field if it exists
    const agentData = (shipment.data as any)?.agent;
    const locationData = (shipment.data as any)?.currentLocation;
    
    // Ensure auto-generated fields have values
    const editedShipment = {
      ...shipment,
      reference_code: shipment.reference_code || generateReferenceCode(),
      hs_code: shipment.hs_code || generateHSCode(),
      invoice_number: shipment.invoice_number || generateInvoiceNumber(),
      // Extract agent fields from data if not in direct fields
      agent_name: shipment.agent_name || agentData?.name || '',
      agent_phone: shipment.agent_phone || agentData?.phone || '',
      agent_email: shipment.agent_email || agentData?.email || '',
      agent_rating: shipment.agent_rating || agentData?.rating || 5.0,
      agent_profile_picture: shipment.agent_profile_picture || agentData?.photo || '',
      agent_id: shipment.agent_id || agentData?.id || (shipment.data as any)?.agent_id || '',
      // Extract location name
      current_location_name: shipment.current_location_name || locationData?.name || '',
    };
    setCurrentShipment(editedShipment);
    setIsEditing(true);
    setIsModalOpen(true);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return;

    try {
      if (isDemoMode) {
        return;
      }

      const { error } = await supabase.from('shipments').delete().eq('id', id);
      if (error) throw error;
      await loadShipments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Store location name and agent data in data field for easy access
      const locationData = currentShipment.current_location_name
        ? {
            currentLocation: {
              name: currentShipment.current_location_name,
            },
            ...(currentShipment.data || {}),
          }
        : currentShipment.data;

      // Store agent data
      const agentData = (currentShipment.agent_name || currentShipment.agent_phone || currentShipment.agent_email || currentShipment.agent_id)
        ? {
            agent: {
              name: currentShipment.agent_name || '',
              phone: currentShipment.agent_phone || '',
              email: currentShipment.agent_email || '',
              rating: currentShipment.agent_rating || 5.0,
              photo: currentShipment.agent_profile_picture || '',
              id: currentShipment.agent_id || '',
            },
            agent_id: currentShipment.agent_id || '',
            ...locationData,
          }
        : locationData;

      // Create shipment data, explicitly excluding old lat/lng fields  
      const { current_location_lat, current_location_lng, ...shipmentDataWithoutOldFields } = currentShipment as any;
      
      const shipmentData = {
        ...shipmentDataWithoutOldFields,
        data: agentData,
        updated_at: new Date().toISOString(),
      };

      let savedShipmentId: string;

      if (isEditing && currentShipment.id) {
        // Update existing
        savedShipmentId = currentShipment.id;
        const { error } = await supabase
          .from('shipments')
          .update(shipmentData)
          .eq('id', currentShipment.id);

        if (error) throw error;

        // Create tracking event for status update
        await supabase.from('tracking_events').insert([{
          shipment_id: savedShipmentId,
          status: currentShipment.status,
          description: `Shipment status updated to: ${currentShipment.status}`,
          timestamp: new Date().toISOString(),
          location: currentShipment.current_location_name || '',
        }]);
      } else {
        // Create new
        savedShipmentId = crypto.randomUUID();
        const { error } = await supabase
          .from('shipments')
          .insert([{
            ...shipmentData,
            id: savedShipmentId,
            created_at: new Date().toISOString(),
          }]);

        if (error) throw error;

        // Create initial tracking event
        await supabase.from('tracking_events').insert([{
          shipment_id: savedShipmentId,
          status: currentShipment.status || 'Pending',
          description: `Shipment created with status: ${currentShipment.status || 'Pending'}`,
          timestamp: new Date().toISOString(),
          location: currentShipment.current_location_name || currentShipment.sender_city || '',
        }]);
      }
      await loadShipments();

      setIsModalOpen(false);
      setCurrentShipment(EMPTY_SHIPMENT);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: keyof Shipment, value: any) => {
    setCurrentShipment({
      ...currentShipment,
      [field]: value,
    });
  };

  const getStatusColor = (status: ShipmentStatus | string) => {
    if (status === 'Delivered') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (['In Transit', 'Out for Delivery', 'Picked Up', 'Arrived at Facility'].includes(status)) {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
    if (['Pending', 'Processing'].includes(status)) {
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
    if (['Cancelled', 'Lost Package', 'Damaged Package', 'Returned to Sender'].includes(status)) {
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    }
    if (['Customs Hold', 'On Hold', 'Delayed', 'Weather Delay', 'Address Issue'].includes(status)) {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
    return 'bg-gray-100 text-gray-700';
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = 
      s.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.reference_code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-brand-red" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-red">Shipment Management</p>
          <h1 className="text-3xl font-extrabold text-brand-black dark:text-white">Shipments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all shipments and tracking information.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-lg font-bold hover:bg-brand-redDark transition-colors shadow-lg"
        >
          <Plus size={20} /> Create Shipment
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by tracking number, sender, recipient, reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-brand-red outline-none dark:text-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium dark:text-white cursor-pointer outline-none hover:border-brand-red transition-colors"
        >
          <option value="All">All Status</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Shipments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Tracking #</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Sender</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Recipient</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Weight</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Created</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-bold text-brand-black dark:text-white">{shipment.tracking_number}</span>
                    {shipment.reference_code && (
                      <div className="text-xs text-gray-400 mt-1">Ref: {shipment.reference_code}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-brand-black dark:text-white">{shipment.sender_name}</div>
                    <div className="text-xs text-gray-400">{shipment.sender_city}, {shipment.sender_country}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-brand-black dark:text-white">{shipment.recipient_name}</div>
                    <div className="text-xs text-gray-400">{shipment.recipient_city}, {shipment.recipient_country}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap ${getStatusColor(shipment.status)}`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">{shipment.shipment_type}</div>
                    <div className="text-xs text-gray-400">{shipment.delivery_speed}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">{shipment.weight} kg</div>
                    <div className="text-xs text-gray-400">{shipment.package_count} pkg(s)</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {shipment.created_at ? new Date(shipment.created_at).toLocaleDateString() : '-'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(shipment)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-blue-600"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => shipment.id && handleDelete(shipment.id)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredShipments.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p>No shipments found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
              <div>
                <h2 className="text-2xl font-bold text-brand-black dark:text-white flex items-center gap-2">
                  <Plus className="text-brand-red" /> {isEditing ? 'Edit' : 'Create'} Shipment
                </h2>
                <p className="text-sm text-gray-500">Enter all shipment details below.</p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCurrentShipment(EMPTY_SHIPMENT);
                  setError(null);
                }}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Form - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="text-red-600" size={20} />
                  <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
                </div>
              )}

              {/* Section 1: Core Information */}
              <div>
                <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  1. Core Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Tracking Number *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentShipment.tracking_number || ''}
                        onChange={(e) => handleFieldChange('tracking_number', e.target.value)}
                        className="flex-1 p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleFieldChange('tracking_number', generateTrackingNumber())}
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs font-bold"
                        title="Generate new tracking number"
                      >
                        ↻
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Reference Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentShipment.reference_code || ''}
                        onChange={(e) => handleFieldChange('reference_code', e.target.value)}
                        className="flex-1 p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                        placeholder="Auto-generated"
                      />
                      <button
                        type="button"
                        onClick={() => handleFieldChange('reference_code', generateReferenceCode())}
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs font-bold"
                        title="Generate new reference code"
                      >
                        ↻
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Status *</label>
                    <select
                      value={currentShipment.status || 'Pending'}
                      onChange={(e) => handleFieldChange('status', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Sender Information */}
              <div>
                <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  2. Sender Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Name *</label>
                    <input
                      type="text"
                      value={currentShipment.sender_name || ''}
                      onChange={(e) => handleFieldChange('sender_name', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Phone *</label>
                    <input
                      type="tel"
                      value={currentShipment.sender_phone || ''}
                      onChange={(e) => handleFieldChange('sender_phone', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Email *</label>
                    <input
                      type="email"
                      value={currentShipment.sender_email || ''}
                      onChange={(e) => handleFieldChange('sender_email', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Address Line 1 *</label>
                    <input
                      type="text"
                      value={currentShipment.sender_address_line1 || ''}
                      onChange={(e) => handleFieldChange('sender_address_line1', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Address Line 2</label>
                    <input
                      type="text"
                      value={currentShipment.sender_address_line2 || ''}
                      onChange={(e) => handleFieldChange('sender_address_line2', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">City *</label>
                    <input
                      type="text"
                      value={currentShipment.sender_city || ''}
                      onChange={(e) => handleFieldChange('sender_city', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">State/Province *</label>
                    <input
                      type="text"
                      value={currentShipment.sender_state || ''}
                      onChange={(e) => handleFieldChange('sender_state', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Postal Code *</label>
                    <input
                      type="text"
                      value={currentShipment.sender_postal_code || ''}
                      onChange={(e) => handleFieldChange('sender_postal_code', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Country *</label>
                    <input
                      type="text"
                      value={currentShipment.sender_country || ''}
                      onChange={(e) => handleFieldChange('sender_country', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Recipient Information */}
              <div>
                <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  3. Recipient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Name *</label>
                    <input
                      type="text"
                      value={currentShipment.recipient_name || ''}
                      onChange={(e) => handleFieldChange('recipient_name', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Phone *</label>
                    <input
                      type="tel"
                      value={currentShipment.recipient_phone || ''}
                      onChange={(e) => handleFieldChange('recipient_phone', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                    <input
                      type="email"
                      value={currentShipment.recipient_email || ''}
                      onChange={(e) => handleFieldChange('recipient_email', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Address Line 1 *</label>
                    <input
                      type="text"
                      value={currentShipment.recipient_address_line1 || ''}
                      onChange={(e) => handleFieldChange('recipient_address_line1', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Address Line 2</label>
                    <input
                      type="text"
                      value={currentShipment.recipient_address_line2 || ''}
                      onChange={(e) => handleFieldChange('recipient_address_line2', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">City *</label>
                    <input
                      type="text"
                      value={currentShipment.recipient_city || ''}
                      onChange={(e) => handleFieldChange('recipient_city', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">State/Province *</label>
                    <input
                      type="text"
                      value={currentShipment.recipient_state || ''}
                      onChange={(e) => handleFieldChange('recipient_state', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Postal Code *</label>
                    <input
                      type="text"
                      value={currentShipment.recipient_postal_code || ''}
                      onChange={(e) => handleFieldChange('recipient_postal_code', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Country *</label>
                    <input
                      type="text"
                      value={currentShipment.recipient_country || ''}
                      onChange={(e) => handleFieldChange('recipient_country', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Shipment Details */}
              <div>
                <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  4. Shipment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Shipment Type *</label>
                    <select
                      value={currentShipment.shipment_type || 'Standard'}
                      onChange={(e) => handleFieldChange('shipment_type', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    >
                      <option>Standard</option>
                      <option>Express</option>
                      <option>Air Freight</option>
                      <option>Ocean Freight</option>
                      <option>Road Transport</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Package Count *</label>
                    <input
                      type="number"
                      min="1"
                      value={currentShipment.package_count || 1}
                      onChange={(e) => handleFieldChange('package_count', parseInt(e.target.value) || 1)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Weight (kg) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentShipment.weight || 0}
                      onChange={(e) => handleFieldChange('weight', parseFloat(e.target.value) || 0)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Delivery Speed *</label>
                    <select
                      value={currentShipment.delivery_speed || 'Standard'}
                      onChange={(e) => handleFieldChange('delivery_speed', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    >
                      <option>Standard</option>
                      <option>Express</option>
                      <option>Overnight</option>
                      <option>Same Day</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Length (cm) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentShipment.length || 0}
                      onChange={(e) => handleFieldChange('length', parseFloat(e.target.value) || 0)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Width (cm) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentShipment.width || 0}
                      onChange={(e) => handleFieldChange('width', parseFloat(e.target.value) || 0)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Height (cm) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentShipment.height || 0}
                      onChange={(e) => handleFieldChange('height', parseFloat(e.target.value) || 0)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Declared Value *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentShipment.declared_value || 0}
                      onChange={(e) => handleFieldChange('declared_value', parseFloat(e.target.value) || 0)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Description *</label>
                    <textarea
                      value={currentShipment.shipment_description || ''}
                      onChange={(e) => handleFieldChange('shipment_description', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Special Instructions</label>
                    <textarea
                      value={currentShipment.special_instructions || ''}
                      onChange={(e) => handleFieldChange('special_instructions', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentShipment.fragile || false}
                        onChange={(e) => handleFieldChange('fragile', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Fragile</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentShipment.signature_required || false}
                        onChange={(e) => handleFieldChange('signature_required', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Signature Required</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 5: Pickup & Delivery */}
              <div>
                <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  5. Pickup & Delivery
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentShipment.pickup_required || false}
                        onChange={(e) => handleFieldChange('pickup_required', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                      />
                      <span className="text-xs font-bold text-gray-500 uppercase">Pickup Required</span>
                    </label>
                  </div>
                  {currentShipment.pickup_required && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Pickup Date</label>
                        <input
                          type="date"
                          value={currentShipment.pickup_date || ''}
                          onChange={(e) => handleFieldChange('pickup_date', e.target.value)}
                          className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Pickup Time Window</label>
                        <input
                          type="text"
                          placeholder="e.g. 9:00 AM - 12:00 PM"
                          value={currentShipment.pickup_time_window || ''}
                          onChange={(e) => handleFieldChange('pickup_time_window', e.target.value)}
                          className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2 lg:col-span-3">
                        <label className="text-xs font-bold text-gray-500 uppercase">Pickup Address</label>
                        <input
                          type="text"
                          value={currentShipment.pickup_address || ''}
                          onChange={(e) => handleFieldChange('pickup_address', e.target.value)}
                          className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Preferred Delivery Date</label>
                    <input
                      type="date"
                      value={currentShipment.preferred_delivery_date || ''}
                      onChange={(e) => handleFieldChange('preferred_delivery_date', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Estimated Delivery Date</label>
                    <input
                      type="datetime-local"
                      value={currentShipment.estimated_delivery_date || ''}
                      onChange={(e) => handleFieldChange('estimated_delivery_date', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentShipment.cod || false}
                        onChange={(e) => handleFieldChange('cod', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                      />
                      <span className="text-xs font-bold text-gray-500 uppercase">Cash on Delivery</span>
                    </label>
                  </div>
                  {currentShipment.cod && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">COD Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={currentShipment.cod_amount || 0}
                        onChange={(e) => handleFieldChange('cod_amount', parseFloat(e.target.value) || 0)}
                        className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Section 6: Customs */}
              <div>
                <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  6. Customs Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Commodity Type</label>
                    <input
                      type="text"
                      value={currentShipment.commodity_type || ''}
                      onChange={(e) => handleFieldChange('commodity_type', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">HS Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentShipment.hs_code || ''}
                        onChange={(e) => handleFieldChange('hs_code', e.target.value)}
                        className="flex-1 p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                        placeholder="Auto-generated"
                      />
                      <button
                        type="button"
                        onClick={() => handleFieldChange('hs_code', generateHSCode())}
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs font-bold"
                        title="Generate new HS code"
                      >
                        ↻
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Country of Origin</label>
                    <input
                      type="text"
                      value={currentShipment.country_of_origin || ''}
                      onChange={(e) => handleFieldChange('country_of_origin', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Export Reason</label>
                    <input
                      type="text"
                      value={currentShipment.export_reason || ''}
                      onChange={(e) => handleFieldChange('export_reason', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Invoice Number</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentShipment.invoice_number || ''}
                        onChange={(e) => handleFieldChange('invoice_number', e.target.value)}
                        className="flex-1 p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                        placeholder="Auto-generated"
                      />
                      <button
                        type="button"
                        onClick={() => handleFieldChange('invoice_number', generateInvoiceNumber())}
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs font-bold"
                        title="Generate new invoice number"
                      >
                        ↻
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 7: Payment */}
              <div>
                <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  7. Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Payment Method *</label>
                    <select
                      value={currentShipment.payment_method || 'Credit Card'}
                      onChange={(e) => handleFieldChange('payment_method', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      required
                    >
                      <option>Credit Card</option>
                      <option>Debit Card</option>
                      <option>Bank Transfer</option>
                      <option>PayPal</option>
                      <option>Cash</option>
                      <option>Invoice</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Billing Address</label>
                    <input
                      type="text"
                      value={currentShipment.billing_address || ''}
                      onChange={(e) => handleFieldChange('billing_address', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Promo Code</label>
                    <input
                      type="text"
                      value={currentShipment.promo_code || ''}
                      onChange={(e) => handleFieldChange('promo_code', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 8: Package Images */}
              <div>
                <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  8. Package Images & Documents
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {['package', 'transit', 'document', 'proof'].map((type) => {
                    const imageType = type as 'package' | 'transit' | 'document' | 'proof';
                    const label = type === 'package' ? 'Pickup Scan' : type === 'proof' ? 'Proof of Delivery' : type === 'document' ? 'Customs Doc' : 'In Transit';
                    const currentImages = currentShipment.package_images as any[] || [];
                    const imageUrl = currentImages.find((img: any) => img?.type === imageType)?.url;

                    return (
                      <div key={type} className="relative aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-brand-red transition-colors flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 group overflow-hidden">
                        {imageUrl ? (
                          <>
                            <img src={imageUrl} className="absolute inset-0 w-full h-full object-cover" alt={label} />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <label htmlFor={`upload-${type}`} className="cursor-pointer text-white text-xs font-bold border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition-colors">Change</label>
                            </div>
                          </>
                        ) : (
                          <label htmlFor={`upload-${type}`} className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                            <ImageIcon className="text-gray-400 mb-2" size={24} />
                            <span className="text-xs font-bold text-gray-500 text-center px-2">{label}</span>
                            <span className="text-[10px] text-brand-red mt-1">Click to Upload</span>
                          </label>
                        )}
                        <input
                          type="file"
                          id={`upload-${type}`}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const url = reader.result as string;
                                const existingImages = (currentShipment.package_images as any[]) || [];
                                const filtered = existingImages.filter((img: any) => img?.type !== imageType);
                                handleFieldChange('package_images', [
                                  ...filtered,
                                  { url, caption: label, type: imageType, date: new Date().toISOString().split('T')[0] }
                                ]);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <PenTool size={14}/> Recipient Signature (Text)
                  </label>
                  <input
                    type="text"
                    placeholder="Type name to sign..."
                    className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white font-signature text-3xl"
                    value={(currentShipment.data as any)?.signature || ''}
                    onChange={(e) => {
                      handleFieldChange('data', {
                        ...(currentShipment.data as any || {}),
                        signature: e.target.value
                      });
                    }}
                  />
                  <p className="text-xs text-gray-400">Type the recipient's name above to generate a digital signature.</p>
                </div>
              </div>

              {/* Section 9: Assigned Agent */}
              <div>
                <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  9. Assigned Agent
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Agent Name</label>
                    <input
                      type="text"
                      value={currentShipment.agent_name || ''}
                      onChange={(e) => handleFieldChange('agent_name', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      placeholder="e.g. John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Agent ID</label>
                    <input
                      type="text"
                      value={currentShipment.agent_id || ''}
                      onChange={(e) => handleFieldChange('agent_id', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      placeholder="e.g. AGT-882"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Agent Phone</label>
                    <input
                      type="tel"
                      value={currentShipment.agent_phone || ''}
                      onChange={(e) => handleFieldChange('agent_phone', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      placeholder="e.g. +1 555-123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Agent Email</label>
                    <input
                      type="email"
                      value={currentShipment.agent_email || ''}
                      onChange={(e) => handleFieldChange('agent_email', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      placeholder="e.g. agent@velox.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Agent Rating</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={currentShipment.agent_rating || 5}
                      onChange={(e) => handleFieldChange('agent_rating', parseFloat(e.target.value) || 5)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      placeholder="5.0"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Rating from 0 to 5</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Agent Profile Picture</label>
                    <div className="flex gap-4 items-center">
                      {currentShipment.agent_profile_picture && (
                        <img
                          src={currentShipment.agent_profile_picture}
                          alt="Agent"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                        />
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                handleFieldChange('agent_profile_picture', reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                          id="agent-profile-upload"
                        />
                        <label
                          htmlFor="agent-profile-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-bold"
                        >
                          <Upload size={16} /> {currentShipment.agent_profile_picture ? 'Change Picture' : 'Upload Picture'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 10: Current Location Tracking */}
              <div>
                <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  10. Current Location Tracking
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Current Location</label>
                    <input
                      type="text"
                      value={currentShipment.current_location_name || ''}
                      onChange={(e) => handleFieldChange('current_location_name', e.target.value)}
                      className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                      placeholder="e.g. New York, USA or 123 Main St, New York, NY 10001"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Enter the current location address. Google Maps will automatically geocode it to show on the map.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            async (position) => {
                              // Reverse geocode to get address
                              try {
                                const response = await fetch(
                                  `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`,
                                  {
                                    headers: { 'User-Agent': 'velox-logistics/1.0' },
                                  }
                                );
                                const data = await response.json();
                                if (data.display_name) {
                                  handleFieldChange('current_location_name', data.display_name);
                                } else {
                                  handleFieldChange('current_location_name', `${position.coords.latitude}, ${position.coords.longitude}`);
                                }
                              } catch (err) {
                                handleFieldChange('current_location_name', `${position.coords.latitude}, ${position.coords.longitude}`);
                              }
                            },
                            () => {
                              alert('Unable to get your location. Please enable location services.');
                            }
                          );
                        } else {
                          alert('Geolocation is not supported by your browser.');
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                    >
                      <Navigation size={16} /> Use My Current Location
                    </button>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> Google Maps will automatically geocode the address when displaying the tracking map. 
                    You can enter a city name, full address, or use the button above to detect your current location.
                  </p>
                </div>
              </div>

              {/* Section 11: Additional Notes */}
              <div>
                <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  11. Additional Notes
                </h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">System Notes</label>
                  <textarea
                    value={currentShipment.system_notes || ''}
                    onChange={(e) => handleFieldChange('system_notes', e.target.value)}
                    className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                    rows={3}
                    placeholder="Internal notes for this shipment..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCurrentShipment(EMPTY_SHIPMENT);
                  setError(null);
                }}
                className="px-6 py-3 font-bold text-gray-500 hover:text-brand-black dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-brand-red text-white font-bold rounded-lg shadow-lg hover:bg-brand-redDark transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} /> {isEditing ? 'Update' : 'Create'} Shipment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

