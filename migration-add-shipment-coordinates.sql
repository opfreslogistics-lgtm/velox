-- Migration: Add coordinate fields to shipments table
-- These fields store latitude/longitude for sender, receiver, and current location
-- Required for OpenStreetMap provider which uses manual coordinates
-- Run this in your Supabase SQL editor

-- Add sender coordinates
alter table public.shipments 
  add column if not exists sender_lat numeric,
  add column if not exists sender_lng numeric;

-- Add receiver coordinates
alter table public.shipments 
  add column if not exists receiver_lat numeric,
  add column if not exists receiver_lng numeric;

-- Add current location coordinates
alter table public.shipments 
  add column if not exists current_lat numeric,
  add column if not exists current_lng numeric;

-- Add indexes for coordinate queries
create index if not exists idx_shipments_sender_coords on public.shipments(sender_lat, sender_lng) where sender_lat is not null and sender_lng is not null;
create index if not exists idx_shipments_receiver_coords on public.shipments(receiver_lat, receiver_lng) where receiver_lat is not null and receiver_lng is not null;
create index if not exists idx_shipments_current_coords on public.shipments(current_lat, current_lng) where current_lat is not null and current_lng is not null;

-- Note: All coordinate fields are nullable to maintain compatibility with existing shipments
-- These fields are only required when using OpenStreetMap provider

