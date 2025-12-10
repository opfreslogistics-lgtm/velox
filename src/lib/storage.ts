import { supabase } from './supabaseClient';

/**
 * Upload an image file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name (default: 'website-images')
 * @param folder - Optional folder path within the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadImageToStorage(
  file: File,
  bucket: string = 'website-images',
  folder?: string
): Promise<string> {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
}

/**
 * Delete an image from Supabase Storage
 * @param filePath - The path to the file in storage
 * @param bucket - The storage bucket name (default: 'website-images')
 */
export async function deleteImageFromStorage(
  filePath: string,
  bucket: string = 'website-images'
): Promise<void> {
  try {
    // Extract the path from full URL if needed
    const path = filePath.includes('/storage/v1/object/public/') 
      ? filePath.split('/storage/v1/object/public/')[1]?.split('/').slice(1).join('/')
      : filePath;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error('Error deleting image:', error);
    throw new Error(error.message || 'Failed to delete image');
  }
}

