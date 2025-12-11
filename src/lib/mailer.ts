import nodemailer from 'nodemailer';

type Recipient = string | undefined | null;

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser;

let transporter: nodemailer.Transporter | null = null;

function assertMailerEnv() {
  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error('SMTP configuration is missing. Set SMTP_HOST, SMTP_USER, SMTP_PASS (and optionally SMTP_PORT/SMTP_FROM).');
  }
}

async function getTransporter() {
  if (transporter) return transporter;
  assertMailerEnv();
  
  console.log('[mailer] Creating transporter with config:', {
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    user: smtpUser,
    hasPass: !!smtpPass,
  });
  
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { 
      user: smtpUser, 
      pass: smtpPass 
    },
    // Add connection timeout and better error handling
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    // For Gmail and other services
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  });
  
  // Verify connection
  try {
    await transporter.verify();
    console.log('[mailer] SMTP connection verified successfully');
  } catch (verifyErr: any) {
    console.error('[mailer] SMTP verification failed:', {
      error: verifyErr.message,
      code: verifyErr.code,
      command: verifyErr.command,
      response: verifyErr.response,
    });
    transporter = null; // Reset so it tries again next time
    throw new Error(`SMTP connection failed: ${verifyErr.message}`);
  }
  
  return transporter;
}

function normalizeRecipients(recipients: Recipient | Recipient[]): string[] {
  const list = Array.isArray(recipients) ? recipients : [recipients];
  return Array.from(new Set(list.filter(Boolean).map((email) => String(email).trim()).filter(Boolean)));
}

export async function sendEmail(options: {
  to: Recipient | Recipient[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  cc?: Recipient | Recipient[];
  bcc?: Recipient | Recipient[];
  headers?: Record<string, string>;
}) {
  console.log('[mailer] sendEmail called', {
    to: options.to,
    subject: options.subject,
    hasSMTP: !!(smtpHost && smtpUser && smtpPass),
    smtpHost: smtpHost ? `${smtpHost}:${smtpPort}` : 'NOT SET',
  });

  const to = normalizeRecipients(options.to);
  const cc = options.cc ? normalizeRecipients(options.cc) : [];
  const bcc = options.bcc ? normalizeRecipients(options.bcc) : [];

  console.log('[mailer] Normalized recipients', { to, cc, bcc });

  if (!to.length && !cc.length && !bcc.length) {
    const error = new Error('No email recipients were provided.');
    console.error('[mailer]', error.message);
    throw error;
  }

  try {
    const transport = await getTransporter();
    console.log('[mailer] Transporter ready, sending email...', {
      from: smtpFrom,
      to: to,
      subject: options.subject,
    });

    const mailOptions = {
      from: smtpFrom,
      to: to.join(', '),
      cc: cc.length ? cc.join(', ') : undefined,
      bcc: bcc.length ? bcc.join(', ') : undefined,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Auto-generate text from HTML
      replyTo: options.replyTo,
      headers: options.headers,
    };

    console.log('[mailer] Sending mail with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasHtml: !!mailOptions.html,
      hasText: !!mailOptions.text,
    });

    const result = await transport.sendMail(mailOptions);

    console.log('[mailer] ✅ Email sent successfully!', {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response,
      to: to.join(', '),
    });

    // Verify that email was actually accepted
    if (result.rejected && result.rejected.length > 0) {
      console.error('[mailer] ⚠️ Some recipients were rejected:', result.rejected);
      throw new Error(`Email rejected for recipients: ${result.rejected.join(', ')}`);
    }

    if (!result.messageId) {
      console.warn('[mailer] ⚠️ No messageId returned, email may not have been sent');
    }

    return result;
  } catch (err: any) {
    console.error('[mailer] ❌ Failed to send email', {
      error: err.message || String(err),
      code: err.code,
      command: err.command,
      response: err.response,
      responseCode: err.responseCode,
      stack: err.stack,
    });
    // Re-throw with more context
    throw new Error(`Email sending failed: ${err.message || String(err)}`);
  }
}

export function getDefaultNotificationRecipients(): string[] {
  return normalizeRecipients([
    process.env.SUPPORT_EMAIL,
    process.env.SALES_EMAIL,
    process.env.ADMIN_EMAIL,
    smtpFrom,
  ]);
}


