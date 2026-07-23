import { useStore } from '../../context/StoreContext';
import { useMedia } from '../../context/MediaContext';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Save, Building, Globe, Share2, MapPin, Phone, Mail, 
  HelpCircle, Sliders, Image as ImageIcon, Sparkles, Check, AlertCircle, Layout, MessageSquare
} from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'branding' | 'contact' | 'content' | 'seo' | 'shipping'>('branding');
  
  const [settings, setSettings] = useState<any>({
    logo_url: '',
    social_links: {
      footer_logo: '',
      header_logo_size: 80,
      footer_logo_size: 240,
      facebook: '',
      instagram: '',
      youtube: '',
      linkedin: '',
      twitter: '',
      whatsapp: '',
      announcement_bar: 'Powering India with Trusted Electrical & Solar Solutions',
      hero_subheading: 'India\'s #1 Choice for Inverters, Batteries & Solar Solutions',
      google_map_embed: '',
      business_hours: 'Mon - Sat: 9:00 AM - 8:00 PM',
      about_story: '',
      mission_statement: '',
      vision_statement: '',
      meta_title: 'New Bharat Electricals | Trusted Electrical & Solar Solutions',
      meta_description: 'Discover top quality inverters, batteries, solar panels and electrical accessories from top brands at New Bharat Electricals.',
      google_analytics_id: '',
      favicon_url: ''
    },
    business_name: 'New Bharat Electricals',
    email: '',
    phone: '',
    office_address: '',
    warehouse_address: '',
    gst_number: '',
    shipping_charges: 0,
    free_shipping_threshold: 0
  });

  const { refreshStore } = useStore();
  const { saveMedia, refreshMedia } = useMedia();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').eq('id', 'global').single();
      if (data) {
        setSettings({
          ...data,
          social_links: {
            ...settings.social_links,
            ...(data.social_links || {})
          }
        });
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await supabase.from('settings').upsert({ id: 'global', ...settings });

      if (settings.social_links?.footer_logo) {
        await saveMedia({
          image_key: 'footer_logo',
          title: 'Footer Logo (Light Theme)',
          category: 'Header & Footer',
          image_url: settings.social_links.footer_logo,
          alt_text: 'New Bharat Electricals Footer Logo'
        });
      }

      if (settings.logo_url) {
        await saveMedia({
          image_key: 'header_logo',
          title: 'Header Logo (Dark Theme)',
          category: 'Header & Footer',
          image_url: settings.logo_url,
          alt_text: 'New Bharat Electricals Header Logo'
        });
      }

      await refreshStore();
      await refreshMedia();
      setMessage({ text: 'Website settings and content saved successfully!', type: 'success' });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      setMessage({ text: error.message || 'Failed to save settings.', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSocialChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      social_links: {
        ...settings.social_links,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-brand-green/10 text-brand-green rounded-xl">
              <Sliders size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-black text-gray-900 uppercase">Website & CMS Settings</h1>
              <p className="text-gray-500 text-xs mt-0.5">Control logos, contact info, SEO meta tags, banners, and store preferences</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-dark text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
        >
          <Save size={18} />
          <span>{loading ? 'Saving Changes...' : 'Save All Settings'}</span>
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-2 bg-white p-2 rounded-2xl border shadow-xs custom-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'branding' ? 'bg-brand-green text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Building size={16} />
          <span>Branding & Logos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'contact' ? 'bg-brand-green text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Phone size={16} />
          <span>Contact & Locations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'content' ? 'bg-brand-green text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Layout size={16} />
          <span>Homepage & About Text</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'seo' ? 'bg-brand-green text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Globe size={16} />
          <span>SEO & Social Links</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'shipping' ? 'bg-brand-green text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Sliders size={16} />
          <span>Shipping & Policies</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab 1: Branding & Logos */}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b pb-3">Brand Identity & Logos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Business Name</label>
                <input 
                  type="text" 
                  name="business_name" 
                  value={settings.business_name || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">GST Number</label>
                <input 
                  type="text" 
                  name="gst_number" 
                  value={settings.gst_number || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green font-mono" 
                />
              </div>

              {/* Header Logo */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700">Header Logo (Light Background)</label>
                <ImageUploader 
                  images={settings.logo_url ? [settings.logo_url] : []} 
                  onChange={(urls) => setSettings({...settings, logo_url: urls.length > 0 ? urls[0] : ''})} 
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Header Logo Height ({settings.social_links?.header_logo_size || 80}px)
                  </label>
                  <input 
                    type="range" min="40" max="160" step="4"
                    value={settings.social_links?.header_logo_size || 80}
                    onChange={(e) => handleSocialChange('header_logo_size', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Footer Logo */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700">Footer Logo (Dark Background)</label>
                <ImageUploader 
                  images={settings.social_links?.footer_logo ? [settings.social_links.footer_logo] : []} 
                  onChange={(urls) => handleSocialChange('footer_logo', urls.length > 0 ? urls[0] : '')} 
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Footer Logo Size ({settings.social_links?.footer_logo_size || 340}px)
                  </label>
                  <input 
                    type="range" min="100" max="500" step="10"
                    value={settings.social_links?.footer_logo_size || 340}
                    onChange={(e) => handleSocialChange('footer_logo_size', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Contact & Locations */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b pb-3">Contact Information & Store Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Support Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={settings.email || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Support Phone</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={settings.phone || ''} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Number (For Direct Enquiries)</label>
                <input 
                  type="text" 
                  value={settings.social_links?.whatsapp || ''} 
                  onChange={(e) => handleSocialChange('whatsapp', e.target.value)} 
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Business Hours</label>
                <input 
                  type="text" 
                  value={settings.social_links?.business_hours || ''} 
                  onChange={(e) => handleSocialChange('business_hours', e.target.value)} 
                  placeholder="e.g. Mon - Sat: 9:00 AM - 8:00 PM"
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Office Address</label>
                <textarea 
                  name="office_address" 
                  value={settings.office_address || ''} 
                  onChange={handleChange} 
                  rows={3} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Warehouse Address</label>
                <textarea 
                  name="warehouse_address" 
                  value={settings.warehouse_address || ''} 
                  onChange={handleChange} 
                  rows={3} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Google Maps Embed URL / Share Link</label>
                <input 
                  type="text" 
                  value={settings.social_links?.google_map_embed || ''} 
                  onChange={(e) => handleSocialChange('google_map_embed', e.target.value)} 
                  placeholder="https://maps.google.com/..."
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green font-mono" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Homepage & Content */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b pb-3">Homepage Announcements & About Us Content</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Header Announcement Bar Text</label>
                <input 
                  type="text" 
                  value={settings.social_links?.announcement_bar || ''} 
                  onChange={(e) => handleSocialChange('announcement_bar', e.target.value)} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Hero Section Tagline / Subheading</label>
                <input 
                  type="text" 
                  value={settings.social_links?.hero_subheading || ''} 
                  onChange={(e) => handleSocialChange('hero_subheading', e.target.value)} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Company Story / Overview Paragraph</label>
                <textarea 
                  rows={4}
                  value={settings.social_links?.about_story || ''} 
                  onChange={(e) => handleSocialChange('about_story', e.target.value)} 
                  placeholder="Describe your company history and vision..."
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mission Statement</label>
                  <textarea 
                    rows={3}
                    value={settings.social_links?.mission_statement || ''} 
                    onChange={(e) => handleSocialChange('mission_statement', e.target.value)} 
                    className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vision Statement</label>
                  <textarea 
                    rows={3}
                    value={settings.social_links?.vision_statement || ''} 
                    onChange={(e) => handleSocialChange('vision_statement', e.target.value)} 
                    className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: SEO & Social Links */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b pb-3">Search Engine Optimization & Social Links</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Global Meta Title</label>
                <input 
                  type="text" 
                  value={settings.social_links?.meta_title || ''} 
                  onChange={(e) => handleSocialChange('meta_title', e.target.value)} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Global Meta Description</label>
                <textarea 
                  rows={3}
                  value={settings.social_links?.meta_description || ''} 
                  onChange={(e) => handleSocialChange('meta_description', e.target.value)} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Google Analytics ID / Tag Manager ID</label>
                <input 
                  type="text" 
                  value={settings.social_links?.google_analytics_id || ''} 
                  onChange={(e) => handleSocialChange('google_analytics_id', e.target.value)} 
                  placeholder="G-XXXXXXX"
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green font-mono" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Facebook URL</label>
                <input 
                  type="text" 
                  value={settings.social_links?.facebook || ''} 
                  onChange={(e) => handleSocialChange('facebook', e.target.value)} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Instagram URL</label>
                <input 
                  type="text" 
                  value={settings.social_links?.instagram || ''} 
                  onChange={(e) => handleSocialChange('instagram', e.target.value)} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">YouTube Channel URL</label>
                <input 
                  type="text" 
                  value={settings.social_links?.youtube || ''} 
                  onChange={(e) => handleSocialChange('youtube', e.target.value)} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn URL</label>
                <input 
                  type="text" 
                  value={settings.social_links?.linkedin || ''} 
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Twitter / X URL</label>
                <input 
                  type="text" 
                  value={settings.social_links?.twitter || ''} 
                  onChange={(e) => handleSocialChange('twitter', e.target.value)} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Shipping & Policies */}
        {activeTab === 'shipping' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b pb-3">Shipping Rates & Order Options</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Standard Shipping Charge (₹)</label>
                <input 
                  type="number" 
                  name="shipping_charges" 
                  value={settings.shipping_charges || 0} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Free Shipping Threshold (₹)</label>
                <input 
                  type="number" 
                  name="free_shipping_threshold" 
                  value={settings.free_shipping_threshold || 0} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer save button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-brand-green hover:bg-brand-dark text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-brand-green/20 disabled:opacity-50"
          >
            <Save size={18} />
            <span>{loading ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

