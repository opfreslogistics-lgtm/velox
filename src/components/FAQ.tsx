import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How do I track my international shipment?',
      a: 'Use your tracking ID on the Tracking page for live status updates across all carriers.',
    },
    {
      q: 'What are the prohibited items for air freight?',
      a: 'Hazardous materials, flammables, perishables without proper packaging, and restricted goods per IATA rules are not accepted.',
    },
    {
      q: 'How is shipping cost calculated?',
      a: 'We factor in weight, dimensions, mode, distance, duties, and any special handling or insurance you request.',
    },
    {
      q: 'Do you offer customs clearance services?',
      a: 'Yes. Our brokerage team manages documentation, duties, and compliance across major ports and airports.',
    },
  ];

  const toggle = (idx: number) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <section className="py-20 bg-gray-50 dark:bg-brand-black transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-brand-black dark:text-white">Frequently Asked Questions</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Answers to common inquiries about our shipping services.</p>
            </div>
            
            <div className="space-y-4">
                {faqs.map((item, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-900 p-6 rounded shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-brand-red dark:hover:border-brand-red transition-colors"
                      onClick={() => toggle(i)}
                    >
                      <div className="flex justify-between items-center gap-4">
                        <span className="font-bold text-gray-800 dark:text-gray-200">{item.q}</span>
                        {isOpen ? (
                          <Minus className="text-brand-red transition-colors" />
                        ) : (
                          <Plus className="text-gray-400 group-hover:text-brand-red transition-colors" />
                        )}
                      </div>
                      {isOpen && (
                        <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
                      )}
                    </div>
                  );
                })}
            </div>
        </div>
    </section>
  );
};

export default FAQ;