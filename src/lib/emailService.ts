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

  // Send email to sender - FORCE SEND
  if (isValidEmail(payload.senderEmail)) {
    const senderEmail = payload.senderEmail!.trim();
    console.log('[email] 📧 FORCE SENDING shipment created email to sender:', senderEmail);
    hasValidRecipients = true;
    emailPromises.push(
      sendEmail({
        to: senderEmail,
        subject: template.subject,
        html: template.html,
        bcc: adminRecipients.length > 0 ? adminRecipients : undefined,
      })
        .then((result) => {
          console.log('[email] ✅ SUCCESS: Sent shipment created email to sender:', senderEmail, {
            messageId: result.messageId,
            accepted: result.accepted,
          });
        })
        .catch((err) => {
          const errorMsg = err.message || String(err);
          console.error('[email] ❌ FAILED: Could not send shipment created email to sender:', senderEmail, {
            error: errorMsg,
            stack: err.stack,
          });
          // Re-throw to ensure we know about failures
          throw new Error(`Failed to send email to sender ${senderEmail}: ${errorMsg}`);
        })
    );
  } else {
    console.warn('[email] ⚠️ Invalid or missing sender email:', payload.senderEmail);
  }

  // Send email to recipient - FORCE SEND
  if (isValidEmail(payload.recipientEmail)) {
    const recipientEmail = payload.recipientEmail!.trim();
    console.log('[email] 📧 FORCE SENDING shipment created email to recipient:', recipientEmail);
    hasValidRecipients = true;
    emailPromises.push(
      sendEmail({
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
        bcc: adminRecipients.length > 0 ? adminRecipients : undefined,
      })
        .then((result) => {
          console.log('[email] ✅ SUCCESS: Sent shipment created email to recipient:', recipientEmail, {
            messageId: result.messageId,
            accepted: result.accepted,
          });
        })
        .catch((err) => {
          const errorMsg = err.message || String(err);
          console.error('[email] ❌ FAILED: Could not send shipment created email to recipient:', recipientEmail, {
            error: errorMsg,
            stack: err.stack,
          });
          // Re-throw to ensure we know about failures
          throw new Error(`Failed to send email to recipient ${recipientEmail}: ${errorMsg}`);
        })
    );
  } else {
    console.warn('[email] ⚠️ Invalid or missing recipient email:', payload.recipientEmail);
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

  // Use Promise.allSettled to ensure both emails are attempted even if one fails
  const results = await Promise.allSettled(emailPromises);
  
  // Log results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log('[email] ✅ Email promise resolved successfully');
    } else {
      console.error('[email] ❌ Email promise rejected:', result.reason);
    }
  });
  
  // Check if any emails were successfully sent
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  console.log('[email] All shipment created emails processed', {
    total: results.length,
    successful,
    failed,
  });
  
  // If all failed, throw an error
  if (failed === results.length && results.length > 0) {
    const errors = results
      .filter(r => r.status === 'rejected')
      .map(r => (r as PromiseRejectedResult).reason?.message || 'Unknown error')
      .join('; ');
    throw new Error(`All emails failed to send: ${errors}`);
  }
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

  // Send email to sender - FORCE SEND
  if (isValidEmail(payload.senderEmail)) {
    const senderEmail = payload.senderEmail!.trim();
    console.log('[email] 📧 FORCE SENDING shipment updated email to sender:', senderEmail);
    hasValidRecipients = true;
    emailPromises.push(
      sendEmail({
        to: senderEmail,
        subject: template.subject,
        html: template.html,
        bcc: adminRecipients.length > 0 ? adminRecipients : undefined,
      })
        .then((result) => {
          console.log('[email] ✅ SUCCESS: Sent shipment updated email to sender:', senderEmail, {
            messageId: result.messageId,
            accepted: result.accepted,
          });
        })
        .catch((err) => {
          const errorMsg = err.message || String(err);
          console.error('[email] ❌ FAILED: Could not send shipment updated email to sender:', senderEmail, {
            error: errorMsg,
            stack: err.stack,
          });
          // Re-throw to ensure we know about failures
          throw new Error(`Failed to send email to sender ${senderEmail}: ${errorMsg}`);
        })
    );
  } else {
    console.warn('[email] ⚠️ Invalid or missing sender email:', payload.senderEmail);
  }

  // Send email to recipient - FORCE SEND
  if (isValidEmail(payload.recipientEmail)) {
    const recipientEmail = payload.recipientEmail!.trim();
    console.log('[email] 📧 FORCE SENDING shipment updated email to recipient:', recipientEmail);
    hasValidRecipients = true;
    emailPromises.push(
      sendEmail({
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
        bcc: adminRecipients.length > 0 ? adminRecipients : undefined,
      })
        .then((result) => {
          console.log('[email] ✅ SUCCESS: Sent shipment updated email to recipient:', recipientEmail, {
            messageId: result.messageId,
            accepted: result.accepted,
          });
        })
        .catch((err) => {
          const errorMsg = err.message || String(err);
          console.error('[email] ❌ FAILED: Could not send shipment updated email to recipient:', recipientEmail, {
            error: errorMsg,
            stack: err.stack,
          });
          // Re-throw to ensure we know about failures
          throw new Error(`Failed to send email to recipient ${recipientEmail}: ${errorMsg}`);
        })
    );
  } else {
    console.warn('[email] ⚠️ Invalid or missing recipient email:', payload.recipientEmail);
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

  // Use Promise.allSettled to ensure both emails are attempted even if one fails
  const results = await Promise.allSettled(emailPromises);
  
  // Log results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log('[email] ✅ Email promise resolved successfully');
    } else {
      console.error('[email] ❌ Email promise rejected:', result.reason);
    }
  });
  
  // Check if any emails were successfully sent
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  console.log('[email] All shipment updated emails processed', {
    total: results.length,
    successful,
    failed,
  });
  
  // If all failed, throw an error
  if (failed === results.length && results.length > 0) {
    const errors = results
      .filter(r => r.status === 'rejected')
      .map(r => (r as PromiseRejectedResult).reason?.message || 'Unknown error')
      .join('; ');
    throw new Error(`All emails failed to send: ${errors}`);
  }
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
