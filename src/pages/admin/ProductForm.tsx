import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Save, ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';import { useStore } from '../../context/StoreContext';

import ImageUploader from '../../components/admin/ImageUploader';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshStore } = useStore();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [brands, setBrands] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category: '',
    brand: '',
    regular_price: 0,
    sale_price: 0,
    stock_quantity: 0,
    status: 'publish',
    description: '',
    short_description: '',
    image_url: '',
    gallery_images: [] as string[],
    tags: [] as string[],
    features: [] as string[],
    meta_title: '',
    meta_description: '',
    specs: [] as {label: string, value: string}[]
  });

  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  
  const fetchBrands = async () => {
    try {
      const { data } = await supabase.from('brands').select('*').order('name', { ascending: true });
      setBrands(data || []);
    } catch (err) {
      console.error("Error fetching brands", err);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('name').eq('is_active', true);
     
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw error;
      if (data) {
        let meta: any = { tags: [], features: [], meta_title: '', meta_description: '', specs: [] };
        
        // Handle tags column parsing
        if (data.tags) {
          try {
            if (typeof data.tags === 'string') {
              // Try parsing if string
              const p = JSON.parse(data.tags);
              if(p.list) meta = { ...meta, ...p };
            } else if (typeof data.tags === 'object') {
              if (data.tags.list || data.tags.features) {
                meta = { ...meta, ...data.tags };
              } else if (Array.isArray(data.tags)) {
                meta.tags = data.tags;
              }
            }
          } catch(e) {}
        }

        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          sku: data.sku || '',
          category: data.category || '',
          brand: data.brand || '',
          regular_price: data.regular_price || 0,
          sale_price: data.sale_price || 0,
          stock_quantity: data.stock_quantity || 0,
          status: data.status || 'publish',
          description: data.description || '',
          short_description: data.short_description || '',
          image_url: data.image_url || '',
          gallery_images: Array.isArray(data.gallery_images) ? data.gallery_images : [],
          tags: meta.tags || [],
          features: meta.features || [],
          meta_title: meta.meta_title || '',
          meta_description: meta.meta_description || '',
          specs: meta.specs || []
        });
      }
    } catch (err: any) {
      console.error("Error fetching product", err);
      setMessage({ text: 'Error loading product: ' + err.message, type: 'error' });
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateSlug = () => {
    if (!formData.name) return;
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image_url) {
      setMessage({ text: 'At least one product image is required.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Robust sanitization and validation for JSON/array fields
      const sanitizeFeatures = (feats: any): string[] => {
        if (!Array.isArray(feats)) return [];
        return feats
          .map(f => typeof f === 'string' ? f.trim() : String(f).trim())
          .filter(f => f.length > 0);
      };

      const sanitizeSpecs = (specifications: any): { label: string; value: string }[] => {
        if (!Array.isArray(specifications)) return [];
        return specifications
          .filter(s => s && typeof s === 'object')
          .map(s => ({
            label: typeof s.label === 'string' ? s.label.trim() : String(s.label || '').trim(),
            value: typeof s.value === 'string' ? s.value.trim() : String(s.value || '').trim()
          }))
          .filter(s => s.label.length > 0 || s.value.length > 0);
      };

      const sanitizeTags = (tagList: any): string[] => {
        if (!Array.isArray(tagList)) return [];
        return tagList
          .map(t => typeof t === 'string' ? t.trim() : String(t).trim())
          .filter(t => t.length > 0);
      };

      const sanitizeGalleryImages = (images: any): string[] => {
        if (!Array.isArray(images)) return [];
        return images
          .map(img => typeof img === 'string' ? img.trim() : String(img).trim())
          .filter(img => img.length > 0);
      };

      const sanitizedFeatures = sanitizeFeatures(formData.features);
      const sanitizedSpecs = sanitizeSpecs(formData.specs);
      const sanitizedTags = sanitizeTags(formData.tags);
      const sanitizedGallery = sanitizeGalleryImages(formData.gallery_images);

      const payload = {
        name: formData.name,
        slug: formData.slug,
        sku: formData.sku,
        category: formData.category,
        brand: formData.brand,
        regular_price: Number(formData.regular_price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        stock_quantity: Number(formData.stock_quantity),
        status: formData.status,
        description: formData.description,
        short_description: formData.short_description,
        image_url: formData.image_url,
        gallery_images: sanitizedGallery,
        features: sanitizedFeatures,
        specs: sanitizedSpecs,
        meta_title: formData.meta_title || '',
        meta_description: formData.meta_description || '',
        tags: sanitizedTags
      };

      let error;
      if (isEdit) {
        const res = await supabase.from('products').update(payload).eq('id', id);
        error = res.error;
      } else {
        const res = await supabase.from('products').insert([payload]);
        error = res.error;
      }

      if (error) throw error;
      await refreshStore();
      setMessage({ text: `Product ${isEdit ? 'updated' : 'created'} successfully!`, type: 'success' });
      if (!isEdit) {
        setTimeout(() => navigate('/admin/products'), 1500);
      }
    } catch (err: any) {
      console.error("Error saving product:", err);
      setMessage({ text: err.message || 'Failed to save product', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const addArrayItem = (field: 'tags' | 'features' | 'gallery_images', value: string, setter: any) => {
    if (!value.trim()) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setter('');
  };

  const removeArrayItem = (field: 'tags' | 'features' | 'gallery_images', index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const addSpec = () => {
    setFormData(prev => ({ ...prev, specs: [...prev.specs, { label: '', value: '' }] }));
  };

  const updateSpec = (index: number, key: 'label' | 'value', val: string) => {
    const newSpecs = [...formData.specs];
    newSpecs[index][key] = val;
    setFormData(prev => ({ ...prev, specs: newSpecs }));
  };

  const removeSpec = (index: number) => {
    setFormData(prev => ({ ...prev, specs: prev.specs.filter((_, i) => i !== index) }));
  };

  if (fetching) return <div className="p-8 text-center text-gray-500">Loading product details...</div>;

  return (
    <div className="max-w-5xl space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-gray-500 mt-1 text-sm">{isEdit ? 'Update product information' : 'Create a new product listing'}</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} onBlur={!isEdit ? generateSlug : undefined} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
              <div className="flex gap-2">
                <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
                <button type="button" onClick={generateSlug} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium">Generate</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
            </div>


            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <select name="brand" value={formData.brand} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none">
                <option value="">Select a brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none">
                <option value="publish">Active</option>
                <option value="draft">Inactive / Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price *</label>
              <input type="number" name="regular_price" required value={formData.regular_price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
              <input type="number" name="sale_price" value={formData.sale_price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Descriptions</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea name="short_description" rows={2} value={formData.short_description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Images</h2>
          
          <ImageUploader 
            images={formData.image_url ? [formData.image_url, ...formData.gallery_images] : []}
            onChange={(newImages) => {
              if (newImages.length === 0) {
                setFormData(prev => ({ ...prev, image_url: '', gallery_images: [] }));
              } else {
                setFormData(prev => ({ 
                  ...prev, 
                  image_url: newImages[0], 
                  gallery_images: newImages.slice(1) 
                }));
              }
            }}
          />
        </div>

        {/* Features & Tags */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Features & Tags</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Features</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={newFeature} onChange={e => setNewFeature(e.target.value)} placeholder="Add a key feature" className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
              <button type="button" onClick={() => addArrayItem('features', newFeature, setNewFeature)} className="bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 font-medium text-gray-700">Add</button>
            </div>
            <ul className="space-y-2 mt-3">
              {formData.features.map((feat, i) => (
                <li key={i} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 text-sm">
                  <span>{feat}</span>
                  <button type="button" onClick={() => removeArrayItem('features', i)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add a tag" className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
              <button type="button" onClick={() => addArrayItem('tags', newTag, setNewTag)} className="bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 font-medium text-gray-700">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center px-3 py-1 bg-brand-green/10 text-brand-green text-sm rounded-full font-medium">
                  {tag}
                  <button type="button" onClick={() => removeArrayItem('tags', i)} className="ml-2 hover:text-brand-green-dark"><X size={14} /></button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Specifications</h2>
            <button type="button" onClick={addSpec} className="text-brand-green hover:text-brand-green-dark text-sm font-medium flex items-center">
              <Plus size={16} className="mr-1" /> Add Specification
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.specs.map((spec, i) => (
              <div key={i} className="flex gap-3">
                <input type="text" value={spec.label} onChange={e => updateSpec(i, 'label', e.target.value)} placeholder="Label (e.g. Weight)" className="w-1/3 px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
                <input type="text" value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} placeholder="Value (e.g. 5kg)" className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
                <button type="button" onClick={() => removeSpec(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><X size={20} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">SEO</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input type="text" name="meta_title" value={formData.meta_title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea name="meta_description" rows={3} value={formData.meta_description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" />
          </div>
        </div>

        <div className="flex justify-end gap-3 sticky bottom-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-xl">
          <Link to="/admin/products" className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors">
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

