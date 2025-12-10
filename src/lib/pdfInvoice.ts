'use client';

import { Shipment, TrackingEvent } from '@/types';
import { jsPDF } from 'jspdf';

type InvoiceInput = {
  shipment: Shipment;
  rawShipment?: any;
  history: TrackingEvent[];
  latestStatus: string;
  progress: number;
  barcodeDataUrl?: string;
  qrDataUrl?: string;
};

// Colors
const DHL_RED = '#D40511';
const DHL_YELLOW = '#FFCC00';
const BLACK = '#000000';
const LIGHT_GRAY = '#E6E6E6';

export async function generateInvoicePDF(input: InvoiceInput) {
  const { shipment, rawShipment, history, latestStatus, progress, barcodeDataUrl, qrDataUrl } = input;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' }); // A4 size

  // Helpers
  const mm = (n: number) => n * 2.83465; // convert mm to pt if needed
  const line = (x1: number, y1: number, x2: number, y2: number, color = LIGHT_GRAY, width = 0.6) => {
    doc.setDrawColor(color);
    doc.setLineWidth(width);
    doc.line(x1, y1, x2, y2);
  };
  const text = (val: string, x: number, y: number, size = 10, color = BLACK, weight: 'normal' | 'bold' = 'normal') => {
    doc.setTextColor(color);
    doc.setFont('helvetica', weight);
    doc.setFontSize(size);
    doc.text(val, x, y);
  };
  const sectionTitle = (val: string, x: number, y: number) => {
    text(val.toUpperCase(), x, y, 11, BLACK, 'bold');
    line(x, y + 4, x + 60, y + 4, DHL_YELLOW, 1.2);
  };
  const box = (x: number, y: number, w: number, h: number, borderColor = LIGHT_GRAY) => {
    doc.setDrawColor(borderColor);
    doc.setLineWidth(0.8);
    doc.rect(x, y, w, h);
  };

  // 1) Header
  doc.setFillColor(DHL_RED);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 50, 'F');
  text('VELOX LOGISTICS', 32, 32, 14, '#FFFFFF', 'bold');
  text('INVOICE', doc.internal.pageSize.getWidth() - 90, 32, 16, '#FFFFFF', 'bold');
  // Yellow line
  doc.setFillColor(DHL_YELLOW);
  doc.rect(0, 50, doc.internal.pageSize.getWidth(), 4, 'F');

  let cursorY = 70;
  const leftX = 32;
  const rightX = doc.internal.pageSize.getWidth() / 2 + 12;
  const columnWidth = doc.internal.pageSize.getWidth() / 2 - 44;

  // 2) Shipment Overview Block
  const overviewHeight = 120;
  box(leftX, cursorY, doc.internal.pageSize.getWidth() - 64, overviewHeight);
  text('Tracking Number', leftX + 12, cursorY + 22, 10, BLACK, 'bold');
  text(shipment.trackingNumber, leftX + 12, cursorY + 40, 14, BLACK, 'bold');

  text('Invoice Number', leftX + columnWidth, cursorY + 22, 10, BLACK, 'bold');
  const invoiceNumber = rawShipment?.invoice_number || `INV-${shipment.trackingNumber}`;
  text(invoiceNumber, leftX + columnWidth, cursorY + 40, 11, BLACK, 'normal');

  text('Date Issued', leftX + 12, cursorY + 62, 10, BLACK, 'bold');
  text(new Date().toLocaleDateString(), leftX + 12, cursorY + 78);

  text('Reference', leftX + columnWidth, cursorY + 62, 10, BLACK, 'bold');
  text(rawShipment?.reference_code || '—', leftX + columnWidth, cursorY + 78);

  text('Status', leftX + 12, cursorY + 100, 10, BLACK, 'bold');
  text(latestStatus || shipment.status || '—', leftX + 12, cursorY + 116, 11, DHL_RED, 'bold');

  text('Progress', leftX + columnWidth, cursorY + 100, 10, BLACK, 'bold');
  text(`${progress || 0}%`, leftX + columnWidth, cursorY + 116, 11, BLACK, 'bold');

  cursorY += overviewHeight + 18;

  // 3) Sender / Receiver side-by-side
  const boxHeight = 120;
  box(leftX, cursorY, columnWidth, boxHeight);
  box(rightX, cursorY, columnWidth, boxHeight);

  sectionTitle('Sender', leftX + 12, cursorY + 18);
  const senderLines = [
    shipment.sender || '—',
    shipment.senderPhone || rawShipment?.sender_phone || '—',
    shipment.senderEmail || rawShipment?.sender_email || '—',
    shipment.senderAddress || '—',
  ];
  senderLines.forEach((ln, idx) => text(ln, leftX + 12, cursorY + 36 + idx * 16, 9, BLACK));

  sectionTitle('Receiver', rightX + 12, cursorY + 18);
  const receiverLines = [
    shipment.recipient || '—',
    shipment.recipientPhone || rawShipment?.recipient_phone || '—',
    shipment.recipientEmail || rawShipment?.recipient_email || '—',
    shipment.recipientAddress || '—',
  ];
  receiverLines.forEach((ln, idx) => text(ln, rightX + 12, cursorY + 36 + idx * 16, 9, BLACK));

  cursorY += boxHeight + 16;

  // 5) Package Information box (table)
  sectionTitle('Package Information', leftX, cursorY + 8);
  cursorY += 16;
  const pkgStartY = cursorY + 6;
  const pkgRows = [
    ['Package type', rawShipment?.shipment_type || '—'],
    ['Weight', shipment.weight || '—'],
    ['Dimensions', shipment.dimensions || '—'],
    ['Declared value', rawShipment?.declared_value ? `$${rawShipment.declared_value}` : '—'],
    ['Item description', rawShipment?.shipment_description || '—'],
    ['Insurance', rawShipment?.insurance ? 'Yes' : 'No'],
    ['Payment method', rawShipment?.payment_method || '—'],
    ['Delivery speed', rawShipment?.delivery_speed || shipment.serviceType || '—'],
  ];

  const rowHeight = 18;
  pkgRows.forEach((row, idx) => {
    const y = pkgStartY + idx * rowHeight;
    doc.setFillColor(idx % 2 === 0 ? '#FFFFFF' : LIGHT_GRAY);
    doc.rect(leftX, y - 12, doc.internal.pageSize.getWidth() - 64, rowHeight, 'F');
    doc.setDrawColor(LIGHT_GRAY);
    doc.rect(leftX, y - 12, doc.internal.pageSize.getWidth() - 64, rowHeight);
    text(row[0], leftX + 10, y, 9, BLACK, 'bold');
    text(String(row[1]), leftX + 180, y, 9, BLACK);
  });

  cursorY = pkgStartY + pkgRows.length * rowHeight + 16;

  // 6) Shipment Route / Movement Summary
  sectionTitle('Movement Summary', leftX, cursorY + 8);
  cursorY += 16;
  const mvRows = [
    ['Origin', shipment.origin || '—'],
    ['Destination', shipment.destination || '—'],
    ['Transit Path', rawShipment?.transit_path || '—'],
    ['Estimated delivery', shipment.eta ? new Date(shipment.eta).toLocaleDateString() : '—'],
    ['Current facility', rawShipment?.current_location_name || '—'],
  ];
  mvRows.forEach((row, idx) => {
    const y = cursorY + idx * rowHeight;
    doc.setFillColor(idx % 2 === 0 ? '#FFFFFF' : LIGHT_GRAY);
    doc.rect(leftX, y - 12, doc.internal.pageSize.getWidth() - 64, rowHeight, 'F');
    doc.setDrawColor(LIGHT_GRAY);
    doc.rect(leftX, y - 12, doc.internal.pageSize.getWidth() - 64, rowHeight);
    text(row[0], leftX + 10, y, 9, BLACK, 'bold');
    text(String(row[1]), leftX + 180, y, 9, BLACK);
  });

  cursorY = cursorY + mvRows.length * rowHeight + 16;

  // 7) Full History Log
  sectionTitle('Full History Log', leftX, cursorY + 8);
  cursorY += 16;
  const historyStartY = cursorY + 6;
  const historyRows = history && history.length ? history : [];
  historyRows.forEach((row, idx) => {
    const y = historyStartY + idx * rowHeight;
    doc.setFillColor(idx % 2 === 0 ? '#FFFFFF' : LIGHT_GRAY);
    doc.rect(leftX, y - 12, doc.internal.pageSize.getWidth() - 64, rowHeight, 'F');
    doc.setDrawColor(LIGHT_GRAY);
    doc.rect(leftX, y - 12, doc.internal.pageSize.getWidth() - 64, rowHeight);
    text(row.status || '—', leftX + 10, y, 9, BLACK, 'bold');
    text(row.timestamp || '—', leftX + 140, y, 8, BLACK);
    text(typeof row.progress === 'number' ? `${row.progress}%` : '—', leftX + 320, y, 8, BLACK);
    if ((row as any).note) {
      text((row as any).note, leftX + 380, y, 8, BLACK);
    }
  });
  cursorY = historyStartY + historyRows.length * rowHeight + 20;

  // 8) Barcode / QR (if available)
  const bottomY = doc.internal.pageSize.getHeight() - 120;
  if (barcodeDataUrl) {
    doc.addImage(barcodeDataUrl, 'PNG', leftX, bottomY, 180, 60);
  } else if (qrDataUrl) {
    doc.addImage(qrDataUrl, 'PNG', leftX, bottomY, 80, 80);
  }

  // 9) Signature & Stamp
  const sigX = doc.internal.pageSize.getWidth() - 220;
  const sigY = bottomY + 10;
  line(sigX, sigY, sigX + 180, sigY);
  text('Authorized Signature', sigX, sigY + 14, 9, BLACK);
  // faded stamp placeholder
  doc.setDrawColor(DHL_RED);
  doc.setTextColor(DHL_RED);
  doc.setFontSize(24);
  doc.text('VELOX', sigX + 30, sigY + 60, { angle: -15, opacity: 0.2 } as any);

  // 10) Footer
  const footerY = doc.internal.pageSize.getHeight() - 30;
  doc.setFillColor(LIGHT_GRAY);
  doc.rect(0, footerY - 20, doc.internal.pageSize.getWidth(), 30, 'F');
  text('Velox Logistics • 1-800-VELOX-SHIP • veloxlogistics.com • support@veloxlogistics.com • Thank you for shipping with us.', 32, footerY, 9, BLACK, 'bold');

  const filename = `invoice-${shipment.trackingNumber}.pdf`;
  doc.save(filename);
}

