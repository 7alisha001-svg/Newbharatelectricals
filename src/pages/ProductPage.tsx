import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Share2, MessageCircle, ChevronRight, Home, Minus, Plus, ShoppingCart } from 'lucide-react';
import { formatSlugToTitle } from '../utils/formatters';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { category, subcategory, productId } = useParams<{ category: string, subcategory: string, productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // This is placeholder structural data.
  // It will be replaced naturally when real data is integrated into a unified data structure.
  const product = {
    id: productId || 'an-star-11075',
    name: 'AN STAR 11075',
    sku: `NBE-${productId?.substring(0, 4).toUpperCase() || 'ANS1'}`,
    stockStatus: 'In Stock',
    description: 'The AN STAR 11075 is a high-performance 10 KVA Pure Sine Wave Digital Inverter designed to deliver reliable, uninterrupted power for homes, offices, commercial establishments, and industrial applications. Built with advanced digital technology, it features an intelligent LCD display that provides real-time information about battery status, backup time, charging performance, and load percentage.',
    features: [
      '10 KVA / 120V High-Capacity Power Backup',
      'Pure Sine Wave Output for Sensitive Electronics',
      'Intelligent LCD Display with Real-Time Monitoring',
      'Displays Battery Backup Time, Charging Time & Load Percentage',
      'User-Selectable Battery Charging Current',
      'Super Fast Battery Charging Technology',
      'Adjustable Output Voltage (200V–240V)'
    ],
    specifications: [
      { label: 'Model', value: 'AN STAR 11075' },
      { label: 'Product Type', value: 'Digital Pure Sine Wave Inverter' },
      { label: 'Capacity', value: '10 KVA' },
      { label: 'Output Waveform', value: 'Pure Sine Wave' },
      { label: 'Battery Bank Voltage', value: '120V' },
      { label: 'Number of Batteries', value: '10 × 12V Batteries' },
      { label: 'Dimensions', value: '55.5 × 30 × 60 cm' },
      { label: 'Net Weight', value: '80 kg' },
      { label: 'Warranty', value: '36 Months' },
      { label: 'Country of Origin', value: 'Made in India' }
    ],
    price: '9,37,000',
    imageUrl: '/images/amaze-an-star-1475-1.jpg',
    thumbnails: [
      '/images/amaze-an-star-1475-1.jpg',
      '/images/4-500x500.jpg',
      '/images/2.jpg'
    ]
  };

  // If real data matches the ID, we'll swap it out later.
  const displayTitle = productId === 'an-star-11075' ? 'AN STAR 11075' : formatSlugToTitle(productId || '');
  const categoryTitle = formatSlugToTitle(category || 'Category');
  const subCategoryTitle = formatSlugToTitle(subcategory || 'Subcategory');

  const currentUrl = window.location.href;
  const whatsappMessage = encodeURIComponent(`Hello, I would like to enquire about ${displayTitle}. \n\nPrice: ₹${product.price} \nLink: ${currentUrl}`);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: displayTitle,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity
    });
    navigate('/cart');
  };

  return (
    <>
      <Helmet>
        <title>{displayTitle} | {subCategoryTitle} | New Bharat Electricals</title>
        <meta name="description" content={product.description.slice(0, 160)} />
      </Helmet>
      
      <div className="bg-white w-full min-h-screen pb-20">
        {/* Breadcrumb Header */}
        <div className="bg-brand-gray/50 py-4 border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center text-sm font-medium text-gray-500 overflow-x-auto whitespace-nowrap hide-scrollbar">
              <Link to="/" className="text-gray-400 hover:text-brand-green flex items-center"><Home size={14} className="mr-1" /> Home</Link>
              <ChevronRight size={14} className="mx-2 text-gray-400 flex-shrink-0" />
              <Link to={`/${category}`} className="text-gray-400 hover:text-brand-green">{categoryTitle}</Link>
              <ChevronRight size={14} className="mx-2 text-gray-400 flex-shrink-0" />
              <Link to={`/${category}/${subcategory}`} className="text-gray-400 hover:text-brand-green">{subCategoryTitle}</Link>
              <ChevronRight size={14} className="mx-2 text-gray-400 flex-shrink-0" />
              <span className="text-brand-green font-bold">{displayTitle}</span>
            </div>
          </div>
        </div>

        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
            
            {/* Left - Image Gallery */}
            <div className="w-full lg:w-1/2 p-4 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col">
              <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-center mb-6 min-h-[300px] sm:min-h-[400px]">
                <img src={product.imageUrl} alt={displayTitle} className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} />
              </div>
              <div className="flex gap-4">
                {product.thumbnails.map((thumb, idx) => (
                  <button key={idx} className="w-20 h-20 border-2 border-brand-green rounded-lg overflow-hidden bg-white p-2">
                    <img src={thumb} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 relative">
              <button className="absolute top-4 sm:top-8 right-4 sm:right-8 text-gray-400 hover:text-gray-900 transition-colors">
                <Share2 size={24} />
              </button>
              
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-2 pr-12">{displayTitle}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                 <span>SKU: <span className="font-medium text-gray-900">{product.sku}</span></span>
                 <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                 <span className="text-brand-green font-bold flex items-center"><CheckCircle2 size={14} className="mr-1" /> {product.stockStatus}</span>
              </div>
              
              <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
                {product.description}
              </p>

              <div className="space-y-3 mb-10">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <CheckCircle2 size={20} className="text-brand-green mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-8 mb-8">
                <div className="flex items-baseline text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  MRP: ₹{product.price}
                  <span className="text-sm text-brand-green font-normal ml-2 tracking-tight">Inclusive of all taxes</span>
                </div>

                <div className="flex items-center mb-8">
                  <span className="text-gray-600 mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      readOnly 
                      className="w-12 text-center text-gray-900 font-bold outline-none border-x border-gray-300 py-1"
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center bg-brand-green text-white hover:bg-green-700 font-bold py-3 px-6 rounded-lg transition-colors uppercase tracking-wide text-sm shadow-md"
                  >
                    <ShoppingCart size={18} className="mr-2" /> Add to Cart
                  </button>
                  <a 
                    href={`https://wa.me/919457002000?text=${whatsappMessage}`}
                    target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center bg-[#25D366] text-white hover:bg-[#20bd5a] font-bold py-3 px-6 rounded-lg transition-colors uppercase tracking-wide text-sm shadow-md"
                  >
                    <MessageCircle size={18} className="mr-2" /> Query on WhatsApp
                  </a>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-700 mb-3">
                    <span className="text-brand-green font-bold">Expected Delivery</span> in 5-7 Business Days.
                  </p>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Enter pincode to check delivery" 
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="flex-1 bg-white border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-brand-green text-sm"
                    />
                    <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-2 rounded-r-lg transition-colors text-sm">
                      Check
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Specifications Section */}
          <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-gray-900 mb-4 sm:mb-6">Product Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
               {product.specifications.map((spec, idx) => (
                 <div key={idx} className="flex justify-between py-3 border-b border-gray-100 last:border-0 md:last:border-b">
                   <span className="text-gray-500 font-medium">{spec.label}</span>
                   <span className="text-gray-900 font-bold">{spec.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
