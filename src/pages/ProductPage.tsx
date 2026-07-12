import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Share2, MessageCircle, ChevronRight, Home, Minus, Plus, ShoppingCart } from 'lucide-react';
import { formatSlugToTitle } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

export default function ProductPage() {
  const { products, loading } = useStore();
  const { category, subcategory, productId } = useParams<{ category: string, subcategory: string, productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // This is placeholder structural data.
  // It will be replaced naturally when real data is integrated into a unified data structure.
  
  if (loading) return <div className="p-20 text-center flex justify-center items-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div></div>;
  
  const rawProduct = products.find(p => p.id === productId);
  if (!rawProduct) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
        <p className="text-gray-700 font-medium mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="bg-brand-green text-white font-bold py-3 px-8 rounded-2xl hover:bg-brand-green-dark transition-colors">Return Home</Link>
      </div>
    );
  }

  const discountPercent = rawProduct.regular_price > rawProduct.sale_price 
    ? Math.round(((rawProduct.regular_price - rawProduct.sale_price) / rawProduct.regular_price) * 100)
    : 0;

  const product = {
    id: rawProduct.id,
    name: rawProduct.name,
    sku: rawProduct.sku || `NBE-${rawProduct.id.substring(0, 6).toUpperCase()}`,
    stockStatus: rawProduct.stock_quantity > 0 ? 'In Stock' : 'Out of Stock',
    description: rawProduct.description,
    features: rawProduct.features || [],
    originalPrice: rawProduct.regular_price.toLocaleString('en-IN'),
    price: rawProduct.sale_price.toLocaleString('en-IN'),
    rawPrice: rawProduct.sale_price.toString(),
    discount: discountPercent > 0 ? `${discountPercent}% OFF` : null,
    rating: 4.8,
    reviews: 124,
    images: rawProduct.gallery_images?.length > 0 ? rawProduct.gallery_images : (rawProduct.image_url ? [rawProduct.image_url] : []),
    specifications: rawProduct.specs || []
  };


  // If real data matches the ID, we'll swap it out later.
  const categoryTitle = formatSlugToTitle(category || 'Category');
  const subCategoryTitle = formatSlugToTitle(subcategory || 'Subcategory');

  const currentUrl = window.location.href;
  const whatsappMessage = encodeURIComponent(`Hello, I would like to enquire about ${product.name}. \n\nPrice: ₹${product.price} \nLink: ${currentUrl}`);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.rawPrice,
      imageUrl: product.images[0],
      quantity
    });
    navigate('/cart');
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} | ${subCategoryTitle} | New Bharat Electricals`}</title>
        <meta name="description" content={(product.description || '').slice(0, 160)} />
      </Helmet>
      
      <div className="bg-white w-full min-h-screen pb-20">
        {/* Breadcrumb Header */}
        <div className="bg-brand-gray/50 py-4 border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center text-sm font-medium text-gray-700 font-medium overflow-x-auto whitespace-nowrap hide-scrollbar">
              <Link to="/" className="text-gray-800 hover:text-brand-green flex items-center"><Home size={14} className="mr-1" /> Home</Link>
              <ChevronRight size={14} className="mx-2 text-gray-800 flex-shrink-0" />
              <Link to={`/${category}`} className="text-gray-800 hover:text-brand-green">{categoryTitle}</Link>
              <ChevronRight size={14} className="mx-2 text-gray-800 flex-shrink-0" />
              <Link to={`/${category}/${subcategory}`} className="text-gray-800 hover:text-brand-green">{subCategoryTitle}</Link>
              <ChevronRight size={14} className="mx-2 text-gray-800 flex-shrink-0" />
              <span className="text-brand-green font-bold">{product.name}</span>
            </div>
          </div>
        </div>

        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left - Image Gallery */}
            <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-14 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30 flex flex-col">
              <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-center mb-6 min-h-[300px] sm:min-h-[400px]">
                <img src={product.images[0]} alt={product.name} className="max-w-full max-h-full object-contain" onError={(e) => { const target = e.currentTarget; if (!target.src.includes('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop')) { target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; } }} />
              </div>
              <div className="flex gap-4">
                {product.images.map((thumb, idx) => (
                  <button key={idx} className="w-24 h-24 border-2 border-brand-orange rounded-2xl overflow-hidden bg-white p-2">
                    <img src={thumb} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" onError={(e) => { const target = e.currentTarget; if (!target.src.includes('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop')) { target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; } }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-14 relative">
              <button className="absolute top-4 sm:top-8 right-4 sm:right-8 text-gray-800 hover:text-gray-900 transition-colors">
                <Share2 size={24} />
              </button>
              
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-2 pr-12">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-700 font-medium mb-6">
                 <span>SKU: <span className="font-medium text-gray-900">{product.sku}</span></span>
                 <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                 <span className="text-brand-green font-bold flex items-center"><CheckCircle2 size={14} className="mr-1" /> {product.stockStatus}</span>
              </div>
              
              <p className="text-gray-800 font-medium mb-8 leading-relaxed text-sm md:text-base">
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
                  <span className="text-gray-800 font-medium mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-800 font-medium hover:bg-gray-100 transition-colors"
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
                      className="px-4 py-2 text-gray-800 font-medium hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center bg-brand-green text-white hover:bg-green-700 font-bold py-3.5 sm:py-3 px-6 rounded-2xl transition-colors uppercase tracking-wide text-sm shadow-md"
                  >
                    <ShoppingCart size={18} className="mr-2" /> Add to Cart
                  </button>
                  <a 
                    href={`https://wa.me/919457002000?text=${whatsappMessage}`}
                    target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center bg-[#25D366] text-white hover:bg-[#20bd5a] font-bold py-3.5 sm:py-3 px-6 rounded-2xl transition-colors uppercase tracking-wide text-sm shadow-md"
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
                      className="flex-1 bg-white border border-gray-300 rounded-l-xl px-6 py-3.5 focus:outline-none focus:border-brand-orange text-sm"
                    />
                    <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-2 rounded-r-xl px-8 transition-colors text-sm">
                      Check
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Specifications Section */}
          <div className="mt-8 sm:mt-12 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8 lg:p-12">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-gray-900 mb-4 sm:mb-6">Product Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
               {product.specifications.map((spec, idx) => (
                 <div key={idx} className="flex justify-between py-3 border-b border-gray-100 last:border-0 md:last:border-b">
                   <span className="text-gray-700 font-medium">{spec.label}</span>
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
