import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface Settings {
  id: string;
  business_name?: string;
  logo_url?: string;
  email?: string;
  phone?: string;
  office_address?: string;
  warehouse_address?: string;
  social_links?: any;
  gst_number?: string;
  shipping_charges?: number;
  free_shipping_threshold?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description?: string;
  regular_price: number;
  sale_price: number;
  stock_quantity: number;
  category: string;
  brand: string;
  image_url: string;
  gallery_images: string[];
  features: string[];
  specs: {label: string, value: string}[];
  stock_status: string;
  is_featured: boolean;
  status: string;
  created_at: string;
}

interface StoreContextType {
  categories: Category[];
  brands: Brand[];
  products: Product[];
  loading: boolean;
  settings: Settings | null;
  refreshStore: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType>({
  categories: [],
  brands: [],
  products: [],
  loading: true,
  settings: null,
  refreshStore: async () => {},
});

export const useStore = () => useContext(StoreContext);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);

  const fetchTimeout = useRef<NodeJS.Timeout | null>(null);
  const debouncedFetchData = () => {
    if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
    fetchTimeout.current = setTimeout(fetchData, 1000);
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, brandRes, prodRes, settingsRes] = await Promise.all([
        supabase.from('categories').select('*').order('name', { ascending: true }),
        supabase.from('brands').select('*').order('name', { ascending: true }),
        supabase.from('products').select('*').eq('status', 'publish').order('created_at', { ascending: false }),
        supabase.from('settings').select('*').eq('id', 'global').single(),
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (brandRes.data) setBrands(brandRes.data);
      if (prodRes.data) setProducts(prodRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching store data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();


    // Setup Realtime subscriptions
    const catSub = supabase
      .channel('categories_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        debouncedFetchData(); // Simplest way to ensure fully fresh data
      })
      .subscribe();

    const brandSub = supabase
      .channel('brands_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brands' }, () => {
        debouncedFetchData();
      })
      .subscribe();

    const settingsSub = supabase
      .channel('settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
        debouncedFetchData();
      })
      .subscribe();

    const prodSub = supabase
      .channel('products_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        debouncedFetchData();
      })
      .subscribe();

    return () => {
      catSub.unsubscribe();
      brandSub.unsubscribe();
      prodSub.unsubscribe();
      settingsSub.unsubscribe();
    };
  }, []);

  return (
    <StoreContext.Provider value={{ categories, brands, products, loading, settings, refreshStore: fetchData }}>
      {children}
    </StoreContext.Provider>
  );
};
