import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Heart, Phone, MessageCircle, SlidersHorizontal, Zap } from 'lucide-react';
import { formatSlugToTitle } from '../utils/formatters';
import { useStore } from '../context/StoreContext';
import { categoryNav } from '../data/navigation';
import { useState } from 'react';

export default function GenericSubCategoryPage() {
  const { category, subcategory } = useParams<{ category: string, subcategory: string }>();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { products: storeProducts, loading } = useStore();
  
  const categoryTitle = formatSlugToTitle(category);
  const defaultSubCategoryTitle = formatSlugToTitle(subcategory);
  const title = defaultSubCategoryTitle;
  
  const description = `Discover our premium line of ${defaultSubCategoryTitle.toLowerCase()}. Engineered for superior performance and unmatched reliability in every condition.`;
  
  const matchCategory = (prodCat: string, urlSubCat: string) => {
    if (!prodCat || !urlSubCat) return false;
    const c1 = prodCat.toLowerCase().replace(/[^a-z0-9]/g, '');
    const c2 = urlSubCat.toLowerCase().replace(/[^a-z0-9]/g, '');
    const s1 = c1.endsWith('s') ? c1.slice(0, -1) : c1;
    const s2 = c2.endsWith('s') ? c2.slice(0, -1) : c2;
    return s1 === s2 || s1.includes(s2) || s2.includes(s1);
  };

  // Find products matching this subcategory (slug matching)
  const products = storeProducts.filter(p => p.slug === subcategory || (p.category && matchCategory(p.category, subcategory || '')));

  
  const defaultFeatures = [
    "Premium quality and high durability",
    "Energy efficient performance",
    "Comprehensive warranty and support",
    "Nationwide service network"
  ];
  const features = defaultFeatures;

  const whatsappMessage = encodeURIComponent(`Hi, I am interested in your ${title} products.`);

  const relatedCategories = category && categoryNav[category] ? categoryNav[category] : [];

  return (
    <>
      <Helmet>
        <title>{title} | {categoryTitle} | New Bharat Electricals</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className="w-full bg-brand-gray/30">
        {/* Search Header Banner */}
      <section className="bg-brand-gray py-6 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
           <div className="text-xl font-heading font-bold text-gray-800">{categoryTitle} &gt; {title}</div>
           <div className="flex items-center text-sm font-medium text-gray-500 mt-2">
            <Link to="/" className="hover:text-brand-green transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/${category}`} className="hover:text-brand-green transition-colors">{categoryTitle}</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-green">{title}</span>
          </div>
        </div>
      </section>
      
      {/* Category Banner */}
      <section className="bg-white">
        <div className="w-full h-48 md:h-64 lg:h-80 relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-dark/20 z-10 hidden md:block mix-blend-multiply"></div>
            <motion.img 
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              src={"https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2500&auto=format&fit=crop"} alt={title} className="w-full h-full object-cover origin-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex items-end">
               <div className="max-w-[1600px] w-full mx-auto px-4 lg:px-8 pb-8 z-20">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-heading font-bold text-white mb-2"
                  >
                    {title}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/90 max-w-3xl text-sm md:text-base hidden sm:block"
                  >
                    {description}
                  </motion.p>
               </div>
            </div>
        </div>
      </section>

      {/* Main Content Layout (Sidebar + Product Grid) */}
      <section className="py-10 max-w-[1600px] mx-auto px-4 lg:px-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-900">Products ({products.length})</h3>
           <button 
             onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
             className="flex items-center text-sm font-bold text-brand-green uppercase tracking-wide gap-2 bg-brand-green-light px-4 py-2 rounded"
           >
             <SlidersHorizontal size={16} /> Filters
           </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar - Filters & Categories */}
          <div className={`w-full lg:w-1/4 flex-shrink-0 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm sticky top-24">
               {/* Filter Header */}
               <div className="bg-brand-gray px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="font-heading font-bold text-gray-900 tracking-wide uppercase text-sm">Filters</h4>
               </div>
               
               {/* Categories Filter */}
               <div className="p-6 border-b border-gray-100">
                  <h5 className="font-bold text-gray-800 mb-4">{categoryTitle} Categories</h5>
                  <div className="space-y-3">
                    {relatedCategories.map(cat => (
                      <div key={cat.slug} className="group">
                        <Link 
                           to={`/${category}/${cat.slug}`}
                           className={`flex items-center space-x-3 text-sm transition-colors ${cat.slug === subcategory ? 'text-brand-green font-bold' : 'text-gray-600 hover:text-brand-green'}`}
                        >
                           <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${cat.slug === subcategory ? 'border-brand-green bg-brand-green' : 'border-gray-300 group-hover:border-brand-green'}`}>
                              {cat.slug === subcategory && <CheckCircle2 size={12} className="text-white" />}
                           </div>
                           <span>{cat.name}</span>
                        </Link>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Sort Options Mock */}
               <div className="p-6">
                  <h5 className="font-bold text-gray-800 mb-4">Sort By</h5>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 text-sm text-gray-600 cursor-pointer">
                      <input type="radio" name="sort" className="form-radio text-brand-green focus:ring-brand-green h-4 w-4" defaultChecked />
                      <span>Recommended</span>
                    </label>
                    <label className="flex items-center space-x-3 text-sm text-gray-600 cursor-pointer">
                      <input type="radio" name="sort" className="form-radio text-brand-green focus:ring-brand-green h-4 w-4" />
                      <span>New Arrivals</span>
                    </label>
                    <label className="flex items-center space-x-3 text-sm text-gray-600 cursor-pointer">
                      <input type="radio" name="sort" className="form-radio text-brand-green focus:ring-brand-green h-4 w-4" />
                      <span>Capacity: Low to High</span>
                    </label>
                    <label className="flex items-center space-x-3 text-sm text-gray-600 cursor-pointer">
                      <input type="radio" name="sort" className="form-radio text-brand-green focus:ring-brand-green h-4 w-4" />
                      <span>Capacity: High to Low</span>
                    </label>
                  </div>
               </div>
               
               {/* Quick Info Box */}
               <div className="bg-brand-green text-white p-6 m-4 rounded-lg hidden lg:block">
                  <h5 className="font-bold mb-2">Need Expert Help?</h5>
                  <p className="text-xs text-white/80 mb-4">Our specialized engineers can help you pick the exact model you need.</p>
                  <a href="tel:+919457002000" className="inline-block w-full bg-white text-brand-green text-center text-sm font-bold py-2 rounded shadow-md hover:bg-gray-50 transition-colors">Call Now</a>
               </div>
            </div>
          </div>

          {/* Right Area - Products Grid */}
          <div className="w-full lg:w-3/4">
             {/* SubHeader row for right side */}
             <div className="hidden lg:flex items-center justify-between mb-6 bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm">Showing all <span className="font-bold text-gray-900">{products.length}</span> products in {title}</p>
             </div>

             {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {products.map((product, idx) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col relative"
                    >
                      {/* Product Image */}
                      <div className="h-32 sm:h-56 relative bg-white flex items-center justify-center p-2 sm:p-6 border-b border-gray-100/50">
                        <Link to={`/${category}/${subcategory}/${product.id}`} className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-300 hover:text-brand-green transition-colors z-10">
                           <Heart size={16} className="sm:w-5 sm:h-5" />
                        </Link>
                        <Link to={`/${category}/${subcategory}/${product.id}`} className="w-full h-full block">
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} />
                        </Link>
                      </div>
                      
                      {/* Product Detail */}
                      <div className="p-3 sm:p-6 flex flex-col flex-grow">
                        <Link to={`/${category}/${subcategory}/${product.id}`}>
                          <h3 className="font-heading font-bold text-sm sm:text-lg text-brand-dark mb-1 sm:mb-2 group-hover:text-brand-green transition-colors leading-tight line-clamp-2 sm:line-clamp-1">{product.name}</h3>
                        </Link>
                        
                        <div className="flex items-center justify-between mb-2 sm:mb-3 text-[10px] sm:text-xs text-gray-400 font-medium">
                           <span className="flex items-center text-yellow-500">
                             ★ 5.0 Rating
                           </span>
                           <span className="hidden sm:inline">In Stock</span>
                        </div>

                        {/* Specs List Style */}
                        <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-6">
                          {product.features.slice(0,2).map((feat, i) => (
                            <p key={i} className="text-[10px] sm:text-xs text-gray-500 flex items-center truncate">
                               <span className="w-1 h-1 bg-brand-green rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></span>
                               {feat}
                            </p>
                          ))}
                        </div>
                        
                        {/* Price & Action Area - Pushed to bottom */}
                        <div className="mt-auto border-t border-gray-100 pt-2 sm:pt-4">
                           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-4">
                             <div>
                               <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-wide font-bold">Offer Price</p>
                               <p className="text-brand-green font-bold text-sm sm:text-lg leading-none mt-0.5">Get Quote</p>
                             </div>
                             <p className="hidden sm:block text-xs text-gray-500 text-right max-w-[50%] leading-tight">Inclusive of all taxes</p>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-1 sm:gap-2 mt-2 sm:mt-0">
                             <a href={`https://wa.me/919457002000?text=${whatsappMessage} - ${encodeURIComponent(product.name)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center text-brand-green border border-brand-green font-bold py-1.5 sm:py-2.5 px-1 sm:px-2 rounded hover:bg-brand-green-light transition-colors text-[9px] sm:text-xs uppercase tracking-wide">
                                WhatsApp
                             </a>
                             <Link to={`/${category}/${subcategory}/${product.id}`} className="flex items-center justify-center bg-brand-green text-white font-bold py-1.5 sm:py-2.5 px-1 sm:px-2 rounded hover:bg-brand-green-dark transition-colors text-[9px] sm:text-xs uppercase tracking-wide shadow-md shadow-brand-green/20">
                                Enquiry
                             </Link>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
             ) : (
                <div className="bg-white p-12 rounded-xl border border-gray-100 text-center shadow-sm">
                   <div className="w-20 h-20 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-6 text-brand-green">
                      <Zap size={32} />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Available</h3>
                   <p className="text-gray-500 mb-8 max-w-sm mx-auto">We are currently updating our catalogue for {title}. Please check back soon or contact us directly.</p>
                   <Link to="/contact" className="inline-block bg-brand-dark text-white font-bold py-3 px-8 rounded hover:bg-gray-800 transition-colors">
                      Contact Sales
                   </Link>
                </div>
             )}
          </div>
        </div>
      </section>

      {/* SEO / Details Segment */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
           <div className="max-w-4xl">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">{title} - Detailed Overview</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {description} Our {categoryTitle.toLowerCase()} segment is recognized nationwide for incorporating modern electronics with rugged, heavy-duty industrial components to guarantee uninterrupted performance. Every unit undergoes rigorous quality testing.
              </p>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">Key Benefits</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600">
                    <CheckCircle2 className="text-brand-green mr-2 flex-shrink-0" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-400">Disclaimer: Technical specifications are subject to change. Always refer to the official product catalogue or contact our dealer network in Budaun to confirm capacities and dimensions prior to purchase.</p>
           </div>
        </div>
      </section>
    </div>
    </>
  );
}

