-- Migration: Add map_provider_settings table
-- This table stores the admin-selected map provider for the entire platform
-- Run this in your Supabase SQL editor

-- Create map provider enum type
create type public.map_provider_type as enum ('google', 'openstreetmap', 'mapbox');

-- Create map_provider_settings table
create table if not exists public.map_provider_settings (
  id uuid primary key default gen_random_uuid(),
  provider public.map_provider_type not null default 'google',
  updated_at timestamptz default now(),
  updated_by text,
  created_at timestamptz default now()
);

-- Insert default value (Google Maps)
insert into public.map_provider_settings (provider, updated_at, created_at)
values ('google', now(), now())
on conflict do nothing;

-- Note: The application will always query the first row to get the current provider
-- To ensure only one row exists, you can add a check constraint or handle it in application logic
-- For simplicity, we'll just query the first row in the API

-- Note: The application will always query the first row to get the current provider
-- Admin can update this single row to change the map provider globally

