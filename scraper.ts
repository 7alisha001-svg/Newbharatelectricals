import * as cheerio from 'cheerio';
import * as fs from 'fs';

async function scrapeCategories() {
  const url = 'https://www.amaze-india.com/';
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const categoryLinks = new Set();
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/category/')) {
        const fullUrl = href.startsWith('http') ? href : `https://www.amaze-india.com${href}`;
        categoryLinks.add(fullUrl);
      }
    });
    
    return Array.from(categoryLinks);
  } catch (error) {
    return [];
  }
}

async function scrapeProductsFromCategory(categoryUrl) {
  try {
    const response = await fetch(categoryUrl);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const productLinks = new Set();
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/product/')) {
        const fullUrl = href.startsWith('http') ? href : `https://www.amaze-india.com${href}`;
        productLinks.add(fullUrl);
      }
    });
    
    return Array.from(productLinks);
  } catch (error) {
    return [];
  }
}

async function scrapeProductDetails(productUrl, categoryName) {
  try {
    const response = await fetch(productUrl);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const title = $('h1').text().trim() || $('title').text().replace('| Amaze India', '').trim();
    if (!title) return null;
    
    const allPrices = $('*').filter((i, el) => $(el).text().includes('MRP: ₹')).map((i, el) => $(el).text().replace(/\s+/g, ' ').trim()).get();
    const priceText = allPrices.find(p => p.length < 50) || '';
    let price = 0;
    const priceMatch = priceText.match(/₹([\d,]+)/);
    if (priceMatch) {
      price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    }
    
    let desc = '';
    $('.product-details, .description, #description, .tab-content, .short-desc').each((i, el) => {
       desc += $(el).text() + '\n';
    });
    desc = desc.replace(/\s+/g, ' ').trim() || title;
    
    const images = $('img').map((i, el) => $(el).attr('src')).get()
      .filter(src => src && (src.includes('product') || src.includes('upload')))
      .map(src => src.startsWith('http') ? src : `https://www.amaze-india.com${src.startsWith('/') ? '' : '/'}${src}`);
      
    const imageUrl = images.length > 0 ? images[0] : '';
    const galleryImages = images.slice(1, 5); // limit to 4 gallery images
    
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let sku = `AMZ-${slug.toUpperCase()}`; // USE FULL SLUG TO GUARANTEE UNIQUENESS
    if (sku.length > 50) {
      sku = sku.substring(0, 50); // limit to 50 chars but ensure uniqueness by appending a hash
      let hash = 0;
      for (let i = 0; i < slug.length; i++) {
          hash = ((hash << 5) - hash) + slug.charCodeAt(i);
          hash |= 0;
      }
      sku = `AMZ-${slug.substring(0, 35).toUpperCase()}-${Math.abs(hash)}`;
    }
    // Optionally grab SKU from page if it exists
    const pageSku = $('.sku').text().trim();
    if (pageSku) {
      sku = pageSku;
    }

    return {
      name: title,
      slug: slug,
      sku: sku,
      description: desc,
      short_description: desc.substring(0, 150) + '...',
      regular_price: price || 9999, // default if not found
      sale_price: price ? Math.floor(price * 0.9) : 8999,
      stock_quantity: Math.floor(10 + Math.random() * 40),
      category: categoryName,
      brand: 'Amaze India',
      image_url: imageUrl,
      gallery_images: galleryImages
    };
  } catch (error) {
    return null;
  }
}

function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

async function run() {
  const categories = await scrapeCategories();
  console.log(`Found ${categories.length} categories.`);
  
  const allProductLinks = new Set();
  const categoryMap = new Map();
  
  const catPromises = categories.map(async catUrl => {
    const catNameMatch = catUrl.match(/category\/([^.]+)/);
    const catName = catNameMatch ? catNameMatch[1].replace(/-/g, ' ') : 'General';
    const links = await scrapeProductsFromCategory(catUrl);
    links.forEach(link => {
      allProductLinks.add(link);
      if (!categoryMap.has(link)) categoryMap.set(link, catName.charAt(0).toUpperCase() + catName.slice(1));
    });
  });
  
  await Promise.all(catPromises);
  console.log(`Found ${allProductLinks.size} total products. Starting parallel import...`);
  
  const linksArray = Array.from(allProductLinks);
  const products = [];
  
  for (let i = 0; i < linksArray.length; i += 10) {
    const chunk = linksArray.slice(i, i + 10);
    const productPromises = chunk.map(async prodUrl => {
      const catName = categoryMap.get(prodUrl);
      const productData = await scrapeProductDetails(prodUrl, catName);
      if (productData) {
        products.push(productData);
      }
    });
    
    await Promise.all(productPromises);
    console.log(`Scraped ${products.length} products so far...`);
  }
  
  let sql = '-- Generated Products Import for Supabase\n\n';
  
  for (const p of products) {
    const galleryArr = p.gallery_images.map(url => `'${escapeSql(url)}'`).join(', ');
    const gallerySql = p.gallery_images.length > 0 ? `ARRAY[${galleryArr}]` : `ARRAY[]::TEXT[]`;
    
    sql += `INSERT INTO public.products (name, slug, sku, description, short_description, regular_price, sale_price, stock_quantity, stock_status, category, brand, image_url, gallery_images, tags, updated_at)
VALUES (
  '${escapeSql(p.name)}',
  '${escapeSql(p.slug)}',
  '${escapeSql(p.sku)}',
  '${escapeSql(p.description)}',
  '${escapeSql(p.short_description)}',
  ${p.regular_price},
  ${p.sale_price},
  ${p.stock_quantity},
  'instock',
  '${escapeSql(p.category)}',
  '${escapeSql(p.brand)}',
  '${escapeSql(p.image_url)}',
  ${gallerySql},
  ARRAY[]::TEXT[],
  NOW()
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  regular_price = EXCLUDED.regular_price,
  sale_price = EXCLUDED.sale_price,
  stock_quantity = EXCLUDED.stock_quantity,
  stock_status = EXCLUDED.stock_status,
  category = EXCLUDED.category,
  brand = EXCLUDED.brand,
  image_url = EXCLUDED.image_url,
  gallery_images = EXCLUDED.gallery_images,
  tags = EXCLUDED.tags,
  updated_at = NOW();\n\n`;
  }
  
  fs.writeFileSync('import-products.sql', sql);
  console.log(`\nSuccess! Wrote ${products.length} products to import-products.sql.`);
}

run();
