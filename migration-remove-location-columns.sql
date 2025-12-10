-- Migration: Remove latitude/longitude columns from shipments table
-- Run this in your Supabase SQL editor to update the existing database

-- Drop the old location columns if they exist
alter table public.shipments 
  drop column if exists current_location_lat,
  drop column if exists current_location_lng;

-- The current_location_name column should already exist, but add it if it doesn't
alter table public.shipments 
  add column if not exists current_location_name text;

-- Verify the changes
-- You can run this to check: SELECT column_name FROM information_schema.columns WHERE table_name = 'shipments' AND column_name LIKE 'current_location%';


