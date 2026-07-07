import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });
      
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data } = await query;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const deleteProduct = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      try {
        await supabase.from('products').delete().eq('id', id);
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your product catalog</p>
        </div>
        <Link to="/admin/products/new" className="bg-brand-green hover:bg-brand-green-dark text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center">
          <Plus size={18} className="mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No products found.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                           {product.image_url ? (
                             <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                           ) : (
                             <Package size={20} className="text-gray-400" />
                           )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-400">SKU: {product.sku || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{product.category || '-'}</td>
                    <td className="p-4 font-medium text-gray-900">₹{product.regular_price?.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        product.stock_quantity === 0 ? 'bg-red-100 text-red-800' :
                        product.stock_quantity <= 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${product.status === 'publish' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-xs text-gray-600">{product.status === 'publish' ? 'Active' : 'Draft'}</span>
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/admin/products/${product.id}/edit`} className="inline-flex text-gray-400 hover:text-brand-green p-2 rounded-lg hover:bg-brand-green/10 transition-colors mr-1">
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => deleteProduct(product.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
