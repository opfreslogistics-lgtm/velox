import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { sendShipmentUpdatedEmail } from '@/lib/emailService';

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

export async function GET(_: Request, { params }: { params: { shipmentId: string } }) {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('shipments').select('*').eq('id', params.shipmentId).single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch shipment' }, { status: 500 });
  }
}

type ShipmentUpdatePayload = {
  status?: string;
  estimated_delivery_date?: string;
  current_location_name?: string;
  agent_name?: string;
  agent_phone?: string;
  agent_email?: string;
  note?: string;
};

export async function PATCH(req: Request, { params }: { params: { shipmentId: string } }) {
  try {
    const supabase = getSupabase();
    const body = (await req.json()) as ShipmentUpdatePayload;
    if (!body.status && !body.estimated_delivery_date && !body.current_location_name && !body.note) {
      return NextResponse.json({ error: 'No updates provided.' }, { status: 400 });
    }

    const { data: existing, error: fetchError } = await supabase
      .from('shipments')
      .select('*')
      .eq('id', params.shipmentId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Shipment not found.' }, { status: 404 });
    }

    const existingData = existing as any;
    const updates = {
      status: body.status ?? existingData.status,
      estimated_delivery_date: body.estimated_delivery_date ?? existingData.estimated_delivery_date,
      current_location_name: body.current_location_name ?? existingData.current_location_name,
      agent_name: body.agent_name ?? existingData.agent_name,
      agent_phone: body.agent_phone ?? existingData.agent_phone,
      agent_email: body.agent_email ?? existingData.agent_email,
      system_notes: body.note ?? existingData.system_notes,
    };

    const hasChanges = Object.entries(updates).some(([key, value]) => value !== existingData[key]);
    if (!hasChanges) {
      return NextResponse.json({ message: 'No changes detected; shipment left untouched.' }, { status: 200 });
    }

    const { data, error } = await (supabase
      .from('shipments') as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', params.shipmentId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const route = `${existingData.sender_city}, ${existingData.sender_country} → ${existingData.recipient_city}, ${existingData.recipient_country}`;
    const notificationHash = createHash('sha256')
      .update(
        JSON.stringify({
          status: updates.status,
          eta: updates.estimated_delivery_date,
          location: updates.current_location_name,
          note: updates.system_notes,
          agent_name: updates.agent_name,
          agent_phone: updates.agent_phone,
          agent_email: updates.agent_email,
        })
      )
      .digest('hex');

    let emailStatus = {
      attempted: false,
      senderSent: false,
      recipientSent: false,
      skipped: false,
      errors: [] as string[],
    };

    if (notificationHash !== existingData.last_notified_hash) {
      try {
        console.log('[shipments:update] Attempting to send email notification', {
          trackingNumber: data.tracking_number,
          senderEmail: data.sender_email,
          recipientEmail: data.recipient_email,
          adminEmail: adminNotificationEmail,
          oldStatus: existingData.status,
          newStatus: data.status,
        });

        emailStatus.attempted = true;

        await sendShipmentUpdatedEmail(
          {
            trackingNumber: data.tracking_number,
            route,
            oldStatus: existingData.status,
            newStatus: data.status,
            updatedAt: data.updated_at,
            senderEmail: data.sender_email,
            recipientEmail: data.recipient_email,
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

        console.log('[shipments:update] Email notification sent successfully', emailStatus);

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
        console.error('[shipments:update] Failed to send notification email', {
          error: errorMessage,
          stack: notifyErr?.stack,
          trackingNumber: data.tracking_number,
          senderEmail: data.sender_email,
          recipientEmail: data.recipient_email,
        });
        // Don't fail the request if email fails - shipment was updated successfully
      }
    } else {
      emailStatus.skipped = true;
      console.log('[shipments:update] Skipping email notification - no changes detected (hash matches)');
    }

    return NextResponse.json({ 
      ...data, 
      emailStatus: emailStatus 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update shipment' }, { status: 500 });
  }
}

