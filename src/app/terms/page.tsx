import React from 'react';
import PageHero from '@/components/PageHero';
import { FileText, AlertTriangle, Scale, Package, CreditCard, Shield, Mail, Calendar } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen transition-colors duration-300">
      <PageHero title="Terms & Conditions" subtitle="The rules that govern use of our services." />
      
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16">
        {/* Last Updated */}
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar size={16} className="text-brand-red" />
            <span>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300">
          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white flex items-center gap-3">
              <FileText className="text-brand-red" size={28} />
              Introduction
            </h2>
            <p className="leading-relaxed">
              Welcome to Sand Global Express. These Terms and Conditions ("Terms") govern your access to and use of our logistics services, website, mobile applications, and related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
            </p>
            <p className="leading-relaxed">
              If you do not agree to these Terms, you may not use our Services. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By creating an account, placing an order, or using any of our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you are using our Services on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms.
            </p>
          </section>

          {/* Service Description */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white flex items-center gap-3">
              <Package className="text-brand-red" size={28} />
              2. Service Description
            </h2>
            <p className="leading-relaxed">Sand Global Express provides comprehensive logistics and shipping services, including:</p>
            <ul className="list-disc pl-6 space-y-2 ml-4">
              <li>Air, ocean, and road freight services</li>
              <li>Warehousing and fulfillment solutions</li>
              <li>Real-time shipment tracking</li>
              <li>Customs clearance and documentation</li>
              <li>Last-mile delivery services</li>
              <li>Supply chain management tools</li>
            </ul>
            <p className="leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any aspect of our Services at any time without prior notice.
            </p>
          </section>

          {/* User Accounts */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">3. User Accounts</h2>
            <div className="space-y-3">
              <p className="leading-relaxed"><strong>Account Creation:</strong> To use certain Services, you must create an account and provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials.</p>
              <p className="leading-relaxed"><strong>Account Security:</strong> You are responsible for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.</p>
              <p className="leading-relaxed"><strong>Account Termination:</strong> We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason we deem necessary.</p>
            </div>
          </section>

          {/* Shipping Terms */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">4. Shipping Terms and Conditions</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-semibold text-brand-black dark:text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="text-yellow-600" size={20} />
                  Prohibited Items
                </h3>
                <p className="text-sm leading-relaxed mb-2">The following items are strictly prohibited:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm ml-4">
                  <li>Hazardous materials (explosives, flammable substances, toxic materials)</li>
                  <li>Illegal drugs and controlled substances</li>
                  <li>Weapons, firearms, and ammunition</li>
                  <li>Perishable items requiring special handling (unless specifically arranged)</li>
                  <li>Cash, currency, and negotiable instruments</li>
                  <li>Precious metals and stones (unless properly declared and insured)</li>
                  <li>Live animals (except with prior written approval)</li>
                  <li>Items prohibited by local or international law</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-brand-black dark:text-white mb-2">Packaging Requirements</h3>
                <p className="leading-relaxed mb-2">All shipments must be:</p>
                <ul className="list-disc pl-6 space-y-2 ml-4">
                  <li>Properly packaged to withstand normal handling and transit</li>
                  <li>Clearly labeled with accurate sender and recipient information</li>
                  <li>Compliant with size and weight restrictions for the selected service</li>
                  <li>Accompanied by accurate customs documentation when required</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-brand-black dark:text-white mb-2">Customs and Regulatory Compliance</h3>
                <p className="leading-relaxed">
                  You are responsible for ensuring all shipments comply with applicable customs regulations, import/export laws, and trade restrictions. We may inspect shipments and refuse to transport items that violate these requirements. Additional fees may apply for customs clearance services.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing and Payment */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white flex items-center gap-3">
              <CreditCard className="text-brand-red" size={28} />
              5. Pricing and Payment
            </h2>
            <div className="space-y-3">
              <p className="leading-relaxed"><strong>Pricing:</strong> All prices are quoted in the currency specified and are subject to change without notice. Final charges may vary based on actual weight, dimensions, destination, and additional services requested.</p>
              <p className="leading-relaxed"><strong>Payment Terms:</strong> Payment is due at the time of booking unless you have an approved credit account. We accept major credit cards, bank transfers, and other payment methods as specified.</p>
              <p className="leading-relaxed"><strong>Additional Charges:</strong> Additional fees may apply for customs duties, taxes, storage, redelivery, address corrections, and other services. These charges are your responsibility.</p>
              <p className="leading-relaxed"><strong>Refunds:</strong> Refund policies vary by service type. Contact customer service for specific refund terms applicable to your shipment.</p>
            </div>
          </section>

          {/* Liability and Insurance */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white flex items-center gap-3">
              <Scale className="text-brand-red" size={28} />
              6. Liability and Insurance
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-l-4 border-brand-red">
                <h3 className="font-semibold text-brand-black dark:text-white mb-2">Limited Liability</h3>
                <p className="text-sm leading-relaxed">
                  Our liability for loss, damage, or delay is limited to the lesser of: (a) the actual value of the shipment, (b) the declared value (if declared and additional fees paid), or (c) the maximum liability amount specified in our service terms. We are not liable for indirect, consequential, or special damages.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-l-4 border-brand-red">
                <h3 className="font-semibold text-brand-black dark:text-white mb-2">Insurance</h3>
                <p className="text-sm leading-relaxed">
                  Basic coverage is included with all shipments up to a specified limit. For shipments exceeding this limit or requiring additional protection, you may purchase additional insurance. Claims must be submitted within 30 days of delivery (or expected delivery date for lost items) with supporting documentation.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-l-4 border-brand-red">
                <h3 className="font-semibold text-brand-black dark:text-white mb-2">Force Majeure</h3>
                <p className="text-sm leading-relaxed">
                  We are not liable for delays or failures in performance resulting from circumstances beyond our reasonable control, including natural disasters, war, terrorism, labor strikes, government actions, or carrier failures.
                </p>
              </div>
            </div>
          </section>

          {/* Service Level Commitments */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">7. Service Level Commitments</h2>
            <p className="leading-relaxed">
              Estimated delivery times are provided for guidance only and are not guaranteed. Actual delivery times may vary due to factors including customs clearance, weather conditions, carrier schedules, and destination accessibility. Service-level commitments are subject to carrier and customs constraints beyond our control.
            </p>
            <p className="leading-relaxed">
              Express and time-definite services include specific guarantees with compensation terms outlined in the service agreement. Standard services do not include delivery time guarantees.
            </p>
          </section>

          {/* Claims Process */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">8. Claims Process</h2>
            <p className="leading-relaxed">To file a claim for loss, damage, or delay:</p>
            <ol className="list-decimal pl-6 space-y-2 ml-4">
              <li>Submit your claim within the applicable time limit (typically 30 days for damage, 60 days for loss)</li>
              <li>Provide proof of value, including invoices, receipts, or appraisals</li>
              <li>Provide photographs of damaged items and packaging (if applicable)</li>
              <li>Include all relevant documentation, including tracking information and delivery confirmation</li>
            </ol>
            <p className="leading-relaxed">
              We will investigate all claims promptly and respond within 30 business days. Claims may be denied if submitted after the deadline or if insufficient documentation is provided.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">9. Intellectual Property</h2>
            <p className="leading-relaxed">
              All content, trademarks, logos, and intellectual property on our Services are owned by Sand Global Express or our licensors. You may not use, reproduce, or distribute any content without our prior written permission.
            </p>
          </section>

          {/* Acceptable Use */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">10. Acceptable Use</h2>
            <p className="leading-relaxed">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 ml-4">
              <li>Use our Services for any illegal or unauthorized purpose</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Interfere with or disrupt our Services or servers</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Transmit viruses, malware, or harmful code</li>
              <li>Use automated systems to access our Services without permission</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          {/* Termination */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">11. Termination</h2>
            <p className="leading-relaxed">
              We may terminate or suspend your access to our Services immediately, without prior notice, for any breach of these Terms. You may terminate your account at any time by contacting customer service. Upon termination, your right to use the Services will cease immediately.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">12. Dispute Resolution</h2>
            <p className="leading-relaxed">
              Any disputes arising from these Terms or our Services shall be resolved through good faith negotiation. If negotiation fails, disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales, and shall be governed by English law.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-4 p-6 bg-brand-red/10 dark:bg-brand-red/20 rounded-lg border border-brand-red/20">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white flex items-center gap-3">
              <Mail className="text-brand-red" size={28} />
              Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="space-y-2">
              <p className="font-semibold text-brand-black dark:text-white">Sand Global Express</p>
              <p>Email: <a href="mailto:legal@sandgloexpress.com" className="text-brand-red hover:underline">legal@sandgloexpress.com</a></p>
              <p>Address: Coldbath Square, London, United Kingdom</p>
              <p>Phone: +44 7448 88561</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


