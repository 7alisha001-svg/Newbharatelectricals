import { useStore } from '../../context/StoreContext';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState<any>({
    business_name: '',
    email: '',
    phone: '',
    office_address: '',
    warehouse_address: '',
    gst_number: '',
    shipping_charges: 0,
    free_shipping_threshold: 0
  });
  const { refreshStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').eq('id', 'global').single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await supabase.from('settings').upsert({ id: 'global', ...settings });
      await refreshStore();
      setMessage('Settings saved successfully.');
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage('Failed to save settings.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your business information and preferences</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
             <input type="text" name="business_name" value={settings.business_name || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
             <input type="text" name="gst_number" value={settings.gst_number || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
             <input type="email" name="email" value={settings.email || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
             <input type="text" name="phone" value={settings.phone || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green" />
          </div>
          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
             <textarea name="office_address" value={settings.office_address || ''} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green" />
          </div>
          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Address</label>
             <textarea name="warehouse_address" value={settings.warehouse_address || ''} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Charges (₹)</label>
             <input type="number" name="shipping_charges" value={settings.shipping_charges || 0} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold (₹)</label>
             <input type="number" name="free_shipping_threshold" value={settings.free_shipping_threshold || 0} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green" />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button type="submit" disabled={loading} className="bg-brand-green hover:bg-brand-green-dark text-white font-medium py-2 px-6 rounded-xl transition-colors flex items-center shadow-lg shadow-brand-green/20 disabled:opacity-70">
            <Save size={18} className="mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
