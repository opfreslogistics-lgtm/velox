import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendShipmentUpdatedEmail } from '@/lib/emailService';

// Status to progress percentage mapping (must match Tracking.tsx)
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
  current_lat?: number;
  current_lng?: number;
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
    
    // Capture the OLD location and coordinates BEFORE any updates - this is what we'll store in history
    const oldLocation = existingData.current_location_name || existingData.sender_city || 'Origin';
    const oldLat = existingData.current_lat;
    const oldLng = existingData.current_lng;
    const oldStatus = existingData.status;
    const oldAgentName = existingData.agent_name || 'Assigned Agent';
    
    const updates = {
      status: body.status ?? existingData.status,
      estimated_delivery_date: body.estimated_delivery_date ?? existingData.estimated_delivery_date,
      current_location_name: body.current_location_name ?? existingData.current_location_name,
      current_lat: body.current_lat !== undefined ? body.current_lat : existingData.current_lat,
      current_lng: body.current_lng !== undefined ? body.current_lng : existingData.current_lng,
      agent_name: body.agent_name ?? existingData.agent_name,
      agent_phone: body.agent_phone ?? existingData.agent_phone,
      agent_email: body.agent_email ?? existingData.agent_email,
      system_notes: body.note ?? existingData.system_notes,
    };

    const hasChanges = Object.entries(updates).some(([key, value]) => value !== existingData[key]);
    if (!hasChanges) {
      return NextResponse.json({ message: 'No changes detected; shipment left untouched.' }, { status: 200 });
    }

    // Check if status or location changed - these require a new history entry
    const statusChanged = updates.status !== oldStatus;
    const locationChanged = updates.current_location_name !== oldLocation || 
                           updates.current_lat !== oldLat || 
                           updates.current_lng !== oldLng;
    const shouldCreateHistoryEntry = statusChanged || locationChanged;

    const { data, error } = await (supabase
      .from('shipments') as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', params.shipmentId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create a new tracking event ONLY if status or location changed
    // Store the location, coordinates, status, handler, and progress at THIS moment (after update)
    if (shouldCreateHistoryEntry) {
      const locationToStore = updates.current_location_name || oldLocation;
      const latToStore = updates.current_lat !== undefined ? updates.current_lat : oldLat;
      const lngToStore = updates.current_lng !== undefined ? updates.current_lng : oldLng;
      const statusToStore = updates.status;
      const handlerToStore = updates.agent_name || oldAgentName;
      const progressToStore = STATUS_PROGRESS[statusToStore] ?? 0;
      
      const eventDescription = statusChanged && locationChanged
        ? `Status updated to: ${statusToStore}, Location: ${locationToStore}`
        : statusChanged
        ? `Status updated to: ${statusToStore}`
        : `Location updated to: ${locationToStore}`;

      // Insert new tracking event with immutable location, coordinates, handler, and progress
      // This captures the state at the moment of this update
      await (supabase.from('tracking_events') as any).insert([{
        shipment_id: params.shipmentId,
        status: statusToStore,
        description: eventDescription,
        timestamp: new Date().toISOString(),
        location: locationToStore, // Store the location at the time of this event (immutable)
        latitude: latToStore,      // Store the latitude at the time of this event (immutable)
        longitude: lngToStore,     // Store the longitude at the time of this event (immutable)
        handler: handlerToStore,    // Store the handler at the time of this event (immutable)
        progress: progressToStore, // Store the progress at the time of this event (immutable)
      }]);
    }

    // Fire-and-forget email notification to sender & receiver about status change
    (async () => {
      try {
        const senderAddress = [
          existingData.sender_address_line1,
          existingData.sender_address_line2,
          existingData.sender_city,
          existingData.sender_state,
          existingData.sender_postal_code,
          existingData.sender_country,
        ].filter(Boolean).join(', ');

        const recipientAddress = [
          existingData.recipient_address_line1,
          existingData.recipient_address_line2,
          existingData.recipient_city,
          existingData.recipient_state,
          existingData.recipient_postal_code,
          existingData.recipient_country,
        ].filter(Boolean).join(', ');

        const routeLabel = `${existingData.sender_city}, ${existingData.sender_country} → ${existingData.recipient_city}, ${existingData.recipient_country}`;
        
        await sendShipmentUpdatedEmail(
          {
            trackingNumber: existingData.tracking_number,
            route: routeLabel,
            oldStatus,
            newStatus: updates.status,
            updatedAt: (data as any)?.updated_at || new Date().toISOString(),
            senderName: existingData.sender_name,
            senderEmail: existingData.sender_email,
            senderPhone: existingData.sender_phone,
            senderAddress: senderAddress,
            recipientName: existingData.recipient_name,
            recipientEmail: existingData.recipient_email,
            recipientPhone: existingData.recipient_phone,
            recipientAddress: recipientAddress,
            estimatedDelivery: updates.estimated_delivery_date,
            currentLocation: updates.current_location_name,
            shipmentType: existingData.shipment_type,
            weight: existingData.weight,
            origin: routeLabel.split(' → ')[0],
            destination: routeLabel.split(' → ')[1],
            agent: updates.agent_name || existingData.agent_name || existingData.agent_id ? {
              name: updates.agent_name || existingData.agent_name,
              phone: updates.agent_phone || existingData.agent_phone,
              email: updates.agent_email || existingData.agent_email,
            } : undefined,
          },
          process.env.ADMIN_EMAIL
        );
      } catch (mailErr: any) {
        console.error('[shipments/update] Email send failed', mailErr?.message || mailErr);
      }
    })();

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update shipment' }, { status: 500 });
  }
}

