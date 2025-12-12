'use client';

import { Shipment } from '@/types';
import { jsPDF } from 'jspdf';

type InvoiceInput = {
  shipment: Shipment;
  rawShipment?: any;
  history?: any[];
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
  const { shipment, rawShipment, latestStatus, progress, barcodeDataUrl, qrDataUrl } = input;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' }); // A4 size

  // Layout constants
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 32;
  const contentWidth = pageWidth - marginX * 2;
  const topStart = 76;
  const footerReserve = 80;
  const tableRowHeight = 20;
  let cursorY = topStart;
  let currentPage = 1;

  // Helpers
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
    text(val.toUpperCase(), x, y, 12, DHL_RED, 'bold');
    line(x, y + 5, x + 64, y + 5, DHL_YELLOW, 1.4);
  };

  const box = (x: number, y: number, w: number, h: number, borderColor = LIGHT_GRAY) => {
    doc.setDrawColor(borderColor);
    doc.setLineWidth(0.8);
    doc.rect(x, y, w, h);
  };

  const drawHeader = () => {
    doc.setFillColor(DHL_RED);
    doc.rect(0, 0, pageWidth, 52, 'F');
    text('SAND GLOBAL EXPRESS', marginX, 32, 14, '#FFFFFF', 'bold');
    text('INVOICE', pageWidth - marginX - 86, 32, 16, '#FFFFFF', 'bold');
    doc.setFillColor(DHL_YELLOW);
    doc.rect(0, 52, pageWidth, 4, 'F');
  };

  const drawFooter = () => {
    const footerY = pageHeight - 32;
    doc.setFillColor(LIGHT_GRAY);
    doc.rect(0, footerY - 20, pageWidth, 36, 'F');
    text(
      'Sand Global Express • 1-800-SAND-EXP • sandgloexpress.com • support@sandgloexpress.com • Thank you for shipping with us.',
      marginX,
      footerY,
      9,
      BLACK,
      'bold'
    );
  };

  const addPageWithHeader = () => {
    drawFooter();
    doc.addPage();
    currentPage += 1;
    drawHeader();
    cursorY = topStart;
  };

  const ensureSpace = (neededHeight: number) => {
    if (cursorY + neededHeight + footerReserve > pageHeight) {
      addPageWithHeader();
    }
  };

  const drawTableRows = (rows: Array<[string, any]>) => {
    rows.forEach((row, idx) => {
      const projectedHeight = (idx + 1) * tableRowHeight + 6;
      ensureSpace(projectedHeight);
      const y = cursorY + tableRowHeight * idx;
      doc.setFillColor(idx % 2 === 0 ? '#FFFFFF' : LIGHT_GRAY);
      doc.rect(marginX, y - 12, contentWidth, tableRowHeight, 'F');
      doc.setDrawColor(LIGHT_GRAY);
      doc.rect(marginX, y - 12, contentWidth, tableRowHeight);
      text(row[0], marginX + 12, y, 9, BLACK, 'bold');
      text(String(row[1]), marginX + 190, y, 9, BLACK);
    });
    cursorY += rows.length * tableRowHeight + 12;
  };

  // Draw header for first page
  drawHeader();

  // 1) Shipment Overview Block
  const overviewHeight = 128;
  ensureSpace(overviewHeight);
  box(marginX, cursorY, contentWidth, overviewHeight);
  text('Tracking Number', marginX + 14, cursorY + 22, 10, BLACK, 'bold');
  text(shipment.trackingNumber, marginX + 14, cursorY + 42, 15, BLACK, 'bold');

  text('Invoice Number', marginX + contentWidth / 2, cursorY + 22, 10, BLACK, 'bold');
  const invoiceNumber = rawShipment?.invoice_number || `INV-${shipment.trackingNumber}`;
  text(invoiceNumber, marginX + contentWidth / 2, cursorY + 40, 11, BLACK, 'normal');

  text('Date Issued', marginX + 14, cursorY + 70, 10, BLACK, 'bold');
  text(new Date().toLocaleDateString(), marginX + 14, cursorY + 88);

  text('Reference', marginX + contentWidth / 2, cursorY + 70, 10, BLACK, 'bold');
  text(rawShipment?.reference_code || '—', marginX + contentWidth / 2, cursorY + 88);

  text('Status', marginX + 14, cursorY + 110, 10, BLACK, 'bold');
  text(latestStatus || shipment.status || '—', marginX + 14, cursorY + 126, 11, DHL_RED, 'bold');

  text('Progress', marginX + contentWidth / 2, cursorY + 110, 10, BLACK, 'bold');
  text(`${progress || 0}%`, marginX + contentWidth / 2, cursorY + 126, 11, BLACK, 'bold');

  cursorY += overviewHeight + 22;

  // 2) Sender / Receiver side-by-side
  const contactBoxHeight = 132;
  ensureSpace(contactBoxHeight);
  const columnWidth = contentWidth / 2 - 8;
  const rightX = marginX + columnWidth + 16;

  box(marginX, cursorY, columnWidth, contactBoxHeight);
  box(rightX, cursorY, columnWidth, contactBoxHeight);

  sectionTitle('Sender', marginX + 14, cursorY + 20);
  const senderLines = [
    shipment.sender || '—',
    shipment.senderPhone || rawShipment?.sender_phone || '—',
    shipment.senderEmail || rawShipment?.sender_email || '—',
    shipment.senderAddress || '—',
  ];
  senderLines.forEach((ln, idx) => text(ln, marginX + 14, cursorY + 42 + idx * 18, 9, BLACK));

  sectionTitle('Receiver', rightX + 14, cursorY + 20);
  const receiverLines = [
    shipment.recipient || '—',
    shipment.recipientPhone || rawShipment?.recipient_phone || '—',
    shipment.recipientEmail || rawShipment?.recipient_email || '—',
    shipment.recipientAddress || '—',
  ];
  receiverLines.forEach((ln, idx) => text(ln, rightX + 14, cursorY + 42 + idx * 18, 9, BLACK));

  cursorY += contactBoxHeight + 24;

  // 3) Package Information box (table)
  sectionTitle('Package Information', marginX, cursorY);
  cursorY += 18;
  const pkgRows: [string, any][] = [
    ['Package type', rawShipment?.shipment_type || '—'],
    ['Weight', shipment.weight || '—'],
    ['Dimensions', shipment.dimensions || '—'],
    ['Declared value', rawShipment?.declared_value ? `$${rawShipment.declared_value}` : '—'],
    ['Insurance', rawShipment?.insurance ? 'Yes' : 'No'],
    ['Payment method', rawShipment?.payment_method || '—'],
    ['Delivery speed', rawShipment?.delivery_speed || shipment.serviceType || '—'],
  ];
  drawTableRows(pkgRows);
  cursorY += 12;

  // 4) Movement Summary
  ensureSpace(tableRowHeight * 5 + 28);
  sectionTitle('Movement Summary', marginX, cursorY);
  cursorY += 18;
  const mvRows: [string, any][] = [
    ['Origin', shipment.origin || '—'],
    ['Destination', shipment.destination || '—'],
    ['Transit Path', rawShipment?.transit_path || '—'],
    ['Estimated delivery', shipment.eta ? new Date(shipment.eta).toLocaleDateString() : '—'],
    ['Current facility', rawShipment?.current_location_name || '—'],
  ];
  drawTableRows(mvRows);
  cursorY += 8;

  // 5) Codes and Signatures (QR / Barcode)
  const qrSize = qrDataUrl ? 96 : 0;
  const barcodeHeight = barcodeDataUrl ? 64 : 0;
  const blockHeight = Math.max(qrSize, barcodeHeight) + 36;

  const placeOnFirstPage =
    currentPage === 1 && cursorY + blockHeight + footerReserve <= pageHeight;

  if (!placeOnFirstPage && currentPage === 1) {
    addPageWithHeader();
  } else if (!placeOnFirstPage) {
    ensureSpace(blockHeight);
  }

  const yStart = placeOnFirstPage ? pageHeight - footerReserve - (blockHeight - 12) : cursorY;
  const signatureY = yStart + Math.max(qrSize, barcodeHeight) + 10;

  if (barcodeDataUrl) {
    doc.addImage(barcodeDataUrl, 'PNG', marginX, yStart, 220, barcodeHeight || 60);
  }

  if (qrDataUrl) {
    doc.addImage(qrDataUrl, 'PNG', pageWidth - marginX - qrSize, yStart, qrSize, qrSize);
  }

  line(pageWidth - marginX - 210, signatureY, pageWidth - marginX - 30, signatureY);
  text('Authorized Signature', pageWidth - marginX - 210, signatureY + 14, 9, BLACK);
  doc.setDrawColor(DHL_RED);
  doc.setTextColor(DHL_RED);
  doc.setFontSize(22);
  doc.text('SAND', pageWidth - marginX - 148, signatureY + 60, { angle: -15, opacity: 0.2 } as any);

  cursorY = placeOnFirstPage ? pageHeight - footerReserve + 8 : signatureY + 42;

  // Footer (last page)
  drawFooter();

  const filename = `invoice-${shipment.trackingNumber}.pdf`;
  doc.save(filename);
}

