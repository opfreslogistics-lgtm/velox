import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cachedClient: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (cachedClient) return cachedClient;
  if (!supabaseUrl || !supabaseAnon) {
    throw new Error('Supabase environment variables are not set.');
  }
  cachedClient = createClient(supabaseUrl, supabaseAnon);
  return cachedClient;
}

// GET: Retrieve current map provider
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await (supabase
      .from('map_provider_settings') as any)
      .select('provider')
      .limit(1)
      .single();

    if (error) {
      // If table doesn't exist or no row, return default
      return NextResponse.json({ provider: 'google' });
    }

    return NextResponse.json({ provider: data?.provider || 'google' });
  } catch (err: any) {
    // Return default on any error
    return NextResponse.json({ provider: 'google' });
  }
}

// PATCH: Update map provider
export async function PATCH(req: Request) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { provider } = body;

    if (!provider || !['google', 'openstreetmap', 'mapbox'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider. Must be: google, openstreetmap, or mapbox' },
        { status: 400 }
      );
    }

    // Get existing row or create new one
    const { data: existing } = await (supabase
      .from('map_provider_settings') as any)
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      // Update existing row
      const { data, error } = await (supabase
        .from('map_provider_settings') as any)
        .update({
          provider,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ provider: data.provider });
    } else {
      // Create new row
      const { data, error } = await (supabase
        .from('map_provider_settings') as any)
        .insert([{
          provider,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ provider: data.provider });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update map provider' }, { status: 500 });
  }
}

