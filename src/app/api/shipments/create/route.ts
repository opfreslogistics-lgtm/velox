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

type ShipmentPayload = Record<string, any>;

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const body = (await req.json()) as ShipmentPayload;

    const requiredFields = [
      'tracking_number',
      'sender_name',
      'sender_phone',
      'sender_email',
      'sender_address_line1',
      'sender_city',
      'sender_state',
      'sender_postal_code',
      'sender_country',
      'recipient_name',
      'recipient_phone',
      'recipient_email',
      'recipient_address_line1',
      'recipient_city',
      'recipient_state',
      'recipient_postal_code',
      'recipient_country',
      'shipment_type',
      'package_count',
      'weight',
      'length',
      'width',
      'height',
      'shipment_description',
      'declared_value',
      'delivery_speed',
      'payment_method',
    ];

    const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
    if (missing.length) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const payload = {
      ...body,
      id,
      status: body.status || 'Pending',
      created_at: now,
      updated_at: now,
      // Include coordinates if provided (for OpenStreetMap)
      sender_lat: body.sender_lat || null,
      sender_lng: body.sender_lng || null,
      receiver_lat: body.receiver_lat || null,
      receiver_lng: body.receiver_lng || null,
      current_lat: body.current_lat || null,
      current_lng: body.current_lng || null,
    };

    const { data, error } = await (supabase
      .from('shipments') as any)
      .insert([payload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create shipment' }, { status: 500 });
  }
}

