import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../context/StoreContext';
import { Plus, Edit2, Trash2, GripVertical, Settings, Save } from 'lucide-react';
import { uploadImage } from '../../lib/upload';

export default function BrandSliderAdmin() {
  const { settings, refreshStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [items, setItems] = useState<any[]>([]);
  const [config, setConfig] = useState<any>({
    autoplay: true,
    speed: 3000,
    infinite: true,
    desktop: 5,
    tablet: 3,
    mobile: 2,
    spacing: 24
  });

  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (settings?.social_links?.brand_slider?.items) {
      setItems(settings.social_links.brand_slider.items);
    }
    if (settings?.social_links?.brand_slider?.config) {
      setConfig({ ...config, ...settings.social_links.brand_slider.config });
    }
  }, [settings]);

  const saveSettings = async (newItems: any[], newConfig: any) => {
    setLoading(true);
    setMessage('');
    try {
      const socialLinks = settings?.social_links || {};
      const newSettings = {
        ...settings,
        social_links: {
          ...socialLinks,
          brand_slider: {
            items: newItems,
            config: newConfig
          }
        }
      };
      
      await supabase.from('settings').upsert(newSettings);
      await refreshStore();
      setMessage('Settings saved successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving brand slider settings:', error);
      setMessage('Error saving settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('index', index.toString());
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    const dragIndex = parseInt(e.dataTransfer.getData('index'));
    if (dragIndex === dropIndex) return;
    
    const newItems = [...items];
    const [draggedItem] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    
    // Update order
    newItems.forEach((item, idx) => item.order = idx);
    setItems(newItems);
    saveSettings(newItems, config);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      const newItems = items.filter(item => item.id !== id);
      setItems(newItems);
      saveSettings(newItems, config);
    }
  };

  const toggleItem = (id: string) => {
    const newItems = items.map(item => item.id === id ? { ...item, is_enabled: !item.is_enabled } : item);
    setItems(newItems);
    saveSettings(newItems, config);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Slider</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage homepage brand carousel</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditingConfig(!isEditingConfig)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors flex items-center"
          >
            <Settings size={18} className="mr-2" />
            Config
          </button>
          <button 
            onClick={() => {
              setEditingItem({ id: crypto.randomUUID(), name: '', logo_url: '', link: '', is_enabled: true, order: items.length });
              setIsFormOpen(true);
            }}
            className="bg-brand-green hover:bg-brand-green-dark text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Add Brand
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl">
          {message}
        </div>
      )}

      {isEditingConfig && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Slider Configuration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Autoplay</label>
              <select 
                value={config.autoplay ? 'yes' : 'no'} 
                onChange={e => setConfig({...config, autoplay: e.target.value === 'yes'})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Autoplay Speed (ms)</label>
              <input 
                type="number" 
                value={config.speed} 
                onChange={e => setConfig({...config, speed: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Infinite Loop</label>
              <select 
                value={config.infinite ? 'yes' : 'no'} 
                onChange={e => setConfig({...config, infinite: e.target.value === 'yes'})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Space Between (px)</label>
              <input 
                type="number" 
                value={config.spacing} 
                onChange={e => setConfig({...config, spacing: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desktop Items</label>
              <input 
                type="number" 
                value={config.desktop} 
                onChange={e => setConfig({...config, desktop: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tablet Items</label>
              <input 
                type="number" 
                value={config.tablet} 
                onChange={e => setConfig({...config, tablet: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Items</label>
              <input 
                type="number" 
                value={config.mobile} 
                onChange={e => setConfig({...config, mobile: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
              />
            </div>
          </div>
          <button 
            onClick={() => saveSettings(items, config)}
            disabled={loading}
            className="mt-4 bg-brand-green hover:bg-brand-green-dark text-white font-medium py-2 px-6 rounded-xl transition-colors"
          >
            Save Configuration
          </button>
        </div>
      )}

      {isFormOpen && editingItem && (
        <BrandForm 
          item={editingItem} 
          onSave={(updatedItem) => {
            const exists = items.find(i => i.id === updatedItem.id);
            let newItems;
            if (exists) {
              newItems = items.map(i => i.id === updatedItem.id ? updatedItem : i);
            } else {
              newItems = [...items, updatedItem];
            }
            setItems(newItems);
            saveSettings(newItems, config);
            setIsFormOpen(false);
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {!isFormOpen && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium w-10"></th>
                  <th className="p-4 font-medium">Logo</th>
                  <th className="p-4 font-medium">Brand Name</th>
                  <th className="p-4 font-medium">Link</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {items.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-500">No brands in slider.</td></tr>
                ) : (
                  [...items].sort((a,b) => a.order - b.order).map((item, index) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-gray-50 transition-colors"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragOver={handleDragOver}
                    >
                      <td className="p-4 cursor-grab text-gray-400">
                        <GripVertical size={16} />
                      </td>
                      <td className="p-4">
                        <img src={item.logo_url} alt={item.name} className="w-16 h-10 object-contain bg-white rounded border border-gray-100 p-1" />
                      </td>
                      <td className="p-4 font-medium text-gray-900">{item.name}</td>
                      <td className="p-4 text-gray-500">{item.link}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => toggleItem(item.id)}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${item.is_enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {item.is_enabled ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => {
                            setEditingItem(item);
                            setIsFormOpen(true);
                          }} 
                          className="text-gray-400 hover:text-brand-green p-2 rounded-lg hover:bg-brand-green/10 transition-colors mr-1 inline-block"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
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
      )}
    </div>
  );
}

function BrandForm({ item, onSave, onCancel }: { item: any, onSave: (item: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(item);
  const [uploading, setUploading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(item.logo_url);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let logo_url = formData.logo_url;
    
    if (logoFile) {
      setUploading(true);
      try {
        logo_url = await uploadImage(logoFile);
      } catch (err) {
        alert("Failed to upload image.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    
    onSave({ ...formData, logo_url });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold mb-4">{item.name ? 'Edit Brand' : 'Add Brand'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
          <input 
            type="text" 
            required
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl"
            placeholder="e.g. Havells"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link URL *</label>
          <input 
            type="text" 
            required
            value={formData.link} 
            onChange={e => setFormData({...formData, link: e.target.value})}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl"
            placeholder="e.g. /brands/havells"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand Logo * (PNG, JPG, SVG, WebP)</label>
          <div className="flex items-center gap-4">
            {preview && (
              <img src={preview} alt="Preview" className="w-20 h-20 object-contain bg-gray-50 border border-gray-200 rounded-lg p-2" />
            )}
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
              onChange={handleFileChange}
              className="text-sm"
              required={!formData.logo_url}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            id="is_enabled" 
            checked={formData.is_enabled}
            onChange={e => setFormData({...formData, is_enabled: e.target.checked})}
            className="rounded text-brand-green"
          />
          <label htmlFor="is_enabled" className="text-sm text-gray-700">Enable Brand</label>
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            type="submit" 
            disabled={uploading}
            className="bg-brand-green hover:bg-brand-green-dark text-white font-medium py-2 px-6 rounded-xl transition-colors flex items-center"
          >
            {uploading ? 'Uploading...' : <><Save size={18} className="mr-2" /> Save Brand</>}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
