import { supabase } from './supabase';
import { WebsiteMedia } from '../types/media';
import { v4 as uuidv4 } from 'uuid';

export function normalizeMediaUrl(imageUrl: string | null | undefined, version?: string | number): string {
  if (!imageUrl) return '';

  try {
    const parsed = new URL(imageUrl);
    const isSupabaseStorageUrl = parsed.hostname.includes('supabase') && parsed.pathname.includes('/storage/v1/object/public/');
    if (isSupabaseStorageUrl) {
      const separator = parsed.search ? '&' : '?';
      const suffix = `v=${encodeURIComponent(String(version ?? Date.now()))}`;
      return `${imageUrl}${separator}${suffix}`;
    }
  } catch {
    // Keep relative and non-URL values as-is
  }

  return imageUrl;
}

export async function compressAndConvertImage(
  file: File, 
  maxWidth = 1920, 
  quality = 0.82
): Promise<File | Blob> {
  // If vector SVG or transparent PNG, return original file without canvas modification
  if (
    file.type === 'image/svg+xml' || 
    file.type === 'image/png' || 
    file.name.endsWith('.svg') || 
    file.name.endsWith('.png')
  ) {
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

  let fileExt = 'webp';
  let contentType = 'image/webp';

  if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
    fileExt = 'svg';
    contentType = 'image/svg+xml';
  } else if (file.type === 'image/png' || file.name.endsWith('.png')) {
    fileExt = 'png';
    contentType = 'image/png';
  } else if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
    fileExt = 'jpg';
    contentType = 'image/jpeg';
  }

  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `website/${fileName}`;

  try {
    // Attempt upload to 'website-images' bucket
    const { error } = await supabase.storage
      .from('website-images')
      .upload(filePath, processedFile, {
        cacheControl: '31536000',
        upsert: true,
        contentType
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
      return normalizeMediaUrl(publicUrl, Date.now());
    }

    const { data: { publicUrl } } = supabase.storage
      .from('website-images')
      .getPublicUrl(filePath);

    onProgress?.(100);
    return normalizeMediaUrl(publicUrl, Date.now());
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
  const imageKey = item.image_key || `img_${Date.now()}`;

  let validDbId: string | undefined = undefined;

  // Always check if a DB record with this image_key already exists first
  if (imageKey) {
    try {
      const { data: existing } = await supabase
        .from('website_media')
        .select('id')
        .eq('image_key', imageKey)
        .maybeSingle();
      
      if (existing?.id) {
        validDbId = existing.id;
      }
    } catch (e) {
      console.warn('Could not query existing media record by key:', e);
    }
  }

  // If no existing record by image_key, check if item.id is a valid UUID
  if (!validDbId && item.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id)) {
    validDbId = item.id;
  }

  // Generate new UUID if still undefined
  if (!validDbId) {
    validDbId = uuidv4();
  }

  const payload = {
    id: validDbId,
    image_key: imageKey,
    title: item.title || 'Untitled Image',
    category: item.category || 'General',
    image_url: normalizeMediaUrl(item.image_url, new Date().toISOString()),
    alt_text: item.alt_text || item.title || 'Website Image',
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('website_media')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('Notice saving to website_media table (using returned payload):', error.message);
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
