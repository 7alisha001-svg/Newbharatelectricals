import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Download, FileText, ArrowRight } from 'lucide-react';
import { formatSlugToTitle } from '../utils/formatters';
import { subcategoryDataMap } from '../data/products';

export default function BrandPage() {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const title = formatSlugToTitle(brandSlug || 'amaze');

  const catalogues = [
    { title: "Power Solutions", desc: "Complete range of power solutions, inverters & UPS.", type: "PDF", file: `/pdfs/${title} Power Solutions.pdf` },
    { title: "Solar Solutions", desc: "Detailed specs for solar panels and solutions.", type: "PDF", file: `/pdfs/${title} Solar Solutions.pdf` },
    { title: "3 Phase Inverters", desc: "Heavy-duty 3 phase inverters catalogue.", type: "PDF", file: `/pdfs/${title} 3 Phase Inverters.pdf` }
  ];

  const allProducts = Object.values(subcategoryDataMap).flatMap(sub => sub.products);
  const brandProducts = allProducts.filter(p => p.name.toLowerCase().includes(title.toLowerCase()));

  const demoProducts = [
    { id: '1', name: 'AN STAR 11075', desc: '10 KVA Pure Sine Wave Digital Inverter', image: '/images/amaze-an-star-1475-1.jpg' },
    { id: '2', name: `${title} Tubular Battery`, desc: '150Ah Tall Tubular Battery', image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' },
    { id: '3', name: `${title} Solar Panel`, desc: '330W Polycrystalline Solar Panel', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' },
    { id: '4', name: `${title} PCU`, desc: 'Solar Power Conditioning Unit', image: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' },
  ];

  const productsToDisplay = brandProducts.length > 0 ? brandProducts : demoProducts;

  return (
    <>
      <Helmet>
        <title>{title} | Brands | New Bharat Electricals</title>
        <meta name="description" content={`Explore ${title} catalogues and products.`} />
      </Helmet>
      
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center pb-20">
        <div className="w-full bg-brand-dark py-20 px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Download our latest product brochures and explore {title} products.
          </motion.p>
        </div>

        <div className="max-w-6xl w-full mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3 mb-8">
            Catalogues
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {catalogues.map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="flex items-start mb-4">
                  <div className="bg-brand-gray p-4 rounded-lg text-brand-green mr-4 flex-shrink-0">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">{cat.title}</h3>
                    <p className="text-gray-500 text-sm">{cat.desc}</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{cat.type}</span>
                  <a href={cat.file} target="_blank" rel="noreferrer" className="flex items-center bg-brand-green/10 text-brand-green px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-green hover:text-white transition-colors">
                    <Download size={14} className="mr-1.5" /> Open / Download
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3">
              {title} Products
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {productsToDisplay.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-brand-green transition-all group flex flex-col"
              >
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={('imageUrl' in product) ? product.imageUrl : (product as any).image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{('description' in product) ? product.description : (product as any).desc}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-brand-green">{'price' in product ? (product as any).price : 'Call for Price'}</span>
                    <button className="text-xs font-bold text-gray-600 hover:text-brand-green transition-colors flex items-center">
                      View Details <ArrowRight size={12} className="ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
