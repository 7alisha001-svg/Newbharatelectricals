export interface NavItem {
  label: string;
  href: string;
  isButton?: boolean;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  iconName: string; 
  imageUrl: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}
