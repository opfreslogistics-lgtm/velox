import React from 'react';

const Stats: React.FC = () => {
  return (
    <section className="py-20 bg-brand-red text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            {[
                { label: "Delivered Packages", value: "250M+" },
                { label: "Countries Served", value: "220" },
                { label: "Warehouses", value: "850" },
                { label: "Happy Clients", value: "50k+" },
            ].map((stat, i) => (
                <div key={i} className="p-4">
                    <div className="text-4xl md:text-6xl font-extrabold mb-2 text-white">{stat.value}</div>
                    <div className="text-brand-yellow font-bold uppercase tracking-wider text-sm">{stat.label}</div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;