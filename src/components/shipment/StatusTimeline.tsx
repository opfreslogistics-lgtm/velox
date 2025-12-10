'use client';

import React from 'react';

const defaultStatuses = [
  'Pending',
  'Processing',
  'Ready for Pickup',
  'In Transit',
  'Out for Delivery',
  'Delivered',
];

export default function StatusTimeline({ statuses = defaultStatuses }: { statuses?: string[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-brand-black dark:text-white mb-3">Status Timeline</h3>
      <div className="space-y-4">
        {statuses.map((s, idx) => (
          <div key={s} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <span className={`w-3 h-3 rounded-full ${idx === statuses.length - 1 ? 'bg-brand-red' : 'bg-emerald-500'}`} />
              {idx !== statuses.length - 1 && <span className="flex-1 w-px bg-gray-200 dark:bg-gray-800" />}
            </div>
            <div className="text-sm text-gray-800 dark:text-gray-200">{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


