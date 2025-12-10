'use client';

import React from 'react';

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
}

export default function Barcode({ value, width = 220, height = 90 }: BarcodeProps) {
  const bars = React.useMemo(() => {
    const seed = value || '0000000000';
    const output: Array<{ w: number; h: number; dark: boolean }> = [];

    // Quiet zones + start/stop guards
    const guardPattern = [3, 1, 3]; // thick-thin-thick
    const pushGuard = () => {
      guardPattern.forEach((w, idx) => output.push({ w, h: height * 0.82, dark: idx % 2 === 0 }));
    };

    // Leading quiet zone
    output.push({ w: 8, h: height * 0.82, dark: false });
    pushGuard();

    for (let i = 0; i < seed.length * 3; i++) {
      const charCode = seed.charCodeAt(i % seed.length);
      const dark = (charCode + i) % 2 === 0;
      const w = 1 + ((charCode + i) % 3); // 1-3px realistic widths
      const h = height * (0.64 + ((charCode + i) % 4) / 18); // subtle height variance
      output.push({ w, h, dark });
    }

    // Trailing guard + quiet zone
    pushGuard();
    output.push({ w: 8, h: height * 0.82, dark: false });

    return output;
  }, [value, height]);

  return (
    <div
      className="relative bg-white border border-gray-200 shadow-lg rounded-md px-4 py-3 flex flex-col items-center"
      style={{ width }}
    >
      {/* top label */}
      <div className="w-full flex items-center justify-between text-[10px] text-gray-500 font-mono mb-1">
        <span>VELOX</span>
        <span>EXPRESS</span>
      </div>

      {/* barcode */}
      <div className="flex items-end justify-center gap-[1px] w-full bg-gray-50 border border-gray-200 px-2 py-2 rounded">
        {bars.map((bar, idx) => (
          <div
            key={idx}
            style={{
              width: `${bar.w}px`,
              height: `${bar.h}px`,
              backgroundColor: bar.dark ? '#111' : 'transparent',
            }}
          />
        ))}
      </div>

      {/* human-readable line */}
      <div className="mt-2 w-full text-center">
        <p className="font-mono text-sm font-semibold tracking-[0.2em] text-black">{value}</p>
        <p className="text-[9px] text-gray-500 font-mono tracking-[0.18em]">* {value.slice(-6).padStart(6, '0')} *</p>
      </div>

      {/* decorative notch */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-brand-red rounded-full shadow-sm"></div>
    </div>
  );
}


