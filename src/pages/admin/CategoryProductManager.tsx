import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../context/StoreContext';
import { 
  ArrowLeft, Plus, Search, Edit2, Trash2, Package, 
  Upload, X, Save, CheckCircle2, AlertCircle, RefreshCw 
} from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader';

const categorySlugToName: Record<string, string> = {
  // Power Solutions
  'inverters': 'Inverters',
  'batteries': 'Batteries',
  '3-phase-inverters': '3-Phase Inverters',
  'lift-inverters': 'Lift Inverters',
  'combo-products': 'Combo Products',

  // Solar Solutions
  'solar-on-grid-inverter': 'Solar On-Grid Inverter',
  'solar-on-grid-inverters': 'Solar On-Grid Inverter',
  'solar-off-grid-inverter': 'Solar Off-Grid Inverter',
  'solar-off-grid-inverters': 'Solar Off-Grid Inverter',
  'solar-hybrid-inverter': 'Solar Hybrid Inverter',
  'solar-hybrid-inverters': 'Solar Hybrid Inverter',
  'solar-panel': 'Solar Panel',
  'solar-panels': 'Solar Panel',
  'solar-batteries': 'Solar Batteries',
  'solar-charge-controller': 'Solar Charge Controller',
  'solar-charge-controllers': 'Solar Charge Controller'
};

interface FormState {
  name: string;
  sku: string;
  description: string;
  regular_price: number;
  sale_price: number;
  stock_quantity: number;
  status: string;
  brand: string;
  image_url: string;
  gallery_images: string[];
  features: string[];
  specs: { label: string; value: string }[];
}

const initialFormState: FormState = {
  name: '',
  sku: '',
  description: '',
  regular_price: 0,
  sale_price: 0,
  stock_quantity: 0,
  status: 'publish',
  brand: '',
  image_url: '',
  gallery_images: [],
  features: [],
  specs: []
};

export default function CategoryProductManager() {
  const { subcategory } = useParams<{ subcategory: string }>();
  const { refreshStore } = useStore();
  
  const categoryDisplayName = (subcategory && categorySlugToName[subcategory]) || subcategory || '';
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [brands, setBrands] = useState<any[]>([]);
  
  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Temporary fields for multi-value items
  const [newFeature, setNewFeature] = useState('');
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch products and brands
  const fetchProducts = async () => {
    if (!categoryDisplayName) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', categoryDisplayName)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching category products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data } = await supabase.from('brands').select('*').order('name', { ascending: true });
      setBrands(data || []);
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    setIsFormOpen(false);
    setEditProductId(null);
    setFormData(initialFormState);
    setMessage({ text: '', type: '' });
  }, [subcategory]);

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        
        await refreshStore();
        fetchProducts();
      } catch (err: any) {
        alert('Failed to delete product: ' + err.message);
      }
    }
  };

  // Handle Edit trigger
  const handleEditClick = (product: any) => {
    setEditProductId(product.id);
    
    // Parse specs and features safely
    let specList: { label: string; value: string }[] = [];
    if (Array.isArray(product.specs)) {
      specList = product.specs;
    } else if (product.tags?.specs && Array.isArray(product.tags.specs)) {
      specList = product.tags.specs;
    }

    let featureList: string[] = [];
    if (Array.isArray(product.features)) {
      featureList = product.features;
    } else if (product.tags?.features && Array.isArray(product.tags.features)) {
      featureList = product.tags.features;
    }

    setFormData({
      name: product.name || '',
      sku: product.sku || '',
      description: product.description || '',
      regular_price: product.regular_price || 0,
      sale_price: product.sale_price || product.regular_price || 0,
      stock_quantity: product.stock_quantity || 0,
      status: product.status || 'publish',
      brand: product.brand || '',
      image_url: product.image_url || '',
      gallery_images: Array.isArray(product.gallery_images) ? product.gallery_images : [],
      features: featureList,
      specs: specList
    });
    setIsFormOpen(true);
    setMessage({ text: '', type: '' });
  };

  // Handle Add trigger
  const handleAddClick = () => {
    setEditProductId(null);
    setFormData({
      ...initialFormState,
      brand: brands.length > 0 ? brands[0].name : ''
    });
    setIsFormOpen(true);
    setMessage({ text: '', type: '' });
  };

  // Form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Features list manager
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  // Specs list manager
  const addSpec = () => {
    if (newSpecLabel.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specs: [...prev.specs, { label: newSpecLabel.trim(), value: newSpecValue.trim() }]
      }));
      setNewSpecLabel('');
      setNewSpecValue('');
    }
  };

  const removeSpec = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== idx)
    }));
  };

  // Auto generate SKU
  const generateSKU = () => {
    const catCode = categoryDisplayName.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'N');
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const sku = `NBE-${catCode}-${randomNum}`;
    setFormData(prev => ({ ...prev, sku }));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setMessage({ text: 'Product name is required', type: 'error' });
      return;
    }
    if (!formData.image_url) {
      setMessage({ text: 'At least one product image is required', type: 'error' });
      return;
    }

    setFormLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Auto generate SKU if empty
      let finalSKU = formData.sku.trim();
      if (!finalSKU) {
        const catCode = categoryDisplayName.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'N');
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        finalSKU = `NBE-${catCode}-${randomNum}`;
      }

      // Generate slug from product name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const payload = {
        name: formData.name,
        slug,
        sku: finalSKU,
        category: categoryDisplayName,
        brand: formData.brand,
        regular_price: Number(formData.regular_price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : Number(formData.regular_price),
        stock_quantity: Number(formData.stock_quantity),
        status: formData.status,
        description: formData.description,
        short_description: formData.description.slice(0, 150),
        image_url: formData.image_url,
        gallery_images: formData.gallery_images,
        features: formData.features,
        specs: formData.specs,
        stock_status: Number(formData.stock_quantity) > 0 ? 'instock' : 'outofstock',
        tags: {
          list: [],
          features: formData.features,
          specs: formData.specs
        }
      };

      let error;
      if (editProductId) {
        const res = await supabase.from('products').update(payload).eq('id', editProductId);
        error = res.error;
      } else {
        const res = await supabase.from('products').insert([payload]);
        error = res.error;
      }

      if (error) throw error;

      await refreshStore();
      setMessage({ text: `Product successfully ${editProductId ? 'updated' : 'added'}!`, type: 'success' });
      
      // Close form and refresh after a short delay
      setTimeout(() => {
        setIsFormOpen(false);
        fetchProducts();
      }, 1000);

    } catch (err: any) {
      console.error('Error saving product:', err);
      setMessage({ text: err.message || 'Failed to save product', type: 'error' });
    } finally {
      setFormLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-green uppercase tracking-wider">
            <span>Category Manager</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{categoryDisplayName || 'Loading...'}</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage catalogue listings for {categoryDisplayName}</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-brand-green hover:bg-brand-green-dark text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center shadow-md shadow-brand-green/20 text-sm"
        >
          <Plus size={18} className="mr-1.5" />
          Add {categoryDisplayName}
        </button>
      </div>

      {/* Main Table view */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder={`Search ${categoryDisplayName}...`}
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
                <th className="p-4 font-medium">Brand</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading listings...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    <Package size={40} className="mx-auto text-gray-300 mb-2" />
                    No products listed under {categoryDisplayName} yet.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" onError={(e) => {e.currentTarget.style.display = 'none'}} />
                          ) : (
                            <Package size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-400 font-mono">SKU: {product.sku || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-brand-green">{product.brand || 'Generic'}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">₹{product.sale_price?.toLocaleString('en-IN')}</div>
                      {product.regular_price > product.sale_price && (
                        <div className="text-xs text-gray-400 line-through">₹{product.regular_price?.toLocaleString('en-IN')}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        product.stock_quantity === 0 ? 'bg-red-50 text-red-700 border border-red-100' :
                        product.stock_quantity <= 5 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {product.stock_quantity} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                        product.status === 'publish' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600 bg-gray-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'publish' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                        {product.status === 'publish' ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="inline-flex text-gray-400 hover:text-brand-green p-2 rounded-lg hover:bg-brand-green/10 transition-colors mr-1"
                        title="Edit Product"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
                        className="inline-flex text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Product"
                      >
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

      {/* Add / Edit Sliding Drawer Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Background Overlay */}
            <div 
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setIsFormOpen(false)}
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-2xl transform transition-all duration-300">
                <form onSubmit={handleSubmit} className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl rounded-l-3xl">
                  {/* Header */}
                  <div className="bg-gray-900 px-6 py-6 text-white flex justify-between items-center rounded-tl-3xl">
                    <div>
                      <h2 className="text-xl font-bold leading-6 text-white" id="slide-over-title">
                        {editProductId ? 'Edit Listing' : 'New Listing'}
                      </h2>
                      <p className="mt-1 text-sm text-gray-300">
                        Add product under <span className="font-semibold text-brand-green">{categoryDisplayName}</span>
                      </p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setIsFormOpen(false)}
                      className="text-gray-400 hover:text-white rounded-lg p-1.5 hover:bg-gray-800 transition-colors focus:outline-none"
                    >
                      <X size={22} />
                    </button>
                  </div>

                  {/* Body Form Fields */}
                  <div className="flex-1 space-y-6 px-6 py-6 text-sm text-gray-600">
                    {message.text && (
                      <div className={`p-4 rounded-xl flex items-start gap-2.5 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                        {message.type === 'success' ? <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5 text-emerald-500" /> : <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-500" />}
                        <span>{message.text}</span>
                      </div>
                    )}

                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 border-l-3 border-brand-green pl-2 uppercase tracking-wide">Basic Details</h3>
                      
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Product Name *</label>
                        <input 
                          type="text" 
                          name="name" 
                          required 
                          placeholder="e.g. Amaze Solar Power Inverter 3KVA"
                          value={formData.name} 
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green outline-none font-medium text-gray-900 text-sm" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">SKU (Auto-Generates if empty)</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              name="sku" 
                              placeholder="e.g. NBE-INV-48293"
                              value={formData.sku} 
                              onChange={handleChange}
                              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green outline-none text-xs font-mono font-bold text-gray-900" 
                            />
                            <button 
                              type="button" 
                              onClick={generateSKU}
                              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 transition-colors flex items-center gap-1"
                              title="Generate Random SKU"
                            >
                              <RefreshCw size={12} /> Gen
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Brand *</label>
                          <select 
                            name="brand" 
                            required 
                            value={formData.brand} 
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green outline-none font-medium text-gray-900 text-sm"
                          >
                            <option value="">Select Brand</option>
                            {brands.map(b => (
                              <option key={b.id} value={b.name}>{b.name}</option>
                            ))}
                            <option value="Generic">Generic / Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Direct Image File Upload Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900 border-l-3 border-brand-green pl-2 uppercase tracking-wide">Product Images</h3>
                      
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

                    {/* Pricing & Inventory */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900 border-l-3 border-brand-green pl-2 uppercase tracking-wide">Pricing & Stock</h3>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">MRP Price (₹) *</label>
                          <input 
                            type="number" 
                            name="regular_price" 
                            required 
                            min="0"
                            value={formData.regular_price} 
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green outline-none font-bold text-gray-900 text-sm" 
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Sale Price (₹)</label>
                          <input 
                            type="number" 
                            name="sale_price" 
                            min="0"
                            value={formData.sale_price} 
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green outline-none font-bold text-gray-900 text-sm" 
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Stock Quantity</label>
                          <input 
                            type="number" 
                            name="stock_quantity" 
                            min="0"
                            value={formData.stock_quantity} 
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green outline-none font-semibold text-gray-900 text-sm" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status & Description */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900 border-l-3 border-brand-green pl-2 uppercase tracking-wide">Visibility & Content</h3>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Status</label>
                          <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green outline-none font-medium text-gray-900 text-sm"
                          >
                            <option value="publish">Active (Live on Site)</option>
                            <option value="draft">Draft (Hidden)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Product Description *</label>
                          <textarea 
                            name="description" 
                            required 
                            rows={4}
                            placeholder="Detailed product descriptions, specifications outline, features description, etc."
                            value={formData.description} 
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green outline-none text-gray-900 text-sm leading-relaxed" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900 border-l-3 border-brand-green pl-2 uppercase tracking-wide">Key Highlight Features</h3>
                      
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="e.g. Pure Sine Wave, 25-Year Warranty" 
                          value={newFeature}
                          onChange={e => setNewFeature(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green outline-none text-sm"
                        />
                        <button 
                          type="button" 
                          onClick={addFeature}
                          className="bg-gray-100 hover:bg-gray-200 border border-gray-200 px-4 py-2 rounded-xl font-bold text-gray-700 text-xs transition-colors"
                        >
                          Add Feature
                        </button>
                      </div>

                      {formData.features.length > 0 && (
                        <ul className="space-y-2 mt-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                          {formData.features.map((feat, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-gray-200/50 text-xs text-gray-800">
                              <span className="font-medium flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
                                {feat}
                              </span>
                              <button 
                                type="button" 
                                onClick={() => removeFeature(idx)}
                                className="text-red-500 hover:text-red-700 font-semibold p-1"
                              >
                                <X size={14} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Specifications List */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 pb-8">
                      <h3 className="text-sm font-bold text-gray-900 border-l-3 border-brand-green pl-2 uppercase tracking-wide">Detailed Specifications</h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          placeholder="Specification Label (e.g. Capacity)" 
                          value={newSpecLabel}
                          onChange={e => setNewSpecLabel(e.target.value)}
                          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none text-xs"
                        />
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Value (e.g. 150 Ah)" 
                            value={newSpecValue}
                            onChange={e => setNewSpecValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none text-xs"
                          />
                          <button 
                            type="button" 
                            onClick={addSpec}
                            className="bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-2 rounded-xl font-bold text-gray-700 text-xs transition-colors whitespace-nowrap"
                          >
                            Add Spec
                          </button>
                        </div>
                      </div>

                      {formData.specs.length > 0 && (
                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="text-gray-400 uppercase tracking-wider border-b border-gray-200">
                                <th className="pb-1.5 font-medium">Spec Name</th>
                                <th className="pb-1.5 font-medium">Spec Value</th>
                                <th className="pb-1.5 text-right font-medium">Remove</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {formData.specs.map((spec, idx) => (
                                <tr key={idx} className="text-gray-700">
                                  <td className="py-2 font-medium text-gray-900">{spec.label}</td>
                                  <td className="py-2 text-gray-600">{spec.value}</td>
                                  <td className="py-2 text-right">
                                    <button 
                                      type="button" 
                                      onClick={() => removeSpec(idx)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                    >
                                      <X size={14} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-bl-3xl">
                    <button 
                      type="button" 
                      onClick={() => setIsFormOpen(false)}
                      className="px-5 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 font-semibold transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={formLoading}
                      className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center shadow-md shadow-brand-green/20 disabled:opacity-70 text-sm"
                    >
                      <Save size={16} className="mr-1.5" />
                      {formLoading ? 'Saving...' : 'Save Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
