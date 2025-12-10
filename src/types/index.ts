import { LucideIcon } from 'lucide-react';

export type PageType = 
  | 'home' | 'services' | 'tracking' | 'pricing' | 'about' | 'contact' 
  | 'careers' | 'sustainability' | 'privacy' | 'terms' | 'news' | 'partners' | 'cookies'
  | 'admin-login' | 'admin-dashboard' | 'admin-shipments' | 'admin-users' 
  | 'admin-blog' | 'admin-settings';

export interface NavItem {
  label: string;
  href: string; // Changed from id to href for Next.js
  children?: { label: string; href: string }[];
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

// Enhanced Tracking Types
export interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  icon?: LucideIcon;
  completed: boolean;
  isCurrent?: boolean;
  handler?: string;
  progress?: number;
}

export interface ShipmentImage {
  url: string;
  caption: string;
  type: 'package' | 'document' | 'proof' | 'transit';
  date: string;
}

export interface Agent {
  name: string;
  photo: string;
  id: string;
  phone: string;
  email?: string;
  rating: number;
  vehicle: string;
}

export type ShipmentStatus = 
  | 'Pending' | 'Processing' | 'Picked Up' | 'In Transit' | 'Arrived at Hub'
  | 'Departed Hub' | 'Customs Clearance' | 'Customs Hold' | 'Payment Required'
  | 'Payment Verified' | 'Out for Delivery' | 'Delivery Attempted' | 'Delivered' 
  | 'On Hold' | 'Address Issue' | 'Lost/Damaged' | 'Returned to Sender'
  | 'Cancelled' | 'Exception';

export interface Shipment {
  id: string;
  trackingNumber: string;
  sender: string;
  senderAddress?: string;
  senderEmail?: string;
  senderPhone?: string;
  recipient: string;
  recipientAddress?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  dateCreated: string;
  eta: string;
  weight: string;
  dimensions?: string;
  type: string;
  serviceType?: string;
  currentLocation?: { lat: number; lng: number; name: string };
  history: TrackingEvent[];
  images?: ShipmentImage[];
  signature?: string;
  progress: number;
  agent?: Agent;
  weather?: { temp: string; condition: string; icon: string };
  carbon?: { saved: string; method: string };
}

export interface AdminStats {
  totalShipments: number;
  activeShipments: number;
  delayed: number;
  revenue: string;
}