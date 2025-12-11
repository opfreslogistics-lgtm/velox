-- Migration: Add coordinate fields to tracking_events table
-- These fields store latitude/longitude for each timeline entry
-- This ensures each history entry permanently stores its coordinates at the time it was created
-- Run this in your Supabase SQL editor

-- Add latitude and longitude columns to tracking_events
alter table public.tracking_events 
  add column if not exists latitude numeric,
  add column if not exists longitude numeric;

-- Add index for coordinate queries
create index if not exists idx_tracking_events_coords on public.tracking_events(latitude, longitude) where latitude is not null and longitude is not null;

-- Note: These fields are nullable to maintain compatibility with existing timeline entries
-- New timeline entries will store coordinates when available
-- Old entries will have NULL coordinates, which is acceptable
-- The application will use stored coordinates for drawing polylines on OpenStreetMap

