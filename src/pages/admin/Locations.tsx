import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { supabase } from '../../lib/supabase';
import { Save } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export interface LocationData {
  type: 'office' | 'warehouse';
  business_name?: string;
  address: string;
  phone?: string;
  email?: string;
  business_hours?: string;
  map_embed_code?: string;
  map_link?: string;
  status: 'active' | 'inactive';
}

const defaultOffice: LocationData = {
  type: 'office',
  business_name: 'New Bharat Electricals',
  address: 'Near Dr Amar Singh,\nChaudhry Sarai,\nLalpul Road,\nBudaun HO,\nBudaun – 243601,\nUttar Pradesh',
  phone: '+91 94570 02000',
  email: 'info@newbharatelectricals.com',
  business_hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
  map_embed_code: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3513.3102435798993!2d79.11718047535552!3d28.02640207599026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a008c2306d1dd5%3A0xe979dcc4999f7d0c!2sNew%20Bharat%20Electricals!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  map_link: 'https://maps.google.com/?q=New+Bharat+Electricals,Budaun',
  status: 'active'
};

const defaultWarehouse: LocationData = {
  type: 'warehouse',
  business_name: 'Warehouse',
  address: 'Budaun,\nLoda Bahedi,\nUttar Pradesh – 243601',
  phone: '',
  email: '',
  business_hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
  map_embed_code: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3187.2085967722574!2d79.103706!3d28.0250826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3975471789b6cc9b%3A0x6148611cea0ac42e!2sBharat%20Energies!5e1!3m2!1sen!2sin!4v1786642702074!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
  map_link: 'https://maps.app.goo.gl/xe516YUtZfAUSDrR9?g_st=ic',
  status: 'active'
};

export default function Locations() {
  const { settings, refreshStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<LocationData[]>([]);

  useEffect(() => {
    if (settings?.social_links?.locations) {
      setLocations(settings.social_links.locations);
    } else {
      setLocations([defaultOffice, defaultWarehouse]);
    }
  }, [settings]);

  const handleChange = (index: number, field: keyof LocationData, value: string) => {
    const updatedLocations = [...locations];
    updatedLocations[index] = { ...updatedLocations[index], [field]: value };
    setLocations(updatedLocations);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedSocialLinks = {
        ...settings?.social_links,
        locations: locations
      };

      const { error } = await supabase
        .from('settings')
        .update({
          social_links: updatedSocialLinks
        })
        .eq('id', 'global');

      if (error) throw error;
      toast.success('Locations updated successfully');
      refreshStore();
    } catch (error: any) {
      console.error('Error updating locations:', error);
      toast.error('Failed to update locations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Locations</h1>
          <p className="text-gray-500 text-sm">Manage office and warehouse locations</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-brand-green text-white font-semibold rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-50"
        >
          <Save size={18} className="mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {locations.map((loc, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-md border-none">
            <h2 className="text-lg font-bold text-gray-900 mb-4 capitalize">{loc.type === 'office' ? 'Corporate Office' : 'Warehouse'}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business/Location Name</label>
                <input
                  type="text"
                  value={loc.business_name || ''}
                  onChange={(e) => handleChange(index, 'business_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  rows={4}
                  value={loc.address || ''}
                  onChange={(e) => handleChange(index, 'address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={loc.phone || ''}
                    onChange={(e) => handleChange(index, 'phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={loc.email || ''}
                    onChange={(e) => handleChange(index, 'email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
                <input
                  type="text"
                  value={loc.business_hours || ''}
                  onChange={(e) => handleChange(index, 'business_hours', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed Code (iframe)</label>
                <textarea
                  rows={3}
                  value={loc.map_embed_code || ''}
                  onChange={(e) => handleChange(index, 'map_embed_code', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
                <input
                  type="text"
                  value={loc.map_link || ''}
                  onChange={(e) => handleChange(index, 'map_link', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={loc.status || 'active'}
                  onChange={(e) => handleChange(index, 'status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-6 py-3 bg-brand-green text-white font-semibold rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-50"
        >
          <Save size={20} className="mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
