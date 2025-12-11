import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { sendShipmentCreatedEmail } from '@/lib/emailService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminNotificationEmail = process.env.SUPPORT_EMAIL || process.env.SALES_EMAIL || process.env.ADMIN_EMAIL;

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

    const route = `${(payload as any).sender_city}, ${(payload as any).sender_country} → ${(payload as any).recipient_city}, ${(payload as any).recipient_country}`;
    const notificationHash = createHash('sha256')
      .update(JSON.stringify({ status: payload.status, route, created_at: payload.created_at }))
      .digest('hex');

    let emailStatus = {
      attempted: false,
      senderSent: false,
      recipientSent: false,
      errors: [] as string[],
    };

    // FORCE SEND EMAILS on every create - always notify sender and recipient
    try {
      console.log('[shipments:create] FORCE sending email notification to sender and recipient', {
        trackingNumber: data.tracking_number,
        senderEmail: data.sender_email,
        recipientEmail: data.recipient_email,
        adminEmail: adminNotificationEmail,
      });

      emailStatus.attempted = true;

      await sendShipmentCreatedEmail(
        {
          trackingNumber: data.tracking_number,
          senderName: data.sender_name,
          senderEmail: data.sender_email,
          recipientName: data.recipient_name,
          recipientEmail: data.recipient_email,
          status: data.status,
          route,
          createdAt: data.created_at,
        },
        adminNotificationEmail
      );

      // Check if emails were sent by looking at the email addresses
      if (data.sender_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.sender_email)) {
        emailStatus.senderSent = true;
      }
      if (data.recipient_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.recipient_email)) {
        emailStatus.recipientSent = true;
      }

      console.log('[shipments:create] Email notification sent successfully', emailStatus);

      await (supabase
        .from('shipments') as any)
        .update({
          last_notified_status: data.status,
          last_notified_hash: notificationHash,
          last_notified_at: new Date().toISOString(),
        })
        .eq('id', data.id);
    } catch (notifyErr: any) {
      const errorMessage = notifyErr?.message || String(notifyErr);
      emailStatus.errors.push(errorMessage);
      console.error('[shipments:create] Failed to send email notification', {
        error: errorMessage,
        stack: notifyErr?.stack,
        trackingNumber: data.tracking_number,
        senderEmail: data.sender_email,
        recipientEmail: data.recipient_email,
      });
      // Don't fail the request if email fails - shipment was created successfully
    }

    return NextResponse.json({ 
      ...data, 
      emailStatus: emailStatus 
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create shipment' }, { status: 500 });
  }
}

