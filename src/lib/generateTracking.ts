import crypto from 'crypto';

export const generateTrackingNumber = () => {
  const prefix = 'SGE';
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${random}`;
};

export const generateReferenceCode = () => {
  const num = Math.floor(10000 + Math.random() * 89999);
  return `REF-${num}`;
};

export const generateBarcode = () => {
  return Math.random().toString().slice(2, 14);
};


