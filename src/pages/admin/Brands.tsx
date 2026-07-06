import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Brands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      const { data } = await supabase.from('brands').select('*').order('name', { ascending: true });
      setBrands(data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const deleteBrand = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await supabase.from('brands').delete().eq('id', id);
        fetchBrands();
      } catch (err) {
        console.error("Error deleting brand", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage product brands</p>
        </div>
        <button className="bg-brand-green hover:bg-brand-green-dark text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center">
          <Plus size={18} className="mr-2" />
          Add Brand
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Brand Name</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : brands.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No brands found.</td></tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{brand.name}</td>
                    <td className="p-4 text-gray-500">{brand.slug}</td>
                    <td className="p-4">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${brand.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-xs text-gray-600">{brand.is_active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-gray-400 hover:text-brand-green p-2 rounded-lg hover:bg-brand-green/10 transition-colors mr-1">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteBrand(brand.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
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
