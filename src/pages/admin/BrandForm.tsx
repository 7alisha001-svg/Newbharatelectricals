import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';import { useStore } from '../../context/StoreContext';

export default function BrandForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshStore } = useStore();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    
    logo_url: '',
    
    is_active: true
  });

  useEffect(() => {
    if (isEdit) {
      fetchBrand();
    }
  }, [id]);

  const fetchBrand = async () => {
    try {
      const { data, error } = await supabase.from('brands').select('*').eq('id', id).single();
      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          
          logo_url: data.logo_url || '',
          
          is_active: data.is_active ?? true
        });
      }
    } catch (err: any) {
      console.error("Error fetching brand", err);
      setMessage({ text: 'Error loading brand: ' + err.message, type: 'error' });
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const generateSlug = () => {
    if (!formData.name) return;
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        
        logo_url: formData.logo_url,
        
        is_active: Boolean(formData.is_active)
      };

      let error;
      if (isEdit) {
        const res = await supabase.from('brands').update(payload).eq('id', id);
        error = res.error;
      } else {
        const res = await supabase.from('brands').insert([payload]);
        error = res.error;
      }

      if (error) throw error;
      await refreshStore();
      setMessage({ text: `Brand ${isEdit ? 'updated' : 'created'} successfully!`, type: 'success' });
      if (!isEdit) {
        setTimeout(() => navigate('/admin/brands'), 1500);
      }
    } catch (err: any) {
      console.error("Error saving brand:", err);
      setMessage({ text: err.message || 'Failed to save brand', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center text-gray-500">Loading brand details...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/brands" className="text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Brand' : 'Add New Brand'}</h1>
          <p className="text-gray-500 mt-1 text-sm">{isEdit ? 'Update existing brand details' : 'Create a new product brand'}</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
            <input 
              type="text" 
              name="name" 
              required
              value={formData.name} 
              onChange={handleChange} 
              onBlur={!isEdit ? generateSlug : undefined}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                name="slug" 
                required
                value={formData.slug} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" 
              />
              <button type="button" onClick={generateSlug} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                Generate
              </button>
            </div>
          </div>

          

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input 
              type="text" 
              name="logo_url" 
              placeholder="https://..."
              value={formData.logo_url} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" 
            />
            {formData.logo_url && (
              <div className="mt-4 w-32 h-32 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                <img src={formData.logo_url} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          

          <div className="flex items-center mt-6">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="is_active" 
                  checked={formData.is_active} 
                  onChange={handleChange} 
                  className="sr-only" 
                />
                <div className={`block w-14 h-8 rounded-full transition-colors ${formData.is_active ? 'bg-brand-green' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.is_active ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3 text-sm font-medium text-gray-700">
                {formData.is_active ? 'Active (Visible)' : 'Inactive (Hidden)'}
              </div>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <Link to="/admin/brands" className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="bg-brand-green hover:bg-brand-green-dark text-white font-medium py-2 px-6 rounded-xl transition-colors flex items-center shadow-lg shadow-brand-green/20 disabled:opacity-70">
            <Save size={18} className="mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

