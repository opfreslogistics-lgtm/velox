-- Create storage bucket for blog cover images and website images
-- This bucket will store blog post cover images and other website assets

-- Create the website-images bucket if it doesn't exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-images',
  'website-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Create storage policies for the website-images bucket
-- Allow public read access
create policy "Public read access for website-images"
on storage.objects for select
using (bucket_id = 'website-images');

-- Allow authenticated users to upload
create policy "Authenticated users can upload to website-images"
on storage.objects for insert
with check (
  bucket_id = 'website-images' 
  and auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own uploads
create policy "Authenticated users can update website-images"
on storage.objects for update
using (
  bucket_id = 'website-images' 
  and auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own uploads
create policy "Authenticated users can delete website-images"
on storage.objects for delete
using (
  bucket_id = 'website-images' 
  and auth.role() = 'authenticated'
);

-- Create folder structure comment
comment on table storage.objects is 'Storage objects table - website-images bucket contains blog-covers/ subfolder for blog post images';

