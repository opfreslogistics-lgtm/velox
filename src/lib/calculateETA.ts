export const calculateETA = (speed: 'Standard' | 'Express' | 'Same-Day' | 'Next-Day') => {
  const now = new Date();
  const eta = new Date(now);

  switch (speed) {
    case 'Same-Day':
      eta.setHours(now.getHours() + 8);
      break;
    case 'Next-Day':
      eta.setDate(now.getDate() + 1);
      break;
    case 'Express':
      eta.setDate(now.getDate() + 2);
      break;
    default:
      eta.setDate(now.getDate() + 5);
      break;
  }

  return eta.toISOString();
};


