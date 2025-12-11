-- Rebuild shipments schema
-- Drops existing objects; run in a safe environment.

-- 1) Drop dependent tables first, then the enum
drop table if exists public.attachments cascade;
drop table if exists public.tracking_events cascade;
drop table if exists public.shipments cascade;
drop table if exists public.contact_messages cascade;
drop type if exists public.shipment_status cascade;

-- 2) Recreate enum (no IF NOT EXISTS to avoid Supabase parser issues)
create type public.shipment_status as enum (
  'Pending',
  'Awaiting Payment',
  'Payment Confirmed',
  'Processing',
  'Ready for Pickup',
  'Driver En Route',
  'Picked Up',
  'At Warehouse',
  'In Transit',
  'Departed Facility',
  'Arrived at Facility',
  'Out for Delivery',
  'Delivered',
  'Returned to Sender',
  'Cancelled',
  'On Hold',
  'Delayed',
  'Weather Delay',
  'Address Issue',
  'Customs Hold',
  'Inspection Required',
  'Payment Verification Required',
  'Lost Package',
  'Damaged Package'
);

-- 3) Shipments table with all requested fields
create table public.shipments (
  id uuid primary key,
  tracking_number text not null unique,
  reference_code text unique,
  barcode_number text,
  qr_code text,
  status public.shipment_status not null default 'Pending',

  -- Sender
  sender_name text not null,
  sender_phone text not null,
  sender_email text not null,
  sender_address_line1 text not null,
  sender_address_line2 text,
  sender_city text not null,
  sender_state text not null,
  sender_postal_code text not null,
  sender_country text not null,

  -- Recipient
  recipient_name text not null,
  recipient_phone text not null,
  recipient_email text,
  recipient_address_line1 text not null,
  recipient_address_line2 text,
  recipient_city text not null,
  recipient_state text not null,
  recipient_postal_code text not null,
  recipient_country text not null,

  -- Shipment details
  shipment_type text not null,
  package_count int not null,
  weight numeric not null,
  length numeric not null,
  width numeric not null,
  height numeric not null,
  shipment_description text not null,
  declared_value numeric not null,
  fragile boolean default false,
  special_instructions text,

  -- Pickup & delivery
  pickup_required boolean default false,
  pickup_date date,
  pickup_time_window text,
  pickup_address text,
  pickup_at timestamptz,
  delivered_at timestamptz,
  delivery_speed text not null,
  preferred_delivery_date date,
  signature_required boolean default false,
  cod boolean default false,
  cod_amount numeric,

  -- Customs
  commodity_type text,
  hs_code text,
  country_of_origin text,
  export_reason text,
  invoice_number text,

  -- Payment
  payment_method text not null,
  billing_address text,
  promo_code text,

  -- Attachments (metadata)
  package_images jsonb,
  customs_docs jsonb,
  label_file jsonb,

  estimated_delivery_date timestamptz,
  system_notes text,
  user_id uuid,
  data jsonb,
  -- Location tracking (name only - Google Maps will geocode automatically)
  current_location_name text,
  
  -- Assigned Agent
  agent_name text,
  agent_phone text,
  agent_email text,
  agent_rating numeric default 5.0,
  agent_profile_picture text,
  
  -- Notification metadata
  last_notified_status public.shipment_status,
  last_notified_hash text,
  last_notified_at timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4) Tracking events
-- Each event stores immutable location, handler, and progress at the time it was created
-- This ensures history entries never change when the shipment's current location is updated
create table public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid references public.shipments(id) on delete cascade,
  status public.shipment_status not null,
  description text,
  timestamp timestamptz default now(),
  location text, -- Immutable: location at the time this event was created
  handler text, -- Immutable: agent/handler at the time this event was created
  progress numeric -- Immutable: progress percentage at the time this event was created
);

-- 5) Attachments
create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid references public.shipments(id) on delete cascade,
  type text,
  url text,
  file_name text,
  created_at timestamptz default now()
);

-- 6) Contact messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz default now()
);

-- 7) Indexes
create index if not exists idx_shipments_tracking on public.shipments(tracking_number);
create index if not exists idx_shipments_reference on public.shipments(reference_code);
create index if not exists idx_shipments_status on public.shipments(status);
create index if not exists idx_tracking_events_shipment on public.tracking_events(shipment_id);
create index if not exists idx_contact_created_at on public.contact_messages(created_at);

-- 8) Storage bucket for shipment assets
insert into storage.buckets (id, name, public)
values ('shipment-assets', 'shipment-assets', true)
on conflict (id) do nothing;