import { useStore } from '../../context/StoreContext';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Plus, Trash2, ChevronDown, ChevronUp} from 'lucide-react';
import { mainNavLinks as defaultNavLinks } from '../../data/navigation';

export default function Navigation() {
  const [navItems, setNavItems] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any>({});
  const { refreshStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNav = async () => {
      const { data } = await supabase.from('settings').select('social_links').eq('id', 'global').single();
      if (data && data.social_links) {
        setSocialLinks(data.social_links);
        setNavItems(data.social_links.navigation || defaultNavLinks);
      } else {
        setNavItems(defaultNavLinks);
      }
    };
    fetchNav();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const updatedSocialLinks = { ...socialLinks, navigation: navItems };
      await supabase.from('settings').upsert({ id: 'global', social_links: updatedSocialLinks });
      await refreshStore();
      setMessage('Navigation saved successfully.');
    } catch (error) {
      console.error('Error saving navigation:', error);
      setMessage('Failed to save navigation.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const addMenuItem = () => {
    setNavItems([...navItems, { name: 'New Item', href: '/', hasDropdown: false, dropdownItems: [] }]);
  };

  const removeMenuItem = (index: number) => {
    const newItems = [...navItems];
    newItems.splice(index, 1);
    setNavItems(newItems);
  };

  const updateMenuItem = (index: number, field: string, value: any) => {
    const newItems = [...navItems];
    newItems[index][field] = value;
    setNavItems(newItems);
  };

  const addDropdownItem = (parentIndex: number) => {
    const newItems = [...navItems];
    if (!newItems[parentIndex].dropdownItems) {
      newItems[parentIndex].dropdownItems = [];
    }
    newItems[parentIndex].dropdownItems.push({ name: 'Sub Item', href: '/' });
    setNavItems(newItems);
  };

  const removeDropdownItem = (parentIndex: number, subIndex: number) => {
    const newItems = [...navItems];
    newItems[parentIndex].dropdownItems.splice(subIndex, 1);
    setNavItems(newItems);
  };

  const updateDropdownItem = (parentIndex: number, subIndex: number, field: string, value: any) => {
    const newItems = [...navItems];
    newItems[parentIndex].dropdownItems[subIndex][field] = value;
    setNavItems(newItems);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...navItems];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setNavItems(newItems);
  };

  const moveDown = (index: number) => {
    if (index === navItems.length - 1) return;
    const newItems = [...navItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setNavItems(newItems);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Header Navigation</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center bg-brand-green text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-green-dark"
        >
          <Save size={18} className="mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500 mb-6">Manage the main navigation links shown in the header and footer.</p>

        <div className="space-y-4">
          {navItems.map((item, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveUp(index)} className="p-1 hover:bg-gray-200 rounded text-gray-500" disabled={index === 0}><ChevronUp size={16} /></button>
                  <button onClick={() => moveDown(index)} className="p-1 hover:bg-gray-200 rounded text-gray-500" disabled={index === navItems.length - 1}><ChevronDown size={16} /></button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 flex-grow">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Label</label>
                    <input 
                      type="text" 
                      value={item.name} 
                      onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Link URL</label>
                    <input 
                      type="text" 
                      value={item.href} 
                      onChange={(e) => updateMenuItem(index, 'href', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-green"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input 
                      type="checkbox" 
                      checked={item.hasDropdown} 
                      onChange={(e) => updateMenuItem(index, 'hasDropdown', e.target.checked)}
                      className="rounded text-brand-green"
                    />
                    Has Dropdown
                  </label>
                </div>

                <button onClick={() => removeMenuItem(index)} className="text-red-500 hover:bg-red-50 p-2 rounded mt-5">
                  <Trash2 size={18} />
                </button>
              </div>

              {item.hasDropdown && (
                <div className="pl-12 space-y-3 border-l-2 border-brand-green/30 ml-3">
                  <h4 className="text-sm font-bold text-gray-700 flex justify-between items-center">
                    Dropdown Items
                    <button onClick={() => addDropdownItem(index)} className="text-brand-green hover:underline text-xs flex items-center">
                      <Plus size={14} className="mr-1" /> Add Sub Item
                    </button>
                  </h4>
                  
                  {(item.dropdownItems || []).map((subItem: any, subIndex: number) => (
                    <div key={subIndex} className="flex items-center gap-4 bg-white p-3 rounded border border-gray-100 shadow-sm">
                      <div className="grid grid-cols-2 gap-4 flex-grow">
                        <input 
                          type="text" 
                          placeholder="Label"
                          value={subItem.name} 
                          onChange={(e) => updateDropdownItem(index, subIndex, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-brand-green"
                        />
                        <input 
                          type="text" 
                          placeholder="/link"
                          value={subItem.href} 
                          onChange={(e) => updateDropdownItem(index, subIndex, 'href', e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-brand-green"
                        />
                      </div>
                      <button onClick={() => removeDropdownItem(index, subIndex)} className="text-red-400 hover:text-red-600 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {(!item.dropdownItems || item.dropdownItems.length === 0) && (
                    <p className="text-xs text-gray-500 italic">No dropdown items yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={addMenuItem}
          className="mt-6 flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-brand-green hover:text-brand-green font-medium transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Main Menu Item
        </button>
      </div>
    </div>
  );
}
