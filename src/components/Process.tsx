import React from 'react';
import { ClipboardList, Package, Plane, CheckSquare } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    title: "Book & Quote",
    desc: "Get an instant quote online and book your shipment in seconds."
  },
  {
    icon: Package,
    title: "Pack & Label",
    desc: "We pick up your package or you drop it off at our secure hubs."
  },
  {
    icon: Plane,
    title: "Global Transit",
    desc: "Real-time tracking as your cargo moves across our global network."
  },
  {
    icon: CheckSquare,
    title: "Secure Delivery",
    desc: "Safe arrival at the destination with proof of delivery."
  }
];

const Process: React.FC = () => {
  return (
    <section className="py-24 bg-brand-red transition-colors duration-300 border-b border-red-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="text-white/90 font-bold uppercase tracking-widest text-sm">How It Works</span>
          <h2 className="text-4xl font-extrabold text-white mt-2">Simplify Your Shipping</h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-white/30 -z-10"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-4 border-white/20 rounded-full flex items-center justify-center mb-6 group-hover:border-brand-yellow transition-colors duration-300 z-10 shadow-lg">
                <step.icon size={32} className="text-brand-red group-hover:text-brand-yellow transition-colors" />
              </div>
              <div className="absolute top-0 right-0 -mr-4 bg-brand-yellow text-brand-black font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg">
                {idx + 1}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-white/90 leading-relaxed text-sm px-4">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;