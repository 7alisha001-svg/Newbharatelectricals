import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen py-12 md:py-20">
      <Helmet>
        <title>Privacy Policy | New Bharat Electricals</title>
        <meta name="description" content="Privacy Policy of New Bharat Electricals. Learn how we handle and protect your personal information." />
      </Helmet>

      <div className="max-w-[800px] mx-auto px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md border-none p-8 md:p-12"
        >
          <div className="mb-10 border-b border-gray-100 pb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 uppercase tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-700 font-medium text-sm">Last Updated: July 3, 2026</p>
          </div>

          <div className="prose prose-gray max-w-none text-gray-900 font-medium space-y-8">
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">1. Introduction</h2>
              <p className="leading-relaxed text-lg">
                Welcome to <strong>New Bharat Electricals</strong>. We value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, purchase our electrical and solar products, or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">2. Information We Collect</h2>
              <p className="leading-relaxed mb-3">To provide you with the best possible service, we collect the following types of information:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Personal Information:</strong> Your name, phone number, email address, and billing/shipping address provided during account creation, inquiries, or checkout.</li>
                <li><strong>Order Details:</strong> Information regarding the products and services you purchase, such as inverters, batteries, solar panels, and installation requests.</li>
                <li><strong>Payment Information:</strong> We do not store full credit card or bank details. Payment processing is securely handled by our trusted third-party payment providers.</li>
                <li><strong>Website Usage Information:</strong> We automatically collect data about your interactions with our website, such as IP address, browser type, pages viewed, and device information to help us improve our platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">3. How We Use Your Information</h2>
              <p className="leading-relaxed mb-3">Your information is strictly used to deliver and enhance our services. Specifically, we use it for:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Processing and fulfilling your orders.</li>
                <li>Providing customer support and responding to inquiries.</li>
                <li>Ensuring secure product delivery and scheduling solar panel installations.</li>
                <li>Managing warranty services and maintenance requests.</li>
                <li>Improving our website, customer experience, and service offerings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">4. Cookies and Tracking Technologies</h2>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some parts of our website may not function properly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">5. Sharing of Information with Third Parties</h2>
              <p className="leading-relaxed mb-3">
                <strong>We respect your privacy and will never sell your personal data to third parties.</strong>
              </p>
              <p className="leading-relaxed mb-3">
                We only share your information with trusted service providers who assist us in operating our business. These include:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Delivery Partners:</strong> For shipping products to your designated address.</li>
                <li><strong>Payment Gateways:</strong> For securely processing your transactions.</li>
                <li><strong>Service Technicians:</strong> For scheduling solar installations and maintenance.</li>
              </ul>
              <p className="leading-relaxed mt-3">
                These third parties are authorized to use your information strictly as necessary to provide these services to us and are bound by confidentiality agreements. We may also disclose your information if required by law or to protect our legal rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">6. Data Security</h2>
              <p className="leading-relaxed">
                We implement robust security measures, including secure socket layer (SSL) technology and industry-standard encryption, to protect your personal information from unauthorized access, alteration, disclosure, or destruction. While we strive to use commercially acceptable means to protect your personal data, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">7. Customer Rights</h2>
              <p className="leading-relaxed mb-3">Depending on applicable laws in India, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access the personal information we hold about you.</li>
                <li>Request corrections to any inaccurate or incomplete data.</li>
                <li>Request the deletion of your personal data, subject to legal and operational requirements.</li>
                <li>Opt-out of receiving promotional communications at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">8. Data Retention</h2>
              <p className="leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with our legal obligations, resolve disputes, and enforce our agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">9. Third-Party Links</h2>
              <p className="leading-relaxed">
                Our website may contain links to external sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content or privacy practices of any third-party sites or services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">10. Children's Privacy</h2>
              <p className="leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal identifiable information from children. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">11. Changes to This Privacy Policy</h2>
              <p className="leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">12. Contact Information</h2>
              <p className="leading-relaxed">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="mb-2"><strong>New Bharat Electricals</strong></p>
                <p><strong>Email:</strong> info@newbharatelectricals.com</p>
                <p><strong>Phone:</strong> +91 94570 02000</p>
                <Link to="/contact" className="inline-block mt-4 text-brand-green font-bold hover:underline">
                  Contact Us &rarr;
                </Link>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
