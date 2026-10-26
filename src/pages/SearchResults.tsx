import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, loading } = useStore();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  if (loading) {
    return (
      <section className="py-16 md:py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-sm sm:text-base">Loading products...</p>
        </div>
      </section>
    );
  }

  const trimmedQuery = query.trim();

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const results = trimmedQuery
    ? products.filter(
        (p: any) =>
          p.name?.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(trimmedQuery.toLowerCase())
      )
    : [];

  const productUrl = (p: any) => {
    const categorySlug = p.category
      ? p.category.toLowerCase().replace(/\s+/g, '-')
      : 'category';
    const subcategorySlug = p.slug || p.id;
    return `/${categorySlug}/${subcategorySlug}/${p.id}`;
  };

  return (
    <>
      <SEO
        title="Search Results | New Bharat Electricals"
        description={trimmedQuery ? `Search results for "${trimmedQuery}"` : 'Search for products from New Bharat Electricals.'}
        keywords="product search, inverters, batteries, solar panels, New Bharat Electricals"
      />
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2 border-l-4 border-brand-green pl-3">
              Search Results
            </h1>
            {trimmedQuery ? (
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Showing results for <span className="font-semibold text-brand-green">"{trimmedQuery}"</span>
              </p>
            ) : null}
          </div>

          {/* Search bar */}
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative w-full max-w-md sm:max-w-lg mb-8 sm:mb-12">
            <div className="relative w-full">
              <button
                type="button"
                onClick={handleSearch}
                className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-700 font-medium hover:text-brand-green transition-colors"
                aria-label="Search"
              >
                <Search size={20} className="text-gray-700 font-medium" />
              </button>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for Inverters, Batteries, Solar Panels..."
                className="w-full bg-[#f1f1f1] border-none text-gray-900 text-sm sm:text-base rounded-full pl-12 pr-4 py-3 sm:py-3.5 outline-none focus:bg-[#e5e5e5] transition-colors"
              />
            </div>
          </form>

          {/* Empty input state */}
          {trimmedQuery === '' && (
            <div className="text-center py-20 sm:py-32">
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                Enter a product name or keyword to search.
              </p>
            </div>
          )}

          {/* No results state */}
          {trimmedQuery !== '' && results.length === 0 && (
            <div className="text-center py-20 sm:py-32">
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                No products found matching{" "}
                <span className="font-semibold text-brand-green">"{trimmedQuery}"</span>.
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                Try a different keyword or browse our categories.
              </p>
            </div>
          )}

          {/* Results grid */}
          {trimmedQuery !== '' && results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {results.map((product: any) => (
                <Link
                  key={product.id}
                  to={productUrl(product)}
                  className="flex flex-col group"
                >
                  <div className="h-40 sm:h-48 md:h-56 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 mb-3 group-hover:border-brand-green transition-colors flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                        }}
                      />
                    ) : null}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-brand-green transition-colors">
                    {product.name}
                  </h3>
                  {product.sku && (
                    <span className="text-[10px] sm:text-xs text-gray-500 mb-3">{product.sku}</span>
                  )}
                  <span className="mt-auto text-gray-900 font-bold text-sm sm:text-base">
                    ₹{Number(product.sale_price || product.regular_price || 0)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
