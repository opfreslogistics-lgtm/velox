
'use client';

import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MoreHorizontal, MapPin, 
  Calendar, Package, Truck, CheckCircle, XCircle, 
  Save, X, User, Globe, Cloud, Leaf, Camera, Image as ImageIcon, Upload, PenTool
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '@/types';

const INITIAL_DATA: Shipment[] = [
  { 
    id: '1', 
    trackingNumber: 'VLX-882190', 
    sender: 'Apple Inc.', 
    senderAddress: '1 Infinite Loop, Cupertino, CA',
    senderEmail: 'logistics@apple.com',
    senderPhone: '+1 408-996-1010',
    recipient: 'Best Buy Retail', 
    recipientAddress: '1000 W North Ave, Chicago, IL',
    recipientEmail: 'inventory@bestbuy.com',
    recipientPhone: '+1 312-555-0199',
    origin: 'Shenzhen, CN', 
    destination: 'Chicago, USA', 
    status: 'In Transit', 
    dateCreated: '2023-10-24', 
    eta: '2023-10-28', 
    weight: '450 kg', 
    type: 'Air Freight', 
    serviceType: 'Express',
    history: [], 
    progress: 65,
    agent: {
        name: "David K.", photo: "https://randomuser.me/api/portraits/men/22.jpg", id: "AGT-101", phone: "555-0100", rating: 4.8, vehicle: "Truck #44"
    },
    weather: { temp: "15°C", condition: "Cloudy", icon: "cloud" },
    carbon: { saved: "50kg", method: "Optimized Route" },
    images: [{ url: "https://images.unsplash.com/photo-1566576912902-199bd62052db", caption: "Package", type: 'package', date: "2023-10-24" }],
    signature: "Michael Scott"
  },
  { 
    id: '2', 
    trackingNumber: 'VLX-993021', 
    sender: 'Samsung Electronics', 
    senderAddress: '129 Samsung-ro, Suwon-si',
    recipient: 'Tech Distro LLC', 
    recipientAddress: 'HafenCity, Hamburg',
    origin: 'Seoul, KR', 
    destination: 'Hamburg, DE', 
    status: 'Customs Hold', 
    dateCreated: '2023-10-22', 
    eta: '2023-10-30', 
    weight: '1200 kg', 
    type: 'Ocean Freight', 
    serviceType: 'FCL',
    history: [], 
    progress: 40,
    agent: { name: "", photo: "", id: "", phone: "", rating: 0, vehicle: "" },
    signature: ""
  }
];

const EMPTY_SHIPMENT: Shipment = {
    id: '',
    trackingNumber: '',
    sender: '',
    senderAddress: '',
    senderEmail: '',
    senderPhone: '',
    recipient: '',
    recipientAddress: '',
    recipientEmail: '',
    recipientPhone: '',
    origin: '',
    destination: '',
    status: 'Pending',
    dateCreated: new Date().toISOString().split('T')[0],
    eta: '',
    weight: '',
    type: 'Box',
    serviceType: 'Standard',
    progress: 0,
    history: [],
    // Initialize nested objects for form handling
    agent: { name: '', photo: '', id: '', phone: '', rating: 5.0, vehicle: '' },
    weather: { temp: '', condition: '', icon: 'cloud' },
    carbon: { saved: '', method: '' },
    images: [],
    signature: ''
};

// All available statuses
const ALL_STATUSES: ShipmentStatus[] = [
  'Pending', 'Processing', 'Picked Up', 'In Transit', 'Arrived at Hub', 
  'Departed Hub', 'Customs Clearance', 'Customs Hold', 'Payment Required', 
  'Payment Verified', 'Out for Delivery', 'Delivery Attempted', 'Delivered', 
  'On Hold', 'Address Issue', 'Lost/Damaged', 'Returned to Sender', 
  'Cancelled', 'Exception'
];

const ShipmentManager: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentShipment, setCurrentShipment] = useState<Shipment>(EMPTY_SHIPMENT);
  const [viewingShipment, setViewingShipment] = useState<Shipment | null>(null);

  const getStatusColor = (status: ShipmentStatus | string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'In Transit': 
      case 'Out for Delivery':
      case 'Picked Up':
      case 'Arrived at Hub':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Pending': 
      case 'Processing':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'Exception': 
      case 'Cancelled':
      case 'Lost/Damaged':
      case 'Returned to Sender':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Customs Clearance': 
      case 'Customs Hold':
      case 'On Hold':
      case 'Payment Required':
      case 'Address Issue':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCreateNew = () => {
      const newId = 'VLX-' + Math.floor(100000 + Math.random() * 900000);
      setCurrentShipment({ ...EMPTY_SHIPMENT, id: Math.random().toString(), trackingNumber: newId });
      setIsModalOpen(true);
  };

  const handleSave = () => {
      setShipments([currentShipment, ...shipments]);
      setIsModalOpen(false);
  };

  const handleChange = (field: keyof Shipment, value: any) => {
      setCurrentShipment({ ...currentShipment, [field]: value });
  };

  const handleNestedChange = (parent: 'agent' | 'weather' | 'carbon', field: string, value: any) => {
      setCurrentShipment({
          ...currentShipment,
          [parent]: {
              ...currentShipment[parent] as any,
              [field]: value
          }
      });
  };

  // Helper to handle file selection and create object URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'agent' | 'image', imageType?: 'package' | 'document' | 'proof' | 'transit') => {
      const file = e.target.files?.[0];
      if (file) {
          const url = URL.createObjectURL(file);
          
          if (field === 'agent') {
              handleNestedChange('agent', 'photo', url);
          } else if (field === 'image' && imageType) {
              const newImage = { 
                  url, 
                  caption: imageType === 'package' ? 'Pickup Scan' : imageType === 'proof' ? 'Proof of Delivery' : imageType.charAt(0).toUpperCase() + imageType.slice(1), 
                  type: imageType, 
                  date: new Date().toISOString().split('T')[0] 
              };
              // Filter out existing image of same type to replace it, or just add
              const existingImages = currentShipment.images || [];
              const filtered = existingImages.filter(img => img.type !== imageType);
              setCurrentShipment({ ...currentShipment, images: [...filtered, newImage] });
          }
      }
  };

  // Helper to get image URL for display
  const getImageUrl = (type: 'package' | 'document' | 'proof' | 'transit') => {
      return currentShipment.images?.find(img => img.type === type)?.url;
  }

  const filteredShipments = shipments.filter(s => 
    (filterStatus === 'All' || s.status === filterStatus) &&
    (s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.recipient.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in-up h-full flex flex-col">
       {/* Actions Bar */}
       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
                type="text" 
                placeholder="Search tracking #, sender, recipient..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-brand-red outline-none dark:text-white"
             />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <select 
                className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium dark:text-white cursor-pointer outline-none hover:border-brand-red transition-colors"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
             >
                <option value="All">All Status</option>
                {ALL_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
             </select>
             <button onClick={handleCreateNew} className="flex items-center gap-2 px-4 py-2.5 bg-brand-red text-white rounded-lg font-bold text-sm hover:bg-brand-redDark transition-colors shadow-lg">
                <Plus size={18} /> Create Shipment
             </button>
          </div>
       </div>

       {/* Table */}
       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">Tracking ID</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">Route</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">Client</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">ETA</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                   {filteredShipments.map((shipment) => (
                      <tr key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group cursor-pointer" onClick={() => { setViewingShipment(shipment); setIsDetailOpen(true); }}>
                         <td className="p-4">
                            <span className="font-mono font-bold text-brand-black dark:text-white">{shipment.trackingNumber}</span>
                            <div className="text-xs text-gray-400 mt-1">{shipment.dateCreated}</div>
                         </td>
                         <td className="p-4">
                            <div className="flex flex-col text-sm">
                               <span className="text-gray-800 dark:text-gray-200 font-medium">{shipment.origin}</span>
                               <span className="text-gray-400 text-xs">to</span>
                               <span className="text-gray-800 dark:text-gray-200 font-medium">{shipment.destination}</span>
                            </div>
                         </td>
                         <td className="p-4">
                            <div className="text-sm font-bold text-brand-black dark:text-white">{shipment.sender}</div>
                            <div className="text-xs text-gray-400">Receiver: {shipment.recipient}</div>
                         </td>
                         <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap ${getStatusColor(shipment.status)}`}>
                               {shipment.status}
                            </span>
                         </td>
                         <td className="p-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                               <Calendar size={14} /> {shipment.eta}
                            </div>
                         </td>
                         <td className="p-4">
                             <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                {shipment.type === 'Air Freight' ? <Package size={14} /> : <Truck size={14} />}
                                {shipment.type}
                             </div>
                             <div className="text-xs text-gray-400 mt-0.5">{shipment.weight}</div>
                         </td>
                         <td className="p-4 text-center">
                            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
                               <MoreHorizontal size={18} />
                            </button>
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

       {/* CREATE SHIPMENT MODAL */}
       {isModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
                  
                  {/* Modal Header */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                      <div>
                          <h2 className="text-2xl font-bold text-brand-black dark:text-white flex items-center gap-2"><Plus className="text-brand-red" /> Create New Shipment</h2>
                          <p className="text-sm text-gray-500">Enter all details required for the waybill.</p>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                          <X size={24} className="text-gray-500" />
                      </button>
                  </div>

                  {/* Modal Form Scrollable Area */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-8">
                      
                      {/* Section 1: Core Details */}
                      <div>
                          <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">1. Core Waybill Info</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Tracking Number</label>
                                  <input type="text" value={currentShipment.trackingNumber} disabled className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 border-none font-mono font-bold dark:text-white opacity-70" />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                                  <select 
                                    className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                                    value={currentShipment.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                  >
                                      {ALL_STATUSES.map(status => (
                                          <option key={status} value={status}>{status}</option>
                                      ))}
                                  </select>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Creation Date</label>
                                  <input 
                                    type="date" 
                                    className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                                    value={currentShipment.dateCreated}
                                    onChange={(e) => handleChange('dateCreated', e.target.value)}
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Section 2: Logistics & Route */}
                      <div>
                          <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">2. Logistics & Route</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Origin City</label>
                                  <div className="relative">
                                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                      <input 
                                        type="text" 
                                        placeholder="e.g. New York, USA" 
                                        className="w-full pl-10 pr-4 py-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                                        value={currentShipment.origin}
                                        onChange={(e) => handleChange('origin', e.target.value)}
                                      />
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Destination City</label>
                                  <div className="relative">
                                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                      <input 
                                        type="text" 
                                        placeholder="e.g. London, UK" 
                                        className="w-full pl-10 pr-4 py-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                                        value={currentShipment.destination}
                                        onChange={(e) => handleChange('destination', e.target.value)}
                                      />
                                  </div>
                              </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Est. Arrival</label>
                                  <input 
                                    type="date" 
                                    className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                                    value={currentShipment.eta}
                                    onChange={(e) => handleChange('eta', e.target.value)}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Weight</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. 15 kg"
                                    className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                                    value={currentShipment.weight}
                                    onChange={(e) => handleChange('weight', e.target.value)}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Service Type</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Express Air"
                                    className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                                    value={currentShipment.serviceType}
                                    onChange={(e) => handleChange('serviceType', e.target.value)}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Package Type</label>
                                  <select 
                                    className="w-full p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-red dark:text-white"
                                    value={currentShipment.type}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                  >
                                      <option>Box</option>
                                      <option>Document</option>
                                      <option>Pallet</option>
                                      <option>Container</option>
                                  </select>
                              </div>
                          </div>
                      </div>

                      {/* Section 3: Parties Involved */}
                      <div>
                          <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">3. Parties Involved</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Sender */}
                              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl space-y-3">
                                  <h4 className="font-bold text-brand-black dark:text-white flex items-center gap-2"><User size={16}/> Sender Details</h4>
                                  <input 
                                    type="text" 
                                    placeholder="Sender Name" 
                                    className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                                    value={currentShipment.sender}
                                    onChange={(e) => handleChange('sender', e.target.value)}
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="Address" 
                                    className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                                    value={currentShipment.senderAddress}
                                    onChange={(e) => handleChange('senderAddress', e.target.value)}
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                      <input 
                                        type="email" 
                                        placeholder="Email" 
                                        className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                                        value={currentShipment.senderEmail}
                                        onChange={(e) => handleChange('senderEmail', e.target.value)}
                                      />
                                      <input 
                                        type="text" 
                                        placeholder="Phone" 
                                        className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                                        value={currentShipment.senderPhone}
                                        onChange={(e) => handleChange('senderPhone', e.target.value)}
                                      />
                                  </div>
                              </div>

                              {/* Recipient */}
                              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl space-y-3">
                                  <h4 className="font-bold text-brand-black dark:text-white flex items-center gap-2"><User size={16}/> Recipient Details</h4>
                                  <input 
                                    type="text" 
                                    placeholder="Recipient Name" 
                                    className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                                    value={currentShipment.recipient}
                                    onChange={(e) => handleChange('recipient', e.target.value)}
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="Address" 
                                    className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                                    value={currentShipment.recipientAddress}
                                    onChange={(e) => handleChange('recipientAddress', e.target.value)}
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                      <input 
                                        type="email" 
                                        placeholder="Email" 
                                        className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                                        value={currentShipment.recipientEmail}
                                        onChange={(e) => handleChange('recipientEmail', e.target.value)}
                                      />
                                      <input 
                                        type="text" 
                                        placeholder="Phone" 
                                        className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                                        value={currentShipment.recipientPhone}
                                        onChange={(e) => handleChange('recipientPhone', e.target.value)}
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>

                       {/* Section 4: Advanced */}
                       <div>
                          <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">4. Advanced Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              
                              {/* Agent */}
                              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-3 text-brand-black dark:text-white font-bold"><Truck size={16} /> Assigned Agent</div>
                                  <div className="space-y-2">
                                      <input type="text" placeholder="Agent Name" value={currentShipment.agent?.name} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded dark:text-white" onChange={(e) => handleNestedChange('agent', 'name', e.target.value)} />
                                      
                                      {/* Agent Photo Upload */}
                                      <div className="relative">
                                          <input 
                                            type="file" 
                                            accept="image/*"
                                            className="hidden" 
                                            id="agent-upload"
                                            onChange={(e) => handleFileUpload(e, 'agent')}
                                          />
                                          <label htmlFor="agent-upload" className="flex items-center justify-between w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded cursor-pointer hover:border-brand-red transition-colors dark:text-white">
                                              <span className="truncate">{currentShipment.agent?.photo ? 'Photo Selected' : 'Upload Agent Photo'}</span>
                                              <Upload size={14} className="text-gray-400" />
                                          </label>
                                          {currentShipment.agent?.photo && (
                                              <img src={currentShipment.agent.photo} alt="Preview" className="w-8 h-8 rounded-full absolute right-10 top-1/2 -translate-y-1/2 object-cover border border-white" />
                                          )}
                                      </div>

                                      <input type="text" placeholder="Vehicle Info" value={currentShipment.agent?.vehicle} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded dark:text-white" onChange={(e) => handleNestedChange('agent', 'vehicle', e.target.value)} />
                                      <input type="text" placeholder="Agent ID" value={currentShipment.agent?.id} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded dark:text-white" onChange={(e) => handleNestedChange('agent', 'id', e.target.value)} />
                                  </div>
                              </div>

                              {/* Weather */}
                              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-3 text-brand-black dark:text-white font-bold"><Cloud size={16} /> Destination Weather</div>
                                  <div className="space-y-2">
                                      <input type="text" placeholder="Temp (e.g. 15°C)" value={currentShipment.weather?.temp} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded dark:text-white" onChange={(e) => handleNestedChange('weather', 'temp', e.target.value)} />
                                      <input type="text" placeholder="Condition (e.g. Rainy)" value={currentShipment.weather?.condition} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded dark:text-white" onChange={(e) => handleNestedChange('weather', 'condition', e.target.value)} />
                                  </div>
                              </div>

                              {/* Carbon */}
                              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-3 text-brand-black dark:text-white font-bold"><Leaf size={16} /> Sustainability</div>
                                  <div className="space-y-2">
                                      <input type="text" placeholder="CO2 Saved (e.g. 5kg)" value={currentShipment.carbon?.saved} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded dark:text-white" onChange={(e) => handleNestedChange('carbon', 'saved', e.target.value)} />
                                      <input type="text" placeholder="Method" value={currentShipment.carbon?.method} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded dark:text-white" onChange={(e) => handleNestedChange('carbon', 'method', e.target.value)} />
                                  </div>
                              </div>

                          </div>
                       </div>

                       {/* Section 5: Media & Proof */}
                       <div>
                           <h3 className="font-bold text-brand-red uppercase text-xs tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">5. Media & Evidence</h3>
                           
                           {/* 4 Image Slots */}
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                               {['package', 'transit', 'document', 'proof'].map((type) => {
                                   const imgUrl = getImageUrl(type as any);
                                   const label = type === 'package' ? 'Pickup Scan' : type === 'proof' ? 'Proof of Delivery' : type === 'document' ? 'Customs Doc' : 'In Transit';
                                   
                                   return (
                                       <div key={type} className="relative aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-brand-red transition-colors flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 group overflow-hidden">
                                           {imgUrl ? (
                                               <>
                                                 <img src={imgUrl} className="absolute inset-0 w-full h-full object-cover" alt={label} />
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
                                                onChange={(e) => handleFileUpload(e, 'image', type as any)}
                                           />
                                       </div>
                                   );
                               })}
                           </div>

                           {/* Signature - Text Based Input */}
                           <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><PenTool size={14}/> Recipient Signature (Text)</label>
                                <div className="flex flex-col gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Type name to sign..."
                                        className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white font-signature text-3xl"
                                        value={currentShipment.signature || ''}
                                        onChange={(e) => handleChange('signature', e.target.value)}
                                    />
                                    <p className="text-xs text-gray-400">Type the recipient's name above to generate a digital signature.</p>
                                </div>
                           </div>
                       </div>

                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-4">
                      <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-brand-black dark:text-gray-400 dark:hover:text-white transition-colors">Cancel</button>
                      <button onClick={handleSave} className="px-8 py-3 bg-brand-red text-white font-bold rounded-lg shadow-lg hover:bg-brand-redDark transition-colors flex items-center gap-2">
                          <Save size={18} /> Save Shipment
                      </button>
                  </div>
              </div>
           </div>
       )}
    </div>
  );
};

export default ShipmentManager;
