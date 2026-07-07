import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
}

const StoreContext = createContext<StoreContextType>({
  categories: [],
  brands: [],
  products: [],
  loading: true,
});

export const useStore = () => useContext(StoreContext);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, brandRes, prodRes] = await Promise.all([
          supabase.from('categories').select('*').order('name', { ascending: true }),
          supabase.from('brands').select('*').order('name', { ascending: true }),
          supabase.from('products').select('*').eq('status', 'publish').order('created_at', { ascending: false }),
        ]);

        if (catRes.data) setCategories(catRes.data);
        if (brandRes.data) setBrands(brandRes.data);
        if (prodRes.data) setProducts(prodRes.data);
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Setup Realtime subscriptions
    const catSub = supabase
      .channel('categories_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        fetchData(); // Simplest way to ensure fully fresh data
      })
      .subscribe();

    const brandSub = supabase
      .channel('brands_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brands' }, () => {
        fetchData();
      })
      .subscribe();

    const prodSub = supabase
      .channel('products_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      catSub.unsubscribe();
      brandSub.unsubscribe();
      prodSub.unsubscribe();
    };
  }, []);

  return (
    <StoreContext.Provider value={{ categories, brands, products, loading }}>
      {children}
    </StoreContext.Provider>
  );
};
