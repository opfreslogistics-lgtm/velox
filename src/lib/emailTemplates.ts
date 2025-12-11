type Row = { label: string; value: string };

const brandRed = '#e02828';
const brandGray = '#1a1a1a';
const lightGray = '#f3f3f3';
const supportEmail = process.env.SUPPORT_EMAIL || 'support@veloxlogistics.com';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://veloxlogistics.com';
const logoUrl =
  'https://lasenhevaefulhabxqar.supabase.co/storage/v1/object/public/website-images/emaillogo.png';

type TemplateResult = {
  subject: string;
  html: string;
  text: string;
  preview: string;
  variables: string[];
};

const baseStyles = `
  /* Core reset */
  body { margin: 0; padding: 0; background: ${lightGray}; color: ${brandGray}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
  a { color: ${brandRed}; text-decoration: none; }
  /* Layout */
  .wrapper { width: 100%; background: ${lightGray}; padding: 24px 12px; }
  .container { max-width: 720px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #ececec; }
  .inner { padding: 24px 28px; }
  .center { text-align: center; }
  .logo { width: 160px; margin: 0 auto 16px; }
  .heading { font-size: 22px; font-weight: 800; margin: 8px 0 4px; color: ${brandGray}; }
  .subheading { font-size: 14px; margin: 0; color: #4b4b4b; }
  .divider { height: 1px; background: #e9e9e9; margin: 18px 0; }
  /* Cards */
  .card { background: #ffffff; border: 1px solid #e9e9e9; border-radius: 14px; padding: 18px; box-shadow: 0 12px 32px rgba(0,0,0,0.04); }
  .card + .card { margin-top: 14px; }
  .card-title { margin: 0 0 8px; font-size: 16px; font-weight: 800; color: ${brandGray}; }
  .card-desc { margin: 0 0 12px; color: #4b4b4b; font-size: 14px; }
  /* Highlight */
  .highlight { display: flex; gap: 12px; align-items: center; }
  .highlight-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(224,40,40,0.1); display: grid; place-items: center; font-size: 22px; }
  /* Details grid */
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
  .row-label { text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px; color: #666; margin: 0 0 4px; }
  .row-value { margin: 0; font-weight: 700; color: ${brandGray}; font-size: 14px; }
  /* Agent */
  .agent { display: grid; grid-template-columns: 72px 1fr; gap: 12px; align-items: center; }
  .agent img { width: 72px; height: 72px; border-radius: 14px; object-fit: cover; border: 1px solid #e9e9e9; }
  .agent-meta { font-size: 13px; color: #4b4b4b; }
  .btn { display: inline-block; padding: 10px 16px; border-radius: 12px; background: ${brandRed}; color: #fff; font-weight: 700; font-size: 14px; box-shadow: 0 12px 24px rgba(224,40,40,0.22); }
  .btn-secondary { background: #f7f7f7; color: ${brandGray}; border: 1px solid #e6e6e6; box-shadow: none; }
  .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
  /* Progress */
  .steps { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .step { display: inline-flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 12px; background: #f8f8f8; border: 1px solid #ececec; font-size: 13px; }
  .step.active { background: rgba(224,40,40,0.1); border-color: rgba(224,40,40,0.3); font-weight: 700; color: ${brandRed}; }
  .progress-wrap { margin-top: 10px; }
  .progress-bar { width: 100%; background: #efefef; border-radius: 999px; height: 10px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, ${brandRed}, #f87171); border-radius: 999px; }
  /* Footer */
  .footer { text-align: center; font-size: 12px; color: #666; padding: 18px; }
  .social { display: inline-flex; gap: 10px; margin: 8px 0; }
  .social a { width: 32px; height: 32px; border-radius: 50%; background: #f5f5f5; display: inline-grid; place-items: center; border: 1px solid #e6e6e6; }
  /* Responsive */
  @media (max-width: 520px) {
    .inner { padding: 18px; }
    .card { padding: 16px; }
    .agent { grid-template-columns: 1fr; text-align: left; }
    .actions { flex-direction: column; }
    .btn, .btn-secondary { text-align: center; width: 100%; }
  }
`;

function wrapTemplate({
  title,
  greeting,
  intro,
  highlight,
  details,
  agent,
  steps,
  actions,
  previewText,
}: {
  title: string;
  greeting: string;
  intro: string;
  highlight: { icon: string; label: string; description: string };
  details: Row[];
  agent: {
    photo?: string;
    name?: string;
    id?: string;
    phone?: string;
    email?: string;
    shift?: string;
    department?: string;
  };
  steps: { label: string; active: boolean }[];
  actions: { label: string; url: string; primary?: boolean }[];
  previewText: string;
}): { html: string; text: string } {
  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => s.active)
  );
  const progressPct = Math.round(((activeIndex + 1) / steps.length) * 100);

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="inner center">
              <img src="${logoUrl}" alt="Velox Logistics" class="logo" />
              <div class="heading">${title}</div>
              <p class="subheading">${previewText}</p>
            </div>
            <div class="divider"></div>
            <div class="inner">
              <p style="margin:0 0 8px; font-size:14px;">Hello ${greeting},</p>
              <p style="margin:0 0 16px; font-size:14px; color:#4b4b4b;">${intro}</p>

              <div class="card highlight">
                <div class="highlight-icon">${highlight.icon}</div>
                <div>
                  <div class="card-title">${highlight.label}</div>
                  <div class="card-desc">${highlight.description}</div>
                </div>
              </div>

              <div class="card" style="margin-top:14px;">
                <div class="card-title">Shipment Details</div>
                <div class="grid">
                  ${details
                    .map(
                      (row) => `
                        <div>
                          <p class="row-label">${row.label}</p>
                          <p class="row-value">${row.value}</p>
                        </div>
                      `
                    )
                    .join('')}
                </div>
              </div>

              <div class="card" style="margin-top:14px;">
                <div class="card-title">Assigned Agent</div>
                <div class="agent">
                  <img src="${agent.photo || `${siteUrl}/agent-placeholder.png`}" alt="${agent.name || 'Agent'}" />
                  <div>
                    <p class="row-value" style="margin:0 0 6px;">${agent.name || 'Assigned Agent'}</p>
                    <p class="agent-meta" style="margin:0;">ID: ${agent.id || '—'}</p>
                    <p class="agent-meta" style="margin:0;">Phone: ${agent.phone || '—'}</p>
                    <p class="agent-meta" style="margin:0;">Email: ${agent.email || '—'}</p>
                    <p class="agent-meta" style="margin:6px 0 0;">Shift: ${agent.shift || '—'} · Dept: ${agent.department || '—'}</p>
                    <div class="actions" style="margin-top:10px;">
                      <a class="btn-secondary" href="tel:${agent.phone || ''}">Call</a>
                      <a class="btn-secondary" href="mailto:${agent.email || supportEmail}">Email</a>
                      <a class="btn" href="mailto:${agent.email || supportEmail}">Contact Agent</a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card" style="margin-top:14px;">
                <div class="card-title">Progress</div>
                <div class="steps">
                  ${steps
                    .map(
                      (step) => `
                        <div class="step ${step.active ? 'active' : ''}">
                          ${step.active ? '●' : '○'} ${step.label}
                        </div>
                      `
                    )
                    .join('')}
                </div>
                <div class="progress-wrap">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width:${progressPct}%;"></div>
                  </div>
                  <p style="margin:8px 0 0; font-size:12px; color:#4b4b4b;">${progressPct}% complete</p>
                </div>
              </div>

              <div class="card" style="margin-top:14px;">
                <div class="card-title">Next steps</div>
                <div class="actions">
                  ${actions
                    .map(
                      (action) =>
                        `<a class="${action.primary ? 'btn' : 'btn-secondary'}" href="${action.url}" target="_blank" rel="noopener noreferrer">${action.label}</a>`
                    )
                    .join('')}
                </div>
              </div>
            </div>
            <div class="divider"></div>
            <div class="footer">
              <div class="social">
                <a href="${siteUrl}"><span style="font-size:14px;">🌐</span></a>
                <a href="https://facebook.com"><span style="font-size:14px;">f</span></a>
                <a href="https://instagram.com"><span style="font-size:14px;">♛</span></a>
                <a href="https://linkedin.com"><span style="font-size:14px;">in</span></a>
              </div>
              <p style="margin:6px 0;">Velox Logistics — Global Delivery Solutions</p>
              <p style="margin:0;">123 Velocity Way, Suite 500, Global City</p>
              <p style="margin:6px 0;"><a href="${siteUrl}/unsubscribe">Unsubscribe</a></p>
              <p style="margin:6px 0;">© ${new Date().getFullYear()} Velox Logistics. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const text =
    `${title}\n\n` +
    `${previewText}\n\n` +
    `Hello ${greeting},\n` +
    `${intro}\n\n` +
    `${highlight.label}: ${highlight.description}\n` +
    `Tracking details:\n` +
    details.map((d) => `- ${d.label}: ${d.value.replace(/<[^>]+>/g, '')}`).join('\n') +
    `\n\nAgent:\n` +
    `- Name: ${agent.name || 'Assigned Agent'}\n` +
    `- ID: ${agent.id || '—'}\n` +
    `- Phone: ${agent.phone || '—'}\n` +
    `- Email: ${agent.email || '—'}\n` +
    `- Shift: ${agent.shift || '—'} · Dept: ${agent.department || '—'}\n\n` +
    `Progress: ${progressPct}%\n` +
    `Steps: ${steps.map((s) => `${s.active ? '*' : '-'} ${s.label}`).join(', ')}\n\n` +
    `Actions:\n${actions.map((a) => `- ${a.label}: ${a.url}`).join('\n')}\n\n` +
    `Support: ${supportEmail}`;

  return { html, text };
}

function formatDate(value?: string | Date) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

const STATUS_COPY: Record<string, { title: string; tip: string; icon: string }> = {
  Pending: { title: 'We received your order.', tip: 'We are preparing your shipment details.', icon: '🕒' },
  'Awaiting Payment': { title: 'Payment required.', tip: 'Complete payment to start processing.', icon: '💳' },
  'Payment Confirmed': { title: 'Payment confirmed.', tip: 'Processing will start shortly.', icon: '✅' },
  Processing: { title: 'We are packing your order.', tip: 'Labels are being prepared.', icon: '📦' },
  'Ready for Pickup': { title: 'Ready for pickup.', tip: 'Driver will collect soon.', icon: '🚚' },
  'Driver En Route': { title: 'Driver is on the way.', tip: 'Keep your phone nearby for updates.', icon: '🛣️' },
  'Picked Up': { title: 'Package picked up.', tip: 'In hand and heading to origin facility.', icon: '📍' },
  'At Warehouse': { title: 'At warehouse.', tip: 'Queued for the next leg of the journey.', icon: '🏢' },
  'In Transit': { title: 'In transit.', tip: 'Moving to the next facility.', icon: '🚚' },
  'Departed Facility': { title: 'Departed facility.', tip: 'On the road to the next stop.', icon: '➡️' },
  'Arrived at Facility': { title: 'Arrived at facility.', tip: 'Sorting for the next transfer.', icon: '🏬' },
  'Out for Delivery': { title: 'Out for delivery.', tip: 'Expect delivery today.', icon: '📦' },
  Delivered: { title: 'Delivered successfully!', tip: 'Thank you for choosing Velox.', icon: '🎉' },
  'Delivery Attempted': { title: 'Delivery attempted.', tip: 'We will re-attempt or contact you.', icon: '⚠️' },
  'Returned to Sender': { title: 'Returned to sender.', tip: 'Contact support to reschedule.', icon: '↩️' },
  Cancelled: { title: 'Shipment cancelled.', tip: 'Reach out if this is unexpected.', icon: '⛔' },
  'On Hold': { title: 'Shipment on hold.', tip: 'We will notify you once it resumes.', icon: '⏸️' },
  Delayed: { title: 'Shipment delayed.', tip: 'We are expediting the next leg.', icon: '⌛' },
  'Weather Delay': { title: 'Weather delay.', tip: 'Safety first—new ETA will follow.', icon: '🌧️' },
  'Address Issue': { title: 'Address issue.', tip: 'Please confirm the delivery address.', icon: '📮' },
  'Customs Hold': { title: 'Customs hold.', tip: 'Awaiting clearance.', icon: '🛃' },
  'Inspection Required': { title: 'Inspection in progress.', tip: 'We will share findings soon.', icon: '🔍' },
  'Payment Verification Required': { title: 'Payment verification needed.', tip: 'Please verify payment details.', icon: '💳' },
  'Lost Package': { title: 'Package reported lost.', tip: 'Support will reach out with options.', icon: '❓' },
  'Damaged Package': { title: 'Package reported damaged.', tip: 'Support will coordinate a resolution.', icon: '🛠️' },
};

const PROGRESS_STEPS = ['Shipment Created', 'Picked Up', 'In Transit', 'Customs', 'Out for Delivery', 'Delivered'];

function buildProgress(currentStatus: string) {
  const normalized = currentStatus.toLowerCase();
  let activeIndex = 0;
  if (normalized.includes('delivered')) activeIndex = 5;
  else if (normalized.includes('out for delivery')) activeIndex = 4;
  else if (normalized.includes('customs')) activeIndex = 3;
  else if (normalized.includes('transit') || normalized.includes('en route')) activeIndex = 2;
  else if (normalized.includes('picked')) activeIndex = 1;
  else activeIndex = 0;

  return PROGRESS_STEPS.map((label, idx) => ({ label, active: idx === activeIndex }));
}

export function shipmentCreatedEmailTemplate(payload: {
  trackingNumber: string;
  referenceCode?: string;
  senderName: string;
  senderEmail?: string;
  recipientName: string;
  recipientEmail?: string;
  status: string;
  route: string;
  createdAt?: string;
  shipmentType?: string;
  weight?: string | number;
  origin?: string;
  destination?: string;
  currentLocation?: string;
  timestamp?: string;
  agent?: {
    photo?: string;
    name?: string;
    id?: string;
    phone?: string;
    email?: string;
    shift?: string;
    department?: string;
  };
}): TemplateResult {
  const statusCopy = STATUS_COPY[payload.status] || { title: payload.status, tip: 'We are monitoring your shipment.', icon: '📦' };
  const { html, text } = wrapTemplate({
    title: 'Shipment Created',
    greeting: payload.senderName || 'there',
    intro: 'Thanks for choosing Velox Logistics. Below are your shipping updates.',
    highlight: {
      icon: statusCopy.icon,
      label: `Shipment Status: ${payload.status}`,
      description: statusCopy.tip,
    },
    details: [
      { label: 'Tracking Number', value: payload.trackingNumber },
      ...(payload.referenceCode ? [{ label: 'Reference Code', value: payload.referenceCode }] : []),
      ...(payload.shipmentType ? [{ label: 'Shipment Type', value: payload.shipmentType }] : []),
      ...(payload.weight ? [{ label: 'Package Weight', value: `${payload.weight}` }] : []),
      ...(payload.origin ? [{ label: 'Origin', value: payload.origin }] : []),
      ...(payload.destination ? [{ label: 'Destination', value: payload.destination }] : []),
      ...(payload.currentLocation ? [{ label: 'Current Location', value: payload.currentLocation }] : []),
      { label: 'Current Status', value: payload.status },
      { label: 'Timestamp', value: formatDate(payload.timestamp || payload.createdAt) },
    ],
    agent: {
      photo: payload.agent?.photo,
      name: payload.agent?.name,
      id: payload.agent?.id,
      phone: payload.agent?.phone,
      email: payload.agent?.email,
      shift: payload.agent?.shift,
      department: payload.agent?.department,
    },
    steps: buildProgress(payload.status),
    actions: [
      { label: 'Track Shipment', url: `${siteUrl}/tracking?ref=${encodeURIComponent(payload.trackingNumber)}`, primary: true },
      { label: 'Contact Support', url: `mailto:${supportEmail}` },
      { label: 'Download Invoice', url: `${siteUrl}/invoices?ref=${encodeURIComponent(payload.trackingNumber)}` },
    ],
    previewText: `Shipment ${payload.trackingNumber} created — status ${payload.status}`,
  });

  return {
    subject: `Shipment Created • ${payload.trackingNumber}`,
    html,
    text,
    preview: `Shipment ${payload.trackingNumber} created • ${payload.status}`,
    variables: [
      'customer_name',
      'tracking_number',
      'reference_code',
      'type',
      'weight',
      'origin',
      'destination',
      'current_location',
      'current_status',
      'timestamp',
      'agent_photo_url',
      'agent_name',
      'agent_id',
      'agent_phone',
      'agent_email',
      'agent_shift',
      'agent_department',
    ],
  };
}

export function shipmentUpdatedEmailTemplate(payload: {
  trackingNumber: string;
  referenceCode?: string;
  route: string;
  oldStatus: string;
  newStatus: string;
  updatedAt?: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  origin?: string;
  destination?: string;
  shipmentType?: string;
  weight?: string | number;
  agent?: {
    photo?: string;
    name?: string;
    id?: string;
    phone?: string;
    email?: string;
    shift?: string;
    department?: string;
  };
}): TemplateResult {
  const statusCopy = STATUS_COPY[payload.newStatus] || { title: payload.newStatus, tip: 'We are monitoring your shipment.', icon: '🚚' };
  const { html, text } = wrapTemplate({
    title: 'Shipment Updated',
    greeting: 'there',
    intro: 'Here is the latest movement on your shipment.',
    highlight: {
      icon: statusCopy.icon,
      label: `Shipment Status: ${payload.newStatus}`,
      description: statusCopy.tip,
    },
    details: [
      { label: 'Tracking Number', value: payload.trackingNumber },
      ...(payload.referenceCode ? [{ label: 'Reference Code', value: payload.referenceCode }] : []),
      ...(payload.shipmentType ? [{ label: 'Shipment Type', value: payload.shipmentType }] : []),
      ...(payload.weight ? [{ label: 'Package Weight', value: `${payload.weight}` }] : []),
      ...(payload.origin ? [{ label: 'Origin', value: payload.origin }] : []),
      ...(payload.destination ? [{ label: 'Destination', value: payload.destination }] : []),
      ...(payload.currentLocation ? [{ label: 'Current Location', value: payload.currentLocation }] : []),
      { label: 'Previous Status', value: payload.oldStatus },
      { label: 'Current Status', value: payload.newStatus },
      ...(payload.estimatedDelivery ? [{ label: 'ETA', value: payload.estimatedDelivery }] : []),
      { label: 'Timestamp', value: formatDate(payload.updatedAt) },
    ],
    agent: {
      photo: payload.agent?.photo,
      name: payload.agent?.name,
      id: payload.agent?.id,
      phone: payload.agent?.phone,
      email: payload.agent?.email,
      shift: payload.agent?.shift,
      department: payload.agent?.department,
    },
    steps: buildProgress(payload.newStatus),
    actions: [
      { label: 'Track Shipment', url: `${siteUrl}/tracking?ref=${encodeURIComponent(payload.trackingNumber)}`, primary: true },
      { label: 'Contact Support', url: `mailto:${supportEmail}` },
      { label: 'Download Invoice', url: `${siteUrl}/invoices?ref=${encodeURIComponent(payload.trackingNumber)}` },
    ],
    previewText: `Shipment ${payload.trackingNumber} updated • ${payload.newStatus}`,
  });

  return {
    subject: `Shipment Update • ${payload.trackingNumber} • ${payload.newStatus}`,
    html,
    text,
    preview: `Shipment ${payload.trackingNumber} updated • ${payload.newStatus}`,
    variables: [
      'customer_name',
      'tracking_number',
      'reference_code',
      'type',
      'weight',
      'origin',
      'destination',
      'current_location',
      'current_status',
      'timestamp',
      'agent_photo_url',
      'agent_name',
      'agent_id',
      'agent_phone',
      'agent_email',
      'agent_shift',
      'agent_department',
    ],
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

  const { html, text } = wrapTemplate({
    title: 'New Contact Inquiry',
    greeting: payload.name || 'there',
    intro: 'A new contact form submission was received. Please reply directly to the sender.',
    highlight: {
      icon: '✉️',
      label: 'New contact message',
      description: payload.subject || 'Website contact form',
    },
    details: rows,
    agent: {
      email: payload.email,
      phone: payload.phone,
    },
    steps: PROGRESS_STEPS.map((label, idx) => ({ label, active: idx === 0 })),
    actions: [
      { label: 'Reply via Email', url: `mailto:${payload.email}`, primary: true },
      { label: 'Call Sender', url: payload.phone ? `tel:${payload.phone}` : `mailto:${payload.email}` },
    ],
    previewText: `New contact from ${payload.name}`,
  });

  return {
    subject: `New Contact Message • ${payload.name}`,
    html,
    text,
    preview: `Contact from ${payload.name}`,
    variables: ['name', 'email', 'phone', 'message', 'subject', 'inquiryType', 'createdAt'],
  };
}


