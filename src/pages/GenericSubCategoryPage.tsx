import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { CheckCircle2,Heart,SlidersHorizontal, Zap } from 'lucide-react';
import { formatSlugToTitle } from '../utils/formatters';
import { useStore } from '../context/StoreContext';
import { categoryNav, mainNavLinks } from '../data/navigation';
import { useState } from 'react';

export default function GenericSubCategoryPage() {
  const { category, subcategory } = useParams<{ category: string, subcategory: string }>();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { products: storeProducts, categories: storeCategories, settings } = useStore();
  
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

  // Find products matching the current subcategory (slug matching)
  const products = storeProducts.filter(p => 
    subcategory && (p.slug === subcategory || (p.category && matchCategory(p.category, subcategory)))
  );

  
  const defaultFeatures = [
    "Premium quality and high durability",
    "Energy efficient performance",
    "Comprehensive warranty and support",
    "Nationwide service network"
  ];
  const features = defaultFeatures;

  const whatsappMessage = encodeURIComponent(`Hi, I am interested in your ${title} products.`);

  let relatedCategories: { name: string; slug: string }[] = [];
  
  const baseNavLinks = settings?.social_links?.navigation || mainNavLinks;
  
  if (category === 'solar-solutions') {
    const solarSolutionsLink = baseNavLinks.find(
      (link: any) =>
        link.href === '/solar-solutions' ||
        link.name?.toLowerCase().includes('solar')
    );
    const dropdownCategories = solarSolutionsLink?.dropdownItems?.map((item: any) => {
      const slug = item.href ? item.href.split('/').pop() : '';
      return {
        name: item.name,
        slug: slug || ''
      };
    }) || [];

    const dbSolarCategories = storeCategories
      .filter(c => c.is_active !== false && (c.slug?.startsWith('solar-') || c.slug?.includes('solar')))
      .map(c => ({ name: c.name, slug: c.slug }));

    const mergedCategoriesMap = new Map<string, { name: string; slug: string }>();
    dropdownCategories.forEach(cat => {
      if (cat.slug) mergedCategoriesMap.set(cat.slug, cat);
    });
    dbSolarCategories.forEach(cat => {
      if (cat.slug) mergedCategoriesMap.set(cat.slug, cat);
    });
    
    relatedCategories = Array.from(mergedCategoriesMap.values());
  } else if (category === 'power-solutions') {
    const powerSolutionsLink = baseNavLinks.find(
      (link: any) =>
        link.href === '/power-solutions' ||
        link.name?.toLowerCase().includes('power')
    );
    const dropdownCategories = powerSolutionsLink?.dropdownItems?.map((item: any) => {
      const slug = item.href ? item.href.split('/').pop() : '';
      return {
        name: item.name,
        slug: slug || ''
      };
    }) || [];

    const dbPowerCategories = storeCategories
      .filter(c => c.is_active !== false && !c.slug?.startsWith('solar-') && !c.slug?.includes('solar') && c.slug !== 'amaze')
      .map(c => ({ name: c.name, slug: c.slug }));

    const mergedCategoriesMap = new Map<string, { name: string; slug: string }>();
    dropdownCategories.forEach(cat => {
      if (cat.slug) mergedCategoriesMap.set(cat.slug, cat);
    });
    dbPowerCategories.forEach(cat => {
      if (cat.slug) mergedCategoriesMap.set(cat.slug, cat);
    });
    
    relatedCategories = Array.from(mergedCategoriesMap.values());
  } else {
    relatedCategories = category && categoryNav[category] ? categoryNav[category] : [];
  }

  return (
    <>
      <Helmet>
        <title>{`${title} | ${categoryTitle} | New Bharat Electricals`}</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className="w-full bg-brand-gray/30">
        {/* Search Header Banner */}
      <section className="bg-brand-gray py-6 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
           <div className="text-xl font-heading font-bold text-gray-800">{categoryTitle} &gt; {title}</div>
           <div className="flex items-center text-sm font-medium text-gray-700 font-medium mt-2">
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
        <div className="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-900">Products ({products.length})</h3>
           <button 
             onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
             className="flex items-center text-sm font-bold text-brand-green uppercase tracking-wide gap-2 bg-brand-green-light px-6 py-3 rounded"
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
                  {relatedCategories.length === 0 ? (
                    <div className="text-sm text-gray-700 font-medium italic">No {categoryTitle} categories available.</div>
                  ) : (
                    <div className="space-y-3">
                      {relatedCategories.map(cat => {
                        const count = storeProducts.filter(p => 
                          p.slug === cat.slug || (p.category && matchCategory(p.category, cat.slug))
                        ).length;
                        const isActive = cat.slug === subcategory;

                        return (
                          <div key={cat.slug} className="flex items-center justify-between group">
                            <Link 
                               to={`/${category}/${cat.slug}`}
                               className={`text-sm transition-colors text-left focus:outline-none ${isActive ? 'text-brand-green font-bold' : 'text-gray-800 font-medium hover:text-brand-green'} cursor-pointer`}
                            >
                               <span>{cat.name}</span>
                            </Link>
                            <span className="text-xs text-gray-800 font-medium">({count})</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
               </div>

               {/* Sort Options Mock */}
               <div className="p-6">
                  <h5 className="font-bold text-gray-800 mb-4">Sort By</h5>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 text-sm text-gray-800 font-medium cursor-pointer">
                      <input type="radio" name="sort" className="form-radio text-brand-green focus:ring-brand-green h-4 w-4" defaultChecked />
                      <span>Recommended</span>
                    </label>
                    <label className="flex items-center space-x-3 text-sm text-gray-800 font-medium cursor-pointer">
                      <input type="radio" name="sort" className="form-radio text-brand-green focus:ring-brand-green h-4 w-4" />
                      <span>New Arrivals</span>
                    </label>
                    <label className="flex items-center space-x-3 text-sm text-gray-800 font-medium cursor-pointer">
                      <input type="radio" name="sort" className="form-radio text-brand-green focus:ring-brand-green h-4 w-4" />
                      <span>Capacity: Low to High</span>
                    </label>
                    <label className="flex items-center space-x-3 text-sm text-gray-800 font-medium cursor-pointer">
                      <input type="radio" name="sort" className="form-radio text-brand-green focus:ring-brand-green h-4 w-4" />
                      <span>Capacity: High to Low</span>
                    </label>
                  </div>
               </div>
               
               {/* Quick Info Box */}
               <div className="bg-brand-green text-white p-6 m-4 rounded-2xl hidden lg:block">
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
                <p className="text-gray-700 font-medium text-sm">Showing all <span className="font-bold text-gray-900">{products.length}</span> products in {title}</p>
             </div>

             {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {products.map((product, idx) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-300 group flex flex-col relative transform hover:-translate-y-1"
                    >
                      {/* Product Image */}
                      <div className="h-40 sm:h-56 relative bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4 sm:p-6">
                        <Link to={`/${category}/${subcategory}/${product.id}`} className="absolute top-3 right-3 sm:top-5 sm:right-5 text-gray-400 hover:text-brand-orange hover:scale-110 transition-all z-10 bg-white p-1.5 sm:p-2 rounded-full shadow-sm">
                           <Heart size={18} className="sm:w-5 sm:h-5" />
                        </Link>
                        <Link to={`/${category}/${subcategory}/${product.id}`} className="w-full h-full block flex items-center justify-center">
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" onError={(e) => { const target = e.currentTarget; if (!target.src.includes('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop')) { target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; } }} />
                        </Link>
                      </div>
                      
                      {/* Product Detail */}
                      <div className="p-4 sm:p-6 flex flex-col flex-grow">
                        <Link to={`/${category}/${subcategory}/${product.id}`}>
                          <h3 className="font-heading font-bold text-sm sm:text-lg text-brand-dark mb-2 sm:mb-3 group-hover:text-brand-orange transition-colors leading-tight line-clamp-2">{product.name}</h3>
                        </Link>
                        
                        <div className="flex items-center justify-between mb-3 sm:mb-4 text-[11px] sm:text-xs text-gray-800 font-medium bg-gray-50 px-2 py-1 rounded">
                           <span className="flex items-center text-yellow-500">
                             ★ 5.0 Rating
                           </span>
                           <span className="text-brand-green font-bold uppercase tracking-wider">In Stock</span>
                        </div>

                        {/* Specs List Style */}
                        <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                          {(product.features || []).slice(0,2).map((feat, i) => (
                            <p key={i} className="text-xs sm:text-sm text-gray-700 font-medium flex items-center truncate">
                               <span className="w-1.5 h-1.5 bg-brand-green rounded-full mr-2 flex-shrink-0"></span>
                               {feat}
                            </p>
                          ))}
                        </div>
                        
                        {/* Price & Action Area - Pushed to bottom */}
                        <div className="mt-auto border-t border-gray-100 pt-3 sm:pt-5">
                           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-5">
                             <div>
                               <p className="text-[9px] sm:text-[10px] text-gray-800 uppercase tracking-wide font-bold">Offer Price</p>
                               <p className="text-gray-900 font-black text-base sm:text-xl leading-none mt-1">Get Quote</p>
                             </div>
                             <p className="hidden sm:block text-xs text-gray-600 font-medium text-right max-w-[50%] leading-tight">Inclusive of all taxes</p>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-0">
                             <a href={`https://wa.me/919457002000?text=${whatsappMessage} - ${encodeURIComponent(product.name)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center text-brand-green border-2 border-brand-green font-bold py-2 sm:py-3 px-1 sm:px-2 rounded-xl hover:bg-brand-green-light transition-colors text-[10px] sm:text-xs uppercase tracking-wide">
                                WhatsApp
                             </a>
                             <Link to={`/${category}/${subcategory}/${product.id}`} className="flex items-center justify-center bg-brand-green text-white font-bold py-2 sm:py-3 px-1 sm:px-2 rounded-xl hover:bg-brand-green-dark transition-colors text-[10px] sm:text-xs uppercase tracking-wide shadow-md shadow-brand-green/20 hover:shadow-lg">
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
                   <p className="text-gray-700 font-medium mb-8 max-w-sm mx-auto">We are currently updating our catalogue for {title}. Please check back soon or contact us directly.</p>
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
              <p className="text-gray-800 font-medium mb-6 leading-relaxed">
                {description} Our {categoryTitle.toLowerCase()} segment is recognized nationwide for incorporating modern electronics with rugged, heavy-duty industrial components to guarantee uninterrupted performance. Every unit undergoes rigorous quality testing.
              </p>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">Key Benefits</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-800 font-medium">
                    <CheckCircle2 className="text-brand-green mr-2 flex-shrink-0" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-800">Disclaimer: Technical specifications are subject to change. Always refer to the official product catalogue or contact our dealer network in Budaun to confirm capacities and dimensions prior to purchase.</p>
           </div>
        </div>
      </section>
    </div>
    </>
  );
}

