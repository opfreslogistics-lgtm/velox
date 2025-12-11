-- Migration: Add location, handler, and progress columns to tracking_events table
-- This ensures each history entry permanently stores its location at the time it was created
-- Run this in your Supabase SQL editor to update the existing database

-- Add location column to store the location at the time the event was created
alter table public.tracking_events 
  add column if not exists location text;

-- Add handler column to store the agent/handler at the time the event was created
alter table public.tracking_events 
  add column if not exists handler text;

-- Add progress column to store the progress percentage at the time the event was created
alter table public.tracking_events 
  add column if not exists progress numeric;

-- Add index on location for potential queries
create index if not exists idx_tracking_events_location on public.tracking_events(location);

-- Note: Existing rows will have NULL values for these columns, which is acceptable.
-- New events will always have these values populated going forward.
-- The application code will use the stored location from the event, not the current shipment location.

