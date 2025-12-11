import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendShipmentCreatedEmail } from '@/lib/emailService';

const STATUS_PROGRESS: Record<string, number> = {
  'Pending': 5,
  'Awaiting Payment': 10,
  'Payment Confirmed': 20,
  'Processing': 30,
  'Ready for Pickup': 35,
  'Driver En Route': 40,
  'Picked Up': 45,
  'At Warehouse': 50,
  'In Transit': 60,
  'Departed Facility': 65,
  'Arrived at Facility': 70,
  'Out for Delivery': 85,
  'Delivered': 100,
  'Returned to Sender': 0,
  'Cancelled': 0,
  'On Hold': 15,
  'Delayed': 25,
  'Weather Delay': 25,
  'Address Issue': 25,
  'Customs Hold': 35,
  'Inspection Required': 45,
  'Payment Verification Required': 15,
  'Lost Package': 0,
  'Damaged Package': 0,
};

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

    // Create initial tracking event with immutable snapshot
    const bodyAny = body as Record<string, any>;
    await (supabase.from('tracking_events') as any).insert([{
      shipment_id: id,
      status: payload.status,
      description: `Shipment created with status: ${payload.status}`,
      timestamp: now,
      location: bodyAny.current_location_name || bodyAny.sender_city || 'Origin',
      latitude: bodyAny.current_lat || bodyAny.sender_lat,
      longitude: bodyAny.current_lng || bodyAny.sender_lng,
      handler: bodyAny.agent_name || 'Assigned Agent',
      progress: STATUS_PROGRESS[payload.status] ?? 0,
    }]);

    // Fire-and-forget email notification to sender & receiver
    (async () => {
      try {
        const senderAddress = [
          body.sender_address_line1,
          body.sender_address_line2,
          body.sender_city,
          body.sender_state,
          body.sender_postal_code,
          body.sender_country,
        ].filter(Boolean).join(', ');

        const recipientAddress = [
          body.recipient_address_line1,
          body.recipient_address_line2,
          body.recipient_city,
          body.recipient_state,
          body.recipient_postal_code,
          body.recipient_country,
        ].filter(Boolean).join(', ');

        const routeLabel = `${body.sender_city}, ${body.sender_country} → ${body.recipient_city}, ${body.recipient_country}`;
        
        await sendShipmentCreatedEmail(
          {
            trackingNumber: body.tracking_number,
            senderName: body.sender_name,
            senderEmail: body.sender_email,
            senderPhone: body.sender_phone,
            senderAddress: senderAddress,
            recipientName: body.recipient_name,
            recipientEmail: body.recipient_email,
            recipientPhone: body.recipient_phone,
            recipientAddress: recipientAddress,
            status: payload.status,
            route: routeLabel,
            createdAt: payload.created_at,
            shipmentType: body.shipment_type,
            weight: body.weight,
            origin: routeLabel.split(' → ')[0],
            destination: routeLabel.split(' → ')[1],
            currentLocation: bodyAny.current_location_name || body.sender_city,
            estimatedDelivery: body.estimated_delivery_date,
            agent: bodyAny.agent_name || bodyAny.agent_id ? {
              name: bodyAny.agent_name,
              phone: bodyAny.agent_phone,
              email: bodyAny.agent_email,
              photo: bodyAny.agent_photo,
            } : undefined,
          },
          process.env.ADMIN_EMAIL
        );
      } catch (mailErr: any) {
        console.error('[shipments/create] Email send failed', mailErr?.message || mailErr);
      }
    })();

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create shipment' }, { status: 500 });
  }
}

