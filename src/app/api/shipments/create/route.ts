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

    // Validate email addresses before inserting
    console.log('[shipments:create] Validating email addresses', {
      sender_email: body.sender_email,
      recipient_email: body.recipient_email,
      sender_email_valid: body.sender_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.sender_email),
      recipient_email_valid: body.recipient_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.recipient_email),
    });

    const { data, error } = await (supabase
      .from('shipments') as any)
      .insert([payload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log the actual data that was saved
    console.log('[shipments:create] Shipment created, email addresses in database:', {
      sender_email: data.sender_email,
      recipient_email: data.recipient_email,
      sender_email_type: typeof data.sender_email,
      recipient_email_type: typeof data.recipient_email,
    });

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

    // FORCE SEND EMAILS on every create - DIRECT SEND like contact form
    emailStatus.attempted = true;
    
    console.log('[shipments:create] FORCE sending email notification to sender and recipient', {
      trackingNumber: data.tracking_number,
      senderEmail: data.sender_email,
      recipientEmail: data.recipient_email,
      adminEmail: adminNotificationEmail,
      senderEmailValid: data.sender_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.sender_email),
      recipientEmailValid: data.recipient_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.recipient_email),
    });

    // Send emails DIRECTLY like contact form - no wrapper function
    const { sendEmail } = await import('@/lib/mailer');
    const { shipmentCreatedEmailTemplate } = await import('@/lib/emailTemplates');
    
    const template = shipmentCreatedEmailTemplate({
      trackingNumber: data.tracking_number,
      senderName: data.sender_name,
      recipientName: data.recipient_name,
      status: data.status,
      route,
      createdAt: data.created_at,
    });

    // Send to sender - DIRECT like contact form
    if (data.sender_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.sender_email)) {
      try {
        console.log('[shipments:create] 📧 Sending email directly to sender:', data.sender_email);
        await sendEmail({
          to: data.sender_email.trim(),
          subject: template.subject,
          html: template.html,
        });
        console.log('[shipments:create] ✅ SUCCESS: Email sent to sender:', data.sender_email);
        emailStatus.senderSent = true;
      } catch (err: any) {
        console.error('[shipments:create] ❌ FAILED to send email to sender:', data.sender_email, {
          error: err.message,
          code: err.code,
          response: err.response,
        });
        emailStatus.errors.push(`Sender email failed: ${err.message}`);
      }
    }

    // Send to recipient - DIRECT like contact form
    if (data.recipient_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.recipient_email)) {
      try {
        console.log('[shipments:create] 📧 Sending email directly to recipient:', data.recipient_email);
        await sendEmail({
          to: data.recipient_email.trim(),
          subject: template.subject,
          html: template.html,
        });
        console.log('[shipments:create] ✅ SUCCESS: Email sent to recipient:', data.recipient_email);
        emailStatus.recipientSent = true;
      } catch (err: any) {
        console.error('[shipments:create] ❌ FAILED to send email to recipient:', data.recipient_email, {
          error: err.message,
          code: err.code,
          response: err.response,
        });
        emailStatus.errors.push(`Recipient email failed: ${err.message}`);
      }
    }

    console.log('[shipments:create] ✅ Email notification completed', emailStatus);

    await (supabase
      .from('shipments') as any)
      .update({
        last_notified_status: data.status,
        last_notified_hash: notificationHash,
        last_notified_at: new Date().toISOString(),
      })
      .eq('id', data.id);

    return NextResponse.json({ 
      ...data, 
      emailStatus: emailStatus 
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create shipment' }, { status: 500 });
  }
}

