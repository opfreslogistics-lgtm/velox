'use client';

import React from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';

interface StampProps {
  status: string;
  date?: string;
}

export default function Stamp({ status, date }: StampProps) {
  const isDelivered = status === 'Delivered';
  const isInTransit = ['In Transit', 'Out for Delivery', 'Picked Up'].includes(status);
  
  return (
    <div className="relative inline-block">
      <div
        className="relative w-32 h-32 rounded-full border-[6px] flex items-center justify-center transform rotate-[-8deg] border-red-700/80 bg-red-50"
        style={{
          boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
          backgroundImage:
            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4), transparent 40%)',
        }}
      >
        {/* Inner ring */}
        <div className="absolute inset-3 rounded-full border-2 border-red-800/70"></div>

        {/* Grunge effect */}
        <div className="absolute inset-0 rounded-full border border-black/5 mix-blend-multiply blur-[0.3px]" />

        {/* Text / Icon */}
        <div className="relative z-10 text-center">
          <CheckCircle className="w-8 h-8 mx-auto text-red-700 mb-1 drop-shadow-sm" />
          <p className="text-[10px] font-extrabold text-red-800 uppercase tracking-[0.2em]">Verified</p>
          <p className="text-[10px] font-extrabold text-red-900 uppercase tracking-[0.18em] mt-0.5">
            {isDelivered ? 'Delivered' : isInTransit ? 'In Transit' : 'Processing'}
          </p>
          {date && (
            <p className="text-[9px] font-mono text-red-900 mt-1 tracking-[0.12em]">
              {new Date(date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


