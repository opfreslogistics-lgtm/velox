const brandRed = '#e02828';
const brandBlack = '#000000';
const brandGray = '#1a1a1a';
const lightGray = '#f5f5f5';
const white = '#ffffff';
const brandYellow = '#FFD700';
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

const STATUS_COPY: Record<string, { title: string; tip: string; icon: string }> = {
  Pending: { title: 'We received your order.', tip: 'We are preparing your shipment details.', icon: '⏰' },
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

// Standard progress steps (fixed steps 1, 2, 4)
const STANDARD_STEPS = [
  { label: 'Picked Up', icon: '📍' },
  { label: 'In Transit', icon: '🚚' },
  { label: 'Out for Delivery', icon: '📦' }, // Default step 3, can be replaced
  { label: 'Delivered', icon: '✅' },
];

// Standard statuses that use the default progress steps
const STANDARD_STATUSES = ['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];

/**
 * Builds the progress steps array dynamically based on current status
 * Rule: Always show 4 steps. If status is not standard, replace step 3 with current status
 */
function buildProgressSteps(currentStatus: string): Array<{ label: string; icon: string }> {
  const normalizedStatus = currentStatus.trim();
  const isStandardStatus = STANDARD_STATUSES.some(standard => 
    normalizedStatus.toLowerCase() === standard.toLowerCase()
  );

  // If status is standard, use default steps
  if (isStandardStatus) {
    return STANDARD_STEPS;
  }

  // If status is not standard, replace step 3 with current status
  const statusCopy = STATUS_COPY[currentStatus] || { 
    title: currentStatus, 
    tip: 'We are monitoring your shipment.', 
    icon: '📦' 
  };

  return [
    STANDARD_STEPS[0], // Picked Up
    STANDARD_STEPS[1], // In Transit
    { label: currentStatus, icon: statusCopy.icon }, // Dynamic step 3
    STANDARD_STEPS[3], // Delivered
  ];
}

function getProgressStepIndex(status: string, progressSteps: Array<{ label: string; icon: string }>): number {
  const normalized = status.toLowerCase().trim();
  
  // Check for Delivered (always step 4/index 3)
  if (normalized.includes('delivered')) return 3;
  
  // Check for Out for Delivery (step 3/index 2) - but only if it's actually in the steps
  if (normalized.includes('out for delivery')) {
    const step3Label = progressSteps[2]?.label.toLowerCase() || '';
    if (step3Label.includes('out for delivery')) {
      return 2;
    }
  }
  
  // Check for In Transit (step 2/index 1)
  if (normalized.includes('transit') || normalized.includes('en route') || 
      normalized.includes('departed') || normalized.includes('arrived') ||
      normalized.includes('at warehouse')) return 1;
  
  // Check for Picked Up (step 1/index 0)
  if (normalized.includes('picked')) return 0;
  
  // If status is not standard and replaced step 3, check if current status matches step 3
  // This handles cases like "On Hold", "Delayed", etc. that replace step 3
  const step3Label = progressSteps[2]?.label.toLowerCase().trim() || '';
  if (step3Label === normalized || step3Label.includes(normalized) || normalized.includes(step3Label)) {
    return 2;
  }
  
  // Default to first step
  return 0;
}

function buildEmailTemplate(data: ShipmentData, isUpdate: boolean = false): { html: string; text: string } {
  const statusCopy = STATUS_COPY[data.status] || { title: data.status, tip: 'We are monitoring your shipment.', icon: '📦' };
  const recipientName = data.recipientName || 'Valued Customer';
  
  // Build dynamic progress steps based on current status
  const progressSteps = buildProgressSteps(data.status);
  const progressStep = getProgressStepIndex(data.status, progressSteps);
  const progressPercent = Math.round(((progressStep + 1) / progressSteps.length) * 100);
  
  // Agent photo with fallback
  const agentPhoto = data.agent?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.agent?.name || 'Agent')}&size=120&background=${brandRed.replace('#', '')}&color=ffffff&bold=true&format=png`;

  const html = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>${isUpdate ? 'Shipment Update' : 'Shipment Created'} • ${data.trackingNumber}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .mobile-full-width { width: 100% !important; }
      .mobile-padding { padding: 20px 15px !important; }
      .mobile-center { text-align: center !important; }
      .mobile-block { display: block !important; width: 100% !important; }
      .mobile-spacer { height: 15px !important; }
      .mobile-button { width: 100% !important; margin: 5px 0 !important; display: block !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${lightGray}; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <!-- Wrapper Table -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0; background-color: ${lightGray};">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <!-- Main Container Table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin: 0 auto; background-color: ${white}; border-radius: 0;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: ${brandBlack}; padding: 40px 20px; text-align: center;">
              <img src="${logoUrl}" alt="Velox Logistics" width="180" height="auto" style="display: block; margin: 0 auto; max-width: 180px; height: auto;" />
            </td>
          </tr>
          
          <!-- Welcome Section -->
          <tr>
            <td class="mobile-padding" style="background-color: ${white}; padding: 30px 25px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 0 0 12px 0;">
                    <h1 style="margin: 0; padding: 0; font-size: 22px; font-weight: bold; color: ${brandGray}; line-height: 1.3; font-family: Arial, Helvetica, sans-serif;">
                      Hello ${recipientName}, your shipment update is here!
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0;">
                    <p style="margin: 0; padding: 0; font-size: 14px; color: #666666; line-height: 1.6; font-family: Arial, Helvetica, sans-serif;">
                      ${isUpdate 
                        ? `We have an update on your shipment. ${statusCopy.tip}` 
                        : `Thank you for choosing Velox Logistics! Your shipment has been created and is being processed. ${statusCopy.tip}`}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Shipment Summary Card -->
          <tr>
            <td class="mobile-padding" style="padding: 0 25px 25px 25px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${lightGray}; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 30px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 0 0 20px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 0 0 5px 0;">
                                <p style="margin: 0; padding: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #999999; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Shipment Number</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 0;">
                                <p style="margin: 0; padding: 0; font-size: 16px; font-weight: bold; color: ${brandGray}; font-family: Arial, Helvetica, sans-serif;">
                                  <span style="color: ${brandRed}; margin-right: 6px; font-size: 14px;">📋</span>${data.trackingNumber}
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 20px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 0 0 5px 0;">
                                <p style="margin: 0; padding: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #999999; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Status</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 0;">
                                <p style="margin: 0; padding: 0; font-size: 15px; font-weight: bold; color: ${brandGray}; font-family: Arial, Helvetica, sans-serif;">
                                  <span style="color: ${brandRed}; margin-right: 6px; font-size: 16px;">${statusCopy.icon}</span>${data.status}
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      ${data.deliveryDate || data.estimatedDelivery ? `
                      <tr>
                        <td style="padding: 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 0 0 5px 0;">
                                <p style="margin: 0; padding: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #999999; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Expected Delivery</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 0;">
                                <p style="margin: 0; padding: 0; font-size: 15px; font-weight: bold; color: ${brandGray}; font-family: Arial, Helvetica, sans-serif;">
                                  <span style="color: ${brandYellow}; margin-right: 6px; font-size: 16px;">📅</span>${formatDate(data.deliveryDate || data.estimatedDelivery)}
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Sender & Receiver Cards -->
          <tr>
            <td class="mobile-padding" style="padding: 0 25px 25px 25px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <!-- Sender Card -->
                  <td class="mobile-full-width mobile-block" width="48%" valign="top" style="background-color: ${white}; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 0 0 15px 0; border-bottom: 2px solid ${brandRed};">
                          <h2 style="margin: 0; padding: 0 0 12px 0; font-size: 15px; font-weight: bold; color: ${brandGray}; font-family: Arial, Helvetica, sans-serif;">
                            Sender Information
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 0 0;">
                          <p style="margin: 0; padding: 0 0 10px 0; font-size: 13px; color: #333333; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">
                            <span style="color: ${brandRed}; margin-right: 6px; font-size: 12px;">👤</span><strong style="color: ${brandGray}; font-size: 12px;">Name:</strong> <span style="font-size: 12px;">${data.senderName || '—'}</span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px 0;">
                          <p style="margin: 0; padding: 0; font-size: 13px; color: #333333; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">
                            <span style="color: ${brandRed}; margin-right: 6px; font-size: 12px;">✉️</span><strong style="color: ${brandGray}; font-size: 12px;">Email:</strong> <span style="font-size: 12px;">${data.senderEmail || '—'}</span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px 0;">
                          <p style="margin: 0; padding: 0; font-size: 13px; color: #333333; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">
                            <span style="color: ${brandRed}; margin-right: 6px; font-size: 12px;">📞</span><strong style="color: ${brandGray}; font-size: 12px;">Phone:</strong> <span style="font-size: 12px;">${data.senderPhone || '—'}</span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0;">
                          <p style="margin: 0; padding: 0; font-size: 13px; color: #333333; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">
                            <span style="color: ${brandRed}; margin-right: 6px; font-size: 12px;">📍</span><strong style="color: ${brandGray}; font-size: 12px;">Address:</strong> <span style="font-size: 12px;">${data.senderAddress || '—'}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <!-- Spacer -->
                  <td class="mobile-spacer" width="4%" style="height: 20px;"></td>
                  <!-- Receiver Card -->
                  <td class="mobile-full-width mobile-block" width="48%" valign="top" style="background-color: ${white}; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 0 0 15px 0; border-bottom: 2px solid ${brandRed};">
                          <h2 style="margin: 0; padding: 0 0 12px 0; font-size: 15px; font-weight: bold; color: ${brandGray}; font-family: Arial, Helvetica, sans-serif;">
                            Receiver Information
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 0 0;">
                          <p style="margin: 0; padding: 0 0 10px 0; font-size: 13px; color: #333333; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">
                            <span style="color: ${brandRed}; margin-right: 6px; font-size: 12px;">👤</span><strong style="color: ${brandGray}; font-size: 12px;">Name:</strong> <span style="font-size: 12px;">${data.recipientName || '—'}</span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px 0;">
                          <p style="margin: 0; padding: 0; font-size: 13px; color: #333333; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">
                            <span style="color: ${brandRed}; margin-right: 6px; font-size: 12px;">✉️</span><strong style="color: ${brandGray}; font-size: 12px;">Email:</strong> <span style="font-size: 12px;">${data.recipientEmail || '—'}</span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px 0;">
                          <p style="margin: 0; padding: 0; font-size: 13px; color: #333333; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">
                            <span style="color: ${brandRed}; margin-right: 6px; font-size: 12px;">📞</span><strong style="color: ${brandGray}; font-size: 12px;">Phone:</strong> <span style="font-size: 12px;">${data.recipientPhone || '—'}</span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0;">
                          <p style="margin: 0; padding: 0; font-size: 13px; color: #333333; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">
                            <span style="color: ${brandRed}; margin-right: 6px; font-size: 12px;">📍</span><strong style="color: ${brandGray}; font-size: 12px;">Address:</strong> <span style="font-size: 12px;">${data.recipientAddress || '—'}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          ${data.agent && (data.agent.name || data.agent.email || data.agent.phone) ? `
          <!-- Assigned Agent Section -->
          <tr>
            <td class="mobile-padding" style="padding: 0 25px 25px 25px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${lightGray}; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 30px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 0 0 15px 0;">
                          <h2 style="margin: 0; padding: 0; font-size: 16px; font-weight: bold; color: ${brandGray}; font-family: Arial, Helvetica, sans-serif;">Assigned Agent</h2>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td width="120" valign="top" style="padding: 0 20px 0 0;">
                                <img src="${agentPhoto}" alt="${data.agent.name || 'Agent'}" width="100" height="100" style="display: block; width: 100px; height: 100px; border-radius: 50%; border: 3px solid ${brandRed}; object-fit: cover; background-color: ${brandRed};" />
                              </td>
                              <td valign="top">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="padding: 0 0 8px 0;">
                                      <p style="margin: 0; padding: 0; font-size: 15px; font-weight: bold; color: ${brandGray}; font-family: Arial, Helvetica, sans-serif;">${data.agent.name || 'Assigned Agent'}</p>
                                    </td>
                                  </tr>
                                  ${data.agent.phone ? `
                                  <tr>
                                    <td style="padding: 0 0 6px 0;">
                                      <p style="margin: 0; padding: 0; font-size: 13px; color: #666666; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">
                                        <span style="color: ${brandRed}; margin-right: 6px; font-size: 12px;">📞</span>${data.agent.phone}
                                      </p>
                                    </td>
                                  </tr>
                                  ` : ''}
                                  ${data.agent.email ? `
                                  <tr>
                                    <td style="padding: 0;">
                                      <p style="margin: 0; padding: 0; font-size: 13px; color: #666666; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">
                                        <span style="color: ${brandRed}; margin-right: 6px; font-size: 12px;">✉️</span>${data.agent.email}
                                      </p>
                                    </td>
                                  </tr>
                                  ` : ''}
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}
          
          <!-- Shipment Progress Section -->
          <tr>
            <td class="mobile-padding" style="padding: 0 25px 25px 25px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 0 0 20px 0; text-align: center;">
                    <h2 style="margin: 0; padding: 0; font-size: 16px; font-weight: bold; color: ${brandGray}; font-family: Arial, Helvetica, sans-serif;">Shipment Progress</h2>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        ${progressSteps.map((step, index) => {
                          const isActive = index === progressStep;
                          const isCompleted = index < progressStep;
                          const stepColor = isActive || isCompleted ? brandRed : '#cccccc';
                          const stepBg = isActive || isCompleted ? `${brandRed}20` : '#f0f0f0';
                          return `
                            <td width="25%" align="center" valign="top" style="padding: 0 5px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td align="center" style="padding: 0 0 8px 0;">
                                    <div style="width: 42px; height: 42px; border-radius: 50%; background-color: ${stepBg}; display: inline-block; line-height: 42px; text-align: center; border: 2px solid ${stepColor};">
                                      <span style="font-size: 18px; color: ${stepColor}; vertical-align: middle;">${step.icon}</span>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" style="padding: 0;">
                                    <p style="margin: 0; padding: 0; font-size: 10px; color: ${isActive || isCompleted ? brandGray : '#999999'}; font-weight: ${isActive || isCompleted ? 'bold' : 'normal'}; font-family: Arial, Helvetica, sans-serif; line-height: 1.3;">${step.label}</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          `;
                        }).join('')}
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0 10px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #e0e0e0; border-radius: 4px; height: 8px;">
                      <tr>
                        <td width="${progressPercent}%" style="background-color: ${brandRed}; border-radius: 4px; height: 8px;"></td>
                        <td width="${100 - progressPercent}%"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 0;">
                    <p style="margin: 0; padding: 0; font-size: 12px; color: #666666; font-family: Arial, Helvetica, sans-serif;">${progressPercent}% Complete</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Additional Notes & Actions -->
          <tr>
            <td class="mobile-padding" style="padding: 0 25px 25px 25px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 0 0 20px 0;">
                    <p style="margin: 0; padding: 0; font-size: 12px; color: #666666; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">
                      <strong style="color: ${brandGray}; font-size: 12px;">Important:</strong> <span style="font-size: 12px;">Please ensure someone is available to receive the package at the delivery address. You can track your shipment in real-time using the tracking number above.</span>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td class="mobile-button" style="padding: 0 8px 0 0;">
                          <a href="${siteUrl}/tracking?ref=${encodeURIComponent(data.trackingNumber)}" style="display: inline-block; padding: 12px 24px; background-color: ${brandRed}; color: ${white}; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; box-shadow: 0 3px 6px rgba(224,40,40,0.3);">
                            🔍 Track Shipment
                          </a>
                        </td>
                        <td class="mobile-button">
                          <a href="mailto:${supportEmail}" style="display: inline-block; padding: 12px 24px; background-color: ${brandYellow}; color: ${brandGray}; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; border: 1px solid #e0e0e0;">
                            💬 Contact Support
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Help Section -->
          <tr>
            <td class="mobile-padding" style="padding: 0 25px 25px 25px; border-top: 1px solid #e0e0e0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 20px 0 0 0;">
                    <p style="margin: 0; padding: 0; font-size: 12px; color: #666666; font-family: Arial, Helvetica, sans-serif;">
                      Need help? Contact us at <a href="mailto:${supportEmail}" style="color: ${brandRed}; font-weight: bold; text-decoration: none; font-size: 12px;">${supportEmail}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: ${brandRed}; padding: 40px 30px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 0 0 12px 0;">
                    <p style="margin: 0; padding: 0; font-size: 16px; font-weight: bold; color: ${white}; font-family: Arial, Helvetica, sans-serif;">Velox Logistics</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 18px 0;">
                    <p style="margin: 0; padding: 0; font-size: 12px; color: ${white}; line-height: 1.6; font-family: Arial, Helvetica, sans-serif;">
                      Global Delivery Solutions<br>
                      Email: <a href="mailto:${supportEmail}" style="color: ${white}; text-decoration: underline; font-size: 12px;">${supportEmail}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 20px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="padding: 0 5px;">
                          <a href="${siteUrl}" style="display: inline-block; width: 40px; height: 40px; line-height: 40px; background-color: rgba(255,255,255,0.2); border-radius: 50%; text-align: center; text-decoration: none; color: ${white}; font-size: 18px;">🌐</a>
                        </td>
                        <td style="padding: 0 5px;">
                          <a href="https://facebook.com" style="display: inline-block; width: 40px; height: 40px; line-height: 40px; background-color: rgba(255,255,255,0.2); border-radius: 50%; text-align: center; text-decoration: none; color: ${white}; font-size: 18px;">f</a>
                        </td>
                        <td style="padding: 0 5px;">
                          <a href="https://instagram.com" style="display: inline-block; width: 40px; height: 40px; line-height: 40px; background-color: rgba(255,255,255,0.2); border-radius: 50%; text-align: center; text-decoration: none; color: ${white}; font-size: 18px;">📷</a>
                        </td>
                        <td style="padding: 0 5px;">
                          <a href="https://linkedin.com" style="display: inline-block; width: 40px; height: 40px; line-height: 40px; background-color: rgba(255,255,255,0.2); border-radius: 50%; text-align: center; text-decoration: none; color: ${white}; font-size: 18px;">in</a>
                        </td>
                        <td style="padding: 0 5px;">
                          <a href="https://twitter.com" style="display: inline-block; width: 40px; height: 40px; line-height: 40px; background-color: rgba(255,255,255,0.2); border-radius: 50%; text-align: center; text-decoration: none; color: ${white}; font-size: 18px;">🐦</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0;">
                    <p style="margin: 0; padding: 0; font-size: 12px; color: rgba(255,255,255,0.9); font-family: Arial, Helvetica, sans-serif; line-height: 1.6;">
                      © ${new Date().getFullYear()} Velox Logistics. All rights reserved.<br>
                      <a href="${siteUrl}/unsubscribe" style="color: rgba(255,255,255,0.8); text-decoration: underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
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
${progressSteps.map((step, index) => {
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
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Inquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${lightGray}; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${lightGray}; padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: ${white}; border-radius: 0;">
          <tr>
            <td style="background-color: ${brandBlack}; padding: 20px; text-align: center;">
              <h2 style="margin: 0; color: ${white}; font-family: Arial, Helvetica, sans-serif;">New Contact Inquiry</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 15px 0; font-size: 14px; color: #333; font-family: Arial, Helvetica, sans-serif;"><strong>Name:</strong> ${payload.name}</p>
              <p style="margin: 0 0 15px 0; font-size: 14px; color: #333; font-family: Arial, Helvetica, sans-serif;"><strong>Email:</strong> ${payload.email}</p>
              ${payload.phone ? `<p style="margin: 0 0 15px 0; font-size: 14px; color: #333; font-family: Arial, Helvetica, sans-serif;"><strong>Phone:</strong> ${payload.phone}</p>` : ''}
              ${payload.subject ? `<p style="margin: 0 0 15px 0; font-size: 14px; color: #333; font-family: Arial, Helvetica, sans-serif;"><strong>Subject:</strong> ${payload.subject}</p>` : ''}
              ${payload.inquiryType ? `<p style="margin: 0 0 15px 0; font-size: 14px; color: #333; font-family: Arial, Helvetica, sans-serif;"><strong>Inquiry Type:</strong> ${payload.inquiryType}</p>` : ''}
              <p style="margin: 0 0 15px 0; font-size: 14px; color: #333; font-family: Arial, Helvetica, sans-serif;"><strong>Message:</strong></p>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #333; line-height: 1.6; font-family: Arial, Helvetica, sans-serif;">${payload.message.replace(/\n/g, '<br>')}</p>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #666; font-family: Arial, Helvetica, sans-serif;"><strong>Received:</strong> ${formatDate(payload.createdAt)}</p>
              <a href="mailto:${payload.email}" style="display: inline-block; padding: 10px 20px; background-color: ${brandRed}; color: ${white}; text-decoration: none; border-radius: 5px; font-family: Arial, Helvetica, sans-serif;">Reply via Email</a>
            </td>
          </tr>
          <tr>
            <td style="background-color: ${brandRed}; padding: 20px; text-align: center;">
              <p style="margin: 0; color: ${white}; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">Velox Logistics</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
