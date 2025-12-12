import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject = 'Test Email from Sand Global Express' } = body;

    if (!to) {
      return NextResponse.json({ 
        error: 'Email address (to) is required',
        success: false 
      }, { status: 400 });
    }

    console.log('[test-email] Attempting to send test email to:', to);

    await sendEmail({
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D40511;">Test Email</h1>
          <p>This is a test email from Sand Global Express.</p>
          <p>If you received this, your email configuration is working correctly!</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    console.log('[test-email] Test email sent successfully to:', to);

    return NextResponse.json({ 
      success: true, 
      message: `Test email sent successfully to ${to}`,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[test-email] Failed to send test email:', err);
    return NextResponse.json({ 
      success: false,
      error: err.message || 'Failed to send test email',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}

