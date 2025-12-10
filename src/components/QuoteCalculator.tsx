'use client';

import React, { useState } from 'react';
import { Calculator, Plane, Truck, Anchor, ArrowRight, MapPin, Box } from 'lucide-react';

type Variant = 'full' | 'card';

interface QuoteCalculatorProps {
  variant?: Variant;
}

const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({ variant = 'full' }) => {
  const [weight, setWeight] = useState(10);
  const [method, setMethod] = useState<'air'|'sea'|'road'>('air');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  // Mock calculation logic
  const baseRate = method === 'air' ? 25 : method === 'road' ? 8 : 4;
  const estimate = (weight * baseRate).toFixed(2);

  const card = (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-8 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-red to-brand-yellow" />

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-brand-black text-white p-2 rounded-lg">
          <Calculator size={20} />
        </div>
        <h3 className="text-xl font-bold text-brand-black dark:text-white">Quick Rate Estimator</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Origin City or Zip"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 focus:border-brand-red outline-none text-sm font-medium dark:text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Destination City or Zip"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 focus:border-brand-red outline-none text-sm font-medium dark:text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Service Type</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'air', label: 'Air', icon: Plane },
              { id: 'road', label: 'Road', icon: Truck },
              { id: 'sea', label: 'Ocean', icon: Anchor },
            ].map((option) => {
              const active = method === option.id;
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setMethod(option.id as 'air' | 'road' | 'sea')}
                  className={`flex flex-col items-center justify-center p-3 rounded border-2 transition-all ${
                    active
                      ? 'border-brand-red bg-brand-red/5 text-brand-red'
                      : 'border-gray-200 dark:border-gray-600 hover:border-brand-red text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Icon size={20} className="mb-1" />
                  <span className="text-xs font-bold">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Package Weight</label>
            <span className="text-sm font-bold text-brand-black dark:text-white">{weight} kg</span>
          </div>
          <input
            type="range"
            min="1"
            max="1000"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-red"
          />
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>1kg</span>
            <span>1000kg</span>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-5 flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-gray-500 text-xs font-bold uppercase block">Estimated Total</span>
            <div className="text-3xl font-extrabold text-brand-black dark:text-white">${estimate}</div>
          </div>
          <button className="px-6 py-3 bg-brand-red text-white font-bold rounded shadow-lg hover:bg-brand-redDark transition-all flex items-center gap-2">
            Get Quote <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  if (variant === 'card') {
    return card;
  }

  return (
    <section className="relative py-20 bg-white dark:bg-brand-black transition-colors duration-300">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 dark:bg-gray-900 skew-x-12 transform origin-bottom-right z-0" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-6">
            <div>
              <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2 block">Pricing & Quotes</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white">Calculate Your Shipping Costs Instantly.</h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Get transparent, real-time pricing for your logistics needs. Whether it's a small parcel or a full container, our smart calculator finds the best route and rate for you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-brand-red/10 p-3 rounded text-brand-red"><Box size={24} /></div>
                <div>
                  <h4 className="font-bold text-brand-black dark:text-white">Dimensional Weight</h4>
                  <p className="text-sm text-gray-500">Smart optimization for volume.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-brand-yellow/10 p-3 rounded text-brand-yellowDark"><Plane size={24} /></div>
                <div>
                  <h4 className="font-bold text-brand-black dark:text-white">Express Options</h4>
                  <p className="text-sm text-gray-500">Next-day delivery estimates.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            {card}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteCalculator;