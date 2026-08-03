import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(
  file: File,
  folder: string = "products"
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from('website-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error("Upload Error:", error);
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from('website-images')
    .getPublicUrl(filePath);

  return publicUrl;
}