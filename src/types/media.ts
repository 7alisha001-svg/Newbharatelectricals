export interface WebsiteMedia {
  id: string;
  image_key: string;
  title: string;
  category: string;
  image_url: string;
  alt_text: string;
  created_at?: string;
  updated_at?: string;
}

export type MediaCategory = 
  | 'All'
  | 'Header & Footer'
  | 'Hero Banners'
  | 'About Us'
  | 'Promo Banners'
  | 'Category Banners'
  | 'Contact & Stores'
  | 'Blog'
  | 'Products & Brands'
  | 'General';
