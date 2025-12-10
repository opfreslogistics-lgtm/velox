import React from 'react';
import { Plus } from 'lucide-react';

const FAQ: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-brand-black transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-brand-black dark:text-white">Frequently Asked Questions</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Answers to common inquiries about our shipping services.</p>
            </div>
            
            <div className="space-y-4">
                {[
                    "How do I track my international shipment?",
                    "What are the prohibited items for air freight?",
                    "How is shipping cost calculated?",
                    "Do you offer customs clearance services?"
                ].map((q, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center cursor-pointer hover:border-brand-red dark:hover:border-brand-red transition-colors group">
                        <span className="font-bold text-gray-800 dark:text-gray-200">{q}</span>
                        <Plus className="text-gray-400 group-hover:text-brand-red transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default FAQ;