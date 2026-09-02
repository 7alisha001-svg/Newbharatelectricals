import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  CheckCircle2,
  Share2,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Home,
  Send
} from 'lucide-react';

import { formatSlugToTitle } from '../utils/formatters';
import { useStore } from '../context/StoreContext';
import ProductEnquiryModal from '../components/ProductEnquiryModal';

export default function ProductPage() {
  const { products, loading } = useStore();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const {
    category,
    subcategory,
    productId
  } = useParams<{
    category: string;
    subcategory: string;
    productId: string;
  }>();

  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 font-medium">
          Loading product...
        </p>
      </div>
    );
  }

  const rawProduct = products.find(
    (p) => p.id === productId
  );

  if (!rawProduct) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Product not found
        </h1>

        <p className="text-gray-600 mb-6">
          The product you are looking for does not exist or has been removed.
        </p>

        <Link
          to="/"
          className="bg-brand-green text-white px-6 py-3 rounded-lg font-bold"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const regPrice = Number(rawProduct.regular_price) || 0;
  const salePrice = Number(rawProduct.sale_price) || 0;

  const discountPercent =
    regPrice > salePrice && regPrice > 0
      ? Math.round(((regPrice - salePrice) / regPrice) * 100)
      : 0;

  const product = {
    id: rawProduct.id,
    name: rawProduct.name,

    sku:
      rawProduct.sku ||
      `NBE-${(rawProduct.id || '')
        .substring(0, 6)
        .toUpperCase()}`,

    stockStatus:
      (rawProduct.stock_quantity ?? 0) > 0
        ? 'In Stock'
        : 'Out of Stock',

    shortDescription: rawProduct.short_description || '',

    description: rawProduct.description,

    features: Array.isArray(rawProduct.features)
      ? rawProduct.features
      : [],

    originalPrice: regPrice.toLocaleString('en-IN'),

    price: salePrice.toLocaleString('en-IN'),

    discount:
      discountPercent > 0
        ? `${discountPercent}% OFF`
        : null,

    images:
      [
        ...(rawProduct.image_url ? [rawProduct.image_url] : []),
        ...(Array.isArray(rawProduct.gallery_images)
          ? rawProduct.gallery_images
          : [])
      ].filter(Boolean),

    specifications: Array.isArray(rawProduct.specs)
      ? rawProduct.specs
      : []
  };

  const categoryTitle = formatSlugToTitle(
    category || 'Category'
  );

  const subCategoryTitle = formatSlugToTitle(
    subcategory || 'Subcategory'
  );

  const currentUrl = window.location.href;

  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to enquire about ${product.name}.\n\nProduct: ${product.name}\nSKU: ${product.sku}\nLink: ${currentUrl}`
  );

  const enquiryMessage = encodeURIComponent(
    `Hello, I would like to enquire about ${product.name}.\n\nProduct: ${product.name}\nSKU: ${product.sku}\nLink: ${currentUrl}`
  );

  return (
    <>
      <Helmet>
        <title>
          {`${product.name} | ${subCategoryTitle} | New Bharat Electricals`}
        </title>

        <meta
          name="description"
          content={(product.description || '').slice(0, 160)}
        />
      </Helmet>

      <div className="bg-white w-full min-h-screen pb-20">

        {/* Breadcrumb Header */}
        <div className="bg-brand-gray/50 py-4 border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex items-center text-sm font-medium text-gray-700 overflow-x-auto whitespace-nowrap hide-scrollbar">

              <Link
                to="/"
                className="text-gray-900 hover:text-brand-green flex items-center"
              >
                <Home size={14} className="mr-1" />
                Home
              </Link>

              <ChevronRight
                size={14}
                className="mx-2 text-gray-900 flex-shrink-0"
              />

              <Link
                to={`/${category}`}
                className="text-gray-900 hover:text-brand-green"
              >
                {categoryTitle}
              </Link>

              <ChevronRight
                size={14}
                className="mx-2 text-gray-900 flex-shrink-0"
              />

              <Link
                to={`/${category}/${subcategory}`}
                className="text-gray-900 hover:text-brand-green"
              >
                {subCategoryTitle}
              </Link>

              <ChevronRight
                size={14}
                className="mx-2 text-gray-900 flex-shrink-0"
              />

              <span className="text-brand-green font-bold">
                {product.name}
              </span>

            </div>
          </div>
        </div>

        {/* Product Section */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

          <div className="bg-white rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col md:flex-row">

            {/* Left - Image Gallery */}
            <div className="w-full md:w-1/2 p-4 sm:p-10 lg:p-14 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30 flex flex-col">

              <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-center mb-4 min-h-[250px] sm:min-h-[400px] relative">

                <img
                  src={product.images[currentIndex] || product.images[0] || 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;

                    if (
                      !target.src.includes(
                        'photo-1581092580497-e0d23cbdf1dc'
                      )
                    ) {
                      target.src =
                        'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop';
                    }
                  }}
                />

                {product.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : product.images.length - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-md transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentIndex(prev => (prev < product.images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-md transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

              </div>

              {/* Image Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2">

                {product.images.map((thumb, idx) => (

                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-20 h-20 sm:w-24 sm:h-24 border-2 rounded-xl sm:rounded-2xl overflow-hidden bg-white p-1.5 sm:p-2 transition-all flex-shrink-0 ${
                      currentIndex === idx
                        ? 'border-brand-orange shadow-md'
                        : 'border-gray-200 hover:border-brand-orange/50'
                    }`}
                  >

                    <img
                      src={thumb}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />

                  </button>

                ))}

              </div>

            </div>

            {/* Right - Product Info */}
            <div className="w-full md:w-1/2 p-5 sm:p-10 lg:p-14 relative">

              {/* Share Button */}
              <button
                type="button"
                className="absolute top-4 sm:top-8 right-4 sm:right-8 text-gray-900 hover:text-brand-green transition-colors"
                aria-label="Share product"
              >
                <Share2 size={22} />
              </button>

              {/* Product Name */}
              <h1 className="text-2xl lg:text-4xl font-heading font-bold text-gray-900 mb-2 pr-12">
                {product.name}
              </h1>

              {/* SKU / Stock */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700 font-medium mb-4 md:mb-6">

                <span>
                  SKU:{' '}
                  <span className="font-medium text-gray-900">
                    {product.sku}
                  </span>
                </span>

                <span className="w-1 h-1 bg-gray-300 rounded-full" />

                <span className="text-brand-green font-bold flex items-center">
                  <CheckCircle2
                    size={14}
                    className="mr-1"
                  />
                  {product.stockStatus}
                </span>

              </div>

               {/* Short Description */}
               <p className="text-gray-900 font-medium mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                 {product.shortDescription}
               </p>

               {/* Existing Price / Actions */}
               <div className="border-t border-gray-200 pt-6 md:pt-8">

                 {/* Price */}
                 <div className="flex flex-wrap items-baseline text-2xl md:text-4xl font-bold text-gray-900 mb-5 md:mb-6">

                   MRP: ₹{product.price}

                   <span className="text-xs md:text-sm text-brand-green font-normal ml-2 tracking-tight">
                     Inclusive of all taxes
                   </span>

                 </div>

                 {/* Lead Buttons */}
                 <div className="flex flex-col sm:flex-row gap-3 md:gap-4">

                   {/* Enquiry Now */}
                   <button
                     type="button"
                     onClick={() => setIsEnquiryOpen(true)}
                     className="flex-1 flex items-center justify-center bg-brand-green text-white hover:bg-brand-orange font-bold py-3.5 sm:py-3 px-6 rounded-xl md:rounded-2xl transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg uppercase tracking-wide text-sm cursor-pointer"
                   >
                     <Send
                       size={18}
                       className="mr-2"
                     />
                     Enquiry Now
                   </button>

                   {/* WhatsApp */}
                   <a
                     href={`https://wa.me/919457002000?text=${whatsappMessage}`}
                     target="_blank"
                     rel="noreferrer"
                     className="flex-1 flex items-center justify-center bg-[#25D366] text-white hover:bg-[#20bd5a] font-bold py-3.5 sm:py-3 px-6 rounded-xl md:rounded-2xl transition-colors uppercase tracking-wide text-sm shadow-md"
                   >
                     <MessageCircle
                       size={18}
                       className="mr-2"
                     />

                     Query on WhatsApp
                   </a>

                 </div>

                 {/* Lead Message */}
                 <div className="mt-5 bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-100">

                   <p className="text-sm text-gray-700 leading-relaxed">
                     <span className="text-brand-green font-bold">
                       Need more information?
                     </span>{' '}
                     Contact our team for product availability,
                     pricing, specifications and expert assistance.
                   </p>

                  </div>

                 </div>

                 {/* Key Features */}
                 <div className="space-y-2.5 mb-6 md:mb-10">

                   {product.features.map((feature, idx) => (

                     <div
                       key={idx}
                       className="flex items-start"
                     >
                       <CheckCircle2
                         size={18}
                         className="text-brand-green mr-3 mt-0.5 flex-shrink-0"
                       />

                       <span className="text-gray-700 text-sm md:text-base">
                         {feature}
                       </span>
                     </div>

                   ))}

                 </div>

              </div>

            </div>

          {/* Full Description */}
          <div className="mt-6 sm:mt-12 bg-white rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 sm:p-8 lg:p-12">

            <h2 className="text-lg sm:text-2xl font-bold font-heading text-gray-900 mb-4 sm:mb-6">
              Full Description
            </h2>

            <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {product.description ||
                'No detailed description available for this product.'}
            </p>

          </div>

          {/* Product Specifications */}
          <div className="mt-6 sm:mt-12 bg-white rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 sm:p-8 lg:p-12">

            <h2 className="text-lg sm:text-2xl font-bold font-heading text-gray-900 mb-4 sm:mb-6">
              Product Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">

              {product.specifications.map((spec, idx) => (

                <div
                  key={idx}
                  className="flex justify-between py-3 border-b border-gray-100 last:border-0 md:last:border-b gap-4"
                >

                  <span className="text-gray-700 font-medium text-sm md:text-base">
                    {spec.label}
                  </span>

                  <span className="text-gray-900 font-bold text-sm md:text-base text-right">
                    {spec.value}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </section>

      </div>

      {/* Product Enquiry Modal */}
      <ProductEnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          sku: product.sku
        }}
      />
    </>
  );
}
