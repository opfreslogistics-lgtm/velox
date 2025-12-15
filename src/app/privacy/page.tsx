import React from 'react';
import PageHero from '@/components/PageHero';
import { Shield, Lock, Eye, FileText, Mail, Calendar } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen transition-colors duration-300">
      <PageHero title="Privacy Policy" subtitle="How we collect, use, and protect your data." />
      
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
              <Shield className="text-brand-red" size={28} />
              Introduction
            </h2>
            <p className="leading-relaxed">
              At Sand Global Express ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our logistics and shipping services, website, and mobile applications.
            </p>
            <p className="leading-relaxed">
              By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white flex items-center gap-3">
              <FileText className="text-brand-red" size={28} />
              Information We Collect
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-brand-black dark:text-white mb-2">1. Personal Information</h3>
                <p className="leading-relaxed mb-2">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2 ml-4">
                  <li><strong>Account Information:</strong> Name, email address, phone number, billing address, and payment information</li>
                  <li><strong>Shipment Information:</strong> Sender and recipient details, package contents, dimensions, weight, and delivery addresses</li>
                  <li><strong>Business Information:</strong> Company name, tax identification numbers, and business registration details (for business accounts)</li>
                  <li><strong>Communication Data:</strong> Records of correspondence, customer service interactions, and feedback</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-brand-black dark:text-white mb-2">2. Automatically Collected Information</h3>
                <p className="leading-relaxed mb-2">When you use our services, we automatically collect certain information:</p>
                <ul className="list-disc pl-6 space-y-2 ml-4">
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers, and mobile network information</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, search queries, and feature usage</li>
                  <li><strong>Location Data:</strong> GPS coordinates, IP-based location, and location-based services data (with your permission)</li>
                  <li><strong>Tracking Data:</strong> Shipment tracking information, delivery confirmations, and status updates</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-brand-black dark:text-white mb-2">3. Information from Third Parties</h3>
                <p className="leading-relaxed mb-2">We may receive information about you from:</p>
                <ul className="list-disc pl-6 space-y-2 ml-4">
                  <li>Payment processors and financial institutions</li>
                  <li>Carriers and logistics partners</li>
                  <li>Credit bureaus and identity verification services</li>
                  <li>Social media platforms (if you connect your account)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white flex items-center gap-3">
              <Eye className="text-brand-red" size={28} />
              How We Use Your Information
            </h2>
            <p className="leading-relaxed">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 ml-4">
              <li><strong>Service Delivery:</strong> To process shipments, provide tracking services, facilitate deliveries, and manage your account</li>
              <li><strong>Communication:</strong> To send shipment updates, delivery notifications, service announcements, and respond to your inquiries</li>
              <li><strong>Payment Processing:</strong> To process payments, manage billing, and prevent fraud</li>
              <li><strong>Service Improvement:</strong> To analyze usage patterns, improve our services, develop new features, and enhance user experience</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations, customs regulations, and international shipping requirements</li>
              <li><strong>Security:</strong> To detect, prevent, and address security threats, fraud, and unauthorized access</li>
              <li><strong>Marketing:</strong> To send promotional materials, special offers, and newsletters (with your consent, which you can withdraw at any time)</li>
            </ul>
          </section>

          {/* Data Sharing and Disclosure */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">Data Sharing and Disclosure</h2>
            <p className="leading-relaxed">We do not sell your personal information. We may share your information only in the following circumstances:</p>
            
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-l-4 border-brand-red">
                <h3 className="font-semibold text-brand-black dark:text-white mb-2">Service Providers</h3>
                <p className="text-sm leading-relaxed">We share information with trusted third-party service providers who assist us in operating our business, including carriers, payment processors, cloud hosting providers, and analytics services. These providers are contractually obligated to protect your information.</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-l-4 border-brand-red">
                <h3 className="font-semibold text-brand-black dark:text-white mb-2">Legal Requirements</h3>
                <p className="text-sm leading-relaxed">We may disclose information when required by law, court order, or government regulation, or to protect our rights, property, or safety, or that of our users or others.</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-l-4 border-brand-red">
                <h3 className="font-semibold text-brand-black dark:text-white mb-2">Business Transfers</h3>
                <p className="text-sm leading-relaxed">In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-l-4 border-brand-red">
                <h3 className="font-semibold text-brand-black dark:text-white mb-2">With Your Consent</h3>
                <p className="text-sm leading-relaxed">We may share information with third parties when you explicitly consent to such sharing.</p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white flex items-center gap-3">
              <Lock className="text-brand-red" size={28} />
              Data Security
            </h2>
            <p className="leading-relaxed">We implement industry-standard security measures to protect your information:</p>
            <ul className="list-disc pl-6 space-y-2 ml-4">
              <li><strong>Encryption:</strong> All data is encrypted in transit using TLS/SSL protocols and at rest using AES-256 encryption</li>
              <li><strong>Access Controls:</strong> Strict access controls and authentication mechanisms limit data access to authorized personnel only</li>
              <li><strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments</li>
              <li><strong>Secure Infrastructure:</strong> Our systems are hosted on secure, compliant cloud infrastructure with redundant backups</li>
              <li><strong>Employee Training:</strong> All employees undergo privacy and security training</li>
            </ul>
            <p className="leading-relaxed text-sm text-gray-600 dark:text-gray-400">
              While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to maintaining the highest standards.
            </p>
          </section>

          {/* Your Rights */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">Your Privacy Rights</h2>
            <p className="leading-relaxed">Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal and contractual obligations)</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
              <li><strong>Objection:</strong> Object to processing of your information for certain purposes</li>
              <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where consent is the legal basis</li>
            </ul>
            <p className="leading-relaxed">
              To exercise these rights, please contact us at <a href="mailto:privacy@sandgloexpress.com" className="text-brand-red hover:underline font-semibold">privacy@sandgloexpress.com</a>. We will respond to your request within 30 days.
            </p>
          </section>

          {/* Data Retention */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">Data Retention</h2>
            <p className="leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. Shipment records are typically retained for 7 years to comply with customs and tax regulations. Account information is retained while your account is active and for a reasonable period thereafter.
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">International Data Transfers</h2>
            <p className="leading-relaxed">
              As a global logistics company, your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We ensure appropriate safeguards are in place, including standard contractual clauses and adequacy decisions, to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">Children's Privacy</h2>
            <p className="leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete such information promptly.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">Changes to This Privacy Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-4 p-6 bg-brand-red/10 dark:bg-brand-red/20 rounded-lg border border-brand-red/20">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white flex items-center gap-3">
              <Mail className="text-brand-red" size={28} />
              Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <p className="font-semibold text-brand-black dark:text-white">Sand Global Express</p>
              <p>Email: <a href="mailto:privacy@sandgloexpress.com" className="text-brand-red hover:underline">privacy@sandgloexpress.com</a></p>
              <p>Address: Coldbath Square, London, United Kingdom</p>
              <p>Phone: +44 7345 518 417</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


