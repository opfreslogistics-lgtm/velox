type Row = { label: string; value: string };

const brandRed = '#D40511';
const brandOrange = '#F59E0B';
const brandTeal = '#0f766e';
const textColor = '#1F2937';
const supportEmail = process.env.SUPPORT_EMAIL || 'support@veloxlogistics.com';

// Simple inline “logo” so emails look branded even without external assets
const brandMark = `
  <div class="brand">
    <div class="logo">
      <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="14" fill="url(#grad)" />
        <path d="M14 42.5L28.5 18h8.2L50 42.5h-8.9l-3-5.6H25.9l-3 5.6H14zm17.3-12.9h6.2l-3.1-5.8-3.1 5.8z" fill="white" />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stop-color="${brandRed}"/>
            <stop offset="1" stop-color="${brandOrange}"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div class="brand-text">
      <span class="brand-name">Velox Logistics</span>
      <span class="brand-tagline">Fast. Tracked. Reliable.</span>
    </div>
  </div>
`;

const baseStyles = `
  body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background: #f3f4f6; color: ${textColor}; }
  .wrapper { max-width: 760px; margin: 0 auto; padding: 32px 16px; }
  .card { background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 22px 60px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; }
  .header { background: linear-gradient(135deg, ${brandRed} 0%, ${brandOrange} 100%); color: #fff; padding: 28px 32px; display: flex; align-items: center; gap: 16px; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .logo { width: 42px; height: 42px; border-radius: 12px; background: rgba(255,255,255,0.12); display: grid; place-items: center; }
  .brand-text { display: flex; flex-direction: column; }
  .brand-name { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; }
  .brand-tagline { font-size: 12px; opacity: 0.85; }
  .title { margin: 0; font-size: 24px; letter-spacing: -0.02em; }
  .subtitle { margin: 6px 0 0; opacity: 0.9; font-size: 14px; }
  .hero { padding: 20px 32px 0; background: linear-gradient(180deg, rgba(212,5,17,0.04), rgba(0,0,0,0)); }
  .pill { display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; font-weight: 600; color: ${textColor}; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
  .content { padding: 18px 32px 8px; background: #f9fafb; }
  .rows { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
  .row { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px; }
  .row-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin: 0 0 6px; }
  .row-value { margin: 0; font-weight: 700; color: ${textColor}; }
  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-weight: 700; background: rgba(212,5,17,0.08); color: ${brandRed}; }
  .badge-success { background: rgba(16,185,129,0.12); color: #047857; }
  .badge-warn { background: rgba(245,158,11,0.12); color: #b45309; }
  .muted { color: #6b7280; margin: 0; }
  .footer { padding: 20px 32px 28px; background: #fff; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
  .actions { margin-top: 22px; text-align: center; }
  .button { display: inline-block; padding: 12px 20px; background: ${brandRed}; color: #fff !important; text-decoration: none; border-radius: 10px; font-weight: 700; letter-spacing: 0.01em; box-shadow: 0 12px 30px rgba(212,5,17,0.22); }
  .status-card { background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-top: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
  .status-title { margin: 0 0 8px; font-size: 15px; color: ${textColor}; display: flex; align-items: center; gap: 8px; }
  .tip { margin: 0; color: #111827; font-weight: 700; }
  .note { margin: 6px 0 0; color: #6b7280; }
  .grid-two { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-top: 10px; }
  .meta { display: flex; flex-direction: column; gap: 6px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px; }
  .meta strong { color: #111827; }
  .meta span { color: #4b5563; }
`;

function wrapTemplate({
  title,
  subtitle,
  intro,
  rows,
  action,
  statusCardHtml,
}: {
  title: string;
  subtitle?: string;
  intro?: string;
  rows: Row[];
  action?: { label: string; url: string };
  statusCardHtml?: string;
}) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="wrapper">
          <div class="card">
            <div class="header">
              ${brandMark}
              <div>
                <h1 class="title">${title}</h1>
                ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
              </div>
            </div>
            <div class="hero">
              <div class="pill">
                <span style="font-size:12px; color:#6b7280;">Powered by</span>
                <span style="font-weight:800;">Velox Logistics</span>
              </div>
            </div>
            <div class="content">
              ${intro ? `<p class="muted" style="margin: 0 0 16px;">${intro}</p>` : ''}
              ${statusCardHtml || ''}
              <div class="rows">
                ${rows
                  .map(
                    (row) => `
                      <div class="row">
                        <p class="row-label">${row.label}</p>
                        <p class="row-value">${row.value}</p>
                      </div>
                    `
                  )
                  .join('')}
              </div>
              ${
                action
                  ? `<div class="actions"><a class="button" href="${action.url}" target="_blank" rel="noopener noreferrer">${action.label}</a></div>`
                  : ''
              }
            </div>
            <div class="footer">
              <p class="muted" style="margin-bottom:4px;">This is an automated notification from Velox Logistics.</p>
              <p class="muted" style="margin-bottom:4px;">Need help? Email <a href="mailto:${supportEmail}" style="color:${brandRed}; text-decoration:none;">${supportEmail}</a></p>
              <p class="muted">Thank you for shipping with us.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function formatDate(value?: string | Date) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

const STATUS_COPY: Record<
  string,
  { title: string; tip: string; tone: 'info' | 'warn' | 'success' }
> = {
  'Pending': { title: 'We received your order.', tip: 'We are preparing your shipment details.', tone: 'info' },
  'Awaiting Payment': { title: 'Payment required.', tip: 'Complete payment to start processing.', tone: 'warn' },
  'Payment Confirmed': { title: 'Payment confirmed.', tip: 'Processing will start shortly.', tone: 'info' },
  'Processing': { title: 'We are packing your order.', tip: 'Labels are being prepared.', tone: 'info' },
  'Ready for Pickup': { title: 'Ready for pickup.', tip: 'Driver will collect soon.', tone: 'info' },
  'Driver En Route': { title: 'Driver is on the way.', tip: 'Keep your phone nearby for updates.', tone: 'info' },
  'Picked Up': { title: 'Package picked up.', tip: 'In hand and heading to origin facility.', tone: 'info' },
  'At Warehouse': { title: 'At warehouse.', tip: 'Queued for the next leg of the journey.', tone: 'info' },
  'In Transit': { title: 'In transit.', tip: 'Moving to the next facility.', tone: 'info' },
  'Departed Facility': { title: 'Departed facility.', tip: 'On the road to the next stop.', tone: 'info' },
  'Arrived at Facility': { title: 'Arrived at facility.', tip: 'Sorting for the next transfer.', tone: 'info' },
  'Out for Delivery': { title: 'Out for delivery.', tip: 'Expect delivery today. Keep phone reachable.', tone: 'info' },
  'Delivered': { title: 'Delivered successfully!', tip: 'Thank you for choosing Velox Logistics.', tone: 'success' },
  'Delivery Attempted': { title: 'Delivery attempted.', tip: 'We will re-attempt or contact you.', tone: 'warn' },
  'Returned to Sender': { title: 'Returned to sender.', tip: 'Contact support to reschedule.', tone: 'warn' },
  'Cancelled': { title: 'Shipment cancelled.', tip: 'Reach out if this is unexpected.', tone: 'warn' },
  'On Hold': { title: 'Shipment on hold.', tip: 'We will notify you once it resumes.', tone: 'warn' },
  'Delayed': { title: 'Shipment delayed.', tip: 'We are expediting the next leg.', tone: 'warn' },
  'Weather Delay': { title: 'Weather delay.', tip: 'Safety first—new ETA will follow.', tone: 'warn' },
  'Address Issue': { title: 'Address issue.', tip: 'Please confirm the delivery address.', tone: 'warn' },
  'Customs Hold': { title: 'Customs hold.', tip: 'Awaiting clearance. We will notify you.', tone: 'warn' },
  'Inspection Required': { title: 'Inspection in progress.', tip: 'We will share findings soon.', tone: 'warn' },
  'Payment Verification Required': { title: 'Payment verification needed.', tip: 'Please verify payment details.', tone: 'warn' },
  'Lost Package': { title: 'Package reported lost.', tip: 'Support will reach out with options.', tone: 'warn' },
  'Damaged Package': { title: 'Package reported damaged.', tip: 'Support will coordinate a resolution.', tone: 'warn' },
};

function statusCard(status: string, eta?: string, location?: string) {
  const copy = STATUS_COPY[status] || {
    title: status,
    tip: 'We are monitoring this shipment.',
    tone: 'info',
  };
  const toneClass =
    copy.tone === 'success' ? 'badge-success' : copy.tone === 'warn' ? 'badge-warn' : '';

  return `
    <div class="status-card">
      <p class="status-title">
        <span class="badge ${toneClass}">${status}</span>
      </p>
      <p class="tip">${copy.title}</p>
      <p class="note">${copy.tip}</p>
      ${
        eta
          ? `<p class="muted" style="margin-top:10px;"><strong>Estimated delivery:</strong> ${eta}</p>`
          : ''
      }
      ${
        location
          ? `<p class="muted" style="margin-top:6px;"><strong>Last location:</strong> ${location}</p>`
          : ''
      }
    </div>
  `;
}

export function shipmentCreatedEmailTemplate(payload: {
  trackingNumber: string;
  senderName: string;
  senderEmail?: string;
  recipientName: string;
  recipientEmail?: string;
  status: string;
  route: string;
  createdAt?: string;
}) {
  const badge =
    payload.status === 'Delivered'
      ? `<span class="badge badge-success">${payload.status}</span>`
      : `<span class="badge">${payload.status}</span>`;

  const rows: Row[] = [
    { label: 'Tracking Number', value: payload.trackingNumber },
    { label: 'Route', value: payload.route },
    { label: 'Sender', value: payload.senderName },
    ...(payload.senderEmail ? [{ label: 'Sender Email', value: payload.senderEmail }] : []),
    { label: 'Recipient', value: payload.recipientName },
    ...(payload.recipientEmail ? [{ label: 'Recipient Email', value: payload.recipientEmail }] : []),
    { label: 'Status', value: payload.status },
    { label: 'Created', value: formatDate(payload.createdAt) },
  ];

  return {
    subject: `Shipment Created • ${payload.trackingNumber}`,
    html: wrapTemplate({
      title: 'Your shipment is booked',
      subtitle: 'Velox Logistics • Real-time updates included',
      intro: `We have registered your shipment. You and the receiver will get updates at every key milestone. Current status: ${badge}`,
      rows,
      action: {
        label: 'Track shipment',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/tracking?ref=${encodeURIComponent(payload.trackingNumber)}`,
      },
    }),
  };
}

export function shipmentUpdatedEmailTemplate(payload: {
  trackingNumber: string;
  route: string;
  oldStatus: string;
  newStatus: string;
  updatedAt?: string;
  currentLocation?: string;
  estimatedDelivery?: string;
}) {
  const statusHtml = statusCard(payload.newStatus, payload.estimatedDelivery, payload.currentLocation);

  const rows: Row[] = [
    { label: 'Tracking Number', value: payload.trackingNumber },
    { label: 'Route', value: payload.route },
    { label: 'Previous Status', value: `<span class="badge">${payload.oldStatus}</span>` },
    { label: 'New Status', value: `<span class="badge" style="background: rgba(20,184,166,0.12); color: #0f766e;">${payload.newStatus}</span>` },
    { label: 'Updated At', value: formatDate(payload.updatedAt) },
    ...(payload.estimatedDelivery
      ? [{ label: 'ETA', value: payload.estimatedDelivery }]
      : []),
    ...(payload.currentLocation
      ? [{ label: 'Latest Location', value: payload.currentLocation }]
      : []),
  ];

  return {
    subject: `Shipment Update • ${payload.trackingNumber} • ${payload.newStatus}`,
    html: wrapTemplate({
      title: 'Shipment updated',
      subtitle: 'Fresh status update from Velox Logistics',
      intro: 'Here is the latest movement on your shipment.',
      rows,
      action: {
        label: 'View live tracking',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/tracking?ref=${encodeURIComponent(payload.trackingNumber)}`,
      },
    }),
  };
}

export function contactEmailTemplate(payload: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: string;
  subject?: string;
  inquiryType?: string;
}) {
  const rows: Row[] = [
    { label: 'Name', value: payload.name },
    { label: 'Email', value: payload.email },
    { label: 'Phone', value: payload.phone || 'Not provided' },
    { label: 'Received', value: formatDate(payload.createdAt) },
    ...(payload.subject ? [{ label: 'Subject', value: payload.subject }] : []),
    ...(payload.inquiryType ? [{ label: 'Inquiry Type', value: payload.inquiryType }] : []),
    { label: 'Message', value: payload.message.replace(/\n/g, '<br/>') },
  ];

  return {
    subject: `New Contact Message • ${payload.name}`,
    html: wrapTemplate({
      title: 'New contact inquiry',
      subtitle: 'Website contact form',
      intro: 'A new contact form submission was received. Please reply directly to the sender.',
      rows,
    }),
  };
}


