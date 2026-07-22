import { supabase } from './supabase';
import { WebsiteMedia } from '../types/media';
import { v4 as uuidv4 } from 'uuid';

export async function compressAndConvertImage(
  file: File, 
  maxWidth = 1920, 
  quality = 0.82
): Promise<File | Blob> {
  // If vector SVG, return original file without canvas modification
  if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp if canvas supports it
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const convertedName = file.name.substring(0, file.name.lastIndexOf('.')) + '.webp';
              const webpFile = new File([blob], convertedName, { type: 'image/webp' });
              resolve(webpFile);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export async function uploadMediaFile(
  file: File, 
  onProgress?: (percent: number) => void
): Promise<string> {
  // Check maximum file size (5MB limit)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 5 MB limit.`);
  }

  // Validate extension
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/jpg'];
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!validTypes.includes(file.type) && !['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext || '')) {
    throw new Error('Unsupported image format. Allowed formats: JPG, PNG, WEBP, SVG');
  }

  onProgress?.(20);

  // Compress non-SVG image
  let processedFile: File | Blob = file;
  try {
    processedFile = await compressAndConvertImage(file);
    onProgress?.(50);
  } catch (err) {
    console.warn('Image compression fallback to original file:', err);
  }

  const fileExt = file.name.endsWith('.svg') ? 'svg' : 'webp';
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `website/${fileName}`;

  try {
    // Attempt upload to 'website-images' bucket
    const { error } = await supabase.storage
      .from('website-images')
      .upload(filePath, processedFile, {
        cacheControl: '31536000',
        upsert: true,
        contentType: file.name.endsWith('.svg') ? 'image/svg+xml' : 'image/webp'
      });

    onProgress?.(80);

    if (error) {
      console.warn('Failed uploading to website-images bucket, trying fallback bucket...', error);
      // Try fallback to 'products' bucket
      const { error: prodErr } = await supabase.storage
        .from('products')
        .upload(filePath, processedFile, { cacheControl: '31536000', upsert: true });

      if (prodErr) {
        throw prodErr;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      onProgress?.(100);
      return publicUrl;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('website-images')
      .getPublicUrl(filePath);

    onProgress?.(100);
    return publicUrl;
  } catch (err) {
    console.warn('Supabase storage upload error, converting to data URL fallback:', err);
    // Fallback to Data URL if storage bucket fails
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onProgress?.(100);
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(processedFile);
    });
  }
}

export async function fetchMediaFromDb(): Promise<WebsiteMedia[]> {
  try {
    const { data, error } = await supabase
      .from('website_media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('website_media table query notice/error:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching website media:', err);
    return [];
  }
}

export async function saveMediaToDb(item: Partial<WebsiteMedia>): Promise<WebsiteMedia | null> {
  const payload = {
    id: item.id || uuidv4(),
    image_key: item.image_key || `img_${Date.now()}`,
    title: item.title || 'Untitled Image',
    category: item.category || 'General',
    image_url: item.image_url || '',
    alt_text: item.alt_text || item.title || 'Website Image',
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('website_media')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.warn('Failed saving to website_media table (using returned payload):', error.message);
      return payload as WebsiteMedia;
    }

    return data;
  } catch (err) {
    console.error('Error saving website media:', err);
    return payload as WebsiteMedia;
  }
}

export async function deleteMediaFromDb(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('website_media')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Notice deleting website_media item:', error.message);
    }
    return true;
  } catch (err) {
    console.error('Error deleting media from DB:', err);
    return false;
  }
}
