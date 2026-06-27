import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Download, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Catalogue() {
  const catalogues = [
    { title: "Power Solutions 2024", desc: "Complete range of Inverters & UPS", type: "PDF", size: "4.2 MB" },
    { title: "Solar Specifications", desc: "Detailed specs for Panels & PCUs", type: "PDF", size: "3.8 MB" },
    { title: "Mobility & EV Batteries", desc: "E-Rickshaw & Automotive battery catalog", type: "PDF", size: "2.1 MB" },
    { title: "Electrical Accessories", desc: "Switches, cables, and connectors", type: "PDF", size: "5.5 MB" }
  ];

  return (
    <>
      <Helmet>
        <title>Product Catalogues | New Bharat Electricals</title>
        <meta name="description" content="Download our latest product brochures and technical specification sheets for power solutions, solar accessories, and electrical items." />
      </Helmet>
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
        <div className="w-full bg-brand-dark py-20 px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
          >
            Product Catalogues
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Download our latest product brochures and technical specification sheets.
          </motion.p>
        </div>

        <div className="max-w-5xl w-full mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {catalogues.map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start hover:shadow-md transition-shadow"
              >
                <div className="bg-brand-gray p-4 rounded-lg text-brand-green mr-6">
                  <FileText size={32} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">{cat.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{cat.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">{cat.type} • {cat.size}</span>
                    <button className="flex items-center text-brand-green font-semibold text-sm hover:text-brand-green-dark transition-colors">
                      Download <Download size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">Looking for something specific?</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">Browse our categories online to see the latest available products and solutions.</p>
            <Link to="/power-solutions" className="inline-flex items-center bg-brand-green text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-green-dark transition-colors">
              View Online Products <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
