-- Migration: Add agent_id column to shipments
-- Run this in Supabase SQL editor or your migration runner

alter table public.shipments
  add column if not exists agent_id text;

-- Optional: backfill agent_id from JSON data if you previously stored it under data->agent->id
-- update public.shipments
-- set agent_id = coalesce(agent_id, data->'agent'->>'id')
-- where agent_id is null and data ? 'agent';




