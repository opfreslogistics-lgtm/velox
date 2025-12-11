import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendShipmentCreatedEmail, sendShipmentUpdatedEmail } from '@/lib/emailService';

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

type Body = {
  type: 'created' | 'updated';
  oldStatus?: string;
};

export async function POST(req: Request, { params }: { params: { shipmentId: string } }) {
  try {
    const supabase = getSupabase();
    const body = (await req.json()) as Body;

    if (!body.type) {
      return NextResponse.json({ error: 'Missing notification type.' }, { status: 400 });
    }

    const { data: shipment, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('id', params.shipmentId)
      .single();

    if (error || !shipment) {
      return NextResponse.json({ error: 'Shipment not found.' }, { status: 404 });
    }

    const s = shipment as Record<string, any>;
    const routeLabel = `${s.sender_city}, ${s.sender_country} → ${s.recipient_city}, ${s.recipient_country}`;

    if (body.type === 'created') {
      await sendShipmentCreatedEmail(
        {
          trackingNumber: s.tracking_number,
          senderName: s.sender_name,
          senderEmail: s.sender_email,
          recipientName: s.recipient_name,
          recipientEmail: s.recipient_email,
          status: s.status,
          route: routeLabel,
          createdAt: s.created_at,
        },
        process.env.ADMIN_EMAIL
      );
    } else {
      await sendShipmentUpdatedEmail(
        {
          trackingNumber: s.tracking_number,
          route: routeLabel,
          oldStatus: body.oldStatus || s.status,
          newStatus: s.status,
          updatedAt: s.updated_at,
          senderEmail: s.sender_email,
          recipientEmail: s.recipient_email,
          estimatedDelivery: s.estimated_delivery_date,
          currentLocation: s.current_location_name,
        },
        process.env.ADMIN_EMAIL
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send email notification' }, { status: 500 });
  }
}

