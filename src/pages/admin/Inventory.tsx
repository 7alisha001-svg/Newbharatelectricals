import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, AlertTriangle, Save, RefreshCw } from 'lucide-react';

export default function AdminInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, stock_quantity, stock_status, regular_price, image_url')
        .order('stock_quantity', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching inventory', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: string, newQuantity: number) => {
    setUpdating(id);
    try {
      let status = 'instock';
      if (newQuantity <= 0) status = 'outofstock';
      
      const { error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: newQuantity,
          stock_status: status
        })
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.map(p => 
        p.id === id ? { ...p, stock_quantity: newQuantity, stock_status: status } : p
      ));
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Failed to update stock');
    } finally {
      setUpdating(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold font-heading text-gray-900">Inventory Management</h2>
        <button 
          onClick={fetchInventory}
          className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
        >
          <RefreshCw size={16} /> Refresh Stock
        </button>
      </div>

      {/* Stock Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center">
          <div className="bg-red-100 p-3 rounded-lg text-red-600 mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800">Out of Stock</p>
            <h3 className="text-xl font-bold text-red-900">
              {products.filter(p => p.stock_quantity <= 0).length} Items
            </h3>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center">
          <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600 mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-800">Low Stock</p>
            <h3 className="text-xl font-bold text-yellow-900">
              {products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length} Items
            </h3>
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center">
          <div className="bg-green-100 p-3 rounded-lg text-green-600 mr-4">
            <Save size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">In Stock</p>
            <h3 className="text-xl font-bold text-green-900">
              {products.filter(p => p.stock_quantity > 5).length} Items
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green mx-auto mb-4"></div>
                    Loading inventory...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                          {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} />}
                        </div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.sku || '-'}</td>
                    <td className="px-6 py-4">
                      {product.stock_quantity <= 0 ? (
                        <span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full text-xs">Out of Stock</span>
                      ) : product.stock_quantity <= 5 ? (
                        <span className="text-yellow-600 font-medium bg-yellow-50 px-2 py-1 rounded-full text-xs">Low Stock</span>
                      ) : (
                        <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full text-xs">In Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="number" 
                        min="0"
                        defaultValue={product.stock_quantity}
                        id={`stock-${product.id}`}
                        className="w-20 bg-white border border-gray-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        disabled={updating === product.id}
                        onClick={() => {
                          const input = document.getElementById(`stock-${product.id}`) as HTMLInputElement;
                          if (input) updateStock(product.id, parseInt(input.value));
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {updating === product.id ? 'Saving...' : 'Update'}
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
