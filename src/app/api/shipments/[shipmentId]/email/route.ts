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

    const routeLabel = `${shipment.sender_city}, ${shipment.sender_country} → ${shipment.recipient_city}, ${shipment.recipient_country}`;

    if (body.type === 'created') {
      await sendShipmentCreatedEmail(
        {
          trackingNumber: shipment.tracking_number,
          senderName: shipment.sender_name,
          senderEmail: shipment.sender_email,
          recipientName: shipment.recipient_name,
          recipientEmail: shipment.recipient_email,
          status: shipment.status,
          route: routeLabel,
          createdAt: shipment.created_at,
        },
        process.env.ADMIN_EMAIL
      );
    } else {
      await sendShipmentUpdatedEmail(
        {
          trackingNumber: shipment.tracking_number,
          route: routeLabel,
          oldStatus: body.oldStatus || shipment.status,
          newStatus: shipment.status,
          updatedAt: shipment.updated_at,
          senderEmail: shipment.sender_email,
          recipientEmail: shipment.recipient_email,
          estimatedDelivery: shipment.estimated_delivery_date,
          currentLocation: shipment.current_location_name,
        },
        process.env.ADMIN_EMAIL
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send email notification' }, { status: 500 });
  }
}

