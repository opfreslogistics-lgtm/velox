type Row = { label: string; value: string };

const brandRed = '#D40511';
const brandOrange = '#F59E0B';
const textColor = '#1F2937';

const baseStyles = `
  body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background: #f3f4f6; color: ${textColor}; }
  .wrapper { max-width: 640px; margin: 0 auto; padding: 32px 16px; }
  .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.06); }
  .header { background: linear-gradient(135deg, ${brandRed} 0%, ${brandOrange} 100%); color: #fff; padding: 28px 32px; }
  .title { margin: 0; font-size: 24px; letter-spacing: -0.02em; }
  .subtitle { margin: 6px 0 0; opacity: 0.9; }
  .content { padding: 28px 32px 16px; background: #f9fafb; }
  .rows { display: grid; grid-template-columns: 1fr; gap: 12px; }
  .row { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px; }
  .row-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin: 0 0 6px; }
  .row-value { margin: 0; font-weight: 700; color: ${textColor}; }
  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-weight: 700; background: rgba(212,5,17,0.08); color: ${brandRed}; }
  .muted { color: #6b7280; margin: 0; }
  .footer { padding: 20px 32px 28px; background: #fff; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
  .actions { margin-top: 20px; }
  .button { display: inline-block; padding: 12px 20px; background: ${brandRed}; color: #fff !important; text-decoration: none; border-radius: 10px; font-weight: 700; letter-spacing: 0.01em; }
`;

function wrapTemplate({
  title,
  subtitle,
  intro,
  rows,
  action,
}: {
  title: string;
  subtitle?: string;
  intro?: string;
  rows: Row[];
  action?: { label: string; url: string };
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
              <h1 class="title">${title}</h1>
              ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
            </div>
            <div class="content">
              ${intro ? `<p class="muted" style="margin: 0 0 16px;">${intro}</p>` : ''}
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
              <p class="muted">This is an automated notification from Velox Logistics.</p>
              <p class="muted">For assistance, reply to this email or contact our support team.</p>
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

export function shipmentCreatedEmailTemplate(payload: {
  trackingNumber: string;
  senderName: string;
  recipientName: string;
  status: string;
  route: string;
  createdAt?: string;
}) {
  const rows: Row[] = [
    { label: 'Tracking Number', value: payload.trackingNumber },
    { label: 'Route', value: payload.route },
    { label: 'Sender', value: payload.senderName },
    { label: 'Recipient', value: payload.recipientName },
    { label: 'Status', value: payload.status },
    { label: 'Created', value: formatDate(payload.createdAt) },
  ];

  return {
    subject: `Shipment Created • ${payload.trackingNumber}`,
    html: wrapTemplate({
      title: 'Shipment created',
      subtitle: 'Velox Logistics',
      intro: 'Your shipment has been scheduled successfully. You can track progress at any time using the tracking number below.',
      rows,
      action: { label: 'Track shipment', url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/tracking?ref=${encodeURIComponent(payload.trackingNumber)}` },
    }),
  };
}

export function shipmentUpdatedEmailTemplate(payload: {
  trackingNumber: string;
  route: string;
  oldStatus: string;
  newStatus: string;
  updatedAt?: string;
}) {
  const rows: Row[] = [
    { label: 'Tracking Number', value: payload.trackingNumber },
    { label: 'Route', value: payload.route },
    { label: 'Previous Status', value: `<span class="badge">${payload.oldStatus}</span>` },
    { label: 'New Status', value: `<span class="badge" style="background: rgba(20,184,166,0.12); color: #0f766e;">${payload.newStatus}</span>` },
    { label: 'Updated At', value: formatDate(payload.updatedAt) },
  ];

  return {
    subject: `Shipment Update • ${payload.trackingNumber}`,
    html: wrapTemplate({
      title: 'Shipment updated',
      subtitle: 'Status change recorded',
      intro: 'We have an update on your shipment. Details are below.',
      rows,
      action: { label: 'View live tracking', url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/tracking?ref=${encodeURIComponent(payload.trackingNumber)}` },
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


