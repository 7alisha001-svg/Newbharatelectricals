import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this category?')) {
      try {
        await supabase.from('categories').delete().eq('id', id);
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1 text-sm">Organize products into categories</p>
        </div>
        <Link to="/admin/categories/new" className="bg-brand-green hover:bg-brand-green-dark text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center">
          <Plus size={18} className="mr-2" />
          Add Category
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md border-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Category Name</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No categories found.</td></tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{cat.name}</td>
                    <td className="p-4 text-gray-500">{cat.slug}</td>
                    <td className="p-4 text-gray-500">{cat.display_order}</td>
                    <td className="p-4">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${cat.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-xs text-gray-700">{cat.is_active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/admin/categories/${cat.id}/edit`} className="inline-flex text-gray-400 hover:text-brand-green p-2 rounded-lg hover:bg-brand-green/10 transition-colors mr-1">
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => deleteCategory(cat.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
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
