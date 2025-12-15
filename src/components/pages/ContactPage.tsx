
'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import PageHero from '../PageHero';

const ContactPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    inquiryType: 'General Support',
    message: '',
  });

  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const handleInput = (field: keyof typeof formValues) => (value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus({ type: null, message: '' });
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Unable to send your message right now.');
      }

      setFormStatus({ type: 'success', message: result?.message || 'Message sent successfully.' });
      setFormValues({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        inquiryType: 'General Support',
        message: '',
      });
    } catch (err: any) {
      setFormStatus({
        type: 'error',
        message: err?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in-up bg-white dark:bg-brand-black transition-colors duration-300">
      
      <PageHero 
        title="Get In Touch" 
        subtitle="Our global support team is available 24/7 to assist you."
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-10">
             <div>
                <h3 className="text-2xl font-bold text-brand-black dark:text-white mb-8">Contact Information</h3>
                <div className="space-y-8">
                   <div className="flex gap-5 items-start group">
                      <div className="bg-brand-red/10 group-hover:bg-brand-red transition-colors p-4 rounded-xl text-brand-red group-hover:text-white">
                         <Phone size={24} />
                      </div>
                      <div>
                         <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Call Us</p>
                         <p className="text-brand-black dark:text-white font-extrabold text-xl">+44 7448 88561</p>
                         <p className="text-gray-600 dark:text-gray-300 font-semibold">+44 7345 518 417</p>
                         <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><Clock size={12}/> Mon-Fri: 8am - 8pm EST</p>
                      </div>
                   </div>
                   
                   <div className="flex gap-5 items-start group">
                      <div className="bg-brand-yellow/10 group-hover:bg-brand-yellow transition-colors p-4 rounded-xl text-brand-yellowDark group-hover:text-brand-black">
                         <Mail size={24} />
                      </div>
                      <div>
                         <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Email Us</p>
                         <p className="text-brand-black dark:text-white font-extrabold text-xl">support@sandgloexpress.com</p>
                         <p className="text-gray-500 text-sm mt-1">Response within 2 hours</p>
                      </div>
                   </div>

                   <div className="flex gap-5 items-start group">
                      <div className="bg-gray-100 dark:bg-gray-800 group-hover:bg-brand-black dark:group-hover:bg-white transition-colors p-4 rounded-xl text-brand-black dark:text-white group-hover:text-white dark:group-hover:text-black">
                         <MapPin size={24} />
                      </div>
                      <div>
                         <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Global HQ</p>
                         <p className="text-brand-black dark:text-white font-bold text-lg">Coldbath Square</p>
                         <p className="text-gray-500 text-sm">London, United Kingdom</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-brand-black dark:text-white mb-6 text-lg">Regional Offices</h4>
                <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                   <li className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-bold">London, UK</span> 
                      <span>+44 20 7123 4567</span>
                   </li>
                   <li className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-bold">Singapore</span> 
                      <span>+65 6789 0123</span>
                   </li>
                   <li className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-bold">Dubai, UAE</span> 
                      <span>+971 4 321 0987</span>
                   </li>
                   <li className="flex justify-between items-center">
                      <span className="font-bold">Berlin, DE</span> 
                      <span>+49 30 9876 5432</span>
                   </li>
                </ul>
             </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
             <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red opacity-5 rounded-bl-full pointer-events-none"></div>
                
                <h2 className="text-3xl font-extrabold text-brand-black dark:text-white mb-2">Send us a message</h2>
                <p className="text-gray-500 mb-8">We usually respond within 24 hours.</p>
                
                {formStatus.type && (
                  <div
                    className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                      formStatus.type === 'success'
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {formStatus.message}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">First Name</label>
                         <input 
                            type="text" 
                            className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-red outline-none transition-colors dark:text-white font-medium" 
                            placeholder="John"
                            value={formValues.firstName}
                            onChange={(e) => handleInput('firstName')(e.target.value)}
                            disabled={isSubmitting}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Last Name</label>
                         <input 
                            type="text" 
                            className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-red outline-none transition-colors dark:text-white font-medium" 
                            placeholder="Doe"
                            value={formValues.lastName}
                            onChange={(e) => handleInput('lastName')(e.target.value)}
                            disabled={isSubmitting}
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Email Address</label>
                         <input 
                            type="email" 
                            className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-red outline-none transition-colors dark:text-white font-medium" 
                            placeholder="john@company.com"
                            value={formValues.email}
                            onChange={(e) => handleInput('email')(e.target.value)}
                            required
                            disabled={isSubmitting}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Phone</label>
                         <input 
                            type="tel" 
                            className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-red outline-none transition-colors dark:text-white font-medium" 
                            placeholder="(555) 000-0000"
                            value={formValues.phone}
                            onChange={(e) => handleInput('phone')(e.target.value)}
                            disabled={isSubmitting}
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Inquiry Type</label>
                         <select 
                            className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-red outline-none transition-colors dark:text-white font-medium"
                            value={formValues.inquiryType}
                            onChange={(e) => handleInput('inquiryType')(e.target.value)}
                            disabled={isSubmitting}
                         >
                            <option>General Support</option>
                            <option>Request a Quote</option>
                            <option>Tracking Issue</option>
                            <option>Business Partnership</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Subject</label>
                         <input 
                            type="text" 
                            className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-red outline-none transition-colors dark:text-white font-medium" 
                            placeholder="How can we help?"
                            value={formValues.subject || ''}
                            onChange={(e) => handleInput('subject')(e.target.value)}
                            disabled={isSubmitting}
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Message</label>
                      <textarea 
                        rows={5} 
                        className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-red outline-none transition-colors dark:text-white font-medium" 
                        placeholder="Tell us how we can help..."
                        value={formValues.message}
                        onChange={(e) => handleInput('message')(e.target.value)}
                        required
                        disabled={isSubmitting}
                      ></textarea>
                   </div>

                   <button 
                     type="submit" 
                     className="w-full py-5 bg-brand-red text-white font-bold rounded-xl hover:bg-brand-redDark transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                     disabled={isSubmitting}
                   >
                      <Send size={20} /> {isSubmitting ? 'Sending...' : 'Send Message'}
                   </button>
                </form>
             </div>
          </div>
        </div>
      </div>

      {/* Support FAQ */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
         <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-brand-black dark:text-white mb-12">Common Support Questions</h2>
            <div className="space-y-4">
               {[
                  { q: "How do I report a missing package?", a: "You can report a missing package via the Tracking page using your shipment ID, or call our dedicated support line immediately." },
                  { q: "Can I change the delivery address?", a: "Address changes are permitted for a fee if the package has not yet reached the 'Out for Delivery' stage. Contact support to request this." },
                  { q: "What are your customer support hours?", a: "Our AI chat support is available 24/7. Live agents are available via phone and email from 8am to 8pm EST, Monday through Friday." }
               ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                     <button onClick={() => toggleFaq(i)} className="w-full flex justify-between items-center p-6 text-left font-bold text-brand-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        {item.q}
                        {openFaq === i ? <ChevronUp size={20} className="text-brand-red"/> : <ChevronDown size={20} className="text-gray-400"/>}
                     </button>
                     <div className={`px-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-all duration-300 overflow-hidden ${openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}>
                        {item.a}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Map Placeholder */}
      <div className="h-[500px] bg-gray-200 dark:bg-gray-800 relative group overflow-hidden">
         <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Map" />
         <div className="absolute inset-0 flex items-center justify-center bg-black/10">
             <div className="text-center">
                <div className="w-20 h-20 bg-brand-red text-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce shadow-2xl">
                   <MapPin size={32} />
                </div>
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">Visit Our HQ</h3>
                <p className="text-white/80 mt-2">Coldbath Square, London</p>
             </div>
         </div>
      </div>

      {/* Office Locations */}
      <section className="py-24 bg-white dark:bg-brand-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2 block">Locations</span>
            <h2 className="text-4xl font-extrabold text-brand-black dark:text-white mb-4">Our Global Offices</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">Visit us at any of our regional offices worldwide.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                city: "London, UK",
                address: "Coldbath Square",
                image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop",
                phone: "+44 20 7123 4567"
              },
              {
                city: "Singapore",
                address: "Marina Bay",
                image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop",
                phone: "+65 6789 0123"
              },
              {
                city: "Dubai, UAE",
                address: "Business Bay",
                image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
                phone: "+971 4 321 0987"
              },
              {
                city: "Berlin, DE",
                address: "Potsdamer Platz",
                image: "https://lasenhevaefulhabxqar.supabase.co/storage/v1/object/public/website-images/torre-de-la-television-berlin.webp",
                phone: "+49 30 9876 5432"
              }
            ].map((office, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={office.image} 
                    alt={office.city}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 bg-white dark:bg-gray-900">
                  <MapPin className="text-brand-red mb-2" size={24} />
                  <h3 className="text-xl font-bold text-brand-black dark:text-white mb-1">{office.city}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{office.address}</p>
                  <p className="text-brand-red font-semibold text-sm">{office.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-brand-black dark:text-white mb-4">Multiple Ways to Reach Us</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Choose the channel that works best for you</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "Phone Support",
                description: "24/7 phone support for urgent matters",
                contact: "+44 7448 88561",
                hours: "Mon-Fri: 8am - 8pm EST"
              },
              {
                icon: Mail,
                title: "Email Support",
                description: "Get help via email anytime",
                contact: "support@sandgloexpress.com",
                hours: "Response within 2 hours"
              },
              {
                icon: MessageSquare,
                title: "Live Chat",
                description: "Instant help via our chat system",
                contact: "Available 24/7",
                hours: "Average response: 2 minutes"
              }
            ].map((channel, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                <div className="bg-brand-red/10 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <channel.icon className="text-brand-red" size={32} />
                </div>
                <h3 className="text-xl font-bold text-brand-black dark:text-white mb-2">{channel.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{channel.description}</p>
                <p className="text-brand-red font-bold mb-1">{channel.contact}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{channel.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
