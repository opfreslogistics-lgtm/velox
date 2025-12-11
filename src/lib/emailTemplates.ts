const brandRed = '#e02828';
const brandBlack = '#000000';
const brandGray = '#1a1a1a';
const lightGray = '#f3f3f3';
const white = '#ffffff';
const supportEmail = process.env.SUPPORT_EMAIL || 'support@veloxlogistics.com';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://veloxlogistics.com';
const logoUrl = 'https://lasenhevaefulhabxqar.supabase.co/storage/v1/object/public/website-images/logo.png';

type TemplateResult = {
  subject: string;
  html: string;
  text: string;
  preview: string;
  variables: string[];
};

type ShipmentData = {
  trackingNumber: string;
  status: string;
  deliveryDate?: string;
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  senderAddress?: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientAddress?: string;
  agent?: {
    photo?: string;
    name?: string;
    phone?: string;
    email?: string;
  };
  shipmentType?: string;
  weight?: string | number;
  origin?: string;
  destination?: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  createdAt?: string;
  updatedAt?: string;
  oldStatus?: string;
};

function formatDate(value?: string | Date) {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function formatAddress(parts: {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}): string {
  const addressParts: string[] = [];
  if (parts.line1) addressParts.push(parts.line1);
  if (parts.line2) addressParts.push(parts.line2);
  if (parts.city) addressParts.push(parts.city);
  if (parts.state) addressParts.push(parts.state);
  if (parts.postalCode) addressParts.push(parts.postalCode);
  if (parts.country) addressParts.push(parts.country);
  return addressParts.length > 0 ? addressParts.join(', ') : '—';
}

const STATUS_COPY: Record<string, { title: string; tip: string; icon: string }> = {
  Pending: { title: 'We received your order.', tip: 'We are preparing your shipment details.', icon: 'fa-clock' },
  'Awaiting Payment': { title: 'Payment required.', tip: 'Complete payment to start processing.', icon: 'fa-credit-card' },
  'Payment Confirmed': { title: 'Payment confirmed.', tip: 'Processing will start shortly.', icon: 'fa-check-circle' },
  Processing: { title: 'We are packing your order.', tip: 'Labels are being prepared.', icon: 'fa-box' },
  'Ready for Pickup': { title: 'Ready for pickup.', tip: 'Driver will collect soon.', icon: 'fa-truck' },
  'Driver En Route': { title: 'Driver is on the way.', tip: 'Keep your phone nearby for updates.', icon: 'fa-route' },
  'Picked Up': { title: 'Package picked up.', tip: 'In hand and heading to origin facility.', icon: 'fa-map-marker-alt' },
  'At Warehouse': { title: 'At warehouse.', tip: 'Queued for the next leg of the journey.', icon: 'fa-warehouse' },
  'In Transit': { title: 'In transit.', tip: 'Moving to the next facility.', icon: 'fa-truck' },
  'Departed Facility': { title: 'Departed facility.', tip: 'On the road to the next stop.', icon: 'fa-arrow-right' },
  'Arrived at Facility': { title: 'Arrived at facility.', tip: 'Sorting for the next transfer.', icon: 'fa-building' },
  'Out for Delivery': { title: 'Out for delivery.', tip: 'Expect delivery today.', icon: 'fa-shipping-fast' },
  Delivered: { title: 'Delivered successfully!', tip: 'Thank you for choosing Velox.', icon: 'fa-check-circle' },
  'Delivery Attempted': { title: 'Delivery attempted.', tip: 'We will re-attempt or contact you.', icon: 'fa-exclamation-triangle' },
  'Returned to Sender': { title: 'Returned to sender.', tip: 'Contact support to reschedule.', icon: 'fa-undo' },
  Cancelled: { title: 'Shipment cancelled.', tip: 'Reach out if this is unexpected.', icon: 'fa-ban' },
  'On Hold': { title: 'Shipment on hold.', tip: 'We will notify you once it resumes.', icon: 'fa-pause-circle' },
  Delayed: { title: 'Shipment delayed.', tip: 'We are expediting the next leg.', icon: 'fa-hourglass-half' },
  'Weather Delay': { title: 'Weather delay.', tip: 'Safety first—new ETA will follow.', icon: 'fa-cloud-rain' },
  'Address Issue': { title: 'Address issue.', tip: 'Please confirm the delivery address.', icon: 'fa-map-marked-alt' },
  'Customs Hold': { title: 'Customs hold.', tip: 'Awaiting clearance.', icon: 'fa-passport' },
  'Inspection Required': { title: 'Inspection in progress.', tip: 'We will share findings soon.', icon: 'fa-search' },
  'Payment Verification Required': { title: 'Payment verification needed.', tip: 'Please verify payment details.', icon: 'fa-credit-card' },
  'Lost Package': { title: 'Package reported lost.', tip: 'Support will reach out with options.', icon: 'fa-question-circle' },
  'Damaged Package': { title: 'Package reported damaged.', tip: 'Support will coordinate a resolution.', icon: 'fa-tools' },
};

const PROGRESS_STEPS = [
  { label: 'Picked Up', icon: 'fa-map-marker-alt' },
  { label: 'In Transit', icon: 'fa-truck' },
  { label: 'Out for Delivery', icon: 'fa-shipping-fast' },
  { label: 'Delivered', icon: 'fa-check-circle' },
];

function getProgressStepIndex(status: string): number {
  const normalized = status.toLowerCase();
  if (normalized.includes('delivered')) return 3;
  if (normalized.includes('out for delivery')) return 2;
  if (normalized.includes('transit') || normalized.includes('en route') || normalized.includes('departed') || normalized.includes('arrived')) return 1;
  if (normalized.includes('picked')) return 0;
  return 0;
}

function buildEmailTemplate(data: ShipmentData, isUpdate: boolean = false): { html: string; text: string } {
  const statusCopy = STATUS_COPY[data.status] || { title: data.status, tip: 'We are monitoring your shipment.', icon: 'fa-box' };
  const recipientName = data.recipientName || 'Valued Customer';
  const progressStep = getProgressStepIndex(data.status);
  const progressPercent = Math.round(((progressStep + 1) / PROGRESS_STEPS.length) * 100);

  const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${isUpdate ? 'Shipment Update' : 'Shipment Created'} • ${data.trackingNumber}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { margin: 0; padding: 0; background-color: ${lightGray}; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    a { text-decoration: none; color: ${brandRed}; }
    
    .email-wrapper { width: 100%; background-color: ${lightGray}; padding: 20px 0; }
    .email-container { max-width: 720px; margin: 0 auto; background-color: ${white}; border-radius: 0; }
    
    /* Header */
    .email-header { background-color: ${brandBlack}; padding: 40px 20px; text-align: center; }
    .email-header img { max-width: 200px; height: auto; display: block; margin: 0 auto; }
    
    /* Welcome Section */
    .welcome-section { background-color: ${white}; padding: 40px 30px; }
    .welcome-heading { font-size: 28px; font-weight: bold; color: ${brandGray}; margin: 0 0 10px; line-height: 1.3; }
    .welcome-heading i { color: ${brandRed}; margin-right: 10px; }
    .welcome-text { font-size: 16px; color: #666666; line-height: 1.6; margin: 0; }
    
    /* Shipment Summary Card */
    .summary-card { background-color: ${lightGray}; border-radius: 8px; padding: 30px; margin: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .summary-item { margin-bottom: 20px; }
    .summary-item:last-child { margin-bottom: 0; }
    .summary-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #666666; margin-bottom: 5px; }
    .summary-value { font-size: 18px; font-weight: bold; color: ${brandGray}; }
    .summary-value i { color: ${brandRed}; margin-right: 8px; }
    
    /* Sender & Receiver Cards */
    .info-cards { padding: 0 30px 30px; }
    .info-cards-table { width: 100%; border-collapse: separate; border-spacing: 20px 0; }
    .info-card { background-color: ${white}; border: 1px solid #e0e0e0; border-radius: 8px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .info-card-title { font-size: 18px; font-weight: bold; color: ${brandGray}; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid ${brandRed}; }
    .info-card-title i { color: ${brandRed}; margin-right: 8px; }
    .info-item { margin-bottom: 15px; font-size: 14px; color: #333333; line-height: 1.6; }
    .info-item:last-child { margin-bottom: 0; }
    .info-item i { color: ${brandRed}; width: 20px; margin-right: 10px; }
    .info-item strong { color: ${brandGray}; }
    
    /* Agent Section */
    .agent-section { background-color: ${lightGray}; padding: 30px; margin: 0 30px 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .agent-title { font-size: 20px; font-weight: bold; color: ${brandGray}; margin-bottom: 20px; }
    .agent-content { display: table; width: 100%; }
    .agent-image-cell { display: table-cell; vertical-align: middle; width: 100px; padding-right: 20px; }
    .agent-image { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid ${brandRed}; }
    .agent-info-cell { display: table-cell; vertical-align: middle; }
    .agent-name { font-size: 18px; font-weight: bold; color: ${brandGray}; margin-bottom: 8px; }
    .agent-detail { font-size: 14px; color: #666666; margin-bottom: 5px; }
    .agent-detail i { color: ${brandRed}; width: 20px; margin-right: 8px; }
    
    /* Progress Section */
    .progress-section { padding: 30px; }
    .progress-title { font-size: 20px; font-weight: bold; color: ${brandGray}; margin-bottom: 25px; text-align: center; }
    .progress-steps { display: table; width: 100%; margin-bottom: 20px; }
    .progress-step { display: table-cell; text-align: center; vertical-align: top; position: relative; }
    .progress-step-icon { width: 50px; height: 50px; border-radius: 50%; background-color: #e0e0e0; display: inline-block; line-height: 50px; color: #999999; font-size: 20px; margin-bottom: 10px; }
    .progress-step.active .progress-step-icon { background-color: ${brandRed}; color: ${white}; }
    .progress-step.completed .progress-step-icon { background-color: ${brandRed}; color: ${white}; }
    .progress-step-label { font-size: 12px; color: #666666; }
    .progress-step.active .progress-step-label { color: ${brandGray}; font-weight: bold; }
    .progress-step.completed .progress-step-label { color: ${brandGray}; font-weight: bold; }
    .progress-bar-container { width: 100%; height: 8px; background-color: #e0e0e0; border-radius: 4px; margin: 20px 0; overflow: hidden; }
    .progress-bar-fill { height: 100%; background-color: ${brandRed}; border-radius: 4px; transition: width 0.3s ease; }
    .progress-text { text-align: center; font-size: 14px; color: #666666; margin-top: 10px; }
    
    /* Notes & Actions */
    .notes-section { padding: 30px; background-color: ${white}; }
    .notes-text { font-size: 14px; color: #666666; line-height: 1.6; margin-bottom: 25px; }
    .action-buttons { text-align: center; }
    .btn { display: inline-block; padding: 14px 30px; margin: 5px; border-radius: 6px; font-size: 16px; font-weight: bold; text-decoration: none; transition: all 0.3s ease; }
    .btn-primary { background-color: ${brandRed}; color: ${white}; box-shadow: 0 4px 8px rgba(224,40,40,0.3); }
    .btn-primary:hover { background-color: #c01f1f; box-shadow: 0 6px 12px rgba(224,40,40,0.4); }
    .btn-secondary { background-color: #f5f5f5; color: ${brandGray}; border: 1px solid #e0e0e0; }
    .btn-secondary:hover { background-color: #e8e8e8; }
    
    /* Footer */
    .email-footer { background-color: ${brandRed}; padding: 40px 30px; text-align: center; }
    .footer-content { color: ${white}; font-size: 14px; line-height: 1.8; }
    .footer-content a { color: ${white}; text-decoration: underline; }
    .footer-company { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
    .footer-contact { margin-bottom: 20px; }
    .social-icons { margin: 20px 0; }
    .social-icons a { display: inline-block; width: 40px; height: 40px; line-height: 40px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 5px; color: ${white}; text-decoration: none; transition: all 0.3s ease; }
    .social-icons a:hover { background-color: rgba(255,255,255,0.3); transform: translateY(-2px); }
    .footer-copyright { font-size: 12px; margin-top: 20px; opacity: 0.9; }
    
    /* Help Section */
    .help-section { background-color: ${white}; padding: 25px 30px; border-top: 1px solid #e0e0e0; }
    .help-text { font-size: 14px; color: #666666; text-align: center; }
    .help-text a { color: ${brandRed}; font-weight: bold; }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .welcome-section, .summary-card, .info-cards, .agent-section, .progress-section, .notes-section, .help-section { padding-left: 20px !important; padding-right: 20px !important; }
      .info-cards-table { border-spacing: 0 !important; }
      .info-card { display: block !important; width: 100% !important; margin-bottom: 20px !important; }
      .agent-content { display: block !important; }
      .agent-image-cell { display: block !important; width: 100% !important; padding-right: 0 !important; text-align: center !important; margin-bottom: 20px !important; }
      .agent-info-cell { display: block !important; }
      .progress-step { display: block !important; width: 100% !important; margin-bottom: 20px !important; }
      .btn { display: block !important; width: 100% !important; margin: 10px 0 !important; }
      .welcome-heading { font-size: 24px !important; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        <img src="${logoUrl}" alt="Velox Logistics" />
      </div>
      
      <!-- Welcome Section -->
      <div class="welcome-section">
        <h1 class="welcome-heading">
          <i class="fas fa-truck"></i>
          Hello ${recipientName}, your shipment update is here!
        </h1>
        <p class="welcome-text">
          ${isUpdate 
            ? `We have an update on your shipment. ${statusCopy.tip}` 
            : `Thank you for choosing Velox Logistics! Your shipment has been created and is being processed. ${statusCopy.tip}`}
        </p>
      </div>
      
      <!-- Shipment Summary Card -->
      <div class="summary-card">
        <div class="summary-item">
          <div class="summary-label">Shipment Number</div>
          <div class="summary-value">
            <i class="fas fa-barcode"></i>
            ${data.trackingNumber}
          </div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Status</div>
          <div class="summary-value">
            <i class="fas ${statusCopy.icon}"></i>
            ${data.status}
          </div>
        </div>
        ${data.deliveryDate || data.estimatedDelivery ? `
        <div class="summary-item">
          <div class="summary-label">Expected Delivery</div>
          <div class="summary-value">
            <i class="fas fa-calendar-alt"></i>
            ${formatDate(data.deliveryDate || data.estimatedDelivery)}
          </div>
        </div>
        ` : ''}
      </div>
      
      <!-- Sender & Receiver Info Cards -->
      <div class="info-cards">
        <table class="info-cards-table">
          <tr>
            <td class="info-card" style="width: 50%;">
              <div class="info-card-title">
                <i class="fas fa-user"></i>
                Sender Information
              </div>
              <div class="info-item">
                <i class="fas fa-user"></i>
                <strong>Name:</strong> ${data.senderName || '—'}
              </div>
              <div class="info-item">
                <i class="fas fa-envelope"></i>
                <strong>Email:</strong> ${data.senderEmail || '—'}
              </div>
              <div class="info-item">
                <i class="fas fa-phone"></i>
                <strong>Phone:</strong> ${data.senderPhone || '—'}
              </div>
              <div class="info-item">
                <i class="fas fa-map-marker-alt"></i>
                <strong>Address:</strong> ${data.senderAddress || '—'}
              </div>
            </td>
            <td class="info-card" style="width: 50%;">
              <div class="info-card-title">
                <i class="fas fa-user-friends"></i>
                Receiver Information
              </div>
              <div class="info-item">
                <i class="fas fa-user"></i>
                <strong>Name:</strong> ${data.recipientName || '—'}
              </div>
              <div class="info-item">
                <i class="fas fa-envelope"></i>
                <strong>Email:</strong> ${data.recipientEmail || '—'}
              </div>
              <div class="info-item">
                <i class="fas fa-phone"></i>
                <strong>Phone:</strong> ${data.recipientPhone || '—'}
              </div>
              <div class="info-item">
                <i class="fas fa-map-marker-alt"></i>
                <strong>Address:</strong> ${data.recipientAddress || '—'}
              </div>
            </td>
          </tr>
        </table>
      </div>
      
      ${data.agent && (data.agent.name || data.agent.email || data.agent.phone) ? `
      <!-- Assigned Agent Section -->
      <div class="agent-section">
        <div class="agent-title">Assigned Agent</div>
        <div class="agent-content">
          <div class="agent-image-cell">
            <img src="${data.agent.photo || `${siteUrl}/agent-placeholder.png`}" alt="${data.agent.name || 'Agent'}" class="agent-image" />
          </div>
          <div class="agent-info-cell">
            <div class="agent-name">${data.agent.name || 'Assigned Agent'}</div>
            ${data.agent.phone ? `
            <div class="agent-detail">
              <i class="fas fa-phone"></i>
              ${data.agent.phone}
            </div>
            ` : ''}
            ${data.agent.email ? `
            <div class="agent-detail">
              <i class="fas fa-envelope"></i>
              ${data.agent.email}
            </div>
            ` : ''}
          </div>
        </div>
      </div>
      ` : ''}
      
      <!-- Shipment Progress Section -->
      <div class="progress-section">
        <div class="progress-title">Shipment Progress</div>
        <div class="progress-steps">
          ${PROGRESS_STEPS.map((step, index) => {
            const isActive = index === progressStep;
            const isCompleted = index < progressStep;
            const stepClass = isActive ? 'active' : isCompleted ? 'completed' : '';
            return `
              <div class="progress-step ${stepClass}">
                <div class="progress-step-icon">
                  <i class="fas ${step.icon}"></i>
                </div>
                <div class="progress-step-label">${step.label}</div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>
        <div class="progress-text">${progressPercent}% Complete</div>
      </div>
      
      <!-- Additional Notes & Actions -->
      <div class="notes-section">
        <p class="notes-text">
          <strong>Important:</strong> Please ensure someone is available to receive the package at the delivery address. 
          You can track your shipment in real-time using the tracking number above.
        </p>
        <div class="action-buttons">
          <a href="${siteUrl}/tracking?ref=${encodeURIComponent(data.trackingNumber)}" class="btn btn-primary">
            <i class="fas fa-search"></i> Track Shipment
          </a>
          <a href="mailto:${supportEmail}" class="btn btn-secondary">
            <i class="fas fa-headset"></i> Contact Support
          </a>
        </div>
      </div>
      
      <!-- Help Section -->
      <div class="help-section">
        <p class="help-text">
          Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>
        </p>
      </div>
      
      <!-- Footer -->
      <div class="email-footer">
        <div class="footer-content">
          <div class="footer-company">Velox Logistics</div>
          <div class="footer-contact">
            Global Delivery Solutions<br>
            Email: <a href="mailto:${supportEmail}">${supportEmail}</a>
          </div>
          <div class="social-icons">
            <a href="${siteUrl}" title="Website"><i class="fas fa-globe"></i></a>
            <a href="https://facebook.com" title="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="https://instagram.com" title="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="https://linkedin.com" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="https://twitter.com" title="Twitter"><i class="fab fa-twitter"></i></a>
          </div>
          <div class="footer-copyright">
            © ${new Date().getFullYear()} Velox Logistics. All rights reserved.<br>
            <a href="${siteUrl}/unsubscribe" style="color: rgba(255,255,255,0.8);">Unsubscribe</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
${isUpdate ? 'Shipment Update' : 'Shipment Created'} • ${data.trackingNumber}

Hello ${recipientName},

${isUpdate 
  ? `We have an update on your shipment. ${statusCopy.tip}` 
  : `Thank you for choosing Velox Logistics! Your shipment has been created and is being processed. ${statusCopy.tip}`}

SHIPMENT DETAILS
Shipment Number: ${data.trackingNumber}
Status: ${data.status}
${data.deliveryDate || data.estimatedDelivery ? `Expected Delivery: ${formatDate(data.deliveryDate || data.estimatedDelivery)}\n` : ''}

SENDER INFORMATION
Name: ${data.senderName || '—'}
Email: ${data.senderEmail || '—'}
Phone: ${data.senderPhone || '—'}
Address: ${data.senderAddress || '—'}

RECEIVER INFORMATION
Name: ${data.recipientName || '—'}
Email: ${data.recipientEmail || '—'}
Phone: ${data.recipientPhone || '—'}
Address: ${data.recipientAddress || '—'}

${data.agent && (data.agent.name || data.agent.email || data.agent.phone) ? `
ASSIGNED AGENT
Name: ${data.agent.name || '—'}
Phone: ${data.agent.phone || '—'}
Email: ${data.agent.email || '—'}
` : ''}

SHIPMENT PROGRESS
${PROGRESS_STEPS.map((step, index) => {
  const isActive = index === progressStep;
  const isCompleted = index < progressStep;
  const marker = isActive ? '●' : isCompleted ? '✓' : '○';
  return `${marker} ${step.label}`;
}).join('\n')}
Progress: ${progressPercent}% Complete

ACTIONS
Track Shipment: ${siteUrl}/tracking?ref=${encodeURIComponent(data.trackingNumber)}
Contact Support: ${supportEmail}

Need help? Contact us at ${supportEmail}

---
Velox Logistics
Global Delivery Solutions
Email: ${supportEmail}
Website: ${siteUrl}

© ${new Date().getFullYear()} Velox Logistics. All rights reserved.
  `.trim();

  return { html, text };
}

export function shipmentCreatedEmailTemplate(payload: {
  trackingNumber: string;
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  senderAddress?: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientAddress?: string;
  status: string;
  route?: string;
  createdAt?: string;
  shipmentType?: string;
  weight?: string | number;
  origin?: string;
  destination?: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  agent?: {
    photo?: string;
    name?: string;
    phone?: string;
    email?: string;
  };
}): TemplateResult {
  const data: ShipmentData = {
    trackingNumber: payload.trackingNumber,
    status: payload.status,
    deliveryDate: payload.estimatedDelivery,
    senderName: payload.senderName,
    senderEmail: payload.senderEmail,
    senderPhone: payload.senderPhone,
    senderAddress: payload.senderAddress,
    recipientName: payload.recipientName,
    recipientEmail: payload.recipientEmail,
    recipientPhone: payload.recipientPhone,
    recipientAddress: payload.recipientAddress,
    agent: payload.agent,
    shipmentType: payload.shipmentType,
    weight: payload.weight,
    origin: payload.origin,
    destination: payload.destination,
    currentLocation: payload.currentLocation,
    estimatedDelivery: payload.estimatedDelivery,
    createdAt: payload.createdAt,
  };

  const { html, text } = buildEmailTemplate(data, false);

  return {
    subject: `Shipment Created • ${payload.trackingNumber}`,
    html,
    text,
    preview: `Shipment ${payload.trackingNumber} created • ${payload.status}`,
    variables: [
      'tracking_number',
      'sender_name',
      'sender_email',
      'sender_phone',
      'sender_address',
      'recipient_name',
      'recipient_email',
      'recipient_phone',
      'recipient_address',
      'status',
      'estimated_delivery',
    ],
  };
}

export function shipmentUpdatedEmailTemplate(payload: {
  trackingNumber: string;
  route?: string;
  oldStatus: string;
  newStatus: string;
  updatedAt?: string;
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  senderAddress?: string;
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientAddress?: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  shipmentType?: string;
  weight?: string | number;
  origin?: string;
  destination?: string;
  agent?: {
    photo?: string;
    name?: string;
    phone?: string;
    email?: string;
  };
}): TemplateResult {
  const data: ShipmentData = {
    trackingNumber: payload.trackingNumber,
    status: payload.newStatus,
    oldStatus: payload.oldStatus,
    deliveryDate: payload.estimatedDelivery,
    senderName: payload.senderName || 'Valued Customer',
    senderEmail: payload.senderEmail,
    senderPhone: payload.senderPhone,
    senderAddress: payload.senderAddress,
    recipientName: payload.recipientName || 'Valued Customer',
    recipientEmail: payload.recipientEmail,
    recipientPhone: payload.recipientPhone,
    recipientAddress: payload.recipientAddress,
    agent: payload.agent,
    shipmentType: payload.shipmentType,
    weight: payload.weight,
    origin: payload.origin,
    destination: payload.destination,
    currentLocation: payload.currentLocation,
    estimatedDelivery: payload.estimatedDelivery,
    updatedAt: payload.updatedAt,
  };

  const { html, text } = buildEmailTemplate(data, true);

  return {
    subject: `Shipment Update • ${payload.trackingNumber} • ${payload.newStatus}`,
    html,
    text,
    preview: `Shipment ${payload.trackingNumber} updated • ${payload.newStatus}`,
    variables: [
      'tracking_number',
      'old_status',
      'new_status',
      'sender_name',
      'sender_email',
      'sender_phone',
      'sender_address',
      'recipient_name',
      'recipient_email',
      'recipient_phone',
      'recipient_address',
      'current_location',
      'estimated_delivery',
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
  // Keep the contact email template simple - it's for admin notifications
  const html = `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: ${brandBlack}; color: ${white}; padding: 20px; text-align: center; }
    .content { background-color: ${white}; padding: 30px; }
    .footer { background-color: ${brandRed}; color: ${white}; padding: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Inquiry</h2>
    </div>
    <div class="content">
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      ${payload.phone ? `<p><strong>Phone:</strong> ${payload.phone}</p>` : ''}
      ${payload.subject ? `<p><strong>Subject:</strong> ${payload.subject}</p>` : ''}
      ${payload.inquiryType ? `<p><strong>Inquiry Type:</strong> ${payload.inquiryType}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${payload.message.replace(/\n/g, '<br>')}</p>
      <p><strong>Received:</strong> ${formatDate(payload.createdAt)}</p>
      <p><a href="mailto:${payload.email}" style="background-color: ${brandRed}; color: ${white}; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reply via Email</a></p>
    </div>
    <div class="footer">
      <p>Velox Logistics</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
New Contact Inquiry

Name: ${payload.name}
Email: ${payload.email}
${payload.phone ? `Phone: ${payload.phone}\n` : ''}
${payload.subject ? `Subject: ${payload.subject}\n` : ''}
${payload.inquiryType ? `Inquiry Type: ${payload.inquiryType}\n` : ''}
Message:
${payload.message}

Received: ${formatDate(payload.createdAt)}

Reply to: ${payload.email}
  `.trim();

  return {
    subject: `New Contact Message • ${payload.name}`,
    html,
    text,
    preview: `Contact from ${payload.name}`,
    variables: ['name', 'email', 'phone', 'message', 'subject', 'inquiryType', 'createdAt'],
  };
}
