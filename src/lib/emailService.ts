import { contactEmailTemplate, shipmentCreatedEmailTemplate, shipmentUpdatedEmailTemplate } from './emailTemplates';
import { getDefaultNotificationRecipients, sendEmail } from './mailer';

type Recipient = string | undefined | null;

export type ShipmentCreatedEmailPayload = {
  trackingNumber: string;
  senderName: string;
  senderEmail?: string;
  recipientName: string;
  recipientEmail?: string;
  status: string;
  route: string;
  createdAt?: string;
};

export type ShipmentUpdatedEmailPayload = {
  trackingNumber: string;
  route: string;
  oldStatus: string;
  newStatus: string;
  updatedAt?: string;
  senderEmail?: string;
  recipientEmail?: string;
};

export type ContactEmailPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: string;
  subject?: string;
  inquiryType?: string;
};

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const trimmed = String(email).trim();
  return trimmed.length > 0 && EMAIL_REGEX.test(trimmed);
}

function normalizeRecipients(recipients: Recipient | Recipient[]): string[] {
  const list = Array.isArray(recipients) ? recipients : [recipients];
  return Array.from(
    new Set(
      list
        .filter(Boolean)
        .map((item) => String(item).trim())
        .filter((item) => isValidEmail(item))
    )
  );
}

export async function sendShipmentCreatedEmail(payload: ShipmentCreatedEmailPayload, adminEmail?: string) {
  console.log('[email] sendShipmentCreatedEmail called', {
    trackingNumber: payload.trackingNumber,
    senderEmail: payload.senderEmail,
    recipientEmail: payload.recipientEmail,
    adminEmail,
  });

  const template = shipmentCreatedEmailTemplate(payload);
  const adminRecipients = normalizeRecipients([adminEmail, ...getDefaultNotificationRecipients()]);
  
  const emailPromises: Promise<void>[] = [];
  let hasValidRecipients = false;

  // Send email to sender
  if (isValidEmail(payload.senderEmail)) {
    const senderEmail = payload.senderEmail!.trim();
    console.log('[email] Sending shipment created email to sender:', senderEmail);
    hasValidRecipients = true;
    emailPromises.push(
      sendEmail({
        to: senderEmail,
        subject: template.subject,
        html: template.html,
        bcc: adminRecipients.length > 0 ? adminRecipients : undefined,
      })
        .then(() => {
          console.log('[email] Successfully sent shipment created email to sender:', senderEmail);
        })
        .catch((err) => {
          console.error('[email] Failed to send shipment created email to sender:', senderEmail, err);
          // Don't throw - allow recipient email to still be sent
        })
    );
  } else {
    console.warn('[email] Invalid or missing sender email:', payload.senderEmail);
  }

  // Send email to recipient
  if (isValidEmail(payload.recipientEmail)) {
    const recipientEmail = payload.recipientEmail!.trim();
    console.log('[email] Sending shipment created email to recipient:', recipientEmail);
    hasValidRecipients = true;
    emailPromises.push(
      sendEmail({
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
        bcc: adminRecipients.length > 0 ? adminRecipients : undefined,
      })
        .then(() => {
          console.log('[email] Successfully sent shipment created email to recipient:', recipientEmail);
        })
        .catch((err) => {
          console.error('[email] Failed to send shipment created email to recipient:', recipientEmail, err);
          // Don't throw - allow sender email to still be sent
        })
    );
  } else {
    console.warn('[email] Invalid or missing recipient email:', payload.recipientEmail);
  }

  // If no sender or recipient emails, send to admin only
  if (!hasValidRecipients) {
    console.warn('[email] No valid sender or recipient emails, sending to admin only');
    if (adminRecipients.length === 0) {
      const error = new Error('No valid email recipients available for shipment creation notification.');
      console.error('[email]', error.message);
      throw error;
    }
    emailPromises.push(
      sendEmail({
        to: adminRecipients,
        subject: template.subject,
        html: template.html,
      })
        .then(() => {
          console.log('[email] Successfully sent shipment created email to admin');
        })
        .catch((err) => {
          console.error('[email] Failed to send shipment created email to admin', err);
          throw err;
        })
    );
  }

  if (emailPromises.length === 0) {
    const error = new Error('No email promises to send');
    console.error('[email]', error.message);
    throw error;
  }

  await Promise.all(emailPromises);
  console.log('[email] All shipment created emails processed');
}

export async function sendShipmentUpdatedEmail(payload: ShipmentUpdatedEmailPayload, adminEmail?: string) {
  console.log('[email] sendShipmentUpdatedEmail called', {
    trackingNumber: payload.trackingNumber,
    senderEmail: payload.senderEmail,
    recipientEmail: payload.recipientEmail,
    adminEmail,
  });

  const template = shipmentUpdatedEmailTemplate(payload);
  const adminRecipients = normalizeRecipients([adminEmail, ...getDefaultNotificationRecipients()]);
  
  const emailPromises: Promise<void>[] = [];
  let hasValidRecipients = false;

  // Send email to sender
  if (isValidEmail(payload.senderEmail)) {
    const senderEmail = payload.senderEmail!.trim();
    console.log('[email] Sending shipment updated email to sender:', senderEmail);
    hasValidRecipients = true;
    emailPromises.push(
      sendEmail({
        to: senderEmail,
        subject: template.subject,
        html: template.html,
        bcc: adminRecipients.length > 0 ? adminRecipients : undefined,
      })
        .then(() => {
          console.log('[email] Successfully sent shipment updated email to sender:', senderEmail);
        })
        .catch((err) => {
          console.error('[email] Failed to send shipment updated email to sender:', senderEmail, err);
          // Don't throw - allow recipient email to still be sent
        })
    );
  } else {
    console.warn('[email] Invalid or missing sender email:', payload.senderEmail);
  }

  // Send email to recipient
  if (isValidEmail(payload.recipientEmail)) {
    const recipientEmail = payload.recipientEmail!.trim();
    console.log('[email] Sending shipment updated email to recipient:', recipientEmail);
    hasValidRecipients = true;
    emailPromises.push(
      sendEmail({
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
        bcc: adminRecipients.length > 0 ? adminRecipients : undefined,
      })
        .then(() => {
          console.log('[email] Successfully sent shipment updated email to recipient:', recipientEmail);
        })
        .catch((err) => {
          console.error('[email] Failed to send shipment updated email to recipient:', recipientEmail, err);
          // Don't throw - allow sender email to still be sent
        })
    );
  } else {
    console.warn('[email] Invalid or missing recipient email:', payload.recipientEmail);
  }

  // If no sender or recipient emails, send to admin only
  if (!hasValidRecipients) {
    console.warn('[email] No valid sender or recipient emails, sending to admin only');
    if (adminRecipients.length === 0) {
      const error = new Error('No valid email recipients available for shipment update notification.');
      console.error('[email]', error.message);
      throw error;
    }
    emailPromises.push(
      sendEmail({
        to: adminRecipients,
        subject: template.subject,
        html: template.html,
      })
        .then(() => {
          console.log('[email] Successfully sent shipment updated email to admin');
        })
        .catch((err) => {
          console.error('[email] Failed to send shipment updated email to admin', err);
          throw err;
        })
    );
  }

  if (emailPromises.length === 0) {
    const error = new Error('No email promises to send');
    console.error('[email]', error.message);
    throw error;
  }

  await Promise.all(emailPromises);
  console.log('[email] All shipment updated emails processed');
}

export async function sendContactEmail(payload: ContactEmailPayload, adminRecipients?: Recipient | Recipient[]) {
  const recipients = normalizeRecipients(
    Array.isArray(adminRecipients)
      ? [...adminRecipients, ...getDefaultNotificationRecipients()]
      : [adminRecipients, ...getDefaultNotificationRecipients()]
  );
  if (!recipients.length) {
    throw new Error('No valid email recipients configured for contact submissions.');
  }

  const template = contactEmailTemplate(payload);
  await sendEmail({
    to: recipients,
    subject: template.subject,
    html: template.html,
    replyTo: payload.email,
  });
}
