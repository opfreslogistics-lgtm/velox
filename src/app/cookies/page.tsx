import React from 'react';
import PageHero from '@/components/PageHero';
import { Cookie, Settings, BarChart, Shield, Eye, Mail, Calendar } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="bg-white dark:bg-brand-black min-h-screen transition-colors duration-300">
      <PageHero title="Cookie Policy" subtitle="How we use cookies and similar technologies." />
      
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
              <Cookie className="text-brand-red" size={28} />
              Introduction
            </h2>
            <p className="leading-relaxed">
              This Cookie Policy explains how Sand Global Express ("we," "our," or "us") uses cookies and similar tracking technologies on our website and mobile applications. This policy should be read alongside our Privacy Policy, which provides additional information about how we collect and use personal information.
            </p>
            <p className="leading-relaxed">
              By using our website and services, you consent to the use of cookies in accordance with this policy. If you do not agree to our use of cookies, you should disable cookies in your browser settings or refrain from using our website.
            </p>
          </section>

          {/* What Are Cookies */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">What Are Cookies?</h2>
            <p className="leading-relaxed">
              Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies allow websites to recognize your device and store some information about your preferences or past actions.
            </p>
            <p className="leading-relaxed">
              We also use similar technologies such as web beacons, pixel tags, and local storage, which function similarly to cookies and are covered by this policy.
            </p>
          </section>

          {/* Types of Cookies We Use */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white flex items-center gap-3">
              <Settings className="text-brand-red" size={28} />
              Types of Cookies We Use
            </h2>
            
            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                <h3 className="text-xl font-semibold text-brand-black dark:text-white mb-3 flex items-center gap-2">
                  <Shield className="text-green-600" size={24} />
                  1. Essential Cookies
                </h3>
                <p className="leading-relaxed mb-3">
                  These cookies are strictly necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-brand-black dark:text-white">Purpose:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm ml-4">
                    <li>Maintain user session and authentication</li>
                    <li>Remember login credentials and preferences</li>
                    <li>Ensure website security and prevent fraud</li>
                    <li>Enable shopping cart functionality</li>
                    <li>Load balance and route traffic</li>
                  </ul>
                  <p className="text-sm mt-3"><strong>Duration:</strong> Session cookies (deleted when you close your browser) and persistent cookies (remain until expiration or deletion)</p>
                  <p className="text-sm"><strong>Can be disabled:</strong> No - these cookies are essential for the website to function</p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold text-brand-black dark:text-white mb-3 flex items-center gap-2">
                  <BarChart className="text-blue-600" size={24} />
                  2. Analytics and Performance Cookies
                </h3>
                <p className="leading-relaxed mb-3">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-brand-black dark:text-white">Purpose:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm ml-4">
                    <li>Track website traffic and user behavior</li>
                    <li>Analyze which pages are most popular</li>
                    <li>Identify technical issues and improve performance</li>
                    <li>Measure the effectiveness of our marketing campaigns</li>
                    <li>Understand user preferences and improve user experience</li>
                  </ul>
                  <p className="text-sm mt-3"><strong>Examples:</strong> Google Analytics, Adobe Analytics</p>
                  <p className="text-sm"><strong>Duration:</strong> Typically 1-2 years</p>
                  <p className="text-sm"><strong>Can be disabled:</strong> Yes - you can opt out through your browser settings or our cookie preferences</p>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-xl font-semibold text-brand-black dark:text-white mb-3 flex items-center gap-2">
                  <Settings className="text-purple-600" size={24} />
                  3. Functional Cookies
                </h3>
                <p className="leading-relaxed mb-3">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences and choices.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-brand-black dark:text-white">Purpose:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm ml-4">
                    <li>Remember your language and region preferences</li>
                    <li>Store your shipping address and contact information</li>
                    <li>Remember your display preferences (dark mode, font size)</li>
                    <li>Enable chat support and customer service features</li>
                    <li>Remember your recent searches and tracking numbers</li>
                  </ul>
                  <p className="text-sm mt-3"><strong>Duration:</strong> Typically 30 days to 1 year</p>
                  <p className="text-sm"><strong>Can be disabled:</strong> Yes - but this may affect website functionality</p>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                <h3 className="text-xl font-semibold text-brand-black dark:text-white mb-3 flex items-center gap-2">
                  <Eye className="text-orange-600" size={24} />
                  4. Marketing and Advertising Cookies
                </h3>
                <p className="leading-relaxed mb-3">
                  These cookies are used to deliver advertisements that are relevant to you and your interests, and to measure the effectiveness of advertising campaigns.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-brand-black dark:text-white">Purpose:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm ml-4">
                    <li>Track your browsing activity across websites</li>
                    <li>Build a profile of your interests</li>
                    <li>Show you relevant advertisements</li>
                    <li>Limit the number of times you see an ad</li>
                    <li>Measure the effectiveness of advertising campaigns</li>
                  </ul>
                  <p className="text-sm mt-3"><strong>Examples:</strong> Facebook Pixel, Google Ads, LinkedIn Insight Tag</p>
                  <p className="text-sm"><strong>Duration:</strong> Typically 30-90 days, but may persist longer</p>
                  <p className="text-sm"><strong>Can be disabled:</strong> Yes - you can opt out through your browser settings or our cookie preferences</p>
                </div>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">Third-Party Cookies</h2>
            <p className="leading-relaxed">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver advertisements, and provide enhanced functionality. These third parties may set their own cookies or similar technologies on your device.
            </p>
            <p className="leading-relaxed">Third-party services we use include:</p>
            <ul className="list-disc pl-6 space-y-2 ml-4">
              <li><strong>Analytics Providers:</strong> Google Analytics, Adobe Analytics</li>
              <li><strong>Advertising Networks:</strong> Google Ads, Facebook Ads, LinkedIn Ads</li>
              <li><strong>Social Media:</strong> Facebook, Twitter, LinkedIn (for social sharing features)</li>
              <li><strong>Payment Processors:</strong> Stripe, PayPal (for secure payment processing)</li>
              <li><strong>Customer Support:</strong> Live chat and helpdesk services</li>
            </ul>
            <p className="leading-relaxed text-sm text-gray-600 dark:text-gray-400">
              These third parties have their own privacy policies and cookie practices. We encourage you to review their policies to understand how they use cookies and your information.
            </p>
          </section>

          {/* Managing Cookies */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">Managing Your Cookie Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-brand-black dark:text-white mb-2">Cookie Preferences Center</h3>
                <p className="leading-relaxed mb-3">
                  You can manage your cookie preferences through our Cookie Preferences Center, accessible via the cookie banner or in your account settings. You can choose to accept or reject different categories of cookies (except essential cookies, which are required).
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-brand-black dark:text-white mb-2">Browser Settings</h3>
                <p className="leading-relaxed mb-2">Most web browsers allow you to control cookies through their settings. You can:</p>
                <ul className="list-disc pl-6 space-y-2 ml-4">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies only</li>
                  <li>Delete existing cookies</li>
                  <li>Set your browser to notify you when cookies are set</li>
                </ul>
                <p className="leading-relaxed mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <strong>Note:</strong> Blocking or deleting cookies may impact your experience on our website. Some features may not function properly if cookies are disabled.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-brand-black dark:text-white mb-2">Opt-Out Links</h3>
                <p className="leading-relaxed mb-2">You can opt out of specific third-party cookies:</p>
                <ul className="list-disc pl-6 space-y-2 ml-4">
                  <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Google Analytics Opt-out</a></li>
                  <li><strong>Google Ads:</strong> <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Google Ads Settings</a></li>
                  <li><strong>Facebook:</strong> <a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Facebook Ad Preferences</a></li>
                  <li><strong>Network Advertising Initiative:</strong> <a href="http://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">NAI Opt-Out</a></li>
                </ul>
              </div>
            </div>
          </section>

          {/* Mobile Devices */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">Mobile Devices</h2>
            <p className="leading-relaxed">
              If you access our website through a mobile device, you may need to adjust your cookie settings through your mobile browser. Additionally, mobile applications may use similar technologies such as device identifiers and advertising IDs, which you can manage through your device settings.
            </p>
          </section>

          {/* Updates to This Policy */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white">Updates to This Cookie Policy</h2>
            <p className="leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-4 p-6 bg-brand-red/10 dark:bg-brand-red/20 rounded-lg border border-brand-red/20">
            <h2 className="text-3xl font-bold text-brand-black dark:text-white flex items-center gap-3">
              <Mail className="text-brand-red" size={28} />
              Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
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


