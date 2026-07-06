import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AlertTriangle, TrendingUp, TrendingDown, Archive, Search } from 'lucide-react';

export default function Inventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInventory = async () => {
    try {
      let query = supabase.from('products').select(`id, name, sku, stock_quantity`).order('stock_quantity', { ascending: true });
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      const { data } = await query;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [searchTerm]);

  const updateStock = async (id: string, newQuantity: number) => {
    if(newQuantity < 0) return;
    try {
      await supabase.from('products').update({ stock_quantity: newQuantity }).eq('id', id);
      fetchInventory();
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 mt-1 text-sm">Monitor and update stock levels</p>
        </div>
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
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Available Stock</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No products found.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                     <td className="p-4 font-medium text-gray-900 flex items-center">
                       {product.stock_quantity === 0 && <AlertTriangle size={16} className="text-red-500 mr-2" />}
                       {product.stock_quantity > 0 && product.stock_quantity <= 5 && <AlertTriangle size={16} className="text-yellow-500 mr-2" />}
                       {product.name}
                     </td>
                     <td className="p-4 text-gray-500">{product.sku || '-'}</td>
                     <td className="p-4">
                      {product.stock_quantity === 0 ? <span className="text-red-600 font-medium text-xs">Out of Stock</span> :
                       product.stock_quantity <= 5 ? <span className="text-yellow-600 font-medium text-xs">Low Stock</span> :
                       <span className="text-green-600 font-medium text-xs">In Stock</span>}
                     </td>
                     <td className="p-4">
                       <input 
                         type="number" 
                         className="w-20 border border-gray-200 rounded px-2 py-1 text-center"
                         value={product.stock_quantity}
                         onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                         min={0}
                       />
                     </td>
                     <td className="p-4 text-gray-500 text-xs">Auto Saved</td>
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
