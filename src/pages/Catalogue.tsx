import { motion } from 'motion/react';
import { Download, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export default function Catalogue() {
  const catalogues = [
    { title: "Power Solutions 2024", desc: "Complete range of Inverters & UPS", type: "PDF", size: "4.2 MB" },
    { title: "Solar Specifications", desc: "Detailed specs for Panels & PCUs", type: "PDF", size: "3.8 MB" },
    { title: "Mobility & EV Batteries", desc: "E-Rickshaw & Automotive battery catalog", type: "PDF", size: "2.1 MB" },
    { title: "Electrical Accessories", desc: "Switches, cables, and connectors", type: "PDF", size: "5.5 MB" }
  ];

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Product Catalogues", url: "/catalogue" }
  ];

  return (
    <>
      <SEO 
        title="Product Catalogues & Spec Sheets"
        description="Download latest product brochures, technical specification sheets, solar plant manuals, and Amaze inverter guides from New Bharat Electricals."
        keywords="electrical product catalogue, inverter spec sheets, solar installation manuals PDF, New Bharat brochures"
        breadcrumbs={breadcrumbs}
      />
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
        <div className="w-full bg-brand-dark py-12 md:py-20 px-4 md:px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-5xl font-heading font-bold text-white mb-3 md:mb-4"
            style={{ color: '#FFFFFF' }}
          >
            Product Catalogues
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#D1D5DB] max-w-2xl mx-auto text-sm md:text-lg font-medium"
          >
            Download our latest product brochures and technical specification sheets.
          </motion.p>
        </div>

        <div className="max-w-5xl w-full mx-auto px-4 md:px-6 py-10 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {catalogues.map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-4 md:p-6 rounded-xl shadow-md border-none flex items-start hover:shadow-md transition-shadow"
              >
                <div className="bg-brand-gray p-3 md:p-4 rounded-xl md:rounded-2xl text-brand-green mr-3 sm:mr-6 flex-shrink-0">
                  <FileText size={24} className="md:w-8 md:h-8" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-heading font-bold text-gray-900 text-base md:text-lg mb-1">{cat.title}</h3>
                  <p className="text-gray-700 font-medium text-sm mb-3 md:mb-4">{cat.desc}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] md:text-xs font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">{cat.type} • {cat.size}</span>
                    <button className="flex items-center text-brand-green font-semibold text-xs md:text-sm hover:text-brand-green-dark transition-colors">
                      Download <Download size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 md:mt-20 text-center bg-white p-6 md:p-12 rounded-2xl shadow-md border-none">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-gray-900 mb-3 md:mb-4">Looking for something specific?</h2>
            <p className="text-gray-900 font-medium mb-6 md:mb-8 max-w-lg mx-auto text-sm md:text-base">Browse our categories online to see the latest available products and solutions.</p>
            <Link to="/power-solutions" className="inline-flex items-center bg-brand-green text-white font-bold py-3 px-6 md:px-8 rounded-xl md:rounded-2xl hover:bg-brand-green-dark transition-colors">
              View Online Products <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
