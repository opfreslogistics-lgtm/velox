import { NextResponse } from 'next/server';

type QuotePayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  origin?: string;
  destination?: string;
  serviceType?: string;
  weight?: number;
  volume?: string;
  notes?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as QuotePayload;

    if (!body.email || !body.origin || !body.destination) {
      return NextResponse.json({ error: 'Email, origin, and destination are required.' }, { status: 400 });
    }

    const requester = body.name || 'Customer';

    // Email delivery removed; log for observability.
    console.info('[quote] request received', { requester, email: body.email, origin: body.origin, destination: body.destination });

    return NextResponse.json({ ok: true, message: 'Received (email disabled).' });
  } catch (err: any) {
    console.error('[quote] Failed to handle request', err);
    return NextResponse.json({ error: err.message || 'Failed to submit quote.' }, { status: 500 });
  }
}


