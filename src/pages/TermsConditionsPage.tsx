import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export default function TermsConditionsPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Terms & Conditions", url: "/terms-and-conditions" }
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-8 md:py-20">
      <SEO 
        title="Terms & Conditions of Service"
        description="Review the Terms & Conditions governing New Bharat Electricals. Outlines procurement clauses, licensed commercial contracting rules, and warranty policy specifications."
        keywords="New Bharat terms of service, commercial contract clauses, warranty rules"
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-[800px] mx-auto px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md border-none p-5 md:p-12"
        >
          <div className="mb-6 md:mb-10 border-b border-gray-100 pb-6 md:pb-8">
            <h1 className="text-2xl md:text-4xl font-heading font-black text-gray-900 uppercase tracking-tight mb-3 md:mb-4">
              Terms & Conditions
            </h1>
            <p className="text-gray-700 font-medium text-xs md:text-sm">Last Updated: July 3, 2026</p>
          </div>

          <div className="prose prose-gray max-w-none text-gray-900 font-medium space-y-6 md:space-y-8">
            <p className="leading-relaxed text-sm md:text-lg">
              Welcome to <strong>New Bharat Electricals</strong>. By accessing or using our website, purchasing our products, or using our services, you agree to comply with these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website or services.
            </p>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">1. About Us</h2>
              <p className="leading-relaxed text-sm md:text-base">
                New Bharat Electricals is engaged in the sale of electrical products, including inverters, batteries, and solar power solutions. We also provide professional solar panel installation and related services.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">2. Products & Services</h2>
              <p className="leading-relaxed mb-3 text-sm md:text-base">We offer products and services including, but not limited to:</p>
              <ul className="list-disc pl-5 space-y-2 mb-3 text-sm md:text-base">
                <li>Inverters</li>
                <li>Batteries</li>
                <li>Solar Panels</li>
                <li>Solar System Installation</li>
                <li>Solar Maintenance Services</li>
                <li>Electrical Accessories</li>
              </ul>
              <p className="leading-relaxed text-sm md:text-base">Product availability may change without prior notice.</p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">3. Pricing</h2>
              <p className="leading-relaxed text-sm md:text-base">
                All prices displayed on our website are subject to change without prior notice. We reserve the right to correct any pricing errors or inaccuracies at any time.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">4. Orders</h2>
              <p className="leading-relaxed text-sm md:text-base">
                Orders are subject to acceptance and product availability. We reserve the right to cancel or refuse any order due to stock unavailability, pricing errors, suspected fraud, or other unforeseen circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">5. Payment</h2>
              <p className="leading-relaxed text-sm md:text-base">
                Payment must be completed before order processing unless otherwise agreed in writing. We accept the payment methods displayed on our website.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">6. Delivery & Installation</h2>
              <p className="leading-relaxed mb-3 text-sm md:text-base">
                Delivery timelines are estimates and may vary depending on location, product availability, weather conditions, or other operational factors.
              </p>
              <p className="leading-relaxed mb-3 text-sm md:text-base">For solar panel installations:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
                <li>Installation dates are scheduled after order confirmation.</li>
                <li>Customers must provide safe and suitable access to the installation location.</li>
                <li>Delays caused by weather, government approvals, or site conditions are beyond our control.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">7. Warranty</h2>
              <p className="leading-relaxed mb-3 text-sm md:text-base">
                Warranty coverage is provided according to the manufacturer's warranty policy.
              </p>
              <p className="leading-relaxed mb-3 text-sm md:text-base">
                New Bharat Electricals does not provide any warranty beyond what is offered by the product manufacturer unless specifically mentioned in writing.
              </p>
              <p className="leading-relaxed text-sm md:text-base">
                Improper installation, misuse, unauthorized repairs, accidents, water damage, or physical damage may void the warranty.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">8. Returns & Replacements</h2>
              <p className="leading-relaxed mb-3 text-sm md:text-base">
                Returns or replacements are accepted only according to our Return Policy.
              </p>
              <p className="leading-relaxed mb-3 text-sm md:text-base">
                Products must be returned in unused condition with original packaging wherever applicable.
              </p>
              <p className="leading-relaxed text-sm md:text-base">
                Customized or installed products may not be eligible for return unless covered under warranty or required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">9. Customer Responsibilities</h2>
              <p className="leading-relaxed mb-3 text-sm md:text-base">Customers agree to:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
                <li>Provide accurate contact and delivery information.</li>
                <li>Ensure the installation site is safe and accessible.</li>
                <li>Follow all product usage and maintenance instructions.</li>
                <li>Use products only for their intended purpose.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">10. Limitation of Liability</h2>
              <p className="leading-relaxed mb-3 text-sm md:text-base">
                New Bharat Electricals shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services.
              </p>
              <p className="leading-relaxed text-sm md:text-base">
                Our total liability shall not exceed the purchase value of the affected product or service to the extent permitted by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">11. Intellectual Property</h2>
              <p className="leading-relaxed text-sm md:text-base">
                All website content, including logos, images, text, graphics, and designs, is the property of New Bharat Electricals unless otherwise stated. Unauthorized copying, reproduction, or distribution is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">12. Third-Party Products</h2>
              <p className="leading-relaxed text-sm md:text-base">
                Some products sold through our website are manufactured by third-party brands. Trademarks, logos, and warranties belong to their respective owners.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">13. Website Availability</h2>
              <p className="leading-relaxed text-sm md:text-base">
                We strive to keep our website accurate and available at all times; however, we do not guarantee uninterrupted access. We may modify, suspend, or discontinue any part of the website without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">14. Privacy</h2>
              <p className="leading-relaxed text-sm md:text-base">
                Your use of this website is also governed by our <Link to="/privacy-policy" className="text-brand-green hover:underline">Privacy Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">15. Governing Law</h2>
              <p className="leading-relaxed text-sm md:text-base">
                These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts where New Bharat Electricals operates.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">16. Changes to These Terms</h2>
              <p className="leading-relaxed text-sm md:text-base">
                We reserve the right to update or modify these Terms & Conditions at any time. Updated versions will be published on this page with the revised effective date.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">17. Contact Us</h2>
              <p className="leading-relaxed text-sm md:text-base">
                If you have any questions regarding these Terms & Conditions, please contact us using the contact information provided on our website.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-sm md:text-base"><strong>Email:</strong> info@newbharatelectricals.com</p>
                <p className="text-sm md:text-base"><strong>Phone:</strong> +91 94570 02000</p>
                <Link to="/contact" className="inline-block mt-3 text-brand-green font-bold hover:underline text-sm md:text-base">
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
