import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendContactEmail } from '@/lib/emailService';

type ContactPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  inquiryType?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const contactRecipients = process.env.SUPPORT_EMAIL || process.env.SALES_EMAIL || process.env.ADMIN_EMAIL;

let cachedClient: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (cachedClient) return cachedClient;
  if (!supabaseUrl || !supabaseAnon) {
    throw new Error('Supabase environment variables are not set.');
  }
  cachedClient = createClient(supabaseUrl, supabaseAnon);
  return cachedClient;
}

const contactBuckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS = 5;

function getIp(req: Request) {
  const header = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
  return header?.split(',')[0].trim() || 'unknown';
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const bucket = contactBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    contactBuckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (bucket.count >= MAX_REQUESTS) {
    return true;
  }
  bucket.count += 1;
  return false;
}

export async function POST(req: Request) {
  try {
    const ip = getIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many submissions. Please try again shortly.' }, { status: 429 });
    }

    const body = (await req.json()) as ContactPayload;
    const name = [body.firstName, body.lastName].filter(Boolean).join(' ').trim() || 'Customer';
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const message = body.message?.trim();
    const subject = body.subject?.trim();
    const inquiryType = body.inquiryType?.trim();

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required.' }, { status: 400 });
    }

    const composedMessage = [subject ? `Subject: ${subject}` : null, inquiryType ? `Inquiry Type: ${inquiryType}` : null, message]
      .filter(Boolean)
      .join('\n\n');

    const now = new Date().toISOString();
    const supabase = getSupabase();
    const { error } = await supabase.from('contact_messages').insert([
      {
        name,
        email,
        phone,
        message: composedMessage,
        created_at: now,
      },
    ] as any);

    if (error) {
      console.error('[contact] Failed to persist submission', error);
      return NextResponse.json({ error: 'Failed to record message.' }, { status: 500 });
    }

    try {
      await sendContactEmail(
        {
          name,
          email,
          phone,
          message: composedMessage,
          createdAt: now,
          subject,
          inquiryType,
        },
        contactRecipients
      );
    } catch (mailErr) {
      console.error('[contact] Failed to dispatch email', mailErr);
    }

    return NextResponse.json({ ok: true, message: 'Thanks for reaching out. We will respond shortly.' });
  } catch (err: any) {
    console.error('[contact] Failed to handle request', err);
    return NextResponse.json({ error: err.message || 'Failed to submit message.' }, { status: 500 });
  }
}
