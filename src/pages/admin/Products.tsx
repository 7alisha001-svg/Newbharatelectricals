import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Edit2, Trash2, Filter, Package, X, Upload } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New Product Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    regular_price: '',
    stock_quantity: '',
    category: '',
    image_url: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const { error } = await supabase.from('products').insert([{
        name: formData.name,
        slug: slug,
        sku: formData.sku,
        regular_price: parseFloat(formData.regular_price),
        stock_quantity: parseInt(formData.stock_quantity),
        category: formData.category,
        image_url: formData.image_url,
        stock_status: parseInt(formData.stock_quantity) > 0 ? 'instock' : 'outofstock',
        status: 'publish'
      }]);

      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({ name: '', sku: '', regular_price: '', stock_quantity: '', category: '', image_url: '' });
      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product. Please check the inputs or try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold font-heading text-gray-900">Products</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-green hover:bg-brand-green-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-white border border-gray-200 rounded-lg py-2 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 w-full sm:w-auto justify-center">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Categories</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green mx-auto mb-4"></div>
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No products found. Click "Add New Product" to get started.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} />
                          ) : (
                            <Package size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.status === 'publish' ? 'Published' : 'Draft'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.sku || '-'}</td>
                    <td className="px-6 py-4">
                      {product.stock_status === 'instock' ? (
                        <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full text-xs">In Stock ({product.stock_quantity})</span>
                      ) : product.stock_status === 'outofstock' ? (
                        <span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full text-xs">Out of Stock</span>
                      ) : (
                        <span className="text-yellow-600 font-medium bg-yellow-50 px-2 py-1 rounded-full text-xs">Low Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ₹{product.regular_price}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.category || 'Uncategorized'}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(product.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-gray-400 hover:text-brand-green transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold font-heading">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="addProductForm" onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" placeholder="e.g., Heavy Duty Inverter 2000VA" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                    <input type="text" required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" placeholder="e.g., NBE-INV-2000" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green">
                      <option value="">Select Category</option>
                      <option value="Inverters">Inverters</option>
                      <option value="Batteries">Batteries</option>
                      <option value="Solar Panels">Solar Panels</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Regular Price (₹) *</label>
                    <input type="number" step="0.01" required value={formData.regular_price} onChange={e => setFormData({...formData, regular_price: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" placeholder="0.00" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                    <input type="number" required value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" placeholder="0" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (Optional)</label>
                    <div className="flex gap-4">
                      <input type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" placeholder="https://example.com/image.jpg" />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button type="submit" form="addProductForm" disabled={isSubmitting} className="bg-brand-green hover:bg-brand-green-dark text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-sm disabled:opacity-70 flex items-center">
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
