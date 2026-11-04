import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { CheckCircle2,Heart,SlidersHorizontal, Zap } from 'lucide-react';
import { formatSlugToTitle } from '../utils/formatters';
import { useStore } from '../context/StoreContext';
import { categoryNav, mainNavLinks } from '../data/navigation';
import { useState } from 'react';
import ProductEnquiryModal from '../components/ProductEnquiryModal';

const categorySlugToName: Record<string, string> = {
  'inverters': 'Inverters',
  'batteries': 'Batteries',
  '3-phase-inverters': '3-Phase Inverters',
  'lift-inverters': 'Lift Inverters',
  'combo-products': 'Combo Products',
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

export default function GenericSubCategoryPage() {
  const { category, subcategory } = useParams<{ category: string, subcategory: string }>();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [enquiryProduct, setEnquiryProduct] = useState<{ id: string; name: string; sku: string } | null>(null);
  const { products: storeProducts, categories: storeCategories, brands: storeBrands, settings } = useStore();
  
  const categoryTitle = formatSlugToTitle(category);
  const defaultSubCategoryTitle = formatSlugToTitle(subcategory);
  const title = defaultSubCategoryTitle;
  
  const description = Discover our premium line of . Engineered for superior performance and unmatched reliability in every condition.;
  
  const expectedCategoryName = subcategory ? categorySlugToName[subcategory] : undefined;

  const matchBrand = (prodBrand: string, brandName: string, brandSlug: string) => {
    if (!prodBrand) return false;
    const pb = prodBrand.toLowerCase().replace(/[^a-z0-9]/g, '');
    const bn = brandName ? brandName.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    const bs = brandSlug ? brandSlug.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    if (bn && pb === bn) return true;
    if (bs && pb === bs) return true;
    if (bn && (pb === bn || pb.includes(bn) || bn.includes(pb))) return true;
    if (bs && (pb === bs || pb.includes(bs) || bs.includes(pb))) return true;
    return false;
  };

  const categoryProducts = storeProducts.filter(p => {
    if (!subcategory) return false;
    if (expectedCategoryName) {
      return p.category === expectedCategoryName;
    }
    if (p.slug === subcategory) return true;
    if (!p.category) return false;
    const prodCat = p.category.toLowerCase().replace(/[^a-z0-9]/g, '');
    const urlSubCat = subcategory.toLowerCase().replace(/[^a-z0-9]/g, '');
    const s1 = prodCat.endsWith('s') ? prodCat.slice(0, -1) : prodCat;
    const s2 = urlSubCat.endsWith('s') ? urlSubCat.slice(0, -1) : urlSubCat;
    return s1 === s2;
  });

  let products = categoryProducts;
  if (selectedBrand) {
    const brand = storeBrands.find(b => b.id === selectedBrand);
    if (brand) {
      products = categoryProducts.filter(p => matchBrand(p.brand, brand.name, brand.slug));
    }
  }

  const brandsInCategory = storeBrands;
